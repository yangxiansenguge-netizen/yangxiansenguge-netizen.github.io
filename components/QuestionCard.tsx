import React from 'react';
import { QuestionItem } from '../types';
import { SingleChoiceQuestion } from './SingleChoiceQuestion';
import { FillBlankQuestion } from './FillBlankQuestion';
import { SubjectiveQuestion } from './SubjectiveQuestion';
import { QuestionImage } from './QuestionImage';
import { checkIsCorrect } from '../utils';

interface QuestionCardProps {
  item: QuestionItem;
  index: number;
  userAnswer: string | string[] | undefined;
  onAnswerChange: (id: number, val: string | string[]) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ item, index, userAnswer, onAnswerChange }) => {
  
  const hasAnswer = userAnswer !== undefined && 
    (Array.isArray(userAnswer) ? userAnswer.length > 0 : userAnswer.toString().trim() !== '');

  const isCorrect = hasAnswer ? checkIsCorrect(userAnswer, item.correctAnswer) : false;
  const correctAnswerText = item.correctAnswer ? item.correctAnswer.join(" / ") : "None";

  const renderQuestionBody = () => {
    const type = item.type?.trim() || 'unknown';
    if (['单选', '判断', '多选'].includes(type) || (item.options && item.options.length > 0)) {
       return <SingleChoiceQuestion item={item} userAnswer={userAnswer} onChange={(val) => onAnswerChange(item.id, val)} />;
    } else if (type === '填空') {
       return <FillBlankQuestion item={item} userAnswer={userAnswer as string} onChange={(val) => onAnswerChange(item.id, val)} />;
    } else {
       return <SubjectiveQuestion item={item} userAnswer={userAnswer as string} onChange={(val) => onAnswerChange(item.id, val)} />;
    }
  };

  return (
    <div className="relative mb-12 group">
       {/* Card Container - looks like a dark paper or board section */}
       <div className="bg-chalk-board border-2 border-gray-500 rounded-sm shadow-2xl p-6 md:p-8 relative transform transition-transform hover:scale-[1.005]">
          
          {/* Tape/Pin effect at top center */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-8 bg-gray-200/10 backdrop-blur-sm rotate-1 z-10 border-l border-r border-white/20"></div>

          {/* Question Header */}
          <div className="flex items-start justify-between mb-6 border-b border-gray-600 pb-4 border-dashed">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-chalk-yellow font-hand">Q{index + 1}.</span>
              <span className="px-2 py-0.5 border border-chalk-gray text-chalk-gray text-sm rounded uppercase tracking-widest bg-black/20">
                {item.type}
              </span>
            </div>
            {hasAnswer && (
              <div className={`text-2xl font-bold font-hand animate-dust ${isCorrect ? 'text-chalk-green' : 'text-chalk-red'}`}>
                {isCorrect ? '✓ Good!' : '✗ Try again'}
              </div>
            )}
          </div>

          {/* Title - Render as plain text to prevent HTML tag interpretation (e.g. <caption>) */}
          <div className="mb-6 text-xl md:text-2xl text-white font-hand leading-relaxed tracking-wide whitespace-pre-wrap break-words">
             {item.title}
          </div>

          {/* Images */}
          {item.images && item.images.length > 0 && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
               {item.images.map((img, idx) => (
                 <QuestionImage key={idx} src={img} />
               ))}
             </div>
          )}

          {/* Inputs */}
          <div className="mb-4">
            {renderQuestionBody()}
          </div>

          {/* Feedback (The "Teacher's Note") */}
          {hasAnswer && (
            <div className={`mt-8 p-4 border-2 border-dashed rounded relative animate-dust ${isCorrect ? 'border-chalk-green/30 bg-chalk-green/5' : 'border-chalk-red/30 bg-chalk-red/5'}`}>
               <span className="absolute -top-3 left-4 bg-chalk-board px-2 text-sm text-chalk-gray uppercase tracking-widest">Answer Key</span>
               <div className="mt-2 text-lg">
                 <span className="text-chalk-gray mr-2">Correct Answer:</span>
                 {/* Render answer as text to ensure tags like <br> are visible */}
                 <span className={`font-bold text-xl ${isCorrect ? 'text-chalk-green' : 'text-chalk-white'}`}>
                    {correctAnswerText}
                 </span>
               </div>
            </div>
          )}
       </div>
    </div>
  );
};