import { HOUSEHOLD_STATUS } from '../../data/mockHouseholds';

const STATUS_STYLES = {
  [HOUSEHOLD_STATUS.DRAFT]:
    'bg-amber-50 text-amber-800 border-amber-200',
  [HOUSEHOLD_STATUS.IN_PROGRESS]:
    'bg-sky-50 text-sky-800 border-sky-200',
  [HOUSEHOLD_STATUS.COMPLETED]:
    'bg-teal-50 text-teal-800 border-teal-200',
  [HOUSEHOLD_STATUS.SUBMITTED]:
    'bg-emerald-50 text-emerald-800 border-emerald-200',
};

const DOT_STYLES = {
  [HOUSEHOLD_STATUS.DRAFT]: 'bg-amber-500',
  [HOUSEHOLD_STATUS.IN_PROGRESS]: 'bg-sky-500',
  [HOUSEHOLD_STATUS.COMPLETED]: 'bg-teal-600',
  [HOUSEHOLD_STATUS.SUBMITTED]: 'bg-emerald-600',
};

export default function StatusBadge({ status }) {
  const badgeStyle =
    STATUS_STYLES[status] || 'bg-slate-100 text-slate-700 border-slate-200';
  const dotStyle = DOT_STYLES[status] || 'bg-slate-500';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap ${badgeStyle}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dotStyle}`} />
      <span>{status}</span>
    </span>
  );
}
