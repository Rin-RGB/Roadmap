import React from 'react';
import { useRoadmap } from '../context/RoadmapContext';
import RoadmapItem from './RoadmapItem';
import './RoadmapList.css';

const RoadmapList = () => {
  const { roadmap } = useRoadmap();

  if (!roadmap) {
    return (
      <div className="empty-state">
        <p>Загрузите дорожную карту для начала работы</p>
        <p>Используйте кнопку "Пример карты" или загрузите свой JSON файл</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="title">Темы для изучения ({roadmap.items.length})</h3>
      <div className="roadmap-container">
        {roadmap.items.map(item => (
          <RoadmapItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default RoadmapList;