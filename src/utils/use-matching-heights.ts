import { useRef, createRef, RefObject, useEffect } from 'react';
import { debounce } from 'lodash';

function createRefsArray<T = unknown>(length: number) {
  const refs = [];
  for (let i = 0; i < length; i += 1) {
    refs.push(createRef<T>());
  }
  return refs;
}

function useRefsArray<T = unknown>(length: number) {
  const refsArrayRef = useRef([] as RefObject<T>[]);
  if (refsArrayRef.current.length !== length) {
    refsArrayRef.current = createRefsArray<T>(length);
  }
  return refsArrayRef.current;
}

type ElementsByOffset = {
  [key: string]: {
    position: {
      top: number;
      height: number;
    };
    element: HTMLElement;
  }[];
};

const useMatchingHeights: (numElements: number) => RefObject<HTMLElement>[] = (
  numElements
) => {
  const refs = useRefsArray<HTMLElement>(numElements);

  useEffect(() => {
    const resizeElements = () => {
      refs.forEach((ref) => {
        // eslint-disable-next-line no-param-reassign
        (ref.current as HTMLElement).style.height = 'auto';
      });

      const clientRects = refs.map((ref) => {
        const element = ref.current as HTMLElement;
        const rect = element.getBoundingClientRect();
        return {
          position: {
            top: window.pageYOffset - rect.top,
            height: rect.height,
          },
          element,
        };
      });

      const elementsByOffset = clientRects.reduce(
        (acc, { element, position: { top, height } }) => {
          const elementsAtHeight = acc[`${top}`] || [];
          elementsAtHeight.push({ element, position: { top, height } });
          acc[`${top}`] = elementsAtHeight;
          return acc;
        },
        {} as ElementsByOffset
      );

      Object.keys(elementsByOffset).forEach((heightKey) => {
        const maxHeight = Math.max(
          ...elementsByOffset[heightKey].map(({ position }) => position.height)
        );

        elementsByOffset[heightKey].forEach(({ element }) => {
          // eslint-disable-next-line no-param-reassign
          element.style.height = `${maxHeight}px`;
        });
      });
    };

    resizeElements();

    const resizeElementsDebounced = debounce(resizeElements, 100);
    window.addEventListener('resize', resizeElementsDebounced);
    return () => window.removeEventListener('resize', resizeElementsDebounced);
  }, [refs]);

  return refs;
};

export default useMatchingHeights;
