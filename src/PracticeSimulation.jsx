// src/PracticeSimulation.jsx
import React, { useState } from 'react';
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';

export default function PracticeSimulation() {
  // Case Study Prompt
  const prompt = `Galileo Manufacturing Ltd. (GM) is a private limited company that operates a manufacturing facility on the International Space Station. Using a 3D printer, GM manufactures parts and tools for NASA. NASA is GM’s sole customer. A new manufacturing facility will cost $40 million, and expected profit over four years is shown.`;

  // Financial Figures Table
  const profitData = [
    { year: 1, profit: 8 },
    { year: 2, profit: 12 },
    { year: 3, profit: 16 },
    { year: 4, profit: 16 }
  ];
  const residualValue = 2.5;

  // Drag-and-drop options
  const advOptions = ['Limited liability', 'Easier to raise capital', 'Continuity on death', 'Share sale control'];
  const paybackOptions = ['3.25', '3.0', '4.0', '3.5'];
  const arrOptions = ['9.06', '9.5', '8.0', '10.0'];
  const reasonOptions = ['Infrastructure availability', 'Proximity to market', 'Expertise development', 'Profitability'];

  // Formula build tokens
  const formulaTokens = ['(', '54.5', '-', '40', ')', '÷', '4', '×', '100%'];
  const correctFormula = ['(', '54.5', '-', '40', ')', '÷', '4', '×', '100%'];

  // State
  const [placements, setPlacements] = useState({});
  const [commentary, setCommentary] = useState('');
  const [score, setScore] = useState(null);
  const [showResults, setShowResults] = useState(false);

  // Handle drag end
  const handleDragEnd = ({ active, over }) => {
    if (over && active) {
      const updated = {};
      // keep other placements
      Object.entries(placements).forEach(([slot,val])=>{
        if (val!==active.id) updated[slot]=val;
      });
      updated[over.id] = active.id;
      setPlacements(updated);
    }
  };

  // Grading logic
  const correctAdvs = ['Limited liability','Easier to raise capital'];
  const correctPayback = '3.25';
  const correctArr = '9.06';
  const correctReasons = ['Infrastructure availability','Proximity to market','Expertise development'];

  const handleSubmit = () => {
    let pts = 0;
    // Q1
    correctAdvs.forEach((adv, idx) => {
      const slot = `adv${idx+1}`;
      if (placements[slot] === adv) pts++;
    });
    // Q2.i
    if (placements['payback'] === correctPayback) pts += 2;
    // Q2.ii
    if (placements['arr'] === correctArr) pts += 2;
    // Q2.iii
    if (commentary.trim().length > 10) pts += 1;
    // Q3
    if (correctReasons.includes(placements['reason'])) pts += 2;

    setScore(pts);
    setShowResults(true);
  };

  // Draggable item
  function DraggableItem({ id }) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
    const style = transform ? { transform: `translate(${transform.x}px, ${transform.y}px)` } : undefined;
    return (
      <div ref={setNodeRef} style={style} {...listeners} {...attributes}
           className="border bg-light text-center p-2 m-1 rounded">
        {id}
      </div>
    );
  }

  // Droppable slot
  function DroppableSlot({ id }) {
    const { isOver, setNodeRef } = useDroppable({ id });
    const val = placements[id];
    const base = isOver ? 'border-primary bg-light' : 'border-secondary bg-white';
    return (
      <div ref={setNodeRef}
           className={`border ${base} p-3 text-center mb-2 rounded`} style={{minHeight:'3rem',width:'8rem'}}>
        {val || <span className="text-muted">Drop here</span>}
      </div>
    );
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      {/* Case Prompt & Table */}
      <div className="mb-4">
        <p>{prompt}</p>
        <table className="table table-bordered w-auto mb-4">
          <thead><tr><th>Year</th><th>Profit ($m)</th></tr></thead>
          <tbody>
            {profitData.map(r=>(
              <tr key={r.year}><td>{r.year}</td><td>{r.profit}</td></tr>
            ))}
            <tr><td>Residual Value</td><td>{residualValue}</td></tr>
          </tbody>
        </table>
      </div>

      {/* Q1 */}
      <div className="mb-4">
        <h4>1. State two advantages of a private limited company. [2]</h4>
        <div className="d-flex mb-2">
          <DroppableSlot id="adv1" />
          <DroppableSlot id="adv2" />
        </div>
        <div className="d-flex flex-wrap">
          {advOptions.map(opt=><DraggableItem id={opt} key={opt}/>)}
        </div>
      </div>

      {/* Q2.i */}
      <div className="mb-4">
        <h4>2.i Payback period (years). [2]</h4>
        <DroppableSlot id="payback" />
        <div className="d-flex flex-wrap mt-2">
          {paybackOptions.map(opt=><DraggableItem id={opt} key={opt}/>)}
        </div>
      </div>

      {/* Q2.ii */}
      <div className="mb-4">
        <h4>2.ii Average rate of return (%) [2]</h4>
        <DroppableSlot id="arr" />
        <div className="d-flex flex-wrap mt-2">
          {arrOptions.map(opt=><DraggableItem id={opt} key={opt}/>)}
        </div>
      </div>

      {/* Q2.iii */}
      <div className="mb-4">
        <h4>2.iii Comment on your answer from b(i) or b(ii). [2]</h4>
        <textarea className="form-control" rows={3}
                  value={commentary} onChange={e=>setCommentary(e.target.value)} />
      </div>

      {/* Q4: Build the ARR formula */}
      <div className="mb-4">
        <h4>2.iv Build the formula for Average Rate of Return. [2]</h4>
        <div className="mb-2" style={{ fontFamily: 'serif', fontSize: '1.25rem' }}>
          {(() => {
            const fixed = new Set(['(', '-', ')', '÷', '×']);
            return formulaTokens.map((token, idx) =>
              fixed.has(token) ? (
                <span key={idx} className="mx-1">{token}</span>
              ) : (
                <DroppableSlot key={idx} id={`formula-${idx}`} />
              )
            );
          })()}
        </div>
        <div className="d-flex flex-wrap mt-2">
          {formulaTokens.map(token => (
            <DraggableItem id={token} key={token} />
          ))}
        </div>
      </div>

      {/* Q3 */ */}
      <div className="mb-4">
        <h4>3. Explain one reason for GM manufacturing on the ISS. [2]</h4>
        <DroppableSlot id="reason" />
        <div className="d-flex flex-wrap mt-2">
          {reasonOptions.map(opt=><DraggableItem id={opt} key={opt}/>)}
        </div>
      </div>

      {/* Submit */}
      <div className="text-center mb-4">
        <button className="btn btn-primary" onClick={handleSubmit}>Submit Answers</button>
      </div>

      {/* Results & corrections */}
      {showResults && (
        <div className="border rounded p-3 bg-light">
          <h5>Results &amp; Feedback</h5>
          <p>Your score: {score} / 12</p>
          <ul>
            <li>
              Q1: Your answers: {placements['adv1']}, {placements['adv2']}<br/>
              Correct answers: {correctAdvs.join(', ')}
            </li>
            <li>
              Q2.i Payback: Your answer: {placements['payback'] || 'n/a'}<br/>
              Correct: {correctPayback}
            </li>
            <li>
              Q2.ii ARR: Your answer: {placements['arr'] || 'n/a'}<br/>
              Correct: {correctArr}
            </li>
            <li>
              Q2.iii Commentary: {commentary || 'n/a'}<br/>
              (Open-ended; see markscheme for guidance)
            </li>
            <li>
              Q2.iv Formula: Your formula: {' '}
              {formulaTokens.map((t, i) => placements[`formula-${i}`] || '___').join(' ')}<br/>
              Correct: {(correctFormula.join(' '))}
            </li>
            <li>
              Q3 Reason: Your answer: {placements['reason'] || 'n/a'}<br/>
              Acceptable: {correctReasons.join(', ')}
            </li>
          </ul>
        </div>
      )}
    </DndContext>
  );
}
