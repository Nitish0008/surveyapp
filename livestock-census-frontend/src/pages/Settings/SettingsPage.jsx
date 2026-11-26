import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faRotateLeft,
  faUserShield,
} from '@fortawesome/free-solid-svg-icons';
import { ROLE_LABELS } from '../../data/demoUsers';
import { useAuth } from '../../hooks/useAuth';
import { useCensus } from '../../hooks/useCensus';

export default function SettingsPage() {
  const { user } = useAuth();
  const { resetDemoData, stats } = useCensus();

  return (
    <div className="max-w-3xl space-y-5">
      <section className="rounded-2xl bg-white border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-200">
          <span className="h-10 w-10 rounded-xl bg-emerald-50 text-[#0B5D36] flex items-center justify-center">
            <FontAwesomeIcon icon={faUserShield} />
          </span>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Operator Profile &amp; Jurisdiction
            </h2>
            <p className="text-xs text-slate-500">
              Active session details for this census portal
            </p>
          </div>
        </div>

        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <dt className="text-xs text-slate-500">Name</dt>
            <dd className="font-semibold text-slate-900 mt-0.5">{user?.name}</dd>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <dt className="text-xs text-slate-500">Role</dt>
            <dd className="font-semibold text-slate-900 mt-0.5">
              {ROLE_LABELS[user?.role]}
            </dd>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <dt className="text-xs text-slate-500">Employee Code</dt>
            <dd className="font-mono font-semibold text-[#0B5D36] mt-0.5">
              {user?.employeeCode}
            </dd>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <dt className="text-xs text-slate-500">Assigned Jurisdiction</dt>
            <dd className="font-semibold text-slate-900 mt-0.5">{user?.district}</dd>
          </div>
        </dl>
      </section>

      <section className="rounded-2xl bg-white border border-slate-200 p-5 sm:p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            Reset Dummy Census Data
          </h3>
          <p className="text-xs text-slate-600 mt-1">
            Currently storing {stats.total} households in browser localStorage. Restore
            clean Assam demo records before a presentation.
          </p>
        </div>
        <button
          type="button"
          onClick={resetDemoData}
          className="min-h-10 inline-flex items-center justify-center gap-2 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 px-4 text-xs font-bold text-amber-900 cursor-pointer shrink-0"
        >
          <FontAwesomeIcon icon={faRotateLeft} />
          <span>Reset Demo Data</span>
        </button>
      </section>
    </div>
  );
}
