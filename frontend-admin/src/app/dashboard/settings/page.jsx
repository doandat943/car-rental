"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="px-2">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Settings</h1>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-64">
          <Card>
            <CardContent className="p-2">
              <nav className="flex flex-col space-y-1">
                <button
                  className={`flex items-center px-4 py-2 text-sm rounded-md ${
                    activeTab === 'profile'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-200'
                      : 'text-gray-800 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800'
                  }`}
                  onClick={() => setActiveTab('profile')}
                >
                  Profile Settings
                </button>
                <button
                  className={`flex items-center px-4 py-2 text-sm rounded-md ${
                    activeTab === 'account'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-200'
                      : 'text-gray-800 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800'
                  }`}
                  onClick={() => setActiveTab('account')}
                >
                  Account Settings
                </button>
                <button
                  className={`flex items-center px-4 py-2 text-sm rounded-md ${
                    activeTab === 'appearance'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-200'
                      : 'text-gray-800 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800'
                  }`}
                  onClick={() => setActiveTab('appearance')}
                >
                  Appearance
                </button>
                <button
                  className={`flex items-center px-4 py-2 text-sm rounded-md ${
                    activeTab === 'notifications'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-200'
                      : 'text-gray-800 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800'
                  }`}
                  onClick={() => setActiveTab('notifications')}
                >
                  Notifications
                </button>
              </nav>
            </CardContent>
          </Card>
        </div>
        
        {/* Content */}
        <div className="flex-1">
          <Card>
            <CardHeader>
              <CardTitle>
                {activeTab === 'profile' && 'Profile Settings'}
                {activeTab === 'account' && 'Account Settings'}
                {activeTab === 'appearance' && 'Appearance Settings'}
                {activeTab === 'notifications' && 'Notification Settings'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="min-h-[300px]">
                {activeTab === 'profile' && (
                  <div className="flex h-full items-center justify-center border-2 border-dashed border-gray-200 rounded-lg dark:border-gray-700">
                    <p className="text-gray-500 dark:text-gray-400">
                      Profile settings will be implemented soon.
                    </p>
                  </div>
                )}
                {activeTab === 'account' && (
                  <div className="flex h-full items-center justify-center border-2 border-dashed border-gray-200 rounded-lg dark:border-gray-700">
                    <p className="text-gray-500 dark:text-gray-400">
                      Account settings will be implemented soon.
                    </p>
                  </div>
                )}
                {activeTab === 'appearance' && (
                  <div className="flex h-full items-center justify-center border-2 border-dashed border-gray-200 rounded-lg dark:border-gray-700">
                    <p className="text-gray-500 dark:text-gray-400">
                      Appearance settings will be implemented soon.
                    </p>
                  </div>
                )}
                {activeTab === 'notifications' && (
                  <div className="flex h-full items-center justify-center border-2 border-dashed border-gray-200 rounded-lg dark:border-gray-700">
                    <p className="text-gray-500 dark:text-gray-400">
                      Notification settings will be implemented soon.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 