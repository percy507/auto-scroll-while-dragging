export function throttle<T extends unknown[], U>(
  callback: (...args: T) => PromiseLike<U> | U,
  /** Default is 0. */
  wait = 0,
) {
  let canRun = true;
  return function (this: unknown, ...args: T): Promise<U> | void {
    if (!canRun) return;
    canRun = false;
    return new Promise((resolve) => {
      window.setTimeout(() => {
        canRun = true;
        resolve(callback.call(this, ...args));
      }, wait);
    });
  };
}

/**
 * Returns the passed element if scrollable, else the closest parent
 * that will, up to the entire document scrolling element
 */
export function getScrollElement(el: Node | null = null): HTMLElement {
  if (!el) {
    return (document.scrollingElement || document.documentElement) as HTMLElement;
  }
  return isElementOverflowScroll(el)
    ? (el as HTMLElement)
    : getScrollElement(el.parentElement);
}

export function isElementOverflowScroll(el: Node) {
  if (el instanceof HTMLElement) {
    const style = getComputedStyle(el);
    return /(auto|scroll)/.test(style.overflow + style.overflowY);
  } else return false;
}
