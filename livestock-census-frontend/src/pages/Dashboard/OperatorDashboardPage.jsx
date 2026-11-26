import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowRight,
  faBolt,
  faChartColumn,
  faCheck,
  faChevronRight,
  faCircleCheck,
  faClipboardCheck,
  faClipboardList,
  faClock,
  faCow,
  faEye,
  faFileLines,
  faFilePen,
  faGear,
  faHourglassHalf,
  faPenToSquare,
  faRightToBracket,
  faTableCellsLarge,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import StatusBadge from '../../components/common/StatusBadge';
import { ROLES } from '../../data/demoUsers';
import { useAuth } from '../../hooks/useAuth';
import { useCensus } from '../../hooks/useCensus';

function formatDate(iso) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

function getTotalHeadcount(entries = []) {
  return entries.reduce((sum, item) => sum + (Number(item.headcount) || 0), 0);
}

export default function OperatorDashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { draftHouseholds, submittedHouseholds, stats, removeDraft } = useCensus();

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [mobileTab, setMobileTab] = useState('drafts');
  const canCreate = user?.role !== ROLES.DIRECTOR;

  const statCards = [
    {
      label: 'Total Households',
      value: stats.total,
      sub: `${stats.totalLivestockHeadcount} headcount`,
      to: '/households',
      icon: faClipboardList,
      circleBg: 'bg-[#0B5D36]',
      valueColor: 'text-[#0B5D36]',
      subColor: 'text-[#0B5D36]',
      borderClass: 'border-emerald-200/80 hover:border-[#0B5D36]',
      waveColor: 'fill-emerald-100/80',
    },
    {
      label: 'Completed Entries',
      value: stats.completedAndSubmitted,
      sub: 'Ready & submitted',
      to: '/households?status=completed_all',
      icon: faCheck,
      circleBg: 'bg-[#1FA74D]',
      valueColor: 'text-[#15803D]',
      subColor: 'text-emerald-700',
      borderClass: 'border-emerald-200/80 hover:border-[#1FA74D]',
      waveColor: 'fill-emerald-100/70',
    },
    {
      label: 'Draft Entries',
      value: stats.drafts,
      sub: 'Saved in progress',
      to: '/households?status=drafts',
      icon: faFilePen,
      circleBg: 'bg-[#F59E0B]',
      valueColor: 'text-[#D97706]',
      subColor: 'text-amber-700',
      borderClass: 'border-amber-200/90 hover:border-amber-500',
      waveColor: 'fill-amber-100/85',
    },
    {
      label: 'Pending Submissions',
      value: stats.pendingSubmissions,
      sub: 'Awaiting submit',
      to: '/households?status=pending',
      icon: faHourglassHalf,
      circleBg: 'bg-[#1E73D8]',
      valueColor: 'text-[#1E73D8]',
      subColor: 'text-sky-700',
      borderClass: 'border-sky-200/90 hover:border-sky-500',
      waveColor: 'fill-sky-100/85',
    },
  ];

  const quickActions = [
    {
      label: 'My Drafts',
      icon: faFileLines,
      to: '/households?status=drafts',
    },
    {
      label: 'Livestock Data',
      icon: faCow,
      to: '/livestock/records',
    },
    {
      label: 'Submitted',
      icon: faChartColumn,
      to: '/households?status=Submitted',
    },
    {
      label: 'Settings',
      icon: faGear,
      to: '/settings',
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* 1. Primary Hero Card — Frosted Mint Card Matching Mobile App UI */}
      {canCreate && (
        <section
          role="button"
          tabIndex={0}
          onClick={() => navigate('/households/new')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              navigate('/households/new');
            }
          }}
          aria-label="Register New Household"
          className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-[#F6FBF7] to-[#E3F4E9] border border-emerald-200/90 ring-1 ring-emerald-900/5 p-4 sm:p-6 shadow-[0_8px_24px_rgba(11,93,54,0.08)] cursor-pointer transition hover:shadow-[0_12px_28px_rgba(11,93,54,0.14)] active:scale-[0.995]"
        >
          {/* Decorative soft green wave in bottom-right */}
          <svg
            aria-hidden="true"
            viewBox="0 0 300 90"
            className="pointer-events-none absolute right-0 bottom-0 h-24 w-64 text-emerald-200/45"
            preserveAspectRatio="none"
          >
            <path
              d="M0 90 C80 40, 180 80, 300 10 L300 90 Z"
              fill="currentColor"
            />
          </svg>

          <div className="relative space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 sm:gap-4 min-w-0">
                {/* Circular Deep-Green Clipboard-Check Icon */}
                <div className="h-13 w-13 sm:h-15 sm:w-15 rounded-full bg-gradient-to-br from-[#17824B] to-[#094D2B] text-white ring-4 ring-emerald-100 shadow-md flex items-center justify-center shrink-0 mt-0.5">
                  <FontAwesomeIcon
                    icon={faClipboardCheck}
                    className="text-xl sm:text-2xl"
                  />
                </div>

                {/* Vertical Accent Divider + Text */}
                <div className="border-l border-emerald-200 pl-3 sm:pl-4 min-w-0">
                  <p className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-[#0B5D36]">
                    <FontAwesomeIcon icon={faBolt} className="text-emerald-600" />
                    <span>Quick Field Entry &bull; 4 Steps</span>
                  </p>
                  <h2 className="mt-0.5 text-lg sm:text-2xl font-extrabold tracking-tight text-slate-900">
                    Register New Household
                  </h2>
                  <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
                    Record household owner details, auto-generate HHID, and enter
                    livestock &amp; poultry counts with draft auto-save.
                  </p>
                </div>
              </div>

              <span className="h-8 w-8 rounded-full bg-white border border-emerald-200 text-[#0B5D36] inline-flex items-center justify-center shadow-2xs shrink-0">
                <FontAwesomeIcon
                  icon={faChevronRight}
                  className="text-xs transition-transform group-hover:translate-x-0.5"
                />
              </span>
            </div>

            {/* Full-Width Deep Emerald Pill CTA Button */}
            <div className="w-full min-h-12 rounded-full bg-gradient-to-r from-[#0C6A3D] via-[#0B5D36] to-[#074426] group-hover:from-[#084D2C] group-hover:to-[#05351D] text-white font-bold text-sm px-6 py-3 shadow-[0_6px_16px_rgba(11,93,54,0.28)] inline-flex items-center justify-center gap-2.5 transition">
              <FontAwesomeIcon icon={faRightToBracket} />
              <span>Start Registration</span>
              <FontAwesomeIcon
                icon={faArrowRight}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </div>
          </div>
        </section>
      )}

      {/* 2. Clickable 2x2 Bento Stat Cards with Pastel Corner Waves */}
      <section aria-label="Household Census Statistics">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {statCards.map((card) => (
            <button
              key={card.label}
              type="button"
              onClick={() => navigate(card.to)}
              className={`group relative overflow-hidden text-left rounded-3xl bg-white border ${card.borderClass} p-3.5 sm:p-5 shadow-[0_4px_16px_rgba(15,23,42,0.05)] hover:shadow-md active:scale-[0.985] transition cursor-pointer`}
            >
              {/* Soft Corner Wave */}
              <svg
                aria-hidden="true"
                viewBox="0 0 160 60"
                className={`pointer-events-none absolute right-0 bottom-0 h-14 w-36 ${card.waveColor}`}
                preserveAspectRatio="none"
              >
                <path d="M0 60 C55 25, 110 50, 160 8 L160 60 Z" />
              </svg>

              <div className="relative space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <span
                      className={`h-10 w-10 sm:h-11 sm:w-11 rounded-full ${card.circleBg} text-white flex items-center justify-center shadow-sm shrink-0`}
                    >
                      <FontAwesomeIcon icon={card.icon} className="text-sm sm:text-base" />
                    </span>
                    <span
                      className={`text-2xl sm:text-3xl font-extrabold tabular-nums leading-none ${card.valueColor}`}
                    >
                      {card.value}
                    </span>
                  </div>

                  <FontAwesomeIcon
                    icon={faChevronRight}
                    className="text-xs text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition shrink-0"
                  />
                </div>

                <div>
                  <p className="text-xs sm:text-sm font-bold text-slate-800 leading-snug">
                    {card.label}
                  </p>
                  <p className={`text-[11px] font-semibold mt-0.5 ${card.subColor}`}>
                    &uarr; {card.sub}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 3. Quick Actions Row (Matches Mobile App Design) */}
      <section aria-labelledby="quick-actions-heading" className="space-y-2.5">
        <div className="flex items-center justify-between px-0.5">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon
              icon={faTableCellsLarge}
              className="text-[#0B5D36] text-sm"
            />
            <h2
              id="quick-actions-heading"
              className="text-sm sm:text-base font-extrabold text-slate-900"
            >
              Quick Actions
            </h2>
          </div>
          <Link
            to="/households"
            className="inline-flex items-center gap-1 text-xs font-bold text-[#0B5D36] hover:underline"
          >
            <span>View All</span>
            <FontAwesomeIcon icon={faArrowRight} className="text-[11px]" />
          </Link>
        </div>

        <div className="grid grid-cols-4 gap-2 sm:gap-3.5">
          {quickActions.map((action) => (
            <button
              key={action.label}
              type="button"
              onClick={() => navigate(action.to)}
              className="rounded-2xl bg-white border border-slate-200/90 hover:border-[#0B5D36] shadow-[0_3px_12px_rgba(15,23,42,0.04)] py-3 px-1.5 sm:py-4 sm:px-3 flex flex-col items-center justify-center gap-1.5 text-center active:scale-95 transition cursor-pointer"
            >
              <FontAwesomeIcon
                icon={action.icon}
                className="text-lg sm:text-xl text-[#0B5D36]"
              />
              <span className="text-[11px] sm:text-xs font-bold text-slate-800 leading-tight">
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Mobile-Only Pill Switcher for Recent Drafts / Submitted */}
      <div className="md:hidden rounded-2xl bg-white border border-slate-200 p-1.5 grid grid-cols-2 gap-1.5 shadow-2xs">
        <button
          type="button"
          onClick={() => setMobileTab('drafts')}
          className={`min-h-10 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
            mobileTab === 'drafts'
              ? 'bg-[#0B5D36] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <FontAwesomeIcon icon={faClock} />
          <span>Drafts ({draftHouseholds.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('submitted')}
          className={`min-h-10 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
            mobileTab === 'submitted'
              ? 'bg-[#0B5D36] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <FontAwesomeIcon icon={faCircleCheck} />
          <span>Submitted ({submittedHouseholds.length})</span>
        </button>
      </div>

      {/* 4. Draft Household Entries Section */}
      <section
        aria-labelledby="draft-households-heading"
        className={`${
          mobileTab === 'drafts' ? 'block' : 'hidden md:block'
        } rounded-3xl bg-white border border-slate-200/90 shadow-[0_4px_16px_rgba(15,23,42,0.04)] overflow-hidden`}
      >
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="h-8 w-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <FontAwesomeIcon icon={faClock} className="text-sm" />
            </span>
            <div>
              <h2
                id="draft-households-heading"
                className="text-sm sm:text-base font-bold text-slate-900"
              >
                Draft &amp; Pending Entries
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-500 hidden sm:block">
                Click any household to continue or review before final submission
              </p>
            </div>
          </div>
          <Link
            to="/households?status=pending"
            className="rounded-full bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2.5 py-1 text-xs font-bold text-amber-800 tabular-nums shrink-0"
          >
            {draftHouseholds.length} Pending &rarr;
          </Link>
        </div>

        {draftHouseholds.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm font-medium text-slate-700">
              No pending draft household entries.
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Tap Register New Household to begin a census entry.
            </p>
          </div>
        ) : (
          <>
            {/* Clickable Mobile App Cards */}
            <div className="md:hidden p-3 space-y-3 bg-slate-50/40">
              {draftHouseholds.map((item) => (
                <div
                  key={item.hhid}
                  onClick={() => navigate(`/households/resume/${item.hhid}`)}
                  className="rounded-2xl bg-white border border-slate-200 border-l-4 border-l-amber-500 hover:border-[#0B5D36] p-4 shadow-2xs space-y-3 cursor-pointer active:scale-[0.99] transition"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <span className="inline-block rounded-md bg-emerald-50 border border-emerald-200 px-2 py-0.5 font-mono text-[11px] font-bold text-[#0B5D36]">
                        {item.hhid}
                      </span>
                      <p className="text-sm font-bold text-slate-900 truncate mt-1.5">
                        {item.ownerName || 'Unnamed Owner'}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {item.houseAddress}
                      </p>
                    </div>
                    <StatusBadge status={item.status} />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-600 bg-slate-50 rounded-xl px-3 py-2 border border-slate-100">
                    <span>Reg: {formatDate(item.registeredAt)}</span>
                    <span className="font-semibold text-slate-800">
                      <FontAwesomeIcon icon={faCow} className="mr-1 text-[#0B5D36]" />
                      {item.livestockEntries?.length || 0} species &bull;{' '}
                      {getTotalHeadcount(item.livestockEntries)} head
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="flex-1 min-h-10 inline-flex items-center justify-center gap-2 rounded-xl bg-[#0B5D36] text-white text-xs font-bold">
                      <FontAwesomeIcon icon={faPenToSquare} />
                      <span>Edit / Continue</span>
                      <FontAwesomeIcon icon={faChevronRight} className="text-[10px]" />
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteTarget(item);
                      }}
                      aria-label={`Delete draft ${item.hhid}`}
                      className="min-h-10 px-3.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-semibold cursor-pointer"
                    >
                      <FontAwesomeIcon icon={faTrashCan} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Clickable Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-600">
                    <th className="py-3 px-4">HHID</th>
                    <th className="py-3 px-4">Owner of NHHE</th>
                    <th className="py-3 px-4">District</th>
                    <th className="py-3 px-4">Registration Date</th>
                    <th className="py-3 px-4">Livestock</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {draftHouseholds.map((item) => (
                    <tr
                      key={item.hhid}
                      onClick={() => navigate(`/households/resume/${item.hhid}`)}
                      className="hover:bg-emerald-50/40 cursor-pointer transition"
                    >
                      <td className="py-3 px-4 font-mono text-xs font-bold text-[#0B5D36]">
                        {item.hhid}
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-semibold text-slate-900">
                          {item.ownerName || 'Unnamed Owner'}
                        </p>
                        <p className="text-xs text-slate-500 truncate max-w-xs">
                          {item.houseAddress}
                        </p>
                      </td>
                      <td className="py-3 px-4 text-slate-700">{item.district}</td>
                      <td className="py-3 px-4 text-xs text-slate-600 tabular-nums">
                        {formatDate(item.registeredAt)}
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-700 tabular-nums">
                        {item.livestockEntries?.length || 0} entries &bull;{' '}
                        {getTotalHeadcount(item.livestockEntries)} head
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#0B5D36] px-3 py-1.5 text-xs font-semibold text-white">
                            <FontAwesomeIcon icon={faPenToSquare} />
                            <span>Edit / Continue</span>
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteTarget(item);
                            }}
                            title="Delete Draft"
                            className="rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 p-1.5 text-rose-700 cursor-pointer"
                          >
                            <FontAwesomeIcon icon={faTrashCan} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>

      {/* 5. Submitted Household Records Section */}
      <section
        aria-labelledby="submitted-households-heading"
        className={`${
          mobileTab === 'submitted' ? 'block' : 'hidden md:block'
        } rounded-3xl bg-white border border-slate-200/90 shadow-[0_4px_16px_rgba(15,23,42,0.04)] overflow-hidden`}
      >
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="h-8 w-8 rounded-xl bg-emerald-100 text-[#0B5D36] flex items-center justify-center shrink-0">
              <FontAwesomeIcon icon={faCircleCheck} className="text-sm" />
            </span>
            <div>
              <h2
                id="submitted-households-heading"
                className="text-sm sm:text-base font-bold text-slate-900"
              >
                Submitted Household Records
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-500 hidden sm:block">
                Click any record to view complete household and livestock details
              </p>
            </div>
          </div>
          <Link
            to="/households?status=Submitted"
            className="text-xs font-semibold text-[#0B5D36] hover:underline shrink-0"
          >
            View All &rarr;
          </Link>
        </div>

        {submittedHouseholds.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-600">
            No submitted household records yet.
          </div>
        ) : (
          <>
            {/* Clickable Mobile App Cards */}
            <div className="md:hidden p-3 space-y-3 bg-slate-50/40">
              {submittedHouseholds.map((item) => (
                <div
                  key={item.hhid}
                  onClick={() => navigate(`/households/view/${item.hhid}`)}
                  className="rounded-2xl bg-white border border-slate-200 border-l-4 border-l-[#0B5D36] hover:border-[#0B5D36] p-4 shadow-2xs space-y-3 cursor-pointer active:scale-[0.99] transition"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <span className="inline-block rounded-md bg-emerald-50 border border-emerald-200 px-2 py-0.5 font-mono text-[11px] font-bold text-[#0B5D36]">
                        {item.hhid}
                      </span>
                      <p className="text-sm font-bold text-slate-900 truncate mt-1.5">
                        {item.ownerName}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {item.district} &bull; {item.houseAddress}
                      </p>
                    </div>
                    <StatusBadge status={item.status} />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-slate-600">
                      Submitted: {formatDate(item.submittedAt)} &bull;{' '}
                      <strong className="text-slate-900">
                        {getTotalHeadcount(item.livestockEntries)}
                      </strong>{' '}
                      head
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-800">
                      <FontAwesomeIcon icon={faEye} />
                      <span>View Details</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Clickable Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-600">
                    <th className="py-3 px-4">HHID</th>
                    <th className="py-3 px-4">Owner of NHHE</th>
                    <th className="py-3 px-4">District</th>
                    <th className="py-3 px-4">Submitted Date</th>
                    <th className="py-3 px-4">Livestock Count</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {submittedHouseholds.slice(0, 6).map((item) => (
                    <tr
                      key={item.hhid}
                      onClick={() => navigate(`/households/view/${item.hhid}`)}
                      className="hover:bg-emerald-50/40 cursor-pointer transition"
                    >
                      <td className="py-3 px-4 font-mono text-xs font-bold text-[#0B5D36]">
                        {item.hhid}
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-semibold text-slate-900">{item.ownerName}</p>
                        <p className="text-xs text-slate-500 truncate max-w-xs">
                          {item.houseAddress}
                        </p>
                      </td>
                      <td className="py-3 px-4 text-slate-700">{item.district}</td>
                      <td className="py-3 px-4 text-xs text-slate-600 tabular-nums">
                        {formatDate(item.submittedAt)}
                      </td>
                      <td className="py-3 px-4 text-xs font-semibold text-slate-800 tabular-nums">
                        {item.ownsLivestock === '2'
                          ? 'No Livestock (0)'
                          : `${item.livestockEntries?.length || 0} species • ${getTotalHeadcount(item.livestockEntries)} head`}
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700">
                          <FontAwesomeIcon icon={faEye} />
                          <span>View Record</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Incomplete Draft?"
        message={
          deleteTarget
            ? `Are you sure you want to remove draft ${deleteTarget.hhid} (${deleteTarget.ownerName || 'Unnamed Owner'})? This action cannot be undone.`
            : ''
        }
        confirmLabel="Delete Draft"
        tone="danger"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) {
            removeDraft(deleteTarget.hhid);
            setDeleteTarget(null);
          }
        }}
      />
    </div>
  );
}
