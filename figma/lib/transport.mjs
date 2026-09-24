/**
 * transport.mjs — how an extract result gets through use_figma's result cut.
 *
 * use_figma keeps the first 20,480 UTF-8 bytes of a returned value and appends
 * "// truncated to 20kb" (measured 2026-09-24: three cut results were all
 * 20,500 bytes long, at 20,338, 20,455 and 20,500 characters). A frame spec
 * as plain JSON runs about 210 bytes a node, so a 1,645-node trading screen
 * needed 23 results. This file packs the same JSON into a fraction of that.
 *
 * Format "z1", one stream per frame:
 *   text  = canonicalJson(the frame's flat item list)       (canonical.mjs)
 *   bytes = raw DEFLATE (RFC 1951) of the text's UTF-8, primed with ZDICT
 *   sent  = base64 of a byte range of that stream, in lines of LINE chars,
 *           each line with the last 8 hex digits of its FNV-1a 64 beside it
 * The receiving side inflates with node:zlib, which is an implementation
 * independent of the encoder here, and accepts the text only when its FNV-1a
 * 64 equals the checksum Figma computed and it re-serialises to itself. So a
 * decoded frame is byte-for-byte the canonical JSON it was in Figma, and every
 * stored hash is the hash it would have had without compression.
 *
 * zcodec is pasted, as source, into the extract script (pack.mjs), so like
 * canonical.mjs it stands alone: no module-scope names, no multi-line strings,
 * and nothing from the host beyond core ECMAScript. The Plugin API typings
 * declare figma.base64Encode, and no TextEncoder or CompressionStream (a
 * typings file does not list host globals, so neither is relied on either
 * way): the codec writes its own UTF-8, DEFLATE and base64. Uint8Array is in
 * the API's own signatures; the other typed arrays fall back to plain arrays.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import zlib from "node:zlib";
import { canonicalJson, fnv1a64 } from "./canonical.mjs";

export const ENC = "z1";
/** Characters per base64 line; each line carries its own check. */
export const LINE = 2048;

/**
 * The preset dictionary: text the compressor may copy from before the stream
 * starts. It is part of the format, so changing it changes DICT_ID, and a
 * result made with another dictionary is refused rather than misread.
 */
