import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowRight,
  faFloppyDisk,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import {
  EDUCATION_OPTIONS,
  GENDER_OPTIONS,
  OCCUPATION_OPTIONS,
  SOCIAL_STATUS_OPTIONS,
  YES_NO_OPTIONS,
} from '../../data/censusMasterData';
import { ASSAM_DISTRICTS } from '../../data/demoUsers';
import { householdSchema } from '../../validations/censusSchemas';

function SegmentedButtonGroup({ options, value, onChange, columns = 2 }) {
  return (
    <div
      className={`grid gap-2 ${
        columns === 3 ? 'grid-cols-3' : 'grid-cols-2'
      }`}
    >
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`min-h-11 rounded-xl border px-2.5 py-2 text-xs sm:text-sm font-semibold transition cursor-pointer ${
              active
                ? 'bg-[#0B5D36] border-[#0B5D36] text-white shadow-2xs'
                : 'bg-white border-slate-300 text-slate-700 hover:border-[#0B5D36] hover:bg-emerald-50/40'
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export default function HouseholdFormStep({
  initialData,
  allowedDistricts,
  saving,
  onSaveDraft,
  onSaveAndContinue,
}) {
  const districtChoices =
    allowedDistricts && allowedDistricts.length > 0
      ? allowedDistricts
      : ASSAM_DISTRICTS;

  const {
    register,
    control,
    handleSubmit,
    getValues,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(householdSchema),
    defaultValues: {
      district: initialData?.district || districtChoices[0],
      houseAddress: initialData?.houseAddress || '',
      ownerName: initialData?.ownerName || '',
      gender: initialData?.gender || '',
      ownsLivestock: initialData?.ownsLivestock || '',
      occupation: initialData?.occupation || '',
      education: initialData?.education || '',
      socialStatus: initialData?.socialStatus || '',
      hasFinancialSupport: initialData?.hasFinancialSupport || '',
      hasBeneficiaryId: initialData?.hasBeneficiaryId || '',
      hasInsuranceId: initialData?.hasInsuranceId || '',
      mobileNumber: initialData?.mobileNumber || '',
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        district: initialData.district || districtChoices[0],
        houseAddress: initialData.houseAddress || '',
        ownerName: initialData.ownerName || '',
        gender: initialData.gender || '',
        ownsLivestock: initialData.ownsLivestock || '',
        occupation: initialData.occupation || '',
        education: initialData.education || '',
        socialStatus: initialData.socialStatus || '',
        hasFinancialSupport: initialData.hasFinancialSupport || '',
        hasBeneficiaryId: initialData.hasBeneficiaryId || '',
        hasInsuranceId: initialData.hasInsuranceId || '',
        mobileNumber: initialData.mobileNumber || '',
      });
    }
  }, [initialData, districtChoices, reset]);

  const genderValue = useWatch({ control, name: 'gender' });
  const ownsLivestockValue = useWatch({ control, name: 'ownsLivestock' });
  const financialSupportValue = useWatch({ control, name: 'hasFinancialSupport' });
  const beneficiaryIdValue = useWatch({ control, name: 'hasBeneficiaryId' });
  const insuranceIdValue = useWatch({ control, name: 'hasInsuranceId' });

  const showLivestockQuestions = ownsLivestockValue === '1';

  const handleOwnershipChange = (value) => {
    setValue('ownsLivestock', value, { shouldValidate: true });
    if (value === '2') {
      setValue('occupation', '');
      setValue('education', '');
      setValue('socialStatus', '');
      setValue('hasFinancialSupport', '');
      setValue('hasBeneficiaryId', '');
      setValue('hasInsuranceId', '');
    }
  };

  const handleDraftClick = () => {
    onSaveDraft(getValues());
  };

  const inputClass = (hasError) =>
    `w-full min-h-12 rounded-xl border bg-white px-3.5 text-base sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition ${
      hasError
        ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20'
        : 'border-slate-300 focus:border-[#0B5D36] focus:ring-[#0B5D36]/15'
    }`;

  return (
    <form
      onSubmit={handleSubmit(onSaveAndContinue)}
      noValidate
      className="space-y-4"
    >
      {/* Card 1: Basic Identification & Address */}
      <section className="rounded-2xl bg-white border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-4 sm:px-6 py-3.5 bg-slate-50 border-b border-slate-200">
          <h2 className="text-sm sm:text-base font-bold text-slate-900">
            Household Particulars
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Unique HHID is auto-generated and linked to all species entries
          </p>
        </div>

        <div className="p-4 sm:p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1.5">
                1. Household ID (HHID)
              </label>
              <input
                type="text"
                readOnly
                value={initialData?.hhid || 'Auto-generated upon Save'}
                className="w-full min-h-12 rounded-xl border border-slate-200 bg-slate-100 px-3.5 font-mono text-sm font-semibold text-[#0B5D36] cursor-not-allowed"
              />
            </div>

            <div>
              <label
                htmlFor="hh-district"
                className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1.5"
              >
                District <span className="text-rose-600">*</span>
              </label>
              <select
                id="hh-district"
                {...register('district')}
                disabled={districtChoices.length === 1 || Boolean(initialData?.hhid)}
                className={`${inputClass(Boolean(errors.district))} disabled:bg-slate-100 disabled:text-slate-700`}
              >
                {districtChoices.map((dist) => (
                  <option key={dist} value={dist}>
                    {dist}
                  </option>
                ))}
              </select>
              {errors.district && (
                <p className="mt-1 text-xs font-medium text-rose-600">
                  {errors.district.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="houseAddress"
                className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1.5"
              >
                2. House No. with Hamlet / Street / Mohalla{' '}
                <span className="text-rose-600">*</span>
              </label>
              <input
                id="houseAddress"
                type="text"
                placeholder="e.g. H.No. 42, Bamunigaon Hamlet, Chaygaon"
                {...register('houseAddress')}
                className={inputClass(Boolean(errors.houseAddress))}
              />
              {errors.houseAddress && (
                <p className="mt-1 text-xs font-medium text-rose-600">
                  {errors.houseAddress.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="ownerName"
                className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1.5"
              >
                3. Name of the Owner of NHHE{' '}
                <span className="text-rose-600">*</span>
              </label>
              <input
                id="ownerName"
                type="text"
                placeholder="Full name of Head / Owner"
                {...register('ownerName')}
                className={inputClass(Boolean(errors.ownerName))}
              />
              {errors.ownerName && (
                <p className="mt-1 text-xs font-medium text-rose-600">
                  {errors.ownerName.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1.5">
                4. Gender of the Head of NHHE{' '}
                <span className="text-rose-600">*</span>
              </label>
              <SegmentedButtonGroup
                options={GENDER_OPTIONS}
                value={genderValue}
                columns={3}
                onChange={(val) => setValue('gender', val, { shouldValidate: true })}
              />
              {errors.gender && (
                <p className="mt-1 text-xs font-medium text-rose-600">
                  {errors.gender.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="mobileNumber"
                className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1.5"
              >
                12. Mobile Number{' '}
                <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                id="mobileNumber"
                type="tel"
                inputMode="numeric"
                maxLength={10}
                placeholder="10-digit mobile number"
                {...register('mobileNumber')}
                className={inputClass(Boolean(errors.mobileNumber))}
              />
              {errors.mobileNumber && (
                <p className="mt-1 text-xs font-medium text-rose-600">
                  {errors.mobileNumber.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Card 2: Ownership Gate (Field 5) + Conditional Fields 6–11 */}
      <section className="rounded-2xl bg-white border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 sm:p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-2">
              5. Whether the Household Owns Any Type of Livestock and/or Poultry{' '}
              <span className="text-rose-600">*</span>
            </label>
            <SegmentedButtonGroup
              options={YES_NO_OPTIONS}
              value={ownsLivestockValue}
              onChange={handleOwnershipChange}
            />
            {errors.ownsLivestock && (
              <p className="mt-1.5 text-xs font-medium text-rose-600">
                {errors.ownsLivestock.message}
              </p>
            )}
          </div>

          {showLivestockQuestions ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-4 sm:p-5 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0B5D36]">
                <FontAwesomeIcon icon={faInfoCircle} />
                <span>Livestock-Owning Household Details (Fields 6&ndash;11)</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label
                    htmlFor="occupation"
                    className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1.5"
                  >
                    6. Occupation of Owner <span className="text-rose-600">*</span>
                  </label>
                  <select
                    id="occupation"
                    {...register('occupation')}
                    className={inputClass(Boolean(errors.occupation))}
                  >
                    <option value="">-- Select Occupation --</option>
                    {OCCUPATION_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  {errors.occupation && (
                    <p className="mt-1 text-xs font-medium text-rose-600">
                      {errors.occupation.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="education"
                    className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1.5"
                  >
                    7. Educational Status <span className="text-rose-600">*</span>
                  </label>
                  <select
                    id="education"
                    {...register('education')}
                    className={inputClass(Boolean(errors.education))}
                  >
                    <option value="">-- Select Education --</option>
                    {EDUCATION_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  {errors.education && (
                    <p className="mt-1 text-xs font-medium text-rose-600">
                      {errors.education.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="socialStatus"
                    className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1.5"
                  >
                    8. Social Status <span className="text-rose-600">*</span>
                  </label>
                  <select
                    id="socialStatus"
                    {...register('socialStatus')}
                    className={inputClass(Boolean(errors.socialStatus))}
                  >
                    <option value="">-- Select Social Status --</option>
                    {SOCIAL_STATUS_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  {errors.socialStatus && (
                    <p className="mt-1 text-xs font-medium text-rose-600">
                      {errors.socialStatus.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1.5">
                    9. Institutional Financial Support?{' '}
                    <span className="text-rose-600">*</span>
                  </label>
                  <SegmentedButtonGroup
                    options={YES_NO_OPTIONS}
                    value={financialSupportValue}
                    onChange={(val) =>
                      setValue('hasFinancialSupport', val, { shouldValidate: true })
                    }
                  />
                  {errors.hasFinancialSupport && (
                    <p className="mt-1 text-xs font-medium text-rose-600">
                      {errors.hasFinancialSupport.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1.5">
                    10. Has Beneficiary ID for Farm?{' '}
                    <span className="text-rose-600">*</span>
                  </label>
                  <SegmentedButtonGroup
                    options={YES_NO_OPTIONS}
                    value={beneficiaryIdValue}
                    onChange={(val) =>
                      setValue('hasBeneficiaryId', val, { shouldValidate: true })
                    }
                  />
                  {errors.hasBeneficiaryId && (
                    <p className="mt-1 text-xs font-medium text-rose-600">
                      {errors.hasBeneficiaryId.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1.5">
                    11. Has Insurance ID for Farm?{' '}
                    <span className="text-rose-600">*</span>
                  </label>
                  <SegmentedButtonGroup
                    options={YES_NO_OPTIONS}
                    value={insuranceIdValue}
                    onChange={(val) =>
                      setValue('hasInsuranceId', val, { shouldValidate: true })
                    }
                  />
                  {errors.hasInsuranceId && (
                    <p className="mt-1 text-xs font-medium text-rose-600">
                      {errors.hasInsuranceId.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : ownsLivestockValue === '2' ? (
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs sm:text-sm text-slate-600">
              Household marked as <strong>No &ndash; 2</strong> (owns no livestock or
              poultry). Fields 6&ndash;11 are hidden and you can proceed directly to Review
              &amp; Submit.
            </div>
          ) : null}
        </div>
      </section>

      {/* Mobile-Friendly Action Bar */}
      <div className="rounded-2xl bg-white border border-slate-200 p-3.5 sm:p-4 shadow-2xs flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        <button
          type="button"
          onClick={handleDraftClick}
          disabled={saving}
          className="min-h-12 inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 px-5 text-sm font-semibold text-slate-700 cursor-pointer disabled:opacity-60"
        >
          <FontAwesomeIcon icon={faFloppyDisk} />
          <span>{saving ? 'Saving...' : 'Save as Draft'}</span>
        </button>

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
  );
}
