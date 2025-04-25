// src/data.js
export const statements = {
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

export const subsections = {
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

export const figures = {
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
