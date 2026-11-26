import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronRight,
  faCircleCheck,
  faCircleExclamation,
  faCircleQuestion,
  faEnvelope,
  faEye,
  faEyeSlash,
  faIdBadge,
  faKey,
  faLock,
  faRightToBracket,
  faUserGear,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import govLogo from '../../img/gov.png';
import pastoralBanner from '../../img/Assam Pastoral Government Portal Banner.png';
import { DEMO_USERS, ROLE_LABELS } from '../../data/demoUsers';
import PwaInstallBanner from '../../components/common/PwaInstallBanner';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { forgotPasswordSchema, loginSchema } from '../../validations/authSchema';

function VeterinaryCaduceusIcon({ className = 'h-8 w-8' }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M32 10V54"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="32" cy="9" r="3" fill="currentColor" />
      <path
        d="M30 18C22 14 14 15 10 19C14 21 19 22 25 22C21 24 16 24 13 24C17 27 23 27 29 24"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M34 18C42 14 50 15 54 19C50 21 45 22 39 22C43 24 48 24 51 24C47 27 41 27 35 24"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M25 26C21 29 22 34 32 36C40 38 41 42 32 45C25 47 26 51 32 52"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M39 26C43 29 42 34 32 36C24 38 23 42 32 45C39 47 38 51 32 52"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, loginAsDemoRole, getDefaultRouteForRole } = useAuth();
  const { showToast } = useToast();

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');
  const [demoExpanded, setDemoExpanded] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: '',
      password: '',
      remember: true,
    },
  });

  const {
    register: registerForgot,
    handleSubmit: handleForgotSubmit,
    reset: resetForgot,
    formState: { errors: forgotErrors, isSubmitting: isForgotSubmitting },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { identifier: '' },
  });

  const onSubmit = async (values) => {
    setServerError('');
    const result = await login(values);
    if (!result.success) {
      setServerError(result.message);
      showToast('Invalid credentials. Please verify and try again.', 'error', 'Sign-In Failed');
      return;
    }
    showToast(
      `Welcome, ${result.user.name} (${ROLE_LABELS[result.user.role]})`,
      'success',
      'Login Successful'
    );
    navigate(getDefaultRouteForRole(result.user.role), { replace: true });
  };

  const handleQuickDemo = (role) => {
    setServerError('');
    const loggedUser = loginAsDemoRole(role);
    if (loggedUser) {
      showToast(
        `Signed in as ${loggedUser.name} (${loggedUser.district})`,
        'success',
        'Login Successful'
      );
      navigate(getDefaultRouteForRole(loggedUser.role), { replace: true });
    }
  };

  const fillCredentials = (demoUser) => {
    setServerError('');
    setValue('identifier', demoUser.username, { shouldValidate: true });
    setValue('password', demoUser.password, { shouldValidate: true });
    showToast(
      `Credentials filled for ${ROLE_LABELS[demoUser.role]}`,
      'info',
      'Demo Account Ready'
    );
  };

  const onForgotSubmit = async (values) => {
    setForgotSuccess(
      `Password reset instructions have been queued for ${values.identifier} (demo mode). Please contact your District Administrator for immediate assistance.`
    );
    showToast(`Reset request queued for ${values.identifier}`, 'info', 'Recovery Requested');
  };

  const closeForgotModal = () => {
    setForgotOpen(false);
    setForgotSuccess('');
    resetForgot();
  };

  return (
    <div className="h-dvh w-full flex flex-col relative bg-white md:bg-[#d8eef8] overflow-hidden">
      {/* Desktop Full-Bleed Pastoral Banner Background */}
      <div
        aria-hidden="true"
        className="hidden md:block fixed inset-0 bg-cover bg-center bg-no-repeat pointer-events-none"
        style={{ backgroundImage: `url("${pastoralBanner}")` }}
      />
      <div
        aria-hidden="true"
        className="hidden md:block fixed inset-0 bg-gradient-to-b from-white/50 via-transparent to-emerald-950/15 pointer-events-none"
      />

      {/* Top Official Header */}
      <header className="relative z-20 shrink-0 bg-white md:bg-white/90 md:backdrop-blur-md border-b border-slate-200 md:border-emerald-900/10 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-2 md:py-2.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
            <img
              src={govLogo}
              alt="State Emblem of India — Government of Assam"
              className="h-9 w-9 sm:h-11 sm:w-11 object-contain shrink-0"
            />
            <div className="min-w-0 leading-tight">
              <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                অসম চৰকাৰ
              </p>
              <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-slate-700 truncate">
                Government of Assam
              </p>
            </div>

            <div className="hidden sm:block h-8 w-px bg-slate-400/70 mx-1 shrink-0" />

            <div className="hidden sm:block min-w-0 leading-tight">
              <p className="text-base lg:text-lg font-bold text-[#0B5D36] truncate">
                Veterinary Department
              </p>
              <p className="text-xs lg:text-sm italic font-medium text-[#0B5D36] truncate">
                Livestock Census Portal
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Top Pastoral Sky Banner with Assam Map */}
      <div className="md:hidden relative z-10 h-24 sm:h-32 shrink-0 w-full overflow-hidden">
        <img
          src={pastoralBanner}
          alt=""
          className="h-full w-full object-cover object-[24%_18%]"
        />
        <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-white to-transparent" />
      </div>

      {/* Main Workspace — Right-Aligned on Web View, Centered & Fixed-Fit on Mobile */}
      <main className="relative z-20 flex-1 min-h-0 flex flex-col md:flex-row items-center justify-start md:justify-end px-4 md:px-10 lg:px-16 xl:px-24">
        <div className="w-full max-w-[410px] -mt-6 md:mt-0 space-y-2.5">
          <PwaInstallBanner />

          {/* Sign-In Card */}
          <section
            aria-labelledby="login-heading"
            className="bg-white border border-slate-200 md:border-white/85 rounded-2xl shadow-[0_14px_36px_rgba(11,79,48,0.16)] px-5 pt-8 pb-4 sm:px-6 sm:pt-9 sm:pb-5 relative"
          >
            {/* Overlapping Circular Veterinary Caduceus Badge */}
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 h-14 w-14 rounded-full bg-[#0B5D36] text-white ring-4 ring-white shadow-md flex items-center justify-center">
              <VeterinaryCaduceusIcon className="h-8 w-8" />
            </div>

            {/* Card Header */}
            <div className="text-center mb-3.5 sm:mb-4">
              <h1
                id="login-heading"
                className="text-lg sm:text-xl font-bold text-[#0B5D36] tracking-tight"
              >
                Departmental Sign-In
              </h1>
              <p className="mt-0.5 text-xs text-[#1E3A5F] font-medium">
                Authorised officials and field enumerators only
              </p>
              <div className="mt-2 mx-auto h-0.5 w-12 rounded-full bg-[#0B5D36]/25" />
            </div>

            {serverError && (
              <div
                role="alert"
                className="mb-3 flex items-start gap-2 rounded-xl border border-rose-300 bg-rose-50 px-3 py-2 text-xs text-rose-900"
              >
                <FontAwesomeIcon
                  icon={faCircleExclamation}
                  className="mt-0.5 text-rose-600 shrink-0"
                />
                <span>{serverError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-2.5 sm:space-y-3">
              {/* Official Email / Employee Code */}
              <div>
                <label htmlFor="identifier" className="sr-only">
                  Official Email or Employee Code
                </label>
                <div
                  className={`flex items-center rounded-xl border bg-slate-50/80 px-3.5 transition ${errors.identifier
                    ? 'border-rose-500 ring-2 ring-rose-500/15 bg-white'
                    : 'border-slate-300 focus-within:border-[#0B5D36] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#0B5D36]/15'
                    }`}
                >
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    className="text-[#1E3A5F] text-sm mr-3 shrink-0"
                  />
                  <input
                    id="identifier"
                    type="text"
                    autoComplete="username"
                    placeholder="Official Email / Employee Code *"
                    aria-invalid={Boolean(errors.identifier)}
                    {...register('identifier')}
                    className="w-full min-h-10.5 sm:min-h-11 bg-transparent text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none"
                  />
                </div>
                {errors.identifier && (
                  <p className="mt-1 text-[11px] font-medium text-rose-600">
                    {errors.identifier.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <div
                  className={`flex items-center rounded-xl border bg-slate-50/80 px-3.5 transition ${errors.password
                    ? 'border-rose-500 ring-2 ring-rose-500/15 bg-white'
                    : 'border-slate-300 focus-within:border-[#0B5D36] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#0B5D36]/15'
                    }`}
                >
                  <FontAwesomeIcon
                    icon={faLock}
                    className="text-[#1E3A5F] text-sm mr-3 shrink-0"
                  />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="Password *"
                    aria-invalid={Boolean(errors.password)}
                    {...register('password')}
                    className="w-full min-h-10.5 sm:min-h-11 bg-transparent text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="ml-2 p-1.5 text-slate-500 hover:text-[#0B5D36] cursor-pointer shrink-0"
                  >
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-[11px] font-medium text-rose-600">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Remember + Forgot Password */}
              <div className="flex items-center justify-between gap-2 pt-0.5">
                <label className="inline-flex items-center gap-2 text-xs text-[#1E3A5F] font-medium cursor-pointer select-none">
                  <input
                    type="checkbox"
                    {...register('remember')}
                    className="h-3.5 w-3.5 rounded border-slate-400 text-[#0B5D36] accent-[#1E3A5F]"
                  />
                  <span>Keep session active</span>
                </label>

                <button
                  type="button"
                  onClick={() => setForgotOpen(true)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#0B5D36] hover:text-[#08492A] hover:underline cursor-pointer shrink-0"
                >
                  <FontAwesomeIcon icon={faCircleQuestion} />
                  <span>Forgot Password?</span>
                </button>
              </div>

              {/* Primary Sign-In Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full min-h-11 inline-flex items-center justify-center gap-2 rounded-xl bg-[#0B5D36] hover:bg-[#08492A] active:bg-[#063A21] disabled:opacity-60 px-4 py-2 text-sm font-semibold text-white shadow-sm transition cursor-pointer"
              >
                <FontAwesomeIcon icon={faRightToBracket} />
                <span>{isSubmitting ? 'Signing in...' : 'Sign In to Portal'}</span>
              </button>
            </form>

            {/* OR Divider */}
            <div className="relative my-3 flex items-center justify-center">
              <div className="absolute inset-x-0 h-px bg-slate-200" />
              <span className="relative rounded bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                OR
              </span>
            </div>

            {/* Soft Sage Demo / Testing Accounts Button */}
            <button
              type="button"
              onClick={() => setDemoExpanded(true)}
              className="w-full rounded-xl border border-[#C6DFC2] bg-[#EAF5E8] hover:bg-[#DDF0DA] px-3.5 py-2.5 flex items-center justify-between gap-2 text-left transition cursor-pointer"
            >
              <span className="flex items-center gap-2.5 min-w-0">
                <FontAwesomeIcon
                  icon={faUserGear}
                  className="text-[#0B5D36] text-xs shrink-0"
                />
                <span className="text-xs font-semibold text-[#0F3D2E] truncate">
                  Demo / Testing Accounts (Dummy Data)
                </span>
              </span>
              <FontAwesomeIcon
                icon={faChevronRight}
                className="text-[#0B5D36] text-xs shrink-0"
              />
            </button>
          </section>
        </div>
      </main>

      {/* Mobile Bottom Pastoral Animals Preview Strip (auto-fills remaining height cleanly) */}
      <div className="md:hidden relative z-10 flex-1 min-h-10 max-h-28 w-full overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-white to-transparent z-10" />
        <img
          src={pastoralBanner}
          alt=""
          className="h-full w-full object-cover object-[18%_82%]"
        />
      </div>

      {/* Institutional Dark Green Footer */}
      <footer className="relative z-20 shrink-0 bg-[#09472A] text-white/95 border-t border-emerald-400/20 px-4 py-2.6 pb-1">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-5 text-center text-[10px] sm:text-xs">
          <p>
            &copy; 2026 Veterinary Department, Government of Assam. All rights reserved.
          </p>
          {/* <span className="hidden sm:inline text-white/40">|</span> */}
          {/* <p className="inline-flex items-center gap-1.5 font-medium">
            <FontAwesomeIcon icon={faShieldHalved} className="text-emerald-300" />
            <span>Role-Based Access Controlled System</span>
          </p> */}
        </div>
      </footer>

      {/* Demo / Testing Accounts Modal */}
      {demoExpanded && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-[2px] p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="demo-accounts-title"
        >
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden">
            <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faUserGear} className="text-[#0B5D36]" />
                <h2 id="demo-accounts-title" className="text-sm font-bold text-slate-900">
                  Demo / Testing Accounts
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setDemoExpanded(false)}
                aria-label="Close modal"
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-200/70 hover:text-slate-800 cursor-pointer"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>

            <div className="p-4 sm:p-5 space-y-3">
              <p className="text-xs text-slate-600">
                Select a role to enter directly or fill credentials (password:{' '}
                <code className="font-mono rounded border border-slate-200 bg-slate-100 px-1.5 py-0.5 text-slate-800">
                  Password@123
                </code>
                ).
              </p>

              <div className="divide-y divide-slate-200 border border-slate-200 rounded-xl overflow-hidden">
                {DEMO_USERS.map((demoUser) => (
                  <div
                    key={demoUser.id}
                    className="flex items-center justify-between gap-2 px-3.5 py-2.5 bg-white hover:bg-slate-50"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-900 truncate">
                        {ROLE_LABELS[demoUser.role]}
                      </p>
                      <p className="text-[11px] font-mono text-slate-500 truncate">
                        {demoUser.username} &bull; {demoUser.district}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          fillCredentials(demoUser);
                          setDemoExpanded(false);
                        }}
                        className="rounded-lg border border-slate-300 bg-white hover:bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-700 cursor-pointer"
                      >
                        Fill
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickDemo(demoUser.role)}
                        className="rounded-lg bg-[#0B5D36] hover:bg-[#08492A] px-2.5 py-1.5 text-xs font-semibold text-white cursor-pointer"
                      >
                        Enter
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Forgot Password Modal */}
      {forgotOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-[2px] p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="forgot-title"
        >
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden">
            <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faKey} className="text-[#0B5D36]" />
                <h2 id="forgot-title" className="text-sm font-bold text-slate-900">
                  Password Recovery Request
                </h2>
              </div>
              <button
                type="button"
                onClick={closeForgotModal}
                aria-label="Close modal"
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-200/70 hover:text-slate-800 cursor-pointer"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>

            <div className="p-5">
              {forgotSuccess ? (
                <div className="space-y-4">
                  <div className="flex items-start gap-2.5 rounded-xl border border-emerald-300 bg-emerald-50 p-3.5 text-xs sm:text-sm text-emerald-900">
                    <FontAwesomeIcon
                      icon={faCircleCheck}
                      className="text-emerald-600 mt-0.5 shrink-0"
                    />
                    <span>{forgotSuccess}</span>
                  </div>
                  <button
                    type="button"
                    onClick={closeForgotModal}
                    className="w-full min-h-11 rounded-xl bg-[#0B5D36] hover:bg-[#08492A] text-sm font-semibold text-white cursor-pointer"
                  >
                    Return to Sign In
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleForgotSubmit(onForgotSubmit)}
                  className="space-y-4"
                  noValidate
                >
                  <p className="text-xs sm:text-sm text-slate-600">
                    Enter your registered official email or employee code to initiate
                    password recovery.
                  </p>
                  <div>
                    <label
                      htmlFor="forgot-identifier"
                      className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1.5"
                    >
                      Email or Employee Code <span className="text-rose-600">*</span>
                    </label>
                    <div className="flex items-center rounded-xl border border-slate-300 bg-slate-50/80 px-3.5 focus-within:border-[#0B5D36] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#0B5D36]/15">
                      <FontAwesomeIcon
                        icon={faIdBadge}
                        className="text-[#1E3A5F] text-sm mr-3 shrink-0"
                      />
                      <input
                        id="forgot-identifier"
                        type="text"
                        placeholder="e.g. enum.kamrup@vet.assam.gov.in"
                        {...registerForgot('identifier')}
                        className="w-full min-h-11 bg-transparent text-sm text-slate-900 focus:outline-none"
                      />
                    </div>
                    {forgotErrors.identifier && (
                      <p className="mt-1.5 text-xs font-medium text-rose-600">
                        {forgotErrors.identifier.message}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={closeForgotModal}
                      className="min-h-10 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 px-4 text-xs sm:text-sm font-semibold text-slate-700 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isForgotSubmitting}
                      className="min-h-10 rounded-xl bg-[#0B5D36] hover:bg-[#08492A] px-4 text-xs sm:text-sm font-semibold text-white cursor-pointer"
                    >
                      Submit Request
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
