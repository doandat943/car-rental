"use client";

import { useState, useEffect } from 'react';
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
  Check
} from 'lucide-react';
import { carsAPI, categoriesAPI, brandsAPI, transmissionsAPI, fuelsAPI, featuresAPI } from '../../../../lib/api';
import { Button } from '../../../../components/ui/Button';

// Feature category options
const FEATURE_CATEGORIES = [
  'safety',
  'technology',
  'comfort',
  'performance',
  'convenience',
  'other'
];

export default function AddCar() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    price: 0,
    category: '',
    description: '',
    features: [],
    status: 'active',
    fuel: '',
    transmission: '',
    seats: 5
  });
  
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [transmissions, setTransmissions] = useState([]);
  const [fuels, setFuels] = useState([]);
  const [availableFeatures, setAvailableFeatures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [attributesLoading, setAttributesLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [featureInput, setFeatureInput] = useState('');
  const [selectedFeatures, setSelectedFeatures] = useState([]);

  // Modal state
  const [showFeatureModal, setShowFeatureModal] = useState(false);
  const [newFeatureData, setNewFeatureData] = useState({
    name: '',
    category: 'other',
    description: ''
  });
  const [createFeatureLoading, setCreateFeatureLoading] = useState(false);
  const [createFeatureError, setCreateFeatureError] = useState(null);

  // Get categories and attributes when component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      setCategoriesLoading(true);
      try {
        const response = await categoriesAPI.getAllCategories();
        if (response.success) {
          setCategories(response.data || []);
        } else {
          console.error('Error fetching categories:', response.message);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setCategoriesLoading(false);
      }
    };

    const fetchAttributes = async () => {
      setAttributesLoading(true);
      try {
        // Fetch brands
        const brandsResponse = await brandsAPI.getAllBrands();
        if (brandsResponse.success) {
          setBrands(brandsResponse.data || []);
          // Set default brand if available
          if (brandsResponse.data && brandsResponse.data.length > 0) {
            setFormData(prev => ({
              ...prev,
              brand: brandsResponse.data[0]._id
            }));
          }
        }
        
        // Fetch transmissions
        const transmissionsResponse = await transmissionsAPI.getAllTransmissions();
        if (transmissionsResponse.success) {
          setTransmissions(transmissionsResponse.data || []);
          // Set default transmission if available
          if (transmissionsResponse.data && transmissionsResponse.data.length > 0) {
            setFormData(prev => ({
              ...prev,
              transmission: transmissionsResponse.data[0]._id
            }));
          }
        }
        
        // Fetch fuels
        const fuelsResponse = await fuelsAPI.getAllFuels();
        if (fuelsResponse.success) {
          setFuels(fuelsResponse.data || []);
          // Set default fuel if available
          if (fuelsResponse.data && fuelsResponse.data.length > 0) {
            setFormData(prev => ({
              ...prev,
              fuel: fuelsResponse.data[0]._id
            }));
          }
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

    fetchCategories();
    fetchAttributes();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
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
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // Handle adding features
  const handleAddFeature = () => {
    if (!featureInput) return;
    
    // Check if the input matches an available feature
    const feature = availableFeatures.find(f => 
      f.name.toLowerCase() === featureInput.trim().toLowerCase());
    
    if (feature && !selectedFeatures.includes(feature._id)) {
      setSelectedFeatures([...selectedFeatures, feature._id]);
      setFormData({
        ...formData,
        features: [...selectedFeatures, feature._id]
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

  // Handle removing features
  const handleRemoveFeature = (featureId) => {
    const newSelectedFeatures = selectedFeatures.filter(id => id !== featureId);
    setSelectedFeatures(newSelectedFeatures);
    setFormData({
      ...formData,
      features: newSelectedFeatures
    });
  };

  // Handle file selection for images
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Limit number of files (maximum 5 images)
    if (selectedFiles.length + files.length > 5) {
      alert('You can upload a maximum of 5 images.');
      return;
    }
    
    setSelectedFiles([...selectedFiles, ...files]);
  };

  // Handle removing selected image files
  const handleRemoveFile = (index) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  // Handle drag start
  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('index', index.toString());
  };

  // Handle drag over
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Handle drop
  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    
    const dragIndex = parseInt(e.dataTransfer.getData('index'));
    if (dragIndex === dropIndex) return;
    
    const updatedFiles = [...selectedFiles];
    const [movedFile] = updatedFiles.splice(dragIndex, 1);
    updatedFiles.splice(dropIndex, 0, movedFile);
    setSelectedFiles(updatedFiles);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setUploadProgress(0);
    
    try {
      // Create new car
      const carResponse = await carsAPI.createCar(formData);
      
      if (carResponse.success) {
        const carId = carResponse.data._id;
        
        // If there are image files, upload each one
        if (selectedFiles.length > 0) {
          for (let i = 0; i < selectedFiles.length; i++) {
            const file = selectedFiles[i];
            const formData = new FormData();
            formData.append('image', file);
            
            await carsAPI.uploadImage(carId, formData);
            
            // Update upload progress
            setUploadProgress(Math.round(((i + 1) / selectedFiles.length) * 100));
          }
        }
        
        setSuccess(true);
        
        // Redirect to car list after 1.5 seconds
        setTimeout(() => {
          router.push('/dashboard/cars');
        }, 1500);
      }
    } catch (error) {
      console.error('Error creating car:', error);
      setError(error.message || 'An error occurred while creating the new car.');
    } finally {
      setLoading(false);
    }
  };

  // Add a utility function to group features by category
  const getFeatureName = (featureId) => {
    const feature = availableFeatures.find(f => f._id === featureId);
    return feature ? feature.name : 'Unknown feature';
  };
  
  // Get feature with category
  const getFeatureWithCategory = (featureId) => {
    const feature = availableFeatures.find(f => f._id === featureId);
    if (!feature) return { name: 'Unknown feature', category: 'other' };
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
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Add new car</h1>
          </div>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Add detailed information about the car
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
          <div>Car has been created successfully. Redirecting...</div>
        </div>
      )}

      {/* Form */}
      <div className="bg-white rounded-lg shadow dark:bg-gray-800 p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 mb-6 md:grid-cols-2">
            {/* Car name */}
            <div>
              <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Car name</label>
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
            
            {/* Daily rental price */}
            <div>
              <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Rent price / day ($)</label>
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
                <option value="">Select category</option>
                {categoriesLoading ? (
                  <option disabled>Loading categories...</option>
                ) : (
                  categories.map(category => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))
                )}
              </select>
            </div>
            
            {/* Number of seats */}
            <div>
              <label htmlFor="seats" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Seats</label>
              <input 
                type="number" 
                id="seats" 
                name="seats"
                value={formData.seats}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                placeholder="5" 
                required 
                min="1"
                max="20"
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
                {attributesLoading ? (
                  <option disabled>Loading fuels...</option>
                ) : (
                  fuels.map(fuel => (
                    <option key={fuel._id} value={fuel._id}>
                      {fuel.name}
                    </option>
                  ))
                )}
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
                <option value="active">Active</option>
                <option value="maintenance">Maintenance</option>
                <option value="overdue_return">Overdue Return</option>
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
                <div className="space-y-4 mt-4">
                  {Object.entries(groupSelectedFeaturesByCategory()).map(([category, features]) => (
                    <div key={category} className="border-0 border-l-4 border-blue-500 dark:border-blue-600 pl-3">
                      <h4 className="text-sm font-medium capitalize mb-2 text-blue-600 dark:text-blue-400">
                        {category}
                      </h4>
                      <div className="space-y-1">
                        {features.map(feature => (
                          <div key={feature.id} className="flex items-center justify-between py-1">
                            <span className="text-sm text-gray-800 dark:text-gray-200">{feature.name}</span>
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
          
          {/* Image upload */}
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Car images (max 5 images)</label>
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
                />
              </label>
            </div>
            
            {/* Preview selected images */}
            {selectedFiles.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Selected images:</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  {selectedFiles.map((file, index) => (
                    <div 
                      key={index} 
                      className="relative group"
                      draggable
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, index)}
                    >
                      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700 relative">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${index}`}
                          className="object-cover w-full h-20 cursor-move"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(index)}
                          className="absolute top-1 right-1 bg-gray-800 bg-opacity-70 rounded-full p-0.5 text-white hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <div className="absolute bottom-1 left-1 bg-gray-800 bg-opacity-70 rounded-full px-2 py-0.5">
                          <span className="text-xs text-white">{index + 1}</span>
                        </div>
                      </div>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 truncate">
                        {file.name}
                      </p>
                    </div>
                  ))}
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
            <Link href="/dashboard/cars">
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
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Car className="h-4 w-4" />
                  <span>Add car</span>
                </>
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