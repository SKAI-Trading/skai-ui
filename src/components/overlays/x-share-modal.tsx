/**
 * XShareModal - Modal for sharing to X/Twitter with pre-made images
 *
 * Features:
 * - Image picker with thumbnails (post format only, no story)
 * - "Post to X" opens Twitter intent with share text
 * - Download image + copy referral link for manual posting
 * - SKAI branding
 */

import * as React from "react";
import { cn } from "../../lib/utils";

// =============================================================================
// TYPES
// =============================================================================

export interface XShareImage {
  /** Display label */
  label: string;
  /** URL for the post image */
  src: string;
}

export interface XShareModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback when modal closes */
  onClose: () => void;
  /** Available share images */
  images: XShareImage[];
  /** Referral link to copy */
  referralLink: string;
  /** Pre-formatted share text for Twitter intent */
  shareText: string;
  /** Callback to post tweet via API. Receives (text, imageUrl). If not provided, falls back to intent URL. */
  onShare?: (text: string, imageUrl: string) => Promise<{ success: boolean; error?: string }>;
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

const XIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

// =============================================================================
// COMPONENT
// =============================================================================

const XShareModal = React.forwardRef<HTMLDivElement, XShareModalProps>(
  ({ isOpen, onClose, images, referralLink, shareText, onShare, className }, ref) => {
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const [editableText, setEditableText] = React.useState(shareText);
    const [status, setStatus] = React.useState<
      "idle" | "sharing" | "shared" | "downloaded" | "error"
    >("idle");
    const [errorMsg, setErrorMsg] = React.useState("");

    // Reset state when opening
    React.useEffect(() => {
      if (isOpen) {
        setSelectedIndex(0);
        setEditableText(shareText);
        setStatus("idle");
        setErrorMsg("");
      }
    }, [isOpen, shareText]);

    if (!isOpen || images.length === 0) return null;

    const selectedImage = images[selectedIndex];
    const fileName = `skai-post-${selectedImage.label.toLowerCase().replace(/\s+/g, "-")}.jpg`;

    // Fetch image as a File object
    const fetchImageFile = async (): Promise<File> => {
      const response = await fetch(selectedImage.src);
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

    // Primary: Post tweet via API (with image) or fall back to intent URL
    const handleShare = async () => {
      setStatus("sharing");
      setErrorMsg("");

      if (onShare) {
        // Use the API to post directly with the image
        try {
          const imageUrl = window.location.origin + selectedImage.src;
          const result = await onShare(editableText, imageUrl);
          if (result.success) {
            await copyReferralLink();
            setStatus("shared");
            setTimeout(() => setStatus("idle"), 3000);
          } else {
            setErrorMsg(result.error || "Failed to post tweet");
            setStatus("error");
            setTimeout(() => setStatus("idle"), 4000);
          }
        } catch {
          setErrorMsg("Failed to post tweet. Please try again.");
          setStatus("error");
          setTimeout(() => setStatus("idle"), 4000);
        }
      } else {
        // Fallback: open X intent URL immediately (synchronous — avoids popup blocker)
        window.open(
          `https://x.com/intent/post?text=${encodeURIComponent(editableText)}`,
          "_blank",
        );
        await copyReferralLink();
        setStatus("shared");
        setTimeout(() => setStatus("idle"), 3000);
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
      } catch {
        window.open(selectedImage.src, "_blank");
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
              Share to X
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
            >
              <CloseIcon className="w-4 h-4 text-white/60" />
            </button>
          </div>

          {/* Preview */}
          <div className="px-6 pb-4">
            <div className="relative w-full overflow-hidden rounded-xl bg-[#0a1a19] border border-[#123F3C] aspect-square">
              <img
                src={selectedImage.src}
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
                      src={img.src}
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

          {/* Editable Post Text */}
          <div className="px-6 pb-4">
            <label className="block font-manrope text-[12px] leading-[16px] tracking-[-0.48px] text-white/50 mb-2">
              Edit your post
            </label>
            <textarea
              value={editableText}
              onChange={(e) => setEditableText(e.target.value)}
              maxLength={280}
              rows={3}
              className="w-full rounded-xl bg-[#0a1a19] border border-[#123F3C] focus:border-[#56C7F3] outline-none px-4 py-3 font-manrope text-[13px] leading-[18px] tracking-[-0.52px] text-white resize-none transition-colors placeholder:text-white/30"
              placeholder="Write your post..."
            />
            <div className="flex justify-end mt-1">
              <span
                className={cn(
                  "font-manrope text-[11px] leading-[14px]",
                  editableText.length > 260 ? "text-amber-400" : "text-white/30",
                )}
              >
                {editableText.length}/280
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-6 pb-6">
            {/* Primary: Share / Post to X */}
            <button
              onClick={handleShare}
              disabled={status === "sharing"}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#56C7F3] hover:bg-[#6dd4ff] disabled:opacity-70 text-[#001615] font-manrope text-[14px] leading-[18px] tracking-[-0.56px] font-medium transition-colors"
            >
              {status === "sharing" ? (
                "Posting..."
              ) : status === "shared" ? (
                <>
                  <CheckIcon className="w-5 h-5" />
                  Posted! Link copied
                </>
              ) : status === "error" ? (
                <span className="text-red-400">{errorMsg}</span>
              ) : (
                <>
                  <XIcon className="w-4 h-4" />
                  Post to X
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
  },
);
XShareModal.displayName = "XShareModal";

export { XShareModal };

// =============================================================================
// DEFAULT SHARE IMAGES (post format only — reuses Instagram post images)
// =============================================================================

/** Default X/Twitter share images included with skai-ui */
export const DEFAULT_X_IMAGES: XShareImage[] = [
  { label: "Bars", src: "/assets/share/post-bars.jpg" },
  { label: "Laptop", src: "/assets/share/post-laptop.jpg" },
  { label: "Brain", src: "/assets/share/post-brain.jpg" },
];