export const ZDICT = [
  "{\"_d\":2,\"b\":[0,0,1,24],\"id\":\"1:2\",\"n\":\"Line 1\",\"s\":[\"Primary/Green Coal 100\"],\"sa\":\"CENTER\",\"sw\":1,\"t\":\"LINE\"}",
  "{\"_d\":2,\"b\":[0,0,24,24],\"id\":\"1:3\",\"n\":\"Group 1\",\"t\":\"GROUP\"}",
  "{\"_d\":3,\"b\":[0,0,100,40],\"f\":[{\"angle\":90,\"grad\":\"LINEAR\",\"stops\":[[0,\"#FFFFFF@0\"],[1,\"#FFFFFF\"]]}],\"id\":\"1:4\",\"n\":\"Rectangle 1\",\"r\":8,\"t\":\"RECTANGLE\"}",
  "{\"_d\":3,\"b\":[0,0,100,40],\"f\":[{\"grad\":\"RADIAL\",\"stops\":[[0,\"#000000\"],[1,\"#000000@0\"]]}],\"fx\":[{\"c\":\"#000000@0.25\",\"o\":[0,4],\"r\":4,\"t\":\"DROP_SHADOW\"},{\"r\":8,\"t\":\"BACKGROUND_BLUR\"},{\"r\":4,\"t\":\"LAYER_BLUR\"}],\"id\":\"1:5\",\"n\":\"Rectangle 2\",\"t\":\"RECTANGLE\",\"vis\":false}",
  "{\"_d\":1,\"b\":[0,0,200,48],\"id\":\"1:6\",\"l\":{\"ai\":\"CENTER\",\"g\":8,\"jc\":\"CENTER\",\"m\":\"H\",\"p\":[12,16,12,16],\"sx\":\"FILL\",\"sy\":\"FIXED\"},\"n\":\"Property 1=Default\",\"t\":\"COMPONENT\"}",
  "{\"_d\":4,\"b\":[0,0,80,16],\"id\":\"1:7\",\"n\":\"Label\",\"t\":\"TEXT\",\"tx\":{\"c\":\"LABEL\",\"ff\":\"Inter\",\"fs\":12,\"fw\":500,\"lh\":\"auto\",\"ls\":0,\"ta\":\"RIGHT\",\"tc\":\"UPPER\",\"td\":\"UNDERLINE\"}}",
  "\"Blue hint\"",
  "\"Input hint (dark)\"",
  "\"Black\"",
  "\"White\"",
  "\"border-radius/rounded\"",
  "\"border-radius/rounded-2xl\"",
  "\"border-radius/rounded-3xl\"",
  "\"border-radius/rounded-5xl\"",
  "\"border-radius/rounded-full\"",
  "\"border-radius/rounded-lg\"",
  "\"border-radius/rounded-md\"",
  "\"border-radius/rounded-none\"",
  "\"border-radius/rounded-sm\"",
  "\"border-radius/rounded-xl\"",
  "\"border-width/w-100\"",
  "\"border-width/w-200\"",
  "\"border-width/w-300\"",
  "\"border-width/w-50\"",
  "\"opacity/opacity-100\"",
  "\"opacity/opacity-60\"",
  "\"s-0\"",
  "\"s-0,5\"",
  "\"s-1\"",
  "\"s-1,5\"",
  "\"s-10\"",
  "\"s-11\"",
  "\"s-12\"",
  "\"s-14\"",
  "\"s-16\"",
  "\"s-2\"",
  "\"s-2,5\"",
  "\"s-20\"",
  "\"s-24\"",
  "\"s-3\"",
  "\"s-3,5\"",
  "\"s-4\"",
  "\"s-5\"",
  "\"s-6\"",
  "\"s-7\"",
  "\"s-8\"",
  "\"s-9\"",
  "\"Default\"",
  "\"Lg/Headline 3 - italics 300\"",
  "\"Lg/Label 1 300\"",
  "\"Lg/Label 2 300\"",
  "\"Lg/Numbers 1 300\"",
  "\"Lg/Numbers 2 300\"",
  "\"Lg/Numbers 3 300\"",
  "\"Lg/Numbers 4 300\"",
  "\"Lg/Numbers 5 300\"",
  "\"Lg/Paragraph 1 300\"",
  "\"Lg/Paragraph 1 600\"",
  "\"Lg/Paragraph 2 300\"",
  "\"Lg/Paragraph 2 600\"",
  "\"Lg/Paragraph 3 300\"",
  "\"Lg/Paragraph 3 600\"",
  "\"Lg/Sub-headline 1 300\"",
  "\"Lg/Sub-headline 2 300\"",
  "\"Lg/Sub-headline 2 600\"",
  "\"Lg/Super-headline 3 300\"",
  "\"Lg/Super-headline 4 300\"",
  "\"Md/Headline 3 - italics 300\"",
  "\"Md/Label 1 300\"",
  "\"Md/Label 2 300\"",
  "\"Md/Numbers 1 300\"",
  "\"Md/Numbers 2 300\"",
  "\"Md/Numbers 3 300\"",
  "\"Md/Numbers 4 300\"",
  "\"Md/Numbers 5 300\"",
  "\"Md/Paragraph 1 300\"",
  "\"Md/Paragraph 1 600\"",
  "\"Md/Paragraph 2 300\"",
  "\"Md/Paragraph 2 600\"",
  "\"Md/Paragraph 3 300\"",
  "\"Md/Sub-headline 1 300\"",
  "\"Md/Sub-headline 2 300\"",
  "\"Md/Sub-headline 2 600\"",
  "\"Md/Super-headline 3 300\"",
  "\"Md/Super-headline 4 300 #20487c\"",
  "\"Md/Super-headline 4 300 #4fadde\"",
  "\"Sm/Headline 3 - italics 300\"",
  "\"Sm/Label 1 300\"",
  "\"Sm/Label 2 300\"",
  "\"Sm/Numbers 1 300\"",
  "\"Sm/Numbers 2 300\"",
  "\"Sm/Numbers 3 300\"",
  "\"Sm/Numbers 4 300\"",
  "\"Sm/Numbers 5 300\"",
  "\"Sm/Paragraph 1 300\"",
  "\"Sm/Paragraph 1 600\"",
  "\"Sm/Paragraph 2 300\"",
  "\"Sm/Paragraph 2 600\"",
  "\"Sm/Paragraph 3 300\"",
  "\"Sm/Sub-headline 1 300\"",
  "\"Sm/Sub-headline 2 300\"",
  "\"Sm/Sub-headline 2 600\"",
  "\"Sm/Super-headline 3 300\"",
  "\"Sm/Super-headline 4 300\"",
  "\"Accents/Cloud 300\"",
  "\"Accents/Coral 300\"",
  "\"Accents/Earth 300\"",
  "\"Accents/Gray 100\"",
  "\"Accents/Gray 300\"",
  "\"Accents/Gray 600\"",
  "\"Accents/Sun Yellow 300\"",
  "\"Accents/Wind 300\"",
  "\"App/Ash 300\"",
  "\"App/Green 300\"",
  "\"App/Green-O\"",
  "\"App/Red 300\"",
  "\"App/Red-O\"",
  "\"Brand/Gradient 1\"",
  "\"Core/Black\"",
  "\"Core/White\"",
  "\"Primary/Alien Green 300\"",
  "\"Primary/Green Coal 100\"",
  "\"Primary/Green Coal 200\"",
  "\"Primary/Green Coal 300\"",
  "\"Primary/Printers Gold 300\"",
  "\"Primary/Sky Blue 300\"",
  "{\"_d\":0,\"b\":[0,0,1440,900],\"clip\":true,\"f\":[\"Primary/Green Coal 300\"],\"id\":\"7710:91527\",\"n\":\"Skai > Trade > Spot 1VH (1440 x 900px)\",\"t\":\"FRAME\"}",
  "{\"_d\":0,\"b\":[0,0,324,52],\"ci\":{\"k\":\"b1742e1bf04df68d26b9c8bf98a3f3b566859249\",\"n\":\"Size=Large, Type=Primary\",\"props\":{\"Has label\":false,\"Has left icon\":false,\"Has right icon\":false,\"Size\":\"Large\",\"Text\":\"Stop Autobet\",\"Type\":\"Primary\"},\"set\":\"CTA/button\"},\"f\":[\"Primary/Sky Blue 300\"],\"id\":\"9088:4795\",\"l\":{\"ai\":\"CENTER\",\"g\":\"s-2,5\",\"jc\":\"CENTER\",\"m\":\"H\",\"p\":[\"s-5\",\"s-10\",\"s-5\",\"s-10\"]},\"n\":\"CTA/button\",\"r\":\"border-radius/rounded-2xl\",\"t\":\"INSTANCE\"}",
  "{\"_d\":0,\"b\":[0,0,680,126],\"clip\":true,\"f\":[\"#052D2D\"],\"fx\":\"Input hint (dark)\",\"id\":\"2745:3552\",\"l\":{\"g\":\"s-8\",\"m\":\"V\",\"p\":[\"s-5\",\"s-5\",\"s-5\",\"s-5\"],\"sy\":\"HUG\"},\"n\":\"Input w/o voice\",\"r\":24,\"t\":\"FRAME\"}",
  "{\"_d\":1,\"b\":[0,0,1440,56],\"ci\":{\"k\":\"4c7dac1dd7e4c97aec7a5b9326011692b58c5b22\",\"n\":\"Header-desktop\"},\"f\":[\"Primary/Green Coal 300\"],\"id\":\"7710:92977\",\"l\":{\"ai\":\"CENTER\",\"g\":260,\"jc\":\"SPACE_BETWEEN\",\"m\":\"H\",\"p\":[\"s-2\",19,\"s-2\",19],\"sy\":\"HUG\"},\"n\":\"Header-desktop\",\"s\":[\"Primary/Green Coal 100\"],\"sa\":\"CENTER\",\"sw\":1,\"t\":\"INSTANCE\"}",
  "{\"_d\":1,\"b\":[0,56,58,844],\"clip\":true,\"id\":\"7710:93013\",\"l\":{\"ai\":\"CENTER\",\"g\":10,\"m\":\"H\",\"p\":[12,11,12,11],\"sx\":\"HUG\"},\"n\":\"sidebar\",\"s\":[\"Primary/Green Coal 100\"],\"sa\":\"CENTER\",\"sw\":[0,1,0,0],\"t\":\"FRAME\"}",
  "{\"_d\":1,\"b\":[58,884,1382,16],\"f\":[\"Primary/Green Coal 200\"],\"id\":\"7710:92978\",\"l\":{\"ai\":\"CENTER\",\"g\":24,\"jc\":\"SPACE_BETWEEN\",\"m\":\"H\",\"sy\":\"HUG\"},\"n\":\"Frame 7\",\"s\":[\"Primary/Green Coal 100\"],\"sa\":\"CENTER\",\"sw\":1,\"t\":\"FRAME\"}",
  "{\"_d\":1,\"h\":\"5d88331383fffe35\",\"ref\":\"7710:91528\"}",
  "{\"_d\":2,\"b\":[0,0,324,36],\"f\":[\"Primary/Green Coal 300\"],\"fx\":[{\"c\":\"#000000@0.25\",\"o\":[0,4],\"r\":8.2,\"t\":\"DROP_SHADOW\"}],\"id\":\"9142:19496\",\"l\":{\"ai\":\"CENTER\",\"g\":10,\"jc\":\"SPACE_BETWEEN\",\"m\":\"H\",\"p\":[12,12,6,12],\"sy\":\"HUG\"},\"n\":\"Frame 1000004028\",\"r\":[12,12,0,0],\"t\":\"FRAME\"}",
  "{\"_d\":2,\"b\":[0,36,324,150],\"clip\":true,\"f\":[\"#001615\"],\"id\":\"9142:19456\",\"l\":{\"ai\":\"CENTER\",\"g\":10,\"m\":\"V\",\"p\":[6,12,12,12]},\"n\":\"Frame 1000004090\",\"r\":[0,0,12,12],\"t\":\"FRAME\"}",
  "{\"_d\":3,\"b\":[0,0,32,32],\"f\":[\"Primary/Green Coal 300\"],\"id\":\"2745:3568\",\"l\":{\"ai\":\"CENTER\",\"g\":10,\"m\":\"H\",\"p\":[\"s-2\",\"s-2\",\"s-2\",\"s-2\"],\"sx\":\"HUG\",\"sy\":\"HUG\"},\"n\":\"Frame 198\",\"r\":\"border-radius/rounded-lg\",\"t\":\"FRAME\"}",
  "{\"_d\":3,\"b\":[0,0,32,32],\"id\":\"2745:3566\",\"l\":{\"ai\":\"CENTER\",\"g\":10,\"m\":\"H\",\"p\":[\"s-2\",\"s-2\",\"s-2\",\"s-2\"],\"sx\":\"HUG\",\"sy\":\"HUG\"},\"n\":\"Frame 199\",\"r\":\"border-radius/rounded-lg\",\"s\":[\"Primary/Green Coal 100\"],\"sa\":\"CENTER\",\"sw\":1,\"t\":\"FRAME\",\"vis\":false}",
  "{\"_d\":3,\"b\":[0,0,77,32],\"ci\":{\"k\":\"0aaccc64881718eeacf689281441e6e27b7fbf36\",\"n\":\"Mode=White, Size=Large\",\"props\":{\"Mode\":\"White\",\"Size\":\"Large\"},\"set\":\"logos/skai-short\"},\"id\":\"I7710:92977;1084:839\",\"l\":{\"g\":5,\"m\":\"V\",\"sy\":\"HUG\"},\"n\":\"logos/skai-short\",\"t\":\"INSTANCE\"}",
  "{\"_d\":3,\"b\":[0,2,36,36],\"ci\":{\"k\":\"b1742e1bf04df68d26b9c8bf98a3f3b566859249\",\"n\":\"Size=Large, Type=Primary\",\"props\":{\"Has label\":false,\"Has left icon\":false,\"Has right icon\":true,\"Size\":\"Large\",\"Text\":\"Connect wallet\",\"Type\":\"Primary\"},\"set\":\"CTA/button\"},\"id\":\"I7710:92977;1176:953\",\"l\":{\"ai\":\"CENTER\",\"g\":\"s-2\",\"jc\":\"CENTER\",\"m\":\"H\",\"p\":[\"s-2,5\",\"s-2,5\",\"s-2,5\",\"s-2,5\"],\"sx\":\"HUG\",\"sy\":\"HUG\"},\"n\":\"CTA/button\",\"r\":\"border-radius/rounded-full\",\"s\":[\"Primary/Green Coal 100\"],\"sa\":\"INSIDE\",\"sw\":1,\"t\":\"INSTANCE\"}",
  "{\"_d\":3,\"b\":[12,6,300,148],\"clip\":true,\"id\":\"9142:19457\",\"l\":{\"g\":8,\"m\":\"V\",\"sx\":\"FILL\",\"sy\":\"HUG\"},\"n\":\"Frame 1000004032\",\"t\":\"FRAME\"}",
  "{\"_d\":3,\"b\":[44,9,223,14],\"id\":\"2745:3558\",\"l\":{\"ai\":\"CENTER\",\"g\":\"s-6\",\"m\":\"H\",\"sx\":\"HUG\",\"sy\":\"HUG\"},\"n\":\"cost\",\"t\":\"FRAME\",\"vis\":false}",
  "{\"_d\":4,\"b\":[16,8,24,24],\"ci\":{\"k\":\"f1d76a26e4517625636f2a72b8940aa12177c085\",\"n\":\"Size=Small\",\"props\":{\"Size\":\"Small\"},\"set\":\"images/circle\"},\"id\":\"I7710:92977;1176:955\",\"n\":\"images/circle\",\"t\":\"INSTANCE\"}",
  "{\"_d\":5,\"b\":[0,0,80,18],\"f\":[\"#FFFFFF\"],\"id\":\"9142:19473\",\"n\":\"2.340195\",\"t\":\"TEXT\",\"tx\":{\"c\":\"blknoiz06\",\"ff\":\"Mulish\",\"fs\":14,\"fw\":400,\"lh\":\"auto\",\"ls\":\"0%\"}}",
  "{\"_d\":5,\"b\":[1,1,14,14],\"f\":[\"Core/White\"],\"id\":\"I2745:3557;1442:1846\",\"n\":\"icon\",\"t\":\"BOOLEAN_OPERATION\"}",
  "{\"_d\":5,\"b\":[1.5,0.5,12.5,14.5],\"f\":[\"Core/White\"],\"id\":\"I2745:3569;1696:1272\",\"n\":\"icon\",\"s\":[\"Core/White\"],\"sa\":\"CENTER\",\"sw\":0,\"t\":\"BOOLEAN_OPERATION\"}",
  "{\"_d\":6,\"b\":[0,1,16,16],\"f\":[{\"img\":\"abc6d31a1b53f5442e415481ec1e732770717722\",\"scale\":\"FILL\"},{\"img\":\"97213ae6954d949e8519595cc338e3e81dccd2df\",\"scale\":\"FILL\"}],\"id\":\"10259:3026\",\"n\":\"circle\",\"t\":\"ELLIPSE\"}",
  "{\"_d\":2,\"b\":[579.5,11,236,34],\"f\":[\"Primary/Green Coal 300\"],\"id\":\"I7710:92977;1084:848\",\"l\":{\"ai\":\"CENTER\",\"g\":10,\"m\":\"H\",\"p\":[\"s-2\",\"s-6\",\"s-2\",\"s-4\"],\"sy\":\"HUG\"},\"n\":\"search\",\"r\":8,\"s\":[\"Primary/Green Coal 100\"],\"sa\":\"INSIDE\",\"sw\":1,\"t\":\"FRAME\"}",
  "{\"_d\":3,\"b\":[42,8,107,18],\"f\":[\"App/Ash 300\"],\"id\":\"I7710:92977;1084:850\",\"l\":{\"sx\":\"HUG\",\"sy\":\"HUG\"},\"n\":\"Search anything...\",\"op\":0.74,\"t\":\"TEXT\",\"tx\":{\"c\":\"Search anything...\",\"st\":\"Lg/Paragraph 2 300\",\"ta\":\"CENTER\"}}",
  "{\"_d\":3,\"b\":[0,0,68,28],\"id\":\"I7710:92977;1176:1138\",\"l\":{\"ai\":\"CENTER\",\"g\":\"s-1,5\",\"m\":\"H\",\"p\":[\"s-1,5\",\"s-3\",\"s-1,5\",\"s-1,5\"],\"sx\":\"HUG\",\"sy\":\"HUG\"},\"n\":\"list\",\"r\":\"border-radius/rounded-lg\",\"s\":[\"Primary/Green Coal 100\"],\"sa\":\"INSIDE\",\"sw\":1,\"t\":\"FRAME\"}",
  "{\"_h\":\"7e29b21f4eee250f\",\"_p\":\"7710:91527\"}",
  "{\"_d\":4,\"b\":[0,0,56,22],\"ci\":{\"k\":\"78379447d99f7c6479e44b91465956a8e9a4ee67\",\"n\":\"Size=Massive, Type=Link\",\"props\":{\"Has label\":true,\"Has left icon\":true,\"Has right icon\":true,\"Size\":\"Massive\",\"Text\":\"Trade\",\"Type\":\"Link\"},\"set\":\"CTA/button\"},\"id\":\"I7710:92977;1084:842\",\"l\":{\"ai\":\"CENTER\",\"g\":\"s-0\",\"jc\":\"CENTER\",\"m\":\"H\",\"p\":[\"s-0\",\"s-0\",\"s-0\",\"s-0\"],\"sx\":\"HUG\",\"sy\":\"HUG\"},\"n\":\"CTA/button\",\"r\":\"border-radius/rounded-2xl\",\"t\":\"INSTANCE\"}",
  "{\"_d\":6,\"b\":[0,1,16,16],\"clip\":true,\"id\":\"11081:10583\",\"n\":\"Skai sUSD\",\"r\":159.98,\"t\":\"FRAME\"}",
  "{\"_d\":7,\"b\":[0,0,16,16],\"id\":\"11081:10584\",\"n\":\"SKAI token\",\"t\":\"FRAME\"}",
  "{\"_d\":8,\"b\":[0,0,16,16],\"f\":[\"Primary/Alien Green 300\"],\"fx\":[{\"c\":\"#000000@0.64\",\"o\":[-0.64,-0.64],\"r\":1.28,\"t\":\"INNER_SHADOW\"}],\"id\":\"11081:10585\",\"n\":\"Ellipse 13\",\"t\":\"ELLIPSE\"}",
  "{\"_d\":8,\"b\":[0,0,16,16],\"id\":\"11081:10586\",\"n\":\"Ellipse 14\",\"s\":[\"Core/White\"],\"sa\":\"INSIDE\",\"sw\":0.77,\"t\":\"ELLIPSE\",\"vis\":false}",
  "{\"_d\":8,\"b\":[0,0,16,16],\"id\":\"11081:10587\",\"n\":\"Ellipse 12\",\"s\":[\"Primary/Green Coal 300\"],\"sa\":\"INSIDE\",\"sw\":0.64,\"t\":\"ELLIPSE\"}",
  "{\"_d\":6,\"b\":[4,6,8,4],\"f\":[\"Primary/Sky Blue 300\"],\"id\":\"I7710:92977;1084:842;801:1043;1081:406\",\"n\":\"icon\",\"t\":\"VECTOR\"}",
  "{\"_d\":5,\"b\":[40,3,16,16],\"ci\":{\"k\":\"adbb67c08fb046d5a043a5e28b80083588a1cf0e\",\"n\":\"Size=16px, Type=Arrow-down\",\"props\":{\"Size\":\"16px\",\"Type\":\"Arrow-down\"},\"set\":\"icons/action\"},\"clip\":true,\"id\":\"I7710:92977;1084:842;801:1043\",\"n\":\"icons/action\",\"t\":\"INSTANCE\"}",
  "{\"_d\":2,\"b\":[19,12,502,32],\"id\":\"I7710:92977;1084:838\",\"l\":{\"ai\":\"CENTER\",\"g\":24,\"m\":\"H\",\"sx\":\"HUG\",\"sy\":\"HUG\"},\"n\":\"menu\",\"t\":\"FRAME\"}",
  "{\"_d\":5,\"b\":[0,0,40,22],\"f\":[\"Primary/Sky Blue 300\"],\"id\":\"I7710:92977;1084:842;801:986\",\"l\":{\"sx\":\"HUG\",\"sy\":\"HUG\"},\"n\":\"Button\",\"t\":\"TEXT\",\"tx\":{\"c\":\"Trade\",\"st\":\"Lg/Paragraph 1 300\",\"ta\":\"CENTER\"}}",
].join(",");

