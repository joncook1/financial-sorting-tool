
import { useState, useEffect } from "react";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import "./style.css";

const allAccounts = [
  { name: "Cash", category: "Balance Sheet" },
  { name: "Accounts Receivable", category: "Balance Sheet" },
  { name: "Inventory", category: "Balance Sheet" },
  { name: "Sales Revenue", category: "Income Statement" },
  { name: "Cost of Goods Sold", category: "Income Statement" },
  { name: "Utilities Expense", category: "Income Statement" },
  { name: "Net Profit", category: "Profit and Loss Statement" },
  { name: "Gross Profit", category: "Profit and Loss Statement" },
  { name: "Operating Expense", category: "Profit and Loss Statement" },
];

const categories = ["Balance Sheet", "Income Statement", "Profit and Loss Statement"];

function DraggableItem({ id, children }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
  const style = transform ? { transform: `translate(${transform.x}px, ${transform.y}px)` } : undefined;

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} className="draggable">
      {children}
    </div>
  );
}

function DroppableZone({ id, children }) {
  const { isOver, setNodeRef } = useDroppable({ id });
  return (
    <div ref={setNodeRef} className={`dropzone ${isOver ? "dropzone-over" : ""}`}>
      <h3>{id}</h3>
      {children}
    </div>
  );
}

export default function App() {
  const [items, setItems] = useState([]);
  const [droppedItems, setDroppedItems] = useState({});
  const [score, setScore] = useState(null);

  useEffect(() => {
    const randomized = shuffle([...allAccounts]).slice(0, 6);
    setItems(randomized);
    setDroppedItems({});
    setScore(null);
  }, []);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && categories.includes(over.id)) {
      setDroppedItems((prev) => ({
        ...prev,
        [active.id]: over.id,
      }));
    }
  };

  const handleCheckAnswers = () => {
    let correct = 0;
    items.forEach((item) => {
      if (droppedItems[item.name] === item.category) correct++;
    });
    setScore(\`\${correct} out of \${items.length} correct\`);
    localStorage.setItem("financialScore", \`\${correct}/\${items.length}\`);
  };

  const handleReset = () => {
    const randomized = shuffle([...allAccounts]).slice(0, 6);
    setItems(randomized);
    setDroppedItems({});
    setScore(null);
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="container">
        <div className="draggable-container">
          <h2>Drag these accounts:</h2>
          {items.map(
            (item) =>
              !droppedItems[item.name] && (
                <DraggableItem key={item.name} id={item.name}>
                  {item.name}
                </DraggableItem>
              )
          )}
        </div>

        <div className="zones">
          {categories.map((cat) => (
            <DroppableZone key={cat} id={cat}>
              {Object.entries(droppedItems)
                .filter(([_, zone]) => zone === cat)
                .map(([name]) => (
                  <div key={name} className="dropped-item">
                    {name}
                  </div>
                ))}
            </DroppableZone>
          ))}
        </div>
      </div>

      <div className="check-answer">
        <button onClick={handleCheckAnswers}>Check Answers</button>
        <button onClick={handleReset} style={{ marginLeft: "1rem" }}>Reset</button>
        {score && <p>{score}</p>}
      </div>
    </DndContext>
  );
}

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}
