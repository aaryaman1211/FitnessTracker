import React, { useState, useEffect, useRef } from 'react';
import { PLAN, TYPE_COLORS, DAY_NAMES, DAY_NAMES_FULL } from './planData';

const STORAGE_KEY = 'training_log_v1';
const EDITS_KEY = 'training_edits_v1';

function useStorage(key, initial) {
  const [val, setVal] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : initial; }
    catch { return initial; }
  });
  const set = (v) => { setVal(v); try { localStorage.setItem(key, JSON.stringify(v)); } catch {} };
  return [val, set];
}

const tc = (type) => TYPE_COLORS[type] || TYPE_COLORS.rest;

function TypeBadge({ type, label, small }) {
  const c = tc(type);
  return (
    <span style={{
      display: 'inline-block',
      padding: small ? '2px 7px' : '3px 10px',
      borderRadius: 20,
      fontSize: small ? 10 : 11,
      fontWeight: 600,
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
      background: c.bg,
      color: c.color,
      border: `1px solid ${c.border}`,
      fontFamily: 'var(--font-mono)',
    }}>{label}</span>
  );
}

function ProgressRing({ pct, size = 36, stroke = 3, color = '#e8583a' }) {
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.4s ease' }} />
    </svg>
  );
}

// ── HOME SCREEN ─────────────────────────────────────────────────────────────
function HomeScreen({ log, setLog, edits, onOpenDay }) {
  const today = new Date();
  const totalSessions = PLAN.reduce((a, w) => a + w.days.filter(d => d.type !== 'rest').length, 0);
  const completedCount = Object.values(log).filter(v => v.done).length;
  const pct = Math.round((completedCount / totalSessions) * 100);

  // Find current week/day suggestion
  const startDate = log._startDate ? new Date(log._startDate) : null;
  let suggestWeek = 0, suggestDay = 0;
  if (startDate) {
    const diffDays = Math.floor((today - startDate) / 86400000);
    suggestWeek = Math.min(Math.floor(diffDays / 7), 7);
    suggestDay = diffDays % 7;
  }

  const streakDays = (() => {
    let streak = 0;
    const d = new Date(today);
    while (true) {
      const key = d.toISOString().split('T')[0];
      if (log[`date_${key}`]) { streak++; d.setDate(d.getDate() - 1); }
      else break;
    }
    return streak;
  })();

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 100px' }}>
      {/* Header */}
      <div style={{ paddingTop: 'calc(var(--safe-top) + 24px)', marginBottom: 32 }}>
        <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text2)', letterSpacing: '0.1em', marginBottom: 6 }}>
          {today.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' }).toUpperCase()}
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
          Aaryaman's<br />Training Plan
        </h1>
      </div>

      {/* Progress card */}
      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 16, padding: '20px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <ProgressRing pct={pct} size={64} stroke={4} color="#e8583a" />
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{pct}%</div>
        </div>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>{completedCount} <span style={{ color: 'var(--text2)', fontSize: 14, fontWeight: 400 }}>/ {totalSessions} sessions</span></div>
          <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 3 }}>8-week plan progress</div>
          {streakDays > 0 && <div style={{ fontSize: 11, color: '#e8a83a', marginTop: 4, fontFamily: 'var(--font-mono)' }}>{streakDays} day streak</div>}
        </div>
      </div>

      {/* Today's suggestion */}
      {!startDate && (
  <div style={{ marginBottom: 16 }}>
    <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text2)', letterSpacing: '0.08em', marginBottom: 8 }}>START PLAN</div>
    <div onClick={() => {
      const today = new Date().toISOString().split('T')[0];
      setLog({ ...log, _startDate: today });
    }} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14, padding: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div>
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Begin your plan today</div>
        <div style={{ fontSize: 12, color: 'var(--text2)' }}>Tap to set today as Day 1</div>
      </div>
      <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#e8583a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: '#fff' }}>→</div>
    </div>
  </div>
)}
{startDate && (
  <div style={{ marginBottom: 16 }}>
    <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text2)', letterSpacing: '0.08em', marginBottom: 8 }}>TODAY'S SESSION</div>
    <TodayCard week={suggestWeek} day={suggestDay} log={log} edits={edits} onPress={() => onOpenDay(suggestWeek, suggestDay)} />
  </div>
)}

      {/* Quick week overview */}
      <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text2)', letterSpacing: '0.08em', marginBottom: 8 }}>ALL WEEKS</div>
      {PLAN.map((week, wi) => {
        const weekDone = week.days.filter((d, di) => d.type !== 'rest' && log[`${wi}_${di}`]?.done).length;
        const weekTotal = week.days.filter(d => d.type !== 'rest').length;
        return (
          <div key={wi} onClick={() => onOpenDay(wi, 0)}
            style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: '14px 16px', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', active: { background: 'var(--bg3)' } }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--bg3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-mono)', flexShrink: 0 }}>W{wi + 1}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 3 }}>{week.phase}</div>
              <div style={{ height: 4, background: 'var(--bg4)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${weekTotal > 0 ? (weekDone / weekTotal) * 100 : 0}%`, background: '#e8583a', borderRadius: 2, transition: 'width 0.3s' }} />
              </div>
            </div>
            <div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--font-mono)', flexShrink: 0 }}>{weekDone}/{weekTotal}</div>
          </div>
        );
      })}
    </div>
  );
}

