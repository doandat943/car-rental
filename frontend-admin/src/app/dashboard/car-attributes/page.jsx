"use client";

import { useState, useEffect } from 'react';
import { 
  Settings, 
  PlusCircle, 
  Edit, 
  Trash2,
  Loader2,
  X,
  ChevronDown,
  Search,
  AlertCircle 
} from 'lucide-react';
import { brandsAPI, transmissionsAPI, fuelsAPI, featuresAPI, categoriesAPI } from '../../../lib/api';
import { Button } from '../../../components/ui/Button';

export default function CarAttributesPage() {
  // Active tab state
  const [activeTab, setActiveTab] = useState('brands');
  
  // Data state
  const [brands, setBrands] = useState([]);
  const [transmissions, setTransmissions] = useState([]);
  const [fuels, setFuels] = useState([]);
  const [features, setFeatures] = useState([]);
  const [categories, setCategories] = useState([]);
  
  // Loading states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [modalData, setModalData] = useState({
    id: '',
    name: '',
    description: '',
    category: 'other'
  });
  
  // Get all data on component mount
  useEffect(() => {
    fetchData();
  }, []);
  
  // Watch for tab changes to set loading state appropriately
  useEffect(() => {
    setLoading(true);
    fetchData();
  }, [activeTab]);
  
  // Fetch data based on active tab
  const fetchData = async () => {
    try {
      setError(null);
      setLoading(true);
      
      switch (activeTab) {
        case 'brands':
          await fetchBrands();
          break;
        
        case 'transmissions':
          await fetchTransmissions();
          break;
          
        case 'fuels':
          await fetchFuels();
          break;
          
        case 'features':
          await fetchFeatures();
          break;

        case 'categories':
          await fetchCategories();
          break;
      }
    } catch (error) {
      console.error(`Error fetching ${activeTab}:`, error);
      setError(`Failed to load ${activeTab}`);
    } finally {
      setLoading(false);
    }
  };

  // Fetch brands
  const fetchBrands = async () => {
    try {
      const brandsResponse = await brandsAPI.getAllBrands();
      if (brandsResponse.success) {
        setBrands(brandsResponse.data || []);
      } else {
        setError('Failed to load brands');
      }
    } catch (error) {
      console.error('Error fetching brands:', error);
      setError('Failed to load brands');
    }
  };

  // Fetch transmissions
  const fetchTransmissions = async () => {
    try {
      const transmissionsResponse = await transmissionsAPI.getAllTransmissions();
      if (transmissionsResponse.success) {
        setTransmissions(transmissionsResponse.data || []);
      } else {
        setError('Failed to load transmissions');
      }
    } catch (error) {
      console.error('Error fetching transmissions:', error);
      setError('Failed to load transmissions');
    }
  };

  // Fetch fuels
  const fetchFuels = async () => {
    try {
      const fuelsResponse = await fuelsAPI.getAllFuels();
      if (fuelsResponse.success) {
        setFuels(fuelsResponse.data || []);
      } else {
        setError('Failed to load fuels');
      }
    } catch (error) {
      console.error('Error fetching fuels:', error);
      setError('Failed to load fuels');
    }
  };

  // Fetch features
  const fetchFeatures = async () => {
    try {
      const featuresResponse = await featuresAPI.getAllFeatures();
      if (featuresResponse.success) {
        setFeatures(featuresResponse.data || []);
      } else {
        setError('Failed to load features');
      }
    } catch (error) {
      console.error('Error fetching features:', error);
      setError('Failed to load features');
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const categoriesResponse = await categoriesAPI.getAllCategories();
      if (categoriesResponse.success) {
        setCategories(categoriesResponse.data || []);
      } else {
        setError('Failed to load categories');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Failed to load categories');
    }
  };
  
  // Handle modal input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setModalData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Open modal for adding
  const handleAdd = () => {
    setModalData({
      id: '',
      name: '',
      description: '',
      category: 'other'
    });
    setModalType('add');
    setShowModal(true);
  };
  
  // Open modal for editing
  const handleEdit = (item) => {
    setModalData({
      id: item._id,
      name: item.name || '',
      description: item.description || '',
      category: item.category || 'other'
    });
    setModalType('edit');
    setShowModal(true);
  };
  
  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    
    try {
      let response;
      
      switch (activeTab) {
        case 'brands':
          response = await brandsAPI.deleteBrand(id);
          break;
          
        case 'transmissions':
          response = await transmissionsAPI.deleteTransmission(id);
          break;
          
        case 'fuels':
          response = await fuelsAPI.deleteFuel(id);
          break;
          
        case 'features':
          response = await featuresAPI.deleteFeature(id);
          break;

        case 'categories':
          response = await categoriesAPI.deleteCategory(id);
          break;
      }
      
      if (response.success) {
        // Refresh data
        fetchData();
      } else {
        setError(`Failed to delete ${activeTab.slice(0, -1)}`);
      }
    } catch (error) {
      console.error(`Error deleting ${activeTab.slice(0, -1)}:`, error);
      setError(`Failed to delete ${activeTab.slice(0, -1)}`);
    }
  };
  
  // Handle modal submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      let response;
      const data = { 
        name: modalData.name, 
        description: modalData.description 
      };
      
      // Add category field only for features
      if (activeTab === 'features') {
        data.category = modalData.category;
      }
      
      if (modalType === 'add') {
        // Create new item
        switch (activeTab) {
          case 'brands':
            response = await brandsAPI.createBrand(data);
            break;
            
          case 'transmissions':
            response = await transmissionsAPI.createTransmission(data);
            break;
            
          case 'fuels':
            response = await fuelsAPI.createFuel(data);
            break;
            
          case 'features':
            response = await featuresAPI.createFeature(data);
            break;

          case 'categories':
            response = await categoriesAPI.createCategory(data);
            break;
        }
      } else {
        // Update existing item
        switch (activeTab) {
          case 'brands':
            response = await brandsAPI.updateBrand(modalData.id, data);
            break;
            
          case 'transmissions':
            response = await transmissionsAPI.updateTransmission(modalData.id, data);
            break;
            
          case 'fuels':
            response = await fuelsAPI.updateFuel(modalData.id, data);
            break;
            
          case 'features':
            response = await featuresAPI.updateFeature(modalData.id, data);
            break;

          case 'categories':
            response = await categoriesAPI.updateCategory(modalData.id, data);
            break;
        }
      }
      
      if (response.success) {
        setShowModal(false);
        fetchData();
      } else {
        setError(`Failed to ${modalType} ${activeTab.slice(0, -1)}`);
      }
    } catch (error) {
      console.error(`Error ${modalType}ing ${activeTab.slice(0, -1)}:`, error);
      setError(`Failed to ${modalType} ${activeTab.slice(0, -1)}`);
    }
  };
  
  // Get current items based on active tab
  const getCurrentItems = () => {
    switch (activeTab) {
      case 'brands':
        return brands;
      case 'transmissions':
        return transmissions;
      case 'fuels':
        return fuels;
      case 'features':
        return features;
      case 'categories':
        return categories;
      default:
        return [];
    }
  };
  
  // Format tab name for display
  const formatTabName = (tab) => {
    switch (tab) {
      case 'brands':
        return 'Brands';
      case 'transmissions':
        return 'Transmissions';
      case 'fuels':
        return 'Fuels';
      case 'features':
        return 'Features';
      case 'categories':
        return 'Categories';
      default:
        return tab;
    }
  };

  return (
    <div className="px-4 pt-6">
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Car Attributes Management</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage car attributes like brands, transmissions, fuels, features, and categories
          </p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <Button
            onClick={handleAdd}
            className="flex items-center gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Add {activeTab.slice(0, -1)}</span>
          </Button>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
        <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
          {['brands', 'transmissions', 'fuels', 'features', 'categories'].map((tab) => (
            <li key={tab} className="mr-2">
              <button
                onClick={() => setActiveTab(tab)}
                className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg group ${
                  activeTab === tab
                    ? 'text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500'
                    : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
                }`}
              >
                <Settings className={`w-4 h-4 mr-2 ${
                  activeTab === tab
                    ? 'text-blue-600 dark:text-blue-500'
                    : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300'
                }`} />
                {formatTabName(tab)}
              </button>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
          <span className="font-medium">Error!</span> {error}
        </div>
      )}
      
      {/* Content */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-6 text-center">
            <Loader2 className="h-8 w-8 mx-auto animate-spin text-blue-600 dark:text-blue-500" />
            <p className="mt-2 text-gray-500 dark:text-gray-400">Loading {activeTab}...</p>
          </div>
        ) : getCurrentItems().length === 0 ? (
          <div className="p-6 text-center">
            <Settings className="h-10 w-10 mx-auto text-gray-400 dark:text-gray-600" />
            <p className="mt-2 text-gray-500 dark:text-gray-400">No {activeTab} found</p>
            <Button
              onClick={handleAdd}
              variant="outline"
              className="mt-3"
            >
              Add your first {activeTab.slice(0, -1)}
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">Name</th>
                  <th scope="col" className="px-6 py-3">Description</th>
                  {activeTab === 'features' && (
                    <th scope="col" className="px-6 py-3">Category</th>
                  )}
                  <th scope="col" className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {getCurrentItems().map((item) => (
                  <tr key={item._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      {item.name}
                    </td>
                    <td className="px-6 py-4">
                      {item.description || '-'}
                    </td>
                    {activeTab === 'features' && (
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                          {item.category || 'other'}
                        </span>
                      </td>
                    )}
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="font-medium text-red-600 dark:text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full dark:bg-gray-800">
              <div className="absolute top-3 right-2.5">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white" id="modal-title">
                  {modalType === 'add' ? `Add New ${formatTabName(activeTab).slice(0, -1)}` : `Edit ${formatTabName(activeTab).slice(0, -1)}`}
                </h3>
                <div className="mt-4">
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={modalData.name}
                        onChange={handleInputChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder={`Enter ${activeTab.slice(0, -1)} name`}
                        required
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                      <textarea
                        id="description"
                        name="description"
                        value={modalData.description}
                        onChange={handleInputChange}
                        rows="3"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder={`Enter ${activeTab.slice(0, -1)} description`}
                      ></textarea>
                    </div>
                    
                    {activeTab === 'features' && (
                      <div className="mb-4">
                        <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Category</label>
                        <select
                          id="category"
                          name="category"
                          value={modalData.category}
                          onChange={handleInputChange}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        >
                          <option value="comfort">Comfort</option>
                          <option value="safety">Safety</option>
                          <option value="performance">Performance</option>
                          <option value="technology">Technology</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    )}
                    
                    <div className="mt-6 flex justify-end space-x-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowModal(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                      >
                        {modalType === 'add' ? 'Add' : 'Update'}
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