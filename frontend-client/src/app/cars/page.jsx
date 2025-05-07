import Link from 'next/link';

export const metadata = {
  title: 'Car Listings | Car Rental Service',
  description: 'Browse our collection of vehicles available for rent',
};

export default function CarsPage() {
  // This would be fetched from the API in a real application
  const cars = [
    {
      id: 1,
      name: 'Tesla Model 3',
      brand: 'Tesla',
      category: 'Sedan',
      price: { daily: 100 },
      images: ['/placeholder.jpg'],
      specifications: {
        seats: 5,
        doors: 4,
        transmission: 'Automatic',
        fuelType: 'Electric'
      }
    },
    {
      id: 2,
      name: 'Toyota RAV4',
      brand: 'Toyota',
      category: 'SUV',
      price: { daily: 80 },
      images: ['/placeholder.jpg'],
      specifications: {
        seats: 5,
        doors: 5,
        transmission: 'Automatic',
        fuelType: 'Hybrid'
      }
    },
    {
      id: 3,
      name: 'Ford Mustang',
      brand: 'Ford',
      category: 'Sports',
      price: { daily: 120 },
      images: ['/placeholder.jpg'],
      specifications: {
        seats: 4,
        doors: 2,
        transmission: 'Manual',
        fuelType: 'Gasoline'
      }
    },
    {
      id: 4,
      name: 'Honda Civic',
      brand: 'Honda',
      category: 'Sedan',
      price: { daily: 70 },
      images: ['/placeholder.jpg'],
      specifications: {
        seats: 5,
        doors: 4,
        transmission: 'Automatic',
        fuelType: 'Gasoline'
      }
    },
    {
      id: 5,
      name: 'BMW X5',
      brand: 'BMW',
      category: 'SUV',
      price: { daily: 150 },
      images: ['/placeholder.jpg'],
      specifications: {
        seats: 7,
        doors: 5,
        transmission: 'Automatic',
        fuelType: 'Diesel'
      }
    },
    {
      id: 6,
      name: 'Mercedes-Benz E-Class',
      brand: 'Mercedes-Benz',
      category: 'Luxury',
      price: { daily: 180 },
      images: ['/placeholder.jpg'],
      specifications: {
        seats: 5,
        doors: 4,
        transmission: 'Automatic',
        fuelType: 'Gasoline'
      }
    }
  ];

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-6">
        <h1 className="text-3xl font-bold mb-8">Available Cars</h1>
        
        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Car Type</label>
              <select className="w-full p-2 border rounded">
                <option value="">All Types</option>
                <option value="sedan">Sedan</option>
                <option value="suv">SUV</option>
                <option value="sports">Sports</option>
                <option value="luxury">Luxury</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Brand</label>
              <select className="w-full p-2 border rounded">
                <option value="">All Brands</option>
                <option value="tesla">Tesla</option>
                <option value="toyota">Toyota</option>
                <option value="ford">Ford</option>
                <option value="honda">Honda</option>
                <option value="bmw">BMW</option>
                <option value="mercedes">Mercedes-Benz</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Price Range</label>
              <select className="w-full p-2 border rounded">
                <option value="">Any Price</option>
                <option value="budget">$0 - $75</option>
                <option value="mid">$75 - $125</option>
                <option value="premium">$125+</option>
              </select>
            </div>
            <div className="flex items-end">
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition w-full">
                Apply Filters
              </button>
            </div>
          </div>
        </div>
        
        {/* Cars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cars.map((car) => (
            <div key={car.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">Car Image</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{car.name}</h3>
                <div className="flex justify-between mb-4">
                  <span className="text-gray-600">{car.category}</span>
                  <span className="font-bold text-blue-600">${car.price.daily}/day</span>
                </div>
                <div className="flex text-sm text-gray-600 mb-4">
                  <div className="mr-4">{car.specifications.seats} Seats</div>
                  <div className="mr-4">{car.specifications.transmission}</div>
                  <div>{car.specifications.fuelType}</div>
                </div>
                <Link href={`/car/${car.id}`} className="block text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        {/* Pagination */}
        <div className="mt-12 flex justify-center">
          <div className="flex space-x-2">
            <button className="px-4 py-2 border rounded bg-white hover:bg-gray-50">Previous</button>
            <button className="px-4 py-2 border rounded bg-blue-600 text-white">1</button>
            <button className="px-4 py-2 border rounded bg-white hover:bg-gray-50">2</button>
            <button className="px-4 py-2 border rounded bg-white hover:bg-gray-50">3</button>
            <button className="px-4 py-2 border rounded bg-white hover:bg-gray-50">Next</button>
          </div>
        </div>
      </div>
    </main>
  );
} 