import { useEffect, useState } from "react";

export const useDebounce = <T>(value: T, delay: number, callback?: () => void) => {
  const [debouncedValue, setDebouncedValue] = useState<T>();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
      if (callback) callback();
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
