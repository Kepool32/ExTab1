import { useEffect } from 'react';

export const usePreventCopy = () => {
  useEffect(() => {
    const preventCopy = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
        e.preventDefault();
      }
    };

    const preventContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
        e.preventDefault();
      }
    };

    const preventKeyCopy = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === 'c' || e.key === 'v' || e.key === 'x' || e.key === 'a') &&
        target.tagName !== 'INPUT' &&
        target.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
      }
    };

    const preventSelect = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
        if ((e as MouseEvent).detail > 1) {
          e.preventDefault();
        }
      }
    };

    const preventMouseSelect = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
        if (e.detail > 1) {
          e.preventDefault();
        }
      }
    };

    document.addEventListener('copy', preventCopy);
    document.addEventListener('cut', preventCopy);
    document.addEventListener('contextmenu', preventContextMenu);
    document.addEventListener('keydown', preventKeyCopy);
    document.addEventListener('selectstart', preventSelect);
    document.addEventListener('mousedown', preventMouseSelect);

    return () => {
      document.removeEventListener('copy', preventCopy);
      document.removeEventListener('cut', preventCopy);
      document.removeEventListener('contextmenu', preventContextMenu);
      document.removeEventListener('keydown', preventKeyCopy);
      document.removeEventListener('selectstart', preventSelect);
      document.removeEventListener('mousedown', preventMouseSelect);
    };
  }, []);
};
