// Overlay Components
export * from "./dialog";
export * from "./sheet";
export * from "./dropdown-menu";
export * from "./context-menu";
export * from "./popover";
export * from "./hover-card";
export * from "./command";
export * from "./confirm-dialog";

// Interactive Overlays
export * from "./emoji-picker";
export * from "./spotlight-overlay";
export * from "./spectator-overlay";

// Landing Page Modals
export * from "./waitlist-modal";
export * from "./wallet-choice-modal";
export * from "./email-verification-modal";
// App sign-in (Figma 2086:29529) — the step BEFORE email-verification-modal.
export * from "./email-auth-modal";
export * from "./auth-provider-icons";
export * from "./instagram-share-modal";
export * from "./x-share-modal";

// Scrim + centred panel for hand-rolled overlays: owns backdrop-click and
// Escape dismissal so each caller cannot forget them (bug 232862b0).
export * from "./ModalScrim";
