// ==============================================================================
// STRICT XSS SANITIZATION & SECURITY HELPERS
// ==============================================================================

/**
 * Escapes unsafe characters to prevent Cross-Site Scripting (XSS)
 */
export function sanitize(str) {
  if (typeof str !== 'string') return '';
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };
  return str.replace(/[&<>"'/]/g, (char) => map[char]);
}

/**
 * Strips all HTML tags
 */
export function stripHTML(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/<[^>]*>?/gm, '');
}
