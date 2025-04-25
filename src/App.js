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
  ]
};

const subsections = {
  "Statement of Profit or Loss": {
    "": [
      "Sales Revenue",
      "Cost of Goods Sold",
      "Gross Profit",
      "Operating Expenses",
      "Net Profit"
    ]
  },
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
  "Cash Flow Forecast": {
    "": [
      "Opening Balance",
      "Cash Inflows",
      "Cash Outflows",
      "Net Cash Flow",
      "Closing Balance"
    ]
  }
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
      className="border bg-light text-center p-2 mb-2 rounded"
    >
      {children}
    </div>
  );
}

function DroppableSlot({ id, current, showCorrect }) {
  const { isOver, setNodeRef } = useDroppable({ id });
  const isCorrect = current === id;
  const highlight = isOver ? 'border-primary bg-light' : 'border-secondary bg-white';

  return (
    <div
      ref={setNodeRef}
      className={`border ${highlight} p-2 text-center mb-2 rounded`}
      style={{ minHeight: '2.5rem' }}
    >
      {current || ''}
      {showCorrect && current && (
        <div className={`small mt-1 text-${isCorrect ? 'success' : 'danger'}`}>    
          {isCorrect ? '✔️' : id}
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
      <div className="container py-4">
        <h1 className="display-6 text-center mb-4">IB Financial Statement Trainer</h1>

        <div className="mb-4 text-center">
          <label className="form-label me-2">Select Statement:</label>
          <select
            className="form-select d-inline-block w-auto"
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

        <div className="mb-4">
          <h2 className="h5 mb-3">Draggable Accounts</h2>
          <div className="row gy-2">
            {draggableItems.map((item) => (
              <div className="col-6 col-md-3" key={item}>
                <DraggableItem id={item} hidden={usedItems.includes(item)}>
                  {item}
                </DraggableItem>
              </div>
            ))}
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-body">
            <h2 className="h5 text-center mb-3">{mode}</h2>
            {Object.entries(modeSubsections).map(([sectionTitle, sectionItems]) => (
              <div key={sectionTitle} className="mb-3">
                {sectionTitle && <h3 className="h6 border-bottom pb-1">{sectionTitle}</h3>}
                <table className="table table-bordered mb-0">
                  <tbody>
                    {sectionItems.map((itemLabel) => (
                      <tr key={itemLabel}>
                        <td className="w-25">{itemLabel}</td>
                        <td>
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

        <div className="text-center">
          <button
            onClick={() => setSubmitted(true)}
            className="btn btn-success me-2"
          >
            Check Answers
          </button>
          <button
            onClick={handleReset}
            className="btn btn-secondary"
          >
            Reset
          </button>
        </div>
      </div>
    </DndContext>
  );
}
