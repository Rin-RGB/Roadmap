// src/App.js
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { RoadmapProvider } from './context/RoadmapContext';
import Header from './components/Header';
import RoadmapList from './components/RoadmapList';
import TopicDetail from './components/TopicDetail';
import './App.css';

function App() {
  return (
    <Router>
      <RoadmapProvider>
        <div className="app">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<RoadmapList />} />
              <Route path="/topic/:id" element={<TopicDetail />} />
            </Routes>
          </main>
        </div>
      </RoadmapProvider>
    </Router>
  );
}

export default App;