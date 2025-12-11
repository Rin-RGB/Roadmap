import React from 'react';
import { useRoadmap } from '../context/RoadmapContext';
import './Header.css';

const Header = () => {
  const { loadRoadmap, loadFromFile, exportRoadmap, roadmap, progress } = useRoadmap();
  const handleExport = () => {
    const data = exportRoadmap();
    if (!data) {
      alert('Нет данных для экспорта');
      return;
    }

    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `roadmap-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const loadExample = () => {
    fetch('/roadmap-example.json')
      .then(res => res.json())
      .then(data => {
        loadRoadmap(data);
      })
      .catch(error => {
        console.error('Ошибка загрузки примера:', error);
        alert('Не удалось загрузить пример');
      });
  };
  const getProgressColorClass = () => {
    if (progress < 34) return 'progress-low';
    if (progress < 67) return 'progress-medium';
    return 'progress-high';
  };
  const getStats = () => {
    if (!roadmap) return { total: 0, completed: 0, inProgress: 0 };

    const total = roadmap.items.length;
    const completed = roadmap.items.filter(item => item.status === 'completed').length;
    const inProgress = roadmap.items.filter(item => item.status === 'in_progress').length;
    return { total, completed, inProgress };
  };
  const stats = getStats();

    return (
      <header className="header">
        <h1>Roadmap Tracker</h1>

        <div className="controls">
          <input
            type="file"
            accept=".json"
            onChange={loadFromFile}
            id="file-input"
            style={{ display: 'none' }}
          />
          {/* <ThemeToggle /> */}
          <button
            className="button"
            onClick={() => document.getElementById('file-input').click()}
          >
            Загрузить JSON
          </button>

          <button
            className="button"
            onClick={handleExport}
            disabled={!roadmap}
          >
            Экспортировать
          </button>

          <button
            className="button"
            onClick={loadExample}
          >
            Пример карты
          </button>
        </div>

        {roadmap && (
        <div className="progress-section">
          <div className="progress-header">
            <h3 className="progress-title">Общий прогресс</h3>
            <div className="progress-percent">{progress}%</div>
          </div>
          
          <div className="progress-bar-container">
            <div
            className={`progress-bar ${getProgressColorClass()}`}
              style={{ width: `${progress}%` }}
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin="0"
              aria-valuemax="100"
            />
          </div>
          
          <div className="progress-stats">
            <div>
              <strong>{stats.completed}</strong> из <strong>{stats.total}</strong> тем завершено
            </div>
            <div>
              {stats.inProgress > 0 && (
                <span>
                  <span className="in-progress-indicator" />
                  {stats.inProgress} в работе
                </span>
              )}
            </div>
          </div>
        </div>
      )}

        {roadmap && (
          <div className="roadmap-info">
            <h2>{roadmap.title}</h2>
            <p>{roadmap.description}</p>
          </div>
        )}
        
      </header>
    );
  };

  export default Header;