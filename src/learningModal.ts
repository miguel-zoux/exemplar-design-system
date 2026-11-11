/**
 * Open an interactive in a modal that fills the browser window, from inside
 * Open edX's learning app.
 *
 * A block in the learning app runs in the unit iframe, which is only as big as
 * the unit's content, so it can't cover the window itself. The learning app
 * listens for a `plugin.modal` message from that iframe and opens a window-sized
 * modal (Paragon's "fullscreen" size) with an iframe of the URL we send. A
 * `plugin.modal-close` message closes it, and the learning app then passes
 * `plugin.modal-close` back to the unit iframe.
 *
 * The URL is the block's own LMS render (`/xblock/<usage id>`) with
 * LAUNCH_PARAM added, so the block starts launched inside the modal. The unit's
 * own query string is kept: in Studio's Preview it carries `preview=1`, which
 * draft content needs.
 *
 * Two side effects of the learning app to undo:
 * - LMS block pages report their height with `plugin.resize`, and the learning
 *   app applies it to the unit iframe without checking which iframe sent it.
 *   The page inside the modal is short (the interactive is a fixed overlay), so
 *   it shrinks the unit iframe. When the modal closes, the unit iframe reports
 *   its real height again.
 * - That resizing moves the page's scroll position. `plugin.videoFullScreen`
 *   (meant for videos) makes the learning app remember the scroll position on
 *   `open: true` and restore it on `open: false`, so we bracket the modal with it.
 */
export const LAUNCH_PARAM = 'wgu_launch';

/** True inside the modal opened by openLearningModal. */
export function isLaunchedInModal(): boolean {
  return new URLSearchParams(window.location.search).has(LAUNCH_PARAM);
}

/**
 * True where a fixed overlay covers the browser window: a top-level page, or
 * inside the learning app's modal. In any other iframe (Studio's unit page) it
 * would only cover the iframe; show the interactive as an in-place panel there.
 */
export function canCoverWindow(): boolean {
  return window.parent === window || isLaunchedInModal();
}

/** True in the learning app's unit iframe, where openLearningModal works. */
export function canUseLearningModal(): boolean {
  return window.parent !== window
    && window.location.pathname.startsWith('/xblock/')
    && !isLaunchedInModal();
}

export function launchUrl(usageId: string): string {
  const params = new URLSearchParams(window.location.search);
  params.set(LAUNCH_PARAM, '1');
  return `${window.location.origin}/xblock/${usageId}?${params.toString()}`;
}

export function openLearningModal(url: string, title: string) {
  window.parent.postMessage({ type: 'plugin.videoFullScreen', payload: { open: true } }, '*');
  window.parent.postMessage({
    type: 'plugin.modal',
    payload: {
      url,
      title,
      isFullscreen: true,
      // The modal body doesn't give the iframe a height, so "100%" collapses it.
      height: '100vh',
      // Paragon's padding utility: let the interactive reach the window's edges.
      modalBodyClassName: 'p-0',
    },
  }, '*');
}

/** From inside the modal: ask the learning app to close it. */
export function closeLearningModal() {
  window.parent.postMessage({ type: 'plugin.modal-close' }, '*');
}

/** In the unit iframe, after the modal: restore its height and the page's scroll position. */
function restoreUnitFrame() {
  // The same measure the LMS reports (courseware-chromeless.html).
  const content = document.getElementById('content') ?? document.body;
  window.parent.postMessage({
    type: 'plugin.resize',
    payload: { width: content.offsetWidth, height: content.offsetHeight },
  }, '*');
  // Restore the scroll position once the learning app has re-applied the height;
  // until then the page is too short to scroll back.
  window.setTimeout(() => {
    window.parent.postMessage({ type: 'plugin.videoFullScreen', payload: { open: false } }, '*');
  }, 150);
}

/** In the unit iframe: run `callback` when the learning app closes the modal. */
export function onLearningModalClosed(callback: () => void): () => void {
  const handle = (event: MessageEvent) => {
    if (event.source === window.parent && event.data?.type === 'plugin.modal-close') {
      restoreUnitFrame();
      callback();
    }
  };
  window.addEventListener('message', handle);
  return () => window.removeEventListener('message', handle);
}
