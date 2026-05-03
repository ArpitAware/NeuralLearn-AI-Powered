import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus, X, Clock, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

const SAMPLE_EVENTS = {
  '2025-04-10': [{ id: 1, title: 'ML Live Session',       time: '6:00 PM', color: '#5b6af5', type: 'live'     }],
  '2025-04-15': [{ id: 2, title: 'Python Project Due',    time: '11:59 PM', color: '#ef4444', type: 'deadline' }],
  '2025-04-18': [{ id: 3, title: 'Data Structures Quiz',  time: '2:00 PM',  color: '#f59e0b', type: 'quiz'     }],
  '2025-04-22': [{ id: 4, title: 'Community AMA',         time: '7:00 PM',  color: '#06b6d4', type: 'event'    }],
  '2025-04-28': [{ id: 5, title: 'Office Hours',          time: '3:00 PM',  color: '#10b981', type: 'office'   }],
  '2025-05-02': [{ id: 6, title: 'React Deep Dive',       time: '5:00 PM',  color: '#5b6af5', type: 'live'     }],
  '2025-05-08': [{ id: 7, title: 'AWS Certification Exam',time: '9:00 AM',  color: '#ef4444', type: 'deadline' }],
};

const TYPE_STYLES = {
  live:     { bg: 'bg-accent/15',   border: 'border-accent/30',   text: 'text-accent'      },
  deadline: { bg: 'bg-red-500/15',  border: 'border-red-500/30',  text: 'text-red-400'     },
  quiz:     { bg: 'bg-amber-500/15',border: 'border-amber-500/30',text: 'text-amber-400'   },
  event:    { bg: 'bg-cyan-500/15', border: 'border-cyan-500/30', text: 'text-cyan-400'    },
  office:   { bg: 'bg-emerald-500/15',border:'border-emerald-500/30',text:'text-emerald-400'},
};

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalendarPage() {
  const today = new Date();
  const [current,   setCurrent]   = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [events,    setEvents]    = useState(SAMPLE_EVENTS);
  const [selected,  setSelected]  = useState(null);
  const [showForm,  setShowForm]  = useState(false);
  const [newEvent,  setNewEvent]  = useState({ title: '', time: '', type: 'event', date: '' });

  const year  = current.getFullYear();
  const month = current.getMonth();
  const firstDay     = new Date(year, month, 1).getDay();
  const daysInMonth  = new Date(year, month + 1, 0).getDate();
  const daysInPrev   = new Date(year, month,     0).getDate();
  const monthLabel   = current.toLocaleString('default', { month: 'long', year: 'numeric' });

  const prevMonth = () => setCurrent(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrent(new Date(year, month + 1, 1));

  const getKey = (d) =>
    `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

  const addEvent = () => {
    if (!newEvent.title || !newEvent.date) return;
    const ev = { id: Date.now(), title: newEvent.title, time: newEvent.time || 'All day', color: '#5b6af5', type: newEvent.type };
    setEvents(p => ({ ...p, [newEvent.date]: [...(p[newEvent.date] || []), ev] }));
    toast.success('Event added!');
    setShowForm(false);
    setNewEvent({ title: '', time: '', type: 'event', date: '' });
  };

  const removeEvent = (dateKey, id) => {
    setEvents(p => ({ ...p, [dateKey]: (p[dateKey] || []).filter(e => e.id !== id) }));
  };

  // Build calendar grid: prev-month padding + current month + next-month padding
  const cells = [];
  for (let i = 0; i < firstDay; i++) {
    cells.push({ day: daysInPrev - firstDay + i + 1, current: false, key: null });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, current: true, key: getKey(d) });
  }
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) {
    cells.push({ day: d, current: false, key: null });
  }

  const upcomingAll = Object.entries(events)
    .flatMap(([date, evs]) => evs.map(e => ({ ...e, date })))
    .filter(e => new Date(e.date) >= today)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 6);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-8">
      {/* CALENDAR */}
      <div className="lg:col-span-2 space-y-4">
        <div className="card p-6">
          {/* Nav */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-head font-bold text-xl">{monthLabel}</h2>
            <div className="flex gap-2">
              <button onClick={prevMonth} className="btn btn-ghost btn-sm btn-icon"><ChevronLeft size={16} /></button>
              <button onClick={() => setCurrent(new Date(today.getFullYear(), today.getMonth(), 1))} className="btn btn-ghost btn-sm">Today</button>
              <button onClick={nextMonth} className="btn btn-ghost btn-sm btn-icon"><ChevronRight size={16} /></button>
            </div>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-2">
            {DAY_NAMES.map(d => (
              <div key={d} className="text-center text-xs font-semibold text-white/30 py-2">{d}</div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 gap-1">
            {cells.map((cell, i) => {
              const eventsOnDay = cell.key ? (events[cell.key] || []) : [];
              const isToday = cell.current &&
                cell.day === today.getDate() &&
                month === today.getMonth() &&
                year === today.getFullYear();
              const isSelected = selected === cell.key;

              return (
                <motion.div
                  key={i}
                  whileHover={cell.current ? { scale: 1.05 } : {}}
                  onClick={() => cell.current && setSelected(isSelected ? null : cell.key)}
                  className={`
                    relative min-h-[52px] rounded-xl p-1.5 cursor-pointer transition-all duration-200
                    ${!cell.current ? 'opacity-20 pointer-events-none' : ''}
                    ${isToday ? 'bg-gradient-to-br from-accent to-accent2 shadow-[0_0_20px_rgba(91,106,245,0.35)]' : ''}
                    ${isSelected && !isToday ? 'bg-accent/10 border border-accent/30' : ''}
                    ${!isToday && !isSelected && cell.current ? 'hover:bg-white/[0.04]' : ''}
                  `}
                >
                  <span className={`text-xs font-semibold block text-center mb-1 ${isToday ? 'text-white' : 'text-white/70'}`}>
                    {cell.day}
                  </span>
                  <div className="space-y-0.5">
                    {eventsOnDay.slice(0, 2).map(e => (
                      <div
                        key={e.id}
                        className="w-full h-1 rounded-full"
                        style={{ background: e.color }}
                      />
                    ))}
                    {eventsOnDay.length > 2 && (
                      <div className="text-[9px] text-white/40 text-center">+{eventsOnDay.length - 2}</div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Selected day detail */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="card p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-head font-bold text-sm">
                  {new Date(selected).toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric' })}
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setNewEvent(p => ({ ...p, date: selected })); setShowForm(true); }}
                    className="btn btn-primary btn-sm"
                  >
                    <Plus size={13} /> Add Event
                  </button>
                  <button onClick={() => setSelected(null)} className="btn btn-ghost btn-sm btn-icon"><X size={14} /></button>
                </div>
              </div>
              {(events[selected] || []).length === 0 ? (
                <p className="text-white/30 text-sm text-center py-4">No events. Click "Add Event" to create one.</p>
              ) : (
                <div className="space-y-2">
                  {(events[selected] || []).map(e => {
                    const style = TYPE_STYLES[e.type] || TYPE_STYLES.event;
                    return (
                      <div key={e.id} className={`flex items-center gap-3 p-3 rounded-xl border ${style.bg} ${style.border}`}>
                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: e.color }} />
                        <div className="flex-1">
                          <p className={`text-sm font-semibold ${style.text}`}>{e.title}</p>
                          <p className="text-xs text-white/40 mt-0.5 flex items-center gap-1"><Clock size={10} />{e.time}</p>
                        </div>
                        <button onClick={() => removeEvent(selected, e.id)} className="text-white/20 hover:text-red-400 transition-colors"><X size={13} /></button>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add event form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="card p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-head font-bold text-sm">New Event</h3>
                <button onClick={() => setShowForm(false)} className="text-white/30 hover:text-white"><X size={15} /></button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <div className="sm:col-span-2">
                  <label className="label">Event Title</label>
                  <input className="input" placeholder="e.g. Study Session" value={newEvent.title} onChange={e => setNewEvent(p => ({ ...p, title: e.target.value }))} />
                </div>
                <div>
                  <label className="label">Date</label>
                  <input className="input" type="date" style={{ colorScheme: 'dark' }} value={newEvent.date} onChange={e => setNewEvent(p => ({ ...p, date: e.target.value }))} />
                </div>
                <div>
                  <label className="label">Time</label>
                  <input className="input" type="time" style={{ colorScheme: 'dark' }} value={newEvent.time} onChange={e => setNewEvent(p => ({ ...p, time: e.target.value }))} />
                </div>
                <div>
                  <label className="label">Type</label>
                  <select className="input" value={newEvent.type} onChange={e => setNewEvent(p => ({ ...p, type: e.target.value }))} style={{ appearance: 'none' }}>
                    {Object.keys(TYPE_STYLES).map(t => (
                      <option key={t} value={t} style={{ background: '#0c0c18', textTransform: 'capitalize' }}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="btn btn-ghost flex-1 justify-center" onClick={() => setShowForm(false)}>Cancel</button>
                <button className="btn btn-primary flex-1 justify-center" onClick={addEvent} disabled={!newEvent.title || !newEvent.date}>Add Event</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* SIDEBAR */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-head font-bold text-sm">Upcoming Events</h3>
          <button onClick={() => setShowForm(true)} className="btn btn-primary btn-sm"><Plus size={13} /> Add</button>
        </div>

        <div className="space-y-2">
          {upcomingAll.length === 0 ? (
            <div className="card p-6 text-center">
              <Calendar size={28} className="text-white/20 mx-auto mb-2" />
              <p className="text-white/30 text-sm">No upcoming events</p>
            </div>
          ) : (
            upcomingAll.map((e, i) => {
              const style = TYPE_STYLES[e.type] || TYPE_STYLES.event;
              return (
                <motion.div
                  key={e.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className={`card p-4 border-l-2 ${style.border}`}
                  style={{ borderLeftColor: e.color }}
                >
                  <p className={`font-semibold text-sm mb-1 ${style.text}`}>{e.title}</p>
                  <div className="flex items-center gap-3 text-xs text-white/40">
                    <span>{new Date(e.date).toLocaleDateString('default', { month: 'short', day: 'numeric' })}</span>
                    <span className="flex items-center gap-1"><Clock size={10} />{e.time}</span>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Quick stats */}
        <div className="card p-5">
          <h3 className="font-head font-bold text-sm mb-4">This Month</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              ['Events', Object.values(events).flat().filter(e => {
                const d = Object.entries(events).find(([,evs]) => evs.includes(e))?.[0];
                return d && new Date(d).getMonth() === month;
              }).length],
              ['Upcoming', upcomingAll.length],
              ['Live Sessions', upcomingAll.filter(e => e.type === 'live').length],
              ['Deadlines', upcomingAll.filter(e => e.type === 'deadline').length],
            ].map(([l, v]) => (
              <div key={l} className="bg-white/[0.03] rounded-xl p-3 text-center">
                <p className="font-head font-black text-xl text-accent">{v}</p>
                <p className="text-[10px] text-white/30 mt-0.5">{l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="card p-5">
          <h3 className="font-head font-bold text-sm mb-3">Event Types</h3>
          <div className="space-y-2">
            {Object.entries(TYPE_STYLES).map(([type, style]) => (
              <div key={type} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-sm ${style.bg} border ${style.border}`} />
                <span className={`text-xs capitalize ${style.text}`}>{type}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
