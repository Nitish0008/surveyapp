import { useEffect, useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faArrowRight,
  faFloppyDisk,
  faMinus,
  faPenToSquare,
  faPlus,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons';
import {
  AGE_GROUP_OPTIONS,
  BREEDS_MASTER,
  BREED_TYPE_OPTIONS,
  PROTECTION_STATUS_OPTIONS,
  PURPOSE_OPTIONS,
  SEX_OPTIONS,
  SPECIES_MASTER,
  UNIT_TYPE_OPTIONS,
  VILLAGES_BY_DISTRICT,
} from '../../data/censusMasterData';
import { livestockEntrySchema } from '../../validations/censusSchemas';

export default function LivestockEntryStep({
  hhid,
  district,
  activeSpecies,
  speciesEntries = [],
  saving,
  onBackToCategories,
  onSaveEntryAsDraft,
  onSaveAndContinue,
  onDeleteSpeciesEntry,
}) {
  const villages = VILLAGES_BY_DISTRICT[district] || VILLAGES_BY_DISTRICT.Kamrup;
  const [editingEntryId, setEditingEntryId] = useState(
    speciesEntries.length > 0 ? speciesEntries[0].id : null
  );

  const editingRecord = useMemo(
    () => speciesEntries.find((e) => e.id === editingEntryId) || null,
    [speciesEntries, editingEntryId]
  );

  const {
    register,
    control,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(livestockEntrySchema),
    defaultValues: {
      villageWard: editingRecord?.villageWard || villages[0] || '',
      unitType: editingRecord?.unitType || '',
      species: editingRecord?.species || activeSpecies?.name || '',
      speciesCode: editingRecord?.speciesCode || activeSpecies?.code || '',
      breedType: editingRecord?.breedType || '',
      breedName: editingRecord?.breedName || '',
      breedCode: editingRecord?.breedCode || '',
      sex: editingRecord?.sex || '',
      ageGroup: editingRecord?.ageGroup || '',
      purpose: editingRecord?.purpose || '',
      protectionStatus: editingRecord?.protectionStatus || '',
      headcount: editingRecord?.headcount || 1,
      remarks: editingRecord?.remarks || '',
      identificationNotes: editingRecord?.identificationNotes || '',
    },
  });

  useEffect(() => {
    reset({
      villageWard: editingRecord?.villageWard || villages[0] || '',
      unitType: editingRecord?.unitType || '',
      species: editingRecord?.species || activeSpecies?.name || '',
      speciesCode: editingRecord?.speciesCode || activeSpecies?.code || '',
      breedType: editingRecord?.breedType || '',
      breedName: editingRecord?.breedName || '',
      breedCode: editingRecord?.breedCode || '',
      sex: editingRecord?.sex || '',
      ageGroup: editingRecord?.ageGroup || '',
      purpose: editingRecord?.purpose || '',
      protectionStatus: editingRecord?.protectionStatus || '',
      headcount: editingRecord?.headcount ?? 1,
      remarks: editingRecord?.remarks || '',
      identificationNotes: editingRecord?.identificationNotes || '',
    });
  }, [editingRecord, activeSpecies, villages, reset]);

  const selectedSpeciesName = useWatch({ control, name: 'species' });
  const selectedSpeciesCode = useWatch({ control, name: 'speciesCode' });
  const selectedBreedType = useWatch({ control, name: 'breedType' });
  const selectedBreedName = useWatch({ control, name: 'breedName' });
  const selectedBreedCode = useWatch({ control, name: 'breedCode' });
  const headcountValue = useWatch({ control, name: 'headcount' });

  const availableBreedTypes = useMemo(() => {
    const types = new Set(
      BREEDS_MASTER.filter((b) => b.speciesCode === selectedSpeciesCode).map(
        (b) => b.breedType
      )
    );
    return types.size > 0
      ? BREED_TYPE_OPTIONS.filter((t) => types.has(t))
      : BREED_TYPE_OPTIONS;
  }, [selectedSpeciesCode]);

  const availableBreeds = useMemo(() => {
    return BREEDS_MASTER.filter(
      (b) =>
        b.speciesCode === selectedSpeciesCode &&
        (!selectedBreedType || b.breedType === selectedBreedType)
    );
  }, [selectedSpeciesCode, selectedBreedType]);

  const handleSpeciesChange = (speciesName) => {
    const found = SPECIES_MASTER.find((s) => s.name === speciesName);
    setValue('species', speciesName, { shouldValidate: true });
    setValue('speciesCode', found?.code || '', { shouldValidate: true });
    setValue('breedType', '');
    setValue('breedName', '');
    setValue('breedCode', '');
  };

  const handleBreedTypeChange = (breedType) => {
    setValue('breedType', breedType, { shouldValidate: true });
    setValue('breedName', '');
    setValue('breedCode', '');
  };

  const handleBreedNameChange = (breedName) => {
    const found = BREEDS_MASTER.find(
      (b) => b.speciesCode === selectedSpeciesCode && b.name === breedName
    );
    setValue('breedName', breedName, { shouldValidate: true });
    setValue('breedCode', found?.code || '', { shouldValidate: true });
  };

  const stepHeadcount = (delta) => {
    const current = Number(headcountValue) || 0;
    const next = Math.max(1, current + delta);
    setValue('headcount', next, { shouldValidate: true });
  };

  const startNewEntry = () => {
    setEditingEntryId(null);
    reset({
      villageWard: villages[0] || '',
      unitType: '',
      species: activeSpecies?.name || '',
      speciesCode: activeSpecies?.code || '',
      breedType: '',
      breedName: '',
      breedCode: '',
      sex: '',
      ageGroup: '',
      purpose: '',
      protectionStatus: '',
      headcount: 1,
      remarks: '',
      identificationNotes: '',
    });
  };

  const buildEntryPayload = (values, isDraft) => ({
    ...values,
    id: editingEntryId || null,
    hhid,
    headcount: Number(values.headcount) || 0,
    isDraft,
  });

  const handleDraftSave = () => {
    onSaveEntryAsDraft(buildEntryPayload(getValues(), true));
  };

  const handleValidSubmit = (values) => {
    onSaveAndContinue(buildEntryPayload(values, false));
  };

  const inputClass = (hasError) =>
    `w-full min-h-12 rounded-xl border bg-white px-3.5 text-base sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition ${
      hasError
        ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20'
        : 'border-slate-300 focus:border-[#0B5D36] focus:ring-[#0B5D36]/15'
    }`;

  return (
    <div className="space-y-4">
      {/* Existing Saved Entries for This Species */}
      {speciesEntries.length > 0 && (
        <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-2xs space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-xs sm:text-sm font-bold text-slate-900">
              Saved {activeSpecies?.name} Entries ({speciesEntries.length})
            </h3>
            <button
              type="button"
              onClick={startNewEntry}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 px-3 py-1.5 text-xs font-bold text-[#0B5D36] cursor-pointer"
            >
              <FontAwesomeIcon icon={faPlus} />
              <span>Add Another Breed</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {speciesEntries.map((entry) => (
              <div
                key={entry.id}
                className={`rounded-xl border p-3 flex items-center justify-between gap-2 ${
                  editingEntryId === entry.id
                    ? 'border-[#0B5D36] bg-emerald-50/45'
                    : 'border-slate-200 bg-slate-50/70'
                }`}
              >
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">
                    {entry.breedName || 'Unspecified Breed'}{' '}
                    <span className="font-mono text-[11px] text-[#0B5D36]">
                      ({entry.breedCode || '—'})
                    </span>
                  </p>
                  <p className="text-[11px] text-slate-600 truncate">
                    {entry.sex} &bull; {entry.headcount} head &bull; {entry.purpose}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => setEditingEntryId(entry.id)}
                    aria-label="Edit entry"
                    className="rounded-lg border border-slate-300 bg-white hover:bg-slate-100 p-2 text-slate-700 text-xs cursor-pointer"
                  >
                    <FontAwesomeIcon icon={faPenToSquare} />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (editingEntryId === entry.id) startNewEntry();
                      onDeleteSpeciesEntry(entry.id);
                    }}
                    aria-label="Delete entry"
                    className="rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 p-2 text-rose-700 text-xs cursor-pointer"
                  >
                    <FontAwesomeIcon icon={faTrashCan} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mobile-First Grouped 15-Field Form */}
      <form
        onSubmit={handleSubmit(handleValidSubmit)}
        noValidate
        className="space-y-4"
      >
        {/* Group 1: Household & Location */}
        <section className="rounded-2xl bg-white border border-slate-200 shadow-2xs overflow-hidden">
          <div className="px-4 sm:px-6 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-2">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900">
                {editingRecord ? 'Edit' : 'Add'} {activeSpecies?.name} Details
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-500">
                Fields 1&ndash;3: Household &amp; Location
              </p>
            </div>
            <span className="rounded-lg bg-[#0B5D36] text-white px-2.5 py-1 font-mono text-xs font-bold">
              Code {selectedSpeciesCode || activeSpecies?.code}
            </span>
          </div>

          <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1.5">
                1. Household ID (HHID)
              </label>
              <input
                type="text"
                readOnly
                value={hhid}
                className="w-full min-h-12 rounded-xl border border-slate-200 bg-slate-100 px-3.5 font-mono text-sm font-bold text-[#0B5D36] cursor-not-allowed"
              />
            </div>

            <div>
              <label
                htmlFor="villageWard"
                className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1.5"
              >
                2. Village / Ward <span className="text-rose-600">*</span>
              </label>
              <select
                id="villageWard"
                {...register('villageWard')}
                className={inputClass(Boolean(errors.villageWard))}
              >
                <option value="">-- Select Village / Ward --</option>
                {villages.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
              {errors.villageWard && (
                <p className="mt-1 text-xs font-medium text-rose-600">
                  {errors.villageWard.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="unitType"
                className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1.5"
              >
                3. Unit Type <span className="text-rose-600">*</span>
              </label>
              <select
                id="unitType"
                {...register('unitType')}
                className={inputClass(Boolean(errors.unitType))}
              >
                <option value="">-- Select Unit Type --</option>
                {UNIT_TYPE_OPTIONS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
              {errors.unitType && (
                <p className="mt-1 text-xs font-medium text-rose-600">
                  {errors.unitType.message}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Group 2: Species & Breed Master Selection */}
        <section className="rounded-2xl bg-white border border-slate-200 shadow-2xs p-4 sm:p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Fields 4&ndash;8: Species &amp; Breed Selection
            </p>
            <div className="flex items-center gap-2 font-mono text-[11px] font-bold">
              <span className="rounded bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[#0B5D36]">
                SP: {selectedSpeciesCode || '—'}
              </span>
              <span className="rounded bg-slate-100 border border-slate-200 px-2 py-0.5 text-slate-700">
                BR: {selectedBreedCode || '—'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="species"
                className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1.5"
              >
                4. Species <span className="text-rose-600">*</span>
              </label>
              <select
                id="species"
                value={selectedSpeciesName || activeSpecies?.name || ''}
                onChange={(e) => handleSpeciesChange(e.target.value)}
                className={inputClass(Boolean(errors.species))}
              >
                <option value="">-- Select Species --</option>
                {SPECIES_MASTER.map((s) => (
                  <option key={s.code} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
              {errors.species && (
                <p className="mt-1 text-xs font-medium text-rose-600">
                  {errors.species.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="speciesCode"
                className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1.5"
              >
                5. Species Code (Auto)
              </label>
              <input
                id="speciesCode"
                type="text"
                readOnly
                {...register('speciesCode')}
                className="w-full min-h-12 rounded-xl border border-slate-200 bg-slate-100 px-3.5 font-mono text-sm font-bold text-slate-800 cursor-not-allowed"
              />
            </div>

            <div>
              <label
                htmlFor="breedType"
                className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1.5"
              >
                6. Breed Type <span className="text-rose-600">*</span>
              </label>
              <select
                id="breedType"
                value={selectedBreedType || ''}
                onChange={(e) => handleBreedTypeChange(e.target.value)}
                className={inputClass(Boolean(errors.breedType))}
              >
                <option value="">-- Select Breed Type --</option>
                {availableBreedTypes.map((bt) => (
                  <option key={bt} value={bt}>
                    {bt}
                  </option>
                ))}
              </select>
              {errors.breedType && (
                <p className="mt-1 text-xs font-medium text-rose-600">
                  {errors.breedType.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="breedName"
                className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1.5"
              >
                7. Breed Name <span className="text-rose-600">*</span>
              </label>
              <select
                id="breedName"
                value={selectedBreedName || ''}
                onChange={(e) => handleBreedNameChange(e.target.value)}
                disabled={!selectedBreedType}
                className={`${inputClass(Boolean(errors.breedName))} disabled:bg-slate-100`}
              >
                <option value="">
                  {selectedBreedType
                    ? '-- Select Breed Name --'
                    : '-- Select Breed Type First --'}
                </option>
                {availableBreeds.map((b) => (
                  <option key={b.code} value={b.name}>
                    {b.name}
                  </option>
                ))}
              </select>
              {errors.breedName && (
                <p className="mt-1 text-xs font-medium text-rose-600">
                  {errors.breedName.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="breedCode"
                className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1.5"
              >
                8. Breed Code (Auto)
              </label>
              <input
                id="breedCode"
                type="text"
                readOnly
                placeholder="Auto-populated"
                {...register('breedCode')}
                className="w-full min-h-12 rounded-xl border border-slate-200 bg-slate-100 px-3.5 font-mono text-sm font-bold text-slate-800 cursor-not-allowed"
              />
            </div>
          </div>
        </section>

        {/* Group 3: Count, Purpose & Field Notes */}
        <section className="rounded-2xl bg-white border border-slate-200 shadow-2xs p-4 sm:p-6 space-y-4">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-600 pb-2 border-b border-slate-100">
            Fields 9&ndash;15: Demographics, Headcount &amp; Notes
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label
                htmlFor="sex"
                className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1.5"
              >
                9. Sex <span className="text-rose-600">*</span>
              </label>
              <select
                id="sex"
                {...register('sex')}
                className={inputClass(Boolean(errors.sex))}
              >
                <option value="">-- Select Sex --</option>
                {SEX_OPTIONS.map((sx) => (
                  <option key={sx} value={sx}>
                    {sx}
                  </option>
                ))}
              </select>
              {errors.sex && (
                <p className="mt-1 text-xs font-medium text-rose-600">
                  {errors.sex.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="ageGroup"
                className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1.5"
              >
                10. Age Group <span className="text-rose-600">*</span>
              </label>
              <select
                id="ageGroup"
                {...register('ageGroup')}
                className={inputClass(Boolean(errors.ageGroup))}
              >
                <option value="">-- Select Age Group --</option>
                {AGE_GROUP_OPTIONS.map((ag) => (
                  <option key={ag} value={ag}>
                    {ag}
                  </option>
                ))}
              </select>
              {errors.ageGroup && (
                <p className="mt-1 text-xs font-medium text-rose-600">
                  {errors.ageGroup.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="purpose"
                className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1.5"
              >
                11. Use / Purpose <span className="text-rose-600">*</span>
              </label>
              <select
                id="purpose"
                {...register('purpose')}
                className={inputClass(Boolean(errors.purpose))}
              >
                <option value="">-- Select Purpose --</option>
                {PURPOSE_OPTIONS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              {errors.purpose && (
                <p className="mt-1 text-xs font-medium text-rose-600">
                  {errors.purpose.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="protectionStatus"
                className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1.5"
              >
                12. Protection Status <span className="text-rose-600">*</span>
              </label>
              <select
                id="protectionStatus"
                {...register('protectionStatus')}
                className={inputClass(Boolean(errors.protectionStatus))}
              >
                <option value="">-- Select Status --</option>
                {PROTECTION_STATUS_OPTIONS.map((ps) => (
                  <option key={ps} value={ps}>
                    {ps}
                  </option>
                ))}
              </select>
              {errors.protectionStatus && (
                <p className="mt-1 text-xs font-medium text-rose-600">
                  {errors.protectionStatus.message}
                </p>
              )}
            </div>
          </div>

          {/* Mobile Stepper Headcount Input */}
          <div className="max-w-xs">
            <label
              htmlFor="headcount"
              className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1.5"
            >
              13. Headcount <span className="text-rose-600">*</span>
            </label>
            <div className="flex items-stretch rounded-xl border border-slate-300 bg-white overflow-hidden">
              <button
                type="button"
                onClick={() => stepHeadcount(-1)}
                aria-label="Decrease headcount"
                className="w-12 flex items-center justify-center bg-slate-50 hover:bg-slate-100 border-r border-slate-300 text-slate-700 cursor-pointer"
              >
                <FontAwesomeIcon icon={faMinus} />
              </button>
              <input
                id="headcount"
                type="number"
                min={1}
                step={1}
                inputMode="numeric"
                {...register('headcount')}
                className="w-full min-h-12 text-center text-base font-bold tabular-nums text-[#0B5D36] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => stepHeadcount(1)}
                aria-label="Increase headcount"
                className="w-12 flex items-center justify-center bg-emerald-50 hover:bg-emerald-100 border-l border-slate-300 text-[#0B5D36] cursor-pointer"
              >
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </div>
            {errors.headcount && (
              <p className="mt-1 text-xs font-medium text-rose-600">
                {errors.headcount.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="remarks"
                className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1.5"
              >
                14. Remarks
              </label>
              <textarea
                id="remarks"
                rows={2}
                placeholder="Vaccination, milk yield, shed notes..."
                {...register('remarks')}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-base sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0B5D36] focus:outline-none focus:ring-2 focus:ring-[#0B5D36]/15"
              />
            </div>

            <div>
              <label
                htmlFor="identificationNotes"
                className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1.5"
              >
                15. Identification Notes
              </label>
              <textarea
                id="identificationNotes"
                rows={2}
                placeholder="Ear tag numbers, colour markings..."
                {...register('identificationNotes')}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-base sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0B5D36] focus:outline-none focus:ring-2 focus:ring-[#0B5D36]/15"
              />
            </div>
          </div>
        </section>

        {/* Action Bar */}
        <div className="rounded-2xl bg-white border border-slate-200 p-3.5 sm:p-4 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          <div className="grid grid-cols-2 sm:flex gap-2">
            <button
              type="button"
              onClick={onBackToCategories}
              className="min-h-11 inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 px-3 sm:px-4 text-xs sm:text-sm font-semibold text-slate-700 cursor-pointer"
            >
              <FontAwesomeIcon icon={faArrowLeft} />
              <span>Categories</span>
            </button>
            <button
              type="button"
              onClick={handleDraftSave}
              disabled={saving}
              className="min-h-11 inline-flex items-center justify-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 px-3 sm:px-4 text-xs sm:text-sm font-semibold text-amber-900 cursor-pointer disabled:opacity-60"
            >
              <FontAwesomeIcon icon={faFloppyDisk} />
              <span>{saving ? 'Saving...' : 'Save Draft'}</span>
            </button>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="min-h-12 inline-flex items-center justify-center gap-2 rounded-xl bg-[#0B5D36] hover:bg-[#08492A] px-6 text-sm font-bold text-white shadow-sm cursor-pointer disabled:opacity-60"
          >
            <span>{saving ? 'Saving...' : 'Save & Continue'}</span>
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>
      </form>
    </div>
  );
}
