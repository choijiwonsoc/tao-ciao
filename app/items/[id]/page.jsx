import Card from '../../../components/Card';
import Button from '../../../components/Button';
import React from 'react';

const sampleItems = [
  { id: 1, name: 'Headphones', price: 100, status: 'pending', img: '/headphones.jpg', waitTime: '2d 5h', emotion: 'Excited', link: '#' },
  { id: 2, name: 'Sneakers', price: 150, status: 'stopped', img: '/sneakers.jpg', waitTime: '1d 3h', emotion: 'Bored', link: '#' },
];

export default function ItemPage({ params }) {
  const { id } = React.use(params);   // Server Component: params is directly accessible
  const item = sampleItems.find(it => it.id === parseInt(id));

  if (!item) return <p>Item not found</p>;

  return (
    <div className="space-y-6 max-w-2xl">
      <Card>
        <div className="flex flex-col sm:flex-row sm:space-x-6">
          <img src={item.img} alt={item.name} className="w-full sm:w-64 h-64 object-cover rounded-lg"/>
          <div className="mt-4 sm:mt-0">
            <h2 className="text-2xl font-bold mb-2">{item.name}</h2>
            <p className="text-gray-600 mb-1">Price: ${item.price}</p>
            <p className={`font-semibold mb-1 ${item.status === 'stopped' ? 'text-green-500' : 'text-yellow-500'}`}>
              Status: {item.status}
            </p>
            <p className="text-gray-500 mb-1">Time left to buy: {item.waitTime}</p>
            <p className="text-gray-500 mb-1">Emotion: {item.emotion}</p>
            <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Go to product</a>
          </div>
        </div>
        <div className="mt-4 flex space-x-2">
          <Button>Mark as Bought</Button>
          <Button className="bg-gray-300 text-black">Stop Impulse</Button>
        </div>
      </Card>
    </div>
  );
}
