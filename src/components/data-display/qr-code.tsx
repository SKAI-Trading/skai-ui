"use client";

import * as React from "react";
import { QRCodeSVG, QRCodeCanvas } from "qrcode.react";
import { cn } from "../../lib/utils";
import { Copy, Download, Check } from "lucide-react";
import { Button } from "../core/button";

interface QRCodeProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The value to encode in the QR code */
  value: string;
  /** Size of the QR code in pixels */
  size?: number;
  /** Error correction level */
  level?: "L" | "M" | "Q" | "H";
  /** Include margin */
  includeMargin?: boolean;
  /** Background color */
  bgColor?: string;
  /** Foreground color */
  fgColor?: string;
  /** Render as SVG or Canvas */
  renderAs?: "svg" | "canvas";
  /** Image to display in center */
  imageSettings?: {
    src: string;
    height: number;
    width: number;
    excavate: boolean;
  };
  /** Show copy button */
  showCopy?: boolean;
  /** Show download button */
  showDownload?: boolean;
  /** Label/title above QR code */
  label?: string;
  /** Description below QR code */
  description?: string;
  /** Custom border style */
  bordered?: boolean;
}

const QRCode = React.forwardRef<HTMLDivElement, QRCodeProps>(
  (
    {
      value,
      size = 160,
      level = "M",
      includeMargin = true,
      bgColor = "#ffffff",
      fgColor = "#000000",
      renderAs = "svg",
      imageSettings,
      showCopy = false,
      showDownload = false,
      label,
      description,
      bordered = true,
      className,
      ...props
    },
    ref,
  ) => {
    const [copied, setCopied] = React.useState(false);
    const canvasRef = React.useRef<HTMLCanvasElement>(null);

    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    };

    const handleDownload = () => {
      // For canvas, we can directly get the data URL
      if (renderAs === "canvas" && canvasRef.current) {
        const dataUrl = canvasRef.current.toDataURL("image/png");
        const link = document.createElement("a");
        link.download = "qrcode.png";
        link.href = dataUrl;
        link.click();
        return;
      }

      // For SVG, we need to convert it to an image
      const svg = document.querySelector(`[data-qr-value="${value}"]`);
      if (!svg) return;

      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");

      const img = new Image();
      img.onload = () => {
        ctx?.drawImage(img, 0, 0);
        const dataUrl = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.download = "qrcode.png";
        link.href = dataUrl;
        link.click();
      };
      img.src = "data:image/svg+xml;base64," + btoa(svgData);
    };

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex flex-col items-center gap-3",
          bordered && "p-4 rounded-lg border bg-card",
          className,
        )}
        {...props}
      >
        {label && (
          <span className="text-sm font-medium text-foreground">{label}</span>
        )}

        <div className="relative bg-white p-2 rounded-lg">
          {renderAs === "svg" ? (
            <QRCodeSVG
              value={value}
              size={size}
              level={level}
              includeMargin={includeMargin}
              bgColor={bgColor}
              fgColor={fgColor}
              imageSettings={imageSettings}
              data-qr-value={value}
            />
          ) : (
            <QRCodeCanvas
              ref={canvasRef}
              value={value}
              size={size}
              level={level}
              includeMargin={includeMargin}
              bgColor={bgColor}
              fgColor={fgColor}
              imageSettings={imageSettings}
              data-qr-value={value}
            />
          )}
        </div>

        {description && (
          <span className="text-xs text-muted-foreground text-center max-w-[200px]">
            {description}
          </span>
        )}

        {(showCopy || showDownload) && (
          <div className="flex gap-2">
            {showCopy && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="gap-2"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-green-500" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
            )}
            {showDownload && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
            )}
          </div>
        )}
      </div>
    );
  },
);

QRCode.displayName = "QRCode";

// Specialized component for wallet addresses
interface WalletQRCodeProps extends Omit<
  QRCodeProps,
  "value" | "label" | "description"
> {
  /** Wallet address */
  address: string;
  /** Chain name for label */
  chainName?: string;
  /** Show shortened address */
  showAddress?: boolean;
}

const WalletQRCode = React.forwardRef<HTMLDivElement, WalletQRCodeProps>(
  ({ address, chainName, showAddress = true, ...props }, ref) => {
    const shortenedAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;

    return (
      <QRCode
        ref={ref}
        value={address}
        label={chainName ? `${chainName} Address` : "Wallet Address"}
        description={showAddress ? shortenedAddress : undefined}
        showCopy
        {...props}
      />
    );
  },
);

WalletQRCode.displayName = "WalletQRCode";

export { QRCode, WalletQRCode };
export type { QRCodeProps, WalletQRCodeProps };
