import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import HouseholdFormStep from '../../components/census/HouseholdFormStep';
import LivestockEntryStep from '../../components/census/LivestockEntryStep';
import ReviewSubmitStep from '../../components/census/ReviewSubmitStep';
import SpeciesCategoryStep from '../../components/census/SpeciesCategoryStep';
import StepProgressHeader from '../../components/census/StepProgressHeader';
import { HOUSEHOLD_STATUS } from '../../data/mockHouseholds';
import { useAuth } from '../../hooks/useAuth';
import { useCensus } from '../../hooks/useCensus';

export default function HouseholdCensusWizardPage({ mode = 'new' }) {
  const { hhid: routeHhid } = useParams();
  return <WizardContent key={`${mode}-${routeHhid || 'new'}`} mode={mode} routeHhid={routeHhid} />;
}

function WizardContent({ mode, routeHhid }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getHouseholdByHhid, saveHousehold, saving, showToast } = useCensus();

  const existingRecord = useMemo(
    () => (routeHhid ? getHouseholdByHhid(routeHhid) : null),
    [routeHhid, getHouseholdByHhid]
  );

  const isViewMode =
    mode === 'view' || existingRecord?.status === HOUSEHOLD_STATUS.SUBMITTED;

  const [household, setHousehold] = useState(() => existingRecord || null);
  const [step, setStep] = useState(() => {
    if (isViewMode) return 4;
    if (existingRecord) {
      if (existingRecord.ownsLivestock === '2') return 4;
      if (existingRecord.hhid) return 2;
    }
    return 1;
  });
  const [activeSpecies, setActiveSpecies] = useState(null);

  const activeSpeciesEntries = useMemo(() => {
    if (!activeSpecies || !household?.livestockEntries) return [];
    return household.livestockEntries.filter(
      (e) => e.speciesCode === activeSpecies.code
    );
  }, [activeSpecies, household]);

  if ((mode === 'resume' || mode === 'view') && !existingRecord) {
    return (
      <div className="rounded-2xl bg-white border border-slate-200 p-6 text-center space-y-3">
        <p className="text-base font-bold text-slate-900">
          Household record not found
        </p>
        <p className="text-sm text-slate-600">
          The requested HHID ({routeHhid}) could not be located in your jurisdiction.
        </p>
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="rounded-xl bg-[#0B5D36] px-5 py-2.5 text-sm font-semibold text-white cursor-pointer"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  // Step 1: Save Household as Draft
  const handleHouseholdSaveDraft = async (formValues) => {
    const payload = {
      ...(household || {}),
      ...formValues,
    };
    const res = await saveHousehold(payload, { isDraft: true });
    if (res.success) {
      setHousehold(res.data);
    }
  };

  // Step 1: Save Household & Continue
  const handleHouseholdContinue = async (formValues) => {
    const payload = {
      ...(household || {}),
      ...formValues,
    };
    const res = await saveHousehold(payload, { isDraft: formValues.ownsLivestock === '1' });
    if (res.success) {
      setHousehold(res.data);
      if (formValues.ownsLivestock === '2') {
        setStep(4);
      } else {
        setStep(2);
      }
    }
  };

  // Step 2: Select Yes on a species card -> open Step 3 form
  const handleSelectSpeciesYes = async (species) => {
    const nextSelection = {
      ...(household?.speciesSelection || {}),
      [species.code]: 'yes',
    };
    const nextHousehold = {
      ...household,
      speciesSelection: nextSelection,
    };
    setHousehold(nextHousehold);
    setActiveSpecies(species);
    setStep(3);
  };

  // Step 2: Select No on a species card
  const handleSelectSpeciesNo = async (species) => {
    const nextSelection = {
      ...(household?.speciesSelection || {}),
      [species.code]: 'no',
    };
    const nextHousehold = {
      ...household,
      speciesSelection: nextSelection,
    };
    setHousehold(nextHousehold);
    await saveHousehold(nextHousehold, { isDraft: true });
  };

  // Save draft from Step 2 / Step 4
  const handleSaveCurrentDraft = async () => {
    if (!household) return;
    const res = await saveHousehold(household, { isDraft: true });
    if (res.success) {
      setHousehold(res.data);
    }
  };

  // Step 3: Save livestock entry (draft or continue)
  const upsertEntryInHousehold = async (entryPayload, { isDraft, returnToCategories }) => {
    const resolvedEntry = {
      ...entryPayload,
      id: entryPayload.id || `LS-${Date.now()}`,
    };
    const currentEntries = household?.livestockEntries || [];
    const exists = currentEntries.some((item) => item.id === resolvedEntry.id);
    const updatedEntries = exists
      ? currentEntries.map((item) =>
          item.id === resolvedEntry.id ? resolvedEntry : item
        )
      : [...currentEntries, resolvedEntry];

    const updatedHousehold = {
      ...household,
      speciesSelection: {
        ...(household?.speciesSelection || {}),
        [entryPayload.speciesCode]: 'yes',
      },
      livestockEntries: updatedEntries,
    };

    const res = await saveHousehold(updatedHousehold, { isDraft });
    if (res.success) {
      setHousehold(res.data);
      if (returnToCategories) {
        setActiveSpecies(null);
        setStep(2);
      }
    }
  };

  const handleDeleteSpeciesEntry = async (entryId) => {
    const updatedEntries = (household?.livestockEntries || []).filter(
      (item) => item.id !== entryId
    );
    const updatedHousehold = {
      ...household,
      livestockEntries: updatedEntries,
    };
    const res = await saveHousehold(updatedHousehold, { isDraft: true });
    if (res.success) {
      setHousehold(res.data);
    }
  };

  // Step 4: Final Submit
  const handleFinalSubmit = async () => {
    if (!household) return;
    if (
      household.ownsLivestock === '1' &&
      (!household.livestockEntries || household.livestockEntries.length === 0)
    ) {
      showToast(
        'Please enter at least one livestock/poultry species record before Final Submit.',
        'error'
      );
      setStep(2);
      return;
    }

    const res = await saveHousehold(household, { isFinalSubmit: true });
    if (res.success) {
      navigate('/dashboard', { replace: true });
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      <StepProgressHeader
        currentStep={step}
        hhid={household?.hhid}
        status={household?.status}
        viewOnly={isViewMode}
      />

      {step === 1 && !isViewMode && (
        <HouseholdFormStep
          initialData={household}
          allowedDistricts={user?.assignedDistricts}
          saving={saving}
          onSaveDraft={handleHouseholdSaveDraft}
          onSaveAndContinue={handleHouseholdContinue}
        />
      )}

      {step === 2 && !isViewMode && household && (
        <SpeciesCategoryStep
          speciesSelection={household.speciesSelection}
          livestockEntries={household.livestockEntries}
          saving={saving}
          onSelectSpeciesYes={handleSelectSpeciesYes}
          onSelectSpeciesNo={handleSelectSpeciesNo}
          onEditHousehold={() => setStep(1)}
          onSaveDraft={handleSaveCurrentDraft}
          onProceedToReview={() => setStep(4)}
        />
      )}

      {step === 3 && !isViewMode && household && activeSpecies && (
        <LivestockEntryStep
          hhid={household.hhid}
          district={household.district}
          activeSpecies={activeSpecies}
          speciesEntries={activeSpeciesEntries}
          saving={saving}
          onBackToCategories={() => {
            setActiveSpecies(null);
            setStep(2);
          }}
          onSaveEntryAsDraft={(entry) =>
            upsertEntryInHousehold(entry, {
              isDraft: true,
              returnToCategories: false,
            })
          }
          onSaveAndContinue={(entry) =>
            upsertEntryInHousehold(entry, {
              isDraft: false,
              returnToCategories: true,
            })
          }
          onDeleteSpeciesEntry={handleDeleteSpeciesEntry}
        />
      )}

      {step === 4 && household && (
        <ReviewSubmitStep
          household={household}
          viewOnly={isViewMode}
          saving={saving}
          onEditHousehold={() => setStep(1)}
          onEditLivestock={() => setStep(2)}
          onSaveDraft={handleSaveCurrentDraft}
          onFinalSubmit={handleFinalSubmit}
        />
      )}
    </div>
  );
}
