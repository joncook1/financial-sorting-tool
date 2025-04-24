import { useState } from "react";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";

const statements = {
  "Statement of Profit or Loss": [...],
  "Statement of Financial Position": [...],
  "Cash Flow Forecast": [...],
};

const subsections = {
  ... // unchanged
};

function DraggableItem({ id, children, hidden }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
  const style = transform ? { transform: `translate(${transform.x}px, ${transform.y}px)` } : undefined;
  if (hidden) return null;
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="p-3 bg-white shadow-md border rounded text-center text-sm cursor-grab hover:shadow-lg"
    >
      {children}
    </div>
  );
}

function DroppableSlot({ id, current, showCorrect }) {
  const { isOver, setNodeRef } = useDroppable({ id });
  const isCorrect = current === id;
  return (
    <div
      ref={setNodeRef}
      className={`h-12 border border-gray-300 bg-white px-3 py-2 text-sm text-center whitespace-nowrap overflow-hidden rounded ${
        isOver ? 'border-blue-400 bg-blue-50' : ''
      }`}
    >
      {current || <span className="text-gray-400 italic">Drop an account here</span>}
      {showCorrect && current && (
        <div className={`text-xs mt-1 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
          {isCorrect ? '✅ Correct' : `Correct: ${id}`}
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [mode, setMode] = useState("Statement of Profit or Loss");
  const [placements, setPlacements] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const currentStatement = statements[mode];
  const modeSubsections = subsections[mode];
  const usedItems = Object.values(placements);
  const draggableItems = currentStatement
    .map((i) => i.correct)
    .sort(() => Math.random() - 0.5);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active) {
      setPlacements({ ...placements, [over.id]: active.id });
    }
  };

  const handleReset = () => {
    setPlacements({});
    setSubmitted(false);
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="p-6 max-w-5xl mx-auto font-sans">
        <h1 className="text-3xl font-bold mb-6 text-center">IB Financial Statement Trainer</h1>

        <div className="mb-6 text-center">
          <label className="mr-2 text-lg font-medium">Select Statement:</label>
          <select
            className="p-2 border rounded"
            value={mode}
            onChange={(e) => {
              setMode(e.target.value);
              handleReset();
            }}
          >
            {Object.keys(statements).map((key) => (
              <option key={key}>{key}</option>
            ))}
          </select>
        </div>

        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Draggable Accounts</h2>
          <div className="bg-gray-50 border rounded p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {draggableItems.map((item) => (
              <DraggableItem key={item} id={item} hidden={usedItems.includes(item)}>
                {item}
              </DraggableItem>
            ))}
          </div>
        </div>

        <div className="bg-white border rounded p-6 shadow">
          <h2 className="text-2xl font-semibold text-center mb-6">{mode}</h2>
          <div className="space-y-8">
            {Object.entries(modeSubsections).map(([sectionTitle, sectionItems]) => (
              <div key={sectionTitle}>
                {sectionTitle && <h3 className="text-md font-bold border-b mb-2 pb-1 text-gray-700">{sectionTitle}</h3>}
                <table className="w-full table-fixed border-t border-b">
                  <tbody>
                    {sectionItems.map((itemLabel) => (
                      <tr key={itemLabel} className="border-b">
                        <td className="w-1/3 py-1 px-2 text-sm text-left text-gray-700 font-medium">{itemLabel}</td>
                        <td className="w-2/3 py-1 px-2">
                          <DroppableSlot
                            id={itemLabel}
                            current={placements[itemLabel]}
                            showCorrect={submitted}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex justify-center gap-4">
          <button
            onClick={() => setSubmitted(true)}
            className="bg-green-600 text-white px-5 py-2 rounded shadow hover:bg-green-700"
          >
            Check Answers
          </button>
          <button
            onClick={handleReset}
            className="bg-gray-300 text-black px-5 py-2 rounded shadow hover:bg-gray-400"
          >
            Reset
          </button>
        </div>
      </div>
    </DndContext>
  );
}
