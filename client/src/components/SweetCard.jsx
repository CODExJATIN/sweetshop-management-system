import { ShoppingCart, Plus, Trash2 } from 'lucide-react';
import React from 'react';

const SweetCard = ({ sweet, onDelete, onPurchase, onRestock }) => {
  return (
    <div className="bg-white border border-violet-100 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 w-full max-w-sm mx-auto flex flex-col justify-between">
      
      {/* Sweet Info */}
      <div className="mb-6 space-y-1">
        <h2 className="text-2xl font-bold text-violet-700">{sweet.name}</h2>
        <p className="text-sm text-gray-500 italic">{sweet.category}</p>

        <div className="mt-4 space-y-1 text-sm text-gray-700">
          <p>
            <span className="font-semibold text-violet-600">Price:</span> ₹{sweet.price}
          </p>
          <p>
            <span className="font-semibold text-violet-600">Available:</span> {sweet.quantity} pcs
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2">
        <button
          onClick={() => onPurchase(sweet)}
          className="flex items-center justify-center gap-2 bg-violet-600 text-white text-sm font-semibold py-2 rounded-lg hover:bg-violet-700 transition"
        >
          <ShoppingCart size={18} /> Purchase
        </button>

        <button
          onClick={() => onRestock(sweet)}
          className="flex items-center justify-center gap-2 bg-indigo-500 text-white text-sm font-semibold py-2 rounded-lg hover:bg-indigo-600 transition"
        >
          <Plus size={18} /> Restock
        </button>

        <button
          onClick={() => onDelete(sweet._id)}
          className="flex items-center justify-center gap-2 bg-rose-600 text-white text-sm font-semibold py-2 rounded-lg hover:bg-rose-700 transition"
        >
          <Trash2 size={18} /> Delete
        </button>
      </div>
    </div>
  );
};

export default SweetCard;
