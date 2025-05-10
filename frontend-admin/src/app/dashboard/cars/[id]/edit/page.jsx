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
import { carsAPI, categoriesAPI } from '../../../../../lib/api';
import { Button } from '../../../../../components/ui/Button';

export default function EditCar({ params }) {
  const router = useRouter();
  const { id } = params;
  
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    price: {
      daily: 0,
      weekly: 0,
      monthly: 0
    },
    category: '',
    description: '',
    features: [],
    status: 'available',
    seats: 5,
    transmission: 'automatic',
    fuelType: 'gasoline',
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

  // Lấy thông tin xe cần chỉnh sửa
  useEffect(() => {
    const fetchCarDetails = async () => {
      setPageLoading(true);
      try {
        const response = await carsAPI.getCarById(id);
        if (response.data.success) {
          const carData = response.data.data;
          setFormData({
            name: carData.name || '',
            brand: carData.brand || '',
            model: carData.model || '',
            year: carData.year || new Date().getFullYear(),
            price: {
              daily: carData.price?.daily || 0,
              weekly: carData.price?.weekly || 0,
              monthly: carData.price?.monthly || 0
            },
            category: carData.category || '',
            description: carData.description || '',
            features: carData.features || [],
            status: carData.status || 'available',
            seats: carData.seats || 5,
            transmission: carData.transmission || 'automatic',
            fuelType: carData.fuelType || 'gasoline',
          });
          
          if (carData.images && carData.images.length > 0) {
            setCurrentImages(carData.images);
          }
        } else {
          setError('Không thể tải thông tin xe');
        }
      } catch (error) {
        console.error('Error fetching car details:', error);
        setError('Lỗi khi tải dữ liệu xe');
        
        // Dữ liệu mẫu cho trường hợp lỗi
        setFormData({
          name: 'Toyota Camry XLE',
          brand: 'Toyota',
          model: 'Camry',
          year: 2023,
          price: {
            daily: 89.99,
            weekly: 89.99 * 6,
            monthly: 89.99 * 25
          },
          category: 'cat-1',
          description: 'The Toyota Camry is a comfortable, fuel-efficient sedan with excellent safety features and reliability.',
          features: ['Bluetooth', 'Cruise Control', 'Backup Camera', 'Sunroof', 'Leather Seats'],
          status: 'available',
          seats: 5,
          transmission: 'automatic',
          fuelType: 'gasoline',
        });
        
        setCurrentImages([
          { _id: 'img1', url: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2025&q=80' },
          { _id: 'img2', url: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1536&q=80' }
        ]);
      } finally {
        setPageLoading(false);
      }
    };

    if (id) {
      fetchCarDetails();
    }
  }, [id]);

  // Lấy danh sách danh mục
  useEffect(() => {
    const fetchCategories = async () => {
      setCategoryLoading(true);
      try {
        const response = await categoriesAPI.getAllCategories();
        if (response.data.success) {
          setCategories(response.data.data || []);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Sử dụng danh mục mẫu nếu API bị lỗi
        setCategories([
          { _id: 'cat-1', name: 'Sedan' },
          { _id: 'cat-2', name: 'SUV' },
          { _id: 'cat-3', name: 'Truck' },
          { _id: 'cat-4', name: 'Sport' },
          { _id: 'cat-5', name: 'Luxury' }
        ]);
      } finally {
        setCategoryLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Xử lý thêm tính năng (feature)
  const handleAddFeature = () => {
    if (featureInput.trim() && !formData.features.includes(featureInput.trim())) {
      setFormData({
        ...formData,
        features: [...formData.features, featureInput.trim()]
      });
      setFeatureInput('');
    }
  };

  // Xử lý xóa tính năng
  const handleRemoveFeature = (feature) => {
    setFormData({
      ...formData,
      features: formData.features.filter(f => f !== feature)
    });
  };

  // Xử lý chọn file ảnh
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Giới hạn số lượng file (tối đa 5 ảnh tổng cộng)
    if (currentImages.length + selectedFiles.length + files.length > 5) {
      alert('Bạn chỉ có thể tải lên tối đa 5 ảnh (bao gồm cả ảnh hiện tại).');
      return;
    }
    
    setSelectedFiles([...selectedFiles, ...files]);
  };

  // Xử lý xóa file ảnh đã chọn nhưng chưa upload
  const handleRemoveFile = (index) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  // Xử lý đánh dấu xóa ảnh hiện tại
  const handleRemoveCurrentImage = (imageId) => {
    setCurrentImages(currentImages.filter(img => img._id !== imageId));
    setImagesToDelete([...imagesToDelete, imageId]);
  };

  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setUploadProgress(0);
    
    try {
      // Cập nhật thông tin xe
      const carResponse = await carsAPI.updateCar(id, formData);
      
      if (carResponse.data.success) {
        // Xóa ảnh được đánh dấu
        for (const imageId of imagesToDelete) {
          await carsAPI.deleteImage(id, imageId);
        }
        
        // Upload ảnh mới
        if (selectedFiles.length > 0) {
          for (let i = 0; i < selectedFiles.length; i++) {
            const file = selectedFiles[i];
            const formData = new FormData();
            formData.append('image', file);
            
            await carsAPI.uploadImage(id, formData);
            
            // Cập nhật tiến trình upload
            setUploadProgress(Math.round(((i + 1) / selectedFiles.length) * 100));
          }
        }
        
        setSuccess(true);
        
        // Chuyển hướng về trang chi tiết xe sau 1.5 giây
        setTimeout(() => {
          router.push(`/dashboard/cars/${id}`);
        }, 1500);
      }
    } catch (error) {
      console.error('Error updating car:', error);
      setError(error.message || 'Có lỗi xảy ra khi cập nhật xe.');
    } finally {
      setLoading(false);
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
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Chỉnh sửa xe</h1>
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
          <div>Xe đã được cập nhật thành công. Đang chuyển hướng...</div>
        </div>
      )}

      {/* Form */}
      <div className="bg-white rounded-lg shadow dark:bg-gray-800 p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 mb-6 md:grid-cols-2">
            {/* Tên xe */}
            <div>
              <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tên xe</label>
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
            
            {/* Thương hiệu */}
            <div>
              <label htmlFor="brand" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Thương hiệu</label>
              <input 
                type="text" 
                id="brand" 
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                placeholder="Toyota" 
                required 
              />
            </div>
            
            {/* Kiểu mẫu */}
            <div>
              <label htmlFor="model" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Kiểu mẫu</label>
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
            
            {/* Năm sản xuất */}
            <div>
              <label htmlFor="year" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Năm sản xuất</label>
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
            
            {/* Giá thuê / ngày */}
            <div>
              <label htmlFor="price.daily" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Giá thuê / ngày ($)</label>
              <input 
                type="number" 
                id="price.daily" 
                name="price.daily"
                value={formData.price.daily}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                placeholder="99.99" 
                required 
                min="0"
                step="0.01"
              />
            </div>
            
            {/* Danh mục */}
            <div>
              <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Danh mục</label>
              <select 
                id="category" 
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                required
              >
                <option value="">Chọn danh mục</option>
                {categoryLoading ? (
                  <option disabled>Đang tải danh mục...</option>
                ) : (
                  categories.map(category => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))
                )}
              </select>
            </div>
            
            {/* Số chỗ ngồi */}
            <div>
              <label htmlFor="seats" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Số chỗ ngồi</label>
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
            
            {/* Hộp số */}
            <div>
              <label htmlFor="transmission" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Hộp số</label>
              <select 
                id="transmission" 
                name="transmission"
                value={formData.transmission}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                required
              >
                <option value="automatic">Tự động</option>
                <option value="manual">Số sàn</option>
                <option value="semi-automatic">Bán tự động</option>
              </select>
            </div>
            
            {/* Loại nhiên liệu */}
            <div>
              <label htmlFor="fuelType" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Loại nhiên liệu</label>
              <select 
                id="fuelType" 
                name="fuelType"
                value={formData.fuelType}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                required
              >
                <option value="gasoline">Xăng</option>
                <option value="diesel">Dầu diesel</option>
                <option value="electric">Điện</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
            
            {/* Trạng thái */}
            <div>
              <label htmlFor="status" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Trạng thái</label>
              <select 
                id="status" 
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                required
              >
                <option value="available">Sẵn sàng</option>
                <option value="maintenance">Bảo trì</option>
                <option value="rented">Đang thuê</option>
              </select>
            </div>
          </div>
          
          {/* Mô tả */}
          <div className="mb-6">
            <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Mô tả</label>
            <textarea 
              id="description" 
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4" 
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
              placeholder="Mô tả chi tiết về xe, tình trạng, đặc điểm..."
            ></textarea>
          </div>
          
          {/* Tính năng */}
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tính năng</label>
            <div className="flex mb-2">
              <input 
                type="text" 
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg rounded-r-none focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                placeholder="Thêm tính năng mới" 
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="px-4 py-2.5 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg rounded-l-none text-sm focus:outline-none dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.features.map((feature, index) => (
                <div key={index} className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-1">
                  <span className="text-sm text-gray-800 dark:text-gray-200">{feature}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(feature)}
                    className="ml-2 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {formData.features.length === 0 && (
                <span className="text-sm text-gray-500 dark:text-gray-400">Chưa có tính năng nào</span>
              )}
            </div>
          </div>
          
          {/* Hình ảnh hiện tại */}
          {currentImages.length > 0 && (
            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Hình ảnh hiện tại</label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {currentImages.map((image) => (
                  <div key={image._id} className="relative group">
                    <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700 relative">
                      <img
                        src={image.url}
                        alt="Car"
                        className="object-cover w-full h-20"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveCurrentImage(image._id)}
                        className="absolute top-1 right-1 bg-gray-800 bg-opacity-70 rounded-full p-0.5 text-white hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Upload ảnh mới */}
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Thêm hình ảnh mới {currentImages.length > 0 ? `(còn ${5 - currentImages.length} vị trí)` : '(tối đa 5 ảnh)'}
            </label>
            <div className="flex items-center justify-center w-full">
              <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-800 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click để tải lên</span> hoặc kéo thả</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG hoặc JPEG (tối đa 5MB mỗi ảnh)</p>
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
            
            {/* Preview ảnh đã chọn */}
            {selectedFiles.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Ảnh mới đã chọn:</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700 relative">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${index}`}
                          className="object-cover w-full h-20"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(index)}
                          className="absolute top-1 right-1 bg-gray-800 bg-opacity-70 rounded-full p-0.5 text-white hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
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
                  Đang tải lên {uploadProgress}%
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
                Hủy
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
                  <span>Đang xử lý...</span>
                </>
              ) : (
                <>
                  <Car className="h-4 w-4" />
                  <span>Cập nhật xe</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 