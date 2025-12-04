export default function Card({ children, ...props }) {
  return (
    <div {...props} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
      {children}
    </div>
  );
}
