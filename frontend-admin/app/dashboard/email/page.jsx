"use client";

import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';

export default function EmailPage() {
  return (
    <div className="px-2">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Email Dashboard</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Email Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-40 items-center justify-center border-2 border-dashed border-gray-200 rounded-lg dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400">
              Email functionality will be implemented soon.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 