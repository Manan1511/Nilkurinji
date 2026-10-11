import "server-only";

import sanitizeHtml from "sanitize-html";

export function sanitizeMerchantHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: ["a", "blockquote", "br", "em", "h2", "h3", "h4", "li", "ol", "p", "strong", "ul"],
    allowedAttributes: { a: ["href", "title"] },
    allowedSchemes: ["https", "mailto", "tel"],
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" }, true),
    },
  });
}
