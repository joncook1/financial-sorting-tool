// src/App.js
import React, { useState } from 'react';
import StatementTrainer from './StatementTrainer';
import PracticeSimulation from './PracticeSimulation';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function App() {
  const pages = [
    'Profit/Loss Trainer',
    'Financial Position Trainer',
    'Cash Flow Forecast Trainer',
    'Practice Simulation'
  ];
  const [page, setPage] = useState(pages[0]);

  return (
    <div className="container py-4">
      <h1 className="display-6 text-center mb-4">IB Financial Statement Trainer</h1>
      <ul className="nav nav-tabs mb-4">
        {pages.map(p => (
          <li className="nav-item" key={p}>
            <button
              className={`nav-link ${page === p ? 'active' : ''}`}
              onClick={() => setPage(p)}
            >{p}</button>
          </li>
        ))}
      </ul>
      {page === 'Profit/Loss Trainer' && <StatementTrainer type="Profit or Loss" />}
      {page === 'Financial Position Trainer' && <StatementTrainer type="Financial Position" />}
      {page === 'Cash Flow Forecast Trainer' && <StatementTrainer type="Cash Flow" />}
      {page === 'Practice Simulation' && <PracticeSimulation />}
    </div>
  );
}
