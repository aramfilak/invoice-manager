import React, { useEffect, useState } from 'react';

const useDarkMode = (): {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
} => {
  const [darkMode, setDarkMode] = useState<boolean>(
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  useEffect(() => {
    const darkModeClass = 'dark-mode';
    const body = document.body;

    if (darkMode) {
      body.classList.add(darkModeClass);
    } else {
      body.classList.remove(darkModeClass);
    }
  }, [darkMode]);

  return { darkMode, setDarkMode };
};

export default useDarkMode;
