import { useState, ChangeEvent, useCallback } from 'react';

export const useInput = (initialValue: string = '') => {
  const [value, setValue] = useState(initialValue);

  const onChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValue(e.target.value);
  }, []);

  const reset = useCallback(() => {
    setValue(initialValue);
  }, [initialValue]);

  const setValueDirect = useCallback((newValue: string) => {
    setValue(newValue);
  }, []);

  return {
    value,
    onChange,
    reset,
    setValue: setValueDirect,
  };
};