function TodayCard({ week, day, log, edits, onPress }) {
  const w = PLAN[week];
  const d = edits[`${week}_${day}`] || w.days[day];
  const done = log[`${week}_${day}`]?.done;
  const c = tc(d.type);
  return (
    <div onClick={onPress} style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: 14, padding: '16px', cursor: 'pointer' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <div>
          <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: c.color, letterSpacing: '0.06em', marginBottom: 4 }}>WEEK {week + 1} · {DAY_NAMES_FULL[day].toUpperCase()}</div>
          <div style={{ fontSize: 17, fontWeight: 700 }}>{d.title}</div>
        </div>
        {done && <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#5ac47a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>✓</div>}
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {d.distance && <StatPill label="Dist" val={d.distance} />}
        {d.pace && <StatPill label="Pace" val={d.pace} />}
        {d.hr && <StatPill label="HR" val={d.hr} />}
      </div>
    </div>
  );
}

function StatPill({ label, val }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 8, padding: '4px 9px', fontSize: 11 }}>
      <span style={{ color: 'var(--text2)', marginRight: 4 }}>{label}</span>
      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>{val}</span>
    </div>
  );
}

// ── PLAN SCREEN ─────────────────────────────────────────────────────────────
function PlanScreen({ initWeek, initDay, log, setLog, edits, setEdits }) {
  const [week, setWeek] = useState(initWeek || 0);
  const [day, setDay] = useState(initDay || 0);
  const [view, setView] = useState('week'); // 'week' | 'day'
  const [editing, setEditing] = useState(null); // field being edited
  const [editVal, setEditVal] = useState('');
  const [logModal, setLogModal] = useState(false);
  const [logData, setLogData] = useState({ pace: '', hr: '', notes: '' });

  useEffect(() => {
    if (initWeek !== undefined) { setWeek(initWeek); setDay(initDay || 0); setView('day'); }
  }, [initWeek, initDay]);

  const planDay = PLAN[week].days[day];
  const sessionData = edits[`${week}_${day}`] || planDay;
  const logEntry = log[`${week}_${day}`] || {};
  const done = logEntry.done;

  const markDone = () => {
    const today = new Date().toISOString().split('T')[0];
    const newLog = { ...log, [`${week}_${day}`]: { ...logEntry, done: !done, date: today }, [`date_${today}`]: true };
    if (!log._startDate) newLog._startDate = today;
    setLog(newLog);
    if (!done) setLogModal(true);
  };

  const saveEdit = (field) => {
    const key = `${week}_${day}`;
    const current = edits[key] || { ...PLAN[week].days[day] };
    setEdits({ ...edits, [key]: { ...current, [field]: editVal } });
    setEditing(null);
  };

  const saveLog = () => {
    const today = new Date().toISOString().split('T')[0];
    setLog({ ...log, [`${week}_${day}`]: { ...logEntry, done: true, date: today, ...logData } });
    setLogModal(false);
    setLogData({ pace: '', hr: '', notes: '' });
  };

  const c = tc(sessionData.type);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Week selector */}
      <div style={{ padding: '16px 20px 0', paddingTop: 'calc(var(--safe-top) + 16px)' }}>
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 12, scrollbarWidth: 'none' }}>
          {PLAN.map((w, wi) => (
            <button key={wi} onClick={() => { setWeek(wi); setDay(0); setView('week'); }}
              style={{ flexShrink: 0, padding: '5px 12px', borderRadius: 20, border: wi === week ? '1.5px solid #e8583a' : '1px solid var(--border)', background: wi === week ? 'rgba(232,88,58,0.15)' : 'transparent', color: wi === week ? '#e8583a' : 'var(--text2)', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-mono)' }}>
              W{wi + 1}
            </button>
          ))}
        </div>
        {/* Phase label */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ fontSize: 16, fontWeight: 700 }}>{PLAN[week].phase} <span style={{ fontSize: 12, color: 'var(--text2)', fontWeight: 400 }}>· Week {week + 1}</span></div>
        </div>
      </div>

      {view === 'week' ? (
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 100px' }}>
          <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.5, marginBottom: 16, padding: '12px', background: 'var(--bg2)', borderRadius: 10, border: '1px solid var(--border)' }}>
            {PLAN[week].summary}
          </div>
          {PLAN[week].days.map((d, di) => {
            const ed = edits[`${week}_${di}`] || d;
            const isDone = log[`${week}_${di}`]?.done;
            const dc = tc(d.type);
            return (
              <div key={di} onClick={() => { setDay(di); setView('day'); }}
                style={{ background: 'var(--bg2)', border: `1px solid ${isDone ? 'rgba(90,196,122,0.3)' : 'var(--border)'}`, borderRadius: 12, padding: '13px 15px', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: dc.bg, border: `1px solid ${dc.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: dc.color, flexShrink: 0, fontFamily: 'var(--font-mono)' }}>
                  {DAY_NAMES[di]}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
                    {ed.title}
                    {edits[`${week}_${di}`] && <span style={{ fontSize: 9, color: '#e8a83a', fontFamily: 'var(--font-mono)' }}>EDITED</span>}
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {ed.distance && <span style={{ fontSize: 10, color: 'var(--text2)', fontFamily: 'var(--font-mono)' }}>{ed.distance}</span>}
                    {ed.pace && <span style={{ fontSize: 10, color: 'var(--text2)', fontFamily: 'var(--font-mono)' }}>· {ed.pace}</span>}
                  </div>
                </div>
                {isDone
                  ? <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#5ac47a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, flexShrink: 0 }}>✓</div>
                  : <div style={{ fontSize: 18, color: 'var(--text3)', flexShrink: 0 }}>›</div>}
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 100px' }}>
          {/* Day tabs */}
          <div style={{ display: 'flex', gap: 4, marginBottom: 16, overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: 4 }}>
            {DAY_NAMES.map((dn, di) => {
              const d = PLAN[week].days[di];
              const dc = tc(d.type);
              const isDone = log[`${week}_${di}`]?.done;
              return (
                <button key={di} onClick={() => setDay(di)}
                  style={{ flexShrink: 0, padding: '5px 10px', borderRadius: 8, border: di === day ? `1.5px solid ${dc.color}` : '1px solid var(--border)', background: di === day ? dc.bg : 'transparent', color: di === day ? dc.color : 'var(--text2)', fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-mono)', position: 'relative' }}>
                  {dn}{isDone ? ' ✓' : ''}
                </button>
              );
            })}
          </div>

          {/* Session card */}
          <div style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: 16, padding: '18px', marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <TypeBadge type={sessionData.type} label={sessionData.label} />
                <div style={{ fontSize: 18, fontWeight: 700, marginTop: 8, lineHeight: 1.2 }}>{sessionData.title}</div>
              </div>
              {edits[`${week}_${day}`] && (
                <button onClick={() => { const e = { ...edits }; delete e[`${week}_${day}`]; setEdits(e); }}
                  style={{ fontSize: 10, color: '#e8a83a', background: 'rgba(232,168,58,0.1)', border: '1px solid rgba(232,168,58,0.3)', borderRadius: 6, padding: '3px 7px', cursor: 'pointer' }}>
                  Reset
                </button>
              )}
            </div>

            {/* Editable stats */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
              {['distance', 'pace', 'hr', 'duration'].map(field => {
                const val = sessionData[field];
                if (!val) return null;
                return editing === field ? (
                  <div key={field} style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                    <input value={editVal} onChange={e => setEditVal(e.target.value)}
                      autoFocus
                      style={{ width: 110, padding: '4px 8px', background: 'var(--bg3)', border: '1px solid var(--border2)', borderRadius: 8, color: 'var(--text)', fontSize: 12, fontFamily: 'var(--font-mono)' }} />
                    <button onClick={() => saveEdit(field)} style={{ padding: '4px 8px', background: '#e8583a', border: 'none', borderRadius: 6, color: '#fff', fontSize: 11, cursor: 'pointer' }}>Save</button>
                    <button onClick={() => setEditing(null)} style={{ padding: '4px 6px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--text2)', fontSize: 11, cursor: 'pointer' }}>×</button>
                  </div>
                ) : (
                  <div key={field} onClick={() => { setEditing(field); setEditVal(val); }}
                    style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 8, padding: '5px 10px', cursor: 'pointer', border: '1px solid transparent' }}>
                    <span style={{ fontSize: 10, color: 'var(--text2)', marginRight: 4, textTransform: 'capitalize' }}>{field}</span>
                    <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', fontWeight: 500 }}>{val}</span>
                    <span style={{ fontSize: 10, color: 'var(--text3)', marginLeft: 4 }}>✎</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Session steps */}
          <div style={{ marginBottom: 16 }}>
            {sessionData.sets.map((s, si) => (
             <div key={si} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
               <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--bg3)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: 'var(--text2)', flexShrink: 0, fontFamily: 'var(--font-mono)', marginTop: 1, minWidth: 20 }}>{si + 1}</div>
               <div style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.5, flex: 1, minWidth: 0 }}>{s}</div>
             </div>
            ))}
          </div>

          {/* Log entry if exists */}
          {logEntry.done && (logEntry.pace || logEntry.hr || logEntry.notes) && (
            <div style={{ background: 'rgba(90,196,122,0.08)', border: '1px solid rgba(90,196,122,0.25)', borderRadius: 12, padding: '14px', marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: '#5ac47a', fontFamily: 'var(--font-mono)', marginBottom: 8, letterSpacing: '0.06em' }}>YOUR LOG</div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: logEntry.notes ? 8 : 0 }}>
                {logEntry.pace && <StatPill label="Actual pace" val={logEntry.pace} />}
                {logEntry.hr && <StatPill label="Avg HR" val={logEntry.hr + ' bpm'} />}
              </div>
              {logEntry.notes && <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.5 }}>{logEntry.notes}</div>}
            </div>
          )}

          {/* Action buttons */}
          {sessionData.type !== 'rest' && (
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={markDone} style={{
                flex: 1, padding: '14px', borderRadius: 12,
                background: done ? 'rgba(90,196,122,0.15)' : '#e8583a',
                border: done ? '1px solid rgba(90,196,122,0.4)' : 'none',
                color: done ? '#5ac47a' : '#fff',
                fontSize: 14, fontWeight: 700, cursor: 'pointer',
                fontFamily: 'var(--font-display)',
              }}>
                {done ? '✓ Completed' : 'Mark Complete'}
              </button>
              {done && (
                <button onClick={() => { setLogData({ pace: logEntry.pace || '', hr: logEntry.hr || '', notes: logEntry.notes || '' }); setLogModal(true); }}
                  style={{ padding: '14px 16px', borderRadius: 12, background: 'var(--bg2)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: 13, cursor: 'pointer' }}>
                  Log ✎
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Log modal */}
      {logModal && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'flex-end', zIndex: 100 }}
          onClick={(e) => { if (e.target === e.currentTarget) setLogModal(false); }}>
          <div style={{ width: '100%', background: 'var(--bg2)', borderRadius: '20px 20px 0 0', padding: '24px 24px calc(24px + var(--safe-bottom))', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 20 }}>Log this session</div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: 6, letterSpacing: '0.06em' }}>ACTUAL PACE</label>
              <input value={logData.pace} onChange={e => setLogData({ ...logData, pace: e.target.value })}
                placeholder="e.g. 5:45/km"
                style={{ width: '100%', padding: '12px', background: 'var(--bg3)', border: '1px solid var(--border2)', borderRadius: 10, color: 'var(--text)', fontSize: 14, fontFamily: 'var(--font-mono)' }} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: 6, letterSpacing: '0.06em' }}>AVG HEART RATE (BPM)</label>
              <input value={logData.hr} onChange={e => setLogData({ ...logData, hr: e.target.value })}
                placeholder="e.g. 152"
                style={{ width: '100%', padding: '12px', background: 'var(--bg3)', border: '1px solid var(--border2)', borderRadius: 10, color: 'var(--text)', fontSize: 14, fontFamily: 'var(--font-mono)' }} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: 6, letterSpacing: '0.06em' }}>NOTES</label>
              <textarea value={logData.notes} onChange={e => setLogData({ ...logData, notes: e.target.value })}
                placeholder="How did it feel? Any changes you made..."
                rows={3}
                style={{ width: '100%', padding: '12px', background: 'var(--bg3)', border: '1px solid var(--border2)', borderRadius: 10, color: 'var(--text)', fontSize: 14, resize: 'none', fontFamily: 'var(--font-display)' }} />
            </div>
            <button onClick={saveLog}
              style={{ width: '100%', padding: '14px', borderRadius: 12, background: '#e8583a', border: 'none', color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-display)' }}>
              Save Log
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── STATS SCREEN ─────────────────────────────────────────────────────────────
function StatsScreen({ log }) {
  const entries = Object.entries(log).filter(([k, v]) => !k.startsWith('_') && !k.startsWith('date_') && v.done);
  const runEntries = entries.filter(([k]) => {
    const [wi, di] = k.split('_').map(Number);
    return PLAN[wi]?.days[di]?.type === 'run';
  });
  const swimEntries = entries.filter(([k]) => {
    const [wi, di] = k.split('_').map(Number);
    return PLAN[wi]?.days[di]?.type === 'swim';
  });

  const paces = runEntries.filter(([, v]) => v.pace).map(([k, v]) => {
    const [wi, di] = k.split('_').map(Number);
    return { label: `W${wi+1} ${DAY_NAMES[di]}`, pace: v.pace, hr: v.hr };
  });

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 100px' }}>
      <div style={{ paddingTop: 'calc(var(--safe-top) + 24px)', marginBottom: 24 }}>
        <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em' }}>Progress</h2>
      </div>

      {/* Summary stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
        {[
          { label: 'Sessions done', val: entries.length },
          { label: 'Runs logged', val: runEntries.length },
          { label: 'Swims logged', val: swimEntries.length },
          { label: 'With HR data', val: entries.filter(([,v]) => v.hr).length },
        ].map(({ label, val }) => (
          <div key={label} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: '14px' }}>
            <div style={{ fontSize: 26, fontWeight: 800, fontFamily: 'var(--font-mono)', marginBottom: 4 }}>{val}</div>
            <div style={{ fontSize: 12, color: 'var(--text2)' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Your PBs */}
      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10, color: 'var(--text2)', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em' }}>STARTING PBs</div>
      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: '14px', marginBottom: 24 }}>
        {[
          { label: '5K', val: '25:46' }, { label: '10K', val: '55:59' },
          { label: 'Half marathon', val: '2:17:00' }, { label: 'Swim 1100m', val: '43:56' },
          { label: 'VO2 max', val: '47.5' }, { label: 'Resting HR', val: '47 bpm' },
        ].map(({ label, val }, i, arr) => (
          <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none' }}>
            <span style={{ fontSize: 13, color: 'var(--text2)' }}>{label}</span>
            <span style={{ fontSize: 13, fontFamily: 'var(--font-mono)', fontWeight: 500 }}>{val}</span>
          </div>
        ))}
      </div>

      {/* Logged paces */}
      {paces.length > 0 && (
        <>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10, color: 'var(--text2)', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em' }}>YOUR LOGGED RUNS</div>
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: '14px', marginBottom: 24 }}>
            {paces.map(({ label, pace, hr }, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i < paces.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <span style={{ fontSize: 12, color: 'var(--text2)' }}>{label}</span>
                <div style={{ display: 'flex', gap: 8 }}>
                  <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: '#e8583a' }}>{pace}</span>
                  {hr && <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text2)' }}>{hr} bpm</span>}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Projections */}
      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10, color: 'var(--text2)', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em' }}>8-WEEK PROJECTIONS</div>
      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: '14px' }}>
        {[
          { label: '5K', now: '25:46', proj: '~23:30–24:00' },
          { label: '10K', now: '55:59', proj: '~51:00–53:00' },
          { label: 'Z2 pace', now: '6:30–7:00/km', proj: '~5:45–6:10/km' },
          { label: 'Swim /100m', now: '2:24', proj: '~2:08–2:15' },
          { label: 'VO2 max', now: '47.5', proj: '~49–51' },
          { label: 'Resting HR', now: '47 bpm', proj: '~43–46 bpm' },
        ].map(({ label, now, proj }, i, arr) => (
          <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none' }}>
            <span style={{ fontSize: 12, color: 'var(--text2)', width: 90 }}>{label}</span>
            <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text3)', flex: 1, textAlign: 'center' }}>{now}</span>
            <span style={{ fontSize: 11, color: '#5ac47a', fontFamily: 'var(--font-mono)', textAlign: 'right' }}>→ {proj}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── BOTTOM NAV ────────────────────────────────────────────────────────────────
function BottomNav({ tab, setTab }) {
  const items = [
    { id: 'home', label: 'Home', icon: '⌂' },
    { id: 'plan', label: 'Plan', icon: '◫' },
    { id: 'stats', label: 'Progress', icon: '↗' },
  ];
  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      display: 'flex', background: 'var(--bg2)',
      borderTop: '1px solid var(--border)',
      paddingBottom: 'calc(var(--safe-bottom) + 8px)',
      zIndex: 50,
    }}>
      {items.map(item => (
        <button key={item.id} onClick={() => setTab(item.id)} style={{
          flex: 1, padding: '12px 0 10px', background: 'transparent', border: 'none', cursor: 'pointer',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
        }}>
          <span style={{ fontSize: 20, lineHeight: 1, color: tab === item.id ? '#e8583a' : 'var(--text3)' }}>{item.icon}</span>
          <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: tab === item.id ? '#e8583a' : 'var(--text3)', letterSpacing: '0.04em' }}>{item.label.toUpperCase()}</span>
        </button>
      ))}
    </div>
  );
}

// ── APP ROOT ──────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState('home');
  const [log, setLog] = useStorage(STORAGE_KEY, {});
  const [edits, setEdits] = useStorage(EDITS_KEY, {});
  const [planNav, setPlanNav] = useState(null); // { week, day }

  const goToDay = (week, day) => {
    setPlanNav({ week, day });
    setTab('plan');
  };

  return (
    <div className="app">
      {tab === 'home' && <HomeScreen log={log} setLog={setLog} edits={edits} onOpenDay={goToDay} />}
      {tab === 'plan' && (
        <PlanScreen
          key={planNav ? `${planNav.week}_${planNav.day}` : 'default'}
          initWeek={planNav?.week}
          initDay={planNav?.day}
          log={log} setLog={setLog}
          edits={edits} setEdits={setEdits}
        />
      )}3
      {tab === 'stats' && <StatsScreen log={log} />}
      <BottomNav tab={tab} setTab={(t) => { if (t !== 'plan') setPlanNav(null); setTab(t); }} />
    </div>
  );
}
