# Create AWS Infrastructure for Storybook
# Creates S3 bucket, CloudFront distribution, and Route53 records

param(
    [switch]$DryRun
)

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "╔═══════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║    SKAI Storybook Infrastructure Setup                    ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Configuration (from copilot-instructions.md)
$AWS_ACCOUNT = "732132791265"
$HOSTED_ZONE_ID = "Z06749972Q1Q0FGQW1IID"
$ACM_CERT_ARN = "arn:aws:acm:us-east-1:732132791265:certificate/c853555f-c038-4ad3-957a-d2744bc732d3"
$S3_BUCKET = "skai-storybook"
$DOMAIN = "storybook.skai.trade"
$REGION = "us-east-1"

if ($DryRun) {
    Write-Host "🔍 DRY RUN MODE - No changes will be made" -ForegroundColor Yellow
    Write-Host ""
}

# Step 1: Verify AWS credentials
Write-Host "1️⃣ Verifying AWS credentials..." -ForegroundColor Yellow
try {
    $identity = aws sts get-caller-identity --output json 2>&1 | ConvertFrom-Json
    Write-Host "   ✓ Account: $($identity.Account)" -ForegroundColor Green
    
    if ($identity.Account -ne $AWS_ACCOUNT) {
        Write-Host "   ⚠ Warning: Expected account $AWS_ACCOUNT, got $($identity.Account)" -ForegroundColor Yellow
    }
}
catch {
    Write-Host "   ✗ AWS credentials not configured" -ForegroundColor Red
    exit 1
}

# Step 2: Create S3 Bucket
Write-Host "2️⃣ Creating S3 bucket: $S3_BUCKET..." -ForegroundColor Yellow

$bucketExists = aws s3api head-bucket --bucket $S3_BUCKET 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✓ Bucket already exists" -ForegroundColor Green
} else {
    if (-not $DryRun) {
        # Create bucket
        aws s3api create-bucket --bucket $S3_BUCKET --region $REGION | Out-Null
        
        # Enable static website hosting
        aws s3 website "s3://$S3_BUCKET" --index-document index.html --error-document index.html
        
        # Block public access (CloudFront will handle access)
        aws s3api put-public-access-block --bucket $S3_BUCKET --public-access-block-configuration "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=false,RestrictPublicBuckets=false"
        
        Write-Host "   ✓ Bucket created" -ForegroundColor Green
    } else {
        Write-Host "   Would create bucket: $S3_BUCKET" -ForegroundColor Gray
    }
}

# Step 3: Create CloudFront Origin Access Control
Write-Host "3️⃣ Creating CloudFront Origin Access Control..." -ForegroundColor Yellow

$oacName = "skai-storybook-oac"
$existingOac = aws cloudfront list-origin-access-controls --query "OriginAccessControlList.Items[?Name=='$oacName'].Id" --output text 2>&1

if ($existingOac -and $existingOac -ne "" -and $existingOac -ne "None") {
    $oacId = $existingOac
    Write-Host "   ✓ OAC already exists: $oacId" -ForegroundColor Green
} else {
    if (-not $DryRun) {
        $oacConfig = @{
            Name = $oacName
            Description = "OAC for SKAI Storybook"
            SigningProtocol = "sigv4"
            SigningBehavior = "always"
            OriginAccessControlOriginType = "s3"
        } | ConvertTo-Json -Compress
        
        $tempFile = [System.IO.Path]::GetTempFileName()
        $oacConfig | Out-File -FilePath $tempFile -Encoding utf8 -NoNewline
        $oacResult = aws cloudfront create-origin-access-control --origin-access-control-config "file://$tempFile" --output json | ConvertFrom-Json
        Remove-Item $tempFile -Force
        $oacId = $oacResult.OriginAccessControl.Id
        Write-Host "   ✓ OAC created: $oacId" -ForegroundColor Green
    } else {
        $oacId = "DRY-RUN-OAC-ID"
        Write-Host "   Would create OAC: $oacName" -ForegroundColor Gray
    }
}

# Step 4: Create CloudFront Distribution
Write-Host "4️⃣ Creating CloudFront distribution..." -ForegroundColor Yellow

# Check if distribution already exists for this domain
$existingDist = aws cloudfront list-distributions --query "DistributionList.Items[?Aliases.Items[0]=='$DOMAIN'].Id" --output text 2>&1

