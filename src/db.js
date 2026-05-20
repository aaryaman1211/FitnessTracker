import { supabase } from './supabase';

export async function getUserId() {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user?.id;
}

/**
 * Initial app load: reads active_plan_name from app_settings first,
 * then fetches session_logs and session_edits filtered to that plan.
 */
export async function loadUserData() {
  const userId = await getUserId();
  if (!userId) return null;

  // Phase 1: get settings (contains active plan name + per-plan start dates)
  const { data: settingsData } = await supabase
    .from('app_settings')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  const activePlanName = settingsData?.active_plan_name || null;
  const planToLoad = activePlanName || 'Default 8-week plan';

  // Phase 2: fetch logs/edits for that specific plan, plus PBs and saved plans
  const [logs, pbs, edits, plans] = await Promise.all([
    supabase.from('session_logs').select('*').eq('user_id', userId).eq('plan_name', planToLoad),
    supabase.from('personal_bests').select('*').eq('user_id', userId),
    supabase.from('session_edits').select('*').eq('user_id', userId).eq('plan_name', planToLoad),
    supabase.from('plans').select('*').eq('user_id', userId),
  ]);

  const log = {};

  // Resolve start date: prefer per-plan start dates, fall back to legacy flat column
  const planStartDates = settingsData?.plan_start_dates || {};
  const startDate = planStartDates[planToLoad] || settingsData?.start_date || null;
  if (startDate) log._startDate = startDate;

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

  // Resolve active plan data (custom plans stored in 'plans' table)
  let activePlanData = null;
  if (activePlanName && activePlanName !== 'Default 8-week plan') {
    const matchingPlan = (plans.data || []).find(p => p.name === activePlanName);
    if (matchingPlan) activePlanData = matchingPlan.plan_data;
  }

  return { log, pbs: pbsObj, edits: editsObj, activePlanName, activePlanData };
}

/**
 * Load just the log + edits for a given plan name.
 * Called when the user switches to a different plan so we can restore
 * exactly where they left off.
 */
export async function loadPlanProgress(planName) {
  const userId = await getUserId();
  if (!userId) return null;

  const activePlan = planName || 'Default 8-week plan';

  const [settingsResult, logs, edits] = await Promise.all([
    supabase.from('app_settings').select('plan_start_dates, start_date').eq('user_id', userId).maybeSingle(),
    supabase.from('session_logs').select('*').eq('user_id', userId).eq('plan_name', activePlan),
    supabase.from('session_edits').select('*').eq('user_id', userId).eq('plan_name', activePlan),
  ]);

  const log = {};

  // Resolve per-plan start date (fall back to legacy flat column for Default plan)
  const planStartDates = settingsResult?.data?.plan_start_dates || {};
  const startDate = planStartDates[activePlan] ||
    (activePlan === 'Default 8-week plan' ? settingsResult?.data?.start_date : null) ||
    null;
  if (startDate) log._startDate = startDate;

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

  const editsObj = {};
  (edits.data || []).forEach(row => {
    const key = `${row.week_index}_${row.day_index}`;
    if (!editsObj[key]) editsObj[key] = {};
    editsObj[key][row.field] = row.value;
  });

  return { log, edits: editsObj };
}

export async function saveSessionLog(weekIndex, dayIndex, data, planName) {
  const userId = await getUserId();
  if (!userId) return;
  await supabase.from('session_logs').upsert({
    user_id: userId,
    plan_name: planName || 'Default 8-week plan',
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
  }, { onConflict: 'user_id,plan_name,week_index,day_index' });
}

/**
 * Saves the start date for a specific plan inside the plan_start_dates
 * JSONB column, so each plan can independently track when it was started.
 */
