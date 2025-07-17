import { useState } from 'react';
import InputField from './ui/InputField';
import PrimaryButton from './ui/PrimaryButton';

const CATEGORIES = ['Nut-Based','Milk-Based','Chocolate', 'Candy', 'Pastry', 'Cookie', 'Fudge', 'Lollipop'];

export default function SweetForm({ onSubmit }) {
  const [form, setForm] = useState({
    name: '',
    category: '',
    price: '',
    quantity: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      price: Number(form.price),
      quantity: Number(form.quantity),
    });
    setForm({ name: '', category: '', price: '', quantity: '' });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-lg mx-auto p-8 bg-white rounded-2xl shadow-2xl border border-violet-100 space-y-6"
    >
      <h2 className="text-3xl font-extrabold text-purple-700 text-center tracking-tight">
        Add a New Sweet
      </h2>

      <div className="space-y-4">
        {/* Sweet Name */}
        <InputField
          label="Sweet Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />

        {/* Category Dropdown */}
        <div className="flex flex-col">
          <label htmlFor="category" className="font-medium text-sm text-gray-700 mb-1">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            name="category"
            id="category"
            value={form.category}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-700"
          >
            <option value="">Select a category</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Price */}
        <InputField
          label="Price (₹)"
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          required
        />

        {/* Quantity */}
        <InputField
          label="Quantity"
          name="quantity"
          type="number"
          value={form.quantity}
          onChange={handleChange}
          required
        />
      </div>

      {/* Submit */}
      <PrimaryButton type="submit" className="w-full text-white bg-purple-600 hover:bg-purple-700">
        Add Sweet
      </PrimaryButton>
    </form>
  );
}