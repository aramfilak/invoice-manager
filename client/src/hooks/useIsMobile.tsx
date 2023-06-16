import { useEffect, useState } from 'react';

const useIsMobile = (): { isMobile: boolean } => {
  const [isMobile, setIsMobile] = useState<boolean>(window.matchMedia('(max-width: 48em)').matches);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.matchMedia('(max-width: 48em)').matches);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return { isMobile };
};

export default useIsMobile;
