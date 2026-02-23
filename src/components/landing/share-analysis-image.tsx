// --- Share Analysis Image Generator ---
// Generates a branded OG-sized (1200x630) share image from chart analysis data.
// Pure Canvas API -- no external dependencies.

/** Parameters for generating a share image. */
export interface ShareImageParams {
  /** Base64-encoded chart image source */
  chartImageSrc: string;
  analysis: {
    bias: string;
    confidence: number;
    summary: string;
    patterns: string[];
    keyLevels: Array<{ type: string; price?: string }>;
    detectedSymbol?: string;
    detectedTimeframe?: string;
  };
  username: string;
}

// ---- Constants ----

const WIDTH = 1200;
const HEIGHT = 630;

const BG_COLOR = "#0A1F1E";
const GRADIENT_TOP = "#123F3C";
const GRADIENT_BOTTOM = "#0A1F1E";

const ACCENT_BLUE = "#56C7F3";
const ACCENT_GREEN = "#2DEDAD";
const TEXT_PRIMARY = "#E0E0E0";
const TEXT_MUTED = "#95A09F";
const BIAS_GREEN = "#2DEDAD";
const BIAS_RED = "#FF6B6B";
const BIAS_NEUTRAL = "#95A09F";

const FONT_FAMILY = "Manrope, sans-serif";

const CHART_AREA_RATIO = 0.6;
const PADDING = 24;

// ---- Helpers ----

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load chart image"));
    img.src = src;
  });
}

function getBiasArrow(bias: string): string {
  const lower = bias.toLowerCase();
  if (lower === "bullish" || lower === "long") return "\u25B2";
  if (lower === "bearish" || lower === "short") return "\u25BC";
  return "\u25C6";
}

function getBiasColor(bias: string): string {
  const lower = bias.toLowerCase();
  if (lower === "bullish" || lower === "long") return BIAS_GREEN;
  if (lower === "bearish" || lower === "short") return BIAS_RED;
  return BIAS_NEUTRAL;
}

/** Wrap text to fit within maxWidth, returning an array of lines (up to maxLines). */
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines: number,
): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
      if (lines.length >= maxLines) break;
    } else {
      currentLine = testLine;
    }
  }

  if (currentLine && lines.length < maxLines) {
    lines.push(currentLine);
  }

  // Add ellipsis to last line if we truncated
  if (lines.length === maxLines) {
    const remaining = words.slice(
      lines.join(" ").split(" ").length,
    );
    if (remaining.length > 0) {
      let lastLine = lines[maxLines - 1];
      // Trim last line to fit with ellipsis
      while (ctx.measureText(lastLine + "\u2026").width > maxWidth && lastLine.length > 0) {
        lastLine = lastLine.slice(0, -1).trimEnd();
      }
      lines[maxLines - 1] = lastLine + "\u2026";
    }
  }

  return lines;
}

// ---- Main generator ----

/**
 * Generate a branded share image (1200x630 PNG) from chart analysis data.
 *
 * Uses only the standard Canvas API -- works in any modern browser.
 */
