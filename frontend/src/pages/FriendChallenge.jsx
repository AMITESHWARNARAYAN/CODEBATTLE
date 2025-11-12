import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMatchStore } from '../store/matchStore';
import { useAuthStore } from '../store/authStore';
import { toast } from 'react-hot-toast';
import { PaperAirplaneIcon, ArrowLeftIcon, EnvelopeIcon } from '@heroicons/react/24/solid';
import { getSocket, onChallengeRejected } from '../utils/socket';

export default function FriendChallenge() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { challengeFriendByEmail, loading } = useMatchStore();
  const [friendEmail, setFriendEmail] = useState('');
  const [challengeData, setChallengeData] = useState(null);
  const [isOnline, setIsOnline] = useState(false);
  const [currentMatchId, setCurrentMatchId] = useState(null);

  // Listen for challenge rejection only (acceptance is handled globally in App.jsx)
  useEffect(() => {
    onChallengeRejected((data) => {
      toast.error('Your challenge was rejected');
      setChallengeData(null);
      setCurrentMatchId(null);
    });
  }, [navigate]);

  const handleSendChallenge = async (e) => {
    e.preventDefault();

    if (!friendEmail.trim()) {
      toast.error('Please enter your friend\'s email');
      return;
    }

    if (!friendEmail.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    try {
      const data = await challengeFriendByEmail(friendEmail);
      setChallengeData(data);
      setCurrentMatchId(data.matchId);
      setIsOnline(data.isOnline);

      // PaperAirplaneIcon live notification if friend is online
      if (data.isOnline) {
        const socket = getSocket();
        socket.emit('send-challenge', {
          matchId: data.matchId,
          challengerEmail: user.email,
          challengerUsername: user.username,
          challengedEmail: friendEmail,
          challengedUsername: data.challengedUserIcon
        });
        toast.success(`Challenge sent to ${data.challengedUserIcon}! They're online now.`);
      } else {
        toast.success(`Challenge sent to ${friendEmail}. They'll see it when they log in.`);
      }

      setFriendEmail('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send challenge');
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="glass border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2 hover:bg-slate-700 rounded-lg transition"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back
          </button>
          <h1 className="text-2xl font-bold">Challenge a Friend</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-12">
        {!challengeData ? (
          <div className="card">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">👥</div>
              <h2 className="text-3xl font-bold mb-2">Challenge Your Friend</h2>
              <p className="text-slate-400">
                PaperAirplaneIcon a challenge via email. If they're online, they'll get a live notification!
              </p>
            </div>

            <form onSubmit={handleSendChallenge} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Friend's Email</label>
                <div className="flex items-center gap-2">
                  <EnvelopeIcon className="w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    value={friendEmail}
                    onChange={(e) => setFriendEmail(e.target.value)}
                    placeholder="friend@example.com"
                    className="input-field flex-1"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2 py-3"
              >
                <PaperAirplaneIcon className="w-4 h-4" />
                {loading ? 'Sending Challenge...' : 'PaperAirplaneIcon Challenge'}
              </button>
            </form>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card">
                <h3 className="text-lg font-bold mb-3">✨ Features</h3>
                <ul className="text-slate-400 space-y-2 text-sm">
                  <li>• 📧 PaperAirplaneIcon via email</li>
                  <li>• 🔔 Live notifications if online</li>
                  <li>• 🎯 Same DSA problem</li>
                  <li>• 🏆 Rating changes apply</li>
                </ul>
              </div>

              <div className="card">
                <h3 className="text-lg font-bold mb-3">🎯 How It Works</h3>
                <ul className="text-slate-400 space-y-2 text-sm">
                  <li>1. Enter friend's email</li>
                  <li>2. PaperAirplaneIcon challenge</li>
                  <li>3. They get notified</li>
                  <li>4. Start competing!</li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="card text-center">
            <div className="text-6xl mb-6">🎉</div>
            <h2 className="text-3xl font-bold mb-4">Challenge Sent!</h2>

            <div className="mb-8 p-4 bg-slate-800 rounded-lg">
              <p className="text-slate-400 text-sm mb-2">Challenged Player</p>
              <p className="text-xl font-bold">{challengeData.challengedUserIcon}</p>
              <p className="text-slate-400 text-sm mt-1">{challengeData.challengedUserIcon}</p>
            </div>

            {isOnline ? (
              <div className="mb-8 p-4 bg-green-900 border border-green-700 rounded-lg">
                <p className="text-green-300 text-sm">
                  ✅ Your friend is online! They'll see the challenge notification right now.
                </p>
              </div>
            ) : (
              <div className="mb-8 p-4 bg-yellow-900 border border-yellow-700 rounded-lg">
                <p className="text-yellow-300 text-sm">
                  ⏳ Your friend is offline. They'll see the challenge when they log in.
                </p>
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={() => navigate('/')}
                className="btn-secondary w-full"
              >
                Back to Dashboard
              </button>
              <button
                onClick={() => {
                  setChallengeData(null);
                  setFriendEmail('');
                }}
                className="btn-primary w-full"
              >
                PaperAirplaneIcon Another Challenge
              </button>
            </div>

            <div className="mt-8 p-4 bg-blue-900 border border-blue-700 rounded-lg">
              <p className="text-blue-300 text-sm">
                💡 Tip: Once your friend accepts the challenge, you'll both be taken to the code editor to solve the problem!
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

