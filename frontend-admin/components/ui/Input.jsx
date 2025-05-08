"use client";

import { forwardRef } from 'react';

const Input = forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md 
                focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                bg-background text-foreground ${className}`}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = "Input";

export { Input }; 