export const DICT_ID = fnv1a64(ZDICT).slice(0, 8);
/**
 * The id of the empty dictionary. A script whose dictionary does not hash to
 * the id it was given (a copy of the script that is not exact) packs with no
 * dictionary and says so with this id, so the slip costs ratio, not the call.
 */
export const DICT_NONE = fnv1a64("").slice(0, 8);

/**
 * zcodec(dictText) -> { pack(text) -> bytes, b64(bytes, start, end), u8len(text), utf8(text) }
 *
 * pack() is raw DEFLATE: LZ77 over a 32 KB window with hash chains and one
 * step of lazy matching, then per block the cheaper of fixed Huffman codes and
 * dynamic codes built by package-merge (optimal under the 15- and 7-bit length
 * limits, and always a complete code, which zlib requires). Deterministic: the
 * same text gives the same bytes in any engine, which is what lets one frame's
 * stream be carried across calls by byte offset.
 */
export function zcodec(dictText) {
  const u8 = (k) => (typeof Uint8Array === 'function' ? new Uint8Array(k) : new Array(k).fill(0));
  const i32 = (k, v) => {
    const a = typeof Int32Array === 'function' ? new Int32Array(k) : new Array(k).fill(0);
    if (v) a.fill(v);
    return a;
  };
  // UTF-8 as fnv1a64 reads it: a valid surrogate pair is 4 bytes, a lone surrogate 3.
  const utf8 = (s) => {
    const o = [];
    for (let i = 0; i < s.length; i++) {
      let c = s.charCodeAt(i);
      if (c < 0x80) {
        o.push(c);
        continue;
      }
      if (c >= 0xd800 && c < 0xdc00 && i + 1 < s.length) {
        const d = s.charCodeAt(i + 1);
        if (d >= 0xdc00 && d < 0xe000) {
          c = 0x10000 + ((c - 0xd800) << 10) + (d - 0xdc00);
          i++;
        }
      }
      if (c < 0x800) o.push(0xc0 | (c >> 6), 0x80 | (c & 63));
      else if (c < 0x10000) o.push(0xe0 | (c >> 12), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63));
      else o.push(0xf0 | (c >> 18), 0x80 | ((c >> 12) & 63), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63));
    }
    return o;
  };
  const u8len = (s) => {
    let n = 0;
    for (let i = 0; i < s.length; i++) {
      const c = s.charCodeAt(i);
      if (c < 0x80) n += 1;
      else if (c < 0x800) n += 2;
      else if (c >= 0xd800 && c < 0xdc00 && i + 1 < s.length && s.charCodeAt(i + 1) >= 0xdc00 && s.charCodeAt(i + 1) < 0xe000) {
        n += 4;
        i++;
      } else n += 3;
    }
    return n;
  };
  const A64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  const b64 = (b, s, e) => {
    const o = [];
    let i = s;
    for (; i + 2 < e; i += 3) {
      const v = (b[i] << 16) | (b[i + 1] << 8) | b[i + 2];
      o.push(A64[v >> 18] + A64[(v >> 12) & 63] + A64[(v >> 6) & 63] + A64[v & 63]);
    }
    if (i < e) {
      const two = i + 1 < e;
      const v = (b[i] << 16) | (two ? b[i + 1] << 8 : 0);
      o.push(A64[v >> 18] + A64[(v >> 12) & 63] + (two ? A64[(v >> 6) & 63] : '=') + '=');
    }
    return o.join('');
  };

  // RFC 1951 length and distance code tables.
  const LB = [];
  const LX = [];
  const DB = [];
  const DX = [];
  for (let c = 0, b = 3; c < 28; c++) {
    const x = c < 8 ? 0 : (c >> 2) - 1;
    LB.push(b);
    LX.push(x);
    b += 1 << x;
  }
  LB.push(258);
  LX.push(0);
  for (let c = 0, d = 1; c < 30; c++) {
    const x = c < 4 ? 0 : (c >> 1) - 1;
    DB.push(d);
    DX.push(x);
    d += 1 << x;
  }
  const LC = [];
  for (let c = 0; c < 29; c++) for (let l = LB[c]; l < (c < 28 ? LB[c + 1] : 259); l++) LC[l - 3] = c;
  const dcode = (d) => {
    if (d <= 4) return d - 1;
    const v = d - 1;
    let nb = 0;
    while (v >> (nb + 1)) nb++;
    return 2 * nb + ((v >> (nb - 1)) & 1);
  };
  const ORDER = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
  const FL = [];
  for (let s = 0; s < 288; s++) FL.push(s < 144 ? 8 : s < 256 ? 9 : s < 280 ? 7 : 8);
  const FD = [];
  for (let s = 0; s < 30; s++) FD.push(5);

  // Code lengths for `freq` no longer than L bits, by package-merge.
  const limited = (freq, L) => {
    const lens = new Array(freq.length).fill(0);
    const sy = [];
    for (let s = 0; s < freq.length; s++) if (freq[s]) sy.push(s);
    if (sy.length === 1) lens[sy[0]] = 1;
    if (sy.length < 2) return lens;
    sy.sort((a, b) => freq[a] - freq[b] || a - b);
    const leaves = sy.map((s) => ({ w: freq[s], s }));
    /** @type {any[]} */
    let cur = leaves;
    for (let k = 1; k < L; k++) {
      const pk = [];
      for (let j = 0; j + 1 < cur.length; j += 2) pk.push({ w: cur[j].w + cur[j + 1].w, a: cur[j], b: cur[j + 1] });
      const m = [];
      let x = 0;
      let y = 0;
      while (x < leaves.length || y < pk.length) {
        if (y >= pk.length || (x < leaves.length && leaves[x].w <= pk[y].w)) m.push(leaves[x++]);
        else m.push(pk[y++]);
      }
      cur = m;
    }
    const walk = (it) => {
      if (it.a) {
        walk(it.a);
        walk(it.b);
      } else lens[it.s]++;
    };
    for (let j = 0; j < 2 * sy.length - 2; j++) walk(cur[j]);
    return lens;
  };
  // Canonical codes, bit-reversed because DEFLATE packs bits from the low end.
  const codes = (lens) => {
    const count = new Array(16).fill(0);
    for (const l of lens) if (l) count[l]++;
    const next = [0];
    let code = 0;
    for (let b = 1; b < 16; b++) {
      code = (code + count[b - 1]) << 1;
      next[b] = code;
    }
    return lens.map((l) => {
      if (!l) return 0;
      let c = next[l]++;
      let r = 0;
      for (let k = 0; k < l; k++) {
        r = (r << 1) | (c & 1);
        c >>>= 1;
      }
      return r;
    });
  };
  // A code needs two used symbols to be complete; a spare one costs a bit.
  const two = (f) => {
    let u = 0;
    for (const v of f) if (v) u++;
    for (let s = 0; u < 2; s++) {
      if (!f[s]) {
        f[s] = 1;
        u++;
      }
    }
  };
  const rle = (lens) => {
    const o = [];
    let i = 0;
    while (i < lens.length) {
      const l = lens[i];
      let r = 1;
      while (i + r < lens.length && lens[i + r] === l) r++;
      i += r;
      if (l === 0) {
        while (r >= 11) {
          const k = r < 138 ? r : 138;
          o.push([18, 7, k - 11]);
          r -= k;
        }
        if (r >= 3) {
          o.push([17, 3, r - 3]);
          r = 0;
        }
      } else {
        o.push([l, 0, 0]);
        r--;
        while (r >= 3) {
          const k = r < 6 ? r : 6;
          o.push([16, 2, k - 3]);
          r -= k;
        }
      }
      for (; r > 0; r--) o.push([l, 0, 0]);
    }
    return o;
  };

  const dict = utf8(dictText || '');
  const pack = (text) => {
    const data = utf8(text);
    const D = dict.length;
    const n = D + data.length;
    const buf = u8(n);
    for (let i = 0; i < D; i++) buf[i] = dict[i];
    for (let i = 0; i < data.length; i++) buf[D + i] = data[i];
    const head = i32(32768, -1);
    const prev = i32(32768, -1);
    const hash = (i) => ((buf[i] << 10) ^ (buf[i + 1] << 5) ^ buf[i + 2]) & 32767;
    let ins = 0;
    const upTo = (to) => {
      for (; ins < to; ins++) {
        if (ins + 2 < n) {
          const h = hash(ins);
          prev[ins & 32767] = head[h];
          head[h] = ins;
        }
      }
    };
    let mL = 0;
    let mD = 0;
    const find = (i) => {
      mL = 0;
      mD = 0;
      const lim = n - i < 258 ? n - i : 258;
      if (lim < 3) return;
      let p = head[hash(i)];
      let chain = 1024;
      while (p >= 0 && i - p <= 32768 && chain-- > 0) {
        if (buf[p + mL] === buf[i + mL]) {
          let l = 0;
          while (l < lim && buf[p + l] === buf[i + l]) l++;
          if (l > mL) {
            mL = l;
            mD = i - p;
            if (l >= lim) break;
          }
        }
        p = prev[p & 32767];
      }
      if (mL < 3 || (mL === 3 && mD > 4096)) {
        mL = 0;
        mD = 0;
      }
    };
    const tok = [];
    let i = D;
    let cPos = -1;
    let cL = 0;
    let cD = 0;
    upTo(D);
    while (i < n) {
      upTo(i);
      let L = cL;
      let Dd = cD;
      if (cPos !== i) {
        find(i);
        L = mL;
        Dd = mD;
      }
      if (L >= 3 && L < 258 && i + 1 < n) {
        upTo(i + 1);
        find(i + 1);
        cPos = i + 1;
        cL = mL;
        cD = mD;
        if (mL > L) {
          tok.push(buf[i]);
          i++;
          continue;
        }
      }
      if (L >= 3) {
        tok.push(256 + (L - 3) * 32768 + (Dd - 1));
        i += L;
      } else {
        tok.push(buf[i]);
        i++;
      }
    }

    const out = [];
    let bb = 0;
    let bn = 0;
    const put = (v, k) => {
      bb |= v << bn;
      bn += k;
      while (bn >= 8) {
        out.push(bb & 255);
        bb >>>= 8;
        bn -= 8;
      }
    };
    const BS = 16384;
    for (let s = 0; s < tok.length || s === 0; s += BS) {
      const e = tok.length < s + BS ? tok.length : s + BS;
      const lf = new Array(286).fill(0);
      const df = new Array(30).fill(0);
      const sym = [];
      const dc = [];
      for (let k = s; k < e; k++) {
        const t = tok[k];
        if (t < 256) {
          lf[t]++;
          sym.push(t);
          dc.push(-1);
        } else {
          const v = t - 256;
          const c = 257 + LC[v >> 15];
          const q = dcode((v & 32767) + 1);
          lf[c]++;
          df[q]++;
          sym.push(c);
          dc.push(q);
        }
      }
      lf[256] = 1;
      two(lf);
      two(df);
      const ll = limited(lf, 15);
      const dl = limited(df, 15);
      let hlit = 286;
      while (hlit > 257 && !ll[hlit - 1]) hlit--;
      let hdist = 30;
      while (hdist > 1 && !dl[hdist - 1]) hdist--;
      const rl = rle(ll.slice(0, hlit).concat(dl.slice(0, hdist)));
      const cf = new Array(19).fill(0);
      for (const r of rl) cf[r[0]]++;
      two(cf);
      const cl = limited(cf, 7);
      let hclen = 19;
      while (hclen > 4 && !cl[ORDER[hclen - 1]]) hclen--;
      let dyn = 17 + 3 * hclen + ll[256];
      let fix = 3 + FL[256];
      for (const r of rl) dyn += cl[r[0]] + r[1];
      for (let k = 0; k < sym.length; k++) {
        const c = sym[k];
        if (c < 256) {
          dyn += ll[c];
          fix += FL[c];
        } else {
          const x = LX[c - 257] + DX[dc[k]];
          dyn += ll[c] + dl[dc[k]] + x;
          fix += FL[c] + 5 + x;
        }
      }
      put(e >= tok.length ? 1 : 0, 1);
      let lL = ll;
      let dL = dl;
      if (fix <= dyn) {
        put(1, 2);
        lL = FL;
        dL = FD;
      } else {
        put(2, 2);
        put(hlit - 257, 5);
        put(hdist - 1, 5);
        put(hclen - 4, 4);
        for (let k = 0; k < hclen; k++) put(cl[ORDER[k]], 3);
        const cc = codes(cl);
        for (const r of rl) {
          put(cc[r[0]], cl[r[0]]);
          if (r[1]) put(r[2], r[1]);
        }
      }
      const lc = codes(lL);
      const dcs = codes(dL);
      for (let k = 0; k < sym.length; k++) {
        const c = sym[k];
        put(lc[c], lL[c]);
        if (c < 256) continue;
        const v = tok[s + k] - 256;
        const x = c - 257;
        if (LX[x]) put((v >> 15) + 3 - LB[x], LX[x]);
        const q = dc[k];
        put(dcs[q], dL[q]);
        if (DX[q]) put((v & 32767) + 1 - DB[q], DX[q]);
      }
      put(lc[256], lL[256]);
    }
    if (bn > 0) out.push(bb & 255);
    return out;
  };
  return { pack, b64, u8len, utf8, limited };
}

