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
  const style = transform ? {
    transform: `translate(${transform.x}px, ${transform.y}px)`
  } : undefined;
  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} className="p-2 bg-white shadow border rounded mb-2 cursor-move">
      {children}
    </div>
  );
}

function DroppableSlot({ id, label, current, onDrop, showCorrect }) {
  const { isOver, setNodeRef } = useDroppable({ id });
  const isCorrect = current === id;
  return (
    <div ref={setNodeRef} className={`border p-2 rounded mb-2 min-h-[3rem] ${isOver ? 'bg-blue-100' : 'bg-gray-100'}`}>
      <div className="font-semibold mb-1">{label}</div>
      <div className="min-h-[1.5rem]">
        {current && <div>{current}</div>}
        {showCorrect && !isCorrect && current && <div className="text-sm text-red-600">Correct: {id}</div>}
        {showCorrect && isCorrect && current && <div className="text-sm text-green-600">✅ Correct</div>}
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
      <div className="p-4 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">IB Financial Statement Trainer</h1>

        <label className="mb-2 block font-semibold">Select Statement:</label>
        <select
          className="p-2 border rounded mb-6"
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

        <div className="grid grid-cols-2 gap-8">
          <div>
            <h2 className="text-lg font-semibold mb-2">Draggable Accounts</h2>
            {draggableItems.map((item) => (
              <DraggableItem key={item} id={item}>{item}</DraggableItem>
            ))}
          </div>

          <div>
            {modeSubsections &&
              Object.entries(modeSubsections).map(([sectionTitle, sectionItems]) => (
                <div key={sectionTitle} className="border border-gray-300 rounded p-3 mb-4">
                  <h2 className="text-lg font-semibold mb-2">{sectionTitle}</h2>
                  {sectionItems.map((itemLabel) => (
                    <DroppableSlot
                      key={itemLabel}
                      id={itemLabel}
                      label={itemLabel}
                      current={placements[itemLabel]}
                      onDrop={handleDragEnd}
                      showCorrect={submitted}
                    />
                  ))}
                </div>
              ))}
          </div>
        </div>

        <div className="mt-6 space-x-4">
          <button
            onClick={() => setSubmitted(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Check Answers
          </button>
          <button
            onClick={handleReset}
            className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
          >
            Reset
          </button>
        </div>
      </div>
    </DndContext>
  );
}
