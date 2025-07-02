import React from 'react';

interface LoadingProps {
  message?: string;
}

export const Loading: React.FC<LoadingProps> = ({ message = "Generating your perfect trip..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 md:py-16">
      <div className="relative">
        {/* Spinning gradient circle */}
        <div className="w-16 h-16 md:w-20 md:h-20 border-4 border-gray-200 rounded-full animate-spin">
          <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 border-r-purple-500 rounded-full animate-spin"></div>
        </div>
        
        {/* Pulsing center dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
        </div>
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-base md:text-lg font-medium text-gray-700 mb-2">{message}</p>
        <p className="text-sm text-gray-500">This may take a few seconds...</p>
      </div>
      
      {/* Progress dots */}
      <div className="flex space-x-2 mt-4">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
    </div>
  );
};