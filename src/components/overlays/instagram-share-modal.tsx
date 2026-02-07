/**
 * InstagramShareModal - Modal for sharing to Instagram with pre-made images
 *
 * Features:
 * - Toggle between Post (1:1) and Story (4:3) formats
 * - Image picker with thumbnails
 * - Direct share via Web Share API (opens Instagram on mobile)
 * - Fallback download option for desktop
 * - Copies referral link to clipboard
 * - SKAI branding
 */

import * as React from "react";
import { cn } from "../../lib/utils";

// =============================================================================
// TYPES
// =============================================================================

export interface InstagramShareImage {
  /** Display label */
  label: string;
  /** URL for the 1:1 post version */
  postSrc: string;
  /** URL for the 4:3 story version */
  storySrc: string;
}

export interface InstagramShareModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback when modal closes */
  onClose: () => void;
  /** Available share images */
  images: InstagramShareImage[];
  /** Referral link to copy */
  referralLink: string;
  /** Custom class name */
  className?: string;
}

// =============================================================================
// ICONS
// =============================================================================

const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M2 2L14 14M14 2L2 14" />
  </svg>
);

const DownloadIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const ShareIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);

// =============================================================================
// COMPONENT
// =============================================================================

const InstagramShareModal = React.forwardRef<
  HTMLDivElement,
  InstagramShareModalProps
>(({ isOpen, onClose, images, referralLink, className }, ref) => {
  const [format, setFormat] = React.useState<"post" | "story">("post");
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [status, setStatus] = React.useState<"idle" | "sharing" | "shared" | "downloaded">("idle");

  // Reset state when opening
  React.useEffect(() => {
    if (isOpen) {
      setFormat("post");
      setSelectedIndex(0);
      setStatus("idle");
    }
  }, [isOpen]);

  if (!isOpen || images.length === 0) return null;

  const selectedImage = images[selectedIndex];
  const currentSrc = format === "post" ? selectedImage.postSrc : selectedImage.storySrc;
  const fileName = `skai-${format}-${selectedImage.label.toLowerCase().replace(/\s+/g, "-")}.jpg`;

  // Fetch image as a File object
  const fetchImageFile = async (): Promise<File> => {
    const response = await fetch(currentSrc);
    const blob = await response.blob();
    return new File([blob], fileName, { type: blob.type || "image/jpeg" });
  };

  // Copy referral link to clipboard
  const copyReferralLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
    } catch (err) {
      console.error("Failed to copy referral link:", err);
    }
  };

  // Primary: Share via Web Share API (opens Instagram on mobile)
  const handleShare = async () => {
    setStatus("sharing");
    try {
      const file = await fetchImageFile();

      // Check if Web Share API supports file sharing
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "Share on Instagram",
          text: `Join Skai — ${referralLink}`,
        });
        await copyReferralLink();
        setStatus("shared");
        setTimeout(() => setStatus("idle"), 3000);
        return;
      }

      // Fallback: download the image
      await handleDownload();
    } catch (err: unknown) {
      // User cancelled the share sheet — not an error
      if (err instanceof Error && err.name === "AbortError") {
        setStatus("idle");
        return;
      }
      // Other error — fall back to download
      await handleDownload();
    }
  };

  // Secondary: Download image + copy link
  const handleDownload = async () => {
    try {
      const file = await fetchImageFile();
      const url = URL.createObjectURL(file);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      window.open(currentSrc, "_blank");
    }

    await copyReferralLink();
    setStatus("downloaded");
    setTimeout(() => setStatus("idle"), 3000);
  };

  return (
    <div
      className={cn(
        "fixed inset-0 z-[9999] flex items-center justify-center p-4",
        className,
      )}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        ref={ref}
        className="relative w-full max-w-[480px] rounded-2xl bg-[#001615] border border-[#123F3C] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3">
          <h2 className="font-manrope text-[18px] leading-[24px] tracking-[-0.72px] text-white">
            Share to Instagram
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
          >
            <CloseIcon className="w-4 h-4 text-white/60" />
          </button>
        </div>

        {/* Format Toggle */}
        <div className="px-6 pb-4">
          <div className="flex gap-2 p-1 rounded-lg bg-[#0a1a19] border border-[#123F3C]">
            <button
              onClick={() => setFormat("post")}
              className={cn(
                "flex-1 py-2 rounded-md font-manrope text-[13px] leading-[16px] tracking-[-0.52px] transition-all",
                format === "post"
                  ? "bg-[#56C7F3] text-[#001615]"
                  : "text-white/60 hover:text-white",
              )}
            >
              Post
            </button>
            <button
              onClick={() => setFormat("story")}
              className={cn(
                "flex-1 py-2 rounded-md font-manrope text-[13px] leading-[16px] tracking-[-0.52px] transition-all",
                format === "story"
                  ? "bg-[#56C7F3] text-[#001615]"
                  : "text-white/60 hover:text-white",
              )}
            >
              Story
            </button>
          </div>
        </div>

        {/* Preview */}
        <div className="px-6 pb-4">
          <div
            className={cn(
              "relative w-full overflow-hidden rounded-xl bg-[#0a1a19] border border-[#123F3C]",
              format === "post" ? "aspect-square" : "aspect-[3/4]",
            )}
          >
            <img
              src={currentSrc}
              alt={selectedImage.label}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Image Picker Thumbnails */}
        {images.length > 1 && (
          <div className="px-6 pb-4">
            <div className="flex gap-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedIndex(idx)}
                  className={cn(
                    "relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all",
                    idx === selectedIndex
                      ? "border-[#56C7F3]"
                      : "border-[#123F3C] hover:border-white/30",
                  )}
                >
                  <img
                    src={format === "post" ? img.postSrc : img.storySrc}
                    alt={img.label}
                    className="w-full h-full object-cover"
                  />
                  {idx === selectedIndex && (
                    <div className="absolute inset-0 bg-[#56C7F3]/20 flex items-center justify-center">
                      <CheckIcon className="w-5 h-5 text-[#56C7F3]" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="px-6 pb-6">
          {/* Primary: Share */}
          <button
            onClick={handleShare}
            disabled={status === "sharing"}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#56C7F3] hover:bg-[#6dd4ff] disabled:opacity-70 text-[#001615] font-manrope text-[14px] leading-[18px] tracking-[-0.56px] font-medium transition-colors"
          >
            {status === "sharing" ? (
              "Preparing..."
            ) : status === "shared" ? (
              <>
                <CheckIcon className="w-5 h-5" />
                Shared! Link copied
              </>
            ) : (
              <>
                <ShareIcon className="w-5 h-5" />
                Share to Instagram
              </>
            )}
          </button>

          {/* Secondary: Download */}
          <button
            onClick={handleDownload}
            className="w-full flex items-center justify-center gap-2 mt-2 py-2.5 rounded-xl border border-[#123F3C] hover:border-white/20 text-white/60 hover:text-white font-manrope text-[13px] leading-[16px] tracking-[-0.52px] transition-colors"
          >
            {status === "downloaded" ? (
              <>
                <CheckIcon className="w-4 h-4" />
                Downloaded! Link copied
              </>
            ) : (
              <>
                <DownloadIcon className="w-4 h-4" />
                Download image instead
              </>
            )}
          </button>

          <p className="mt-2 text-center font-manrope text-[11px] leading-[14px] text-white/40">
            Your referral link is copied to clipboard automatically
          </p>
        </div>
      </div>
    </div>
  );
});
InstagramShareModal.displayName = "InstagramShareModal";

export { InstagramShareModal };