// ── Node side ────────────────────────────────────────────────────────────────

const node = zcodec(ZDICT);
const DICT_BYTES = Buffer.from(node.utf8(ZDICT));

/** Decode UTF-8 the way zcodec encodes it, including a lone surrogate's 3 bytes. Throws on anything else. */
export function utf8Decode(bytes) {
  const units = [];
  const bad = (i) => new Error(`not UTF-8 at byte ${i}`);
  for (let i = 0; i < bytes.length; ) {
    const b = bytes[i];
    let c;
    let k;
    if (b < 0x80) {
      c = b;
      k = 1;
    } else if (b >= 0xc2 && b < 0xe0) {
      c = b & 31;
      k = 2;
    } else if (b >= 0xe0 && b < 0xf0) {
      c = b & 15;
      k = 3;
    } else if (b >= 0xf0 && b < 0xf5) {
      c = b & 7;
      k = 4;
    } else throw bad(i);
    if (i + k > bytes.length) throw bad(i);
    for (let j = 1; j < k; j++) {
      const x = bytes[i + j];
      if ((x & 0xc0) !== 0x80) throw bad(i + j);
      c = (c << 6) | (x & 63);
    }
    if ((k === 3 && c < 0x800) || (k === 4 && (c < 0x10000 || c > 0x10ffff))) throw bad(i);
    if (c >= 0x10000) units.push(0xd800 + ((c - 0x10000) >> 10), 0xdc00 + ((c - 0x10000) & 1023));
    else units.push(c);
    i += k;
  }
  let s = "";
  for (let i = 0; i < units.length; i += 8192) s += String.fromCharCode.apply(null, units.slice(i, i + 8192));
  return s;
}

