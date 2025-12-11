import React, { createContext, useState, useContext } from 'react';

const RoadmapContext = createContext();

export const useRoadmap = () => useContext(RoadmapContext);

export const RoadmapProvider = ({ children }) => {
  const [roadmap, setRoadmap] = useState(null);
  const [loading] = useState(false);

  // Загрузка JSON
  const loadRoadmap = (jsonData) => {
    try {
      const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
      setRoadmap(data);
    } catch (error) {
      console.error('Ошибка загрузки JSON:', error);
      alert('Неверный формат JSON файла');
    }
  };

  // Загрузка из файла
  const loadFromFile = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        loadRoadmap(data);
      } catch (error) {
        alert('Ошибка чтения файла. Проверьте формат JSON.');
      }
    };
    reader.readAsText(file);
  };

  // Экспорт
  const exportRoadmap = () => {
    if (!roadmap) return null;
    return JSON.stringify(roadmap, null, 2);
  };

  // Обновление пункта
  const updateItem = (itemId, updates) => {
    setRoadmap(prev => ({
      ...prev,
      items: prev.items.map(item => 
        item.id === itemId ? { ...item, ...updates } : item
      )
    }));
  };

  // Расчет прогресса (простая функция)
  const calculateProgress = () => {
    if (!roadmap || !roadmap.items || roadmap.items.length === 0) {
      return 0;
    }
    const completedItems = roadmap.items.filter(item => item.status === 'completed').length;
    return Math.round((completedItems / roadmap.items.length) * 100);
  };

  return (
    <RoadmapContext.Provider value={{
      roadmap,
      loading,
      loadRoadmap,
      loadFromFile,
      exportRoadmap,
      updateItem,
      progress: calculateProgress() // Вычисляем и передаем
    }}>
      {children}
    </RoadmapContext.Provider>
  );
};