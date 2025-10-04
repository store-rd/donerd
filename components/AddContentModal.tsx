import React, { useState, useEffect } from 'react';
import { ContentType, Movie, Game } from '../types';
import { CloseIcon, PlusIcon, PencilIcon } from './Icons';

// A type for the data that can be saved, omitting the 'id'
type SaveableContent = Omit<Movie, 'id'> | Omit<Game, 'id'>;

interface ContentModalProps {
  onClose: () => void;
  onSave: (item: SaveableContent, id?: string) => void;
  contentType: ContentType;
  editingItem?: Movie | Game | null;
}

export const ContentModal: React.FC<ContentModalProps> = ({ onClose, onSave, contentType, editingItem }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState('');

  const isEditing = !!editingItem;

  useEffect(() => {
    if (isEditing) {
      setTitle(editingItem.title);
      setDescription(editingItem.description);
      setImageUrl(editingItem.imageUrl);
      setCategory(editingItem.category);
    }
  }, [editingItem, isEditing]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !imageUrl || !category) {
        alert("يرجى ملء جميع الحقول.");
        return;
    }
    onSave({ title, description, imageUrl, category }, editingItem?.id);
    onClose();
  };
  
  const modalTitle = isEditing ? `تعديل ${contentType}` : `إضافة ${contentType} جديد`;
  const submitButtonText = isEditing ? 'حفظ التغييرات' : `إضافة ${contentType}`;


  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl p-8 w-full max-w-lg m-4 transform transition-all duration-300 scale-95 hover:scale-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-cyan-400 flex items-center gap-3">
            {isEditing ? <PencilIcon /> : <PlusIcon />}
            {modalTitle}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <CloseIcon />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-2">العنوان</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all"
              placeholder={`أدخل عنوان الـ${contentType}`}
            />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-slate-300 mb-2">التصنيف</label>
            <input
              id="category"
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all"
              placeholder={`مثال: أكشن، مغامرة، تعاوني`}
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-2">الوصف</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all"
              placeholder={`أدخل وصف الـ${contentType}`}
            />
          </div>
          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-slate-300 mb-2">رابط الصورة</label>
            <input
              id="imageUrl"
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all"
              placeholder="https://picsum.photos/400/600"
            />
          </div>
          <div className="flex justify-end pt-4 gap-4">
             <button type="submit" className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-6 rounded-lg transition-transform duration-200 transform hover:scale-105">
                {submitButtonText}
            </button>
             <button type="button" onClick={onClose} className="bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-6 rounded-lg transition-colors">
                إلغاء
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};