/** The check a line of base64 travels with. */
export const lineCheck = (line) => fnv1a64(line).slice(8);

/** A base64 string cut into LINE-character lines with their checks. */
export function toLines(s, line = LINE) {
  const z = [];
  for (let k = 0; k < s.length; k += line) z.push(s.slice(k, k + line));
  return { z, zc: z.map(lineCheck) };
}

/** The lines of a slice whose check does not match, by index. */
export function badLines(seg) {
  const z = Array.isArray(seg?.z) ? seg.z : [];
  const zc = Array.isArray(seg?.zc) ? seg.zc : [];
  const bad = [];
  for (let i = 0; i < Math.max(z.length, zc.length); i++) if (typeof z[i] !== "string" || lineCheck(z[i]) !== zc[i]) bad.push(i);
  return bad;
}

export class TransportError extends Error {}

const B64 = /^[A-Za-z0-9+/]*={0,2}$/;

/** Base64 to bytes, refusing anything Buffer would quietly skip. */
export function fromBase64(s) {
  if (typeof s !== "string" || s.length % 4 || !B64.test(s)) throw new TransportError("a slice is not base64");
  return Buffer.from(s, "base64");
}

/**
 * Encode a JSON value exactly as the extract script does: its canonical JSON,
 * packed. Returns the text, the stream, and its checksum.
 */
