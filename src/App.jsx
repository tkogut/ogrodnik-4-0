import React, { useState, useEffect } from 'react';
import { 
  Sprout, 
  Droplets, 
  AlertOctagon, 
  Calendar as CalendarIcon, 
  Info, 
  Download, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  X,
  Plus
} from 'lucide-react';

const START_DATE = new Date(2026, 5, 25); // June 25, 2026
const END_DATE = new Date(2026, 7, 31);   // August 31, 2026

const TASKS = {
  0: {
    dayName: 'Niedziela',
    category: 'Ochrona / Wapń',
    preparat: 'Saletra Wapniowa',
    dawkowanie: '15 g/l (1.5%)',
    metoda: 'Oprysk Dolistny',
    cel: 'Rutynowa ochrona pomidorów przed suchą zgnilizną wierzchołkową.',
    desc: 'Zabieg dolistny zapobiegający suchej zgniliźnie wierzchołkowej. Wykonywać wieczorem, przy niskim nasłonecznieniu.',
    color: 'from-emerald-500 to-teal-600',
    accentColor: '#10b981'
  },
  1: {
    dayName: 'Poniedziałek',
    category: 'Wegetacja / Wzrost',
    preparat: 'Kristalon Zielony (18-18-18)',
    dawkowanie: '1.5 - 2 g/l',
    metoda: 'Fertygacja',
    cel: 'Korzeniowe, ogórki, fasola. Budowa masy liściowej.',
    desc: 'Zrównoważony nawóz NPK z mikroelementami. Stymuluje wzrost wegetatywny i budowę silnych liści.',
    color: 'from-green-500 to-emerald-600',
    accentColor: '#22c55e'
  },
  2: {
    dayName: 'Wtorek',
    category: 'Odbudowa / Wapń',
    preparat: 'Saletra Wapniowa',
    dawkowanie: '1.5 - 2 g/l',
    metoda: 'Fertygacja doglebowa',
    cel: 'Papryka i pomidory. Uzupełnienie niedoborów wapnia.',
    desc: 'Doglebowe dostarczenie szybko przyswajalnego wapnia. Zapobiega chorobom fizjologicznym owoców.',
    color: 'from-amber-500 to-yellow-600',
    accentColor: '#f59e0b',
    isTuesday: true
  },
  3: {
    dayName: 'Środa',
    category: 'Kwitnienie / Owocowanie',
    preparat: 'Kristalon Czerwony (12-12-36)',
    dawkowanie: '1.5 - 2 g/l',
    metoda: 'Fertygacja',
    cel: 'Kluczowe dla zawiązania i wzrostu owoców (papryka, pomidor).',
    desc: 'Nawóz o wysokiej zawartości potasu. Wspomaga formowanie pąków kwiatowych, zawiązywanie i dojrzewanie owoców.',
    color: 'from-rose-500 to-pink-600',
    accentColor: '#f43f5e'
  },
  4: {
    dayName: 'Czwartek',
    category: 'Interwencja / Magnez',
    preparat: 'Siarczan Magnezu',
    dawkowanie: '20 g/l (2%)',
    metoda: 'Oprysk Dolistny',
    cel: 'Odbudowa chlorofilu. Jeśli liście są zielone - można pominąć.',
    desc: 'Szybkie uzupełnienie magnezu i siarki. Zapobiega chlorozie międzyżyłkowej starszych liści.',
    color: 'from-blue-500 to-indigo-600',
    accentColor: '#3b82f6'
  },
  5: {
    dayName: 'Piątek',
    category: 'Wzmocnienie',
    preparat: 'Kristalon Pomarańczowy (6-12-36)',
    dawkowanie: '1.5 - 2 g/l',
    metoda: 'Fertygacja ogólna',
    cel: 'Wzmacnianie systemu korzeniowego bez pędzenia azotem. Cały ogród.',
    desc: 'Bogaty w potas i fosfor, wspomaga rozwój korzeni oraz przygotowuje rośliny do obfitego plonowania.',
    color: 'from-orange-500 to-amber-600',
    accentColor: '#f97316'
  },
  6: {
    dayName: 'Sobota',
    category: 'Ochrona (Eko) / Cięcie',
    preparat: 'Wywar ze Skrzypu',
    dawkowanie: '10g / 10l',
    metoda: 'Oprysk / Pielęgnacja',
    cel: 'Prewencja przeciwgrzybicza, usuwanie wilków u pomidorów.',
    desc: 'Naturalny preparat wzmacniający ścianki komórkowe krzemionką. Zapobiega mączniakowi i szarej pleśni.',
    color: 'from-teal-500 to-green-600',
    accentColor: '#14b8a6'
  }
};

