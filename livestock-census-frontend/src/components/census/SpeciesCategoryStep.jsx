import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faArrowRight,
  faCheckCircle,
  faCow,
  faFeather,
  faFloppyDisk,
  faHorse,
  faPaw,
  faPenToSquare,
  faPiggyBank,
} from '@fortawesome/free-solid-svg-icons';
import { SPECIES_MASTER } from '../../data/censusMasterData';

const SPECIES_STYLE_MAP = {
  '01': { icon: faCow, accent: 'bg-emerald-100 text-[#0B5D36]' },
  '02': { icon: faCow, accent: 'bg-teal-100 text-teal-800' },
  '04': { icon: faPaw, accent: 'bg-cyan-100 text-cyan-800' },
  '05': { icon: faPaw, accent: 'bg-indigo-100 text-indigo-800' },
  '06': { icon: faPaw, accent: 'bg-lime-100 text-lime-800' },
  '12': { icon: faPiggyBank, accent: 'bg-rose-100 text-rose-700' },
  '15': { icon: faFeather, accent: 'bg-amber-100 text-amber-800' },
  '18': { icon: faHorse, accent: 'bg-slate-200 text-slate-700' },
};

export default function SpeciesCategoryStep({
  speciesSelection = {},
  livestockEntries = [],
  saving,
  onSelectSpeciesYes,
  onSelectSpeciesNo,
  onEditHousehold,
  onSaveDraft,
  onProceedToReview,
}) {
  const getEntriesForSpecies = (speciesCode) =>
    livestockEntries.filter((entry) => entry.speciesCode === speciesCode);

  const totalHeadcount = livestockEntries.reduce(
    (sum, item) => sum + (Number(item.headcount) || 0),
    0
  );

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-white border border-slate-200 p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            Livestock &amp; Poultry Categories
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Tap <strong>Yes</strong> on any owned species to open its entry form, or{' '}
            <strong>No</strong> to skip.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-3.5 py-2 text-xs font-bold text-[#0B5D36] shrink-0">
          <FontAwesomeIcon icon={faCow} />
          <span>
            {livestockEntries.length} saved &bull; {totalHeadcount} total head
          </span>
        </div>
      </div>

      {/* Responsive 2-Col Mobile App Grid -> 4-Col Desktop */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {SPECIES_MASTER.map((species) => {
          const entries = getEntriesForSpecies(species.code);
          const speciesHeadcount = entries.reduce(
            (sum, e) => sum + (Number(e.headcount) || 0),
            0
          );
          const choice = speciesSelection[species.code];
          const isYes = choice === 'yes' || entries.length > 0;
          const isNo = choice === 'no' && entries.length === 0;
          const visual = SPECIES_STYLE_MAP[species.code] || {
            icon: faPaw,
            accent: 'bg-slate-100 text-slate-700',
          };

          return (
            <div
              key={species.code}
              className={`rounded-2xl border p-3.5 sm:p-4 flex flex-col justify-between gap-3 transition shadow-2xs ${
                entries.length > 0
                  ? 'border-[#0B5D36] bg-gradient-to-b from-emerald-50/60 to-white ring-1 ring-[#0B5D36]/15'
                  : isNo
                    ? 'border-slate-200 bg-slate-50/75 opacity-85'
                    : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-1.5">
                  <span
                    className={`h-9 w-9 sm:h-10 sm:w-10 rounded-xl flex items-center justify-center shrink-0 ${visual.accent}`}
                  >
                    <FontAwesomeIcon icon={visual.icon} className="text-sm sm:text-base" />
                  </span>
                  <span className="rounded-lg bg-slate-100 border border-slate-200 px-2 py-0.5 font-mono text-[10px] sm:text-[11px] font-bold text-slate-700">
                    Code {species.code}
                  </span>
                </div>

                <h3 className="mt-2.5 text-sm sm:text-base font-bold text-slate-900 leading-tight">
                  {species.name}
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-500 mt-1 line-clamp-2 leading-snug">
                  {species.description}
                </p>

                {entries.length > 0 && (
                  <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-[#0B5D36]">
                    <FontAwesomeIcon icon={faCheckCircle} />
                    <span>{speciesHeadcount} head saved</span>
                  </div>
                )}
              </div>

              <div className="space-y-2 pt-1">
                <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                  <button
                    type="button"
                    onClick={() => onSelectSpeciesYes(species)}
                    className={`min-h-10 rounded-xl text-xs font-bold border transition cursor-pointer ${
                      isYes
                        ? 'bg-[#0B5D36] border-[#0B5D36] text-white'
                        : 'bg-white border-slate-300 text-slate-700 hover:border-[#0B5D36] hover:text-[#0B5D36]'
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => onSelectSpeciesNo(species)}
                    className={`min-h-10 rounded-xl text-xs font-bold border transition cursor-pointer ${
                      isNo
                        ? 'bg-slate-700 border-slate-700 text-white'
                        : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    No
                  </button>
                </div>

                {entries.length > 0 && (
                  <button
                    type="button"
                    onClick={() => onSelectSpeciesYes(species)}
                    className="w-full min-h-9 inline-flex items-center justify-center gap-1.5 rounded-xl border border-emerald-300 bg-white hover:bg-emerald-50 text-[11px] sm:text-xs font-semibold text-[#0B5D36] cursor-pointer"
                  >
                    <FontAwesomeIcon icon={faPenToSquare} />
                    <span>Edit / Add ({entries.length})</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Bar */}
      <div className="rounded-2xl bg-white border border-slate-200 p-3.5 sm:p-4 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        <div className="grid grid-cols-2 sm:flex gap-2">
          <button
            type="button"
            onClick={onEditHousehold}
            className="min-h-11 inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 px-3 sm:px-4 text-xs sm:text-sm font-semibold text-slate-700 cursor-pointer"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            <span>Edit Household</span>
          </button>
          <button
            type="button"
            onClick={onSaveDraft}
            disabled={saving}
            className="min-h-11 inline-flex items-center justify-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 px-3 sm:px-4 text-xs sm:text-sm font-semibold text-amber-900 cursor-pointer disabled:opacity-60"
          >
            <FontAwesomeIcon icon={faFloppyDisk} />
            <span>{saving ? 'Saving...' : 'Save Draft'}</span>
          </button>
        </div>

        <button
          type="button"
          onClick={onProceedToReview}
          className="min-h-12 inline-flex items-center justify-center gap-2 rounded-xl bg-[#0B5D36] hover:bg-[#08492A] px-6 text-sm font-bold text-white shadow-sm cursor-pointer"
        >
          <span>Review &amp; Final Submit</span>
          <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </div>
    </div>
  );
}
