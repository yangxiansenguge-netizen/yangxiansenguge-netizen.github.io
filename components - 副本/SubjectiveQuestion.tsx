import React from 'react';
import { QuestionItem } from '../types';

interface SubjectiveQuestionProps {
  item: QuestionItem;
  userAnswer: string | undefined;
  onChange: (val: string) => void;
}

export const SubjectiveQuestion: React.FC<SubjectiveQuestionProps> = ({ item, userAnswer, onChange }) => {
  return (
    <div className="mt-4">
      <div className="relative p-1 bg-white/5 rounded-lg">
        <textarea
          rows={6}
          value={userAnswer || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Write your explanation..."
          className="block w-full bg-transparent text-xl text-chalk-white placeholder-gray-600 p-4 border-none focus:ring-2 focus:ring-chalk-yellow/50 rounded-lg resize-y font-hand leading-loose"
          style={{ backgroundImage: 'linear-gradient(transparent 95%, rgba(255,255,255,0.1) 95%)', backgroundSize: '100% 2em', lineHeight: '2em' }}
        />
      </div>
    </div>
  );
};