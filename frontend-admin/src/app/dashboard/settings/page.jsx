"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/Tabs';
import { Switch } from '../../../components/ui/Switch';
import { Label } from '../../../components/ui/Label';
import { Textarea } from '../../../components/ui/Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/Select';
import { toast } from 'react-hot-toast';
import { api, API_BASE_URL } from '@/lib/api';

export default function SettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('website');
  const [loading, setLoading] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  
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
      enablePaypal: true,
      enableCreditCard: true
    },
    bookingSettings: {
      minimumBookingHours: 4,
      maximumBookingDays: 30
    },
    contentPages: {
      aboutUs: '',
      termsAndConditions: '',
      privacyPolicy: '',
      cancellationPolicy: ''
    },
    emailSettings: {
      senderName: 'Car Rental Service',
      senderEmail: 'noreply@carrental.com',
      welcomeEmailSubject: 'Welcome to Car Rental Service',
      welcomeEmailTemplate: 'Thank you for signing up with Car Rental Service!',
      bookingConfirmationSubject: 'Your booking is confirmed',
      bookingConfirmationTemplate: 'Your car rental booking has been confirmed.',
      bookingReminderSubject: 'Your upcoming car rental',
      bookingReminderTemplate: 'Your car rental is coming up soon.',
      customFooter: '© 2025 Car Rental Service. All rights reserved.'
    },
    appearanceSettings: {
      primaryColor: '#3b82f6',
      secondaryColor: '#10b981',
      fontFamily: 'Inter, sans-serif',
      borderRadius: '0.375rem',
      buttonStyle: 'rounded',
      darkMode: false,
      customCSS: ''
    },
    faqs: [],
    featureSettings: {
      enableReviews: false,
      maintenanceMode: false
    }
  });
  
  // User Settings State
  const [userSettings, setUserSettings] = useState({
    preferences: {
      language: 'en',
      theme: 'light',
      notifications: {
        email: {
          newBookings: true,
          bookingUpdates: true
        },
        inApp: {
          newBookings: true,
          systemUpdates: true
        }
      },
      displayPreferences: {
        dateFormat: 'MM/DD/YYYY',
        timeFormat: '12h'
      }
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
        const response = await api.get('/website-info');
        
        console.log('Website info response:', response);
        
        if (response && response.success) {
          // Update state with the data directly from the response
          setWebsiteInfo(response.data || {});
          console.log('Website info set to:', response.data);
        } else if (response.data && response.data.success) {
          // Handle nested response structure if needed
          setWebsiteInfo(response.data.data || {});
          console.log('Website info set to (nested):', response.data.data);
        } else {
          console.error('Unexpected response structure:', response);
          toast.error('Failed to load website settings: Unexpected response format');
        }
      } catch (error) {
        console.error('Error fetching website info:', error);
        toast.error('Failed to load website settings');
      } finally {
        setLoading(false);
      }
    };
    
    fetchWebsiteInfo();
  }, []);
  
  // Fetch User Settings
  useEffect(() => {
    const fetchUserSettings = async () => {
      try {
        setLoading(true);
        const response = await api.get('/settings/user');
        
        if (response.data && response.data.success) {
          setUserSettings(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching user settings:', error);
        toast.error('Failed to load user settings');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserSettings();
  }, []);
  
  // Handle Website Info Changes
  const handleWebsiteInfoChange = (e) => {
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
  
  // Handle User Settings Changes
  const handleUserSettingsChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested object properties
    if (name.includes('.')) {
      const parts = name.split('.');
      
      if (parts.length === 2) {
        setUserSettings({
          ...userSettings,
          [parts[0]]: {
            ...userSettings[parts[0]],
            [parts[1]]: value
          }
        });
      } else if (parts.length === 3) {
        setUserSettings({
          ...userSettings,
          [parts[0]]: {
            ...userSettings[parts[0]],
            [parts[1]]: {
              ...userSettings[parts[0]][parts[1]],
              [parts[2]]: value
            }
          }
        });
      }
    } else {
      setUserSettings({
        ...userSettings,
        [name]: value
      });
    }
  };
  
  // Handle Save Website Info
  const handleSaveWebsiteInfo = async () => {
    try {
      setLoading(true);
      const response = await api.put('/website-info', websiteInfo);
      
      console.log('Save website info response:', response);
      
      if (response && response.success) {
        toast.success('Website information updated successfully');
      } else if (response.data && response.data.success) {
        toast.success('Website information updated successfully');
      } else {
        console.error('Unexpected response structure:', response);
        toast.error('Failed to update website information: Unexpected response format');
      }
    } catch (error) {
      console.error('Error updating website info:', error);
      toast.error('Failed to update website information');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle adding a new FAQ
  const handleAddFaq = () => {
    if (!newFaq.question || !newFaq.answer) {
      toast.error('Both question and answer are required');
      return;
    }
    
    // If editing an existing FAQ
    if (editingFaqIndex >= 0) {
      const updatedFaqs = [...(websiteInfo.faqs || [])];
      updatedFaqs[editingFaqIndex] = newFaq;
      
      setWebsiteInfo({
        ...websiteInfo,
        faqs: updatedFaqs
      });
      
      // Reset form
      setNewFaq({ question: '', answer: '' });
      setEditingFaqIndex(-1);
      toast.success('FAQ updated successfully');
    } else {
      // Add new FAQ
      setWebsiteInfo({
        ...websiteInfo,
        faqs: [...(websiteInfo.faqs || []), newFaq]
      });
      
      // Reset form
      setNewFaq({ question: '', answer: '' });
      toast.success('FAQ added successfully');
    }
  };
  
  // Handle editing an FAQ
  const handleEditFaq = (index) => {
    setNewFaq(websiteInfo.faqs[index]);
    setEditingFaqIndex(index);
  };
  
  // Handle deleting an FAQ
  const handleDeleteFaq = (index) => {
    const updatedFaqs = [...(websiteInfo.faqs || [])];
    updatedFaqs.splice(index, 1);
    
    setWebsiteInfo({
      ...websiteInfo,
      faqs: updatedFaqs
    });
    
    toast.success('FAQ deleted successfully');
  };
  
  // Handle Save User Settings
  const handleSaveUserSettings = async () => {
    try {
      setLoading(true);
      const response = await api.put('/settings/user', userSettings);
      
      if (response.data && response.data.success) {
        toast.success('User settings updated successfully');
      } else {
        toast.error('Failed to update user settings');
      }
    } catch (error) {
      console.error('Error updating user settings:', error);
      toast.error('Failed to update user settings');
    } finally {
      setLoading(false);
    }
  };

  // Handle file upload for logo
  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Only accept image files
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    
    try {
      setUploadingLogo(true);
      
      const formData = new FormData();
      formData.append('image', file);
      
      // Use the upload API endpoint with 'logos' type
      const response = await fetch(`${API_BASE_URL}/api/upload/logos`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`Upload failed with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setWebsiteInfo({
          ...websiteInfo,
          logo: data.imageUrl // Use the relative path returned by the server
        });
        toast.success('Logo uploaded successfully');
      } else {
        toast.error(data.message || 'Failed to upload logo');
      }
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast.error('Failed to upload logo: ' + error.message);
    } finally {
      setUploadingLogo(false);
    }
  };

  return (
    <div className="px-2">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Settings</h1>
      
      <Tabs defaultValue="website" onValueChange={setActiveTab} value={activeTab}>
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="website">Website Info</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="email">Email Templates</TabsTrigger>
          <TabsTrigger value="user">User Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="website">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="siteName">Site Name</Label>
                    <Input 
                      id="siteName"
                      name="siteName"
                      value={websiteInfo.siteName || ''}
                      onChange={handleWebsiteInfoChange}
                      placeholder="Car Rental Service"
                    />
                  </div>
                  <div>
                    <Label htmlFor="logo">Logo</Label>
                    <div className="flex flex-col space-y-2">
                      {websiteInfo.logo && (
                        <div className="mb-2">
                          <img 
                            src={websiteInfo.logo.startsWith('http') ? websiteInfo.logo : `${API_BASE_URL}${websiteInfo.logo}`} 
                            alt="Logo" 
                            className="h-12 object-contain"
                          />
                        </div>
                      )}
                      <div className="flex gap-2">
                        <Input 
                          id="logo"
                          name="logo"
                          value={websiteInfo.logo || ''}
                          onChange={handleWebsiteInfoChange}
                          placeholder="/uploads/logo.png"
                        />
                        <div className="relative">
                          <input
                            type="file"
                            id="logo-upload"
                            className="absolute inset-0 opacity-0 w-full cursor-pointer"
                            onChange={handleLogoUpload}
                            accept="image/*"
                          />
                          <Button 
                            type="button" 
                            variant="outline"
                            disabled={uploadingLogo}
                          >
                            {uploadingLogo ? 'Uploading...' : 'Upload'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description"
                    name="description"
                    value={websiteInfo.description || ''}
                    onChange={handleWebsiteInfoChange}
                    placeholder="Premium car rental service for all your travel needs"
                    rows={3}
                  />
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="text-lg font-medium mb-4">Contact Information</h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="contactInfo.email">Email</Label>
                      <Input 
                        id="contactInfo.email"
                        name="contactInfo.email"
                        value={websiteInfo.contactInfo?.email || ''}
                        onChange={handleWebsiteInfoChange}
                        placeholder="support@example.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contactInfo.phone">Phone</Label>
                      <Input 
                        id="contactInfo.phone"
                        name="contactInfo.phone"
                        value={websiteInfo.contactInfo?.phone || ''}
                        onChange={handleWebsiteInfoChange}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <Label htmlFor="contactInfo.address">Address</Label>
                    <Textarea 
                      id="contactInfo.address"
                      name="contactInfo.address"
                      value={websiteInfo.contactInfo?.address || ''}
                      onChange={handleWebsiteInfoChange}
                      placeholder="123 Rental Street, City, Country"
                      rows={2}
                    />
                  </div>
                  
                  <div className="mt-4">
                    <Label htmlFor="contactInfo.businessHours">Business Hours</Label>
                    <Input 
                      id="contactInfo.businessHours"
                      name="contactInfo.businessHours"
                      value={websiteInfo.contactInfo?.businessHours || ''}
                      onChange={handleWebsiteInfoChange}
                      placeholder="Mon-Fri: 9AM-5PM, Sat: 10AM-2PM, Sun: Closed"
                    />
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="text-lg font-medium mb-4">Social Media Links</h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div>
                      <Label htmlFor="socialLinks.facebook">Facebook</Label>
                      <Input 
                        id="socialLinks.facebook"
                        name="socialLinks.facebook"
                        value={websiteInfo.socialLinks?.facebook || ''}
                        onChange={handleWebsiteInfoChange}
                        placeholder="https://facebook.com/yourpage"
                      />
                    </div>
                    <div>
                      <Label htmlFor="socialLinks.instagram">Instagram</Label>
                      <Input 
                        id="socialLinks.instagram"
                        name="socialLinks.instagram"
                        value={websiteInfo.socialLinks?.instagram || ''}
                        onChange={handleWebsiteInfoChange}
                        placeholder="https://instagram.com/yourpage"
                      />
                    </div>
                    <div>
                      <Label htmlFor="socialLinks.twitter">Twitter</Label>
                      <Input 
                        id="socialLinks.twitter"
                        name="socialLinks.twitter"
                        value={websiteInfo.socialLinks?.twitter || ''}
                        onChange={handleWebsiteInfoChange}
                        placeholder="https://twitter.com/yourpage"
                      />
                    </div>
                    <div>
                      <Label htmlFor="socialLinks.youtube">YouTube</Label>
                      <Input 
                        id="socialLinks.youtube"
                        name="socialLinks.youtube"
                        value={websiteInfo.socialLinks?.youtube || ''}
                        onChange={handleWebsiteInfoChange}
                        placeholder="https://youtube.com/c/yourchannel"
                      />
                    </div>
                    <div>
                      <Label htmlFor="socialLinks.linkedin">LinkedIn</Label>
                      <Input 
                        id="socialLinks.linkedin"
                        name="socialLinks.linkedin"
                        value={websiteInfo.socialLinks?.linkedin || ''}
                        onChange={handleWebsiteInfoChange}
                        placeholder="https://linkedin.com/company/yourcompany"
                      />
                    </div>
                    <div>
                      <Label htmlFor="socialLinks.tiktok">TikTok</Label>
                      <Input 
                        id="socialLinks.tiktok"
                        name="socialLinks.tiktok"
                        value={websiteInfo.socialLinks?.tiktok || ''}
                        onChange={handleWebsiteInfoChange}
                        placeholder="https://tiktok.com/@yourhandle"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    onClick={handleSaveWebsiteInfo}
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Basic Information'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Payment Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="paymentSettings.currencySymbol">Currency Symbol</Label>
                    <Input 
                      id="paymentSettings.currencySymbol"
                      name="paymentSettings.currencySymbol"
                      value={websiteInfo.paymentSettings?.currencySymbol || '$'}
                      onChange={handleWebsiteInfoChange}
                      placeholder="$"
                    />
                  </div>
                  <div>
                    <Label htmlFor="paymentSettings.currencyCode">Currency Code</Label>
                    <Input 
                      id="paymentSettings.currencyCode"
                      name="paymentSettings.currencyCode"
                      value={websiteInfo.paymentSettings?.currencyCode || 'USD'}
                      onChange={handleWebsiteInfoChange}
                      placeholder="USD"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="paymentSettings.taxRate">Tax Rate (%)</Label>
                    <Input 
                      id="paymentSettings.taxRate"
                      name="paymentSettings.taxRate"
                      type="number"
                      value={websiteInfo.paymentSettings?.taxRate || 0}
                      onChange={handleWebsiteInfoChange}
                      placeholder="8.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="paymentSettings.bookingFee">Booking Fee</Label>
                    <Input 
                      id="paymentSettings.bookingFee"
                      name="paymentSettings.bookingFee"
                      type="number"
                      value={websiteInfo.paymentSettings?.bookingFee || 0}
                      onChange={handleWebsiteInfoChange}
                      placeholder="5"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="paymentSettings.maintenanceFee">Maintenance Fee</Label>
                    <Input 
                      id="paymentSettings.maintenanceFee"
                      name="paymentSettings.maintenanceFee"
                      type="number"
                      value={websiteInfo.paymentSettings?.maintenanceFee || 0}
                      onChange={handleWebsiteInfoChange}
                      placeholder="25"
                    />
                  </div>
                  <div>
                    <Label htmlFor="paymentSettings.depositPercentage">Deposit Percentage (%)</Label>
                    <Input 
                      id="paymentSettings.depositPercentage"
                      name="paymentSettings.depositPercentage"
                      type="number"
                      value={websiteInfo.paymentSettings?.depositPercentage || 0}
                      onChange={handleWebsiteInfoChange}
                      placeholder="15"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="paymentSettings.enablePaypal"
                      checked={websiteInfo.paymentSettings?.enablePaypal || false}
                      onCheckedChange={(checked) => 
                        setWebsiteInfo({
                          ...websiteInfo,
                          paymentSettings: {
                            ...websiteInfo.paymentSettings,
                            enablePaypal: checked
                          }
                        })
                      }
                    />
                    <Label htmlFor="paymentSettings.enablePaypal">Enable PayPal</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="paymentSettings.enableCreditCard"
                      checked={websiteInfo.paymentSettings?.enableCreditCard || false}
                      onCheckedChange={(checked) => 
                        setWebsiteInfo({
                          ...websiteInfo,
                          paymentSettings: {
                            ...websiteInfo.paymentSettings,
                            enableCreditCard: checked
                          }
                        })
                      }
                    />
                    <Label htmlFor="paymentSettings.enableCreditCard">Enable Credit Card</Label>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="paymentSettings.enableCash"
                      checked={websiteInfo.paymentSettings?.enableCash || false}
                      onCheckedChange={(checked) => 
                        setWebsiteInfo({
                          ...websiteInfo,
                          paymentSettings: {
                            ...websiteInfo.paymentSettings,
                            enableCash: checked
                          }
                        })
                      }
                    />
                    <Label htmlFor="paymentSettings.enableCash">Enable Cash Payment</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="paymentSettings.enableBankTransfer"
                      checked={websiteInfo.paymentSettings?.enableBankTransfer || false}
                      onCheckedChange={(checked) => 
                        setWebsiteInfo({
                          ...websiteInfo,
                          paymentSettings: {
                            ...websiteInfo.paymentSettings,
                            enableBankTransfer: checked
                          }
                        })
                      }
                    />
                    <Label htmlFor="paymentSettings.enableBankTransfer">Enable Bank Transfer</Label>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    onClick={handleSaveWebsiteInfo}
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Payment Settings'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Booking Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div>
                    <Label htmlFor="bookingSettings.minimumBookingHours">Minimum Booking Hours</Label>
                    <Input 
                      id="bookingSettings.minimumBookingHours"
                      name="bookingSettings.minimumBookingHours"
                      type="number"
                      value={websiteInfo.bookingSettings?.minimumBookingHours || 4}
                      onChange={handleWebsiteInfoChange}
                      placeholder="4"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bookingSettings.maximumBookingDays">Maximum Booking Days</Label>
                    <Input 
                      id="bookingSettings.maximumBookingDays"
                      name="bookingSettings.maximumBookingDays"
                      type="number"
                      value={websiteInfo.bookingSettings?.maximumBookingDays || 30}
                      onChange={handleWebsiteInfoChange}
                      placeholder="30"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bookingSettings.bookingAdvanceDays">Booking Advance Days</Label>
                    <Input 
                      id="bookingSettings.bookingAdvanceDays"
                      name="bookingSettings.bookingAdvanceDays"
                      type="number"
                      value={websiteInfo.bookingSettings?.bookingAdvanceDays || 1}
                      onChange={handleWebsiteInfoChange}
                      placeholder="1"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    onClick={handleSaveWebsiteInfo}
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Booking Settings'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="seoSettings.googleAnalyticsId">Google Analytics ID</Label>
                  <Input 
                    id="seoSettings.googleAnalyticsId"
                    name="seoSettings.googleAnalyticsId"
                    value={websiteInfo.seoSettings?.googleAnalyticsId || ''}
                    onChange={handleWebsiteInfoChange}
                    placeholder="UA-XXXXXXXXX-X"
                  />
                </div>
                
                <div>
                  <Label htmlFor="seoSettings.metaDescription">Meta Description</Label>
                  <Textarea 
                    id="seoSettings.metaDescription"
                    name="seoSettings.metaDescription"
                    value={websiteInfo.seoSettings?.metaDescription || ''}
                    onChange={handleWebsiteInfoChange}
                    placeholder="Book your dream car rental today with our easy-to-use platform"
                    rows={2}
                  />
                </div>
                
                <div>
                  <Label htmlFor="seoSettings.metaKeywords">Meta Keywords</Label>
                  <Input 
                    id="seoSettings.metaKeywords"
                    name="seoSettings.metaKeywords"
                    value={websiteInfo.seoSettings?.metaKeywords || ''}
                    onChange={handleWebsiteInfoChange}
                    placeholder="car rental, vehicle rental, rent a car"
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    onClick={handleSaveWebsiteInfo}
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save SEO Settings'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Content Pages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="contentPages.aboutUs">About Us</Label>
                  <Textarea 
                    id="contentPages.aboutUs"
                    name="contentPages.aboutUs"
                    value={websiteInfo.contentPages?.aboutUs || ''}
                    onChange={handleWebsiteInfoChange}
                    placeholder="About us content goes here"
                    rows={4}
                  />
                </div>
                
                <div>
                  <Label htmlFor="contentPages.termsAndConditions">Terms and Conditions</Label>
                  <Textarea 
                    id="contentPages.termsAndConditions"
                    name="contentPages.termsAndConditions"
                    value={websiteInfo.contentPages?.termsAndConditions || ''}
                    onChange={handleWebsiteInfoChange}
                    placeholder="Standard terms and conditions for vehicle rental"
                    rows={4}
                  />
                </div>
                
                <div>
                  <Label htmlFor="contentPages.privacyPolicy">Privacy Policy</Label>
                  <Textarea 
                    id="contentPages.privacyPolicy"
                    name="contentPages.privacyPolicy"
                    value={websiteInfo.contentPages?.privacyPolicy || ''}
                    onChange={handleWebsiteInfoChange}
                    placeholder="Privacy policy for user data and booking information"
                    rows={4}
                  />
                </div>
                
                <div>
                  <Label htmlFor="contentPages.cancellationPolicy">Cancellation Policy</Label>
                  <Textarea 
                    id="contentPages.cancellationPolicy"
                    name="contentPages.cancellationPolicy"
                    value={websiteInfo.contentPages?.cancellationPolicy || ''}
                    onChange={handleWebsiteInfoChange}
                    placeholder="Free cancellation up to 24 hours before pickup"
                    rows={4}
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    onClick={handleSaveWebsiteInfo}
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Content Pages'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Feature Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="featureSettings.maintenanceMode"
                      checked={websiteInfo.featureSettings?.maintenanceMode || false}
                      onCheckedChange={(checked) => 
                        setWebsiteInfo({
                          ...websiteInfo,
                          featureSettings: {
                            ...websiteInfo.featureSettings,
                            maintenanceMode: checked
                          }
                        })
                      }
                    />
                    <Label htmlFor="featureSettings.maintenanceMode">Maintenance Mode</Label>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    onClick={handleSaveWebsiteInfo}
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Feature Settings'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* FAQ Form */}
                <div className="border p-4 rounded-md">
                  <h3 className="text-lg font-medium mb-4">{editingFaqIndex >= 0 ? 'Edit FAQ' : 'Add New FAQ'}</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="faq-question">Question</Label>
                      <Input 
                        id="faq-question"
                        value={newFaq.question}
                        onChange={(e) => setNewFaq({...newFaq, question: e.target.value})}
                        placeholder="What documents do I need to rent a car?"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="faq-answer">Answer</Label>
                      <Textarea 
                        id="faq-answer"
                        value={newFaq.answer}
                        onChange={(e) => setNewFaq({...newFaq, answer: e.target.value})}
                        placeholder="You will need a valid driver's license, credit card, and a form of identification."
                        rows={3}
                      />
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      {editingFaqIndex >= 0 && (
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={() => {
                            setNewFaq({ question: '', answer: '' });
                            setEditingFaqIndex(-1);
                          }}
                        >
                          Cancel
                        </Button>
                      )}
                      <Button 
                        type="button" 
                        onClick={handleAddFaq}
                      >
                        {editingFaqIndex >= 0 ? 'Update FAQ' : 'Add FAQ'}
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* FAQ List */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Existing FAQs</h3>
                  
                  {websiteInfo.faqs && websiteInfo.faqs.length > 0 ? (
                    <div className="space-y-4">
                      {websiteInfo.faqs.map((faq, index) => (
                        <div key={index} className="border p-4 rounded-md">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold">{faq.question}</h4>
                              <p className="mt-1 text-gray-600">{faq.answer}</p>
                            </div>
                            <div className="flex space-x-2">
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleEditFaq(index)}
                              >
                                Edit
                              </Button>
                              <Button 
                                type="button" 
                                variant="destructive" 
                                size="sm"
                                onClick={() => handleDeleteFaq(index)}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No FAQs added yet.</p>
                  )}
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    onClick={handleSaveWebsiteInfo}
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save All FAQs'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="appearanceSettings.primaryColor">Primary Color</Label>
                    <div className="flex gap-2 items-center">
                      <input 
                        type="color" 
                        id="appearanceSettings.primaryColor"
                        name="appearanceSettings.primaryColor"
                        value={websiteInfo.appearanceSettings?.primaryColor || '#3b82f6'}
                        onChange={handleWebsiteInfoChange}
                        className="w-10 h-10 border-0"
                      />
                      <Input 
                        value={websiteInfo.appearanceSettings?.primaryColor || '#3b82f6'}
                        onChange={(e) => 
                          setWebsiteInfo({
                            ...websiteInfo,
                            appearanceSettings: {
                              ...websiteInfo.appearanceSettings,
                              primaryColor: e.target.value
                            }
                          })
                        }
                        className="flex-1"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="appearanceSettings.secondaryColor">Secondary Color</Label>
                    <div className="flex gap-2 items-center">
                      <input 
                        type="color" 
                        id="appearanceSettings.secondaryColor"
                        name="appearanceSettings.secondaryColor"
                        value={websiteInfo.appearanceSettings?.secondaryColor || '#10b981'}
                        onChange={handleWebsiteInfoChange}
                        className="w-10 h-10 border-0"
                      />
                      <Input 
                        value={websiteInfo.appearanceSettings?.secondaryColor || '#10b981'}
                        onChange={(e) => 
                          setWebsiteInfo({
                            ...websiteInfo,
                            appearanceSettings: {
                              ...websiteInfo.appearanceSettings,
                              secondaryColor: e.target.value
                            }
                          })
                        }
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="appearanceSettings.fontFamily">Font Family</Label>
                    <Select 
                      value={websiteInfo.appearanceSettings?.fontFamily || 'Inter, sans-serif'}
                      onValueChange={(value) => 
                        setWebsiteInfo({
                          ...websiteInfo,
                          appearanceSettings: {
                            ...websiteInfo.appearanceSettings,
                            fontFamily: value
                          }
                        })
                      }
                    >
                      <SelectTrigger id="appearanceSettings.fontFamily">
                        <SelectValue placeholder="Select font family" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Inter, sans-serif">Inter</SelectItem>
                        <SelectItem value="Roboto, sans-serif">Roboto</SelectItem>
                        <SelectItem value="Poppins, sans-serif">Poppins</SelectItem>
                        <SelectItem value="Montserrat, sans-serif">Montserrat</SelectItem>
                        <SelectItem value="Open Sans, sans-serif">Open Sans</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="appearanceSettings.borderRadius">Border Radius</Label>
                    <Select 
                      value={websiteInfo.appearanceSettings?.borderRadius || '0.375rem'}
                      onValueChange={(value) => 
                        setWebsiteInfo({
                          ...websiteInfo,
                          appearanceSettings: {
                            ...websiteInfo.appearanceSettings,
                            borderRadius: value
                          }
                        })
                      }
                    >
                      <SelectTrigger id="appearanceSettings.borderRadius">
                        <SelectValue placeholder="Select border radius" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">None</SelectItem>
                        <SelectItem value="0.125rem">Small (2px)</SelectItem>
                        <SelectItem value="0.25rem">Medium (4px)</SelectItem>
                        <SelectItem value="0.375rem">Default (6px)</SelectItem>
                        <SelectItem value="0.5rem">Large (8px)</SelectItem>
                        <SelectItem value="1rem">Extra Large (16px)</SelectItem>
                        <SelectItem value="9999px">Full (Rounded)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="appearanceSettings.buttonStyle">Button Style</Label>
                    <Select 
                      value={websiteInfo.appearanceSettings?.buttonStyle || 'rounded'}
                      onValueChange={(value) => 
                        setWebsiteInfo({
                          ...websiteInfo,
                          appearanceSettings: {
                            ...websiteInfo.appearanceSettings,
                            buttonStyle: value
                          }
                        })
                      }
                    >
                      <SelectTrigger id="appearanceSettings.buttonStyle">
                        <SelectValue placeholder="Select button style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="square">Square</SelectItem>
                        <SelectItem value="rounded">Rounded</SelectItem>
                        <SelectItem value="pill">Pill</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="appearanceSettings.darkMode"
                      checked={websiteInfo.appearanceSettings?.darkMode || false}
                      onCheckedChange={(checked) => 
                        setWebsiteInfo({
                          ...websiteInfo,
                          appearanceSettings: {
                            ...websiteInfo.appearanceSettings,
                            darkMode: checked
                          }
                        })
                      }
                    />
                    <Label htmlFor="appearanceSettings.darkMode">Default to Dark Mode</Label>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="appearanceSettings.customCSS">Custom CSS</Label>
                  <Textarea 
                    id="appearanceSettings.customCSS"
                    name="appearanceSettings.customCSS"
                    value={websiteInfo.appearanceSettings?.customCSS || ''}
                    onChange={handleWebsiteInfoChange}
                    placeholder="/* Add your custom CSS here */"
                    rows={5}
                    className="font-mono"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Add custom CSS to override the default styles. Be careful as this can break the design.
                  </p>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    onClick={handleSaveWebsiteInfo}
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Appearance Settings'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Email Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="emailSettings.senderName">Sender Name</Label>
                    <Input 
                      id="emailSettings.senderName"
                      name="emailSettings.senderName"
                      value={websiteInfo.emailSettings?.senderName || 'Car Rental Service'}
                      onChange={handleWebsiteInfoChange}
                      placeholder="Car Rental Service"
                    />
                  </div>
                  <div>
                    <Label htmlFor="emailSettings.senderEmail">Sender Email</Label>
                    <Input 
                      id="emailSettings.senderEmail"
                      name="emailSettings.senderEmail"
                      value={websiteInfo.emailSettings?.senderEmail || 'noreply@carrental.com'}
                      onChange={handleWebsiteInfoChange}
                      placeholder="noreply@carrental.com"
                    />
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="text-lg font-medium mb-4">Welcome Email</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="emailSettings.welcomeEmailSubject">Subject</Label>
                      <Input 
                        id="emailSettings.welcomeEmailSubject"
                        name="emailSettings.welcomeEmailSubject"
                        value={websiteInfo.emailSettings?.welcomeEmailSubject || 'Welcome to Car Rental Service'}
                        onChange={handleWebsiteInfoChange}
                        placeholder="Welcome to Car Rental Service"
                      />
                    </div>
                    <div>
                      <Label htmlFor="emailSettings.welcomeEmailTemplate">Template</Label>
                      <Textarea 
                        id="emailSettings.welcomeEmailTemplate"
                        name="emailSettings.welcomeEmailTemplate"
                        value={websiteInfo.emailSettings?.welcomeEmailTemplate || 'Thank you for signing up with Car Rental Service!'}
                        onChange={handleWebsiteInfoChange}
                        placeholder="Thank you for signing up with Car Rental Service!"
                        rows={6}
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Use {`{{name}}`} to insert the user's name, {`{{email}}`} for email, etc.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="text-lg font-medium mb-4">Booking Confirmation Email</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="emailSettings.bookingConfirmationSubject">Subject</Label>
                      <Input 
                        id="emailSettings.bookingConfirmationSubject"
                        name="emailSettings.bookingConfirmationSubject"
                        value={websiteInfo.emailSettings?.bookingConfirmationSubject || 'Your booking is confirmed'}
                        onChange={handleWebsiteInfoChange}
                        placeholder="Your booking is confirmed"
                      />
                    </div>
                    <div>
                      <Label htmlFor="emailSettings.bookingConfirmationTemplate">Template</Label>
                      <Textarea 
                        id="emailSettings.bookingConfirmationTemplate"
                        name="emailSettings.bookingConfirmationTemplate"
                        value={websiteInfo.emailSettings?.bookingConfirmationTemplate || 'Your car rental booking has been confirmed.'}
                        onChange={handleWebsiteInfoChange}
                        placeholder="Your car rental booking has been confirmed."
                        rows={6}
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Use {`{{bookingID}}`}, {`{{carName}}`}, {`{{startDate}}`}, {`{{endDate}}`}, etc.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="text-lg font-medium mb-4">Booking Reminder Email</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="emailSettings.bookingReminderSubject">Subject</Label>
                      <Input 
                        id="emailSettings.bookingReminderSubject"
                        name="emailSettings.bookingReminderSubject"
                        value={websiteInfo.emailSettings?.bookingReminderSubject || 'Your upcoming car rental'}
                        onChange={handleWebsiteInfoChange}
                        placeholder="Your upcoming car rental"
                      />
                    </div>
                    <div>
                      <Label htmlFor="emailSettings.bookingReminderTemplate">Template</Label>
                      <Textarea 
                        id="emailSettings.bookingReminderTemplate"
                        name="emailSettings.bookingReminderTemplate"
                        value={websiteInfo.emailSettings?.bookingReminderTemplate || 'Your car rental is coming up soon.'}
                        onChange={handleWebsiteInfoChange}
                        placeholder="Your car rental is coming up soon."
                        rows={6}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="text-lg font-medium mb-4">Email Footer</h3>
                  <div>
                    <Label htmlFor="emailSettings.customFooter">Custom Footer</Label>
                    <Textarea 
                      id="emailSettings.customFooter"
                      name="emailSettings.customFooter"
                      value={websiteInfo.emailSettings?.customFooter || '© 2025 Car Rental Service. All rights reserved.'}
                      onChange={handleWebsiteInfoChange}
                      placeholder="© 2025 Car Rental Service. All rights reserved."
                      rows={3}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    onClick={handleSaveWebsiteInfo}
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Email Settings'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="user">
          <Card>
            <CardHeader>
              <CardTitle>User Preferences</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="preferences.language">Language</Label>
                    <Select 
                      value={userSettings.preferences?.language || 'en'}
                      onValueChange={(value) => 
                        setUserSettings({
                          ...userSettings,
                          preferences: {
                            ...userSettings.preferences,
                            language: value
                          }
                        })
                      }
                    >
                      <SelectTrigger id="preferences.language">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="vi">Vietnamese</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="preferences.theme">Theme</Label>
                    <Select 
                      value={userSettings.preferences?.theme || 'light'}
                      onValueChange={(value) => 
                        setUserSettings({
                          ...userSettings,
                          preferences: {
                            ...userSettings.preferences,
                            theme: value
                          }
                        })
                      }
                    >
                      <SelectTrigger id="preferences.theme">
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="text-lg font-medium mb-4">Notification Preferences</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-new-bookings">Email notifications for new bookings</Label>
                      <Switch 
                        id="email-new-bookings"
                        checked={userSettings.preferences?.notifications?.email?.newBookings || false}
                        onCheckedChange={(checked) => 
                          setUserSettings({
                            ...userSettings,
                            preferences: {
                              ...userSettings.preferences,
                              notifications: {
                                ...userSettings.preferences?.notifications,
                                email: {
                                  ...userSettings.preferences?.notifications?.email,
                                  newBookings: checked
                                }
                              }
                            }
                          })
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-booking-updates">Email notifications for booking updates</Label>
                      <Switch 
                        id="email-booking-updates"
                        checked={userSettings.preferences?.notifications?.email?.bookingUpdates || false}
                        onCheckedChange={(checked) => 
                          setUserSettings({
                            ...userSettings,
                            preferences: {
                              ...userSettings.preferences,
                              notifications: {
                                ...userSettings.preferences?.notifications,
                                email: {
                                  ...userSettings.preferences?.notifications?.email,
                                  bookingUpdates: checked
                                }
                              }
                            }
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    onClick={handleSaveUserSettings}
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save User Settings'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 