import React, { useState } from 'react';
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

  const [revealAnswer, setRevealAnswer] = useState(false);

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
            <div className="flex items-center gap-3">
              {/* Glowing Lightbulb Toggle */}
              <button
                type="button"
                onClick={() => setRevealAnswer(!revealAnswer)}
                className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group/bulb ${
                  revealAnswer
                    ? 'bg-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.7),0_0_30px_rgba(250,204,21,0.4)]'
                    : 'bg-gray-600 hover:bg-gray-500 shadow-[0_0_5px_rgba(255,255,255,0.1)]'
                }`}
                title={revealAnswer ? 'Hide answer' : 'Reveal answer'}
              >
                {/* Bulb icon */}
                <svg
                  className={`w-5 h-5 transition-colors duration-300 ${
                    revealAnswer ? 'text-yellow-900' : 'text-gray-300 group-hover/bulb:text-yellow-300'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.87-3.13-7-7-7zM9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-3c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/>
                  {/* Filament glow rays */}
                  {revealAnswer && (
                    <>
                      <path d="M8 7.5c0-.83.67-1.5 1.5-1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.5"/>
                      <path d="M7 10c0-.55.45-1 1-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.4"/>
                      <path d="M16.5 6c.83 0 1.5.67 1.5 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.5"/>
                      <path d="M16 10c.55 0 1 .45 1 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.4"/>
                    </>
                  )}
                </svg>
              </button>
              {hasAnswer && (
                <div className={`text-2xl font-bold font-hand animate-dust ${isCorrect ? 'text-chalk-green' : 'text-chalk-red'}`}>
                  {isCorrect ? '✓ Good!' : '✗ Try again'}
                </div>
              )}
            </div>
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

          {/* Feedback (The "Teacher's Note") - shown when user answered OR lightbulb toggled */}
          {(hasAnswer || revealAnswer) && (
            <div className={`mt-8 p-4 border-2 border-dashed rounded relative animate-dust ${
              revealAnswer && !hasAnswer
                ? 'border-chalk-yellow/40 bg-chalk-yellow/5'
                : isCorrect ? 'border-chalk-green/30 bg-chalk-green/5' : 'border-chalk-red/30 bg-chalk-red/5'
            }`}>
               <span className="absolute -top-3 left-4 bg-chalk-board px-2 text-sm text-chalk-gray uppercase tracking-widest">
                 {revealAnswer && !hasAnswer ? 'Reference Answer' : 'Answer Key'}
               </span>
               <div className="mt-2 text-lg">
                 <span className="text-chalk-gray mr-2">Correct Answer:</span>
                 <span className={`font-bold text-xl ${
                   revealAnswer && !hasAnswer
                     ? 'text-chalk-yellow'
                     : isCorrect ? 'text-chalk-green' : 'text-chalk-white'
                 }`}>
                    {correctAnswerText}
                 </span>
               </div>
            </div>
          )}
       </div>
    </div>
  );
};