export function encode(value) {
  const text = canonicalJson(value);
  const bytes = node.pack(text);
  return { text, bytes, zh: fnv1a64(text), b64: node.b64(bytes, 0, bytes.length) };
}

/**
 * Inflate a whole z1 stream (base64 or bytes) back to its value, with the
 * dictionary `dz` names (DICT_ID or DICT_NONE). Refuses a stream that does not
 * inflate, whose text does not match `zh`, or whose text is not the canonical
 * JSON of what it parses to.
 */
export function decode(stream, zh, dz = DICT_ID) {
  if (dz !== DICT_ID && dz !== DICT_NONE) throw new TransportError(`no dictionary ${dz} in this checkout (it has ${DICT_ID})`);
  const bytes = typeof stream === "string" ? fromBase64(stream) : Buffer.from(stream);
  let raw;
  try {
    raw = zlib.inflateRawSync(bytes, dz === DICT_ID ? { dictionary: DICT_BYTES } : {});
  } catch (e) {
    throw new TransportError(`the stream does not inflate (${e.message})`);
  }
  let text;
  try {
    text = utf8Decode(raw);
  } catch (e) {
    throw new TransportError(`the inflated stream is ${e.message}`);
  }
  if (zh !== undefined && fnv1a64(text) !== zh) throw new TransportError("the decoded text does not match the checksum Figma sent with it");
  let value;
  try {
    value = JSON.parse(text);
  } catch (e) {
    throw new TransportError(`the decoded text is not JSON (${e.message})`);
  }
  if (canonicalJson(value) !== text) throw new TransportError("the decoded text is not canonical JSON, so it would not hash as Figma hashed it");
  return { value, text, raw: raw.length, packed: bytes.length };
}

