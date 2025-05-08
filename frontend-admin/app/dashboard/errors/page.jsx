"use client";

import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

export default function ErrorsPage() {
  return (
    <div className="px-2">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Error Pages</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>404 Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-gray-500">Preview the 404 error page</p>
            <Button variant="outline">
              View 404 Page
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>500 Server Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-gray-500">Preview the 500 error page</p>
            <Button variant="outline">
              View 500 Page
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>403 Forbidden</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-gray-500">Preview the 403 error page</p>
            <Button variant="outline">
              View 403 Page
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Maintenance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-gray-500">Preview the maintenance page</p>
            <Button variant="outline">
              View Maintenance Page
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 