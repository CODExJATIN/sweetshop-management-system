export default function PrimaryButton({ children, type = 'button', onClick, className = '' }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`bg-blue-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-700 transition-all ${className}`}
    >
      {children}
    </button>
  );
}
