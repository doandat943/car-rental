"use client";

import { useState, useEffect } from 'react';
import { 
  FaEdit, 
  FaSave, 
  FaTimes, 
  FaFileText, 
  FaSpinner,
  FaCheck,
  FaExclamationTriangle
} from 'react-icons/fa';

// API calls
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const contentAPI = {
  getAllContentPages: async () => {
    const token = localStorage.getItem('adminToken');
    const response = await fetch(`${API_BASE_URL}/website-info/pages`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  },
  
  updateContentPage: async (pageType, content) => {
    const token = localStorage.getItem('adminToken');
    const response = await fetch(`${API_BASE_URL}/website-info/pages/${pageType}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    });
    return response.json();
  }
};

const ContentManagement = () => {
  const [contentPages, setContentPages] = useState({});
  const [editingPage, setEditingPage] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const pageTypes = [
    { key: 'aboutUs', label: 'About Us', icon: <FaFileText /> },
    { key: 'termsAndConditions', label: 'Terms & Conditions', icon: <FaFileText /> },
    { key: 'privacyPolicy', label: 'Privacy Policy', icon: <FaFileText /> },
    { key: 'cancellationPolicy', label: 'Cancellation Policy', icon: <FaFileText /> }
  ];

  useEffect(() => {
    fetchContentPages();
  }, []);

  const fetchContentPages = async () => {
    try {
      setLoading(true);
      const response = await contentAPI.getAllContentPages();
      
      if (response.success) {
        setContentPages(response.data.contentPages || {});
      } else {
        setMessage({ type: 'error', text: 'Failed to fetch content pages' });
      }
    } catch (error) {
      console.error('Error fetching content pages:', error);
      setMessage({ type: 'error', text: 'Error loading content pages' });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (pageType) => {
    setEditingPage(pageType);
    setEditContent(contentPages[pageType] || '');
    setMessage({ type: '', text: '' });
  };

  const handleCancel = () => {
    setEditingPage(null);
    setEditContent('');
    setMessage({ type: '', text: '' });
  };

  const handleSave = async () => {
    if (!editingPage) return;

    try {
      setSaving(true);
      const response = await contentAPI.updateContentPage(editingPage, editContent);
      
      if (response.success) {
        setContentPages(prev => ({
          ...prev,
          [editingPage]: editContent
        }));
        setEditingPage(null);
        setEditContent('');
        setMessage({ type: 'success', text: `${pageTypes.find(p => p.key === editingPage)?.label} updated successfully!` });
        
        // Clear message after 3 seconds
        setTimeout(() => {
          setMessage({ type: '', text: '' });
        }, 3000);
      } else {
        setMessage({ type: 'error', text: response.message || 'Failed to update content' });
      }
    } catch (error) {
      console.error('Error updating content:', error);
      setMessage({ type: 'error', text: 'Error updating content' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <FaSpinner className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading content pages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Content Management</h1>
        <p className="text-gray-600">Manage your website content pages</p>
      </div>

      {/* Message */}
      {message.text && (
        <div className={`mb-6 p-4 rounded-lg flex items-center ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {message.type === 'success' ? (
            <FaCheck className="w-5 h-5 mr-3 flex-shrink-0" />
          ) : (
            <FaExclamationTriangle className="w-5 h-5 mr-3 flex-shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Content Pages */}
      <div className="space-y-6">
        {pageTypes.map((pageType) => (
          <div key={pageType.key} className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg mr-3">
                    {pageType.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{pageType.label}</h3>
                    <p className="text-sm text-gray-600">
                      {editingPage === pageType.key ? 'Editing content...' : 'Click edit to modify content'}
                    </p>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  {editingPage === pageType.key ? (
                    <>
                      <button
                        onClick={handleCancel}
                        disabled={saving}
                        className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                      >
                        <FaTimes className="w-4 h-4 mr-2" />
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                      >
                        {saving ? (
                          <>
                            <FaSpinner className="w-4 h-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <FaSave className="w-4 h-4 mr-2" />
                            Save
                          </>
                        )}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleEdit(pageType.key)}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <FaEdit className="w-4 h-4 mr-2" />
                      Edit
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {editingPage === pageType.key ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Content (HTML supported)
                  </label>
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={15}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                    placeholder="Enter HTML content here..."
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    You can use HTML tags for formatting. The content will be displayed on the public website.
                  </p>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Current Content Preview
                  </label>
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 max-h-60 overflow-y-auto">
                    {contentPages[pageType.key] ? (
                      <div 
                        className="prose max-w-none text-sm"
                        dangerouslySetInnerHTML={{ __html: contentPages[pageType.key] }}
                      />
                    ) : (
                      <p className="text-gray-500 italic">No content available. Click edit to add content.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Info */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <FaFileText className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Content Management Tips</h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc pl-5 space-y-1">
                <li>HTML tags are supported for rich formatting</li>
                <li>Changes are immediately reflected on the public website</li>
                <li>Use semantic HTML for better SEO and accessibility</li>
                <li>Test your changes on the public pages after saving</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentManagement; 