import { useEffect, useRef, useState } from 'react';

const useOnceOnIntersect = (callback, options) => {
  const [hasIntersected, setHasIntersected] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (hasIntersected) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        callback();
        setHasIntersected(true);
        observer.unobserve(ref.current); // Stop observing after the first intersection
      }
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [callback, options, hasIntersected]);

  return ref;
};

export default useOnceOnIntersect;
