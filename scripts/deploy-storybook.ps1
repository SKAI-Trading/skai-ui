# Deploy Storybook to storybook.skai.trade
# Includes authentication wrapper

param(
    [switch]$SkipBuild,
    [switch]$LocalTest
)

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "╔═══════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║         SKAI-UI Storybook Deployment                      ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Configuration
$S3_BUCKET = "skai-storybook"
$CLOUDFRONT_ID = "ET8L6FJV9D86M"
$REGION = "us-east-1"
$STORYBOOK_URL = "https://storybook.skai.trade"

# Paths
$SCRIPT_DIR = Split-Path -Parent $MyInvocation.MyCommand.Path
$SKAI_UI_DIR = Split-Path -Parent $SCRIPT_DIR
$AUTH_DIR = Join-Path $SKAI_UI_DIR "storybook-auth"
$STORYBOOK_DIR = Join-Path $SKAI_UI_DIR "storybook-static"
$DEPLOY_DIR = Join-Path $SKAI_UI_DIR "storybook-deploy"

# Step 1: Build Storybook (unless skipped)
if (-not $SkipBuild) {
    Write-Host "📦 Building Storybook..." -ForegroundColor Yellow
    Push-Location $SKAI_UI_DIR
    try {
        npm run build:storybook 2>&1 | Out-Null
        if ($LASTEXITCODE -ne 0) {
            throw "Storybook build failed"
        }
        Write-Host "   ✓ Storybook built successfully" -ForegroundColor Green
    }
    finally {
        Pop-Location
    }
} else {
    Write-Host "⏭️  Skipping Storybook build" -ForegroundColor Yellow
}

# Step 2: Prepare deployment directory
Write-Host "📁 Preparing deployment directory..." -ForegroundColor Yellow
if (Test-Path $DEPLOY_DIR) {
    Remove-Item -Recurse -Force $DEPLOY_DIR
}
New-Item -ItemType Directory -Path $DEPLOY_DIR | Out-Null
New-Item -ItemType Directory -Path (Join-Path $DEPLOY_DIR "sb") | Out-Null

# Step 3: Copy auth wrapper to root
Write-Host "   Copying auth wrapper..." -ForegroundColor Gray
Copy-Item -Path (Join-Path $AUTH_DIR "index.html") -Destination $DEPLOY_DIR

# Step 4: Copy Storybook to /sb/ subdirectory
Write-Host "   Copying Storybook files..." -ForegroundColor Gray
Copy-Item -Path (Join-Path $STORYBOOK_DIR "*") -Destination (Join-Path $DEPLOY_DIR "sb") -Recurse

# Step 5: Create favicon
$faviconSvg = @"
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="45" stroke="url(#g)" stroke-width="3" fill="none"/>
  <path d="M30 50 L45 65 L70 35" stroke="url(#g)" stroke-width="4" stroke-linecap="round" fill="none"/>
  <defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" style="stop-color:#56c0f6"/><stop offset="100%" style="stop-color:#2dd4bf"/>
  </linearGradient></defs>
</svg>
"@
$faviconSvg | Out-File -FilePath (Join-Path $DEPLOY_DIR "favicon.svg") -Encoding utf8

Write-Host "   ✓ Deployment directory ready" -ForegroundColor Green

# Step 6: Local test option
if ($LocalTest) {
    Write-Host ""
    Write-Host "🧪 Starting local server for testing..." -ForegroundColor Yellow
    Write-Host "   URL: http://localhost:8080" -ForegroundColor Cyan
    Write-Host "   Press Ctrl+C to stop" -ForegroundColor Gray
    Write-Host ""
    
    Push-Location $DEPLOY_DIR
    try {
        npx serve -p 8080
    }
    finally {
        Pop-Location
    }
    exit 0
}

# Step 7: Check AWS credentials
Write-Host "🔐 Checking AWS credentials..." -ForegroundColor Yellow
try {
    $identity = aws sts get-caller-identity --output json 2>&1 | ConvertFrom-Json
    Write-Host "   ✓ Authenticated as: $($identity.Arn)" -ForegroundColor Green
}
catch {
    Write-Host "   ✗ AWS credentials not configured" -ForegroundColor Red
    Write-Host "   Run: aws configure" -ForegroundColor Yellow
    exit 1
}

# Step 8: Check if S3 bucket exists, create if not
Write-Host "🪣 Checking S3 bucket..." -ForegroundColor Yellow
$bucketExists = aws s3api head-bucket --bucket $S3_BUCKET 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "   Creating bucket: $S3_BUCKET" -ForegroundColor Gray
    aws s3api create-bucket --bucket $S3_BUCKET --region $REGION 2>&1 | Out-Null
    
    # Enable static website hosting
    aws s3 website "s3://$S3_BUCKET" --index-document index.html --error-document index.html
    
    # Set bucket policy for CloudFront
    $bucketPolicy = @"
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "AllowCloudFrontAccess",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::$S3_BUCKET/*"
        }
    ]
}
"@
    $bucketPolicy | aws s3api put-bucket-policy --bucket $S3_BUCKET --policy file:///dev/stdin
    
    Write-Host "   ✓ Bucket created and configured" -ForegroundColor Green
} else {
    Write-Host "   ✓ Bucket exists" -ForegroundColor Green
}

# Step 9: Sync to S3
Write-Host "☁️  Syncing to S3..." -ForegroundColor Yellow
aws s3 sync $DEPLOY_DIR "s3://$S3_BUCKET" --delete
if ($LASTEXITCODE -ne 0) {
    Write-Host "   ✗ S3 sync failed" -ForegroundColor Red
    exit 1
}
Write-Host "   ✓ Files uploaded to S3" -ForegroundColor Green

# Step 10: Invalidate CloudFront cache
Write-Host "🔄 Invalidating CloudFront cache..." -ForegroundColor Yellow
try {
    $invalidation = aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_ID --paths "/*" --output json 2>&1 | ConvertFrom-Json
    Write-Host "   ✓ Cache invalidation started: $($invalidation.Invalidation.Id)" -ForegroundColor Green
}
catch {
    Write-Host "   ⚠ CloudFront invalidation failed (may need to create distribution)" -ForegroundColor Yellow
    Write-Host "   Create CloudFront distribution pointing to: $S3_BUCKET.s3-website-$REGION.amazonaws.com" -ForegroundColor Gray
}

# Step 11: Cleanup
Write-Host "🧹 Cleaning up..." -ForegroundColor Yellow
Remove-Item -Recurse -Force $DEPLOY_DIR
Write-Host "   ✓ Temporary files removed" -ForegroundColor Green

# Done
Write-Host ""
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host ""
Write-Host "   URL: $STORYBOOK_URL" -ForegroundColor Cyan
Write-Host "   Auth: Wallet connection required" -ForegroundColor Gray
Write-Host ""
Write-Host "   Note: CloudFront propagation may take 2-3 minutes" -ForegroundColor Gray
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Green
