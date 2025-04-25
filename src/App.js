import React, { useState } from "react";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";

// Existing data for financial trainers
const statements = { /* ... existing statements data ... */ };
const subsections = { /* ... existing subsections data ... */ };
const figures = { /* ... existing figures data ... */ };

// Main App component with navigation
export default function App() {
  const pages = [
    "Profit/Loss Trainer",
    "Financial Position Trainer",
    "Cash Flow Forecast Trainer",
    "Practice Simulation"
  ];
  const [page, setPage] = useState(pages[0]);

  return (
    <div className="container py-4">
      <h1 className="display-6 text-center mb-4">IB Financial Statement Trainer</h1>
      {/* Navigation Tabs */}
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

      {/* Page Content */}
      {page === "Profit/Loss Trainer" && <StatementTrainer type="Profit or Loss" />}
      {page === "Financial Position Trainer" && <StatementTrainer type="Financial Position" />}
      {page === "Cash Flow Forecast Trainer" && <StatementTrainer type="Cash Flow" />}
      {page === "Practice Simulation" && <PracticeSimulation />}
    </div>
  );
}

// Reusable trainer component (Profit/Loss, Financial Position, Cash Flow)
function StatementTrainer({ type }) {
  // Copy in logic from existing App for DnD and rendering based on type
  return <div>/* Trainer for {type} */</div>;
}

// Practice Simulation Page
function PracticeSimulation() {
  const [q1, setQ1] = useState([]);
  const [b1, setB1] = useState("");
  const [b2, setB2] = useState("");
  const [b3, setB3] = useState("");
  const [c1, setC1] = useState("");
  const [score, setScore] = useState(null);

  const correctAdvantages = [
    "Limited liability",
    "Easier to raise capital"
  ];

  const calculateScore = () => {
    let pts = 0;
    // Q1
    pts += q1.filter(a => correctAdvantages.includes(a)).length;
    // B.i payback
    const pay = parseFloat(b1);
    if (Math.abs(pay - 3.25) < 0.1) pts += 2;
    // B.ii ARR
    const arr = parseFloat(b2);
    if (Math.abs(arr - 9.0625) < 0.5) pts += 2;
    // B.iii commentary (award 1 if non-empty)
    if (b3.trim().length > 10) pts += 1;
    // C. reason (award 1 if non-empty)
    if (c1.trim().length > 10) pts += 1;
    setScore(pts);
  };

  return (
    <div>
      <h2 className="h5 mb-3">Practice Exam Simulation (10 marks)</h2>
      {/* Question A */}
      <div className="mb-3">
        <label>1. State two advantages of a private limited company. [2]</label>
        {correctAdvantages.concat(
          ["Continues existence","Control over share sales"]
        ).map(opt => (
          <div className="form-check" key={opt}>
            <input
              className="form-check-input"
              type="checkbox"
              id={opt}
              value={opt}
              checked={q1.includes(opt)}
              onChange={e => {
                const val = e.target.value;
                setQ1(prev =>
                  prev.includes(val)
                    ? prev.filter(x => x !== val)
                    : [...prev, val]
                );
              }}
            />
            <label className="form-check-label" htmlFor={opt}>{opt}</label>
          </div>
        ))}
      </div>

      {/* Question B */}
      <div className="mb-3">
        <label>b(i). Payback period (years, e.g. 3.25):</label>
        <input
          type="number" step="0.01" className="form-control w-25"
          value={b1} onChange={e => setB1(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label>b(ii). Average rate of return (%):</label>
        <input
          type="number" step="0.01" className="form-control w-25"
          value={b2} onChange={e => setB2(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label>b(iii). Comment on your answer from b(i) or b(ii):</label>
        <textarea
          className="form-control"
          rows={3}
          value={b3}
          onChange={e => setB3(e.target.value)}
        />
      </div>

      {/* Question C */}
      <div className="mb-3">
        <label>c. Explain one reason for GM manufacturing on the ISS:</label>
        <textarea
          className="form-control"
          rows={2}
          value={c1}
          onChange={e => setC1(e.target.value)}
        />
      </div>

      {/* Submit and Score */}
      <div className="text-center">
        <button className="btn btn-primary me-2" onClick={calculateScore}>Submit</button>
        {score !== null && <div className="mt-3">Your score: {score} / 10</div>}
      </div>
    </div>
  );
}
