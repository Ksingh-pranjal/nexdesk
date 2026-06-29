import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Headset, Ticket, LogOut, Bell, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { label: 'My tickets', path: '/engineer', icon: Ticket },
];

const EngineerLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-nexcanvas">
      <aside className="w-44 bg-nexdark flex-shrink-0 flex flex-col">
        <div className="flex items-center gap-2 px-4 py-5 border-b border-white/10">
          <div className="w-6 h-6 rounded-md bg-nexaccent flex items-center justify-center">
            <Headset size={13} className="text-white" />
          </div>
          <span className="text-white text-sm font-medium">NexDesk</span>
        </div>

        <nav className="flex flex-col gap-0.5 px-2.5 py-4 flex-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm ${
                  isActive ? 'bg-nexaccent/20 text-nexaccent font-medium' : 'text-gray-400'
                }`}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-2.5 py-4 border-t border-white/10">
          <button onClick={handleLogout} className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-gray-400 w-full">
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-end relative">
          <div className="flex items-center gap-4">

            {/* ── Notification Bell + Dropdown ── */}
            <div className="relative">
              <button onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}>
                <Bell size={17} className="text-gray-600" />
              </button>

              {notifOpen && (
                <div className="absolute right-0 top-8 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-nextext">Notifications</p>
                  </div>
                  <div className="px-4 py-6 text-center">
                    <p className="text-xs text-gray-400">No new notifications</p>
                  </div>
                </div>
              )}
            </div>

            {/* ── Profile + Dropdown ── */}
            <div className="relative">
              <button
                onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
                className="flex items-center gap-2"
              >
                <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-nexaccent">
                  {user?.name?.charAt(0) || 'E'}
                </div>
                <div className="text-left">
                  <p className="text-xs font-medium text-nextext leading-none">{user?.name}</p>
                  <p className="text-[10px] text-gray-400 leading-none mt-0.5 capitalize">{user?.role}</p>
                </div>
                <ChevronDown size={14} className="text-gray-400" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-10 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-nextext">{user?.name}</p>
                    <p className="text-xs text-gray-400">{user?.email}</p>
                  </div>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-sm text-red-600 flex items-center gap-2">
                    <LogOut size={14} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default EngineerLayout;