export async function saveStartDate(date, planName) {
  const userId = await getUserId();
  if (!userId) return;

  const activePlan = planName || 'Default 8-week plan';

  // Fetch existing plan_start_dates to merge into
  const { data: existing } = await supabase
    .from('app_settings')
    .select('plan_start_dates')
    .eq('user_id', userId)
    .maybeSingle();

  const planStartDates = existing?.plan_start_dates || {};
  planStartDates[activePlan] = date;

  await supabase.from('app_settings').upsert({
    user_id: userId,
    plan_start_dates: planStartDates,
    updated_at: new Date().toISOString(),
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

export async function saveEdit(weekIndex, dayIndex, field, value, planName) {
  const userId = await getUserId();
  if (!userId) return;
  await supabase.from('session_edits').upsert({
    user_id: userId,
    plan_name: planName || 'Default 8-week plan',
    week_index: weekIndex,
    day_index: dayIndex,
    field,
    value,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'user_id,plan_name,week_index,day_index,field' });
}

export async function deleteEdit(weekIndex, dayIndex, planName) {
  const userId = await getUserId();
  if (!userId) return;
  await supabase.from('session_edits').delete()
    .eq('user_id', userId)
    .eq('plan_name', planName || 'Default 8-week plan')
    .eq('week_index', weekIndex)
    .eq('day_index', dayIndex);
}

export async function saveActivePlan(planName) {
  const userId = await getUserId();
  if (!userId) return;
  await supabase.from('app_settings').upsert({
    user_id: userId,
    active_plan_name: planName,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'user_id' });
}

export async function migrateFromLocalStorage() {
  const userId = await getUserId();
  if (!userId) return;

  // Check if localStorage even has any completed sessions — if not, nothing to migrate
  const rawLog = localStorage.getItem('training_log_v1');
  if (!rawLog) return;
  const localLog = JSON.parse(rawLog);
  const hasRealData = Object.keys(localLog).some(k => !k.startsWith('_') && !k.startsWith('date_'));
  if (!hasRealData) {
    localStorage.removeItem('training_log_v1');
    localStorage.removeItem('training_pbs_v1');
    localStorage.removeItem('training_edits_v1');
    return;
  }

  // If user already has DB data, just clear stale localStorage
  const existing = await supabase.from('session_logs').select('id').eq('user_id', userId).limit(1);
  if (existing.data?.length > 0) {
    localStorage.removeItem('training_log_v1');
    localStorage.removeItem('training_pbs_v1');
    localStorage.removeItem('training_edits_v1');
    return;
  }

  try {
    const localPbs = JSON.parse(localStorage.getItem('training_pbs_v1') || '{}');
    const localEdits = JSON.parse(localStorage.getItem('training_edits_v1') || '{}');

    // Migrated data belongs to the default plan
    const defaultPlan = 'Default 8-week plan';

    if (localLog._startDate) await saveStartDate(localLog._startDate, defaultPlan);

    for (const [key, val] of Object.entries(localLog)) {
      if (key.startsWith('_') || key.startsWith('date_') || !val.done) continue;
      const [wi, di] = key.split('_').map(Number);
      if (!isNaN(wi) && !isNaN(di)) await saveSessionLog(wi, di, val, defaultPlan);
    }

    for (const [key, val] of Object.entries(localPbs)) {
      await savePB(key, val);
    }

    for (const [key, val] of Object.entries(localEdits)) {
      const [wi, di] = key.split('_').map(Number);
      if (!isNaN(wi) && !isNaN(di)) {
        for (const [field, value] of Object.entries(val)) {
          await saveEdit(wi, di, field, value, defaultPlan);
        }
      }
    }

    console.log('Migration complete');

    localStorage.removeItem('training_log_v1');
    localStorage.removeItem('training_pbs_v1');
    localStorage.removeItem('training_edits_v1');
  } catch (e) {
    console.error('Migration failed', e);
  }
}

// ─── Custom Workouts ───────────────────────────────────────────────────────────

export async function loadCustomWorkouts(planName) {
  const userId = await getUserId();
  if (!userId) return [];
  const { data, error } = await supabase
    .from('custom_workouts')
    .select('*')
    .eq('user_id', userId)
    .eq('plan_name', planName || 'Default 8-week plan')
    .order('created_at', { ascending: true });
  if (error) { console.error('loadCustomWorkouts:', error.message); return []; }
  return data || [];
}

export async function saveCustomWorkout(workout, planName) {
  const userId = await getUserId();
  if (!userId) return null;
  const row = {
    user_id: userId,
    plan_name: planName || 'Default 8-week plan',
    week_index: workout.week_index ?? -1,
    day_index: workout.day_index ?? -1,
    title: workout.title,
    type: workout.type || 'other',
    distance: workout.distance || null,
    duration: workout.duration || null,
    notes: workout.notes || null,
    done: workout.done ?? false,
    date: workout.date || null,
    updated_at: new Date().toISOString(),
  };
  if (workout.id) {
    // Update existing
    const { data, error } = await supabase
      .from('custom_workouts')
      .update(row)
      .eq('id', workout.id)
      .eq('user_id', userId)
      .select()
      .single();
    if (error) console.error('saveCustomWorkout update:', error.message);
    return data;
  } else {
    // Insert new
    const { data, error } = await supabase
      .from('custom_workouts')
      .insert(row)
      .select()
      .single();
    if (error) console.error('saveCustomWorkout insert:', error.message);
    return data;
  }
}

export async function deleteCustomWorkout(id) {
  const userId = await getUserId();
  if (!userId) return;
  const { error } = await supabase
    .from('custom_workouts')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);
  if (error) console.error('deleteCustomWorkout:', error.message);
}

export async function markCustomWorkoutDone(id, done, planName) {
  const userId = await getUserId();
  if (!userId) return;
  const today = new Date().toISOString().split('T')[0];
  const { error } = await supabase
    .from('custom_workouts')
    .update({ done, date: done ? today : null, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', userId);
  if (error) console.error('markCustomWorkoutDone:', error.message);
}