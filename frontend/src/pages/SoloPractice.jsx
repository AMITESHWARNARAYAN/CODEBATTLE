import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMatchStore } from '../store/matchStore';
import { toast } from 'react-hot-toast';

export default function SoloPractice() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { startSoloMatch } = useMatchStore();
  const [loading, setLoading] = useState(true);
  const problemId = searchParams.get('problemId');
  const isDailyChallenge = searchParams.get('dailyChallenge') === 'true';

  useEffect(() => {
    const initiateSoloMatch = async () => {
      try {
        setLoading(true);
        const match = await startSoloMatch(problemId);

        // Store daily challenge flag in session storage
        if (isDailyChallenge) {
          sessionStorage.setItem('isDailyChallenge', 'true');
        }

        toast.success('Match started! Loading code editor...');
        // Navigate to the code editor with the match ID
        navigate(`/match/${match._id}`);
      } catch (error) {
        console.error('Failed to start solo match:', error);
        toast.error(error.response?.data?.message || 'Failed to start solo match');
        // Redirect back to dashboard after error
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } finally {
        setLoading(false);
      }
    };

    initiateSoloMatch();
  }, [startSoloMatch, navigate, problemId, isDailyChallenge]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-500 border-t-pink-500 mx-auto mb-6"></div>
        <h2 className="text-2xl font-bold text-white mb-2">Starting Solo Practice</h2>
        <p className="text-slate-400">Preparing your coding challenge...</p>
      </div>
    </div>
  );
}

