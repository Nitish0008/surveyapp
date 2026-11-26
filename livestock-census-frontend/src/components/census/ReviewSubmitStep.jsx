import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheckDouble,
  faCow,
  faFloppyDisk,
  faHouseUser,
  faPenToSquare,
} from '@fortawesome/free-solid-svg-icons';
import ConfirmDialog from '../common/ConfirmDialog';
import { GENDER_OPTIONS, YES_NO_OPTIONS } from '../../data/censusMasterData';

function mapOptionLabel(options, value) {
  const found = options.find((o) => o.value === value);
  return found ? found.label : 'Not Specified';
}

export default function ReviewSubmitStep({
  household,
  viewOnly = false,
  saving,
  onEditHousehold,
  onEditLivestock,
  onSaveDraft,
  onFinalSubmit,
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const entries = household?.livestockEntries || [];
  const totalHeadcount = entries.reduce(
    (sum, item) => sum + (Number(item.headcount) || 0),
    0
  );

  const householdDetails = [
    { label: 'Household ID (HHID)', value: household?.hhid, mono: true },
    { label: 'District', value: household?.district },
    { label: 'House No. & Hamlet / Street / Mohalla', value: household?.houseAddress },
    { label: 'Owner of NHHE', value: household?.ownerName },
    { label: 'Gender of Head', value: mapOptionLabel(GENDER_OPTIONS, household?.gender) },
    {
      label: 'Owns Livestock / Poultry',
      value: mapOptionLabel(YES_NO_OPTIONS, household?.ownsLivestock),
    },
    { label: 'Mobile Number', value: household?.mobileNumber || 'Not Provided' },
  ];

  const livestockOwnerDetails =
    household?.ownsLivestock === '1'
      ? [
          { label: 'Occupation', value: household?.occupation || '—' },
          { label: 'Educational Status', value: household?.education || '—' },
          { label: 'Social Status', value: household?.socialStatus || '—' },
          {
            label: 'Institutional Financial Support',
            value: mapOptionLabel(YES_NO_OPTIONS, household?.hasFinancialSupport),
          },
          {
            label: 'Beneficiary ID Status',
            value: mapOptionLabel(YES_NO_OPTIONS, household?.hasBeneficiaryId),
          },
          {
            label: 'Insurance ID Status',
            value: mapOptionLabel(YES_NO_OPTIONS, household?.hasInsuranceId),
          },
        ]
      : [];

  return (
    <div className="space-y-5">
      {/* Household Summary Card */}
      <section className="rounded-2xl bg-white border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-4 sm:px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="h-8 w-8 rounded-lg bg-emerald-100 text-[#0B5D36] flex items-center justify-center shrink-0">
              <FontAwesomeIcon icon={faHouseUser} />
            </span>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900">
                Household Information Summary
              </h2>
              <p className="text-xs text-slate-500">
                Verify registered household details before final submission
              </p>
            </div>
          </div>

          {!viewOnly && (
            <button
              type="button"
              onClick={onEditHousehold}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 cursor-pointer shrink-0"
            >
              <FontAwesomeIcon icon={faPenToSquare} />
              <span>Edit Household Details</span>
            </button>
          )}
        </div>

        <div className="p-4 sm:p-6">
          <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...householdDetails, ...livestockOwnerDetails].map((field) => (
              <div
                key={field.label}
                className="rounded-xl border border-slate-200/80 bg-slate-50/60 px-3.5 py-2.5"
              >
                <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  {field.label}
                </dt>
                <dd
                  className={`mt-1 text-sm font-semibold text-slate-900 ${
                    field.mono ? 'font-mono text-[#0B5D36]' : ''
                  }`}
                >
                  {field.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Livestock & Poultry Summary Card */}
      <section className="rounded-2xl bg-white border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-4 sm:px-6 py-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="h-8 w-8 rounded-lg bg-emerald-100 text-[#0B5D36] flex items-center justify-center shrink-0">
              <FontAwesomeIcon icon={faCow} />
            </span>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900">
                Livestock &amp; Poultry Information ({entries.length} entries &bull;{' '}
                {totalHeadcount} total head)
              </h2>
              <p className="text-xs text-slate-500">
                Species, breed codes, sex, age group, purpose, and protection details
              </p>
            </div>
          </div>

          {!viewOnly && household?.ownsLivestock === '1' && (
            <button
              type="button"
              onClick={onEditLivestock}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 cursor-pointer shrink-0"
            >
              <FontAwesomeIcon icon={faPenToSquare} />
              <span>Edit Livestock Details</span>
            </button>
          )}
        </div>

        <div className="p-4 sm:p-6">
          {household?.ownsLivestock === '2' ? (
            <p className="text-sm text-slate-600">
              This household does not own any livestock or poultry (marked{' '}
              <strong>No – 2</strong>).
            </p>
          ) : entries.length === 0 ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs sm:text-sm text-amber-900">
              No livestock entries recorded yet. Click{' '}
              <strong>Edit Livestock Details</strong> to add species counts, or save as
              a draft.
            </div>
          ) : (
            <div className="space-y-3">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-2.5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-[#0B5D36] text-white px-2 py-0.5 font-mono text-xs font-bold">
                        Code {entry.speciesCode}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900">
                        {entry.species} &mdash; {entry.breedName}
                      </h3>
                      <span className="font-mono text-xs font-semibold text-slate-600">
                        ({entry.breedCode})
                      </span>
                    </div>
                    <span className="rounded-full bg-emerald-100 text-[#0B5D36] px-3 py-1 text-xs font-bold tabular-nums">
                      Headcount: {entry.headcount}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-700">
                    <div>
                      <span className="text-slate-500 block text-[11px]">Village/Ward</span>
                      <span className="font-medium">{entry.villageWard}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Unit &amp; Breed Type</span>
                      <span className="font-medium">
                        {entry.unitType} &bull; {entry.breedType}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Sex &amp; Age Group</span>
                      <span className="font-medium">
                        {entry.sex} &bull; {entry.ageGroup}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Purpose &amp; Protection</span>
                      <span className="font-medium">
                        {entry.purpose} &bull; {entry.protectionStatus}
                      </span>
                    </div>
                  </div>

                  {(entry.remarks || entry.identificationNotes) && (
                    <div className="pt-2 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                      {entry.remarks && (
                        <p>
                          <strong>Remarks:</strong> {entry.remarks}
                        </p>
                      )}
                      {entry.identificationNotes && (
                        <p>
                          <strong>ID Notes:</strong> {entry.identificationNotes}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Review Footer Actions */}
        {!viewOnly && (
          <div className="px-4 sm:px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <button
              type="button"
              onClick={onSaveDraft}
              disabled={saving}
              className="min-h-11 inline-flex items-center justify-center gap-2 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 px-5 text-sm font-semibold text-amber-900 cursor-pointer disabled:opacity-60"
            >
              <FontAwesomeIcon icon={faFloppyDisk} />
              <span>Save as Draft</span>
            </button>

            <button
              type="button"
              onClick={() => setConfirmOpen(true)}
              disabled={saving}
              className="min-h-12 inline-flex items-center justify-center gap-2 rounded-xl bg-[#0B5D36] hover:bg-[#08492A] px-6 text-sm font-bold text-white shadow-sm cursor-pointer disabled:opacity-60"
            >
              <FontAwesomeIcon icon={faCheckDouble} />
              <span>Final Submit</span>
            </button>
          </div>
        )}
      </section>

      <ConfirmDialog
        open={confirmOpen}
        title="Confirm Final Census Submission"
        message={`Are you sure you want to submit household census record ${household?.hhid} (${household?.ownerName}) with ${totalHeadcount} livestock/poultry headcount? Submitted records are locked for official verification.`}
        confirmLabel="Yes, Final Submit"
        loading={saving}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={async () => {
          setConfirmOpen(false);
          await onFinalSubmit();
        }}
      />
    </div>
  );
}
