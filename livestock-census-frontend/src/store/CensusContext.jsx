import { useCallback, useMemo, useState } from 'react';
import { HOUSEHOLD_STATUS } from '../data/mockHouseholds';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import {
  deleteDraftHousehold,
  loadHouseholds,
  resetDemoHouseholds,
  upsertHouseholdRecord,
} from '../services/censusService';
import { CensusContext } from './censusContextValue';

export function CensusProvider({ children }) {
  const { user } = useAuth();
  const { showToast, dismissToast } = useToast();
  const [allHouseholds, setAllHouseholds] = useState(() => loadHouseholds());
  const [saving, setSaving] = useState(false);

  const households = useMemo(() => {
    const allowed = user?.assignedDistricts;
    if (!allowed || allowed.length === 0) return allHouseholds;
    return allHouseholds.filter((item) => allowed.includes(item.district));
  }, [allHouseholds, user]);

  const draftHouseholds = useMemo(
    () =>
      households.filter((item) => item.status !== HOUSEHOLD_STATUS.SUBMITTED),
    [households]
  );

  const submittedHouseholds = useMemo(
    () =>
      households.filter((item) => item.status === HOUSEHOLD_STATUS.SUBMITTED),
    [households]
  );

  const stats = useMemo(() => {
    const total = households.length;
    const submitted = submittedHouseholds.length;
    const drafts = households.filter(
      (h) => h.status === HOUSEHOLD_STATUS.DRAFT || h.status === HOUSEHOLD_STATUS.IN_PROGRESS
    ).length;
    const completedPending = households.filter(
      (h) => h.status === HOUSEHOLD_STATUS.COMPLETED
    ).length;
    const pendingSubmissions = draftHouseholds.length;
    const totalLivestockHeadcount = households.reduce(
      (sum, h) =>
        sum +
        (h.livestockEntries || []).reduce(
          (entrySum, entry) => entrySum + (Number(entry.headcount) || 0),
          0
        ),
      0
    );

    return {
      total,
      submitted,
      completedAndSubmitted: submitted + completedPending,
      drafts,
      pendingSubmissions,
      totalLivestockHeadcount,
    };
  }, [households, draftHouseholds.length, submittedHouseholds.length]);

  const saveHousehold = useCallback(
    async (payload, options = {}) => {
      setSaving(true);
      await new Promise((resolve) => setTimeout(resolve, 260));
      const result = upsertHouseholdRecord(
        {
          ...payload,
          createdBy: payload.createdBy || user?.name || 'Field Operator',
        },
        options
      );
      setAllHouseholds(loadHouseholds());
      setSaving(false);
      if (result.success) {
        const title = options.isFinalSubmit
          ? 'Census Record Submitted'
          : options.isDraft
            ? 'Draft Saved'
            : 'Details Saved';
        showToast(result.message, 'success', title);
      } else {
        showToast(result.message || 'Unable to save record', 'error', 'Save Failed');
      }
      return result;
    },
    [showToast, user]
  );

  const removeDraft = useCallback(
    (hhid) => {
      const result = deleteDraftHousehold(hhid);
      if (result.success) {
        setAllHouseholds(loadHouseholds());
        showToast(result.message, 'info', 'Draft Removed');
      } else {
        showToast(result.message, 'error', 'Delete Failed');
      }
      return result;
    },
    [showToast]
  );

  const resetDemoData = useCallback(() => {
    const result = resetDemoHouseholds();
    setAllHouseholds(loadHouseholds());
    showToast(result.message, 'info', 'Demo Data Reset');
  }, [showToast]);

  const getHouseholdByHhid = useCallback(
    (hhid) => allHouseholds.find((item) => item.hhid === hhid) || null,
    [allHouseholds]
  );

  return (
    <CensusContext.Provider
      value={{
        households,
        draftHouseholds,
        submittedHouseholds,
        stats,
        saving,
        showToast,
        dismissToast,
        saveHousehold,
        removeDraft,
        resetDemoData,
        getHouseholdByHhid,
      }}
    >
      {children}
    </CensusContext.Provider>
  );
}
