import DOMPurify from "dompurify";
import { sanitizeHTMLServer } from "./sanitize-html-server";

/**
 * Sanitize untrusted HTML before passing to dangerouslySetInnerHTML.
 */
export function sanitizeHTML(html, options = {}) {
  if (typeof html !== "string" || !html) return "";
  if (typeof window !== "undefined" && DOMPurify.isSupported) {
    return DOMPurify.sanitize(html, {
      USE_PROFILES: { html: true },
      ADD_ATTR: ["target"],
      ...options,
    });
  }
  return sanitizeHTMLServer(html);
}

/** Sanitize inline SVG markup (e.g. QR codes). */
export function sanitizeSVG(svg) {
  if (typeof svg !== "string" || !svg) return "";
  if (typeof window !== "undefined" && DOMPurify.isSupported) {
    return DOMPurify.sanitize(svg, {
      USE_PROFILES: { svg: true, svgFilters: true },
    });
  }
  // No server-side SVG profile: SVG is rendered client-only (see share-cart-modal).
  return "";
}
