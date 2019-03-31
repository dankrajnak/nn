// @flow
import { useEffect } from "react";

const useHover = (
  ref: any,
  handler: ({ x: number, y: number }) => any
): void => {
  useEffect(() => {
    let listener = null;
    if (ref && ref.current) {
      listener = ref.current.addEventListener("mousemove", event =>
        handler({ x: event.offsetX, y: event.offsetY })
      );
    }
    return () => {
      listener && removeEventListener(listener);
    };
  });
};

export default useHover;
