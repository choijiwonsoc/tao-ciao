export default function Card({ children }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
      {children}
    </div>
  );
}
