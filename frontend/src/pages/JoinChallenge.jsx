import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMatchStore } from '../store/matchStore';
import { toast } from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';

export default function JoinChallenge() {
  const { inviteCode } = useParams();
  const navigate = useNavigate();
  const { joinFriendChallenge, loading } = useMatchStore();
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    const handleJoin = async () => {
      setJoining(true);
      try {
        const match = await joinFriendChallenge(inviteCode);
        toast.success('Joined challenge! Starting match...');
        setTimeout(() => {
          navigate(`/match/${match._id}`);
        }, 1500);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to join challenge');
        setTimeout(() => navigate('/'), 2000);
      } finally {
        setJoining(false);
      }
    };

    handleJoin();
  }, [inviteCode, joinFriendChallenge, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-500 mx-auto mb-6"></div>
        <h2 className="text-2xl font-bold mb-2">Joining Challenge...</h2>
        <p className="text-slate-400">Please wait while we set up your match</p>
      </div>
    </div>
  );
}

