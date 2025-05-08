"use client";

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Package } from 'lucide-react';

export default function ComponentsPage() {
  // Components list
  const componentItems = [
    'Accordion', 'Alert', 'Alert Dialog', 'Aspect Ratio', 'Avatar', 'Badge', 
    'Breadcrumb', 'Button', 'Calendar', 'Card', 'Carousel', 'Checkbox', 
    'Collapsible', 'Combobox', 'Command', 'Context Menu', 'Dialog', 
    'Dropdown Menu', 'Form', 'Hover Card', 'Input', 'Label', 'Menubar', 
    'Navigation Menu', 'Popover', 'Progress', 'Radio Group', 'Scroll Area', 
    'Select', 'Separator', 'Sheet', 'Skeleton', 'Slider', 'Switch', 
    'Table', 'Tabs', 'Textarea', 'Toast', 'Toggle', 'Tooltip'
  ];

  return (
    <div className="px-2">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">UI Components</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {componentItems.map((component) => (
          <Link 
            key={component} 
            href={`/dashboard/components/${component.toLowerCase().replace(/\s+/g, '-')}`}
          >
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-md dark:bg-blue-900/20">
                    <Package className="h-5 w-5 text-blue-500" />
                  </div>
                  <span className="font-medium">{component}</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
} 