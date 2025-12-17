import React from 'react';
import { QuestionItem } from '../types';

interface FillBlankQuestionProps {
  item: QuestionItem;
  userAnswer: string | undefined;
  onChange: (val: string) => void;
}

export const FillBlankQuestion: React.FC<FillBlankQuestionProps> = ({ item, userAnswer, onChange }) => {
  return (
    <div className="mt-4">
      <div className="relative">
        <input
          type="text"
          value={userAnswer || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Write answer here..."
          className="w-full bg-transparent border-b-2 border-chalk-gray text-2xl text-chalk-white placeholder-gray-600 focus:border-chalk-yellow focus:outline-none py-2 px-1 font-hand tracking-wide transition-colors"
          autoComplete="off"
        />
        {/* Helper line visual */}
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white/5 pointer-events-none"></div>
      </div>
    </div>
  );
};