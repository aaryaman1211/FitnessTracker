import { supabase } from './supabase';

export async function getUserId() {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user?.id;
}

export async function loadUserData() {
  const userId = await getUserId();
  if (!userId) return null;

  const [settings, logs, pbs, edits] = await Promise.all([
    supabase.from('app_settings').select('*').eq('user_id', userId).single(),
    supabase.from('session_logs').select('*').eq('user_id', userId),
    supabase.from('personal_bests').select('*').eq('user_id', userId),
    supabase.from('session_edits').select('*').eq('user_id', userId),
  ]);

  const log = {};
  if (settings.data?.start_date) log._startDate = settings.data.start_date;
  (logs.data || []).forEach(row => {
    const key = `${row.week_index}_${row.day_index}`;
    log[key] = {
      done: row.done, date: row.date, pace: row.pace, hr: row.hr,
      notes: row.notes, pb5k: row.pb5k, pb10k: row.pb10k,
      pbHalf: row.pb_half, pbSwim100: row.pb_swim100,
      pbSwim400: row.pb_swim400, pbSwim1100: row.pb_swim1100,
    };
    if (row.date) log[`date_${row.date}`] = true;
  });

  const pbsObj = {};
  (pbs.data || []).forEach(row => {
    pbsObj[row.key] = { current: row.current_value, label: row.label, start: row.start_value, unit: row.unit };
  });

  const editsObj = {};
  (edits.data || []).forEach(row => {
    const key = `${row.week_index}_${row.day_index}`;
    if (!editsObj[key]) editsObj[key] = {};
    editsObj[key][row.field] = row.value;
  });

  return { log, pbs: pbsObj, edits: editsObj };
}

export async function saveSessionLog(weekIndex, dayIndex, data) {
  const userId = await getUserId();
  if (!userId) return;
  await supabase.from('session_logs').upsert({
    user_id: userId,
    week_index: weekIndex,
    day_index: dayIndex,
    done: data.done,
    date: data.date,
    pace: data.pace || null,
    hr: data.hr || null,
    notes: data.notes || null,
    pb5k: data.pb5k || null,
    pb10k: data.pb10k || null,
    pb_half: data.pbHalf || null,
    pb_swim100: data.pbSwim100 || null,
    pb_swim400: data.pbSwim400 || null,
    pb_swim1100: data.pbSwim1100 || null,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'user_id,week_index,day_index' });
}

export async function saveStartDate(date) {
  const userId = await getUserId();
  if (!userId) return;
  await supabase.from('app_settings').upsert({
    user_id: userId, start_date: date, updated_at: new Date().toISOString(),
  }, { onConflict: 'user_id' });
}

export async function savePB(key, data) {
  const userId = await getUserId();
  if (!userId) return;
  await supabase.from('personal_bests').upsert({
    user_id: userId, key,
    label: data.label, start_value: data.start, current_value: data.current, unit: data.unit,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'user_id,key' });
}

export async function saveEdit(weekIndex, dayIndex, field, value) {
  const userId = await getUserId();
  if (!userId) return;
  await supabase.from('session_edits').upsert({
    user_id: userId, week_index: weekIndex, day_index: dayIndex, field, value,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'user_id,week_index,day_index,field' });
}

export async function deleteEdit(weekIndex, dayIndex) {
  const userId = await getUserId();
  if (!userId) return;
  await supabase.from('session_edits').delete()
    .eq('user_id', userId).eq('week_index', weekIndex).eq('day_index', dayIndex);
}

export async function migrateFromLocalStorage() {
  const userId = await getUserId();
  if (!userId) return;

  const existing = await supabase.from('session_logs').select('id').eq('user_id', userId).limit(1);
  if (existing.data?.length > 0) return;

  try {
    const localLog = JSON.parse(localStorage.getItem('training_log_v1') || '{}');
    const localPbs = JSON.parse(localStorage.getItem('training_pbs_v1') || '{}');
    const localEdits = JSON.parse(localStorage.getItem('training_edits_v1') || '{}');

    if (localLog._startDate) await saveStartDate(localLog._startDate);

    for (const [key, val] of Object.entries(localLog)) {
      if (key.startsWith('_') || key.startsWith('date_') || !val.done) continue;
      const [wi, di] = key.split('_').map(Number);
      if (!isNaN(wi) && !isNaN(di)) await saveSessionLog(wi, di, val);
    }

    for (const [key, val] of Object.entries(localPbs)) {
      await savePB(key, val);
    }

    for (const [key, val] of Object.entries(localEdits)) {
      const [wi, di] = key.split('_').map(Number);
      if (!isNaN(wi) && !isNaN(di)) {
        for (const [field, value] of Object.entries(val)) {
          await saveEdit(wi, di, field, value);
        }
      }
    }

    console.log('Migration complete');
  } catch (e) {
    console.error('Migration failed', e);
  }
}