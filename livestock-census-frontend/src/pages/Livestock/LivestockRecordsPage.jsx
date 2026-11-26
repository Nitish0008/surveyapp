import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import StatusBadge from '../../components/common/StatusBadge';
import { SPECIES_MASTER } from '../../data/censusMasterData';
import { HOUSEHOLD_STATUS } from '../../data/mockHouseholds';
import { useCensus } from '../../hooks/useCensus';

export default function LivestockRecordsPage() {
  const navigate = useNavigate();
  const { households } = useCensus();
  const [query, setQuery] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState('All');

  const flattenedRecords = useMemo(() => {
    const rows = [];
    for (const hh of households) {
      for (const entry of hh.livestockEntries || []) {
        rows.push({
          ...entry,
          ownerName: hh.ownerName,
          district: hh.district,
          householdStatus: hh.status,
        });
      }
    }
    return rows;
  }, [households]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return flattenedRecords.filter((row) => {
      const matchesSpecies =
        speciesFilter === 'All' || row.speciesCode === speciesFilter;
      const matchesQuery =
        !q ||
        row.hhid?.toLowerCase().includes(q) ||
        row.ownerName?.toLowerCase().includes(q) ||
        row.species?.toLowerCase().includes(q) ||
        row.breedName?.toLowerCase().includes(q) ||
        row.breedCode?.toLowerCase().includes(q) ||
        row.villageWard?.toLowerCase().includes(q);
      return matchesSpecies && matchesQuery;
    });
  }, [flattenedRecords, query, speciesFilter]);

  const totalHeadcount = filtered.reduce(
    (sum, r) => sum + (Number(r.headcount) || 0),
    0
  );

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-white border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Livestock &amp; Poultry Census Records
            </h2>
            <p className="text-xs text-slate-500">
              {filtered.length} records &bull;{' '}
              <strong className="text-[#0B5D36]">{totalHeadcount}</strong> total animals/birds
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative md:col-span-2">
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by HHID, owner, breed name, breed code, or village..."
              className="w-full min-h-11 rounded-xl border border-slate-300 bg-slate-50/60 pl-10 pr-3.5 text-sm text-slate-900 focus:border-[#0B5D36] focus:bg-white focus:outline-none"
            />
          </div>

          <select
            value={speciesFilter}
            onChange={(e) => setSpeciesFilter(e.target.value)}
            aria-label="Filter by species"
            className="w-full min-h-11 rounded-xl border border-slate-300 bg-white px-3.5 text-sm text-slate-900 focus:border-[#0B5D36] focus:outline-none"
          >
            <option value="All">All Species Categories</option>
            {SPECIES_MASTER.map((s) => (
              <option key={s.code} value={s.code}>
                {s.name} (Code {s.code})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="rounded-2xl bg-white border border-slate-200 shadow-2xs overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-600">
            No livestock records match your current filters.
          </div>
        ) : (
          <>
            {/* Mobile App Cards */}
            <div className="md:hidden divide-y divide-slate-200">
              {filtered.map((row) => (
                <div key={row.id} className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-mono text-xs font-bold text-[#0B5D36]">
                        {row.hhid} &bull; Code {row.speciesCode}
                      </p>
                      <p className="text-sm font-bold text-slate-900 truncate">
                        {row.species} &mdash; {row.breedName}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {row.ownerName} &bull; {row.villageWard}
                      </p>
                    </div>
                    <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-bold text-[#0B5D36] tabular-nums shrink-0">
                      {row.headcount} head
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-xs text-slate-600">
                    <span>
                      {row.sex} &bull; {row.purpose}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          row.householdStatus === HOUSEHOLD_STATUS.SUBMITTED
                            ? `/households/view/${row.hhid}`
                            : `/households/resume/${row.hhid}`
                        )
                      }
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-2.5 py-1 text-xs font-semibold text-slate-700 cursor-pointer"
                    >
                      <FontAwesomeIcon icon={faEye} />
                      <span>Open HH</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-600">
                    <th className="py-3 px-4">HHID &amp; Owner</th>
                    <th className="py-3 px-4">Species (Code)</th>
                    <th className="py-3 px-4">Breed (Code)</th>
                    <th className="py-3 px-4">Sex &amp; Age Group</th>
                    <th className="py-3 px-4">Purpose</th>
                    <th className="py-3 px-4">Headcount</th>
                    <th className="py-3 px-4">HH Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filtered.map((row) => (
                    <tr
                      key={row.id}
                      onClick={() =>
                        navigate(
                          row.householdStatus === HOUSEHOLD_STATUS.SUBMITTED
                            ? `/households/view/${row.hhid}`
                            : `/households/resume/${row.hhid}`
                        )
                      }
                      className="hover:bg-slate-50/80 cursor-pointer"
                    >
                      <td className="py-3 px-4">
                        <p className="font-mono text-xs font-bold text-[#0B5D36]">
                          {row.hhid}
                        </p>
                        <p className="text-xs font-medium text-slate-700">
                          {row.ownerName}
                        </p>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-900">
                          {row.species}
                        </span>{' '}
                        <span className="font-mono text-xs text-slate-500">
                          ({row.speciesCode})
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-medium text-slate-900">{row.breedName}</p>
                        <p className="font-mono text-[11px] text-slate-500">
                          {row.breedCode} &bull; {row.breedType}
                        </p>
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-700">
                        <p>{row.sex}</p>
                        <p className="text-slate-500">{row.ageGroup}</p>
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-700">
                        {row.purpose}
                      </td>
                      <td className="py-3 px-4 font-bold tabular-nums text-[#0B5D36]">
                        {row.headcount}
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={row.householdStatus} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
