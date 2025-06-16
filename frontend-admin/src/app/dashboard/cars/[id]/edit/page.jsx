"use client";

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Car, 
  ArrowLeft,
  Upload,
  X,
  Plus,
  Loader2,
  AlertCircle,
  Check,
  ShieldCheck,
  Cpu,
  Sofa,
  Gauge,
  Heart,
  ListChecks
} from 'lucide-react';
import { carsAPI, categoriesAPI, brandsAPI, transmissionsAPI, fuelsAPI, featuresAPI } from '../../../../../lib/api';
import { Button } from '../../../../../components/ui/Button';
import React from 'react';

// Feature category options
const FEATURE_CATEGORIES = [
  'safety',
  'technology',
  'comfort',
  'performance',
  'convenience',
  'other'
];

export default function EditCar({ params }) {
  const router = useRouter();
  const { id } = use(params);
  
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    price: 0,
    category: '',
    description: '',
    features: [],
    status: 'available',
    seats: 5,
    transmission: 'automatic',
    fuel: 'gasoline',
    images: []
  });
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [featureInput, setFeatureInput] = useState('');
  const [currentImages, setCurrentImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [brands, setBrands] = useState([]);
  const [transmissions, setTransmissions] = useState([]);
  const [fuels, setFuels] = useState([]);
  const [availableFeatures, setAvailableFeatures] = useState([]);
  const [attributesLoading, setAttributesLoading] = useState(true);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [displayOrder, setDisplayOrder] = useState([]);

  // Modal state
  const [showFeatureModal, setShowFeatureModal] = useState(false);
  const [newFeatureData, setNewFeatureData] = useState({
    name: '',
    category: 'other',
    description: ''
  });
  const [createFeatureLoading, setCreateFeatureLoading] = useState(false);
  const [createFeatureError, setCreateFeatureError] = useState(null);

  // Get attributes list
  useEffect(() => {
    const fetchAttributes = async () => {
      setAttributesLoading(true);
      try {
        // Fetch brands
        const brandsResponse = await brandsAPI.getAllBrands();
        if (brandsResponse.success) {
          setBrands(brandsResponse.data || []);
        }
        
        // Fetch transmissions
        const transmissionsResponse = await transmissionsAPI.getAllTransmissions();
        if (transmissionsResponse.success) {
          setTransmissions(transmissionsResponse.data || []);
        }
        
        // Fetch fuels
        const fuelsResponse = await fuelsAPI.getAllFuels();
        if (fuelsResponse.success) {
          setFuels(fuelsResponse.data || []);
        }
        
        // Fetch features
        const featuresResponse = await featuresAPI.getAllFeatures();
        if (featuresResponse.success) {
          setAvailableFeatures(featuresResponse.data || []);
        }
      } catch (error) {
        console.error('Error fetching attributes:', error);
      } finally {
        setAttributesLoading(false);
      }
    };

    fetchAttributes();
  }, []);

  // Get information of the car to be edited
  useEffect(() => {
    const fetchCarDetails = async () => {
      setPageLoading(true);
      try {
        const response = await carsAPI.getCarById(id);
        
        // Check if the response was successful and has data
        if (response.success) {
          const carData = response.data;
          
          // Set form data from API response
          setFormData({
            name: carData.name || '',
            brand: carData.brand?._id || carData.brand || '',
            model: carData.model || '',
            year: carData.year || new Date().getFullYear(),
            price: carData.price || 0,
            category: carData.category?._id || carData.category || '',
            description: carData.description || '',
            features: carData.features?.map(f => typeof f === 'object' ? f._id : f) || [],
            status: carData.status || 'available',
            seats: carData.seats || 5,
            transmission: carData.transmission?._id || carData.transmission || '',
            fuel: carData.fuel?._id || carData.fuel || ''
          });

          // Set selected features
          if (Array.isArray(carData.features)) {
            setSelectedFeatures(carData.features.map(f => typeof f === 'object' ? f._id : f));
          }
          
          if (carData.images && carData.images.length > 0) {
            setCurrentImages(carData.images);
          }
        } else {
          setError('Unable to load car information');
        }
      } catch (error) {
        console.error('Error fetching car details:', error);
        setError('Error loading car data');
      } finally {
        setPageLoading(false);
      }
    };

    if (id) {
      fetchCarDetails();
    }
  }, [id]);

  // Get category list
  useEffect(() => {
    const fetchCategories = async () => {
      setCategoryLoading(true);
      try {
        const response = await categoriesAPI.getAllCategories();
        if (response.success) {
          setCategories(response.data || []);
        } else {
          console.error('Error fetching categories:', response.message);
          setCategories([]);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]);
      } finally {
        setCategoryLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Effect to initialize display order when images change
  useEffect(() => {
    const order = [
      ...currentImages.map((_, index) => ({ type: 'current', index })),
      ...selectedFiles.map((_, index) => ({ type: 'new', index }))
    ];
    setDisplayOrder(order);
  }, [currentImages.length, selectedFiles.length]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle price field
    if (name === 'price') {
      setFormData({
        ...formData,
        price: parseFloat(value) || 0
      });
    } else if (name === 'seats') {
      setFormData({
        ...formData,
        seats: parseInt(value) || 5
      });
    } else if (name === 'transmission') {
      setFormData({
        ...formData,
        transmission: value
      });
    } else if (name === 'fuel') {
      setFormData({
        ...formData,
        fuel: value
      });
    } else {
      // Handle regular fields
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // Handle adding feature
  const handleAddFeature = () => {
    if (!featureInput) return;
    
    // Check if the input matches an available feature
    const feature = availableFeatures.find(f => 
      f.name.toLowerCase() === featureInput.trim().toLowerCase());
    
    if (feature && !selectedFeatures.includes(feature._id)) {
      const newSelectedFeatures = [...selectedFeatures, feature._id];
      setSelectedFeatures(newSelectedFeatures);
      setFormData({
        ...formData,
        features: newSelectedFeatures
      });
      setFeatureInput('');
    } else if (!feature) {
      // If it's a custom feature, show an error or prompt to add it to the system first
      alert('Please select a feature from the available features list or add it in the Car Attributes management page first.');
    }
  };

  // Handle feature selection from dropdown
  const handleFeatureSelect = (featureId) => {
    if (!selectedFeatures.includes(featureId)) {
      const newSelectedFeatures = [...selectedFeatures, featureId];
      setSelectedFeatures(newSelectedFeatures);
      setFormData({
        ...formData,
        features: newSelectedFeatures
      });
    }
  };

  // Handle removing features
  const handleRemoveFeature = (featureId) => {
    const newSelectedFeatures = selectedFeatures.filter(id => id !== featureId);
    setSelectedFeatures(newSelectedFeatures);
    setFormData({
      ...formData,
      features: newSelectedFeatures
    });
  };

  // Get feature name by ID
  const getFeatureName = (featureId) => {
    const feature = availableFeatures.find(f => f._id === featureId);
    return feature ? feature.name : 'Unknown Feature';
  };

  // Get feature with category
  const getFeatureWithCategory = (featureId) => {
    const feature = availableFeatures.find(f => f._id === featureId);
    if (!feature) return { name: 'Unknown Feature', category: 'other' };
    return {
      name: feature.name,
      category: feature.category || 'other'
    };
  };

  // Group selected features by category
  const groupSelectedFeaturesByCategory = () => {
    const grouped = {};
    
    selectedFeatures.forEach(featureId => {
      const feature = getFeatureWithCategory(featureId);
      const category = feature.category;
      
      if (!grouped[category]) {
        grouped[category] = [];
      }
      
      grouped[category].push({
        id: featureId,
        name: feature.name
      });
    });
    
    return grouped;
  };

  // Group features by category
  const groupFeaturesByCategory = () => {
    const grouped = {};
    
    availableFeatures
      .filter(feature => !selectedFeatures.includes(feature._id))
      .forEach(feature => {
        const category = feature.category || 'other';
        if (!grouped[category]) {
          grouped[category] = [];
        }
        grouped[category].push(feature);
      });
    
    return grouped;
  };

  // Handle image file selection
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Limit the number of files (maximum 5 images in total)
    if (currentImages.length + selectedFiles.length + files.length > 5) {
      alert('You can only upload a maximum of 5 images (including existing images).');
      return;
    }
    
    setSelectedFiles([...selectedFiles, ...files]);
  };

  // Handle removing selected file before upload
  const handleRemoveFile = (index) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  // Handle marking current image for deletion
  const handleRemoveCurrentImage = (image) => {
    console.log("Removing image:", image);
    // Remove from currentImages array
    setCurrentImages(currentImages.filter(img => img !== image));
    // Add to imagesToDelete array for backend deletion on submit
    setImagesToDelete([...imagesToDelete, image]);
    // Also update displayOrder
    setDisplayOrder(displayOrder.filter(item => 
      !(item.type === 'current' && currentImages[item.index] === image)
    ));
  };

  // Handle drag start
  const handleDragStart = (e, index, type) => {
    e.dataTransfer.setData('index', index);
    e.dataTransfer.setData('type', type); // 'current' or 'new'
  };

  // Handle drag over
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Handle drop
  const handleDrop = (e, dropIndex, dropType) => {
    e.preventDefault();
    
    const dragIndex = parseInt(e.dataTransfer.getData('index'));
    const dragType = e.dataTransfer.getData('type');
    
    if (dragIndex === dropIndex && dragType === dropType) return;
    
    // Get the position of the dragged item in the display order
    const dragOrderIndex = displayOrder.findIndex(item => 
      item.type === dragType && item.index === dragIndex
    );
    
    // Get the position of the drop target in the display order
    const dropOrderIndex = displayOrder.findIndex(item => 
      item.type === dropType && item.index === dropIndex
    );
    
    if (dragOrderIndex !== -1 && dropOrderIndex !== -1) {
      // Create a new display order by moving the dragged item
      const newOrder = [...displayOrder];
      const [movedItem] = newOrder.splice(dragOrderIndex, 1);
      newOrder.splice(dropOrderIndex, 0, movedItem);
      setDisplayOrder(newOrder);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setUploadProgress(0);
    
    try {
      // Prepare data with correct structure for backend
      const carDataToSend = {
        ...formData,
        // Include top-level fields
        seats: formData.seats,
        transmission: formData.transmission,
        fuel: formData.fuel,
        price: parseFloat(formData.price) || 0
      };
      
      // Add image display order information
      const imageOrder = displayOrder
        .filter(item => item.type === 'current')
        .map(item => currentImages[item.index])
        .filter(img => img); // Filter out any undefined items

      carDataToSend.images = imageOrder;
      
      // Update car information
      const carResponse = await carsAPI.updateCar(id, carDataToSend);
      
      if (carResponse.success) {
        // Delete marked images
        for (const imageId of imagesToDelete) {
          await carsAPI.deleteImage(id, imageId);
        }
        
        // Upload new images
        if (selectedFiles.length > 0) {
          // Sort new files according to display order
          const newFilesInOrder = displayOrder
            .filter(item => item.type === 'new')
            .map(item => selectedFiles[item.index])
            .filter(file => file); // Filter out any undefined items
            
          for (let i = 0; i < newFilesInOrder.length; i++) {
            const file = newFilesInOrder[i];
            const formData = new FormData();
            formData.append('image', file);
            
            await carsAPI.uploadImage(id, formData);
            
            // Update upload progress
            setUploadProgress(Math.round(((i + 1) / newFilesInOrder.length) * 100));
          }
        }
        
        setSuccess(true);
        
        // Redirect to car details page after 1.5 seconds
        setTimeout(() => {
          router.push(`/dashboard/cars/${id}`);
        }, 1500);
      } else {
        setError(carResponse.message || 'An error occurred while updating the car.');
      }
    } catch (error) {
      console.error('Error updating car:', error);
      setError(error.message || 'An error occurred while updating the car.');
    } finally {
      setLoading(false);
    }
  };

  // Handle creating a new feature
  const handleCreateFeature = async (e) => {
    e.preventDefault();
    setCreateFeatureLoading(true);
    setCreateFeatureError(null);
    
    try {
      const response = await featuresAPI.createFeature(newFeatureData);
      
      if (response.success) {
        // Add the new feature to the available features list
        const newFeature = response.data;
        setAvailableFeatures([...availableFeatures, newFeature]);
        
        // Select the new feature
        handleFeatureSelect(newFeature._id);
        
        // Reset form and close modal
        setNewFeatureData({
          name: '',
          category: 'other',
          description: ''
        });
        setShowFeatureModal(false);
      } else {
        setCreateFeatureError(response.message || 'Failed to create feature');
      }
    } catch (error) {
      console.error('Error creating feature:', error);
      setCreateFeatureError(error.message || 'An error occurred while creating the feature');
    } finally {
      setCreateFeatureLoading(false);
    }
  };
  
  // Handle feature modal input changes
  const handleFeatureModalInputChange = (e) => {
    const { name, value } = e.target;
    setNewFeatureData({
      ...newFeatureData,
      [name]: value
    });
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

  // Get feature category class
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

  if (pageLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="px-4 pt-6">
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
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Edit Car</h1>
          </div>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {formData.name} ({formData.brand} {formData.model})
          </p>
        </div>
      </div>

      {/* Alert Messages */}
      {error && (
        <div className="mb-4 flex p-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
          <AlertCircle className="flex-shrink-0 inline w-5 h-5 mr-3" />
          <span className="sr-only">Error</span>
          <div>{error}</div>
        </div>
      )}

      {success && (
        <div className="mb-4 flex p-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400" role="alert">
          <Check className="flex-shrink-0 inline w-5 h-5 mr-3" />
          <span className="sr-only">Success</span>
          <div>Car has been updated successfully. Redirecting...</div>
        </div>
      )}

      {/* Form */}
      <div className="bg-white rounded-lg shadow dark:bg-gray-800 p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 mb-6 md:grid-cols-2">
            {/* Car Name */}
            <div>
              <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Car Name</label>
              <input 
                type="text" 
                id="name" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                placeholder="Toyota Camry" 
                required 
              />
            </div>
            
            {/* Brand */}
            <div>
              <label htmlFor="brand" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Brand</label>
              <select 
                id="brand" 
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                required
              >
                <option value="">Select brand</option>
                {attributesLoading ? (
                  <option disabled>Loading brands...</option>
                ) : (
                  brands.map(brand => (
                    <option key={brand._id} value={brand._id}>
                      {brand.name}
                    </option>
                  ))
                )}
              </select>
            </div>
            
            {/* Model */}
            <div>
              <label htmlFor="model" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Model</label>
              <input 
                type="text" 
                id="model" 
                name="model"
                value={formData.model}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                placeholder="Camry" 
                required 
              />
            </div>
            
            {/* Year */}
            <div>
              <label htmlFor="year" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Year</label>
              <input 
                type="number" 
                id="year" 
                name="year"
                value={formData.year}
                onChange={handleChange}
                min="1950" 
                max={new Date().getFullYear() + 1}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                placeholder="2023" 
                required 
              />
            </div>
            
            {/* Daily Price */}
            <div>
              <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Price Per Day ($)</label>
              <input 
                type="number" 
                id="price" 
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                placeholder="99.99" 
                required 
                min="0"
                step="0.01"
              />
            </div>
            
            {/* Category */}
            <div>
              <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Category</label>
              <select 
                id="category" 
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                required
              >
                <option key="category-default" value="">Select category</option>
                {categoryLoading ? (
                  <option key="loading-option" disabled>Loading categories...</option>
                ) : (
                  categories.map(category => (
                    <option key={`category-${category._id}`} value={category._id}>
                      {category.name}
                    </option>
                  ))
                )}
              </select>
            </div>
            
            {/* Seats */}
            <div>
              <label htmlFor="seats" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Seats</label>
              <input 
                type="number" 
                id="seats" 
                name="seats"
                value={formData.seats}
                onChange={handleChange}
                min="1" 
                max="50"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                required 
              />
            </div>
            
            {/* Transmission */}
            <div>
              <label htmlFor="transmission" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Transmission</label>
              <select 
                id="transmission" 
                name="transmission"
                value={formData.transmission}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                required
              >
                <option value="">Select transmission</option>
                {attributesLoading ? (
                  <option disabled>Loading transmissions...</option>
                ) : (
                  transmissions.map(transmission => (
                    <option key={transmission._id} value={transmission._id}>
                      {transmission.name}
                    </option>
                  ))
                )}
              </select>
            </div>
            
            {/* Fuel */}
            <div>
              <label htmlFor="fuel" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Fuel</label>
              <select 
                id="fuel" 
                name="fuel"
                value={formData.fuel}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                required
              >
                <option value="">Select fuel</option>
                {fuels.map(fuel => (
                  <option key={fuel._id} value={fuel._id}>
                    {fuel.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Status */}
            <div>
              <label htmlFor="status" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Status</label>
              <select 
                id="status" 
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                required
              >
                <option key="status-active" value="active">Active</option>
                <option key="status-maintenance" value="maintenance">Maintenance</option>
                <option key="status-overdue" value="overdue_return">Overdue Return</option>
              </select>
            </div>
          </div>
          
          {/* Description */}
          <div className="mb-6">
            <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
            <textarea 
              id="description" 
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4" 
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
              placeholder="Detailed description of the car, condition, features..."
            ></textarea>
          </div>
          
          {/* Features */}
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Features</label>
            <div className="flex mb-2">
              <select
                value={featureInput}
                onChange={(e) => {
                  setFeatureInput(e.target.value);
                  if (e.target.value) {
                    handleFeatureSelect(e.target.value);
                    setFeatureInput('');
                  }
                }}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg rounded-r-none focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option value="">Select feature</option>
                {attributesLoading ? (
                  <option disabled>Loading features...</option>
                ) : (
                  Object.entries(groupFeaturesByCategory()).map(([category, features]) => (
                    <optgroup key={category} label={category.charAt(0).toUpperCase() + category.slice(1)}>
                      {features.map(feature => (
                        <option key={feature._id} value={feature._id}>
                          {feature.name}
                        </option>
                      ))}
                    </optgroup>
                  ))
                )}
              </select>
              <button
                type="button"
                onClick={() => setShowFeatureModal(true)}
                className="px-4 py-2.5 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg rounded-l-none text-sm focus:outline-none dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mb-2">
              {selectedFeatures.length === 0 ? (
                <span className="text-sm text-gray-500 dark:text-gray-400">No features selected</span>
              ) : (
                <div className="space-y-6 mt-4">
                  {Object.entries(groupSelectedFeaturesByCategory()).map(([category, features]) => (
                    <div key={category} className="space-y-3">
                      <div className="flex items-center">
                        <span className="flex-shrink-0 w-5">
                          {getFeatureCategoryIcon(category)}
                        </span>
                        <h4 className="ml-2 text-sm font-medium capitalize mb-0 text-gray-800 dark:text-gray-200">
                          {category}
                        </h4>
                      </div>
                      <div className={`ml-2 border-l-4 pl-4 border-l-solid rounded-sm space-y-2 pt-1 pb-1 ${getFeatureCategoryClass(category)}`}>
                        {features.map(feature => (
                          <div key={feature.id} className="flex items-center justify-between py-1">
                            <div className="flex items-center">
                              <Check className="h-4 w-4 mr-2 flex-shrink-0" />
                              <span className="text-sm text-gray-800 dark:text-gray-200">{feature.name}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveFeature(feature.id)}
                              className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
                              aria-label={`Remove ${feature.name}`}
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Upload New Images */}
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Add New Images {currentImages.length > 0 ? `(${5 - currentImages.length} slots remaining)` : '(maximum 5 images)'}
            </label>
            <div className="flex items-center justify-center w-full">
              <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-800 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG or JPEG (max 5MB per image)</p>
                </div>
                <input 
                  id="dropzone-file" 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  onChange={handleFileChange}
                  className="hidden" 
                  disabled={currentImages.length >= 5}
                />
              </label>
            </div>
            
            {/* All Images (Current + New) */}
            {(currentImages.length > 0 || selectedFiles.length > 0) && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Current Images:</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  {/* Display images based on displayOrder */}
                  {displayOrder.map((item, orderIndex) => {
                    if (item.type === 'current') {
                      const image = currentImages[item.index];
                      if (!image) return null;
                      
                      return (
                        <div 
                          key={`current-image-${image._id || item.index}`} 
                          className="relative group"
                          draggable
                          onDragStart={(e) => handleDragStart(e, item.index, 'current')}
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, item.index, 'current')}
                        >
                          <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700 relative">
                            <img
                              src={image.startsWith('http') 
                                  ? image 
                                  : `${process.env.API_BASE_URL}${image}`}
                              alt={`Car image ${orderIndex + 1}`}
                              className="object-cover w-full h-20 cursor-move"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveCurrentImage(image)}
                              className="absolute top-1 right-1 bg-gray-800 bg-opacity-70 rounded-full p-0.5 text-white hover:bg-red-600"
                            >
                              <X className="w-4 h-4" />
                            </button>
                            <div className="absolute bottom-1 left-1 bg-gray-800 bg-opacity-70 rounded-full px-2 py-0.5">
                              <span className="text-xs text-white">{orderIndex + 1}</span>
                            </div>
                          </div>
                        </div>
                      );
                    } else if (item.type === 'new') {
                      const file = selectedFiles[item.index];
                      if (!file) return null;
                      
                      return (
                        <div 
                          key={`file-${item.index}-${file.name}`} 
                          className="relative group"
                          draggable
                          onDragStart={(e) => handleDragStart(e, item.index, 'new')}
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, item.index, 'new')}
                        >
                          <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700 relative">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Preview ${orderIndex + 1}`}
                              className="object-cover w-full h-20 cursor-move"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveFile(item.index)}
                              className="absolute top-1 right-1 bg-gray-800 bg-opacity-70 rounded-full p-0.5 text-white hover:bg-red-600"
                            >
                              <X className="w-4 h-4" />
                            </button>
                            <div className="absolute bottom-1 left-1 bg-gray-800 bg-opacity-70 rounded-full px-2 py-0.5">
                              <span className="text-xs text-white">{orderIndex + 1}</span>
                            </div>
                          </div>
                          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 truncate">
                            {file.name}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            )}
            
            {/* Upload progress */}
            {uploadProgress > 0 && (
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3 dark:bg-gray-700">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Uploading {uploadProgress}%
                </p>
              </div>
            )}
          </div>
          
          {/* Form actions */}
          <div className="flex justify-end space-x-4">
            <Link href={`/dashboard/cars/${id}`}>
              <Button 
                type="button" 
                variant="outline"
                disabled={loading}
              >
                Cancel
              </Button>
            </Link>
            <Button 
              type="submit" 
              disabled={loading || success}
              className="flex items-center gap-2"
            >
              {loading ? (
                <React.Fragment key="loading">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Processing...</span>
                </React.Fragment>
              ) : (
                <React.Fragment key="submit">
                  <Car className="h-4 w-4" />
                  <span>Update Car</span>
                </React.Fragment>
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* Feature creation modal */}
      {showFeatureModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full dark:bg-gray-800">
              <div className="absolute top-3 right-2.5">
                <button
                  type="button"
                  onClick={() => setShowFeatureModal(false)}
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white" id="modal-title">
                  Add New Feature
                </h3>
                <div className="mt-4">
                  {createFeatureError && (
                    <div className="mb-4 flex p-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                      <AlertCircle className="flex-shrink-0 inline w-5 h-5 mr-3" />
                      <span className="sr-only">Error</span>
                      <div>{createFeatureError}</div>
                    </div>
                  )}
                  
                  <form onSubmit={handleCreateFeature}>
                    <div className="mb-4">
                      <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={newFeatureData.name}
                        onChange={handleFeatureModalInputChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Enter feature name"
                        required
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Description
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={newFeatureData.description}
                        onChange={handleFeatureModalInputChange}
                        rows="3"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Enter feature description"
                      ></textarea>
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Category
                      </label>
                      <select
                        id="category"
                        name="category"
                        value={newFeatureData.category}
                        onChange={handleFeatureModalInputChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        required
                      >
                        <option value="comfort">Comfort</option>
                        <option value="safety">Safety</option>
                        <option value="performance">Performance</option>
                        <option value="technology">Technology</option>
                        <option value="convenience">Convenience</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    
                    <div className="mt-6 flex justify-end space-x-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowFeatureModal(false)}
                        disabled={createFeatureLoading}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={createFeatureLoading || !newFeatureData.name}
                        className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 px-4 py-2.5 rounded-lg text-white text-sm font-medium"
                      >
                        {createFeatureLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Creating...</span>
                          </>
                        ) : (
                          <>
                            <Plus className="h-4 w-4" />
                            <span>Add feature</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 