import Link from 'next/link';

export async function generateMetadata({ params }) {
  // In a real app, this would fetch the car data from the API
  return {
    title: `Car Details | Car Rental Service`,
    description: 'View detailed information and book this car',
  };
}

export default function CarDetailPage({ params }) {
  const { id } = params;
  
  // This would be fetched from the API in a real application
  const car = {
    id: Number(id),
    name: 'Tesla Model 3',
    brand: 'Tesla',
    model: 'Model 3',
    year: 2023,
    category: 'Sedan',
    price: {
      hourly: 15,
      daily: 100,
      weekly: 600,
      monthly: 2000
    },
    description: 'The Tesla Model 3 is an all-electric four-door sedan manufactured by Tesla. It is designed for electric performance, with quick acceleration, long range and fast charging capabilities.',
    features: [
      'Autopilot',
      'All-wheel drive',
      'Premium audio system',
      'Heated seats',
      'Navigation',
      'Bluetooth connectivity',
      'Backup camera',
      'Keyless entry'
    ],
    images: ['/placeholder.jpg', '/placeholder.jpg', '/placeholder.jpg'],
    specifications: {
      seats: 5,
      doors: 4,
      transmission: 'Automatic',
      fuelType: 'Electric',
      engineCapacity: 'Dual Motor'
    },
    availability: true,
    rating: 4.8,
    reviewCount: 24
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-6">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link href="/" className="text-blue-600 hover:text-blue-800">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/cars" className="text-blue-600 hover:text-blue-800">Cars</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-600">{car.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Car Images and Details */}
          <div className="lg:col-span-2">
            {/* Car Images */}
            <div className="bg-white p-4 rounded-lg shadow-md mb-8">
              <div className="bg-gray-200 h-80 flex items-center justify-center mb-4 rounded-lg">
                <span className="text-gray-500 text-xl">Main Image</span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {car.images.map((image, index) => (
                  <div key={index} className="bg-gray-200 h-24 flex items-center justify-center rounded-lg">
                    <span className="text-gray-500">Image {index + 1}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Car Details */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
              <h1 className="text-3xl font-bold mb-2">{car.name}</h1>
              <div className="flex items-center mb-4">
                <div className="text-yellow-400 mr-2">★★★★★</div>
                <span className="text-gray-600">{car.rating} ({car.reviewCount} reviews)</span>
              </div>
              
              <div className="border-t border-b py-4 my-4">
                <h2 className="text-xl font-semibold mb-4">Specifications</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-gray-600">Brand</div>
                    <div className="font-semibold">{car.brand}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Model</div>
                    <div className="font-semibold">{car.model}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Year</div>
                    <div className="font-semibold">{car.year}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Category</div>
                    <div className="font-semibold">{car.category}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Seats</div>
                    <div className="font-semibold">{car.specifications.seats}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Doors</div>
                    <div className="font-semibold">{car.specifications.doors}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Transmission</div>
                    <div className="font-semibold">{car.specifications.transmission}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Fuel Type</div>
                    <div className="font-semibold">{car.specifications.fuelType}</div>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Description</h2>
                <p className="text-gray-700">{car.description}</p>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-3">Features</h2>
                <ul className="grid grid-cols-2 gap-2">
                  {car.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <span className="bg-blue-100 text-blue-600 p-1 rounded-full mr-2">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          
          {/* Booking Form */}
          <div>
            <div className="bg-white p-6 rounded-lg shadow-md mb-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Book This Car</h2>
              
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Rental Prices</h3>
                <div className="grid grid-cols-2 gap-y-2">
                  <div className="text-gray-600">Hourly:</div>
                  <div className="font-semibold">${car.price.hourly}</div>
                  <div className="text-gray-600">Daily:</div>
                  <div className="font-semibold">${car.price.daily}</div>
                  <div className="text-gray-600">Weekly:</div>
                  <div className="font-semibold">${car.price.weekly}</div>
                  <div className="text-gray-600">Monthly:</div>
                  <div className="font-semibold">${car.price.monthly}</div>
                </div>
              </div>
              
              <form>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Pickup Date</label>
                  <input type="date" className="w-full p-2 border rounded" />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Return Date</label>
                  <input type="date" className="w-full p-2 border rounded" />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Pickup Location</label>
                  <select className="w-full p-2 border rounded">
                    <option value="">Select location</option>
                    <option value="airport">Airport Terminal</option>
                    <option value="downtown">Downtown Office</option>
                    <option value="mall">Shopping Mall</option>
                  </select>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <div className="flex justify-between mb-2">
                    <span>Daily Rate:</span>
                    <span>${car.price.daily}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Estimated for 3 days:</span>
                    <span>${car.price.daily * 3}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>${car.price.daily * 3}</span>
                  </div>
                </div>
                
                <button 
                  type="submit"
                  className="bg-blue-600 text-white w-full py-3 rounded-lg font-semibold text-lg hover:bg-blue-700 transition"
                >
                  Book Now
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 