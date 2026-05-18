import React, { useState } from 'react';

interface QuestionImageProps {
  src: string;
}

export const QuestionImage: React.FC<QuestionImageProps> = ({ src }) => {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className="mt-4 p-4 bg-gray-800/50 border border-dashed border-gray-600 rounded text-center max-w-md mx-auto">
         <p className="text-gray-400 text-sm mb-2 italic">Preview not available (Format not supported)</p>
         <a 
           href={src} 
           target="_blank" 
           rel="noopener noreferrer"
           className="inline-block px-4 py-2 bg-chalk-board border border-chalk-yellow text-chalk-yellow rounded hover:bg-chalk-yellow hover:text-chalk-bg transition-colors font-hand font-bold z-50 relative"
           onClick={(e) => e.stopPropagation()}
         >
           Open Attachment Link ↗
         </a>
      </div>
    );
  }

  return (
    <div className="mt-4 inline-block transform rotate-1 hover:rotate-0 transition-transform duration-300">
      <div className="bg-white p-2 pb-8 shadow-lg">
        <img 
          src={src} 
          alt="Question Attachment" 
          className="max-w-full h-auto filter sepia-[.2] contrast-[.9]"
          loading="lazy"
          onError={() => setError(true)}
        />
      </div>
    </div>
  );
};