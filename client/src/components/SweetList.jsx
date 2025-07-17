import SweetCard from './SweetCard';

export default function SweetList({ sweets, onDelete, onPurchaseClick, onRestockClick }) {
  if (!sweets.length) {
    return <p className="text-center text-gray-500">No sweets found.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {sweets.map((sweet) => (
        <SweetCard
          key={sweet._id}
          sweet={sweet}
          onDelete={onDelete}
          onPurchase={() => onPurchaseClick(sweet)}
          onRestock={() => onRestockClick(sweet)}
        />

      ))}
    </div>
  );
}
