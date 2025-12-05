export default function Card({ children, className = "", ...props }) {
  return (
    <div
      {...props}
      className={`
        p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200
        ${className}
      `}
    >
      {children}
    </div>
  );
}
