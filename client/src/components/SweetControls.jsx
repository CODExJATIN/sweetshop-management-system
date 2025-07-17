import { useState } from 'react';
import { FaSearch, FaSortAmountUp, FaSortAmountDown } from 'react-icons/fa';

export default function SweetControls({ onSearch }) {
  const [filters, setFilters] = useState({
    name: '',
    category: '',
    min: '',
    max: '',
    sortBy: '',
    order: 'asc',
  });

  const categories = ['Nut-Based', 'Milk-Based', 'Chocolate', 'Candy', 'Pastry', 'Cookie', 'Fudge', 'Lollipop'];

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const activeFilters = Object.entries(filters)
      .filter(([_, value]) => value !== '')
      .reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {});
    onSearch(activeFilters);
  };

  const toggleOrder = () => {
    setFilters((prev) => ({
      ...prev,
      order: prev.order === 'asc' ? 'desc' : 'asc',
    }));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
    >
      {/* Name Input */}
      <input
        name="name"
        value={filters.name}
        onChange={handleChange}
        placeholder="Search by name"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
      />

      {/* Category Select */}
      <select
        name="category"
        value={filters.category}
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:outline-none bg-white"
      >
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

      {/* Min Price */}
      <input
        name="min"
        type="number"
        value={filters.min}
        onChange={handleChange}
        placeholder="Min Price"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
      />

      {/* Max Price */}
      <input
        name="max"
        type="number"
        value={filters.max}
        onChange={handleChange}
        placeholder="Max Price"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
      />

      {/* Sort By */}
      <select
        name="sortBy"
        value={filters.sortBy}
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:outline-none bg-white"
      >
        <option value="">Sort By</option>
        <option value="name">Name</option>
        <option value="price">Price</option>
        <option value="category">Category</option>
        <option value="quantity">Quantity</option>
      </select>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={toggleOrder}
          title="Toggle Sort Order"
          className="w-1/2 px-3 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all"
        >
          {filters.order === 'asc' ? (
            <FaSortAmountUp className="mx-auto" />
          ) : (
            <FaSortAmountDown className="mx-auto" />
          )}
        </button>

        <button
          type="submit"
          title="Apply Filters"
          className="w-1/2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 shadow-md transition-all duration-200 flex items-center justify-center gap-2"
        >
          <FaSearch className="text-white" />
          <span className="text-sm font-medium">Filter</span>
        </button>
      </div>
    </form>
  );
}