export async function generateShareImage(params: ShareImageParams): Promise<Blob> {
  const { chartImageSrc, analysis, username } = params;

  const canvas = document.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable");

  // ---- 1. Background ----
  ctx.fillStyle = BG_COLOR;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // ---- 2. Gradient overlay ----
  const gradient = ctx.createLinearGradient(0, 0, 0, HEIGHT);
  gradient.addColorStop(0, GRADIENT_TOP);
  gradient.addColorStop(1, GRADIENT_BOTTOM);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // ---- 3. Chart image (left 60%) ----
  const chartAreaW = WIDTH * CHART_AREA_RATIO;
  try {
    const chartImg = await loadImage(chartImageSrc);

    const availW = chartAreaW - PADDING * 2;
    const availH = HEIGHT - PADDING * 2;

    // Scale to fit while maintaining aspect ratio
    const imgAspect = chartImg.width / chartImg.height;
    const areaAspect = availW / availH;

    let drawW: number;
    let drawH: number;
    if (imgAspect > areaAspect) {
      drawW = availW;
      drawH = availW / imgAspect;
    } else {
      drawH = availH;
      drawW = availH * imgAspect;
    }

    const drawX = PADDING + (availW - drawW) / 2;
    const drawY = PADDING + (availH - drawH) / 2;

    // Rounded clip for the chart
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(drawX, drawY, drawW, drawH, 8);
    ctx.clip();
    ctx.drawImage(chartImg, drawX, drawY, drawW, drawH);
    ctx.restore();

    // Subtle border around chart
    ctx.strokeStyle = "rgba(86, 199, 243, 0.25)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(drawX, drawY, drawW, drawH, 8);
    ctx.stroke();
  } catch {
    // If image fails to load, draw placeholder
    ctx.fillStyle = "rgba(255,255,255,0.05)";
    ctx.fillRect(PADDING, PADDING, chartAreaW - PADDING * 2, HEIGHT - PADDING * 2);
    ctx.fillStyle = TEXT_MUTED;
    ctx.font = `14px ${FONT_FAMILY}`;
    ctx.fillText("Chart unavailable", PADDING + 20, HEIGHT / 2);
  }

  // ---- 4. Analysis info (right 40%) ----
  const infoX = chartAreaW + PADDING;
  const infoW = WIDTH - chartAreaW - PADDING * 2;
  let cursorY = PADDING + 8;

  // Symbol badge
  if (analysis.detectedSymbol) {
    const symbolText = analysis.detectedTimeframe
      ? `${analysis.detectedSymbol} \u00B7 ${analysis.detectedTimeframe}`
      : analysis.detectedSymbol;

    ctx.font = `bold 20px ${FONT_FAMILY}`;
    ctx.fillStyle = ACCENT_BLUE;
    ctx.fillText(symbolText, infoX, cursorY + 20);
    cursorY += 38;
  }

  // Bias with arrow
  const biasColor = getBiasColor(analysis.bias);
  const biasArrow = getBiasArrow(analysis.bias);
  ctx.font = `bold 24px ${FONT_FAMILY}`;
  ctx.fillStyle = biasColor;
  const biasLabel = `${biasArrow} ${analysis.bias.toUpperCase()}`;
  ctx.fillText(biasLabel, infoX, cursorY + 24);
  cursorY += 40;

  // Confidence
  ctx.font = `14px ${FONT_FAMILY}`;
  ctx.fillStyle = TEXT_MUTED;
  ctx.fillText(`${Math.round(analysis.confidence)}% confidence`, infoX, cursorY + 14);
  cursorY += 30;

  // Divider
  ctx.strokeStyle = "rgba(86, 199, 243, 0.15)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(infoX, cursorY);
  ctx.lineTo(infoX + infoW, cursorY);
  ctx.stroke();
  cursorY += 16;

  // Summary text (max 3 lines)
  ctx.font = `16px ${FONT_FAMILY}`;
  ctx.fillStyle = TEXT_PRIMARY;
  const summaryLines = wrapText(ctx, analysis.summary, infoW, 3);
  for (const line of summaryLines) {
    ctx.fillText(line, infoX, cursorY + 16);
    cursorY += 22;
  }
  cursorY += 12;

  // Key levels
  const supports = analysis.keyLevels.filter(
    (l) => l.type.toLowerCase() === "support" && l.price,
  );
  const resistances = analysis.keyLevels.filter(
    (l) => l.type.toLowerCase() === "resistance" && l.price,
  );

  if (supports.length > 0 || resistances.length > 0) {
    ctx.font = `14px ${FONT_FAMILY}`;
    const parts: string[] = [];
    if (supports.length > 0) {
      parts.push(`S: ${supports.map((l) => l.price).join(", ")}`);
    }
    if (resistances.length > 0) {
      parts.push(`R: ${resistances.map((l) => l.price).join(", ")}`);
    }
    const levelsText = parts.join(" \u00B7 ");

    // Truncate if too wide
    let displayText = levelsText;
    if (ctx.measureText(displayText).width > infoW) {
      while (ctx.measureText(displayText + "\u2026").width > infoW && displayText.length > 0) {
        displayText = displayText.slice(0, -1).trimEnd();
      }
      displayText += "\u2026";
    }

    ctx.fillStyle = TEXT_MUTED;
    ctx.fillText(displayText, infoX, cursorY + 14);
    cursorY += 28;
  }

  // Patterns
  if (analysis.patterns.length > 0) {
    ctx.font = `14px ${FONT_FAMILY}`;
    ctx.fillStyle = ACCENT_GREEN;

    const patternsText = analysis.patterns.join(" \u00B7 ");
    const patternLines = wrapText(ctx, patternsText, infoW, 2);
    for (const line of patternLines) {
      ctx.fillText(line, infoX, cursorY + 14);
      cursorY += 20;
    }
  }

  // ---- 5. SKAI branding (bottom-right) ----
  const brandingX = WIDTH - PADDING;
  const brandingY = HEIGHT - PADDING;

  ctx.textAlign = "right";
  ctx.font = `12px ${FONT_FAMILY}`;
  ctx.fillStyle = TEXT_MUTED;
  ctx.fillText("Powered by SKAI Chart AI", brandingX, brandingY - 20);

  ctx.font = `bold 14px ${FONT_FAMILY}`;
  ctx.fillStyle = ACCENT_BLUE;
  ctx.fillText("skai.trade", brandingX, brandingY);
  ctx.textAlign = "left";

  // ---- 6. Username attribution (bottom-left) ----
  ctx.font = `12px ${FONT_FAMILY}`;
  ctx.fillStyle = TEXT_MUTED;
  ctx.fillText(`Analysis by @${username}`, PADDING, HEIGHT - PADDING);

  // ---- 7. Border ----
  ctx.strokeStyle = ACCENT_BLUE;
  ctx.lineWidth = 1;
  ctx.strokeRect(0.5, 0.5, WIDTH - 1, HEIGHT - 1);

  // ---- Convert to Blob ----
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Canvas toBlob returned null"));
      },
      "image/png",
    );
  });
}

// ---- Download helper ----

/** Trigger a browser download of the share image blob. */
export function downloadShareImage(blob: Blob, filename?: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename ?? "skai-analysis.png";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ---- Clipboard helper ----

/** Copy the share image to the system clipboard. Returns true on success. */
export async function shareToClipboard(blob: Blob): Promise<boolean> {
  try {
    await navigator.clipboard.write([
      new ClipboardItem({ [blob.type]: blob }),
    ]);
    return true;
  } catch {
    return false;
  }
}
