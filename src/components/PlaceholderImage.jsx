import React from 'react';
import { Image } from 'lucide-react';

export default function PlaceholderImage() {
  return (
    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <Image className="w-12 h-12 text-gray-400 mx-auto" />
        <p className="text-sm text-gray-500 mt-2">Article Image</p>
      </div>
    </div>
  );
}