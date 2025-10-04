import React from 'react';
import { Activity } from '../types';
import { GameIcon, MovieIcon, TrashIcon } from './Icons';

interface ActivityLogViewProps {
  activities: Activity[];
  onDelete: (id: string) => void;
}

const ActionIcon: React.FC<{ action: 'شاهد' | 'لعب' }> = ({ action }) => {
    if (action === 'شاهد') {
        return <MovieIcon className="w-5 h-5 text-purple-400" />;
    }
    return <GameIcon className="w-5 h-5 text-green-400" />;
};

export const ActivityLogView: React.FC<ActivityLogViewProps> = ({ activities, onDelete }) => {
  return (
    <div className="p-8">
      <h2 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-500">سجل النشاط المكتمل</h2>
      {activities.length === 0 ? (
        <div className="text-center py-16 bg-slate-800/50 rounded-2xl border border-slate-700">
          <p className="text-slate-400">لا توجد أنشطة مكتملة بعد.</p>
          <p className="text-slate-500 text-sm mt-2">أكمل مهمة من قائمة المشاهدة أو الألعاب لترى سجلها هنا!</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-4">
          {activities.map((activity) => (
            <div key={activity.id} className="group bg-slate-800/60 border border-slate-700 rounded-lg p-4 flex items-center justify-between hover:bg-slate-800 transition-colors duration-300">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-slate-700 rounded-full">
                    <ActionIcon action={activity.action} />
                </div>
                <div>
                  <p className="font-semibold text-white">
                    لقد {activity.action === 'شاهد' ? 'أنهيت مشاهدة' : 'أنهيت لعب'} "{activity.contentTitle}"
                  </p>
                  <p className="text-xs text-slate-400">{new Date(activity.timestamp).toLocaleString('ar')}</p>
                </div>
              </div>
              <button 
                onClick={() => onDelete(activity.id)} 
                className="text-slate-500 hover:text-red-400 transition-all opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100"
                aria-label="حذف السجل"
              >
                  <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};