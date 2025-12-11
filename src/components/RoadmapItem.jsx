import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRoadmap } from '../context/RoadmapContext';
import './RoadmapItem.css';

const RoadmapItem = ({ item }) => {
  const navigate = useNavigate();
  const { updateItem } = useRoadmap();

  const statusOptions = [
    { value: 'not_started', label: 'Не начат' },
    { value: 'in_progress', label: 'В работе' },
    { value: 'completed', label: 'Выполнено' }
  ];

  const handleStatusChange = (newStatus) => {
    updateItem(item.id, { status: newStatus });
  };

  const handleCardClick = (e) => {
    // Проверяем, не кликнули ли по кнопке статуса
    if (!e.target.classList.contains('status-button')) {
      navigate(`/topic/${item.id}`);
    }
  };

  return (
    <div
      className={`card card-status-${item.status}`}
      onClick={handleCardClick}
    >
      <div className="card-header">
        
        <h4 className="card-title">{item.title}</h4>
        <p className="card-description">{item.description}</p>
      </div>

      <div className="status-buttons">
        {statusOptions.map((option) => (
          <button
            key={option.value}
            className={`status-button status-${option.value} ${item.status === option.value ? 'active' : ''
              }`}
            onClick={(e) => {
              e.stopPropagation(); // Останавливаем всплытие, чтобы карточка не кликалась
              handleStatusChange(option.value);
            }}
          >
            {option.label}
          </button>
        ))}
      </div>

      {item.notes && item.notes.trim() !== '' && (
          <div className="has-notes-badge" title="Есть заметки">
            Добавлены заметки пользователя
          </div>
        )}
      {item.links && item.links.length > 0 && (
        <div className="card-links">
          <strong>Полезные ссылки:</strong>
          <ul>
            {item.links.map((link, index) => (
              <li key={index}>
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RoadmapItem;