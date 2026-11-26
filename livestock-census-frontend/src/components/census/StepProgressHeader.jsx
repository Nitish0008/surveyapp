import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faCheck,
  faClipboardCheck,
  faCow,
  faHouseUser,
  faListCheck,
} from '@fortawesome/free-solid-svg-icons';
import StatusBadge from '../common/StatusBadge';

const STEPS = [
  { id: 1, label: 'Household Form', icon: faHouseUser },
  { id: 2, label: 'Species Categories', icon: faListCheck },
  { id: 3, label: 'Livestock Entry', icon: faCow },
  { id: 4, label: 'Review & Submit', icon: faClipboardCheck },
];

export default function StepProgressHeader({
  currentStep,
  hhid,
  status,
  viewOnly = false,
}) {
  const activeStep = STEPS.find((s) => s.id === currentStep) || STEPS[0];
  const progressPercent = Math.round((currentStep / STEPS.length) * 100);

  return (
    <div className="rounded-2xl bg-white border border-slate-200 p-3.5 sm:p-5 shadow-2xs space-y-3 sm:space-y-4">
      <div className="flex items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <Link
            to="/dashboard"
            className="h-9 w-9 inline-flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 shrink-0"
            aria-label="Back to dashboard"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="text-sm" />
          </Link>
          <div className="min-w-0">
            <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              {viewOnly ? 'Submitted Record Summary' : 'Household Census'}
            </p>
            <p className="font-mono text-xs sm:text-base font-bold text-[#0B5D36] truncate mt-0.5">
              {hhid || 'HHID: Auto-generated on save'}
            </p>
          </div>
        </div>
        {status && <StatusBadge status={status} />}
      </div>

      {!viewOnly && (
        <>
          {/* Mobile Compact Progress Bar */}
          <div className="sm:hidden space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#0B5D36]">
                Step {currentStep} of {STEPS.length}: {activeStep.label}
              </span>
              <span className="font-mono text-[11px] font-semibold text-slate-500">
                {progressPercent}%
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#0B5D36] to-emerald-500 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Tablet / Desktop 4-Step Indicator */}
          <ol
            className="hidden sm:grid grid-cols-4 gap-3"
            aria-label="Registration steps"
          >
            {STEPS.map((step) => {
              const isCompleted = currentStep > step.id;
              const isActive = currentStep === step.id;
              return (
                <li
                  key={step.id}
                  className={`rounded-xl border px-3 py-2.5 flex items-center gap-2.5 transition ${
                    isActive
                      ? 'border-[#0B5D36] bg-emerald-50/70 text-[#0B5D36]'
                      : isCompleted
                        ? 'border-emerald-200 bg-emerald-50/30 text-emerald-800'
                        : 'border-slate-200 bg-slate-50/60 text-slate-400'
                  }`}
                >
                  <span
                    className={`h-6 w-6 rounded-full text-[11px] font-bold flex items-center justify-center shrink-0 ${
                      isActive
                        ? 'bg-[#0B5D36] text-white'
                        : isCompleted
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {isCompleted ? (
                      <FontAwesomeIcon icon={faCheck} className="text-[10px]" />
                    ) : (
                      step.id
                    )}
                  </span>
                  <span className="text-xs font-semibold truncate">
                    {step.id}. {step.label}
                  </span>
                </li>
              );
            })}
          </ol>
        </>
      )}
    </div>
  );
}