export const codec = node;

// ── self-test ────────────────────────────────────────────────────────────────

/** A seeded generator, so a failure names a value that can be made again. */
export function rng(seed) {
  let s = seed >>> 0 || 1;
  const next = () => {
    s ^= s << 13;
    s >>>= 0;
    s ^= s >>> 17;
    s ^= s << 5;
    s >>>= 0;
    return s / 4294967296;
  };
  return { next, int: (n) => Math.floor(next() * n), pick: (a) => a[Math.floor(next() * a.length)] };
}

/** Text meant to break an encoder: every escape, every UTF-8 width, both lone surrogates. */
export const HARD_TEXT = ["a", "Z", "0", " ", '"', "\\", "/", "\u0000", "\u0001", "\n", "\r", "\t", "\u001f", "\u007f", "é", "ß", "中", "✅", "🎰", "👩‍💻", "́", "ا", " ", " ", "﻿", "￿", "\ud800", "\udfff", "􏿿", "…"];

/** A random JSON value: nested objects and arrays, hard text, and numbers of every shape. */
export function randomValue(r, depth = 0) {
  const text = (n) => {
    let s = "";
    for (let i = 0; i < n; i++) s += r.pick(HARD_TEXT);
    return s;
  };
  const k = depth > 6 ? r.int(4) : r.int(7);
  if (k === 0) return text(r.int(40));
  if (k === 1) return r.pick([0, -0, 1, -1, 0.5, 1e21, 1e-7, 5e-324, 2 ** 53, -123.456, Math.PI]);
  if (k === 2) return r.pick([true, false, null]);
  if (k === 3) return r.int(100000) / r.pick([1, 2, 100]);
  if (k === 4) return Array.from({ length: r.int(6) }, () => randomValue(r, depth + 1));
  const o = {};
  for (let i = r.int(6); i > 0; i--) o[text(1 + r.int(8))] = randomValue(r, depth + 1);
  return o;
}

/**
 * The transport's own checks. `check(name, ok, detail)` is the caller's
 * reporter; `files` are JSON files to round-trip (every fixture and every
 * stored spec). Runs without Figma.
 */
