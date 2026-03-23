export const PLAN = [
  {
    week: 1, phase: 'Recovery',
    summary: 'Ankle still settling. All Zone 2 max. HR is the only rule — distance targets are loose.',
    days: [
      { type: 'rest', label: 'Rest', title: 'Full rest', distance: null, pace: null, hr: null, duration: null,
        sets: ['Complete rest. Light walking fine.', 'Elevate and ice ankle if still tender.', 'Foam roll quads and calves gently.'] },
      { type: 'rest', label: 'Rest', title: 'Rest / mobility', distance: null, pace: null, hr: null, duration: null,
        sets: ['Rest day.', '10 min light stretching — hip flexors, hamstrings, calves.', 'No running or loading ankle.'] },
      { type: 'run', label: 'Easy run', title: 'Easy Zone 2 run', distance: '~3 km', pace: '6:30–7:30/km', hr: '140–160', duration: '~22–25 min',
        sets: ['Warm-up: 5 min walk', 'Main: 3 km easy jog keeping HR 140–160', 'If HR goes above 160, walk until it drops', 'Cool-down: 5 min walk + ankle stretches', 'Do not chase pre-injury pace — patience now = gains later'] },
      { type: 'cycle', label: 'Cycle', title: 'Easy spin — 20 min', distance: null, pace: null, hr: 'under 150', duration: '20 min',
        sets: ['Stationary or spin bike only this week', 'Zone 1–2 — HR under 150 the whole time', 'Light resistance, 80–90 rpm', 'Purpose: blood flow and activation, not fitness'] },
      { type: 'rest', label: 'Rest', title: 'Rest / ankle work', distance: null, pace: null, hr: null, duration: null,
        sets: ['Single-leg balance drills — 30s × 3 each leg.', 'Ankle circles and alphabet draws.', 'Rebuilds proprioception the swelling disrupts.'] },
      { type: 'swim', label: 'Swim', title: 'Easy reconnect swim — 800m', distance: '800m', pace: 'no target', hr: null, duration: '~30–35 min',
        sets: ['400m easy freestyle — feel the water, no effort', '8 × 25m with 20s rest — long reach, high elbow catch', '200m easy cool-down (backstroke or easy free)', 'No pace targets. Reconnect with rhythm and body position.'] },
      { type: 'run', label: 'Long run', title: 'Long run — ~5 km', distance: '~5 km', pace: '6:30–7:30/km', hr: '140–160', duration: '~35–40 min',
        sets: ['Zone 2 only — HR 140–160 entire run', 'Walk any time HR exceeds 160 until it drops to 145', 'Pace will feel embarrassingly slow — that is correct', 'Note finish HR and recovery time below 120 after stopping'] }
    ]
  },
  {
    week: 2, phase: 'Recovery',
    summary: 'Ankle nearly recovered. Volume nudges up. Still all Zone 2. First structured swim session.',
    days: [
      { type: 'rest', label: 'Rest', title: 'Full rest', distance: null, pace: null, hr: null, duration: null,
        sets: ['Rest. Easy walking fine.', 'Foam roll IT band and quads.'] },
      { type: 'rest', label: 'Rest', title: 'Rest / easy walk', distance: null, pace: null, hr: null, duration: null,
        sets: ['30 min easy walk if legs feel ok.', 'No running Tuesday this week.'] },
      { type: 'run', label: 'Easy run', title: 'Zone 2 run — ~4 km', distance: '~4 km', pace: '6:10–7:00/km', hr: '140–160', duration: '~25–30 min',
        sets: ['Warm-up: 5 min walk', 'Main: 4 km continuous Zone 2', 'Try nasal breathing only — if you need to open mouth, slow down', 'Cool-down: 5 min walk', 'Stretch calves and Achilles well after'] },
      { type: 'cycle', label: 'Cycle', title: 'Easy spin — 25 min', distance: null, pace: null, hr: '140–155', duration: '25 min',
        sets: ['Zone 2 — HR 140–155', '85–90 rpm — slightly higher cadence than week 1', 'Light resistance — aerobic not strength', 'Different muscle recruitment than running — notice this'] },
      { type: 'rest', label: 'Rest', title: 'Rest / mobility', distance: null, pace: null, hr: null, duration: null,
        sets: ['Rest. Hip flexor and ankle mobility.', '5 min single-leg balance drills.', 'Prioritise sleep — recovery is where adaptation happens.'] },
      { type: 'swim', label: 'Swim', title: 'Structured swim — 900m', distance: '900m', pace: '2:40–2:50/100m', hr: null, duration: '~32–36 min',
        sets: ['Warm-up: 200m easy freestyle', 'Drill set: 4 × 50m catch-up drill with 20s rest', 'Main set: 4 × 100m easy with 30s rest — target 2:40–2:50/100m', 'Cool-down: 100m easy', 'Focus: consistent stroke count per length — aim 18–22 per 25m'] },
      { type: 'run', label: 'Long run', title: 'Long run — ~6 km', distance: '~6 km', pace: '6:10–7:00/km', hr: '140–160', duration: '~38–44 min',
        sets: ['Zone 2 only — HR 140–160', 'Should feel completely conversational the whole way', 'Note distance and avg HR — this is your base benchmark', 'Compare Zone 2 pace to week 1 — small improvement expected'] }
    ]
  },
  {
    week: 3, phase: 'Base Building',
    summary: 'First real training week. Intervals introduced Wednesday. Long run hits 8km. Swim breaks 1000m.',
    days: [
      { type: 'rest', label: 'Rest', title: 'Rest', distance: null, pace: null, hr: null, duration: null,
        sets: ['Rest day.', 'Light foam rolling.', 'Prioritise sleep before Wednesday intervals.'] },
      { type: 'rest', label: 'Rest', title: 'Rest', distance: null, pace: null, hr: null, duration: null,
        sets: ['Full rest.', 'Legs should feel fresh for Wednesday.'] },
      { type: 'run', label: 'Intervals', title: 'First interval session', distance: '~6–7 km total', pace: '4:45–5:05/km (reps)', hr: '170–185 (reps)', duration: '~35–40 min',
        sets: ['Warm-up: 1.5 km easy jog (Zone 2)', '4 × 3 min at Zone 4–5 (HR 170–185) with 3 min easy jog recovery', 'Rep pace: ~4:45–5:05/km — hard but controlled, not a sprint', 'Cool-down: 1.5 km easy jog + stretch', 'Should feel 7–8/10 effort. Uncomfortable but not desperate.'] },
      { type: 'cycle', label: 'Cycle', title: 'Easy spin — 30 min', distance: null, pace: null, hr: '140–158', duration: '30 min',
        sets: ['Zone 2 — HR 140–158', 'Active recovery after Wednesday intervals', 'Smooth pedal stroke — no stomping', 'Slight resistance increase vs week 2'] },
      { type: 'rest', label: 'Rest', title: 'Rest / full body stretch', distance: null, pace: null, hr: null, duration: null,
        sets: ['Rest. Full body stretch or 20 min yoga.', 'Focus: hip flexors, hamstrings, thoracic spine, calves.'] },
      { type: 'swim', label: 'Swim', title: 'Structured swim — 1000m', distance: '1000m', pace: '2:20–2:30/100m', hr: null, duration: '~36–40 min',
        sets: ['Warm-up: 200m easy freestyle', 'Main set: 6 × 100m with 30s rest — aim 2:20–2:30/100m consistently', 'Key word: consistent — rep 6 same pace as rep 1', 'Cool-down: 200m easy (mix backstroke and freestyle)', 'Count strokes per length — creeping up = technique breaking under fatigue'] },
      { type: 'run', label: 'Long run', title: 'Long run — 8 km', distance: '8 km', pace: '6:00–6:40/km', hr: '140–160', duration: '~48–55 min',
        sets: ['Zone 2 only — HR 140–160 entire run', 'Expected pace: 6:00–6:40/km at true Zone 2', 'Walk 60s every 3 km if HR drifts above 160', 'Fuel: 500ml water, start hydrated', 'Base benchmark run — note avg pace and avg HR'] }
    ]
  },
  {
    week: 4, phase: 'Base Building',
    summary: 'Volume ticks up. Intervals get one extra rep. Long run hits 10km. First bonus run Thursday.',
    days: [
      { type: 'rest', label: 'Rest', title: 'Rest', distance: null, pace: null, hr: null, duration: null,
        sets: ['Rest. Foam roll and stretch.', '8 hrs sleep is training.'] },
      { type: 'rest', label: 'Rest', title: 'Rest', distance: null, pace: null, hr: null, duration: null,
        sets: ['Full rest day.', 'Light walk if you want — no more than 20 min.'] },
      { type: 'run', label: 'Intervals', title: 'Interval run — 5×3 min', distance: '~7–8 km total', pace: '4:45–5:05/km (reps)', hr: '170–185 (reps)', duration: '~40–45 min',
        sets: ['Warm-up: 1.5 km easy (Zone 2)', '5 × 3 min at Zone 4–5 with 2:30 min easy recovery', 'One extra rep vs week 3 — recovery slightly shorter', 'Rep pace: 4:45–5:05/km — same target as week 3', 'Notice if HR recovers faster between reps — it should'] },
      { type: 'bonus', label: 'Bonus run', title: 'Bonus easy run — ~4 km (optional)', distance: '~4 km', pace: '6:10–7:00/km', hr: '140–155', duration: '~25 min',
        sets: ['OPTIONAL — if legs feel heavy, skip entirely', 'Zone 2 only — HR 140–155', 'Easy flat route, no watch pressure', 'Purpose: add aerobic volume without intensity', 'Keep to 4 km max — do not extend'] },
      { type: 'rest', label: 'Rest', title: 'Rest / mobility', distance: null, pace: null, hr: null, duration: null,
        sets: ['Rest. Stretch hamstrings and calves.', 'Ankle mobility check — should be fully fine now.'] },
      { type: 'swim', label: 'Swim', title: 'Structured swim — 1100m', distance: '1100m', pace: '2:15–2:25/100m', hr: null, duration: '~38–42 min',
        sets: ['Warm-up: 200m easy', 'Main set: 6 × 100m with 25s rest — target 2:15–2:25/100m', 'Try to negative-split: last 3 reps faster than first 3', 'Cool-down: 200m easy', 'Total 1100m — matching PB distance but faster target pace'] },
      { type: 'run', label: 'Long run', title: 'Long run — 10 km', distance: '10 km', pace: '6:00–6:30/km', hr: '140–160', duration: '~60–65 min',
        sets: ['Zone 2 only — HR 140–160', 'First double-digit long run of the block', 'Target pace: 6:00–6:30/km — small improvement vs week 3 expected', 'Bring water — hydration point at 5 km', 'Compare avg pace to week 3 8km run'] }
    ]
  },
  {
    week: 5, phase: 'Threshold',
    summary: 'Threshold phase begins. Monday adds tempo run. Intervals get longer reps. Long run 12km.',
    days: [
      { type: 'run', label: 'Tempo', title: 'Evening tempo run', distance: '~6.5 km total', pace: '5:20–5:40/km (tempo)', hr: '160–170 (tempo)', duration: '~40 min',
        sets: ['Warm-up: 1.5 km easy jog (Zone 2, HR 140–155)', 'Tempo: 20 min at Zone 3 (HR 160–170) — target 5:20–5:40/km', '"Comfortably hard" — short phrases but not full sentences', 'Cool-down: 1.5 km easy jog', 'First threshold session. Zone 3 feels hard initially — stick with it.'] },
      { type: 'rest', label: 'Rest', title: 'Rest', distance: null, pace: null, hr: null, duration: null,
        sets: ['Rest. Let Monday tempo settle.', 'Light stretching only.'] },
      { type: 'run', label: 'Intervals', title: 'Interval run — 4×4 min', distance: '~8 km total', pace: '4:50–5:10/km (reps)', hr: '170–182 (reps)', duration: '~45 min',
        sets: ['Warm-up: 1.5 km easy jog', '4 × 4 min at Zone 4 (HR 170–182) with 3 min easy jog recovery', 'Longer reps = bigger VO2 stimulus', 'Target rep pace: 4:50–5:10/km', 'Cool-down: 1.5 km easy'] },
      { type: 'cycle', label: 'Cycle', title: 'Steady spin — 35 min', distance: null, pace: null, hr: '142–162', duration: '35 min',
        sets: ['Zone 2 — HR 142–162', 'Slightly more resistance than previous weeks', 'Smooth pedal stroke — no stomping', 'Active recovery after Wednesday hard session'] },
      { type: 'rest', label: 'Rest', title: 'Rest / mobility', distance: null, pace: null, hr: null, duration: null,
        sets: ['Rest. Full body stretch.', 'Heavy training week — sleep matters most tonight.'] },
      { type: 'swim', label: 'Swim', title: 'Structured swim — 1200m', distance: '1200m', pace: '2:15–2:25/100m', hr: null, duration: '~42–46 min',
        sets: ['Warm-up: 200m easy', 'Main set: 3 × 200m with 45s rest — target 4:30–4:50 per 200m', 'Sprint set: 4 × 50m fast with 20s rest — Zone 4 effort', 'Cool-down: 100m easy', 'First 200m reps — find a rhythm at 100m and hold it'] },
      { type: 'run', label: 'Long run', title: 'Long run — 12 km', distance: '12 km', pace: '5:55–6:25/km', hr: '140–160', duration: '~72–78 min',
        sets: ['Zone 2 only — HR 140–160', 'Target pace: 5:55–6:25/km — Zone 2 getting faster now', 'Bring water — fountain or bottle at 6 km', 'If over 75 min, take a gel or dates at 60 min mark', 'Time on feet is the stimulus — finish steady not fast'] }
    ]
  },
  {
    week: 6, phase: 'Threshold',
    summary: 'Peak volume of first half. Tempo 25 min. 5 interval reps. 14km long run. 400m TT in swim. Bonus Tuesday.',
    days: [
      { type: 'run', label: 'Tempo', title: 'Tempo run — 25 min', distance: '~7 km total', pace: '5:15–5:35/km (tempo)', hr: '160–170 (tempo)', duration: '~45 min',
        sets: ['Warm-up: 1.5 km easy jog', 'Tempo: 25 min at Zone 3 — target 5:15–5:35/km', '5 min longer than week 5 — pace should feel same or easier', 'Cool-down: 1.5 km easy', 'Zone 3 should feel more natural now — your threshold is shifting'] },
      { type: 'bonus', label: 'Bonus run', title: 'Bonus easy run — ~5 km (optional)', distance: '~5 km', pace: '6:00–6:40/km', hr: '140–155', duration: '~30 min',
        sets: ['OPTIONAL — skip if fatigued from Monday', 'Zone 2 only — HR 140–155', 'Easy flat conversational pace', 'Do not extend beyond 5 km'] },
      { type: 'run', label: 'Intervals', title: 'Interval run — 5×4 min', distance: '~9–10 km total', pace: '4:48–5:05/km (reps)', hr: '170–182 (reps)', duration: '~50 min',
        sets: ['Warm-up: 1.5 km easy jog', '5 × 4 min at Zone 4 with 3 min recovery — one more rep than week 5', 'Total hard effort: 20 min — proper VO2 max session', 'Target rep pace: 4:48–5:05/km', 'If rep 5 drops >15 sec/km vs rep 1, cut it — quality beats quantity'] },
      { type: 'cycle', label: 'Cycle', title: 'Spin — 40 min with Zone 3 surges', distance: null, pace: null, hr: '142–172', duration: '40 min',
        sets: ['Pattern: 8 min Zone 2 → 2 min Zone 3 → repeat × 4', 'Building cycling engine for the 70.3', 'Zone 3 surges are only 2 min — hold them', 'Keep cadence high (88–95 rpm) even during surges'] },
      { type: 'rest', label: 'Rest', title: 'Rest / mobility', distance: null, pace: null, hr: null, duration: null,
        sets: ['Rest. Heavy week — take Friday fully off.', 'Foam roll IT band, quads, calves.'] },
      { type: 'swim', label: 'Swim', title: '1300m incl. 400m time trial', distance: '1300m', pace: 'TT target: sub 9:40', hr: null, duration: '~46–50 min',
        sets: ['Warm-up: 200m easy', '400m time trial — swim hard, note your time. Target: under 9:40 (2:25/100m)', 'Rest 3 min fully', 'Speed set: 6 × 50m fast with 15s rest', 'Cool-down: 100m easy', 'Sub 9:40 = beating your current 2:24/100m average'] },
      { type: 'run', label: 'Long run', title: 'Long run — 14 km', distance: '14 km', pace: '5:50–6:20/km', hr: '140–160', duration: '~82–90 min',
        sets: ['Zone 2 only — HR 140–160', 'Target pace: 5:50–6:20/km — small real improvement expected', 'Bring 750ml water. Fuel at 60 min if over 80 min total.', 'Last 3 km steady not desperate — if desperate, you started too fast', 'Post-run: protein meal within 45 min'] }
    ]
  },
  {
    week: 7, phase: 'Deload',
    summary: 'Deload week — volume drops ~35%. Everything easier. Do not skip or turn this into a hard week. Adaptation happens here.',
    days: [
      { type: 'run', label: 'Easy run', title: 'Easy run — ~4 km', distance: '~4 km', pace: '6:10–6:50/km', hr: '140–158', duration: '~25 min',
        sets: ['Zone 2 only — shorter and easier than any Monday before', 'No tempo this week', 'Focus on smooth breathing and relaxed form', 'Active recovery, not training'] },
      { type: 'rest', label: 'Rest', title: 'Rest', distance: null, pace: null, hr: null, duration: null,
        sets: ['Rest. Deload week — take it seriously.', 'Sleep in if possible.'] },
      { type: 'run', label: 'Short intervals', title: 'Short interval session — deload', distance: '~5–6 km total', pace: '4:50–5:10/km (reps)', hr: '170–182 (reps)', duration: '~35 min',
        sets: ['Warm-up: 1.5 km easy', '3 × 3 min at Zone 4 — volume halved vs week 6', 'Keep the stimulus, massively reduce the dose', 'Cool-down: 1.5 km easy', 'Total ~5–6 km — noticeably shorter than recent Wednesdays'] },
      { type: 'cycle', label: 'Cycle', title: 'Easy spin — 25 min', distance: null, pace: null, hr: 'under 155', duration: '25 min',
        sets: ['Zone 1–2 only — HR under 155', 'No hard efforts this week', 'Light resistance, easy cadence', 'Just keep legs moving and blood flowing'] },
      { type: 'rest', label: 'Rest', title: 'Rest', distance: null, pace: null, hr: null, duration: null,
        sets: ['Rest. Full rest day.', 'Your body is adapting — do not interrupt it.'] },
      { type: 'swim', label: 'Swim', title: 'Easy swim — 900m', distance: '900m', pace: 'comfortable only', hr: null, duration: '~30–35 min',
        sets: ['Warm-up: 300m easy', 'Main: 4 × 100m comfortable — no pace target, just feel', 'Cool-down: 100m easy', 'Deload swim. Feel the water.', 'Notice if stroke feels more natural than week 1 — it should'] },
      { type: 'run', label: 'Long run', title: 'Long run — 10 km (deload)', distance: '10 km', pace: '5:50–6:20/km', hr: '140–160', duration: '~58–64 min',
        sets: ['Zone 2 only', '4 km shorter than last Sunday — intentional', 'Notice how much easier 10km feels vs week 4 — that is adaptation', 'Easy effort, no heroics', 'Note avg pace and compare to week 3 first 8km'] }
    ]
  },
  {
    week: 8, phase: 'Peak',
    summary: 'Final peak week. Hardest session Wednesday — 1km repeats. Longest long run 17km. Biggest swim 1400m. Bonus Thursday.',
    days: [
      { type: 'run', label: 'Tempo', title: 'Tempo run — 28 min', distance: '~7.5 km total', pace: '5:10–5:30/km (tempo)', hr: '160–170 (tempo)', duration: '~48 min',
        sets: ['Warm-up: 1.5 km easy jog', 'Tempo: 28 min at Zone 3 — target 5:10–5:30/km', 'Longest tempo in the plan — same effort as week 5 felt initially', 'Cool-down: 1.5 km easy', 'This feeling manageable = proof the threshold work has worked'] },
      { type: 'rest', label: 'Rest', title: 'Rest', distance: null, pace: null, hr: null, duration: null,
        sets: ['Rest. Big week ahead.', 'Sleep well tonight.'] },
      { type: 'run', label: '1km repeats', title: '1km repeat session', distance: '~8.5 km total', pace: '4:55–5:10/km (reps)', hr: 'Zone 4–5', duration: '~40 min',
        sets: ['Warm-up: 2 km easy jog — longer warm-up for this session', '3 × 1km at 5K race pace — target 4:55–5:10/km per km', 'Full 2 min standing/walking recovery between reps', 'Cool-down: 1.5 km easy jog', 'All 3 reps should be within 5 sec of each other — do not blast rep 1'] },
      { type: 'bonus', label: 'Bonus run', title: 'Bonus easy run — ~5 km (optional)', distance: '~5 km', pace: '6:00–6:30/km', hr: '140–155', duration: '~30 min',
        sets: ['OPTIONAL — if legs heavy from Wednesday, cut to 20 min or skip', 'Zone 2 only — HR 140–155', 'Easy pace, flat route', 'Third and final bonus run of the plan'] },
      { type: 'rest', label: 'Rest', title: 'Rest — prepare for Sunday', distance: null, pace: null, hr: null, duration: null,
        sets: ['Rest. 17km long run tomorrow.', 'Hydrate well all day.', 'Carb-based dinner tonight.', 'Sleep 8+ hrs.'] },
      { type: 'swim', label: 'Swim', title: 'Structured swim — 1400m', distance: '1400m', pace: '2:12–2:20/100m', hr: null, duration: '~50–55 min',
        sets: ['Warm-up: 200m easy', 'Main set: 3 × 300m with 60s rest — target 2:12–2:20/100m', 'Speed set: 4 × 50m sprint with 20s rest', 'Cool-down: 100m easy', 'Biggest swim of the plan — find rhythm at first turn and hold it'] },
      { type: 'run', label: 'Long run', title: 'Long run — 17 km', distance: '17 km', pace: '5:45–6:15/km', hr: '140–160', duration: '~98–107 min',
        sets: ['Zone 2 only — HR 140–160', 'Longest run of the entire plan — bring 750ml minimum', 'Fuel at 60 min (gel, dates, banana)', 'Target pace: 5:45–6:15/km — marathon base forming at this pace', 'Run first 5km conservatively — the back half tells you everything', 'Post-run: stretch thoroughly, protein + carbs within 45 min'] }
    ]
  }
];

export const TYPE_COLORS = {
  run: { color: '#e8583a', bg: 'rgba(232,88,58,0.12)', border: 'rgba(232,88,58,0.3)' },
  swim: { color: '#3a8fe8', bg: 'rgba(58,143,232,0.12)', border: 'rgba(58,143,232,0.3)' },
  cycle: { color: '#e8a83a', bg: 'rgba(232,168,58,0.12)', border: 'rgba(232,168,58,0.3)' },
  bonus: { color: '#5ac47a', bg: 'rgba(90,196,122,0.12)', border: 'rgba(90,196,122,0.3)' },
  rest: { color: '#555450', bg: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.08)' },
};

export const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
export const DAY_NAMES_FULL = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
