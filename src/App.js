import React, { useState } from "react";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";

const statements = {
  "Statement of Profit or Loss": [
    { label: "Sales Revenue", correct: "Sales Revenue" },
    { label: "Cost of Goods Sold", correct: "Cost of Goods Sold" },
    { label: "Gross Profit", correct: "Gross Profit" },
    { label: "Operating Expenses", correct: "Operating Expenses" },
    { label: "Net Profit", correct: "Net Profit" }
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
    { label: "Equity", correct: "Equity" }
  ],
  "Cash Flow Forecast": [
    { label: "Opening Balance", correct: "Opening Balance" },
    { label: "Cash Inflows", correct: "Cash Inflows" },
    { label: "Cash Outflows", correct: "Cash Outflows" },
    { label: "Net Cash Flow", correct: "Net Cash Flow" },
    { label: "Closing Balance", correct: "Closing Balance" }
  ]
};

const subsections = {
  "Statement of Profit or Loss": {
    "": ["Sales Revenue", "Cost of Goods Sold", "Gross Profit", "Operating Expenses", "Net Profit"]
  },
  "Statement of Financial Position": {
    "Non-current Assets": ["Property, plant and equipment", "Accumulated Depreciation", "Non-current Assets"],
    "Current Assets": ["Cash", "Debtors", "Stock/Inventory", "Current Assets"],
    "Assets Summary": ["Total Assets"],
    "Current Liabilities": ["Bank Overdraft", "Trade Creditors", "Other Short-Term Loans", "Current Liabilities"],
    "Non-current Liabilities": ["Borrowings-Long Term Loans", "Long-term Liabilities"],
    "Liabilities Summary": ["Total Liabilities"],
    "Net Assets": ["Net Assets"],
    "Equity": ["Share Capital", "Retained Earnings", "Equity"]
  },
  "Cash Flow Forecast": {
    "": ["Opening Balance", "Cash Inflows", "Cash Outflows", "Net Cash Flow", "Closing Balance"]
  }
};

const figures = {
  "Statement of Profit or Loss": {
    "Sales Revenue": 200000,
    "Cost of Goods Sold": 120000,
    "Gross Profit": 80000,
    "Operating Expenses": 30000,
    "Net Profit": 50000
  },
  "Statement of Financial Position": {
    "Property, plant and equipment": 50000,
    "Accumulated Depreciation": -10000,
    "Non-current Assets": 40000,
    "Cash": 15000,
    "Debtors": 25000,
    "Stock/Inventory": 20000,
    "Current Assets": 60000,
    "Total Assets": 100000,
    "Bank Overdraft": -5000,
    "Trade Creditors": -8000,
    "Other Short-Term Loans": -2000,
    "Current Liabilities": -15000,
    "Borrowings-Long Term Loans": -20000,
    "Long-term Liabilities": -20000,
    "Total Liabilities": -35000,
    "Net Assets": 65000,
    "Share Capital": 50000,
    "Retained Earnings": 15000,
    "Equity": 65000
  },
  "Cash Flow Forecast": {
    "Opening Balance": 10000,
    "Cash Inflows": 30000,
    "Cash Outflows": -15000,
    "Net Cash Flow": 15000,
    "Closing Balance": 25000
  }
};

function DraggableItem({ id, used }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
  const style = transform ? { transform: `translate(${transform.x}px, ${transform.y}px)` } : undefined;
  const base = "border text-center p-2 mb-2 rounded";
  const color = used ? "bg-secondary text-white" : "bg-light text-dark";
  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} className={`${base} ${color}`}>
      {id}
    </div>
  );
}

function DroppableSlot({ id, current, showCorrect }) {
  const { isOver, setNodeRef } = useDroppable({ id });
  let highlight = isOver ? 'border-primary bg-light' : 'border-secondary bg-white';
  if (showCorrect) {
    highlight = current === id ? 'border-success bg-success text-white' : 'border-danger bg-danger text-white';
  }
  return (
    <div ref={setNodeRef} className={`border ${highlight} p-2 text-center mb-2 rounded`} style={{ minHeight: '2.5rem' }}> 
      {current || ''}
    </div>
  );
}

export default function App() {
  const [mode, setMode] = useState("Statement of Profit or Loss");
  const [placements, setPlacements] = useState({});
  const [showCorrect, setShowCorrect] = useState(false);

  const modeSubsections = subsections[mode];
  const draggableItems = statements[mode].map(i => i.correct).sort(() => Math.random() - 0.5);
  const usedItems = Object.values(placements);

  const handleDragEnd = ({ active, over }) => {
    if (over && active) {
      const updated = Object.fromEntries(Object.entries(placements).filter(([slot, val]) => val !== active.id));
      updated[over.id] = active.id;
      setPlacements(updated);
    }
  };

  const handleReset = () => { setPlacements({}); setShowCorrect(false); };
  const handleCheck = () => setShowCorrect(true);
  const handleHint = () => {
    if (mode !== "Statement of Financial Position") return;
    // Collect all slots for this statement
    const slots = Object.values(subsections[mode]).flat();
    // Find first unplaced slot
    const unplaced = slots.find(slot => !placements[slot]);
    if (unplaced) {
      setPlacements({ ...placements, [unplaced]: unplaced });
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="container py-4">
        <h1 className="display-6 text-center mb-4">IB Financial Statement Trainer</h1>
        <div className="mb-4 text-center">
          <label className="form-label me-2">Select Statement:</label>
          <select className="form-select d-inline-block w-auto" value={mode} onChange={e => { setMode(e.target.value); handleReset(); }}>
            {Object.keys(statements).map(key => <option key={key}>{key}</option>)}
          </select>
        </div>
        <div className="row">
          <div className="col-md-8">
            <div className="card mb-4"><div className="card-body">
              <h2 className="h5 text-center mb-3">{mode}</h2>
              {Object.entries(modeSubsections).map(([sectionTitle, sectionItems]) => (
                <div key={sectionTitle} className="mb-3">
                  {sectionTitle && <h3 className="h6 border-bottom pb-1">{sectionTitle}</h3>}
                  <table className="table table-bordered mb-0">
                    <thead><tr><th>Account</th><th className="text-end">Amount</th></tr></thead>
                    <tbody>
                      {sectionItems.map(itemLabel => (
                        <tr key={itemLabel}>
                          <td><DroppableSlot id={itemLabel} current={placements[itemLabel]} showCorrect={showCorrect} /></td>
                          <td className="text-end">{figures[mode][itemLabel].toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div></div>
          </div>
          <div className="col-md-4">
            <h2 className="h5 mb-3">Draggable Accounts</h2>
            <div className="row gy-2">
              {draggableItems.map(item => <div className="col-12" key={item}><DraggableItem id={item} used={usedItems.includes(item)} /></div>)}
            </div>
            <div className="mt-4 text-center">
              {mode === "Statement of Financial Position" && <button onClick={handleHint} className="btn btn-info me-2">Hint</button>}
              <button onClick={handleCheck} className="btn btn-success me-2">Check Answers</button>
              <button onClick={handleReset} className="btn btn-secondary">Reset</button>
            </div>
          </div>
        </div>
      </div>
    </DndContext>
  );
}
