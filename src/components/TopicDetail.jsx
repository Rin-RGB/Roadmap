import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useRoadmap } from '../context/RoadmapContext';
import './TopicDetail.css';

const TopicDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { roadmap, updateItem } = useRoadmap();
  const [item, setItem] = useState(null);
  const [note, setNote] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  // Находим нужный пункт по ID и его индекс
  useEffect(() => {
    if (roadmap && id) {
      const foundItem = roadmap.items.find(item => item.id === id);
      if (foundItem) {
        setItem(foundItem);
        setNote(foundItem.notes || '');
        setDueDate(foundItem.dueDate || '');
        
        // Находим индекс текущего элемента
        const index = roadmap.items.findIndex(item => item.id === id);
        setCurrentIndex(index);
        setTotalItems(roadmap.items.length);
      }
    }
  }, [roadmap, id]);

  // Проверяем, есть ли несохранённые изменения
  useEffect(() => {
    if (item) {
      setHasUnsavedChanges(note !== item.notes);
    }
  }, [note, item]);

  // Сохраняем заметку
  const saveNote = () => {
    if (item) {
      updateItem(item.id, { notes: note });
      setHasUnsavedChanges(false);
      alert('Заметка сохранена!');
    }
  };

  // Сохраняем дату
  const saveDueDate = () => {
    if (item) {
      updateItem(item.id, { dueDate: dueDate || null });
      alert('Дата сохранена!');
    }
  };

  // Удаляем заметку
  const deleteNote = () => {
    if (window.confirm('Удалить заметку?')) {
      setNote('');
      if (item) {
        updateItem(item.id, { notes: '' });
      }
      setHasUnsavedChanges(false);
    }
  };

  // Изменение статуса
  const handleStatusChange = (newStatus) => {
    if (item) {
      updateItem(item.id, { status: newStatus });
      setItem({ ...item, status: newStatus });
    }
  };

  const goToPrevious = useCallback(() => {
    if (currentIndex > 0) {
      const prevItem = roadmap.items[currentIndex - 1];
      if (hasUnsavedChanges) {
        if (window.confirm('У вас есть несохранённые изменения. Перейти без сохранения?')) {
          navigate(`/topic/${prevItem.id}`);
        }
      } else {
        navigate(`/topic/${prevItem.id}`);
      }
    }
  }, [currentIndex, roadmap, hasUnsavedChanges, navigate]);

  const goToNext = useCallback(() => {
    if (currentIndex < totalItems - 1) {
      const nextItem = roadmap.items[currentIndex + 1];
      if (hasUnsavedChanges) {
        if (window.confirm('У вас есть несохранённые изменения. Перейти без сохранения?')) {
          navigate(`/topic/${nextItem.id}`);
        }
      } else {
        navigate(`/topic/${nextItem.id}`);
      }
    }
  }, [currentIndex, roadmap, hasUnsavedChanges, navigate, totalItems]);

  // Обработка клавиш клавиатуры
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [goToNext, goToPrevious]); 

  const handleBackClick = (e) => {
    if (hasUnsavedChanges) {
      e.preventDefault();
      
      const userChoice = window.confirm(
        'У вас есть несохранённые изменения в заметке.\n\n' +
        'Выйти без сохранения?\n\n');
      
      if (userChoice) {
        navigate('/');
      }
    }
  };

  if (!item) {
    return (
      <div className="not-found">
        <p>Тема не найдена</p>
        <Link to="/" className="back-link">← На главную</Link>
      </div>
    );
  }

  const getStatusText = (status) => {
    const statusMap = {
      'not_started': 'Не начат',
      'in_progress': 'В работе',
      'completed': 'Выполнено'
    };
    return statusMap[status] || status;
  };

  return (
    <div className="topic-detail">
      {/* Верхняя навигация */}
      <div className="topic-navigation">
        <Link 
          to="/" 
          className={`back-link ${hasUnsavedChanges ? 'has-unsaved' : ''}`}
          onClick={handleBackClick}
        >
          ← К списку
        </Link>
        
        <div className="nav-controls">
          <button 
            onClick={goToPrevious}
            disabled={currentIndex === 0}
            className="nav-arrow nav-prev"
            title="Предыдущая тема (←)"
          >
            ←
          </button>
          
          <div className="nav-counter">
            {currentIndex + 1} / {totalItems}
          </div>
          
          <button 
            onClick={goToNext}
            disabled={currentIndex === totalItems - 1}
            className="nav-arrow nav-next"
            title="Следующая тема (→)"
          >
            →
          </button>
        </div>
      </div>

      {/* Индикатор несохранённых изменений */}
      {hasUnsavedChanges && (
        <div className="unsaved-changes-alert">
          ⚠️ У вас есть несохранённые изменения в заметке
        </div>
      )}

      <div className="topic-header">
        <h1>{item.title}</h1>
        <div className={`status-badge status-topic-${item.status}`}>
          {getStatusText(item.status)}
        </div>
      </div>

      <div className="topic-content">
        <section className="description-section">
          <h2>Описание</h2>
          <p>{item.description}</p>
        </section>

        {item.links && item.links.length > 0 && (
          <section className="links-section">
            <h2>Полезные ссылки</h2>
            <ul>
              {item.links.map((link, index) => (
                <li key={index}>
                  <a href={link} target="_blank" rel="noopener noreferrer">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="notes-section">
          <h2>Мои заметки {hasUnsavedChanges && '• НЕ СОХРАНЕНО'}</h2>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Добавьте свои заметки, конспекты, полезные команды..."
            rows="6"
            className="notes-textarea"
          />
          <div className="notes-buttons">
            <button 
              onClick={saveNote} 
              className={`btn ${hasUnsavedChanges ? 'btn-primary unsaved' : 'btn-primary'}`}
            >
              {hasUnsavedChanges ? '💾 СОХРАНИТЬ ЗАМЕТКУ' : '💾 Заметка сохранена'}
            </button>
            <button onClick={deleteNote} className="btn btn-secondary">
              🗑️ Удалить заметку
            </button>
          </div>
        </section>

        <section className="status-section">
          <h2>Управление статусом</h2>
          <div className="status-buttons">
            <button
              className={`status-btn ${item.status === 'not_started' ? 'active' : ''}`}
              onClick={() => handleStatusChange('not_started')}
            >
              Не начат
            </button>
            <button
              className={`status-btn ${item.status === 'in_progress' ? 'active' : ''}`}
              onClick={() => handleStatusChange('in_progress')}
            >
              В работе
            </button>
            <button
              className={`status-btn ${item.status === 'completed' ? 'active' : ''}`}
              onClick={() => handleStatusChange('completed')}
            >
              Выполнено
            </button>
          </div>
        </section>

        <section className="due-date-section">
          <h2>Планирование</h2>
          <div className="due-date-control">
            <label htmlFor="due-date">Желаемая дата завершения:</label>
            <input
              type="date"
              id="due-date"
              value={dueDate || ''}
              onChange={(e) => setDueDate(e.target.value)}
              className="date-input"
            />
            <button onClick={saveDueDate} className="btn btn-primary">
              📅 Сохранить дату
            </button>
          </div>
          {dueDate && (
            <p className="due-date-info">
              Запланировано на: <strong>{new Date(dueDate).toLocaleDateString('ru-RU')}</strong>
            </p>
          )}
        </section>

        {/* Навигация внизу */}
        <div className="bottom-navigation">
          <button 
            onClick={goToPrevious}
            disabled={currentIndex === 0}
            className="btn btn-outline"
          >
            ← Предыдущая тема
          </button>
          
          <div className="keyboard-hint">
            Используйте ← → на клавиатуре для навигации
          </div>
          
          <button 
            onClick={goToNext}
            disabled={currentIndex === totalItems - 1}
            className="btn btn-outline"
          >
            Следующая тема →
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopicDetail;