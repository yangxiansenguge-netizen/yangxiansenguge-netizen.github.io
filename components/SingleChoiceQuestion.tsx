import React from 'react';
import { QuestionItem } from '../types';

interface SingleChoiceQuestionProps {
  item: QuestionItem;
  userAnswer: string | string[] | undefined;
  onChange: (value: string | string[]) => void;
}

export const SingleChoiceQuestion: React.FC<SingleChoiceQuestionProps> = ({ item, userAnswer, onChange }) => {
  const isMultipleChoice = item.type === '多选';

  const handleOptionClick = (optionText: string) => {
    if (isMultipleChoice) {
      const currentSelection = Array.isArray(userAnswer) ? [...userAnswer] : [];
      if (currentSelection.includes(optionText)) {
        onChange(currentSelection.filter(t => t !== optionText));
      } else {
        onChange([...currentSelection, optionText]);
      }
    } else {
      onChange(optionText);
    }
  };

  return (
    <div className="space-y-4">
      {item.options.map((option, index) => {
        const optionText = option.text;
        
        let isChecked = false;
        if (isMultipleChoice) {
          isChecked = Array.isArray(userAnswer) && userAnswer.includes(optionText);
        } else {
          isChecked = userAnswer === optionText;
        }

        return (
          <div 
            key={index} 
            onClick={() => handleOptionClick(optionText)}
            className={`
              group flex items-start p-3 cursor-pointer rounded transition-all duration-200
              ${isChecked ? 'bg-white/10' : 'hover:bg-white/5'}
            `}
          >
            {/* Custom Handwritten Checkbox/Radio */}
            <div className="flex-shrink-0 mt-1 mr-4">
              <div className={`
                w-6 h-6 border-2 flex items-center justify-center transition-all
                ${isMultipleChoice ? 'rounded-sm' : 'rounded-full'}
                ${isChecked ? 'border-chalk-yellow text-chalk-yellow' : 'border-chalk-gray group-hover:border-chalk-white'}
              `}>
                {isChecked && (
                   <div className="w-3 h-3 bg-chalk-yellow rounded-full shadow-[0_0_5px_rgba(255,234,167,0.8)]"></div>
                )}
              </div>
            </div>

            <div className="flex-1">
               <span className={`inline-block w-8 font-bold text-lg ${isChecked ? 'text-chalk-yellow' : 'text-chalk-gray'}`}>
                 {String.fromCharCode(65 + index)}.
               </span>
               <span className={`text-xl font-hand leading-normal break-words ${isChecked ? 'text-chalk-white' : 'text-gray-300'}`}>
                 {option.text}
               </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};