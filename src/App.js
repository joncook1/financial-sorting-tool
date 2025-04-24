import { useState } from "react";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";

const statements = {
  "Statement of Profit or Loss": [
    { label: "Sales Revenue", correct: "Sales Revenue" },
    { label: "Cost of Goods Sold", correct: "Cost of Goods Sold" },
    { label: "Gross Profit", correct: "Gross Profit" },
    { label: "Operating Expenses", correct: "Operating Expenses" },
    { label: "Net Profit", correct: "Net Profit" },
  ],
  "Statement of Financial Position": [
    { label: "Non-current Assets", correct: "Non-current Assets" },
    { label: "Current Assets", correct: "Current Assets" },
    { label: "Total Assets", correct: "Total Assets" },
    { label: "Current Liabilities", correct: "Current Liabilities" },
    { label: "Long-term Liabilities", correct: "Long-term Liabilities" },
    { label: "Net Assets", correct: "Net Assets" },
    { label: "Equity", correct: "Equity" },
    { label: "Share Capital", correct: "Share Capital" },
    { label: "Retained Profit", correct: "Retained Profit" },
  ],
  "Cash Flow Forecast": [
    { label: "Opening Balance", correct: "Opening Balance" },
    { label: "Cash Inflows", correct: "Cash Inflows" },
    { label: "Cash Outflows", correct: "Cash Outflows" },
    { label: "Net Cash Flow", correct: "Net Cash Flow" },
    { label: "Closing Balance", correct: "Closing Balance" },
  ],
};

const subsections = {
  "Statement of Financial Position": {
    "Assets": ["Non-current Assets", "Current Assets", "Total Assets"],
    "Liabilities": ["Current Liabilities", "Long-term Liabilities"],
    "Equity": ["Share Capital", "Retained Profit", "Equity"]
  },
  "Statement of Profit or Loss": {
    "Income": ["Sales Revenue"],
    "Expenses": ["Cost of Goods Sold", "Operating Expenses"],
    "Results": ["Gross Profit", "Net Profit"]
  },
  "Cash Flow Forecast": {
    "Sections": ["Opening Balance", "Cash Inflows", "Cash Outflows", "Net Cash Flow", "Closing Balance"]
  }
};

function DraggableItem({ id, children }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
  const style = transform ? { transform: `translate(${transform.x}px, ${transform.y}px)` } : undefined;
  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} className="p-3 bg-white shadow-md border rounded-lg mb-3 cursor-grab hover:shadow-lg transition">
      {children}
    </div>
  );
}

function DroppableSlot({ id, label, current, showCorrect }) {
  const { isOver, setNodeRef } = useDroppable({ id });
  const isCorrect = current === id;
  return (
    <div
      ref={setNodeRef}
      className={`rounded-lg p-3 min-h-[3rem] mb-3 transition border-2 ${isOver ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-gray-50'}`}
    >
      <div className="text-sm text-gray-600 font-semibold mb-1">{label}</div>
      <div className="text-base">
        {current && <div>{current}</div>}
        {showCorrect && !isCorrect && current && <div className="text-sm text-red-600 mt-1">Correct: {id}</div>}
        {showCorrect && isCorrect && current && <div className="text-sm text-green-600 mt-1">✅ Correct</div>}
      </div>
    </div>
  );
}

export default function App() {
  const [mode, setMode] = useState("Statement of Profit or Loss");
  const [placements, setPlacements] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const currentStatement = statements[mode];
  const modeSubsections = subsections[mode];
  const draggableItems = currentStatement.map((i) => i.correct).sort(() => Math.random() - 0.5);

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
      <div className="p-6 max-w-6xl mx-auto font-sans">
        <h1 className="text-3xl font-bold mb-6 text-center">IB Financial Statement Trainer</h1>

        <div className="mb-8 text-center">
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

        <div className="grid grid-cols-2 gap-10">
          <div>
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">Draggable Accounts</h2>
            {draggableItems.map((item) => (
              <DraggableItem key={item} id={item}>{item}</DraggableItem>
            ))}
          </div>

          <div>
            {modeSubsections &&
              Object.entries(modeSubsections).map(([sectionTitle, sectionItems]) => (
                <div key={sectionTitle} className="bg-white border rounded-lg p-4 mb-6 shadow-sm">
                  <h2 className="text-lg font-semibold mb-3 text-gray-800 border-b pb-2">{sectionTitle}</h2>
                  {sectionItems.map((itemLabel) => (
                    <DroppableSlot
                      key={itemLabel}
                      id={itemLabel}
                      label={itemLabel}
                      current={placements[itemLabel]}
                      showCorrect={submitted}
                    />
                  ))}
                </div>
              ))}
          </div>
        </div>

        <div className="mt-10 flex justify-center space-x-6">
          <button
            onClick={() => setSubmitted(true)}
            className="bg-green-600 text-white px-5 py-2 rounded-lg shadow hover:bg-green-700 transition"
          >
            Check Answers
          </button>
          <button
            onClick={handleReset}
            className="bg-gray-300 text-black px-5 py-2 rounded-lg shadow hover:bg-gray-400 transition"
          >
            Reset
          </button>
        </div>
      </div>
    </DndContext>
  );
}
