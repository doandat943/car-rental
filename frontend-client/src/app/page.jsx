import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-800 to-blue-600 text-white py-20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Rent Your Perfect Car
              </h1>
              <p className="text-lg mb-8">
                Choose from our wide range of premium vehicles for your next adventure
              </p>
              <div>
                <Link href="/cars" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition">
                  Browse Cars
                </Link>
              </div>
            </div>
            <div className="md:w-1/2">
              {/* Placeholder for a car image */}
              <div className="bg-blue-700 h-64 w-full rounded-lg flex items-center justify-center">
                <p className="text-xl">Car Image Carousel Will Go Here</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
              <h3 className="text-xl font-semibold mb-2">Choose Your Car</h3>
              <p className="text-gray-600">Browse our collection and select the perfect vehicle for your journey</p>
            </div>
            
            {/* Step 2 */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
              <h3 className="text-xl font-semibold mb-2">Book Your Dates</h3>
              <p className="text-gray-600">Select pickup and return dates that work for your schedule</p>
            </div>
            
            {/* Step 3 */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
              <h3 className="text-xl font-semibold mb-2">Enjoy Your Ride</h3>
              <p className="text-gray-600">Pick up your car and start your adventure with peace of mind</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Cars Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Cars</h2>
            <Link href="/cars" className="text-blue-600 hover:text-blue-800">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Car Card Placeholders */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">Car Model {i}</h3>
                  <div className="flex justify-between mb-4">
                    <span className="text-gray-600">SUV</span>
                    <span className="font-bold text-blue-600">$75/day</span>
                  </div>
                  <div className="flex text-sm text-gray-600 mb-4">
                    <div className="mr-4">4 Seats</div>
                    <div className="mr-4">Auto</div>
                    <div>A/C</div>
                  </div>
                  <Link href={`/car/${i}`} className="block text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 bg-gray-300 rounded-full"></div>
                <div className="ml-4">
                  <h4 className="font-semibold">John Doe</h4>
                  <div className="text-yellow-400">★★★★★</div>
                </div>
              </div>
              <p className="text-gray-600">"Great service and amazing vehicles. Will definitely use again for my next trip!"</p>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 bg-gray-300 rounded-full"></div>
                <div className="ml-4">
                  <h4 className="font-semibold">Jane Smith</h4>
                  <div className="text-yellow-400">★★★★★</div>
                </div>
              </div>
              <p className="text-gray-600">"The booking process was so simple and the car was in perfect condition. Highly recommend!"</p>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 bg-gray-300 rounded-full"></div>
                <div className="ml-4">
                  <h4 className="font-semibold">Robert Johnson</h4>
                  <div className="text-yellow-400">★★★★★</div>
                </div>
              </div>
              <p className="text-gray-600">"Exceptional customer service and competitive prices. My go-to car rental service now."</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Experience the freedom of the open road with our premium vehicles</p>
          <Link href="/cars" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition">
            Reserve Now
          </Link>
        </div>
      </section>
    </main>
  );
} 