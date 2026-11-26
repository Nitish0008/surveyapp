import { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars,
  faChartColumn,
  faClipboardList,
  faClockRotateLeft,
  faCow,
  faDatabase,
  faEllipsis,
  faGear,
  faHome,
  faHouseMedical,
  faMapLocationDot,
  faPlus,
  faRightFromBracket,
  faUsers,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import govLogo from '../img/gov.png';
import { ROLE_LABELS, ROLES } from '../data/demoUsers';
import PwaInstallBanner from '../components/common/PwaInstallBanner';
import { useAuth } from '../hooks/useAuth';
import { useCensus } from '../hooks/useCensus';
import { useToast } from '../hooks/useToast';

const NAV_ITEMS = [
  {
    to: '/dashboard',
    label: 'Operator Home',
    mobileLabel: 'Home',
    icon: faHome,
    roles: [ROLES.ADMIN, ROLES.DISTRICT_USER, ROLES.DIRECTOR, ROLES.ENUMERATOR],
  },
  {
    to: '/households/new',
    label: 'Register Household',
    mobileLabel: 'Register',
    icon: faHouseMedical,
    roles: [ROLES.ADMIN, ROLES.DISTRICT_USER, ROLES.ENUMERATOR],
  },
  {
    to: '/households',
    label: 'Household Listing',
    mobileLabel: 'Drafts',
    icon: faClipboardList,
    roles: [ROLES.ADMIN, ROLES.DISTRICT_USER, ROLES.ENUMERATOR, ROLES.DIRECTOR],
  },
  {
    to: '/livestock/records',
    label: 'Livestock Records',
    mobileLabel: 'Livestock',
    icon: faCow,
    roles: [ROLES.ADMIN, ROLES.DISTRICT_USER, ROLES.ENUMERATOR, ROLES.DIRECTOR],
  },
  {
    to: '/masters/geography',
    label: 'Geographical Master',
    icon: faMapLocationDot,
    roles: [ROLES.ADMIN],
  },
  {
    to: '/masters/livestock',
    label: 'Livestock Master',
    icon: faDatabase,
    roles: [ROLES.ADMIN],
  },
  {
    to: '/users',
    label: 'User Management',
    icon: faUsers,
    roles: [ROLES.ADMIN],
  },
  {
    to: '/reports',
    label: 'Reports & Analytics',
    icon: faChartColumn,
    roles: [ROLES.ADMIN, ROLES.DISTRICT_USER, ROLES.DIRECTOR],
  },
  {
    to: '/activity-logs',
    label: 'Activity Logs',
    icon: faClockRotateLeft,
    roles: [ROLES.ADMIN, ROLES.DISTRICT_USER, ROLES.DIRECTOR],
  },
  {
    to: '/settings',
    label: 'Settings',
    icon: faGear,
    roles: [ROLES.ADMIN, ROLES.DISTRICT_USER, ROLES.ENUMERATOR, ROLES.DIRECTOR],
  },
];

export default function PortalLayout() {
  const { user, logout, isOnline } = useAuth();
  const { stats } = useCensus();
  const { showToast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const visibleNavItems = NAV_ITEMS.filter((item) =>
    item.roles.includes(user?.role)
  );

  const canRegister = user?.role !== ROLES.DIRECTOR;

  const activeItem =
    visibleNavItems.find((item) => location.pathname === item.to) ||
    (location.pathname.startsWith('/households/')
      ? { label: 'Household Census', icon: faHouseMedical }
      : visibleNavItems[0]);

  const handleLogout = () => {
    logout();
    showToast('You have been signed out safely.', 'info', 'Signed Out');
    navigate('/login', { replace: true });
  };

  const renderNavLinks = (onNavigate) => (
    <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1" aria-label="Primary">
      {visibleNavItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/households'}
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
              isActive
                ? 'bg-[#0B5D36] text-white shadow-sm'
                : 'text-slate-300 hover:bg-white/8 hover:text-white'
            }`
          }
        >
          <span className="flex items-center gap-3 min-w-0">
            <FontAwesomeIcon icon={item.icon} className="w-4 shrink-0" />
            <span className="truncate">{item.label}</span>
          </span>
          {item.to === '/households' && stats.drafts > 0 && (
            <span className="rounded-full bg-amber-400/20 text-amber-200 px-2 py-0.5 text-[10px] font-bold tabular-nums">
              {stats.drafts}
            </span>
          )}
        </NavLink>
      ))}
    </nav>
  );

  return (
    <div className="min-h-dvh bg-gradient-to-b from-[#EAF5EE] via-[#F2F8F4] to-[#E6F3EB] lg:bg-none lg:bg-[#f2f6f3] flex flex-col lg:flex-row">
      {/* Desktop Smooth Sliding Sidebar (Right-side border radius only) */}
      <aside
        aria-label="Desktop sidebar"
        className={`hidden lg:flex lg:w-72 lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 z-40 bg-[#0d1f18] text-white border-r border-emerald-950/60 rounded-r-3xl overflow-hidden shadow-xl transition-transform duration-300 ease-out ${
          desktopSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between gap-2 px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={govLogo}
              alt="Government of Assam"
              className="h-10 w-10 rounded-lg bg-white p-1 object-contain shrink-0"
            />
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-300 truncate">
                Assam Veterinary Dept.
              </p>
              <p className="text-sm font-bold text-white truncate">
                Livestock Census Portal
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setDesktopSidebarOpen(false)}
            aria-label="Collapse sidebar"
            className="h-8 w-8 rounded-lg inline-flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white transition cursor-pointer shrink-0"
          >
            <FontAwesomeIcon icon={faXmark} className="text-sm" />
          </button>
        </div>

        {renderNavLinks()}

        <div className="p-4 border-t border-white/10 bg-black/20">
          <div className="mb-3">
            <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
            <p className="text-[11px] text-emerald-300 truncate">
              {ROLE_LABELS[user?.role]}
            </p>
            <p className="text-[11px] text-slate-400 truncate mt-0.5">
              Jurisdiction: {user?.district}
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-white/8 hover:bg-rose-600/90 px-3 py-2 text-xs font-semibold text-slate-200 hover:text-white transition cursor-pointer"
          >
            <FontAwesomeIcon icon={faRightFromBracket} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Smooth Slide-Over Drawer (Right-side border radius only) */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${
          mobileMenuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden={!mobileMenuOpen}
      >
        <div
          className="fixed inset-0 bg-slate-900/55 backdrop-blur-[1px]"
          onClick={() => setMobileMenuOpen(false)}
        />
        <aside
          className={`relative z-10 h-full w-72 max-w-[85vw] bg-[#0d1f18] text-white flex flex-col rounded-r-3xl overflow-hidden shadow-2xl transition-transform duration-300 ease-out ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={govLogo}
                alt="Assam Govt"
                className="h-9 w-9 rounded-lg bg-white p-1 object-contain shrink-0"
              />
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                  Govt. of Assam
                </p>
                <p className="text-sm font-bold truncate">Livestock Census</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close navigation menu"
              className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white cursor-pointer"
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>

          {renderNavLinks(() => setMobileMenuOpen(false))}

          <div className="p-4 border-t border-white/10 bg-black/20">
            <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
            <p className="text-[11px] text-emerald-300 truncate">
              {ROLE_LABELS[user?.role]} &bull; {user?.district}
            </p>
            <button
              type="button"
              onClick={handleLogout}
              className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 hover:bg-rose-600 px-3 py-2.5 text-xs font-semibold text-white cursor-pointer"
            >
              <FontAwesomeIcon icon={faRightFromBracket} />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>
      </div>

      {/* Main Content Shell */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-[padding] duration-300 ease-out ${
          desktopSidebarOpen ? 'lg:pl-72' : 'lg:pl-0'
        }`}
      >
        {/* Mobile Compact Institutional Header (< lg) */}
        <div className="lg:hidden sticky top-0 z-30">
          <div className="relative overflow-hidden bg-gradient-to-r from-[#F6FBF7] via-white to-[#E5F4EB] px-4 py-2.5 border-b border-emerald-100 shadow-[0_4px_14px_rgba(11,93,54,0.06)]">
            {/* Subtle decorative green wave shape in top-right */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-8 -top-10 h-28 w-36 rounded-bl-[64px] bg-gradient-to-bl from-[#0B5D36] to-[#198754] opacity-90"
            />
            <div className="relative flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={govLogo}
                  alt="Government of Assam"
                  className="h-10 w-10 object-contain shrink-0"
                />
                <div className="border-l border-emerald-700/25 pl-2.5 min-w-0 leading-tight">
                  <p className="text-[11px] font-semibold text-slate-700 truncate">
                    অসম চৰকাৰ
                  </p>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-[#0B5D36] truncate">
                    Government of Assam
                  </p>
                  <p className="text-xs font-extrabold text-[#0B5D36] truncate">
                    Veterinary Department
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open menu"
                className="h-10 w-10 rounded-full bg-white text-[#0B5D36] shadow-sm border border-emerald-100 hover:bg-emerald-50 inline-flex items-center justify-center cursor-pointer shrink-0"
              >
                <FontAwesomeIcon icon={faBars} className="text-base" />
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Header (lg+) */}
        <header className="hidden lg:flex sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200 px-6 h-16 items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setDesktopSidebarOpen((prev) => !prev)}
              aria-label={desktopSidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
              className="h-10 w-10 inline-flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition cursor-pointer shrink-0"
            >
              <FontAwesomeIcon icon={faBars} />
            </button>

            <div className="min-w-0">
              <h1 className="text-lg font-bold text-slate-900 truncate">
                {activeItem?.label || 'Operator Portal'}
              </h1>
              <p className="text-xs text-slate-500 truncate">
                {user?.district} &bull; {user?.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border ${
                isOnline
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  isOnline ? 'bg-emerald-600' : 'bg-amber-500'
                }`}
              />
              <span>{isOnline ? 'Online' : 'Offline'}</span>
            </span>

            <span className="inline-flex items-center rounded-full bg-slate-100 border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700">
              {ROLE_LABELS[user?.role]}
            </span>
          </div>
        </header>

        {/* Main Workspace */}
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 pb-28 lg:pb-8 space-y-4 max-w-7xl w-full mx-auto">
          <PwaInstallBanner className="lg:hidden" />
          <Outlet />
        </main>
      </div>

      {/* Mobile App Curved Bottom Navigation Bar */}
      <nav
        aria-label="Mobile bottom navigation"
        className="lg:hidden fixed bottom-0 inset-x-0 z-40"
      >
        {/* Subtle green wave backdrop strip behind rounded bottom bar */}
        <div
          aria-hidden="true"
          className="h-3 bg-gradient-to-r from-[#87CFA0]/40 via-[#157A46]/30 to-[#0B5D36]/45 rounded-t-3xl -mb-2"
        />
        <div className="bg-white/98 backdrop-blur-md rounded-t-3xl border-t border-emerald-100 pb-safe shadow-[0_-8px_28px_rgba(11,93,54,0.10)]">
          <div
            className={`grid h-16 items-center px-2 ${
              canRegister ? 'grid-cols-5' : 'grid-cols-4'
            }`}
          >
            <NavLink
              to="/dashboard"
              className="flex flex-col items-center justify-center"
            >
              {({ isActive }) => (
                <div
                  className={`flex flex-col items-center justify-center gap-0.5 rounded-2xl px-3.5 py-1.5 transition ${
                    isActive
                      ? 'bg-[#DFF3E6] text-[#0B5D36]'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <FontAwesomeIcon icon={faHome} className="text-base" />
                  <span className="text-[10px] font-bold">Home</span>
                </div>
              )}
            </NavLink>

            <NavLink
              to="/households"
              end
              className="flex flex-col items-center justify-center"
            >
              {({ isActive }) => (
                <div
                  className={`flex flex-col items-center justify-center gap-0.5 rounded-2xl px-3 py-1.5 transition ${
                    isActive
                      ? 'bg-[#DFF3E6] text-[#0B5D36]'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <span className="relative">
                    <FontAwesomeIcon icon={faClipboardList} className="text-base" />
                    {stats.drafts > 0 && (
                      <span className="absolute -top-1.5 -right-2.5 min-w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-bold px-1 flex items-center justify-center ring-2 ring-white">
                        {stats.drafts}
                      </span>
                    )}
                  </span>
                  <span className="text-[10px] font-semibold">Drafts</span>
                </div>
              )}
            </NavLink>

            {canRegister && (
              <div className="flex flex-col items-center justify-center">
                <NavLink
                  to="/households/new"
                  aria-label="Register New Household"
                  className={({ isActive }) =>
                    `-mt-7 h-14 w-14 rounded-full flex items-center justify-center text-white shadow-[0_8px_20px_rgba(11,93,54,0.35)] ring-4 ring-white transition active:scale-95 ${
                      isActive
                        ? 'bg-[#08492A]'
                        : 'bg-gradient-to-br from-[#17824B] to-[#084D2C]'
                    }`
                  }
                >
                  <FontAwesomeIcon icon={faPlus} className="text-xl" />
                </NavLink>
                <span className="text-[10px] font-bold text-[#0B5D36] mt-0.5">
                  Register
                </span>
              </div>
            )}

            <NavLink
              to="/livestock/records"
              className="flex flex-col items-center justify-center"
            >
              {({ isActive }) => (
                <div
                  className={`flex flex-col items-center justify-center gap-0.5 rounded-2xl px-2.5 py-1.5 transition ${
                    isActive
                      ? 'bg-[#DFF3E6] text-[#0B5D36]'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <FontAwesomeIcon icon={faCow} className="text-base" />
                  <span className="text-[10px] font-semibold">Livestock</span>
                </div>
              )}
            </NavLink>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="flex flex-col items-center justify-center gap-0.5 text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              <FontAwesomeIcon icon={faEllipsis} className="text-base" />
              <span className="text-[10px] font-semibold">More</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}
