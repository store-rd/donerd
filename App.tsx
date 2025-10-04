import React, { useState, useEffect, useCallback } from 'react';
import { Movie, Game, Activity, View, ContentType } from './types';
import { ContentCard } from './components/ContentCard';
import { AdminModal } from './components/AdminModal';
import { ContentModal } from './components/AddContentModal';
import { ActivityLogView } from './components/ActivityLogView';
import { MovieIcon, GameIcon, LogIcon, LockIcon, UnlockIcon, PlusIcon, TrophyIcon } from './components/Icons';
import { ConfirmationModal } from './components/ConfirmationModal';
import { Toast } from './components/Toast';

const ADMIN_PASSWORD = "admin";

const initialMovies: Movie[] = [
  { id: 'm1', title: 'Dune: Part Two', description: 'يتبع بول أتريديز وهو يتحد مع تشاني والفremen بينما يسعى للانتقام من المتآمرين الذين دمروا عائلته.', imageUrl: 'https://picsum.photos/seed/dune2/400/600', category: 'خيال علمي' },
  { id: 'm2', title: 'Inception', description: 'لص يسرق معلومات الشركات باستخدام تكنولوجيا مشاركة الأحلام، يُعطى مهمة عكسية بزرع فكرة في عقل مدير تنفيذي.', imageUrl: 'https://picsum.photos/seed/inception/400/600', category: 'أكشن' },
  { id: 'm3', title: 'The Godfather', description: 'بطريرك مسن لعائلة مافيا إجرامية ينقل السيطرة على إمبراطوريته السرية إلى ابنه المتردد.', imageUrl: 'https://picsum.photos/seed/godfather/400/600', category: 'دراما' },
  { id: 'm4', title: 'Interstellar', description: 'يجب على فريق من المستكشفين السفر عبر ثقب دودي في الفضاء في محاولة لضمان بقاء البشرية.', imageUrl: 'https://picsum.photos/seed/interstellar/400/600', category: 'مغامرة' },
];

const initialGames: Game[] = [
  { id: 'g1', title: 'Baldur\'s Gate 3', description: 'لعبة تقمص أدوار من الجيل التالي تدور أحداثها في عالم Dungeons and Dragons، وتتميز بقصة غنية تعتمد على اختيارات اللاعب.', imageUrl: 'https://picsum.photos/seed/bg3/400/600', category: 'قصة غنية' },
  { id: 'g2', title: 'It Takes Two', description: 'انطلق في أروع رحلة في حياتك في هذه اللعبة المصممة خصيصًا للعب التعاوني، حيث تلعب كزوجين متصادمين تحولا إلى دمى.', imageUrl: 'https://picsum.photos/seed/ittakestwo/400/600', category: 'تعاوني' },
  { id: 'g3', title: 'Elden Ring', description: 'لعبة تقمص أدوار وحركة ملحمية تدور أحداثها في عالم خيالي شاسع مليء بالغموض والخطر.', imageUrl: 'https://picsum.photos/seed/eldenring/400/600', category: 'عالم مفتوح' },
  { id: 'g4', title: 'Stardew Valley', description: 'لعبة محاكاة زراعية مريحة حيث يمكنك بناء حياة جديدة في الريف، والتعرف على السكان المحليين، وتكوين أسرة.', imageUrl: 'https://picsum.photos/seed/stardew/400/600', category: 'محاكاة' },
];

const motivationalQuotes = [
    "عمل رائع!",
    "أنت الأفضل!",
    "إنجاز جديد!",
    "استمر في التقدم!",
    "مذهل!",
    "إلى الأمام!",
];

