import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Headset } from 'lucide-react';

const Login = () => {
  // useState — React's way of storing data that can change
  // and re-render the component when it does
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate(); // lets us redirect after login

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
        const user = await login(email, password);

        if (user.role === 'admin') navigate('/admin');
        else if (user.role === 'engineer') navigate('/engineer');
        else navigate('/client');
    } catch (err) {
        setError(err.response?.data?.message || 'Login failed');
    } finally {
        setLoading(false);
        // Clear the fields every time, whether login succeeded or failed
        setEmail('');
        setPassword('');
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">

      {/* ── Left Brand Panel ── */}
      <div className="bg-nexdark p-10 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-12">
            <div className="w-6 h-6 rounded-md bg-nexaccent flex items-center justify-center">
                <Headset size={13} className="text-white" />
            </div>
            <span className="text-white text-sm font-medium">NexDesk</span>
          </div>
          <h1 className="text-2xl text-white font-medium mb-3">Welcome back</h1>
          <p className="text-gray-400 text-sm max-w-xs">
            Sign in to manage tickets, SLAs and client requests.
          </p>
        </div>
        <p className="text-gray-500 text-xs">
          Copy Cat Group · Kenya · Tanzania · Uganda · Rwanda
        </p>
      </div>

      {/* ── Right Form Panel ── */}
      <div className="bg-nexcanvas flex flex-col justify-center px-10 py-12">
        <div className="max-w-sm w-full mx-auto">
          <h2 className="text-lg font-medium text-nextext mb-1">Sign in</h2>
          <p className="text-sm text-nexmuted mb-6">
            Use your work account to continue
          </p>

          {/* Show error message only if one exists */}
          {error && (
            <div className="bg-red-50 text-red-700 text-sm px-3 py-2 rounded-md mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <label className="text-sm text-nextext block mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@copycatgroup.com"
              required
              className="w-full mb-4 px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
            />

            <label className="text-sm text-nextext block mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full mb-6 px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-nexdark text-white py-2.5 rounded-md text-sm font-medium disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="text-xs text-gray-400 text-center mt-5">
            Trouble signing in? Contact your admin
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;