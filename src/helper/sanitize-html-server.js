/**
 * DOM-free, fail-closed HTML sanitizer used only when no DOM is available (SSR).
 *
 * It tokenizes the input, keeps only allow-listed tags/attributes, validates
 * URLs AFTER decoding character references, and re-serializes everything
 * itself (all attribute values re-escaped and quoted), so browser parsing
 * differentials / encoded payloads cannot reintroduce active content.
 */

const ALLOWED_TAGS = new Set([
  "a",
  "abbr",
  "b",
  "blockquote",
  "br",
  "caption",
  "code",
  "col",
  "colgroup",
  "dd",
  "div",
  "dl",
  "dt",
  "em",
  "figcaption",
  "figure",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "hr",
  "i",
  "img",
  "li",
  "ol",
  "p",
  "pre",
  "s",
  "small",
  "span",
  "strike",
  "strong",
  "sub",
  "sup",
  "table",
  "tbody",
  "td",
  "tfoot",
  "th",
  "thead",
  "tr",
  "u",
  "ul",
]);
const VOID_TAGS = new Set(["br", "hr", "img", "col"]);
// Elements whose entire content must be discarded.
const DROP_CONTENT_TAGS = new Set([
  "script",
  "style",
  "iframe",
  "object",
  "embed",
  "noscript",
  "template",
  "textarea",
  "title",
  "svg",
  "math",
  "frame",
  "frameset",
  "applet",
  "xmp",
  "plaintext",
  "noembed",
  "noframes",
  "select",
  "option",
]);
const ALLOWED_ATTRS = new Set([
  "class",
  "title",
  "alt",
  "width",
  "height",
  "colspan",
  "rowspan",
  "style",
  "href",
  "src",
  "target",
  "dir",
  "lang",
  "align",
]);

const NAMED = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  colon: ":",
  tab: "\t",
  newline: "\n",
  lpar: "(",
  rpar: ")",
  sol: "/",
  nbsp: " ",
};

export function decodeEntities(input) {
  let out = String(input);
  // Decode repeatedly to defeat double-encoding.
  for (let i = 0; i < 3; i++) {
    const next = out.replace(
      /&(?:#[xX]([0-9a-fA-F]+)|#([0-9]+)|([a-zA-Z]+));?/g,
      (m, hex, dec, name) => {
        if (hex || dec) {
          const cp = hex ? parseInt(hex, 16) : parseInt(dec, 10);
          return cp > 0 && cp <= 0x10ffff ? String.fromCodePoint(cp) : "";
        }
        const v = NAMED[name.toLowerCase()];
        return v !== undefined ? v : m;
      }
    );
    if (next === out) break;
    out = next;
  }
  return out;
}

const escapeText = (s) => s.replace(/</g, "&lt;").replace(/>/g, "&gt;");
const escapeAttr = (s) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

export function isSafeUrl(raw, { allowMailto = true } = {}) {
  // Strip whitespace/control chars the browser ignores inside schemes.
  const v = decodeEntities(raw).replace(
    /[\u0000-\u0020\u007f-\u009f\u200b-\u200f\u2028\u2029\ufeff]/g,
    ""
  );
  if (!v) return true;
  const prefix = v.split(/[/?#]/)[0];
  if (!prefix.includes(":")) {
    // Relative URL. Reject leftovers of unknown character references.
    return !/&[a-zA-Z0-9#]+;?/.test(prefix) && !v.startsWith("\\\\");
  }
  const scheme = prefix.split(":")[0].toLowerCase();
  if (scheme === "http" || scheme === "https") return true;
  return allowMailto && (scheme === "mailto" || scheme === "tel");
}

function isSafeStyle(raw) {
  const v = decodeEntities(raw).toLowerCase();
  return !/(url\s*\(|expression|javascript|vbscript|@import|behavior|-moz-binding|\\|\/\*|[<>])/.test(
    v
  );
}

const TAG_RE =
  /<!--[\s\S]*?(?:-->|$)|<(\/?)([a-zA-Z][a-zA-Z0-9:-]*)((?:"[^"]*"|'[^']*'|[^'">])*)(?:>|$)|<[!?][^>]*>?/g;
const ATTR_RE =
  /([^\s"'<>\/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;

function buildAttrs(tag, rawAttrs) {
  const parts = [];
  let target = "";
  let m;
  ATTR_RE.lastIndex = 0;
  while ((m = ATTR_RE.exec(rawAttrs))) {
    const name = m[1].toLowerCase();
    if (!ALLOWED_ATTRS.has(name)) continue;
    const value = m[2] ?? m[3] ?? m[4] ?? "";
    if (name === "href" && tag !== "a") continue;
    if (name === "src" && tag !== "img") continue;
    if (name === "target" && tag !== "a") continue;
    if (name === "href" && !isSafeUrl(value)) continue;
    if (name === "src" && !isSafeUrl(value, { allowMailto: false })) continue;
    if (name === "style" && !isSafeStyle(value)) continue;
    if (name === "target") {
      target = /^_(blank|self)$/i.test(value) ? value.toLowerCase() : "";
      continue;
    }
    // Store the decoded value, then re-escape so output is unambiguous.
    parts.push(` ${name}="${escapeAttr(decodeEntities(value))}"`);
  }
  if (tag === "a" && target) {
    parts.push(` target="${target}"`);
    if (target === "_blank") parts.push(' rel="noopener noreferrer"');
  }
  return parts.join("");
}

export function sanitizeHTMLServer(html) {
  if (typeof html !== "string" || !html) return "";
  let out = "";
  let last = 0;
  let dropUntil = null;
  const stack = [];
  let m;
  TAG_RE.lastIndex = 0;
  while ((m = TAG_RE.exec(html))) {
    const text = html.slice(last, m.index);
    last = TAG_RE.lastIndex;
    if (!dropUntil && text) out += escapeText(text);
    const [whole, closing, rawName, rawAttrs] = m;
    if (!rawName) continue; // comments / doctype / processing instructions
    const tag = rawName.toLowerCase();
    if (dropUntil) {
      if (closing && tag === dropUntil) dropUntil = null;
      continue;
    }
    if (DROP_CONTENT_TAGS.has(tag)) {
      // Like browsers, ignore a trailing "/" on these non-void tags.
      if (!closing) dropUntil = tag;
      continue;
    }
    if (!ALLOWED_TAGS.has(tag)) continue; // unwrap unknown tags, keep text
    if (closing) {
      // Drop closers without a matching opener; close anything opened inside.
      if (!VOID_TAGS.has(tag)) {
        const at = stack.lastIndexOf(tag);
        if (at !== -1) {
          while (stack.length > at) out += `</${stack.pop()}>`;
        }
      }
    } else {
      out += `<${tag}${buildAttrs(tag, rawAttrs || "")}>`;
      // A trailing "/" is ignored by HTML parsers on non-void tags, so only
      // void tags are exempt from the stack.
      if (!VOID_TAGS.has(tag)) stack.push(tag);
    }
    void whole;
  }
  if (!dropUntil) {
    const tail = html.slice(last);
    if (tail) out += escapeText(tail);
  }
  // Close every tag still open so output is always balanced.
  while (stack.length) out += `</${stack.pop()}>`;
  return out;
}
