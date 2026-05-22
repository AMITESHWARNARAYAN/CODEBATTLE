import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

/**
 * useFairnessTracker
 * 
 * Tracks behavioral infractions during a match or contest (Phase 1 Anti-Cheat).
 * Logs tab switching and large code pastes, and reports them to the backend to
 * calculate a Suspicion Score.
 * 
 * @param {Object} options 
 * @param {string} options.matchId - The match ID (optional)
 * @param {string} options.contestId - The contest ID (optional)
 * @param {boolean} options.enabled - Whether tracking is enabled
 */
export const useFairnessTracker = ({ matchId, contestId, enabled = false }) => {
  const [suspicionScore, setSuspicionScore] = useState(0);

  const reportInfraction = useCallback(async (infractionType) => {
    if (!enabled || (!matchId && !contestId)) return;

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const token = localStorage.getItem('token');
      
      const res = await axios.post(
        `${API_URL}/fairness/report`,
        { matchId, contestId, infractionType },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (res.data.suspicionScore !== undefined) {
        setSuspicionScore(res.data.suspicionScore);
      }
    } catch (err) {
      console.error('Failed to report fairness infraction:', err);
    }
  }, [matchId, contestId, enabled]);

  useEffect(() => {
    if (!enabled) return;

    // Track tab switching (visibility change)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        toast.error('Warning: Tab switching is monitored in this mode.', { icon: '⚠️' });
        reportInfraction('tab_switch');
      }
    };

    // Track large pastes (potential cheating)
    const handlePaste = (e) => {
      const pasteData = e.clipboardData?.getData('text') || '';
      // If pasting more than 30 characters of code
      if (pasteData.length > 30) {
        toast.error('Warning: Large code pastes are monitored.', { icon: '⚠️' });
        reportInfraction('large_paste');
      }
    };

    // Track mouse leaving the window (less severe, but suspicious)
    const handleMouseLeave = (e) => {
      // If mouse leaves top of window (might be switching tabs or googling)
      if (e.clientY <= 0) {
        reportInfraction('mouse_leave');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('paste', handlePaste);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('paste', handlePaste);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [enabled, reportInfraction]);

  return { suspicionScore };
};
