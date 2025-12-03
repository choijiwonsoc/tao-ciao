export default function Button({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 active:scale-95 transition-transform duration-150"
    >
      {children}
    </button>
  );
}
