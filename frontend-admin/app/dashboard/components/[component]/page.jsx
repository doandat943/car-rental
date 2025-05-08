"use client";

import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ComponentDetailPage() {
  const params = useParams();
  const componentName = params.component;

  // Convert kebab-case to Title Case
  const formattedName = componentName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <div className="px-2">
      <div className="mb-4">
        <Link href="/dashboard/components">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Components
          </Button>
        </Link>
      </div>
      
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">{formattedName} Component</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Implementation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex min-h-[200px] items-center justify-center border-2 border-dashed border-gray-200 rounded-lg dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400">
              Documentation for {formattedName} will be added soon.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 