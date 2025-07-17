import { useState } from 'react';

export default function PurchaseModal({ sweet, onClose, onConfirm }) {
  const [quantity, setQuantity] = useState('');

  const handleSubmit = () => {
    if (!quantity || Number(quantity) <= 0) return;
    onConfirm(Number(quantity));
    setQuantity('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-sm shadow-xl space-y-4">
        <h2 className="text-xl font-semibold text-center">Purchase Sweet</h2>
        <p className="text-center text-gray-500">Sweet: {sweet.name}</p>
        <input
          type="number"
          min="1"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring"
          placeholder="Enter quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm border rounded-md hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Purchase
          </button>
        </div>
      </div>
    </div>
  );
}