export default function App() {
  // Get date state (allows simulation)
  const [currentDate, setCurrentDate] = useState(() => {
    // If today is outside active range, mock to first active day for demonstration
    const now = new Date();
    const startCompare = new Date(2026, 5, 25);
    const endCompare = new Date(2026, 7, 31);
    
    // Check if current year/date fits. If not, default simulation to start of fertilization period (2026-06-25)
    if (now >= startCompare && now <= endCompare) {
      return now;
    }
    return new Date(2026, 5, 25); // 2026-06-25 is a Thursday
  });

  const [realDate] = useState(() => new Date());
  const [tuesdayAcknowledged, setTuesdayAcknowledged] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallGuide, setShowInstallGuide] = useState(false);
  const [notification, setNotification] = useState(null);

  // Check if current date is inside active window
  const isDateValid = (date) => {
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const start = new Date(START_DATE.getFullYear(), START_DATE.getMonth(), START_DATE.getDate());
    const end = new Date(END_DATE.getFullYear(), END_DATE.getMonth(), END_DATE.getDate());
    return d >= start && d <= end;
  };

  const getWeekDay = (date) => {
    return date.getDay(); // 0 = Sunday, 6 = Saturday
  };

  const getTaskForDate = (date) => {
    const day = getWeekDay(date);
    return TASKS[day];
  };

  // Reset Tuesday acknowledgement when date changes
  useEffect(() => {
    setTuesdayAcknowledged(false);
  }, [currentDate]);

  // Handle PWA installation
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      showToast('Aplikacja gotowa do dodania na ekran główny!');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        showToast('Dziękujemy za instalację!');
      }
    } else {
      setShowInstallGuide(true);
    }
  };

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const formatDateString = (date) => {
    const days = ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'];
    const months = ['stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca', 'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia'];
    return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const shiftDate = (days) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    setCurrentDate(newDate);
  };

  const handleDateInput = (e) => {
    if (e.target.value) {
      const [year, month, day] = e.target.value.split('-').map(Number);
      setCurrentDate(new Date(year, month - 1, day));
    }
  };

  const activeTask = getTaskForDate(currentDate);
  const isValid = isDateValid(currentDate);
  const isTodayTuesday = getWeekDay(currentDate) === 2;

  // Generate 3 future days preview
  const getUpcomingDays = () => {
    const list = [];
    for (let i = 1; i <= 3; i++) {
      const d = new Date(currentDate);
      d.setDate(d.getDate() + i);
      list.push({
        date: d,
        task: getTaskForDate(d),
        valid: isDateValid(d)
      });
    }
    return list;
  };

  const upcomingDays = getUpcomingDays();

  // Format date to YYYY-MM-DD for input
  const dateToInputValue = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  return (
    <div className="max-w-md mx-auto px-4 py-6 flex flex-col min-h-screen justify-between gap-6 pb-20 select-none">
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 glass-card px-4 py-3 rounded-xl border-eco-primary shadow-glow flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-eco-primary" />
          <span className="text-sm font-mono text-eco-text">{notification}</span>
        </div>
      )}

      {/* Header */}
      <header className="flex flex-col items-center gap-2 text-center mt-2">
        <div className="relative p-3 bg-eco-surface rounded-full border border-eco-primary/20 glow-glow">
          <Sprout className="w-8 h-8 text-eco-primary animate-pulse" />
          <div className="absolute inset-0 bg-eco-primary/10 blur-xl rounded-full"></div>
        </div>
        <div>
          <h1 className="text-xl tracking-tight text-eco-text font-sans font-extrabold uppercase">
            Ogrodnik <span className="text-eco-primary text-glow">4.0</span>
          </h1>
          <p className="text-xs font-mono text-eco-secondary/80 mt-0.5 tracking-widest">
            ASYSTENT NAWOŻENIA
          </p>
        </div>
      </header>

      {/* Main Info Section */}
      <main className="flex flex-col gap-5 flex-grow">
        
        {/* System Date Alert Banner (if outside active range) */}
        {!isDateValid(realDate) && (
          <div className="glass-card border-amber-500/30 p-3 rounded-xl flex flex-col gap-2">
            <div className="flex items-start gap-2.5">
              <Info className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
              <div className="flex-1">
                <h3 className="text-xs font-mono text-amber-300 font-bold uppercase">
                  Poza Okresem Aktywności
                </h3>
                <p className="text-[11px] font-mono text-eco-text/70 leading-relaxed mt-0.5">
                  Baza zadań obowiązuje od <strong className="text-eco-text">2026-06-25</strong> do <strong className="text-eco-text">2026-08-31</strong>. Poniżej włączono tryb symulacji daty.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Date Controller (Interactive Simulation) */}
        <section className="glass-card p-4 rounded-2xl flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-mono text-eco-secondary/70 tracking-wider">SYMULOWANY CZAS</span>
            {currentDate.getFullYear() !== 2026 && (
              <span className="text-[10px] bg-eco-alert/20 text-eco-alert border border-eco-alert/30 px-1.5 py-0.5 rounded font-mono">
                Rok {currentDate.getFullYear()}!
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => shiftDate(-1)} 
              className="p-2.5 bg-eco-surface border border-eco-primary/10 rounded-xl active:bg-eco-primary/20 transition-all font-bold"
              aria-label="Poprzedni dzień"
            >
              &larr;
            </button>
            <div className="flex-1 relative">
              <input 
                type="date"
                value={dateToInputValue(currentDate)}
                onChange={handleDateInput}
                className="w-full bg-eco-surface/50 border border-eco-primary/25 rounded-xl px-3 py-2 text-center text-sm font-mono text-eco-text focus:outline-none focus:border-eco-primary transition-all appearance-none"
              />
            </div>
            <button 
              onClick={() => shiftDate(1)} 
              className="p-2.5 bg-eco-surface border border-eco-primary/10 rounded-xl active:bg-eco-primary/20 transition-all font-bold"
              aria-label="Następny dzień"
            >
              &rarr;
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5 justify-center mt-1">
            <button 
              onClick={() => setCurrentDate(new Date(2026, 5, 25))} 
              className="text-[10px] font-mono bg-eco-surface border border-eco-primary/15 px-2.5 py-1 rounded-lg hover:border-eco-primary active:bg-eco-primary/10"
            >
              25.06 (Start)
            </button>
            <button 
              onClick={() => setCurrentDate(new Date(2026, 6, 7))} 
              className="text-[10px] font-mono bg-eco-surface border border-eco-alert/35 px-2.5 py-1 rounded-lg text-eco-alert hover:border-eco-alert active:bg-eco-alert/10"
            >
              07.07 (Wtorek)
            </button>
            <button 
              onClick={() => setCurrentDate(new Date(2026, 7, 31))} 
              className="text-[10px] font-mono bg-eco-surface border border-eco-primary/15 px-2.5 py-1 rounded-lg hover:border-eco-primary active:bg-eco-primary/10"
            >
              31.08 (Koniec)
            </button>
            <button 
              onClick={() => setCurrentDate(new Date())} 
              className="text-[10px] font-mono bg-eco-surface border border-eco-secondary/25 px-2.5 py-1 rounded-lg text-eco-secondary flex items-center gap-1 hover:border-eco-secondary active:bg-eco-secondary/10"
            >
              <RefreshCw className="w-2.5 h-2.5" /> Dziś
            </button>
          </div>

          <div className="text-center mt-0.5">
            <span className="text-[11px] font-mono text-eco-text/90 bg-eco-surface/80 px-3 py-1 rounded-full border border-eco-primary/10">
              {formatDateString(currentDate)}
            </span>
          </div>
        </section>

        {/* Invalid Window Cover Screen */}
        {!isValid ? (
          <div className="glass-card border-eco-alert/25 p-6 rounded-2xl flex flex-col items-center justify-center text-center gap-4 py-10 my-4">
            <div className="w-12 h-12 rounded-full bg-eco-alert/15 border border-eco-alert/30 flex items-center justify-center glow-alert-glow">
              <AlertOctagon className="w-6 h-6 text-eco-alert" />
            </div>
            <div>
              <h2 className="text-lg font-mono text-eco-alert font-bold uppercase">Brak zadań w tym dniu</h2>
              <p className="text-xs font-mono text-eco-text/70 leading-relaxed mt-2">
                Harmonogram nawożenia lato 2026 nie obejmuje wybranej daty. 
                Program nawożenia działa wyłącznie od 25 czerwca do 31 sierpnia 2026 r.
              </p>
            </div>
            <button
              onClick={() => setCurrentDate(new Date(2026, 5, 25))}
              className="px-4 py-2 bg-eco-surface border border-eco-primary/20 text-eco-primary text-xs font-mono rounded-xl hover:bg-eco-primary/10 transition-all"
            >
              Przejdź do 25.06.2026
            </button>
          </div>
        ) : (
          <>
            {/* Tuesday Warning Box (If active task is Tuesday) */}
            {isTodayTuesday && (
              <div className={`glass-card-alert p-4 rounded-2xl glow-alert-glow border-eco-alert flex flex-col gap-3 relative transition-all duration-300 ${tuesdayAcknowledged ? 'opacity-85 border-amber-600/50 glow-glow' : 'animate-pulse'}`}>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-eco-alert/20 rounded-xl border border-eco-alert/40 shrink-0">
                    <AlertTriangle className="w-6 h-6 text-eco-alert" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-sm font-sans font-extrabold text-eco-alert tracking-wide uppercase">
                      KRYTYCZNE OSTRZEŻENIE CHEMICZNE
                    </h2>
                    <p className="text-xs font-mono text-white/90 leading-relaxed mt-1">
                      Dziś podawana jest <strong>Saletra Wapniowa</strong>. 
                      <span className="text-eco-alert font-bold block mt-1 uppercase">
                        BEZWZGLĘDNY ZAKAZ MIESZANIA Z MAGNEZEM (MG) LUB FOSFOREM (P) W JEDNYM ZBIORNIKU!
                      </span>
                      Zignorowanie zakazu spowoduje wytrącenie gipsu/osadu i zablokowanie instalacji nawadniającej.
                    </p>
                  </div>
                </div>

                <label className="flex items-center gap-3 bg-black/40 p-2.5 rounded-xl border border-white/10 cursor-pointer active:scale-95 transition-all">
                  <input
                    type="checkbox"
                    checked={tuesdayAcknowledged}
                    onChange={(e) => setTuesdayAcknowledged(e.target.checked)}
                    className="w-5 h-5 rounded border-white/20 text-eco-alert focus:ring-0 focus:ring-offset-0 bg-transparent rounded-md cursor-pointer"
                  />
                  <span className="text-[11px] font-mono text-white select-none">
                    Rozumiem i potwierdzam bezpieczeństwo
                  </span>
                </label>
              </div>
            )}

            {/* Today's Fertilizer Card */}
            <section className={`glass-card rounded-3xl p-5 flex flex-col gap-4 relative overflow-hidden transition-all duration-500 border-l-4 ${activeTask.isTuesday ? 'border-l-amber-500' : 'border-l-eco-primary'}`}>
              <div className="absolute top-0 right-0 w-24 h-24 bg-eco-primary/5 rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="flex justify-between items-start">
                <span className="text-[11px] font-mono bg-eco-primary/10 text-eco-primary border border-eco-primary/20 px-2.5 py-1 rounded-full font-bold uppercase">
                  DZIŚ: {activeTask.dayName}
                </span>
                <span className="text-[10px] font-mono text-eco-text/50">
                  Karta {currentDate.getDate()}/{currentDate.getMonth()+1}
                </span>
              </div>

              <div>
                <span className="text-[11px] font-mono text-eco-secondary tracking-wider uppercase block">
                  {activeTask.category}
                </span>
                <h2 className="text-xl font-sans font-extrabold text-eco-text mt-0.5 leading-snug">
                  {activeTask.preparat}
                </h2>
              </div>

              {/* Badges container */}
              <div className="grid grid-cols-2 gap-2 mt-1">
                <div className="bg-eco-surface/60 border border-eco-primary/10 p-2.5 rounded-xl flex flex-col gap-0.5">
                  <span className="text-[9px] font-mono text-eco-text/50 uppercase">Dawkowanie</span>
                  <span className="text-xs font-mono text-eco-text font-bold">{activeTask.dawkowanie}</span>
                </div>
                <div className="bg-eco-surface/60 border border-eco-primary/10 p-2.5 rounded-xl flex flex-col gap-0.5">
                  <span className="text-[9px] font-mono text-eco-text/50 uppercase">Metoda aplikacji</span>
                  <span className="text-xs font-mono text-eco-text font-bold flex items-center gap-1">
                    {activeTask.metoda.includes('Oprysk') ? <Sprout className="w-3 h-3 text-eco-secondary" /> : <Droplets className="w-3 h-3 text-eco-primary" />}
                    {activeTask.metoda}
                  </span>
                </div>
              </div>

              <div className="mt-1">
                <span className="text-[9px] font-mono text-eco-text/50 uppercase block">Cel zabiegu</span>
                <p className="text-xs font-mono text-eco-text/90 mt-0.5 leading-relaxed bg-eco-surface/40 p-2.5 rounded-xl border border-eco-primary/5">
                  {activeTask.cel}
                </p>
              </div>

              <div className="text-[11px] font-mono text-eco-text/60 leading-relaxed border-t border-eco-primary/10 pt-3">
                {activeTask.desc}
              </div>

              {activeTask.isTuesday && !tuesdayAcknowledged && (
                <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center gap-3">
                  <AlertOctagon className="w-10 h-10 text-eco-alert animate-bounce" />
                  <h3 className="text-sm font-sans font-extrabold text-white uppercase tracking-wider">
                    Karta Zablokowana
                  </h3>
                  <p className="text-[11px] font-mono text-white/80 max-w-[260px] leading-relaxed">
                    Zaakceptuj alert bezpieczeństwa u góry ekranu, aby odblokować dzisiejsze instrukcje nawożenia.
                  </p>
                </div>
              )}
            </section>
          </>
        )}

        {/* Schedule / Calendar (Next +3 Days) */}
        <section className="flex flex-col gap-2.5">
          <div className="flex items-center gap-1.5 px-1">
            <CalendarIcon className="w-4 h-4 text-eco-primary" />
            <h3 className="text-xs font-mono text-eco-secondary/80 font-bold uppercase tracking-wider">
              Harmonogram na kolejne 3 dni
            </h3>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {upcomingDays.map((item, idx) => {
              const dayOfWeek = item.date.getDay();
              const isTuesdayCard = dayOfWeek === 2;
              const formattedDate = `${String(item.date.getDate()).padStart(2, '0')}.${String(item.date.getMonth() + 1).padStart(2, '0')}`;
              
              let statusLabel = '';
              if (idx === 0) statusLabel = 'Jutro';
              else if (idx === 1) statusLabel = 'Pojutrze';
              else statusLabel = item.task.dayName.substring(0, 3) + '.';

              return (
                <div 
                  key={idx}
                  onClick={() => setCurrentDate(item.date)}
                  className={`glass-card p-3 rounded-xl flex flex-col justify-between gap-2 border-t-2 text-left active:scale-95 transition-all cursor-pointer relative overflow-hidden ${
                    isTuesdayCard ? 'border-t-eco-alert bg-eco-alert/5' : 'border-t-eco-primary hover:border-eco-primary/40'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-mono text-eco-primary font-bold">
                        {statusLabel}
                      </span>
                      <span className="text-[8px] font-mono text-eco-text/40">
                        {formattedDate}
                      </span>
                    </div>

                    <h4 className="text-[11px] font-sans font-extrabold text-eco-text mt-1 truncate">
                      {item.task.preparat.split(' ')[0]}
                    </h4>
                    
                    <span className="text-[9px] font-mono text-eco-secondary mt-0.5 block truncate">
                      {item.task.category.split(' / ')[0]}
                    </span>
                  </div>

                  <div className="flex justify-between items-center border-t border-eco-primary/5 pt-1.5 mt-1">
                    <span className="text-[8px] font-mono text-eco-text/50 truncate max-w-[50px]">
                      {item.task.dawkowanie.split(' ')[0]} {item.task.dawkowanie.split(' ')[1] || ''}
                    </span>
                    {isTuesdayCard ? (
                      <span className="w-1.5 h-1.5 bg-eco-alert rounded-full animate-ping"></span>
                    ) : (
                      item.task.metoda.includes('Oprysk') ? <Sprout className="w-2.5 h-2.5 text-eco-secondary" /> : <Droplets className="w-2.5 h-2.5 text-eco-primary" />
                    )}
                  </div>
                  
                  {!item.valid && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex items-center justify-center">
                      <span className="text-[8px] font-mono text-eco-alert font-bold bg-black/80 px-1 py-0.5 rounded border border-eco-alert/25 uppercase">
                        Koniec
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* PWA Install Banner */}
        <section className="glass-card p-3.5 rounded-2xl flex items-center justify-between border-eco-primary/20 glow-glow">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-eco-primary/10 rounded-xl border border-eco-primary/30 shrink-0">
              <Download className="w-5 h-5 text-eco-primary" />
            </div>
            <div>
              <h4 className="text-xs font-mono text-eco-text font-bold uppercase">Codzienny Asystent na Pulpicie</h4>
              <p className="text-[10px] font-mono text-eco-text/65 mt-0.5 leading-relaxed">
                Zainstaluj jako PWA, aby uzyskać szybki dostęp i pełny tryb offline.
              </p>
            </div>
          </div>
          <button
            onClick={handleInstallClick}
            className="px-3 py-1.5 bg-eco-primary hover:bg-eco-primary/80 active:scale-95 text-eco-bg text-[10px] font-mono font-bold rounded-lg transition-all shrink-0 ml-2"
          >
            DODAJ
          </button>
        </section>
      </main>

      {/* Footer */}
      <footer className="text-center">
        <p className="text-[9px] font-mono text-eco-text/40 tracking-wider">
          SYSTEM WERSJA 5.0 SWARM • VPS DOCKER READY
        </p>
      </footer>

      {/* PWA Install Guide Modal */}
      {showInstallGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-card max-w-xs w-full p-5 rounded-2xl border-eco-primary/30 flex flex-col gap-4 relative">
            <button 
              onClick={() => setShowInstallGuide(false)}
              className="absolute top-3 right-3 p-1 text-eco-text/50 hover:text-eco-text active:scale-90"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2">
              <Info className="w-5 h-5 text-eco-primary" />
              <h3 className="text-xs font-mono text-eco-text font-bold uppercase">Instrukcja PWA</h3>
            </div>

            <div className="text-[11px] font-mono text-eco-text/80 flex flex-col gap-3 leading-relaxed">
              <div>
                <p className="font-bold text-eco-secondary">🤖 URZĄDZENIA ANDROID (Chrome):</p>
                <ol className="list-decimal pl-4 mt-1 space-y-1">
                  <li>Kliknij menu z 3 kropkami <strong className="text-white">(⋮)</strong> w prawym górnym rogu.</li>
                  <li>Wybierz <strong className="text-white">Dodaj do ekranu głównego</strong> lub <strong className="text-white">Zainstaluj aplikację</strong>.</li>
                  <li>Zatwierdź klikając <strong className="text-white">Zainstaluj</strong>.</li>
                </ol>
              </div>
              
              <hr className="border-eco-primary/10" />

              <div>
                <p className="font-bold text-eco-secondary">🍎 URZĄDZENIA IOS (Safari):</p>
                <ol className="list-decimal pl-4 mt-1 space-y-1">
                  <li>Kliknij przycisk Udostępnij <strong className="text-white">(Share)</strong> na dole ekranu.</li>
                  <li>Przewiń w dół i wybierz <strong className="text-white">Do ekranu początkowego</strong>.</li>
                  <li>Zatwierdź klikając <strong className="text-white">Dodaj</strong> w prawym górnym rogu.</li>
                </ol>
              </div>
            </div>

            <button
              onClick={() => setShowInstallGuide(false)}
              className="w-full py-2 bg-eco-surface border border-eco-primary/30 text-eco-primary font-mono text-xs rounded-xl active:bg-eco-primary/10"
            >
              Zamknij
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
