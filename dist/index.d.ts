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
declare const autoScrollWhileDragging: AutoScrollWhileDragging;

export { autoScrollWhileDragging };
