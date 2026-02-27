/**
 * Transforms _custom_json._display options into accordion-ready content.
 * Used by cart chip-item, order-status, and order-shipment.
 * Excludes options where alt === "Template Name". Never adds price.
 */

const buildCanvasChildren = (val) => {
  const children = [];
  if (val.text != null) children.push({ key: "text", value: val.text });
  if (val.previewImage) {
    children.push({ key: "preview", value: { imageUrl: val.previewImage } });
  }
  return children;
};

const isCanvasLike = (val) =>
  val &&
  typeof val === "object" &&
  !Array.isArray(val) &&
  ("text" in val || "previewImage" in val);

const handlers = {
  number: (opt) => ({ key: opt.key, children: [{ key: "value", value: opt.value }] }),
  imageUpload: (opt) => {
    const url = opt.value ?? opt.url;
    if (url == null) return { key: opt.key, children: [] };
    return {
      key: opt.key,
      children: [{ key: "value", value: { imageUrl: url } }],
    };
  },
  dropdownImage: (opt) => ({
    key: opt.key,
    children: [{ key: "value", value: opt.value }],
  }),
  productCanvas: (opt) => {
    const canvasData = opt.value;
    if (!canvasData || typeof canvasData !== "object") {
      return { key: opt.key, children: [] };
    }
    return { key: opt.key, children: buildCanvasChildren(canvasData) };
  },
};

const defaultHandler = (opt) => {
  const val = opt.value;
  if (isCanvasLike(val)) {
    return { key: opt.key, children: buildCanvasChildren(val) };
  }
  return { key: opt.key, children: [{ key: "value", value: opt.value }] };
};

/**
 * @param {Array} rawOptions - From _custom_json._display
 * @returns {Array} Accordion content (filtered, transformed, no price)
 */
export const transformDisplayToAccordionContent = (rawOptions = []) =>
  rawOptions
    .filter((opt) => opt.alt !== "Template Name")
    .map((opt) => {
      const customType = opt.customType || opt.type;
      const fn = handlers[customType] || defaultHandler;
      return fn(opt);
    })
    .filter((item) => item.children?.length > 0);
