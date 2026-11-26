import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROLE_LABELS } from '../../data/demoUsers';

export default function ModulePlaceholderPage({ title, description, nextStep }) {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="rounded-2xl bg-white p-6 sm:p-8 shadow-sm ring-1 ring-slate-200">
        <div className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800 border border-teal-200">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Signed in as {ROLE_LABELS[user?.role]} ({user?.district})
        </div>

        <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
          {title}
        </h2>
        <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
          {description}
        </p>

        {nextStep && (
          <div className="mt-6 rounded-xl bg-slate-50 border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-sm text-slate-700">
              <span className="font-semibold">Ready to build next:</span> {nextStep}
            </p>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700 hover:text-teal-800 shrink-0"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
