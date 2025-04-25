// src/PracticeSimulation.jsx
import React, { useState } from 'react';
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';

export default function PracticeSimulation() {
  // Options for drag-and-drop
  const advOptions = [
    'Limited liability',
    'Easier to raise capital',
    'Tax free profits',
    'Access to government grants'
  ];
  const paybackOptions = ['3.25', '3.0', '4.0', '3.5'];
  const arrOptions = ['9.06', '9.5', '8.0', '10.0'];
  const reasonOptions = [
    'Infrastructure availability',
    'Proximity to market',
    'Expertise development',
    'Profitability'
  ];

  // State for placements and commentary
  const [placements, setPlacements] = useState({});
  const [commentary, setCommentary] = useState('');
  const [score, setScore] = useState(null);

  // Handle drag end
  const handleDragEnd = ({ active, over }) => {
    if (over && active) {
      // Remove old placement of this draggable
      const updated = { ...placements };
      Object.keys(updated).forEach(slot => {
        if (updated[slot] === active.id) {
          delete updated[slot];
        }
      });
      updated[over.id] = active.id;
      setPlacements(updated);
    }
  };

  // Grading
  const handleSubmit = () => {
    let pts = 0;
    // Q1 advantages
    ['adv1', 'adv2'].forEach(slot => {
      if (['Limited liability', 'Easier to raise capital'].includes(placements[slot])) {
        pts += 1;
      }
    });
    // Q2(i) payback
    if (placements['payback'] === '3.25') pts += 2;
    // Q2(ii) ARR
    if (placements['arr'] === '9.06') pts += 2;
    // Q2(iii) commentary
    if (commentary.trim().length > 10) pts += 1;
    // Q3 reason
    if (
      ['Infrastructure availability', 'Proximity to market', 'Expertise development'].includes(
        placements['reason']
      )
    ) pts += 2;
    setScore(pts);
  };

  // Draggable item component
  function DraggableItem({ id }) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
    const style = transform
      ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
      : undefined;
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        className="border bg-light text-center p-2 m-1 rounded"
      >
        {id}
      </div>
    );
  }

  // Droppable slot component
  function DroppableSlot({ id }) {
    const { isOver, setNodeRef } = useDroppable({ id });
    let bg = isOver ? 'bg-light border-primary' : 'bg-white border-secondary';
    return (
      <div
        ref={setNodeRef}
        className={`border ${bg} p-3 text-center mb-2 rounded`}
        style={{ minHeight: '3rem', width: '8rem' }}
      >
        {placements[id] || <span className="text-muted">Drop here</span>}
      </div>
    );
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="mb-5">
        <h3>1. State two advantages of a private limited company. [2]</h3>
        <div className="d-flex">
          <DroppableSlot id="adv1" />
          <DroppableSlot id="adv2" />
        </div>
        <div className="d-flex flex-wrap">
          {advOptions.map(opt => (
            <DraggableItem id={opt} key={opt} />
          ))}
        </div>
      </div>

      <div className="mb-5">
        <h3>2.i) Payback period (in years). [2]</h3>
        <DroppableSlot id="payback" />
        <div className="d-flex flex-wrap">
          {paybackOptions.map(opt => (
            <DraggableItem id={opt} key={opt} />
          ))}
        </div>
      </div>

      <div className="mb-5">
        <h3>2.ii) Average rate of return (%) [2]</h3>
        <DroppableSlot id="arr" />
        <div className="d-flex flex-wrap">
          {arrOptions.map(opt => (
            <DraggableItem id={opt} key={opt} />
          ))}
        </div>
      </div>

      <div className="mb-5">
        <h3>2.iii) Comment on your answer from b(i) or b(ii). [2]</h3>
        <textarea
          className="form-control"
          rows={3}
          value={commentary}
          onChange={e => setCommentary(e.target.value)}
        />
      </div>

      <div className="mb-5">
        <h3>3. Explain one reason for GM manufacturing on the ISS. [2]</h3>
        <DroppableSlot id="reason" />
        <div className="d-flex flex-wrap">
          {reasonOptions.map(opt => (
            <DraggableItem id={opt} key={opt} />
          ))}
        </div>
      </div>

      <div className="text-center">
        <button className="btn btn-primary" onClick={handleSubmit}>
          Submit Answers
        </button>
        {score !== null && (
          <div className="mt-3 h5">Your score: {score} / 10</div>
        )}
      </div>
    </DndContext>
  );
}
