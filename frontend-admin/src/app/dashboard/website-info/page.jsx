"use client";

import { useState, useEffect } from 'react';
import { 
  Globe, 
  Save, 
  Loader2,
  AlertCircle,
  Phone,
  Mail,
  MapPin,
  Clock,
  Facebook,
  Instagram,
  Twitter,
  DollarSign,
  CreditCard,
  Settings,
  Info,
  HelpCircle
} from 'lucide-react';
import { websiteInfoAPI } from '../../../lib/api';
import { Button } from '../../../components/ui/Button';

export default function WebsiteInfoPage() {
  const [activeTab, setActiveTab] = useState('basic');
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Website Info State
  const [websiteInfo, setWebsiteInfo] = useState({
    siteName: '',
    description: '',
    logo: '',
    contactInfo: {
      email: '',
      phone: '',
      address: '',
      businessHours: ''
    },
    socialLinks: {
      facebook: '',
      instagram: '',
      twitter: '',
      youtube: '',
      linkedin: '',
      tiktok: ''
    },
    paymentSettings: {
      currencySymbol: '$',
      currencyCode: 'USD',
      taxRate: 8.5,
      bookingFee: 5,
      maintenanceFee: 25,
      depositPercentage: 15,
      enablePaypal: true,
      enableCreditCard: true,
      enableCash: true,
      enableBankTransfer: true
    },
    bookingSettings: {
      minimumBookingHours: 4,
      maximumBookingDays: 30,
      bookingAdvanceDays: 1
    },
    seoSettings: {
      googleAnalyticsId: '',
      metaDescription: '',
      metaKeywords: ''
    },
    contentPages: {
      aboutUs: '',
      termsAndConditions: '',
      privacyPolicy: '',
      cancellationPolicy: ''
    },
    faqs: [],
    featureSettings: {
      maintenanceMode: false
    }
  });
  
  // FAQ form state
  const [newFaq, setNewFaq] = useState({ question: '', answer: '' });
  const [editingFaqIndex, setEditingFaqIndex] = useState(-1);
  
  // Fetch Website Info
  useEffect(() => {
    const fetchWebsiteInfo = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await websiteInfoAPI.getWebsiteInfo();
        
        if (response && response.success) {
          setWebsiteInfo(response.data || {});
        } else {
          setError('Failed to load website information');
        }
      } catch (error) {
        console.error('Error fetching website info:', error);
        setError('Failed to load website information');
      } finally {
        setLoading(false);
      }
    };
    
    fetchWebsiteInfo();
  }, []);
  
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested object properties
    if (name.includes('.')) {
      const parts = name.split('.');
      
      if (parts.length === 2) {
        setWebsiteInfo({
          ...websiteInfo,
          [parts[0]]: {
            ...websiteInfo[parts[0]],
            [parts[1]]: value
          }
        });
      } else if (parts.length === 3) {
        setWebsiteInfo({
          ...websiteInfo,
          [parts[0]]: {
            ...websiteInfo[parts[0]],
            [parts[1]]: {
              ...websiteInfo[parts[0]]?.[parts[1]],
              [parts[2]]: value
            }
          }
        });
      }
    } else {
      setWebsiteInfo({
        ...websiteInfo,
        [name]: value
      });
    }
  };
  
  // Handle switch changes
  const handleSwitchChange = (path, checked) => {
    const parts = path.split('.');
    
    if (parts.length === 2) {
      setWebsiteInfo({
        ...websiteInfo,
        [parts[0]]: {
          ...websiteInfo[parts[0]],
          [parts[1]]: checked
        }
      });
    }
  };
  
  // Handle Save
  const handleSave = async () => {
    try {
      setSaveLoading(true);
      setError(null);
      setSuccessMessage('');
      
      const response = await websiteInfoAPI.updateWebsiteInfo(websiteInfo);
      
      if (response && response.success) {
        setSuccessMessage('Website information updated successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError('Failed to update website information');
      }
    } catch (error) {
      console.error('Error updating website info:', error);
      setError('Failed to update website information');
    } finally {
      setSaveLoading(false);
    }
  };
  
  // Handle FAQ operations
  const handleAddFaq = () => {
    if (newFaq.question && newFaq.answer) {
      setWebsiteInfo({
        ...websiteInfo,
        faqs: [...(websiteInfo.faqs || []), newFaq]
      });
      setNewFaq({ question: '', answer: '' });
    }
  };
  
  const handleEditFaq = (index) => {
    setEditingFaqIndex(index);
    setNewFaq(websiteInfo.faqs[index]);
  };
  
  const handleUpdateFaq = () => {
    if (newFaq.question && newFaq.answer && editingFaqIndex !== -1) {
      const updatedFaqs = [...websiteInfo.faqs];
      updatedFaqs[editingFaqIndex] = newFaq;
      setWebsiteInfo({
        ...websiteInfo,
        faqs: updatedFaqs
      });
      setNewFaq({ question: '', answer: '' });
      setEditingFaqIndex(-1);
    }
  };
  
  const handleDeleteFaq = (index) => {
    const updatedFaqs = websiteInfo.faqs.filter((_, i) => i !== index);
    setWebsiteInfo({
      ...websiteInfo,
      faqs: updatedFaqs
    });
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="px-4 pt-6">
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Website Information Management</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your website's basic information, contact details, and settings
          </p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <Button
            onClick={handleSave}
            disabled={saveLoading}
            className="flex items-center gap-2"
          >
            {saveLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {saveLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
      
      {/* Messages */}
      {error && (
        <div className="mb-4 p-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
          <div className="flex items-center">
            <AlertCircle className="h-4 w-4 mr-2" />
            <span className="font-medium">Error!</span> {error}
          </div>
        </div>
      )}
      
      {successMessage && (
        <div className="mb-4 p-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400" role="alert">
          <div className="flex items-center">
            <Save className="h-4 w-4 mr-2" />
            <span className="font-medium">Success!</span> {successMessage}
          </div>
        </div>
      )}
      
      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
        <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
          {[
            { id: 'basic', label: 'Basic Info', icon: Info },
            { id: 'contact', label: 'Contact', icon: Phone },
            { id: 'social', label: 'Social Links', icon: Globe },
            { id: 'payment', label: 'Payment', icon: CreditCard },
            { id: 'booking', label: 'Booking', icon: Settings },
            { id: 'content', label: 'Content Pages', icon: HelpCircle },
            { id: 'faqs', label: 'FAQs', icon: HelpCircle }
          ].map((tab) => (
            <li key={tab.id} className="mr-2">
              <button
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg group ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500'
                    : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
                }`}
              >
                <tab.icon className={`w-4 h-4 mr-2 ${
                  activeTab === tab.id
                    ? 'text-blue-600 dark:text-blue-500'
                    : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300'
                }`} />
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Tab Content */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        {/* Basic Info Tab */}
        {activeTab === 'basic' && (
          <div className="space-y-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Basic Information</h2>
            
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label htmlFor="siteName" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Site Name
                </label>
                <input
                  type="text"
                  id="siteName"
                  name="siteName"
                  value={websiteInfo.siteName || ''}
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  placeholder="Car Rental Service"
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={websiteInfo.description || ''}
                  onChange={handleInputChange}
                  rows="3"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  placeholder="Premium car rental service for all your travel needs"
                />
              </div>
              
              <div>
                <label htmlFor="logo" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Logo URL
                </label>
                <input
                  type="text"
                  id="logo"
                  name="logo"
                  value={websiteInfo.logo || ''}
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  placeholder="/uploads/logo.png"
                />
              </div>
            </div>
          </div>
        )}
        
        {/* Contact Tab */}
        {activeTab === 'contact' && (
          <div className="space-y-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Contact Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="contactInfo.email" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  <Mail className="inline w-4 h-4 mr-1" />
                  Email
                </label>
                <input
                  type="email"
                  id="contactInfo.email"
                  name="contactInfo.email"
                  value={websiteInfo.contactInfo?.email || ''}
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  placeholder="support@carrental.com"
                />
              </div>
              
              <div>
                <label htmlFor="contactInfo.phone" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  <Phone className="inline w-4 h-4 mr-1" />
                  Phone
                </label>
                <input
                  type="tel"
                  id="contactInfo.phone"
                  name="contactInfo.phone"
                  value={websiteInfo.contactInfo?.phone || ''}
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="contactInfo.address" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                <MapPin className="inline w-4 h-4 mr-1" />
                Address
              </label>
              <textarea
                id="contactInfo.address"
                name="contactInfo.address"
                value={websiteInfo.contactInfo?.address || ''}
                onChange={handleInputChange}
                rows="2"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder="123 Rental Street, City, Country"
              />
            </div>
            
            <div>
              <label htmlFor="contactInfo.businessHours" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                <Clock className="inline w-4 h-4 mr-1" />
                Business Hours
              </label>
              <input
                type="text"
                id="contactInfo.businessHours"
                name="contactInfo.businessHours"
                value={websiteInfo.contactInfo?.businessHours || ''}
                onChange={handleInputChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder="Mon-Fri: 8:00 AM - 6:00 PM, Sat: 9:00 AM - 5:00 PM, Sun: Closed"
              />
            </div>
          </div>
        )}
        
        {/* Social Links Tab */}
        {activeTab === 'social' && (
          <div className="space-y-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Social Media Links</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="socialLinks.facebook" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  <Facebook className="inline w-4 h-4 mr-1" />
                  Facebook
                </label>
                <input
                  type="url"
                  id="socialLinks.facebook"
                  name="socialLinks.facebook"
                  value={websiteInfo.socialLinks?.facebook || ''}
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  placeholder="https://facebook.com/carrental"
                />
              </div>
              
              <div>
                <label htmlFor="socialLinks.instagram" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  <Instagram className="inline w-4 h-4 mr-1" />
                  Instagram
                </label>
                <input
                  type="url"
                  id="socialLinks.instagram"
                  name="socialLinks.instagram"
                  value={websiteInfo.socialLinks?.instagram || ''}
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  placeholder="https://instagram.com/carrental"
                />
              </div>
              
              <div>
                <label htmlFor="socialLinks.twitter" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  <Twitter className="inline w-4 h-4 mr-1" />
                  Twitter
                </label>
                <input
                  type="url"
                  id="socialLinks.twitter"
                  name="socialLinks.twitter"
                  value={websiteInfo.socialLinks?.twitter || ''}
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  placeholder="https://twitter.com/carrental"
                />
              </div>
              
              <div>
                <label htmlFor="socialLinks.youtube" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  YouTube
                </label>
                <input
                  type="url"
                  id="socialLinks.youtube"
                  name="socialLinks.youtube"
                  value={websiteInfo.socialLinks?.youtube || ''}
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  placeholder="https://youtube.com/carrental"
                />
              </div>
            </div>
          </div>
        )}
        
        {/* Payment Settings Tab */}
        {activeTab === 'payment' && (
          <div className="space-y-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Payment Settings</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="paymentSettings.currencySymbol" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Currency Symbol
                </label>
                <input
                  type="text"
                  id="paymentSettings.currencySymbol"
                  name="paymentSettings.currencySymbol"
                  value={websiteInfo.paymentSettings?.currencySymbol || '$'}
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  placeholder="$"
                />
              </div>
              
              <div>
                <label htmlFor="paymentSettings.currencyCode" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Currency Code
                </label>
                <input
                  type="text"
                  id="paymentSettings.currencyCode"
                  name="paymentSettings.currencyCode"
                  value={websiteInfo.paymentSettings?.currencyCode || 'USD'}
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  placeholder="USD"
                />
              </div>
              
              <div>
                <label htmlFor="paymentSettings.taxRate" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Tax Rate (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  id="paymentSettings.taxRate"
                  name="paymentSettings.taxRate"
                  value={websiteInfo.paymentSettings?.taxRate || 0}
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  placeholder="8.5"
                />
              </div>
              
              <div>
                <label htmlFor="paymentSettings.bookingFee" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Booking Fee
                </label>
                <input
                  type="number"
                  id="paymentSettings.bookingFee"
                  name="paymentSettings.bookingFee"
                  value={websiteInfo.paymentSettings?.bookingFee || 0}
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  placeholder="5"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-md font-medium text-gray-900 dark:text-white">Payment Methods</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <input
                    id="enablePaypal"
                    type="checkbox"
                    checked={websiteInfo.paymentSettings?.enablePaypal || false}
                    onChange={(e) => handleSwitchChange('paymentSettings.enablePaypal', e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label htmlFor="enablePaypal" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                    Enable PayPal
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="enableCreditCard"
                    type="checkbox"
                    checked={websiteInfo.paymentSettings?.enableCreditCard || false}
                    onChange={(e) => handleSwitchChange('paymentSettings.enableCreditCard', e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label htmlFor="enableCreditCard" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                    Enable Credit Card
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="enableCash"
                    type="checkbox"
                    checked={websiteInfo.paymentSettings?.enableCash || false}
                    onChange={(e) => handleSwitchChange('paymentSettings.enableCash', e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label htmlFor="enableCash" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                    Enable Cash Payment
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="enableBankTransfer"
                    type="checkbox"
                    checked={websiteInfo.paymentSettings?.enableBankTransfer || false}
                    onChange={(e) => handleSwitchChange('paymentSettings.enableBankTransfer', e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label htmlFor="enableBankTransfer" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                    Enable Bank Transfer
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Booking Settings Tab */}
        {activeTab === 'booking' && (
          <div className="space-y-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Booking Settings</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="bookingSettings.minimumBookingHours" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Minimum Booking Hours
                </label>
                <input
                  type="number"
                  id="bookingSettings.minimumBookingHours"
                  name="bookingSettings.minimumBookingHours"
                  value={websiteInfo.bookingSettings?.minimumBookingHours || 4}
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  placeholder="4"
                />
              </div>
              
              <div>
                <label htmlFor="bookingSettings.maximumBookingDays" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Maximum Booking Days
                </label>
                <input
                  type="number"
                  id="bookingSettings.maximumBookingDays"
                  name="bookingSettings.maximumBookingDays"
                  value={websiteInfo.bookingSettings?.maximumBookingDays || 30}
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  placeholder="30"
                />
              </div>
              
              <div>
                <label htmlFor="bookingSettings.bookingAdvanceDays" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Booking Advance Days
                </label>
                <input
                  type="number"
                  id="bookingSettings.bookingAdvanceDays"
                  name="bookingSettings.bookingAdvanceDays"
                  value={websiteInfo.bookingSettings?.bookingAdvanceDays || 1}
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  placeholder="1"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-md font-medium text-gray-900 dark:text-white">Feature Settings</h3>
              
              <div className="flex items-center">
                <input
                  id="maintenanceMode"
                  type="checkbox"
                  checked={websiteInfo.featureSettings?.maintenanceMode || false}
                  onChange={(e) => handleSwitchChange('featureSettings.maintenanceMode', e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label htmlFor="maintenanceMode" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                  Maintenance Mode
                </label>
              </div>
            </div>
          </div>
        )}
        
        {/* Content Pages Tab */}
        {activeTab === 'content' && (
          <div className="space-y-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Content Pages</h2>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="contentPages.aboutUs" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  About Us
                </label>
                <textarea
                  id="contentPages.aboutUs"
                  name="contentPages.aboutUs"
                  value={websiteInfo.contentPages?.aboutUs || ''}
                  onChange={handleInputChange}
                  rows="4"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  placeholder="About us content goes here..."
                />
              </div>
              
              <div>
                <label htmlFor="contentPages.termsAndConditions" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Terms and Conditions
                </label>
                <textarea
                  id="contentPages.termsAndConditions"
                  name="contentPages.termsAndConditions"
                  value={websiteInfo.contentPages?.termsAndConditions || ''}
                  onChange={handleInputChange}
                  rows="4"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  placeholder="Terms and conditions content..."
                />
              </div>
              
              <div>
                <label htmlFor="contentPages.privacyPolicy" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Privacy Policy
                </label>
                <textarea
                  id="contentPages.privacyPolicy"
                  name="contentPages.privacyPolicy"
                  value={websiteInfo.contentPages?.privacyPolicy || ''}
                  onChange={handleInputChange}
                  rows="4"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  placeholder="Privacy policy content..."
                />
              </div>
              
              <div>
                <label htmlFor="contentPages.cancellationPolicy" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Cancellation Policy
                </label>
                <textarea
                  id="contentPages.cancellationPolicy"
                  name="contentPages.cancellationPolicy"
                  value={websiteInfo.contentPages?.cancellationPolicy || ''}
                  onChange={handleInputChange}
                  rows="4"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  placeholder="Cancellation policy content..."
                />
              </div>
            </div>
          </div>
        )}
        
        {/* FAQs Tab */}
        {activeTab === 'faqs' && (
          <div className="space-y-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Frequently Asked Questions</h2>
            
            {/* Add/Edit FAQ Form */}
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                {editingFaqIndex !== -1 ? 'Edit FAQ' : 'Add New FAQ'}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="faqQuestion" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Question
                  </label>
                  <input
                    type="text"
                    id="faqQuestion"
                    value={newFaq.question}
                    onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    placeholder="Enter your question..."
                  />
                </div>
                
                <div>
                  <label htmlFor="faqAnswer" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Answer
                  </label>
                  <textarea
                    id="faqAnswer"
                    value={newFaq.answer}
                    onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
                    rows="3"
                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    placeholder="Enter your answer..."
                  />
                </div>
                
                <div className="flex gap-2">
                  {editingFaqIndex !== -1 ? (
                    <>
                      <Button
                        onClick={handleUpdateFaq}
                        disabled={!newFaq.question || !newFaq.answer}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Update FAQ
                      </Button>
                      <Button
                        onClick={() => {
                          setEditingFaqIndex(-1);
                          setNewFaq({ question: '', answer: '' });
                        }}
                        variant="outline"
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={handleAddFaq}
                      disabled={!newFaq.question || !newFaq.answer}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Add FAQ
                    </Button>
                  )}
                </div>
              </div>
            </div>
            
            {/* FAQ List */}
            <div className="space-y-4">
              {websiteInfo.faqs && websiteInfo.faqs.length > 0 ? (
                websiteInfo.faqs.map((faq, index) => (
                  <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">{faq.question}</h4>
                        <p className="text-gray-700 dark:text-gray-300">{faq.answer}</p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleEditFaq(index)}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteFaq(index)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No FAQs added yet. Add your first FAQ above.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 