export function selfTest(check, files = []) {
  const same = (v) => {
    const e = encode(v);
    const d = decode(e.b64, e.zh);
    return d.text === canonicalJson(v) && canonicalJson(d.value) === canonicalJson(v) && e.text === canonicalJson(v);
  };

  let failed = null;
  for (const f of files) {
    const v = JSON.parse(fs.readFileSync(f, "utf8"));
    if (!same(v)) {
      failed = f;
      break;
    }
  }
  check(`every fixture and stored file (${files.length}) comes back as the same canonical JSON`, files.length > 0 && failed === null, failed);

  const r = rng(20260924);
  let bad = null;
  for (let i = 0; i < 400 && !bad; i++) {
    const v = randomValue(r);
    if (!same(v)) bad = canonicalJson(v).slice(0, 200);
  }
  check("400 random values with every escape, UTF-8 width and lone surrogate come back the same", bad === null, bad);

  const proto = JSON.parse('{"__proto__":{"a":1},"constructor":2,"":[],"10":1,"9":2}');
  check('an own "__proto__" key, an empty key and numeric keys survive', same(proto));
  /** @type {any} */
  let deep = "leaf 🎰";
  for (let i = 0; i < 300; i++) deep = i % 2 ? [deep] : { k: deep };
  check("nesting 300 levels deep comes back the same", same(deep));
  const long = HARD_TEXT.join("").repeat(4000);
  check(`a ${long.length}-character string of hard text comes back the same`, same({ tx: { c: long } }));
  check("empty values come back the same", same([]) && same({}) && same("") && same(null) && same(0));

  // zlib inflates the encoder's bytes to exactly the input bytes, over many
  // blocks, long runs, the 32 KB window edge and incompressible input.
  const bytesOk = (text) => {
    const packed = Buffer.from(node.pack(text));
    return Buffer.compare(zlib.inflateRawSync(packed, { dictionary: DICT_BYTES }), Buffer.from(node.utf8(text))) === 0;
  };
  let noise = "";
  const rn = rng(7);
  for (let i = 0; i < 60000; i++) noise += String.fromCharCode(32 + rn.int(95));
  const edge = "x".repeat(40) + noise.slice(0, 32768 - 40) + "x".repeat(40) + noise.slice(0, 500);
  const cases = { "one byte": "a", "a 300 KB run of one byte": "q".repeat(300000), "60 KB of noise (several blocks)": noise, "a repeat exactly 32 KB back": edge, "hard text": HARD_TEXT.join("").repeat(50) };
  const badBytes = Object.entries(cases)
    .filter(([, t]) => !bytesOk(t))
    .map(([k]) => k);
  check("node:zlib inflates every packed stream to exactly its input bytes", badBytes.length === 0, badBytes);
  check("packing is deterministic: the same text gives the same bytes", Buffer.compare(Buffer.from(node.pack(noise)), Buffer.from(node.pack(noise))) === 0);
  const fromDict = canonicalJson([{ f: ["Primary/Green Coal 300"], n: "CTA/button", r: "border-radius/rounded-2xl", t: "INSTANCE" }]);
  const packedDict = Buffer.from(node.pack(fromDict));
  const withoutDict = (() => {
    try {
      return zlib.inflateRawSync(packedDict).toString() === fromDict;
    } catch {
      return false;
    }
  })();
  check("a stream that copies from the dictionary decodes with it and not without it, so both sides must hold the same one", !withoutDict && decode(packedDict, fnv1a64(fromDict)).text === fromDict && packedDict.length < zcodec("").pack(fromDict).length);

  // Package-merge: never over the limit, always a complete code (Kraft sum
  // exactly 1), and as short as unlimited Huffman when that already fits.
  const kraft = (lens, L) => lens.reduce((a, l) => a + (l ? 2 ** (L - l) : 0), 0) === 2 ** L;
  const fib = [1, 1];
  while (fib.length < 30) fib.push(fib[fib.length - 1] + fib[fib.length - 2]);
  const fl = node.limited(fib, 15);
  check("Fibonacci frequencies (unlimited depth 29) get lengths of at most 15 and a complete code", Math.max(...fl) === 15 && kraft(fl, 15), fl);
  const rk = rng(99);
  let badCode = null;
  for (let t = 0; t < 300 && !badCode; t++) {
    const n = 2 + rk.int(285);
    const L = rk.pick([7, 15]);
    const freq = Array.from({ length: n }, () => (rk.next() < 0.3 ? 0 : 1 + rk.int(rk.pick([3, 100, 100000]))));
    if (freq.filter(Boolean).length < 2) freq[0] = freq[1] = 1;
    if (freq.filter(Boolean).length > 2 ** L) continue;
    const lens = node.limited(freq, L);
    if (Math.max(...lens) > L || !kraft(lens, L) || freq.some((f, s) => (f > 0) !== (lens[s] > 0))) badCode = { freq, lens, L };
  }
  check("300 random frequency tables: lengths within the limit, every used symbol coded, complete", badCode === null, badCode);

  const b = [0, 1, 2, 250, 251, 252, 253, 254, 255];
  const b64ok = [0, 1, 2, 3, 4, 5, 7, 8, 9].every((k) => node.b64(b, 0, k) === Buffer.from(b.slice(0, k)).toString("base64") && node.b64(b, 2, k < 2 ? 2 : k) === Buffer.from(b.slice(2, k < 2 ? 2 : k)).toString("base64"));
  check("base64 matches Buffer's for every length mod 3 and for a range that starts mid-array", b64ok);
  const u8ok = HARD_TEXT.every((s) => node.u8len(s) === node.utf8(s).length) && node.u8len("é中🎰") === Buffer.byteLength("é中🎰");
  check("the UTF-8 byte count equals the encoding's length, and Buffer's for valid text", u8ok);
  check("a lone surrogate travels as 3 bytes and comes back as itself", utf8Decode(Buffer.from(node.utf8("a\ud800b"))) === "a\ud800b" && node.utf8("\udfff").length === 3);

  const refuses = (fn, re) => {
    try {
      fn();
      return false;
    } catch (e) {
      return e instanceof TransportError && re.test(e.message);
    }
  };
  const e1 = encode({ a: 1, b: ["✅"] });
  check("a stream whose text does not match the checksum is refused", refuses(() => decode(e1.b64, "0000000000000000"), /checksum/));
  const nonCanon = '{"b":1,"a":2}';
  check("a stream holding JSON that is not canonical is refused", refuses(() => decode(Buffer.from(node.pack(nonCanon)), fnv1a64(nonCanon)), /not canonical/));
  check("base64 with a stray character, or a length that is not a multiple of 4, is refused", refuses(() => fromBase64("QUJD\nRA=="), /not base64/) && refuses(() => fromBase64("QUJDR"), /not base64/));
  check("a stream cut short does not decode", refuses(() => decode(e1.b64.slice(0, 8), e1.zh), /inflate|checksum|JSON/));
  const lines = toLines("A".repeat(LINE * 2 + 5));
  const hurt = { z: lines.z.map((l, i) => (i === 1 ? "B" + l.slice(1) : l)), zc: lines.zc };
  check("the line checks name exactly the line that changed", lines.z.length === 3 && badLines(lines).length === 0 && badLines(hurt).join() === "1", badLines(hurt));
}

const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (IS_MAIN && process.argv.includes("--self-test")) {
  let pass = 0;
  let fail = 0;
  const here = path.dirname(fileURLToPath(import.meta.url));
  selfTest((name, ok, detail) => {
    console.log(`  ${ok ? "PASS" : "FAIL"}  ${name}${ok || detail === undefined ? "" : `\n        ${JSON.stringify(detail).slice(0, 400)}`}`);
    ok ? pass++ : fail++;
  }, jsonFilesUnder([path.join(here, "fixtures"), path.join(here, "..", "store")]));
  console.log(`\n${pass} passed, ${fail} failed`);
  process.exitCode = fail ? 1 : 0;
}

/** Every .json file under the given directories, sorted. */
export function jsonFilesUnder(dirs) {
  const out = [];
  const walk = (d) => {
    if (!fs.existsSync(d)) return;
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.endsWith(".json")) out.push(p);
    }
  };
  for (const d of dirs) walk(d);
  return out.sort();
}
