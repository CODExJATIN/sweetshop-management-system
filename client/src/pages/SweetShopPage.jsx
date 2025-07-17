import { useEffect, useState } from 'react';
import SweetForm from '../components/SweetForm';
import SweetList from '../components/SweetList';
import SweetControls from '../components/SweetControls';
import PurchaseModal from '../components/PurchaseModel';
import RestockModal from '../components/RestockModel';
import { X } from 'lucide-react';
import {
  getAllSweets,
  addSweet,
  deleteSweet,
  purchaseSweet,
  restockSweet,
  searchSweets,
} from '../api/sweetApi';
import { toast } from 'react-toastify';
import { FaPlus, FaStore } from 'react-icons/fa';

export default function SweetShopPage() {
  const [sweets, setSweets] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [selectedSweet, setSelectedSweet] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchSweets = async () => {
    setLoading(true);
    const data = await getAllSweets();
    setSweets(data);
    setFiltered(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchSweets();
  }, []);

  const handleAddSweet = async (sweet) => {
    await addSweet(sweet);
    toast.success('Sweet added successfully!');
    fetchSweets();
    setShowAddForm(false);
  };

  const handleDelete = async (id) => {
    await deleteSweet(id);
    toast.success('Sweet deleted!');
    fetchSweets();
  };

  const handleSearch = async (filters) => {
    if (!filters || Object.keys(filters).length === 0) return setFiltered(sweets);
    const result = await searchSweets(filters);
    setFiltered(result);
  };

  const openPurchaseModal = (sweet) => {
    setSelectedSweet(sweet);
    setShowPurchaseModal(true);
  };

  const openRestockModal = (sweet) => {
    setSelectedSweet(sweet);
    setShowRestockModal(true);
  };

  const handlePurchase = async (quantity) => {
    if (selectedSweet) {
      await purchaseSweet(selectedSweet._id, quantity);
      toast.success(`Purchased ${quantity} ${selectedSweet.name}`);
      fetchSweets();
    }
    setShowPurchaseModal(false);
    setSelectedSweet(null);
  };

  const handleRestock = async (quantity) => {
    if (selectedSweet) {
      await restockSweet(selectedSweet._id, quantity);
      toast.success(`Restocked ${quantity} ${selectedSweet.name}`);
      fetchSweets();
    }
    setShowRestockModal(false);
    setSelectedSweet(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-50 to-white">
      {/* Header */}
      <header className="w-full bg-purple-600 text-white p-4 shadow-md flex items-center justify-center gap-2">
        <FaStore size={24} />
        <h1 className="text-xl md:text-2xl font-bold tracking-wide">Sweet Shop Manager</h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto px-4 py-6">
        <section className="bg-white rounded-xl shadow-md p-5 mb-6">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-gray-700">Search & Filter Sweets</h2>
          <SweetControls onSearch={handleSearch} />
        </section>

        {/* Animated Add Sweet Form */}
        {showAddForm && (
          <section
            className="bg-white rounded-xl shadow-md p-5 mb-6 animate-fadeIn"
          >
            <div className="flex justify-end items-center mb-4">
              <button
                className="text-sm text-red-500 hover:underline"
                onClick={() => setShowAddForm(false)}
              >
                <X size={20} className="inline-block mr-1" />
              </button>
            </div>
            <SweetForm onSubmit={handleAddSweet} />
          </section>
        )}

        {/* Sweet Cards */}
        <SweetList
          sweets={filtered}
          loading={loading}
          onDelete={handleDelete}
          onPurchaseClick={openPurchaseModal}
          onRestockClick={openRestockModal}
        />

        {/* Floating Add Button */}
        {!showAddForm && (
          <button
            className="fixed bottom-6 right-6 md:right-10 bg-purple-600 text-white p-4 rounded-full shadow-lg hover:bg-purple-700 transition-all z-50"
            onClick={() => setShowAddForm(true)}
            title="Add Sweet"
          >
            <FaPlus size={20} />
          </button>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 text-center text-sm text-gray-500 py-4 border-t">
        &copy; {new Date().getFullYear()} SweetShop Inc. All rights reserved.
      </footer>

      {/* Modals */}
      {showPurchaseModal && (
        <PurchaseModal
          sweet={selectedSweet}
          onClose={() => setShowPurchaseModal(false)}
          onConfirm={handlePurchase}
        />
      )}
      {showRestockModal && (
        <RestockModal
          sweet={selectedSweet}
          onClose={() => setShowRestockModal(false)}
          onConfirm={handleRestock}
        />
      )}
    </div>
  );
}
