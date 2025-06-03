"use client";

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  Edit,
  Calendar,
  Users,
  Star,
  MapPin,
  Car,
  Fuel,
  DollarSign,
  ChevronRight,
  Eye,
  Loader2,
  AlertCircle,
  ImageIcon,
  User,
  MessageSquare,
  ShieldCheck,
  Cpu,
  Sofa,
  Gauge,
  Heart,
  ListChecks,
  Check,
  Package,
  Cog
} from 'lucide-react';
import { carsAPI } from '../../../../lib/api';
import { Button } from '../../../../components/ui/Button';

export default function CarDetails({ params }) {
  const router = useRouter();
  const { id } = use(params);
  
  const [carData, setCarData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
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
    
    return grouped;
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!carData) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Car not found</p>
        </div>
      </div>
    );
  }

  // Group features by category
  const groupedFeatures = groupFeaturesByCategory(carData.features);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => router.push('/dashboard/cars')}
            className="px-3 py-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cars
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {carData.name || `${carData.brand?.name || carData.brand} ${carData.model?.name || carData.model}`}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Car Details</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={() => router.push(`/dashboard/cars/${id}/edit`)}
            className="px-4 py-2"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Car
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Car Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Car Images */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden dark:bg-gray-800 dark:border-gray-700">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Car Images</h2>
            </div>
            <div className="p-4">
              {carData.images && carData.images.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {carData.images.map((image, index) => (
                    <div key={index} className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/cars/${image}`}
                        alt={`${carData.name} - Image ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex h-48 items-center justify-center border-2 border-dashed border-gray-200 rounded-lg dark:border-gray-700">
                  <div className="text-center">
                    <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">No images available</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Car Specifications */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Specifications</h2>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg dark:bg-gray-700">
                  <Car className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Brand</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {carData.brand?.name || carData.brand || 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg dark:bg-gray-700">
                  <Cog className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Model</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {carData.model?.name || carData.model || 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg dark:bg-gray-700">
                  <Calendar className="h-5 w-5 text-purple-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Year</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{carData.year || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg dark:bg-gray-700">
                  <Users className="h-5 w-5 text-yellow-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Seats</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{carData.seats || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg dark:bg-gray-700">
                  <Cog className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Transmission</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {carData.transmission?.name || carData.transmission || 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg dark:bg-gray-700">
                  <Fuel className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Fuel Type</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {carData.fuel?.name || carData.fuel || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          {carData.features && carData.features.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden dark:bg-gray-800 dark:border-gray-700">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">Features</h2>
              </div>
              <div className="p-4">
                {Object.keys(groupedFeatures).length > 0 ? (
                  <div className="space-y-6">
                    {Object.entries(groupedFeatures).map(([categoryName, features]) => (
                      <div key={categoryName}>
                        <div className="flex items-center mb-3">
                          {getFeatureCategoryIcon(categoryName)}
                          <h3 className="ml-2 text-sm font-medium text-gray-900 dark:text-white capitalize">
                            {categoryName === 'other' ? 'Other Features' : categoryName}
                          </h3>
                          <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                            ({features.length})
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {features.map((feature, index) => (
                            <div 
                              key={feature._id || index}
                              className={`flex items-center p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 ${getFeatureCategoryClass(categoryName)}`}
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
                  <div className="flex h-32 items-center justify-center border-2 border-dashed border-gray-200 rounded-lg dark:border-gray-700">
                    <div className="text-center">
                      <ListChecks className="h-8 w-8 text-gray-400 mx-auto" />
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">No features listed</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Description */}
          {carData.description && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">Description</h2>
              </div>
              <div className="p-4">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{carData.description}</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Car Status & Actions */}
        <div className="space-y-6">
          {/* Status & Pricing */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Status & Pricing</h2>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900 dark:text-white">Status</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusClass(carData.status)}`}>
                  {carData.status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900 dark:text-white">Daily Rate</span>
                <span className="text-lg font-bold text-green-600 dark:text-green-400">
                  {formatCurrency(carData.price)}
                </span>
              </div>
              {carData.category && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Category</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {carData.category.name || carData.category}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Quick Actions</h2>
            </div>
            <div className="p-4 space-y-3">
              <Button
                variant="outline"
                onClick={() => router.push(`/dashboard/cars/${id}/edit`)}
                className="w-full justify-start"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Car Details
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push(`/dashboard/bookings?car=${id}`)}
                className="w-full justify-start"
              >
                <Eye className="h-4 w-4 mr-2" />
                View Bookings
              </Button>
            </div>
          </div>

          {/* Car Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Car Information</h2>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Car ID</span>
                <span className="font-mono text-gray-900 dark:text-white">{carData._id}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Added On</span>
                <span className="text-gray-900 dark:text-white">
                  {new Date(carData.createdAt).toLocaleDateString()}
                </span>
              </div>
              {carData.updatedAt && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Last Updated</span>
                  <span className="text-gray-900 dark:text-white">
                    {new Date(carData.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 