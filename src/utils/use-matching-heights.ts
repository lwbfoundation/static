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

type ElementPosition = {
  position: {
    top: number;
    height: number;
  };
  element: HTMLElement;
};

type GroupedElements = {
  [key: string]: ElementPosition[];
};

const groupElementsVertically = (
  elementPositions: (ElementPosition | null)[]
) =>
  elementPositions.reduce((acc, elementPosition) => {
    if (!elementPosition) return acc;
    const {
      element,
      position: { top, height },
    } = elementPosition;
    const elementsAtHeight = acc[`${top}`] || [];
    elementsAtHeight.push({ element, position: { top, height } });
    acc[`${top}`] = elementsAtHeight;
    return acc;
  }, {} as GroupedElements);

type UseMatchingHeightsOptions = {
  shouldGroupElementsVertically?: boolean;
};

const useMatchingHeights: (
  numElements: number,
  options?: UseMatchingHeightsOptions
) => RefObject<HTMLElement>[] = (
  numElements,
  { shouldGroupElementsVertically = true } = {}
) => {
  const refs = useRefsArray<HTMLElement>(numElements);

  useEffect(() => {
    const resizeElements = () => {
      refs.forEach((ref) => {
        // eslint-disable-next-line no-param-reassign
        if (ref.current) ref.current.style.height = 'auto';
      });

      const elementPositions = refs.map((ref) => {
        const element = ref.current;
        if (!element) return null;
        const rect = element.getBoundingClientRect();
        return {
          position: {
            top: window.pageYOffset - rect.top,
            height: rect.height,
          },
          element,
        };
      });

      const groupedElements: GroupedElements = shouldGroupElementsVertically
        ? groupElementsVertically(elementPositions)
        : ({ all: elementPositions } as GroupedElements);

      Object.keys(groupedElements).forEach((groupKey) => {
        const maxHeight = Math.max(
          ...groupedElements[groupKey].map(({ position }) => position.height)
        );

        groupedElements[groupKey].forEach(({ element }) => {
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
