/**
 * Give a block its own shadow root, so the LMS page's styles can't reach in.
 *
 * The LMS and its themes style plain elements globally (for example
 * `button:hover` gets a grey gradient and a text shadow), and some of those
 * rules beat ours. Inside a shadow root only the stylesheets we add apply, and
 * `:host { all: initial }` stops inherited fonts and colours from the page too.
 *
 * Fonts are the exception: browsers ignore @font-face inside a shadow root,
 * so the block must also load the same stylesheet in the page (XBlock's
 * `frag.add_css_url` does this), where the design system's font faces live
 * under their own names.
 *
 * Returns the element to render into. Without stylesheet URLs (the Vite dev
 * preview, which injects CSS into the page) it renders in the page as before.
 */
export function mountInShadow(host: Element, stylesheetUrls: string[] = []): HTMLElement {
  if (stylesheetUrls.length === 0 || typeof host.attachShadow !== 'function') {
    return host as HTMLElement;
  }

  const root = host.shadowRoot ?? host.attachShadow({ mode: 'open' });
  root.replaceChildren();

  const base = document.createElement('style');
  base.textContent = ':host { all: initial; display: block; }';
  root.append(base);

  stylesheetUrls.forEach((href) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    root.append(link);
  });

  const container = document.createElement('div');
  root.append(container);
  return container;
}
