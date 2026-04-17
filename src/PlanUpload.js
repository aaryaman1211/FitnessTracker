import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';
import { getUserId } from './db';

export default function PlanUpload({ onPlanLoaded, currentPlanName }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [savedPlans, setSavedPlans] = useState([]);

  useEffect(() => {
    loadSavedPlans();
  }, []);

  const loadSavedPlans = async () => {
    const userId = await getUserId();
    if (!userId) return;
    const { data } = await supabase
      .from('plans')
      .select('id, name, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (data) setSavedPlans(data);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setError(''); setSuccess(''); setUploading(true);

    try {
      const text = await file.text();

      // Extract the PLAN array from the JS file
      const planMatch = text.match(/export\s+const\s+PLAN\s*=\s*(\[[\s\S]*?\]);/);
      if (!planMatch) throw new Error('Could not find PLAN export in file. Make sure it uses: export const PLAN = [...]');

      const planData = eval('(' + planMatch[1] + ')');
      if (!Array.isArray(planData) || planData.length === 0) throw new Error('PLAN must be a non-empty array');
      if (!planData[0].days || !planData[0].phase) throw new Error('Invalid plan format — each week needs phase and days');

      const userId = await getUserId();
      const planName = file.name.replace('.js', '').replace('planData', 'Custom Plan') || 'Custom Plan';

      const { error: dbError } = await supabase.from('plans').insert({
        user_id: userId,
        name: planName,
        plan_data: planData,
      });

      if (dbError) throw new Error(dbError.message);

      setSuccess(`Plan "${planName}" uploaded successfully!`);
      onPlanLoaded(planData, planName);
      await loadSavedPlans();
    } catch (err) {
      setError(err.message);
    }
    setUploading(false);
  };

  const loadPlan = async (plan) => {
    const { data } = await supabase
      .from('plans')
      .select('plan_data, name')
      .eq('id', plan.id)
      .single();
    if (data) {
      onPlanLoaded(data.plan_data, data.name);
      setSuccess(`Switched to "${data.name}"`);
    }
  };

  const deletePlan = async (planId, e) => {
    e.stopPropagation();
    await supabase.from('plans').delete().eq('id', planId);
    await loadSavedPlans();
  };

  const inputStyle = { width: '100%', padding: '11px 12px', background: 'var(--bg3)', border: '1px solid var(--border2)', borderRadius: 10, color: 'var(--text)', fontSize: 14 };

  return (
    <div style={{ padding: '0 20px 40px' }}>
      <div style={{ paddingTop: 'calc(var(--safe-top) + 24px)', marginBottom: 24 }}>
        <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em' }}>Your Plans</h2>
        <div style={{ fontSize: 13, color: 'var(--text2)', marginTop: 6 }}>
          Active: <span style={{ color: 'var(--text)', fontWeight: 600 }}>{currentPlanName || 'Default 8-week plan'}</span>
        </div>
      </div>

      {/* Upload section */}
      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14, padding: '18px', marginBottom: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Upload a custom plan</div>
        <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 14, lineHeight: 1.5 }}>
          Upload a <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text)' }}>planData.js</span> file with the same format as the default plan. It must export a <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text)' }}>PLAN</span> array.
        </div>
        <label style={{ display: 'block', padding: '13px', borderRadius: 10, background: uploading ? 'rgba(232,88,58,0.1)' : '#e8583a', color: '#fff', fontSize: 14, fontWeight: 700, textAlign: 'center', cursor: 'pointer' }}>
          {uploading ? 'Uploading...' : 'Choose planData.js file'}
          <input type="file" accept=".js" onChange={handleFileUpload} style={{ display: 'none' }} disabled={uploading} />
        </label>
        {error && <div style={{ fontSize: 12, color: '#e8583a', marginTop: 10, fontFamily: 'var(--font-mono)', lineHeight: 1.5 }}>{error}</div>}
        {success && <div style={{ fontSize: 12, color: '#5ac47a', marginTop: 10, fontFamily: 'var(--font-mono)' }}>{success}</div>}
      </div>

      {/* Saved plans */}
      {savedPlans.length > 0 && (
        <>
          <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text2)', letterSpacing: '0.08em', marginBottom: 10 }}>SAVED PLANS</div>
          {savedPlans.map(plan => (
            <div key={plan.id} onClick={() => loadPlan(plan)}
              style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: '14px 16px', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 3 }}>{plan.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--font-mono)' }}>
                  {new Date(plan.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
              </div>
              <button onClick={(e) => deletePlan(plan.id, e)}
                style={{ padding: '5px 10px', background: 'transparent', border: '1px solid rgba(232,88,58,0.3)', borderRadius: 8, color: '#e8583a', fontSize: 11, cursor: 'pointer' }}>
                Delete
              </button>
            </div>
          ))}
        </>
      )}

      {/* Download default plan template */}
      <div style={{ marginTop: 24, padding: '14px', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Need a template?</div>
        <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.5 }}>
          Your current plan file is in <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text)' }}>src/planData.js</span>. Copy it, rename it, edit the weeks and sessions, then upload it here.
        </div>
      </div>
    </div>
  );
}