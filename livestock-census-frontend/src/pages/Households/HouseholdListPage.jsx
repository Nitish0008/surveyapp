import { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faChevronRight,
  faCow,
  faEye,
  faHouseMedical,
  faLocationDot,
  faMagnifyingGlass,
  faPenToSquare,
  faTrashCan,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import StatusBadge from '../../components/common/StatusBadge';
import { ASSAM_DISTRICTS, ROLES } from '../../data/demoUsers';
import { HOUSEHOLD_STATUS } from '../../data/mockHouseholds';
import { useAuth } from '../../hooks/useAuth';
import { useCensus } from '../../hooks/useCensus';

const VIEW_TABS = [
  {
    key: 'All',
    label: 'All',
    title: 'All Registered Households',
    subtitle: 'Complete list of registered, draft, and submitted households',
  },
  {
    key: 'drafts',
    label: 'Drafts',
    title: 'Draft Household Entries',
    subtitle: 'Incomplete entries saved as Draft or In Progress',
  },
  {
    key: 'pending',
    label: 'Pending',
    title: 'Pending Submissions',
    subtitle: 'Households awaiting final review and submission',
  },
  {
    key: 'completed_all',
    label: 'Completed',
    title: 'Completed & Submitted Households',
    subtitle: 'Households with completed census entries and final submissions',
  },
  {
    key: HOUSEHOLD_STATUS.SUBMITTED,
    label: 'Submitted',
    title: 'Submitted Household Records',
    subtitle: 'Finalised census submissions locked for verification',
  },
];

function getBorderAccent(status) {
  switch (status) {
    case HOUSEHOLD_STATUS.DRAFT:
      return 'border-l-amber-500';
    case HOUSEHOLD_STATUS.IN_PROGRESS:
      return 'border-l-sky-500';
    case HOUSEHOLD_STATUS.COMPLETED:
      return 'border-l-teal-600';
    case HOUSEHOLD_STATUS.SUBMITTED:
      return 'border-l-[#0B5D36]';
    default:
      return 'border-l-slate-400';
  }
}

export default function HouseholdListPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const { households, removeDraft } = useCensus();

  const [query, setQuery] = useState('');
  const [districtFilter, setDistrictFilter] = useState('All');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const statusFilter = searchParams.get('status') || 'All';
  const canCreate = user?.role !== ROLES.DIRECTOR;
  const availableDistricts = user?.assignedDistricts || ASSAM_DISTRICTS;

  const activeTab =
    VIEW_TABS.find((t) => t.key === statusFilter) || VIEW_TABS[0];

  const setStatusFilter = (nextKey) => {
    if (nextKey === 'All') {
      setSearchParams({});
    } else {
      setSearchParams({ status: nextKey });
    }
  };

  const tabCounts = useMemo(() => {
    return {
      All: households.length,
      drafts: households.filter(
        (h) =>
          h.status === HOUSEHOLD_STATUS.DRAFT ||
          h.status === HOUSEHOLD_STATUS.IN_PROGRESS
      ).length,
      pending: households.filter(
        (h) => h.status !== HOUSEHOLD_STATUS.SUBMITTED
      ).length,
      completed_all: households.filter(
        (h) =>
          h.status === HOUSEHOLD_STATUS.COMPLETED ||
          h.status === HOUSEHOLD_STATUS.SUBMITTED
      ).length,
      [HOUSEHOLD_STATUS.SUBMITTED]: households.filter(
        (h) => h.status === HOUSEHOLD_STATUS.SUBMITTED
      ).length,
    };
  }, [households]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return households.filter((item) => {
      let matchesStatus = true;
      if (statusFilter === 'drafts') {
        matchesStatus =
          item.status === HOUSEHOLD_STATUS.DRAFT ||
          item.status === HOUSEHOLD_STATUS.IN_PROGRESS;
      } else if (statusFilter === 'pending') {
        matchesStatus = item.status !== HOUSEHOLD_STATUS.SUBMITTED;
      } else if (statusFilter === 'completed_all') {
        matchesStatus =
          item.status === HOUSEHOLD_STATUS.COMPLETED ||
          item.status === HOUSEHOLD_STATUS.SUBMITTED;
      } else if (statusFilter !== 'All') {
        matchesStatus = item.status === statusFilter;
      }

      const matchesDistrict =
        districtFilter === 'All' || item.district === districtFilter;

      const matchesQuery =
        !q ||
        item.hhid?.toLowerCase().includes(q) ||
        item.ownerName?.toLowerCase().includes(q) ||
        item.houseAddress?.toLowerCase().includes(q) ||
        item.district?.toLowerCase().includes(q);

      return matchesStatus && matchesDistrict && matchesQuery;
    });
  }, [households, query, statusFilter, districtFilter]);

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Contextual Top Header Card */}
      <section className="rounded-2xl bg-white border border-slate-300/90 shadow-2xs overflow-hidden">
        <div className="px-4 sm:px-6 py-4 bg-gradient-to-r from-slate-50 to-white border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-3 min-w-0">
            <Link
              to="/dashboard"
              aria-label="Back to Dashboard"
              className="h-10 w-10 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 inline-flex items-center justify-center shrink-0 transition"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="text-sm" />
            </Link>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 truncate">
                  {activeTab.title}
                </h2>
                <span className="rounded-full bg-emerald-50 border border-emerald-300 px-2.5 py-0.5 text-xs font-bold text-[#0B5D36] tabular-nums">
                  {filtered.length}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 truncate">
                {activeTab.subtitle}
              </p>
            </div>
          </div>

          {canCreate && (
            <button
              type="button"
              onClick={() => navigate('/households/new')}
              className="w-full sm:w-auto min-h-10 inline-flex items-center justify-center gap-2 rounded-xl bg-[#0B5D36] hover:bg-[#08492A] px-4 py-2 text-xs sm:text-sm font-bold text-white shadow-xs cursor-pointer shrink-0"
            >
              <FontAwesomeIcon icon={faHouseMedical} />
              <span>New Household</span>
            </button>
          )}
        </div>

        {/* Clean Integrated Filter & Search Controls */}
        <div className="p-3.5 sm:p-5 space-y-3 bg-white">
          {/* Segmented Tab Strip — Clean Grid on Mobile, Inline Segmented Control on Web */}
          <div
            role="tablist"
            aria-label="Filter households by status"
            className="grid grid-cols-3 sm:inline-flex sm:flex-wrap gap-1.5 rounded-xl bg-slate-100 p-1.5 border border-slate-200"
          >
            {VIEW_TABS.map((tab) => {
              const isActive = statusFilter === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setStatusFilter(tab.key)}
                  className={`min-h-9 rounded-lg px-2.5 sm:px-3.5 text-xs font-bold inline-flex items-center justify-center gap-1.5 transition cursor-pointer ${
                    isActive
                      ? 'bg-[#0B5D36] text-white shadow-xs'
                      : 'text-slate-600 hover:bg-white hover:text-slate-900'
                  }`}
                >
                  <span className="truncate">{tab.label}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] tabular-nums ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-200/80 text-slate-700'
                    }`}
                  >
                    {tabCounts[tab.key]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search + Optional District Selector */}
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search HHID, owner name, or hamlet..."
                className="w-full min-h-11 rounded-xl border border-slate-300 bg-slate-50/70 pl-10 pr-9 text-base sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0B5D36] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B5D36]/15"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <FontAwesomeIcon icon={faXmark} />
                </button>
              )}
            </div>

            {availableDistricts.length > 1 && (
              <select
                value={districtFilter}
                onChange={(e) => setDistrictFilter(e.target.value)}
                aria-label="Filter by district"
                className="sm:w-48 min-h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm font-medium text-slate-800 focus:border-[#0B5D36] focus:outline-none"
              >
                <option value="All">All Districts</option>
                {availableDistricts.map((dist) => (
                  <option key={dist} value={dist}>
                    {dist}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      </section>

      {/* Empty State */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl bg-white border border-slate-300 p-8 text-center space-y-3 shadow-2xs">
          <p className="text-sm font-bold text-slate-800">
            No households found in this view
          </p>
          <p className="text-xs text-slate-500">
            Try clearing your search or switching to All Households.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setDistrictFilter('All');
              setStatusFilter('All');
            }}
            className="inline-flex items-center rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <>
          {/* Mobile App Bordered Cards */}
          <div className="md:hidden space-y-3">
            {filtered.map((item) => {
              const isSubmitted = item.status === HOUSEHOLD_STATUS.SUBMITTED;
              const targetPath =
                isSubmitted || !canCreate
                  ? `/households/view/${item.hhid}`
                  : `/households/resume/${item.hhid}`;
              const totalHead = (item.livestockEntries || []).reduce(
                (sum, e) => sum + (Number(e.headcount) || 0),
                0
              );

              return (
                <div
                  key={item.hhid}
                  onClick={() => navigate(targetPath)}
                  className={`rounded-2xl bg-white border border-slate-300 border-l-4 ${getBorderAccent(
                    item.status
                  )} p-4 shadow-2xs space-y-3 cursor-pointer active:scale-[0.99] transition`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <span className="inline-block rounded-md bg-emerald-50 border border-emerald-200 px-2 py-0.5 font-mono text-[11px] font-bold text-[#0B5D36]">
                        {item.hhid}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 truncate mt-1.5">
                        {item.ownerName || 'Unnamed Owner'}
                      </h3>
                    </div>
                    <StatusBadge status={item.status} />
                  </div>

                  <p className="text-xs text-slate-600 flex items-start gap-1.5">
                    <FontAwesomeIcon
                      icon={faLocationDot}
                      className="text-slate-400 mt-0.5 shrink-0"
                    />
                    <span className="line-clamp-2">
                      {item.district} &bull; {item.houseAddress}
                    </span>
                  </p>

                  {/* Species Summary Strip */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                    <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 border border-slate-200 px-2.5 py-1 text-[11px] font-bold text-slate-700">
                      <FontAwesomeIcon icon={faCow} className="text-[#0B5D36]" />
                      <span>{totalHead} Head</span>
                    </span>
                    {(item.livestockEntries || []).slice(0, 3).map((entry) => (
                      <span
                        key={entry.id}
                        className="rounded-lg bg-emerald-50/70 border border-emerald-200 px-2 py-1 text-[11px] font-semibold text-[#0B5D36]"
                      >
                        {entry.species} ({entry.headcount})
                      </span>
                    ))}
                    {item.ownsLivestock === '2' && (
                      <span className="rounded-lg bg-slate-50 border border-slate-200 px-2 py-1 text-[11px] text-slate-500">
                        No Livestock
                      </span>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                    <span className="text-[11px] font-medium text-slate-500">
                      Tap card to {isSubmitted || !canCreate ? 'view summary' : 'continue'}
                    </span>

                    <div className="flex items-center gap-2">
                      {!isSubmitted && canCreate && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteTarget(item);
                          }}
                          aria-label={`Delete draft ${item.hhid}`}
                          className="h-9 w-9 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 inline-flex items-center justify-center cursor-pointer"
                        >
                          <FontAwesomeIcon icon={faTrashCan} className="text-xs" />
                        </button>
                      )}
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold ${
                          isSubmitted || !canCreate
                            ? 'border border-slate-300 bg-slate-50 text-slate-800'
                            : 'bg-[#0B5D36] text-white'
                        }`}
                      >
                        <FontAwesomeIcon
                          icon={isSubmitted || !canCreate ? faEye : faPenToSquare}
                        />
                        <span>{isSubmitted || !canCreate ? 'View' : 'Continue'}</span>
                        <FontAwesomeIcon icon={faChevronRight} className="text-[10px]" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop Bordered Table View */}
          <div className="hidden md:block rounded-2xl bg-white border border-slate-300 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-600">
                    <th className="py-3.5 px-4">HHID</th>
                    <th className="py-3.5 px-4">Owner &amp; Address</th>
                    <th className="py-3.5 px-4">District</th>
                    <th className="py-3.5 px-4">Livestock Summary</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filtered.map((item) => {
                    const isSubmitted = item.status === HOUSEHOLD_STATUS.SUBMITTED;
                    const targetPath =
                      isSubmitted || !canCreate
                        ? `/households/view/${item.hhid}`
                        : `/households/resume/${item.hhid}`;
                    const totalHead = (item.livestockEntries || []).reduce(
                      (sum, e) => sum + (Number(e.headcount) || 0),
                      0
                    );
                    return (
                      <tr
                        key={item.hhid}
                        onClick={() => navigate(targetPath)}
                        className="hover:bg-emerald-50/40 cursor-pointer transition"
                      >
                        <td className="py-3.5 px-4 font-mono text-xs font-bold text-[#0B5D36] whitespace-nowrap">
                          {item.hhid}
                        </td>
                        <td className="py-3.5 px-4">
                          <p className="font-bold text-slate-900">
                            {item.ownerName || 'Unnamed Owner'}
                          </p>
                          <p className="text-xs text-slate-500 truncate max-w-sm">
                            {item.houseAddress}
                          </p>
                        </td>
                        <td className="py-3.5 px-4 text-slate-700 font-medium">
                          {item.district}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-800 tabular-nums">
                              {totalHead} head
                            </span>
                            {(item.livestockEntries || []).slice(0, 2).map((entry) => (
                              <span
                                key={entry.id}
                                className="rounded-md bg-slate-100 border border-slate-200 px-2 py-0.5 text-[11px] font-medium text-slate-700"
                              >
                                {entry.species}: {entry.headcount}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <StatusBadge status={item.status} />
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          {isSubmitted || !canCreate ? (
                            <span className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700">
                              <FontAwesomeIcon icon={faEye} />
                              <span>View Details</span>
                            </span>
                          ) : (
                            <div className="inline-flex items-center gap-2">
                              <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#0B5D36] px-3 py-1.5 text-xs font-semibold text-white">
                                <FontAwesomeIcon icon={faPenToSquare} />
                                <span>Continue</span>
                              </span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDeleteTarget(item);
                                }}
                                className="rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 p-2 text-rose-700 cursor-pointer"
                              >
                                <FontAwesomeIcon icon={faTrashCan} className="text-xs" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Draft Household?"
        message={
          deleteTarget
            ? `Remove draft ${deleteTarget.hhid} (${deleteTarget.ownerName || 'Unnamed Owner'})?`
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
