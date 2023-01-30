function throttle(callback, wait = 0) {
  let canRun = true;
  return function(...args) {
    if (!canRun)
      return;
    canRun = false;
    return new Promise((resolve) => {
      window.setTimeout(() => {
        canRun = true;
        resolve(callback.call(this, ...args));
      }, wait);
    });
  };
}
function getScrollElement(el = null) {
  if (!el) {
    return document.scrollingElement || document.documentElement;
  }
  return isElementOverflowScroll(el) ? el : getScrollElement(el.parentElement);
}
function isElementOverflowScroll(el) {
  if (el instanceof HTMLElement) {
    const style = getComputedStyle(el);
    return /(auto|scroll)/.test(style.overflow + style.overflowY);
  } else
    return false;
}

let scrollElRef;
const autoScrollWhileDragging = (options = {}) => {
  const { rootEl = document.body, speed = 0.3, gap = 100, throttleDelay = 20 } = options;
  const dragStartHandler = (e) => {
    if (!(e.target instanceof Node))
      return;
    const scrollEl = getScrollElement(e.target), rect = scrollEl.getBoundingClientRect();
    scrollElRef = { scrollEl, rect };
  };
  const dragHandler = throttle((e) => handleDrag(e, speed, gap), throttleDelay);
  const dragEndHandler = () => scrollElRef = void 0;
  autoScrollWhileDragging.dragStartHandler = dragStartHandler;
  autoScrollWhileDragging.dragHandler = dragHandler;
  autoScrollWhileDragging.dragEndHandler = dragEndHandler;
  rootEl.addEventListener("dragstart", dragStartHandler);
  rootEl.addEventListener("drag", dragHandler);
  rootEl.addEventListener("dragend", dragEndHandler);
  return () => {
    scrollElRef = void 0;
    rootEl.removeEventListener("dragstart", dragStartHandler);
    rootEl.removeEventListener("drag", dragHandler);
    rootEl.removeEventListener("dragend", dragEndHandler);
  };
};
function handleDrag(e, speed, gap) {
  if (!scrollElRef)
    return;
  const { scrollEl, rect } = scrollElRef;
  const MAX_INNER_GAP = gap;
  const step = (d) => Math.min(2 * MAX_INNER_GAP, MAX_INNER_GAP - d) * speed;
  if (isElementOverflowScroll(scrollEl)) {
    let top = rect.top + window.scrollY, bottom = rect.bottom + window.scrollY;
    if (e.clientY - top <= MAX_INNER_GAP) {
      scrollEl.scrollTop -= step(e.clientY - top);
    } else if (bottom - e.clientY <= MAX_INNER_GAP) {
      scrollEl.scrollTop += step(bottom - e.clientY);
    }
  } else {
    let top = rect.top + window.scrollY, bottom = Math.min(rect.bottom - window.scrollY, window.innerHeight);
    if (e.clientY - top <= MAX_INNER_GAP) {
      window.scrollTo({ top: window.scrollY - step(e.clientY - top) });
    } else if (bottom - e.clientY <= MAX_INNER_GAP) {
      window.scrollTo({ top: window.scrollY + step(bottom - e.clientY) });
    }
  }
}

export { autoScrollWhileDragging };
//# sourceMappingURL=index.js.map
