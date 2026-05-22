import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/userStore';
import { useAuthStore } from '../store/authStore';
import { toast } from 'react-hot-toast';
import { Eye, MessageSquare, Star, ArrowRight, ChevronDown, Info, CheckCircle2, List, FileCode, Check, CheckSquare } from 'lucide-react';
import axios from 'axios';
import ThemeToggle from '../components/ThemeToggle';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Profile() {
  const { username } = useParams();
  const navigate = useNavigate();
  const { getUserProfile, getUserSubmissionStats, getUserHeatmap, updateProfile } = useUserStore();
  const { user: currentUser, setUser } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [heatmap, setHeatmap] = useState(null);
  const [loading, setLoading] = useState(true);

  // Edit Profile States
  const [showEditModal, setShowEditModal] = useState(false);
  const [editUsername, setEditUsername] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editBio, setEditBio] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  const isOwnProfile = currentUser?.username === username;

  const handleOpenEdit = () => {
    setEditUsername(profile?.username || '');
    setEditEmail(currentUser?.email || '');
    setEditBio(profile?.bio || '');
    setShowEditModal(true);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!editUsername.trim()) {
      toast.error('Username cannot be empty');
      return;
    }
    try {
      setSavingProfile(true);
      const updatedUser = await updateProfile({
        username: editUsername,
        email: editEmail,
        bio: editBio
      });
      toast.success('Profile updated successfully!');
      
      // Update global auth user
      setUser({
        ...currentUser,
        username: updatedUser.username,
        email: updatedUser.email,
        bio: updatedUser.bio
      });

      // Close modal
      setShowEditModal(false);

      // Navigate to new profile if username changed
      if (updatedUser.username !== username) {
        navigate(`/profile/${updatedUser.username}`);
      } else {
        // Just refresh local profile state
        setProfile({
          ...profile,
          username: updatedUser.username,
          bio: updatedUser.bio
        });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const [profileData, statsData, heatmapData] = await Promise.all([
          getUserProfile(username),
          getUserSubmissionStats(username).catch(() => null),
          getUserHeatmap(username).catch(() => null)
        ]);
        setProfile(profileData);
        setStats(statsData);
        setHeatmap(heatmapData);
      } catch (error) {
        toast.error('Failed to load profile');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username, getUserProfile, getUserSubmissionStats, getUserHeatmap, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafafa] dark:bg-dark-950 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-gray-300 border-t-green-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!profile) return null;

  const generateDynamicHeatmap = () => {
    const submissionMap = {};
    if (heatmap) {
      heatmap.forEach(item => {
        submissionMap[item.date] = item.count;
      });
    }

    const today = new Date();
    const monthsData = [];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    for (let i = 11; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const year = d.getFullYear();
      const month = d.getMonth();
      const numDays = new Date(year, month + 1, 0).getDate();
      
      const monthColumns = [];
      let currentWeek = Array(7).fill(null);
      
      for (let day = 1; day <= numDays; day++) {
        const dateObj = new Date(year, month, day);
        const dayOfWeek = dateObj.getDay();
        
        const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        
        currentWeek[dayOfWeek] = {
          date: dateString,
          count: submissionMap[dateString] || 0,
          isFuture: dateObj > today
        };

        if (dayOfWeek === 6 || day === numDays) {
          monthColumns.push([...currentWeek]);
          currentWeek = Array(7).fill(null);
        }
      }

      monthsData.push({
        name: monthNames[month],
        columns: monthColumns
      });
    }

    return monthsData;
  };

  const dynamicHeatmap = generateDynamicHeatmap();

  const getHeatmapColor = (count) => {
    if (count === 0) return 'bg-[#ebebeb] dark:bg-[#333]';
    if (count < 2) return 'bg-[#c6e48b] dark:bg-[#0e4429]';
    if (count < 4) return 'bg-[#7bc96f] dark:bg-[#006d32]';
    if (count < 6) return 'bg-[#239a3b] dark:bg-[#26a641]';
    return 'bg-[#196127] dark:bg-[#39d353]';
  };

  const solvedTotal = stats?.solvedProblems?.total || profile.totalSolved || 0;
  const easySolved = stats?.solvedProblems?.easy || profile.easySolved || 0;
  const mediumSolved = stats?.solvedProblems?.medium || profile.mediumSolved || 0;
  const hardSolved = stats?.solvedProblems?.hard || profile.hardSolved || 0;

  const totalEasy = stats?.systemTotals?.easy || 1;
  const totalMedium = stats?.systemTotals?.medium || 1;
  const totalHard = stats?.systemTotals?.hard || 1;
  const totalProblems = stats?.systemTotals?.total || 1;

  const easyPercent = Math.min((easySolved / totalEasy) * 100, 100) || 0;
  const medPercent = Math.min((mediumSolved / totalMedium) * 100, 100) || 0;
  const hardPercent = Math.min((hardSolved / totalHard) * 100, 100) || 0;

  const hasContestRating = profile?.hasContestRating || false;
  const contestRating = profile?.contestRating || 0;
  const globalRank = Math.max(1, 100000 - (profile.rating || 0) * 10).toLocaleString();
  const totalUsers = (stats?.totalUsers || 1).toLocaleString();
  const topPercent = hasContestRating
    ? Math.max(0.01, (100 - (contestRating / 30))).toFixed(2)
    : Math.max(0.01, (100 - ((profile.rating || 0) / 30))).toFixed(2);
  
  const acceptanceRate = profile.totalMatches > 0 ? ((profile.wins / profile.totalMatches) * 100).toFixed(2) : (stats?.acceptanceRate || 0).toFixed(2);
  
  const totalActiveDays = heatmap ? heatmap.filter(day => day.count > 0).length : 0;
  
  const timeSince = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
  };

  // Contest Rating Graph Data (only from contest history)
  const getContestGraphData = () => {
    const history = profile?.contestRatingHistory || [];
    if (history.length === 0) return { path: '', points: [], minDate: new Date(), maxDate: new Date() };
    if (history.length === 1) return { 
      path: 'M0,10 L100,10', 
      points: [{x: 100, y: 10, rating: history[0].rating, contestTitle: history[0].contestTitle}],
      minDate: new Date(history[0].date),
      maxDate: new Date()
    };

    const minRating = Math.min(...history.map(h => h.rating)) - 50;
    const maxRating = Math.max(...history.map(h => h.rating)) + 50;
    const range = maxRating - minRating || 1;
    
    const startTime = new Date(history[0].date).getTime();
    const endTime = Math.max(new Date(history[history.length - 1].date).getTime(), startTime + 86400000);
    const timeRange = endTime - startTime;

    let path = '';
    const points = [];
    history.forEach((h, i) => {
      const x = ((new Date(h.date).getTime() - startTime) / timeRange) * 100;
      const y = 20 - (((h.rating - minRating) / range) * 20);
      points.push({ x, y, rating: h.rating, date: h.date, contestTitle: h.contestTitle, change: h.change });
      if (i === 0) path += `M${x},${y} `;
      else path += `L${x},${y} `;
    });

    return { path, points, minDate: new Date(startTime), maxDate: new Date(endTime) };
  };

  const graphData = getContestGraphData();
  const highlightedBarIndex = Math.min(19, Math.max(0, 19 - Math.floor((topPercent / 100) * 20)));

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#000000] text-[#262626] dark:text-[#eff2f6] font-sans">
      <header className="bg-white dark:bg-[#282828] border-b border-gray-200 dark:border-gray-800 h-14 flex items-center px-6 sticky top-0 z-50">
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-6 h-6 bg-yellow-500 rounded-sm"></div>
          <span className="font-semibold text-lg">CodeBattle</span>
        </div>
        <div className="ml-auto">
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-[1150px] mx-auto px-4 py-8 flex flex-col lg:flex-row items-start gap-8">
        
        {/* Left Column (No Cards, Transparent Background) */}
        <div className="w-full lg:w-[280px] flex-shrink-0">
          
          <div className="flex items-start gap-4 mb-5">
            <div className="w-[84px] h-[84px] bg-[#2c3e50] dark:bg-[#34495e] rounded-lg flex items-center justify-center text-4xl font-semibold text-white shadow-sm">
              {profile.username.charAt(0).toUpperCase()}
            </div>
            <div className="pt-1">
              <h1 className="text-xl font-semibold text-[#262626] dark:text-[#eff2f6] flex items-center gap-2">
                {profile.username}
                <CheckCircle2 className="w-4 h-4 text-green-500" />
              </h1>
              <p className="text-[#8c8c8c] text-[13px] mb-2">{profile.email ? profile.email.split('@')[0] : username}</p>
              {profile.bio && (
                <p className="text-[#5c5c5c] dark:text-[#bfbfbf] text-[13px] italic mb-3 max-w-[180px] break-words">
                  "{profile.bio}"
                </p>
              )}
              <div className="text-[13px] text-[#262626] dark:text-[#eff2f6]">
                Rank <span className="font-semibold">{globalRank}</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-4 text-[13px] text-[#262626] dark:text-[#eff2f6] mb-5">
            <div><span className="font-semibold">{profile.following?.length || 0}</span> Following</div>
            <div className="w-[1px] h-4 bg-[#f0f0f0] dark:bg-[#404040]"></div>
            <div><span className="font-semibold">{profile.followers?.length || 0}</span> Followers</div>
          </div>
          
          {isOwnProfile && (
            <button onClick={handleOpenEdit} className="w-full py-2 bg-[#e5f5ec] dark:bg-[#1a3321] text-[#008a3c] dark:text-[#2cbb5d] text-sm font-semibold rounded hover:bg-[#d2eedc] dark:hover:bg-[#1f4028] transition-colors mb-6">
              Edit Profile
            </button>
          )}

          <div className="w-full h-[1px] bg-[#f0f0f0] dark:bg-[#404040] mb-6"></div>

          {/* Community Stats */}
          <div className="mb-6">
            <h3 className="text-[13px] font-semibold text-[#262626] dark:text-[#eff2f6] mb-4">Community Stats</h3>
            <div className="space-y-4 text-[13px]">
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <span className="text-[#8c8c8c] flex items-center gap-2"><Eye className="w-4 h-4 text-blue-500" /> Views</span>
                  <span className="text-[#bfbfbf] text-[11px] ml-6 mt-0.5">Last week {profile.viewsLastWeek || 0}</span>
                </div>
                <span className="text-[#262626] dark:text-[#eff2f6] mt-0.5">{profile.views || 0}</span>
              </div>
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <span className="text-[#8c8c8c] flex items-center gap-2"><CheckSquare className="w-4 h-4 text-cyan-500" /> Solution</span>
                  <span className="text-[#bfbfbf] text-[11px] ml-6 mt-0.5">Last week {profile.solutionsLastWeek || 0}</span>
                </div>
                <span className="text-[#262626] dark:text-[#eff2f6] mt-0.5">{profile.solutions || 0}</span>
              </div>
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <span className="text-[#8c8c8c] flex items-center gap-2"><MessageSquare className="w-4 h-4 text-green-500" /> Discuss</span>
                  <span className="text-[#bfbfbf] text-[11px] ml-6 mt-0.5">Last week {profile.discussLastWeek || 0}</span>
                </div>
                <span className="text-[#262626] dark:text-[#eff2f6] mt-0.5">{profile.discuss || 0}</span>
              </div>
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <span className="text-[#8c8c8c] flex items-center gap-2"><Star className="w-4 h-4 text-orange-400" /> Reputation</span>
                  <span className="text-[#bfbfbf] text-[11px] ml-6 mt-0.5">Last week {profile.reputationLastWeek || 0}</span>
                </div>
                <span className="text-[#262626] dark:text-[#eff2f6] mt-0.5">{profile.reputation || 0}</span>
              </div>
            </div>
          </div>

          <div className="w-full h-[1px] bg-[#f0f0f0] dark:bg-[#404040] mb-6"></div>

          {/* Languages */}
          <div className="mb-6">
            <h3 className="text-[13px] font-semibold text-[#262626] dark:text-[#eff2f6] mb-4">Languages</h3>
            <div className="space-y-3 text-[12px]">
              {stats?.languageStats?.length > 0 ? (
                stats.languageStats.map((l, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <span className="bg-[#f2f3f4] dark:bg-[#333] px-2.5 py-1 rounded-full text-[#5c5c5c] dark:text-[#bfbfbf]">
                      {l._id}
                    </span>
                    <span className="text-[#8c8c8c]">
                      <span className="font-semibold text-[#262626] dark:text-[#eff2f6] mr-1">{l.count}</span> problems solved
                    </span>
                  </div>
                ))
              ) : (
                <div className="flex justify-between items-center">
                  <span className="bg-[#f2f3f4] dark:bg-[#333] px-2.5 py-1 rounded-full text-[#5c5c5c] dark:text-[#bfbfbf]">
                    C++
                  </span>
                  <span className="text-[#8c8c8c]">
                    <span className="font-semibold text-[#262626] dark:text-[#eff2f6] mr-1">{solvedTotal}</span> problems solved
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="w-full h-[1px] bg-[#f0f0f0] dark:bg-[#404040] mb-6"></div>

          {/* Skills */}
          <div>
            <h3 className="text-[13px] font-semibold text-[#262626] dark:text-[#eff2f6] mb-4">Skills</h3>
            <div className="space-y-3 text-[12px]">
              <div className="flex justify-between items-center">
                <span className="text-[#262626] dark:text-[#eff2f6] font-semibold flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full inline-block ${
                    (profile.rating || 0) >= 2000 ? 'bg-red-500' : 
                    (profile.rating || 0) >= 1500 ? 'bg-orange-500' : 
                    (profile.rating || 0) >= 1000 ? 'bg-yellow-500' :
                    (profile.rating || 0) >= 500 ? 'bg-green-500' : 'bg-gray-400'
                  }`}></span> 
                  {(profile.rating || 0) >= 2000 ? 'Master' : 
                   (profile.rating || 0) >= 1500 ? 'Advanced' : 
                   (profile.rating || 0) >= 1000 ? 'Intermediate' :
                   (profile.rating || 0) >= 500 ? 'Beginner' : 'Newbie'}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column (With White Cards) */}
        <div className="flex-1 space-y-4 w-full min-w-0">
          
          {/* Top Banner - Ratings */}
          {hasContestRating ? (
            /* Full Contest Rating Banner with Graph (shown after first contest) */
            <div className="bg-white dark:bg-[#282828] rounded-lg p-5 shadow-sm flex min-h-[170px]">
              <div className="w-[60%] border-r border-[#f0f0f0] dark:border-[#404040] pr-6 flex flex-col relative">
                <div className="flex gap-8 mb-2">
                  <div>
                    <p className="text-[#8c8c8c] text-[12px] mb-1">Contest Rating</p>
                    <p className="text-[28px] leading-tight font-semibold text-[#262626] dark:text-[#eff2f6]">{profile.contestRating || 0}</p>
                  </div>
                  <div>
                    <p className="text-[#8c8c8c] text-[12px] mb-1">Battle Rating</p>
                    <p className="text-[13px] mt-1 font-semibold text-[#262626] dark:text-[#eff2f6]">{profile.rating || 0}</p>
                  </div>
                  <div>
                    <p className="text-[#8c8c8c] text-[12px] mb-1">Global Ranking</p>
                    <p className="text-[13px] mt-1 font-semibold text-[#262626] dark:text-[#eff2f6]">
                      {globalRank}<span className="text-[#bfbfbf] font-normal ml-1">/{totalUsers}</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-[#8c8c8c] text-[12px] mb-1">Contests</p>
                    <p className="text-[13px] mt-1 font-semibold text-[#262626] dark:text-[#eff2f6]">{profile.contestsParticipated || 0}</p>
                  </div>
                </div>
                <div className="flex-1 relative w-full mt-6">
                  <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 20">
                    <path d={graphData.path} fill="none" stroke="#ffa116" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                    {graphData.points.map((p, i) => (
                      <circle key={i} cx={p.x} cy={p.y} r="1.5" fill={i === graphData.points.length - 1 ? "#ffa116" : "#ffffff"} stroke="#ffa116" strokeWidth="0.5" />
                    ))}
                    {/* Tooltip for latest point */}
                    {graphData.points.length > 0 && (
                      <g transform={`translate(${Math.min(80, Math.max(20, graphData.points[graphData.points.length - 1].x))}, -5)`}>
                        <rect x="-15" y="-3" width="30" height="14" rx="2" fill="white" stroke="#e5e5e5" strokeWidth="0.5" className="dark:fill-[#333] dark:stroke-[#555]"/>
                        <text x="0" y="7" fontSize="8" fill="#8c8c8c" textAnchor="middle">{graphData.points[graphData.points.length - 1].rating}</text>
                      </g>
                    )}
                  </svg>
                  <div className="absolute -bottom-1 w-full flex justify-between text-[11px] text-[#bfbfbf]">
                    <span>{graphData.minDate.toLocaleString('default', { month: 'short', year: 'numeric' })}</span>
                    <span>{graphData.maxDate.toLocaleString('default', { month: 'short', year: 'numeric' })}</span>
                  </div>
                </div>
              </div>

              <div className="w-[40%] pl-6 flex flex-col">
                <div>
                  <p className="text-[#8c8c8c] text-[12px] mb-1">Top</p>
                  <p className="text-[28px] leading-tight font-semibold text-[#262626] dark:text-[#eff2f6]">{topPercent}%</p>
                </div>
                <div className="flex-1 relative mt-4 flex items-end justify-start gap-[2px]">
                  {/* Dynamic Bar Chart */}
                  {[...Array(20)].map((_, i) => {
                    const isHighlighted = i === highlightedBarIndex;
                    const bellCurveHeight = 10 + 40 * Math.exp(-Math.pow(i - 10, 2) / 20);
                    return (
                      <div 
                        key={i} 
                        className={`w-[8px] rounded-t-[1px] ${isHighlighted ? 'bg-[#ffa116]' : 'bg-[#f0f0f0] dark:bg-[#404040]'}`} 
                        style={{ height: `${isHighlighted ? bellCurveHeight + 10 : bellCurveHeight}%` }}
                      ></div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* Simple Battle Rating Banner (no contests yet) */
            <div className="bg-white dark:bg-[#282828] rounded-lg p-5 shadow-sm">
              <div className="flex items-center gap-8">
                <div>
                  <p className="text-[#8c8c8c] text-[12px] mb-1">Battle Rating</p>
                  <p className="text-[28px] leading-tight font-semibold text-[#262626] dark:text-[#eff2f6]">{profile.rating || 0}</p>
                </div>
                <div>
                  <p className="text-[#8c8c8c] text-[12px] mb-1">Global Ranking</p>
                  <p className="text-[13px] mt-1 font-semibold text-[#262626] dark:text-[#eff2f6]">
                    {globalRank}<span className="text-[#bfbfbf] font-normal ml-1">/{totalUsers}</span>
                  </p>
                </div>
                <div>
                  <p className="text-[#8c8c8c] text-[12px] mb-1">Wins</p>
                  <p className="text-[13px] mt-1 font-semibold text-[#262626] dark:text-[#eff2f6]">{profile.wins || 0}</p>
                </div>
                <div>
                  <p className="text-[#8c8c8c] text-[12px] mb-1">Matches</p>
                  <p className="text-[13px] mt-1 font-semibold text-[#262626] dark:text-[#eff2f6]">{profile.totalMatches || 0}</p>
                </div>
              </div>
              <div className="mt-4 py-3 px-4 bg-[#f7f8fa] dark:bg-[#1e1e1e] rounded-lg">
                <p className="text-[12px] text-[#8c8c8c]">
                  Contest Rating will appear here after you participate in your first rated contest.
                </p>
              </div>
            </div>
          )}

          {/* Middle Row: Solved & Badges */}
          <div className="flex items-stretch gap-4 min-h-[190px]">
            
            {/* Solved Problems Chart */}
            <div className="w-[55%] bg-white dark:bg-[#282828] rounded-lg p-5 shadow-sm flex items-center justify-between">
              <div className="relative w-28 h-28 flex-shrink-0 mx-auto">
                {/* SVG Donut Chart with Dots */}
                <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                  <path className="text-[#f0f0f0] dark:text-[#404040]" strokeWidth="1" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="text-[#00b8a3]" strokeDasharray={`${Math.max(easyPercent, 1)}, 100`} strokeWidth="1" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="text-[#ffc01e]" strokeDasharray={`${Math.max(medPercent, 1)}, 100`} strokeDashoffset={`-${easyPercent}`} strokeWidth="1" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="text-[#ef4743]" strokeDasharray={`${Math.max(hardPercent, 1)}, 100`} strokeDashoffset={`-${easyPercent + medPercent}`} strokeWidth="1" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <circle cx="18" cy="2.0845" r="1.5" fill="#00b8a3" />
                  <circle cx="33.9155" cy="18" r="1.5" fill="#ef4743" />
                  <circle cx="2.0845" cy="18" r="1.5" fill="#ffc01e" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center pt-1">
                  <span className="text-[22px] font-semibold text-[#262626] dark:text-[#eff2f6] leading-none mb-1">
                    {acceptanceRate}<span className="text-[12px] font-normal">%</span>
                  </span>
                  <span className="text-[11px] text-[#262626] dark:text-[#eff2f6]">
                    Acceptance
                  </span>
                  <span className="text-[10px] text-[#8c8c8c] mt-2">
                    {solvedTotal} submissions
                  </span>
                </div>
              </div>

              <div className="flex flex-col justify-center gap-4 w-[100px] ml-auto mr-4 text-center">
                <div className="flex flex-col">
                  <span className="text-[#00b8a3] text-[12px] mb-0.5">Easy</span>
                  <span className="text-[#262626] dark:text-[#eff2f6] text-[13px] font-semibold">{easySolved}<span className="text-[#8c8c8c] font-normal">/{totalEasy}</span></span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[#ffc01e] text-[12px] mb-0.5">Med.</span>
                  <span className="text-[#262626] dark:text-[#eff2f6] text-[13px] font-semibold">{mediumSolved}<span className="text-[#8c8c8c] font-normal">/{totalMedium}</span></span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[#ef4743] text-[12px] mb-0.5">Hard</span>
                  <span className="text-[#262626] dark:text-[#eff2f6] text-[13px] font-semibold">{hardSolved}<span className="text-[#8c8c8c] font-normal">/{totalHard}</span></span>
                </div>
              </div>
            </div>

            {/* Badges Box */}
            <div className="w-[45%] bg-white dark:bg-[#282828] rounded-lg p-5 shadow-sm relative flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-[#8c8c8c] text-[13px]">Badges</span>
                  <div className="text-[22px] font-semibold text-[#262626] dark:text-[#eff2f6] mt-1">{profile.badges?.length || 0}</div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#8c8c8c]" />
              </div>
              
              <div className="flex-1 flex justify-center items-center">
                <div className="w-16 h-16 flex-shrink-0">
                   {profile.badges?.length > 0 ? (
                     <img src={profile.badges[0].iconUrl || "https://assets.leetcode.com/static_assets/public/images/badges/2024/gif/2024-05.gif"} className="w-full h-full object-contain" alt="badge"/>
                   ) : (
                     <div className="w-full h-full rounded-full bg-[#f0f0f0] dark:bg-[#333] flex items-center justify-center text-[#8c8c8c]">
                       <Star className="w-6 h-6 opacity-50" />
                     </div>
                   )}
                </div>
              </div>
              
              <div className="mt-auto">
                <p className="text-[#8c8c8c] text-[11px] mb-0.5">Most Recent Badge</p>
                <p className="text-[13px] text-[#262626] dark:text-[#eff2f6]">{profile.badges?.[0]?.name || 'No badges yet'}</p>
              </div>
            </div>
          </div>

          {/* Submissions Heatmap */}
          <div className="bg-white dark:bg-[#282828] rounded-lg p-5 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[15px] font-semibold text-[#262626] dark:text-[#eff2f6] flex items-center gap-1.5">
                {stats?.totalSubmissions || 0} <span className="text-[#8c8c8c] font-normal">submissions in the past one year</span> <Info className="w-3.5 h-3.5 text-[#8c8c8c] ml-1" />
              </h3>
              <div className="flex items-center gap-4 text-[12px] text-[#8c8c8c]">
                <span>Total active days: <span className="text-[#262626] dark:text-[#eff2f6] font-semibold">{totalActiveDays}</span></span>
                <span>Max streak: <span className="text-[#262626] dark:text-[#eff2f6] font-semibold">{profile.longestStreak || 0}</span></span>
                <button className="flex items-center gap-1.5 px-3 py-1 bg-[#f0f0f0] dark:bg-[#333] rounded-md text-[#262626] dark:text-[#eff2f6]">
                  Current <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            
            <div className="w-full overflow-x-auto">
              <div className="flex gap-[6px] min-w-max pb-2">
                {dynamicHeatmap.map((month, mIdx) => (
                  <div key={mIdx} className="flex flex-col">
                    <div className="flex gap-[3px]">
                      {month.columns.map((col, cIdx) => (
                        <div key={cIdx} className="flex flex-col gap-[3px]">
                          {col.map((day, dIdx) => (
                            day ? (
                              <div 
                                key={dIdx} 
                                className={`w-3 h-3 rounded-[2px] ${day.isFuture ? 'bg-transparent' : getHeatmapColor(day.count)}`}
                                title={`${day.count} submissions on ${day.date}`}
                              ></div>
                            ) : (
                              <div key={dIdx} className="w-3 h-3 bg-transparent"></div>
                            )
                          ))}
                        </div>
                      ))}
                    </div>
                    <div className="text-[11px] text-[#8c8c8c] text-center mt-2">
                      {month.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent AC */}
          <div className="bg-white dark:bg-[#282828] rounded-lg shadow-sm">
            <div className="flex border-b border-[#f0f0f0] dark:border-[#404040]">
              <button className="px-5 py-3.5 text-[13px] font-semibold text-[#262626] dark:text-[#eff2f6] border-b-2 border-[#262626] dark:border-white flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-[#8c8c8c]" /> Recent AC
              </button>
              <button className="px-5 py-3.5 text-[13px] text-[#8c8c8c] flex items-center gap-2 hover:bg-[#fafafa] dark:hover:bg-[#333]">
                <List className="w-4 h-4" /> List
              </button>
              <button className="px-5 py-3.5 text-[13px] text-[#8c8c8c] flex items-center gap-2 hover:bg-[#fafafa] dark:hover:bg-[#333]">
                <CheckCircle2 className="w-4 h-4" /> Solutions
              </button>
              <button className="px-5 py-3.5 text-[13px] text-[#8c8c8c] flex items-center gap-2 hover:bg-[#fafafa] dark:hover:bg-[#333]">
                <MessageSquare className="w-4 h-4" /> Discuss
              </button>
              <div 
                onClick={() => navigate('/submissions')} 
                className="ml-auto px-5 py-3.5 text-[13px] text-[#8c8c8c] flex items-center hover:text-[#262626] dark:hover:text-[#eff2f6] cursor-pointer"
              >
                View all submissions <ArrowRight className="w-3 h-3 ml-1" />
              </div>
            </div>
            <div className="divide-y divide-[#f0f0f0] dark:divide-[#404040]">
              {stats?.recentSubmissions?.length > 0 ? (
                stats.recentSubmissions.map((sub, idx) => (
                  <div key={idx} className="px-5 py-3.5 flex justify-between items-center hover:bg-[#fafafa] dark:hover:bg-[#333] cursor-pointer">
                    <span className="text-[13px] font-medium text-[#262626] dark:text-[#eff2f6]">
                      {sub.problem?.title || 'Unknown Problem'}
                    </span>
                    <span className="text-xs text-[#8c8c8c]">
                      {timeSince(sub.submittedAt)}
                    </span>
                  </div>
                ))
              ) : (
                <div className="px-5 py-8 text-center text-[13px] text-[#8c8c8c]">
                  No recent accepted submissions
                </div>
              )}
            </div>
          </div>

        </div>
      </main>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#282828] border border-gray-200 dark:border-gray-800 rounded-lg max-w-md w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-[#202020]">
              <h3 className="font-semibold text-base text-[#262626] dark:text-white">Edit Profile</h3>
              <button 
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-white text-lg font-medium"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSaveProfile} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-[#8c8c8c] uppercase tracking-wider mb-1.5">Username</label>
                <input 
                  type="text" 
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  placeholder="Username"
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#404040] rounded text-sm text-[#262626] dark:text-[#eff2f6] placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-[#8c8c8c] uppercase tracking-wider mb-1.5">Email</label>
                <input 
                  type="email" 
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#404040] rounded text-sm text-[#262626] dark:text-[#eff2f6] placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-[#8c8c8c] uppercase tracking-wider mb-1.5">Bio</label>
                <textarea 
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="Tell us about yourself..."
                  maxLength={200}
                  rows={4}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#404040] rounded text-sm text-[#262626] dark:text-[#eff2f6] placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors resize-none"
                />
                <p className="text-[11px] text-gray-400 dark:text-[#8c8c8c] mt-1 text-right">{editBio.length}/200</p>
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button 
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-gray-200 dark:border-[#404040] text-sm font-semibold rounded text-[#8c8c8c] hover:bg-gray-50 dark:hover:bg-[#333] transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={savingProfile}
                  className="px-5 py-2 bg-green-500 text-white text-sm font-semibold rounded hover:bg-green-600 disabled:opacity-50 transition-colors"
                >
                  {savingProfile ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
