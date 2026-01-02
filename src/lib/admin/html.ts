import sanitizeHtml from 'sanitize-html';

/**
 * Sanitize HTML content to prevent XSS attacks.
 *
 * This is used for public rendering of post content.
 */
export function sanitizeContent(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [
      'p',
      'br',
      'strong',
      'em',
      'u',
      's',
      'sub',
      'sup',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'ul',
      'ol',
      'li',
      'blockquote',
      'a',
      'img',
      'code',
      'pre',
      'table',
      'thead',
      'tbody',
      'tr',
      'th',
      'td',
      'span',
      'mark',
      'hr',
      'div',
      'iframe',
      'audio',
      'source',
      'figure',
      'figcaption',
    ],
    allowedAttributes: {
      a: ['href', 'title', 'target', 'rel'],
      img: ['src', 'alt', 'width', 'height', 'title', 'class'],
      span: ['style'],
      mark: ['style', 'data-color'],
      p: ['style'],
      h1: ['id', 'style'],
      h2: ['id', 'style'],
      h3: ['id', 'style'],
      h4: ['id', 'style'],
      h5: ['id', 'style'],
      h6: ['id', 'style'],
      table: ['align'],
      th: ['colspan', 'rowspan', 'style'],
      td: ['colspan', 'rowspan', 'style'],
      div: ['data-page-break', 'class'],
      iframe: [
        'src',
        'title',
        'allow',
        'allowfullscreen',
        'frameborder',
        'loading',
        'class',
        'data-embed',
      ],
      audio: ['src', 'title', 'controls', 'data-embed'],
      source: ['src', 'type'],
      figure: ['class'],
      figcaption: ['class'],
      code: ['class'],
      pre: ['class'],
    },
    allowedStyles: {
      span: {
        color: [/^#(?:[0-9a-fA-F]{3}){1,2}$/],
        'background-color': [/^#(?:[0-9a-fA-F]{3}){1,2}$/],
        'font-size': [/^\d+(?:\.\d+)?(px|rem|em|%)$/],
        'font-family': [/^[^;]+$/],
      },
      mark: {
        'background-color': [/^#(?:[0-9a-fA-F]{3}){1,2}$/],
      },
      p: {
        'text-align': [/^(left|center|right|justify)$/],
        'line-height': [/^\d+(?:\.\d+)?$/],
      },
      h1: {
        'text-align': [/^(left|center|right|justify)$/],
        'line-height': [/^\d+(?:\.\d+)?$/],
      },
      h2: {
        'text-align': [/^(left|center|right|justify)$/],
        'line-height': [/^\d+(?:\.\d+)?$/],
      },
      h3: {
        'text-align': [/^(left|center|right|justify)$/],
        'line-height': [/^\d+(?:\.\d+)?$/],
      },
      h4: {
        'text-align': [/^(left|center|right|justify)$/],
        'line-height': [/^\d+(?:\.\d+)?$/],
      },
      h5: {
        'text-align': [/^(left|center|right|justify)$/],
        'line-height': [/^\d+(?:\.\d+)?$/],
      },
      h6: {
        'text-align': [/^(left|center|right|justify)$/],
        'line-height': [/^\d+(?:\.\d+)?$/],
      },
      th: {
        'text-align': [/^(left|center|right|justify)$/],
      },
      td: {
        'text-align': [/^(left|center|right|justify)$/],
      },
    },
    allowedClasses: {
      div: ['page-break', 'embed-wrapper'],
      iframe: ['embed-iframe'],
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    allowedIframeHostnames: [
      'www.youtube.com',
      'youtube.com',
      'player.vimeo.com',
      'docs.google.com',
      'drive.google.com',
    ],
    disallowedTagsMode: 'discard',
  });
}

/**
 * Validate that HTML content is not empty or just whitespace.
 */
export function isContentValid(html: string): boolean {
  const stripped = sanitizeContent(html)
    .replace(/<[^>]*>/g, '')
    .trim();
  return stripped.length > 0;
}

/**
 * Extract plain text from HTML content.
 */
export function htmlToPlainText(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [],
    allowedAttributes: {},
  }).trim();
}