const App: React.FC = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [games, setGames] = useState<Game[]>([]);
    const [activityLog, setActivityLog] = useState<Activity[]>([]);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [currentView, setCurrentView] = useState<View>(View.Movies);
    const [showAdminModal, setShowAdminModal] = useState<boolean>(false);
    const [showContentModal, setShowContentModal] = useState<boolean>(false);
    const [editingItem, setEditingItem] = useState<Movie | Game | null>(null);
    const [loginError, setLoginError] = useState<string | null>(null);
    const [completingIds, setCompletingIds] = useState<Set<string>>(new Set());
    const [itemToConfirm, setItemToConfirm] = useState<{id: string; title: string; action: 'شاهد' | 'لعب'} | null>(null);
    const [toast, setToast] = useState<string | null>(null);


    useEffect(() => {
        const storedMovies = localStorage.getItem('movies');
        setMovies(storedMovies ? JSON.parse(storedMovies) : initialMovies);
        
        const storedGames = localStorage.getItem('games');
        setGames(storedGames ? JSON.parse(storedGames) : initialGames);

        const storedLog = localStorage.getItem('activityLog');
        setActivityLog(storedLog ? JSON.parse(storedLog) : []);
    }, []);

    useEffect(() => { localStorage.setItem('movies', JSON.stringify(movies)); }, [movies]);
    useEffect(() => { localStorage.setItem('games', JSON.stringify(games)); }, [games]);
    useEffect(() => { localStorage.setItem('activityLog', JSON.stringify(activityLog)); }, [activityLog]);
    
    const handleLogin = (password: string) => {
        if (password === ADMIN_PASSWORD) {
            setIsAdmin(true);
            setShowAdminModal(false);
            setLoginError(null);
        } else {
            setLoginError("كلمة المرور غير صحيحة. يرجى المحاولة مرة أخرى.");
        }
    };

    const handleLogout = () => setIsAdmin(false);

    const showToast = () => {
        const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
        setToast(randomQuote);
    };

    const completeTask = useCallback((id: string, title: string, action: 'شاهد' | 'لعب') => {
        setCompletingIds(prev => new Set(prev).add(id));
        showToast();

        setTimeout(() => {
            const newActivity: Activity = {
                id: crypto.randomUUID(),
                contentTitle: title,
                action,
                timestamp: new Date().toISOString()
            };
            setActivityLog(prev => [newActivity, ...prev]);

            if (action === 'شاهد') {
                setMovies(prev => prev.filter(m => m.id !== id));
            } else {
                setGames(prev => prev.filter(g => g.id !== id));
            }
            
            setCompletingIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(id);
                return newSet;
            });
        }, 1000); // Animation duration
    }, []);
    
    const handleRequestCompletion = (id: string, title: string) => {
        const action = currentView === View.Movies ? 'شاهد' : 'لعب';
        setItemToConfirm({ id, title, action });
    };

    const handleConfirmCompletion = () => {
        if (itemToConfirm) {
            completeTask(itemToConfirm.id, itemToConfirm.title, itemToConfirm.action);
            setItemToConfirm(null);
        }
    };
    
    const handleDeleteActivity = (id: string) => {
        setActivityLog(prev => prev.filter(activity => activity.id !== id));
    };

    const handleSaveContent = (item: Omit<Movie, 'id'> | Omit<Game, 'id'>, id?: string) => {
        if (id) { // Editing existing item
            if (currentView === View.Movies) {
                setMovies(prev => prev.map(m => m.id === id ? { ...item, id } as Movie : m));
            } else {
                setGames(prev => prev.map(g => g.id === id ? { ...item, id } as Game : g));
            }
        } else { // Adding new item
            const newItem = { ...item, id: crypto.randomUUID() };
            if (currentView === View.Movies) {
                setMovies(prev => [...prev, newItem as Movie]);
            } else {
                setGames(prev => [...prev, newItem as Game]);
            }
        }
        setEditingItem(null);
    };

    const handleDeleteContent = (id: string) => {
        if (currentView === View.Movies) {
            setMovies(prev => prev.filter(m => m.id !== id));
        } else {
            setGames(prev => prev.filter(g => g.id !== id));
        }
    };
    
    const openAddModal = () => {
        setEditingItem(null);
        setShowContentModal(true);
    };

    const openEditModal = (item: Movie | Game) => {
        setEditingItem(item);
        setShowContentModal(true);
    };

    const renderEmptyState = (type: string) => (
        <div className="text-center py-20 bg-slate-800/50 rounded-2xl border border-slate-700">
            <h3 className="text-2xl font-bold text-slate-300">قائمتك فارغة!</h3>
            <p className="text-slate-400 mt-2">لا يوجد شيء هنا بعد. لم لا تبدأ بإضافة بعض الـ{type}؟</p>
            {isAdmin && (
                 <button onClick={openAddModal} className="mt-6 flex items-center gap-2 bg-cyan-500 text-white font-semibold py-2 px-5 rounded-lg hover:bg-cyan-600 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-500/20 mx-auto">
                    <PlusIcon /> إضافة {type}
                </button>
            )}
        </div>
    );

    const renderContent = () => {
        switch (currentView) {
            case View.Movies:
                if (movies.length === 0) return renderEmptyState('أفلام');
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {movies.map(movie => (
                            <ContentCard 
                                key={movie.id} 
                                item={movie} 
                                actionText="إنهاء المشاهدة" 
                                onAction={handleRequestCompletion} 
                                onDelete={handleDeleteContent} 
                                onEdit={openEditModal} 
                                isAdmin={isAdmin} 
                                isCompleting={completingIds.has(movie.id)}
                            />
                        ))}
                    </div>
                );
            case View.Games:
                if (games.length === 0) return renderEmptyState('ألعاب');
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {games.map(game => (
                            <ContentCard 
                                key={game.id} 
                                item={game} 
                                actionText="إنهاء اللعب" 
                                onAction={handleRequestCompletion} 
                                onDelete={handleDeleteContent} 
                                onEdit={openEditModal} 
                                isAdmin={isAdmin}
                                isCompleting={completingIds.has(game.id)}
                            />
                        ))}
                    </div>
                );
            case View.Log:
                return <ActivityLogView activities={activityLog} onDelete={handleDeleteActivity} />;
            default:
                return null;
        }
    };
    
    const moviesWatched = activityLog.filter(a => a.action === 'شاهد').length;
    const gamesPlayed = activityLog.filter(a => a.action === 'لعب').length;

    const NavButton: React.FC<{ view: View; icon: React.ReactNode; label: string }> = ({ view, icon, label }) => (
        <button onClick={() => setCurrentView(view)} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${currentView === view ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'}`}>
            {icon}
            <span className="font-semibold">{label}</span>
        </button>
    );

    return (
        <div className="flex h-screen bg-slate-900 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(56,189,248,0.3),rgba(255,255,255,0))]">
            {toast && <Toast message={toast} onClose={() => setToast(null)} />}
            {showAdminModal && <AdminModal onClose={() => setShowAdminModal(false)} onLogin={handleLogin} loginError={loginError} />}
            {showContentModal && <ContentModal onClose={() => setShowContentModal(false)} onSave={handleSaveContent} contentType={currentView === View.Movies ? ContentType.Movie : ContentType.Game} editingItem={editingItem} />}
            <ConfirmationModal 
                isOpen={!!itemToConfirm}
                onClose={() => setItemToConfirm(null)}
                onConfirm={handleConfirmCompletion}
                title="تأكيد الإنجاز"
                message={`هل أنت متأكد من أنك تريد وضع علامة على "${itemToConfirm?.title}" كمكتمل؟`}
            />

            <nav className="w-64 bg-slate-800/30 p-5 flex flex-col border-l border-slate-700/50">
                <h1 className="text-2xl font-bold text-white mb-10">مركز الترفيه</h1>
                <div className="space-y-4">
                    <NavButton view={View.Movies} icon={<MovieIcon />} label="قائمة المشاهدة" />
                    <NavButton view={View.Games} icon={<GameIcon />} label="قائمة الألعاب" />
                    <NavButton view={View.Log} icon={<LogIcon />} label="السجل" />
                </div>
                 <div className="my-8 border-t border-slate-700/50 pt-6">
                    <h3 className="text-lg font-semibold text-cyan-400 mb-4 flex items-center gap-2">
                        <TrophyIcon />
                        إحصائيات الإنجاز
                    </h3>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-center text-slate-300">
                            <span>أفلام تمت مشاهدتها:</span>
                            <span className="font-bold text-white bg-purple-500/20 px-2 py-1 rounded">{moviesWatched}</span>
                        </div>
                        <div className="flex justify-between items-center text-slate-300">
                            <span>ألعاب تم لعبها:</span>
                            <span className="font-bold text-white bg-green-500/20 px-2 py-1 rounded">{gamesPlayed}</span>
                        </div>
                    </div>
                </div>
                <div className="mt-auto">
                    {isAdmin ? (
                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/40 hover:text-red-300 transition-colors">
                            <UnlockIcon /> <span className="font-semibold">إغلاق وضع المسؤول</span>
                        </button>
                    ) : (
                        <button onClick={() => { setLoginError(null); setShowAdminModal(true); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition-colors">
                            <LockIcon /> <span className="font-semibold">دخول المسؤول</span>
                        </button>
                    )}
                </div>
            </nav>

            <main className="flex-1 p-8 overflow-y-auto">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-500">
                      {currentView === View.Movies && 'قائمة مشاهدة الأفلام'}
                      {currentView === View.Games && 'قائمة تشغيل الألعاب'}
                      {currentView === View.Log && 'سجل النشاط'}
                    </h2>
                    {isAdmin && (currentView === View.Movies || currentView === View.Games) && movies.length > 0 && games.length > 0 && (
                        <button onClick={openAddModal} className="flex items-center gap-2 bg-cyan-500 text-white font-semibold py-2 px-5 rounded-lg hover:bg-cyan-600 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-500/20">
                            <PlusIcon /> إضافة جديد
                        </button>
                    )}
                </div>
                {renderContent()}
            </main>
        </div>
    );
};

export default App;