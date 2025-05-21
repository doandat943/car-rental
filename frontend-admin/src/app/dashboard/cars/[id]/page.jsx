"use client";

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Car, 
  ArrowLeft,
  Edit,
  Calendar,
  DollarSign,
  Tag,
  Settings,
  Loader2,
  AlertCircle,
  User,
  Star,
  MessageSquare,
  Clock,
  CheckCircle,
  CircleSlash,
  Package,
  Radio,
  ShieldCheck,
  Cpu,
  Sofa,
  Gauge,
  Heart,
  ListChecks,
  Check
} from 'lucide-react';
import { carsAPI, reviewsAPI } from '../../../../lib/api';
import { Button } from '../../../../components/ui/Button';

export default function CarDetails({ params }) {
  const router = useRouter();
  const { id } = use(params);
  
  const [carData, setCarData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState(null);
  
  // Fetch car details
  useEffect(() => {
    const fetchCarDetails = async () => {
      setLoading(true);
      try {
        const response = await carsAPI.getCarById(id);
        
        if (response.success) {
          setCarData(response.data);
        } else {
          setError('Unable to load car information');
        }
      } catch (error) {
        console.error('Error fetching car details:', error);
        setError('Error loading car data');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCarDetails();
    }
  }, [id]);

  // Fetch car reviews
  useEffect(() => {
    const fetchCarReviews = async () => {
      setReviewsLoading(true);
      try {
        const response = await reviewsAPI.getReviewsByCarId(id, { limit: 5 });
        
        if (response.success) {
          setReviews(response.data || []);
        } else {
          setReviewsError('Unable to load reviews');
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setReviewsError('Error loading reviews');
      } finally {
        setReviewsLoading(false);
      }
    };

    if (id) {
      fetchCarReviews();
    }
  }, [id]);

  // Helper to format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Helper to get status badge class
  const getStatusClass = (status) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-200 dark:border-green-600';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-600';
      case 'rented':
        return 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-600';
      case 'reserved':
        return 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900 dark:text-purple-200 dark:border-purple-600';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600';
    }
  };

  // Helper to get feature category badge class
  const getFeatureCategoryClass = (category) => {
    switch (category?.toLowerCase() || 'other') {
      case 'safety':
        return 'border-red-500 text-red-800 dark:text-red-300';
      case 'technology':
        return 'border-blue-500 text-blue-800 dark:text-blue-300';
      case 'comfort':
        return 'border-green-500 text-green-800 dark:text-green-300';
      case 'performance':
        return 'border-yellow-500 text-yellow-800 dark:text-yellow-300';
      case 'convenience':
        return 'border-purple-500 text-purple-800 dark:text-purple-300';
      default:
        return 'border-gray-500 text-gray-800 dark:text-gray-300';
    }
  };

  // Get feature category icon
  const getFeatureCategoryIcon = (category) => {
    switch (category?.toLowerCase() || 'other') {
      case 'safety':
        return <ShieldCheck className="h-5 w-5 text-red-500 dark:text-red-400" />;
      case 'technology':
        return <Cpu className="h-5 w-5 text-blue-500 dark:text-blue-400" />;
      case 'comfort':
        return <Sofa className="h-5 w-5 text-green-500 dark:text-green-400" />;
      case 'performance':
        return <Gauge className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />;
      case 'convenience':
        return <Heart className="h-5 w-5 text-purple-500 dark:text-purple-400" />;
      default:
        return <ListChecks className="h-5 w-5 text-gray-500 dark:text-gray-400" />;
    }
  };

  // Group features by category
  const groupFeaturesByCategory = (features) => {
    if (!features || features.length === 0) return {};
    
    const grouped = {};
    
    features.forEach(feature => {
      // Debug log để xem dữ liệu feature nhận về
      console.log('Feature:', feature);
      
      // Trường hợp feature chỉ là string (ID)
      if (typeof feature === 'string') {
        if (!grouped['other']) {
          grouped['other'] = [];
        }
        grouped['other'].push({ _id: feature, name: feature });
        return;
      }
      
      // Lấy category của feature, đảm bảo chữ thường để so sánh
      let category = 'other';
      
      if (feature.category) {
        // Nếu category là object (đã populated)
        if (typeof feature.category === 'object' && feature.category.name) {
          category = feature.category.name.toLowerCase();
        }
        // Nếu category là string (chỉ có ID hoặc tên)
        else if (typeof feature.category === 'string') {
          // Nếu đây là một tên category đã biết, sử dụng nó
          const knownCategories = ['safety', 'technology', 'comfort', 'performance', 'convenience'];
          const lowerCaseCategory = feature.category.toLowerCase();
          if (knownCategories.includes(lowerCaseCategory)) {
            category = lowerCaseCategory;
          }
        }
      }
      
      // Một số tính năng có thể có thông tin category ở thuộc tính khác
      if (category === 'other' && feature.type) {
        const lowerCaseType = feature.type.toLowerCase();
        const knownTypes = ['safety', 'technology', 'comfort', 'performance', 'convenience'];
        if (knownTypes.includes(lowerCaseType)) {
          category = lowerCaseType;
        }
      }
      
      // Nếu tên feature chứa các từ khóa liên quan đến category, có thể phân loại dựa vào đó
      const featureName = feature.name.toLowerCase();
      
      if (category === 'other') {
        if (featureName.includes('safety') || featureName.includes('airbag') || featureName.includes('brake') || featureName.includes('assist')) {
          category = 'safety';
        } else if (featureName.includes('screen') || featureName.includes('navigation') || featureName.includes('technology') || featureName.includes('wifi') || featureName.includes('charging') || featureName.includes('bluetooth')) {
          category = 'technology';
        } else if (featureName.includes('seat') || featureName.includes('comfort') || featureName.includes('climate') || featureName.includes('air') || featureName.includes('conditioning') || featureName.includes('sunroof')) {
          category = 'comfort';
        } else if (featureName.includes('engine') || featureName.includes('performance') || featureName.includes('drive') || featureName.includes('speed') || featureName.includes('control')) {
          category = 'performance';
        }
      }
      
      // Đảm bảo category đã được khởi tạo
      if (!grouped[category]) {
        grouped[category] = [];
      }
      
      // Thêm feature vào nhóm tương ứng
      grouped[category].push(feature);
    });
    
    console.log('Grouped features:', grouped);
    return grouped;
  };

  if (loading) {
    return (
      <div className="px-4 pt-6 flex justify-center items-center min-h-[70vh]">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin mx-auto text-blue-500" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading car details...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="px-4 pt-6">
        <div className="mb-6 flex items-center">
          <Button 
            variant="ghost" 
            size="sm"
            className="mr-2"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Error</h1>
        </div>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative dark:bg-red-900 dark:border-red-800 dark:text-red-200" role="alert">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span className="block sm:inline">{error}</span>
          </div>
          <div className="mt-4">
            <Button
              variant="outline"
              onClick={() => router.push('/dashboard/cars')}
            >
              Return to cars list
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!carData) {
    return (
      <div className="px-4 pt-6">
        <div className="mb-6 flex items-center">
          <Button 
            variant="ghost" 
            size="sm"
            className="mr-2"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Car Not Found</h1>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded relative dark:bg-yellow-900 dark:border-yellow-800 dark:text-yellow-200" role="alert">
          <p>The requested car could not be found.</p>
          <div className="mt-4">
            <Button
              variant="outline"
              onClick={() => router.push('/dashboard/cars')}
            >
              Return to cars list
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const groupedFeatures = groupFeaturesByCategory(carData.features);

  return (
    <div className="px-4 pt-6 pb-8">
      {/* Header with back button */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="sm"
              className="mr-2"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">{carData.name}</h1>
          </div>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {carData.brand?.name} {carData.model} • {carData.year}
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-3">
          <Button variant="outline" onClick={() => router.push(`/dashboard/cars/${id}/edit`)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Car
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main details column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Car images */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden dark:bg-gray-800 dark:border-gray-700">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Images</h2>
            </div>
            <div className="p-4">
              {carData.images && carData.images.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {carData.images.map((image, index) => (
                    <div key={index} className="relative aspect-square rounded-md overflow-hidden border border-gray-200 dark:border-gray-700">
                      <img 
                        src={image.startsWith('http') 
                            ? image 
                            : `${process.env.API_BASE_URL}${image}`}
                        alt={`${carData.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                        }}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex h-40 items-center justify-center border-2 border-dashed border-gray-200 rounded-lg dark:border-gray-700">
                  <div className="text-center">
                    <Car className="h-10 w-10 text-gray-400 mx-auto" />
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">No images available</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden dark:bg-gray-800 dark:border-gray-700">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Description</h2>
            </div>
            <div className="p-4">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                {carData.description || 'No description provided.'}
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden dark:bg-gray-800 dark:border-gray-700">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Features</h2>
            </div>
            <div className="p-4">
              {Object.keys(groupedFeatures).length > 0 ? (
                <div className="space-y-6">
                  {Object.entries(groupedFeatures).map(([category, features]) => (
                    <div key={category} className="space-y-3">
                      <div className="flex items-center">
                        <span className="flex-shrink-0 w-5">
                          {getFeatureCategoryIcon(category)}
                        </span>
                        <h3 className="ml-2 text-md font-medium capitalize text-gray-800 dark:text-gray-200">
                          {category}
                        </h3>
                      </div>
                      <div className={`ml-2 border-l-4 pl-4 border-l-solid rounded-sm space-y-2 pt-1 pb-1 
                        ${getFeatureCategoryClass(category)}`}>
                        {features.map(feature => (
                          <div 
                            key={feature._id}
                            className="flex items-center py-1"
                          >
                            <Check className="h-4 w-4 mr-2 flex-shrink-0" />
                            <span className="text-sm">{feature.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No features specified</p>
              )}
            </div>
          </div>

          {/* Reviews */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden dark:bg-gray-800 dark:border-gray-700">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Customer Reviews</h2>
              <div className="flex items-center">
                <Star className="w-5 h-5 text-yellow-400" fill="currentColor" />
                <span className="ml-1 text-gray-700 font-medium dark:text-gray-300">
                  {carData.rating ? carData.rating.toFixed(1) : 'N/A'} 
                  <span className="text-gray-500 text-sm ml-1 dark:text-gray-400">
                    ({carData.reviewCount || 0} reviews)
                  </span>
                </span>
              </div>
            </div>
            <div className="p-4">
              {reviewsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                </div>
              ) : reviewsError ? (
                <div className="text-red-500 py-2 dark:text-red-400">
                  {reviewsError}
                </div>
              ) : reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review._id} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0 dark:border-gray-700">
                      <div className="flex justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <User className="h-10 w-10 rounded-full bg-gray-200 p-2 text-gray-600 dark:bg-gray-700 dark:text-gray-400" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {review.user?.name || 'Anonymous'}
                            </p>
                            <div className="flex items-center">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating
                                      ? 'text-yellow-400 fill-current'
                                      : 'text-gray-300 dark:text-gray-600'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      {review.title && (
                        <p className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                          {review.title}
                        </p>
                      )}
                      <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                        {review.comment}
                      </p>
                    </div>
                  ))}

                  {carData.reviewCount > reviews.length && (
                    <div className="text-center pt-2">
                      <button 
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium dark:text-blue-400 dark:hover:text-blue-300"
                        onClick={() => {}}
                      >
                        View all {carData.reviewCount} reviews
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex h-32 items-center justify-center border-2 border-dashed border-gray-200 rounded-lg dark:border-gray-700">
                  <div className="text-center">
                    <MessageSquare className="h-8 w-8 text-gray-400 mx-auto" />
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">No reviews yet</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar with details */}
        <div className="lg:col-span-1 space-y-6">
          {/* Car Status */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden dark:bg-gray-800 dark:border-gray-700">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Status</h2>
            </div>
            <div className="p-4">
              <div className="flex items-center">
                {carData.status === 'available' ? (
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                ) : carData.status === 'maintenance' ? (
                  <Settings className="h-5 w-5 text-yellow-500 mr-2" />
                ) : carData.status === 'rented' ? (
                  <Calendar className="h-5 w-5 text-blue-500 mr-2" />
                ) : (
                  <Clock className="h-5 w-5 text-purple-500 mr-2" />
                )}
                <span className={`px-2.5 py-0.5 rounded-full text-sm font-medium ${getStatusClass(carData.status)}`}>
                  {carData.status?.charAt(0).toUpperCase() + carData.status?.slice(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Technical Details */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden dark:bg-gray-800 dark:border-gray-700">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Details</h2>
            </div>
            <div className="p-4">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Tag className="flex-shrink-0 h-5 w-5 text-gray-500 mt-0.5 mr-3 dark:text-gray-400" />
                  <div>
                    <span className="block text-sm text-gray-500 dark:text-gray-400">Category</span>
                    <span className="block text-sm font-medium text-gray-900 dark:text-white">{carData.category?.name || 'Not specified'}</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <Package className="flex-shrink-0 h-5 w-5 text-gray-500 mt-0.5 mr-3 dark:text-gray-400" />
                  <div>
                    <span className="block text-sm text-gray-500 dark:text-gray-400">Seats</span>
                    <span className="block text-sm font-medium text-gray-900 dark:text-white">{carData.seats || '5'}</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <Settings className="flex-shrink-0 h-5 w-5 text-gray-500 mt-0.5 mr-3 dark:text-gray-400" />
                  <div>
                    <span className="block text-sm text-gray-500 dark:text-gray-400">Transmission</span>
                    <span className="block text-sm font-medium text-gray-900 dark:text-white">{carData.transmission?.name || 'Not specified'}</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <Radio className="flex-shrink-0 h-5 w-5 text-gray-500 mt-0.5 mr-3 dark:text-gray-400" />
                  <div>
                    <span className="block text-sm text-gray-500 dark:text-gray-400">Fuel Type</span>
                    <span className="block text-sm font-medium text-gray-900 dark:text-white">{carData.fuel?.name || 'Not specified'}</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden dark:bg-gray-800 dark:border-gray-700">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Pricing</h2>
            </div>
            <div className="p-4">
              <ul className="space-y-2">
                {carData.price?.daily && (
                  <li className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Daily Rate</span>
                    <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(carData.price.daily)}</span>
                  </li>
                )}
                {carData.price?.weekly && (
                  <li className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Weekly Rate</span>
                    <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(carData.price.weekly)}</span>
                  </li>
                )}
                {carData.price?.monthly && (
                  <li className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Monthly Rate</span>
                    <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(carData.price.monthly)}</span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 