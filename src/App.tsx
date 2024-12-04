import { useState, useEffect } from 'react';
import './App.css';

interface Item {
  id: number;
  name: string;
  amount: number;
  unit: string;
  completed: boolean;
}

function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemAmount, setNewItemAmount] = useState('');
  const [newItemUnit, setNewItemUnit] = useState('');
  const [error, setError] = useState('');
  const [allPurchased, setAllPurchased] = useState(false);

  const addItem = () => {
    if (newItemName.trim() === '' || newItemAmount.trim() === '' || newItemUnit.trim() === '') {
      setError('Minden mezőt kötelező kitölteni!');
      return;
    }

    if (isNaN(Number(newItemAmount)) || Number(newItemAmount) <= 0) {
      setError('A mennyiségnek pozitív számnak kell lennie!');
      return;
    }

    if (newItemName.length > 15) {
      setError('A termék neve legfeljebb 15 karakter lehet!');
      return;
    }

    if (items.some((item) => item.name.toLowerCase() === newItemName.toLowerCase())) {
      setError('Ez a termék már szerepel a listában!');
      return;
    }

    const newItem: Item = {
      id: Date.now(),
      name: newItemName.trim(),
      amount: parseInt(newItemAmount),
      unit: newItemUnit.trim(),
      completed: false,
    };

    setItems((prevItems) => [...prevItems, newItem]);
    setNewItemName('');
    setNewItemAmount('');
    setNewItemUnit('');
    setError('');
  };

  const removeItem = (itemID: number) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== itemID));
  };

  const toggleBought = (itemID: number) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemID ? { ...item, completed: !item.completed } : item
      )
    );
  };

  useEffect(() => {
    setAllPurchased(items.length > 0 && items.every((item) => item.completed));
  }, [items]);

  const remainingItems = items.filter((item) => !item.completed).length;

  return (
    <div className="shopping-list">
      <h1>Bevásárló lista</h1>
      <div className="form">
        <label>Terméknév:</label>
        <input
          type="text"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
        />
        <label>Mennyiség:</label>
        <input
          type="text"
          value={newItemAmount}
          onChange={(e) => setNewItemAmount(e.target.value)}
        />
        <label>Mennyiségi egység:</label>
        <input
          type="text"
          value={newItemUnit}
          onChange={(e) => setNewItemUnit(e.target.value)}
        />
        <br/>
        <br/>
        <button onClick={addItem} className="add-button">
          Hozzáadás
        </button>
      </div>
      {error && <p className="error">{error}</p>}
      <ul className="list">
        {items.map((item) => (
          <li
            key={item.id}
            className={item.completed ? 'purchased' : ''}
          >
            <span>{item.name}</span>
            <span>{`${item.amount} ${item.unit}`}</span>
            <button onClick={() => toggleBought(item.id)}>
              {item.completed ? 'Visszaállítás' : 'Megvásárolva'}
            </button>
            <button onClick={() => removeItem(item.id)}>Törlés</button>
          </li>
        ))}
      </ul>
      {allPurchased ? (
        <p className="status">Minden termék megvásárlásra került!</p>
      ) : (
        items.length > 0 && (
          <p className="status">{`${remainingItems} tétel van hátra.`}</p>
        )
      )}
    </div>
  );
}

export default App;