if ($existingDist -and $existingDist -ne "" -and $existingDist -ne "None") {
    Write-Host "   ✓ Distribution already exists: $existingDist" -ForegroundColor Green
    $distributionId = $existingDist
} else {
    $distConfig = @{
        CallerReference = "skai-storybook-$(Get-Date -Format 'yyyyMMddHHmmss')"
        Comment = "SKAI Design System Storybook"
        Enabled = $true
        DefaultRootObject = "index.html"
        Aliases = @{
            Quantity = 1
            Items = @($DOMAIN)
        }
        Origins = @{
            Quantity = 1
            Items = @(
                @{
                    Id = "S3-$S3_BUCKET"
                    DomainName = "$S3_BUCKET.s3.$REGION.amazonaws.com"
                    OriginAccessControlId = $oacId
                    S3OriginConfig = @{
                        OriginAccessIdentity = ""
                    }
                }
            )
        }
        DefaultCacheBehavior = @{
            TargetOriginId = "S3-$S3_BUCKET"
            ViewerProtocolPolicy = "redirect-to-https"
            AllowedMethods = @{
                Quantity = 2
                Items = @("GET", "HEAD")
                CachedMethods = @{
                    Quantity = 2
                    Items = @("GET", "HEAD")
                }
            }
            CachePolicyId = "658327ea-f89d-4fab-a63d-7e88639e58f6"  # CachingOptimized
            Compress = $true
        }
        CustomErrorResponses = @{
            Quantity = 1
            Items = @(
                @{
                    ErrorCode = 403
                    ResponseCode = "200"
                    ResponsePagePath = "/index.html"
                    ErrorCachingMinTTL = 10
                }
            )
        }
        ViewerCertificate = @{
            ACMCertificateArn = $ACM_CERT_ARN
            SSLSupportMethod = "sni-only"
            MinimumProtocolVersion = "TLSv1.2_2021"
        }
        HttpVersion = "http2and3"
        PriceClass = "PriceClass_100"
    }
    
    if (-not $DryRun) {
        $distConfigJson = $distConfig | ConvertTo-Json -Depth 10 -Compress
        $tempFile = [System.IO.Path]::GetTempFileName()
        $distConfigJson | Out-File -FilePath $tempFile -Encoding utf8 -NoNewline
        $createResult = aws cloudfront create-distribution --distribution-config "file://$tempFile" --output json | ConvertFrom-Json
        Remove-Item $tempFile -Force
        $distributionId = $createResult.Distribution.Id
        $distributionDomain = $createResult.Distribution.DomainName
        Write-Host "   ✓ Distribution created: $distributionId" -ForegroundColor Green
        Write-Host "   CloudFront domain: $distributionDomain" -ForegroundColor Gray
    } else {
        $distributionId = "DRY-RUN-DIST-ID"
        Write-Host "   Would create distribution for: $DOMAIN" -ForegroundColor Gray
    }
}

# Step 5: Update S3 Bucket Policy for CloudFront
Write-Host "5️⃣ Updating S3 bucket policy..." -ForegroundColor Yellow

if (-not $DryRun) {
    $bucketPolicy = @{
        Version = "2012-10-17"
        Statement = @(
            @{
                Sid = "AllowCloudFrontServicePrincipal"
                Effect = "Allow"
                Principal = @{
                    Service = "cloudfront.amazonaws.com"
                }
                Action = "s3:GetObject"
                Resource = "arn:aws:s3:::$S3_BUCKET/*"
                Condition = @{
                    StringEquals = @{
                        "AWS:SourceArn" = "arn:aws:cloudfront::$($AWS_ACCOUNT):distribution/$distributionId"
                    }
                }
            }
        )
    } | ConvertTo-Json -Depth 10 -Compress
    
    $tempFile = [System.IO.Path]::GetTempFileName()
    $bucketPolicy | Out-File -FilePath $tempFile -Encoding utf8 -NoNewline
    aws s3api put-bucket-policy --bucket $S3_BUCKET --policy "file://$tempFile" | Out-Null
    Remove-Item $tempFile -Force
    Write-Host "   ✓ Bucket policy updated" -ForegroundColor Green
} else {
    Write-Host "   Would update bucket policy for CloudFront access" -ForegroundColor Gray
}

# Step 6: Create Route53 Record
Write-Host "6️⃣ Creating Route53 DNS record..." -ForegroundColor Yellow

# Get CloudFront domain name
if (-not $DryRun -and $distributionId -ne "DRY-RUN-DIST-ID") {
    $distInfo = aws cloudfront get-distribution --id $distributionId --output json | ConvertFrom-Json
    $cfDomain = $distInfo.Distribution.DomainName
    
    $changeSet = @{
        Changes = @(
            @{
                Action = "UPSERT"
                ResourceRecordSet = @{
                    Name = $DOMAIN
                    Type = "A"
                    AliasTarget = @{
                        HostedZoneId = "Z2FDTNDATAQYW2"  # CloudFront hosted zone ID (always this value)
                        DNSName = $cfDomain
                        EvaluateTargetHealth = $false
                    }
                }
            }
        )
    } | ConvertTo-Json -Depth 10 -Compress
    
    $tempFile = [System.IO.Path]::GetTempFileName()
    $changeSet | Out-File -FilePath $tempFile -Encoding utf8 -NoNewline
    aws route53 change-resource-record-sets --hosted-zone-id $HOSTED_ZONE_ID --change-batch "file://$tempFile" | Out-Null
    Remove-Item $tempFile -Force
    Write-Host "   ✓ DNS record created/updated" -ForegroundColor Green
} else {
    Write-Host "   Would create A record: $DOMAIN -> CloudFront" -ForegroundColor Gray
}

# Summary
Write-Host ""
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "✅ Infrastructure setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "   S3 Bucket:     $S3_BUCKET" -ForegroundColor Cyan
Write-Host "   CloudFront:    $distributionId" -ForegroundColor Cyan
Write-Host "   Domain:        https://$DOMAIN" -ForegroundColor Cyan
Write-Host ""
Write-Host "   Next steps:" -ForegroundColor Yellow
Write-Host "   1. Update deploy-storybook.ps1 with CloudFront ID: $distributionId" -ForegroundColor Gray
Write-Host "   2. Run: .\scripts\deploy-storybook.ps1" -ForegroundColor Gray
Write-Host "   3. Wait 2-3 minutes for DNS propagation" -ForegroundColor Gray
Write-Host ""
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Green
