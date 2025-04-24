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
    { label: "Property, plant and equipment", correct: "Property, plant and equipment" },
    { label: "Accumulated Depreciation", correct: "Accumulated Depreciation" },
    { label: "Non-current Assets", correct: "Non-current Assets" },
    { label: "Cash", correct: "Cash" },
    { label: "Debtors", correct: "Debtors" },
    { label: "Stock/Inventory", correct: "Stock/Inventory" },
    { label: "Current Assets", correct: "Current Assets" },
    { label: "Total Assets", correct: "Total Assets" },
    { label: "Bank Overdraft", correct: "Bank Overdraft" },
    { label: "Trade Creditors", correct: "Trade Creditors" },
    { label: "Other Short-Term Loans", correct: "Other Short-Term Loans" },
    { label: "Current Liabilities", correct: "Current Liabilities" },
    { label: "Borrowings-Long Term Loans", correct: "Borrowings-Long Term Loans" },
    { label: "Long-term Liabilities", correct: "Long-term Liabilities" },
    { label: "Total Liabilities", correct: "Total Liabilities" },
    { label: "Net Assets", correct: "Net Assets" },
    { label: "Share Capital", correct: "Share Capital" },
    { label: "Retained Earnings", correct: "Retained Earnings" },
    { label: "Equity", correct: "Equity" },
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
    "Non-current Assets": [
      "Property, plant and equipment",
      "Accumulated Depreciation",
      "Non-current Assets"
    ],
    "Current Assets": [
      "Cash",
      "Debtors",
      "Stock/Inventory",
      "Current Assets"
    ],
    "Assets Summary": ["Total Assets"],
    "Current Liabilities": [
      "Bank Overdraft",
      "Trade Creditors",
      "Other Short-Term Loans",
      "Current Liabilities"
    ],
    "Non-current Liabilities": [
      "Borrowings-Long Term Loans",
      "Long-term Liabilities"
    ],
    "Liabilities Summary": ["Total Liabilities"],
    "Net Assets": ["Net Assets"],
    "Equity": [
      "Share Capital",
      "Retained Earnings",
      "Equity"
    ]
  },
  "Statement of Profit or Loss": {
    "": ["Sales Revenue", "Cost of Goods Sold", "Gross Profit", "Operating Expenses", "Net Profit"]
  },
  "Cash Flow Forecast": {
    "": ["Opening Balance", "Cash Inflows", "Cash Outflows", "Net Cash Flow", "Closing Balance"]
  }
};

function DraggableItem({ id, children }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
  const style = transform ? { transform: `translate(${transform.x}px, ${transform.y}px)` } : undefined;
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="p-3 bg-white shadow-md border rounded-lg mb-3 cursor-grab hover:shadow-lg transition text-center"
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
      className={`rounded-lg p-3 h-20 flex flex-col justify-center items-center mb-3 transition border-2 text-center font-medium text-gray-800 ${
        isOver ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-gray-50'
      }`}
    >
      {current ? (
        <div>{current}</div>
      ) : (
        <div className="text-sm text-gray-400 italic">Drop an account here</div>
      )}
      {showCorrect && !isCorrect && current && (
        <div className="text-sm text-red-600 mt-1">Correct: {id}</div>
      )}
      {showCorrect && isCorrect && current && (
        <div className="text-sm text-green-600 mt-1">✅ Correct</div>
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
      <div className="p-6 max-w-3xl mx-auto font-sans">
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

        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">Draggable Accounts</h2>
          <div className="bg-gray-50 border rounded-lg p-4 grid grid-cols-2 gap-4">
            {draggableItems.map((item) => (
              <DraggableItem key={item} id={item}>{item}</DraggableItem>
            ))}
          </div>
        </div>

        <div className="bg-white border rounded-lg p-6 shadow">
          <h2 className="text-2xl font-semibold text-center mb-4">{mode}</h2>
          <div>
            {modeSubsections &&
              Object.entries(modeSubsections).map(([sectionTitle, sectionItems]) => (
                <div key={sectionTitle} className="mb-6">
                  {sectionTitle && (
                    <h3 className="text-lg font-bold mb-2 border-b pb-1 text-gray-700">{sectionTitle}</h3>
                  )}
                  <div className="flex flex-col gap-2">
                    {sectionItems.map((itemLabel) => (
                      <DroppableSlot
                        key={itemLabel}
                        id={itemLabel}
                        current={placements[itemLabel]}
                        showCorrect={submitted}
                      />
                    ))}
                  </div>
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
