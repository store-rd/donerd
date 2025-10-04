import React from 'react';
import { TrashIcon, PencilIcon, CheckIcon } from './Icons';
import { Movie, Game } from '../types';

interface ContentCardProps {
  item: Movie | Game;
  actionText: string;
  onAction: (id: string, title: string) => void;
  onDelete?: (id: string) => void;
  onEdit?: (item: Movie | Game) => void;
  isAdmin: boolean;
  isCompleting?: boolean;
}

export const ContentCard: React.FC<ContentCardProps> = ({ item, actionText, onAction, onDelete, onEdit, isAdmin, isCompleting }) => {
  const cardClasses = `
    group rounded-2xl overflow-hidden shadow-lg bg-slate-800/50 border border-slate-700/50 
    transition-all duration-1000 [transform-style:preserve-3d] hover:[transform:rotateY(-10deg)]
    ${isCompleting ? 'opacity-0 scale-95 [transform:rotateY(0deg)]' : 'opacity-100 scale-100'}
  `;

  return (
    <div className={cardClasses} style={{ perspective: '1000px' }}>
      <div className="relative">
        <img className="w-full h-96 object-cover transition-transform duration-500 group-hover:scale-110" src={item.imageUrl} alt={item.title} />
        
        {/* Completion Overlay */}
        <div className={`absolute inset-0 bg-green-500/80 backdrop-blur-sm flex justify-center items-center transition-opacity duration-500 ${isCompleting ? 'opacity-100' : 'opacity-0'}`}>
           <CheckIcon className="w-32 h-32 text-white" />
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0"></div>
        <div className="absolute top-3 left-3 flex gap-2 transition-all duration-300 scale-0 group-hover:scale-100 opacity-0 group-hover:opacity-100">
           {isAdmin && onEdit && (
             <button 
                onClick={() => onEdit(item)}
                className="bg-blue-600/80 hover:bg-blue-500 text-white rounded-full p-2 backdrop-blur-sm"
                aria-label="Edit item"
             >
                <PencilIcon className="w-5 h-5" />
             </button>
           )}
           {isAdmin && onDelete && (
             <button 
                onClick={() => onDelete(item.id)} 
                className="bg-red-600/80 hover:bg-red-500 text-white rounded-full p-2 backdrop-blur-sm"
                aria-label="Delete item"
             >
                <TrashIcon className="w-5 h-5" />
             </button>
           )}
        </div>
        <span className="absolute bottom-3 right-3 bg-cyan-500/80 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm">{item.category}</span>
      </div>
      <div className="p-5 flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
          <p className="text-slate-400 text-sm mb-4 line-clamp-3">{item.description}</p>
        </div>
        <div className="flex justify-between items-center mt-4">
            <span className="text-sm font-semibold text-cyan-400">{actionText}</span>
            <button 
              onClick={() => onAction(item.id, item.title)} 
              disabled={isCompleting}
              className="bg-cyan-500 text-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-cyan-600 transition-all duration-300 transform group-hover:scale-110 group-hover:shadow-[0_0_20px_theme(colors.cyan.500)] disabled:bg-slate-600 disabled:scale-100"
              aria-label={actionText}
            >
              <CheckIcon className="w-7 h-7"/>
            </button>
        </div>
      </div>
    </div>
  );
};