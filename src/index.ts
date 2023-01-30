import { getScrollElement, isElementOverflowScroll, throttle } from './helpers';

let scrollElRef: undefined | { scrollEl: HTMLElement; rect: DOMRect };

interface AutoScrollWhileDragging {
  (options?: {
    /** The root element which will listen the drag event. Default is `document.body`. */
    rootEl?: HTMLElement;
    /** The scroll speed, default is 0.3 */
    speed?: number;
    /** The max gap between mouse pointer and the bound of scroll element. Default is `100`, unit is `px`. */
    gap?: number;
    /** Define delay of throttle dragging. Default is `20`, unit is `ms`. */
    throttleDelay?: number;
  }): () => void;
  dragStartHandler: (e: DragEvent) => void;
  dragHandler: (e: DragEvent) => void;
  dragEndHandler: () => void;
}

/**
 * Enhance the auto-scrolling behavior while dragging.
 * It returns a function which will clear effects.
 */
export const autoScrollWhileDragging = ((options = {}) => {
  const { rootEl = document.body, speed = 0.3, gap = 100, throttleDelay = 20 } = options;

  const dragStartHandler = (e: DragEvent) => {
    if (!(e.target instanceof Node)) return;
    const scrollEl = getScrollElement(e.target),
      rect = scrollEl.getBoundingClientRect();
    scrollElRef = { scrollEl, rect };
  };
  const dragHandler = throttle(
    (e: DragEvent) => handleDrag(e, speed, gap),
    throttleDelay,
  );
  const dragEndHandler = () => (scrollElRef = undefined);

  // export the drag-related handlers for some specific cases to handle
  // the drag event themself, eg: dragging in a virtual list with `react-dnd`
  autoScrollWhileDragging.dragStartHandler = dragStartHandler;
  autoScrollWhileDragging.dragHandler = dragHandler;
  autoScrollWhileDragging.dragEndHandler = dragEndHandler;

  rootEl.addEventListener('dragstart', dragStartHandler);
  rootEl.addEventListener('drag', dragHandler);
  rootEl.addEventListener('dragend', dragEndHandler);

  return () => {
    scrollElRef = undefined;
    rootEl.removeEventListener('dragstart', dragStartHandler);
    rootEl.removeEventListener('drag', dragHandler);
    rootEl.removeEventListener('dragend', dragEndHandler);
  };
}) as AutoScrollWhileDragging;

// Auto scroll while dragging
function handleDrag(e: DragEvent, speed: number, gap: number) {
  if (!scrollElRef) return;
  const { scrollEl, rect } = scrollElRef;
  const MAX_INNER_GAP = gap;
  const step = (d: number) => Math.min(2 * MAX_INNER_GAP, MAX_INNER_GAP - d) * speed;

  if (isElementOverflowScroll(scrollEl)) {
    let top = rect.top + window.scrollY,
      bottom = rect.bottom + window.scrollY;
    if (e.clientY - top <= MAX_INNER_GAP) {
      scrollEl.scrollTop -= step(e.clientY - top);
    } else if (bottom - e.clientY <= MAX_INNER_GAP) {
      scrollEl.scrollTop += step(bottom - e.clientY);
    }
  } else {
    // if the scroll element‘s overflow is not `scroll` or `auto`, set `scrollTop`
    // won't scroll the element, then we need use `window.scrollTo`
    let top = rect.top + window.scrollY,
      bottom = Math.min(rect.bottom - window.scrollY, window.innerHeight);
    if (e.clientY - top <= MAX_INNER_GAP) {
      window.scrollTo({ top: window.scrollY - step(e.clientY - top) });
    } else if (bottom - e.clientY <= MAX_INNER_GAP) {
      window.scrollTo({ top: window.scrollY + step(bottom - e.clientY) });
    }
  }
}
