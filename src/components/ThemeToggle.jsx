import React, { useState, useEffect } from 'react';

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(() => {
    // Проверяем сохранённую тему или системные настройки
    const saved = localStorage.getItem('roadmap-theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    // Переключаем класс на body или html
    const root = document.documentElement;
    
    if (isDark) {
      root.classList.add('dark-theme');
      root.classList.remove('light-theme');
      localStorage.setItem('roadmap-theme', 'dark');
    } else {
      root.classList.add('light-theme');
      root.classList.remove('dark-theme');
      localStorage.setItem('roadmap-theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <button 
      className="theme-toggle-button"
      onClick={toggleTheme}
      title={isDark ? 'Переключить на светлую тему' : 'Переключить на тёмную тему'}
      aria-label="Переключить тему"
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  );
};

export default ThemeToggle;