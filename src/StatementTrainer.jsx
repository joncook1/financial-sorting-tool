// src/StatementTrainer.jsx
import React, { useState } from 'react';
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';
import { statements, subsections, figures } from './data';

export default function StatementTrainer({ type }) {
  // Map our tab label to the data key
  const keyMap = {
    'Profit or Loss': 'Statement of Profit or Loss',
    'Financial Position': 'Statement of Financial Position',
    'Cash Flow': 'Cash Flow Forecast'
  };
  const statementKey = keyMap[type];

  const itemsData = statements[statementKey];
  const layout = subsections[statementKey];
  const dataFigures = figures[statementKey];

  const [placements, setPlacements] = useState({});
  const [showCorrect, setShowCorrect] = useState(false);

  // Build the draggable list: used items first, then unused in random order
  const allItems = itemsData.map(i => i.correct);
  const randomized = [...allItems].sort(() => Math.random() - 0.5);
  const usedItems = Object.values(placements);
  const used = randomized.filter(item => usedItems.includes(item));
  const unused = randomized.filter(item => !usedItems.includes(item));
  const draggableItems = [...used, ...unused];

  const handleDragEnd = ({ active, over }) => {
    if (over && active) {
      // Remove any old placement of this item, then place in new slot
      const updated = Object.fromEntries(
        Object.entries(placements).filter(([, val]) => val !== active.id)
      );
      updated[over.id] = active.id;
      setPlacements(updated);
    }
  };

  const handleReset = () => {
    setPlacements({});
    setShowCorrect(false);
  };

  const handleCheck = () => setShowCorrect(true);

  const handleHint = () => {
    if (statementKey !== 'Statement of Financial Position') return;
    const slots = Object.values(layout).flat();
    const unplaced = slots.find(slot => !placements[slot]);
    if (unplaced) setPlacements(prev => ({ ...prev, [unplaced]: unplaced }));
  };

  function DraggableItem({ id }) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
    const style = transform ? { transform: `translate(${transform.x}px, ${transform.y}px)` } : undefined;
    const used = usedItems.includes(id);
    const colorClass = used ? 'bg-secondary text-white' : 'bg-light text-dark';
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        className={`border text-center p-2 mb-2 rounded ${colorClass}`}
      >
        {id}
      </div>
    );
  }

  function DroppableSlot({ id }) {
    const { isOver, setNodeRef } = useDroppable({ id });
    let highlight = isOver ? 'border-primary bg-light' : 'border-secondary bg-white';
    if (showCorrect) {
      highlight = placements[id] === id
        ? 'border-success bg-success text-white'
        : 'border-danger bg-danger text-white';
    }
    return (
      <div
        ref={setNodeRef}
        className={`border ${highlight} p-2 text-center mb-2 rounded`}
        style={{ minHeight: '2.5rem' }}
      >
        {placements[id] || ''}
      </div>
    );
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="row">
        {/* Statement on left */}
        <div className="col-md-8">
          <div className="card mb-4">
            <div className="card-body">
              <h2 className="h5 text-center mb-3">{type}</h2>
              {Object.entries(layout).map(([sectionTitle, sectionItems]) => (
                <div key={sectionTitle} className="mb-3">
                  {sectionTitle && <h3 className="h6 border-bottom pb-1">{sectionTitle}</h3>}
                  <table className="table table-bordered mb-0">
                    <thead>
                      <tr>
                        <th>Account</th>
                        <th className="text-end">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sectionItems.map(itemLabel => (
                        <tr key={itemLabel}>
                          <td>
                            <DroppableSlot id={itemLabel} />
                          </td>
                          <td className="text-end">
                            {dataFigures[itemLabel].toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Draggable list + buttons on right */}
        <div className="col-md-4">
          <h2 className="h5 mb-3">Draggable Accounts</h2>
          <div className="row gy-2">
            {draggableItems.map(item => (
              <div className="col-12" key={item}>
                <DraggableItem id={item} />
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            {statementKey === 'Statement of Financial Position' && (
              <button onClick={handleHint} className="btn btn-info me-2">
                Hint
              </button>
            )}
            <button onClick={handleCheck} className="btn btn-success me-2">
              Check Answers
            </button>
            <button onClick={handleReset} className="btn btn-secondary">
              Reset
            </button>
          </div>
        </div>
      </div>
    </DndContext>
  );
}

