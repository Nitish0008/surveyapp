import { DISTRICT_CODES } from '../data/censusMasterData';
import { HOUSEHOLD_STATUS, INITIAL_HOUSEHOLDS } from '../data/mockHouseholds';

const HOUSEHOLDS_KEY = 'assam_livestock_households_v1';

function buildResponse(data, message) {
  return {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  };
}

export function loadHouseholds() {
  try {
    const raw = localStorage.getItem(HOUSEHOLDS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // Fallback to initial seed
  }
  saveHouseholdsToStorage(INITIAL_HOUSEHOLDS);
  return INITIAL_HOUSEHOLDS;
}

function saveHouseholdsToStorage(list) {
  try {
    localStorage.setItem(HOUSEHOLDS_KEY, JSON.stringify(list));
  } catch {
    // Ignore storage quota errors
  }
}

export function generateUniqueHhid(district, existingList) {
  const code = DISTRICT_CODES[district] || 'ASM';
  const prefix = `ASSAM-${code}-`;
  let maxSeq = 100;
  for (const item of existingList) {
    if (item.hhid && item.hhid.startsWith(prefix)) {
      const numPart = Number.parseInt(item.hhid.slice(prefix.length), 10);
      if (!Number.isNaN(numPart) && numPart > maxSeq) {
        maxSeq = numPart;
      }
    }
  }
  return `${prefix}${String(maxSeq + 1).padStart(6, '0')}`;
}

export function upsertHouseholdRecord(payload, { isDraft = false, isFinalSubmit = false } = {}) {
  const current = loadHouseholds();
  const now = new Date().toISOString();
  const district = payload.district || 'Kamrup';
  const hhid = payload.hhid || generateUniqueHhid(district, current);

  const existingIndex = current.findIndex((item) => item.hhid === hhid);

  let nextStatus = HOUSEHOLD_STATUS.DRAFT;
  if (isFinalSubmit) {
    nextStatus = HOUSEHOLD_STATUS.SUBMITTED;
  } else if (!isDraft) {
    const hasEntries = (payload.livestockEntries || []).length > 0;
    const ownsNone = payload.ownsLivestock === '2';
    if (ownsNone || hasEntries) {
      nextStatus = HOUSEHOLD_STATUS.COMPLETED;
    } else {
      nextStatus = HOUSEHOLD_STATUS.IN_PROGRESS;
    }
  } else if ((payload.livestockEntries || []).length > 0) {
    nextStatus = HOUSEHOLD_STATUS.IN_PROGRESS;
  }

  const record = {
    ...payload,
    hhid,
    district,
    status: nextStatus,
    speciesSelection: payload.speciesSelection || {},
    livestockEntries: payload.livestockEntries || [],
    createdBy: payload.createdBy || 'Field Operator',
    registeredAt:
      existingIndex >= 0 ? current[existingIndex].registeredAt : payload.registeredAt || now,
    updatedAt: now,
    submittedAt: isFinalSubmit ? now : existingIndex >= 0 ? current[existingIndex].submittedAt : null,
  };

  let updatedList;
  if (existingIndex >= 0) {
    updatedList = current.map((item, idx) => (idx === existingIndex ? record : item));
  } else {
    updatedList = [record, ...current];
  }

  saveHouseholdsToStorage(updatedList);
  return buildResponse(
    record,
    isFinalSubmit
      ? `Household ${hhid} submitted successfully`
      : isDraft
        ? `Draft saved for ${hhid}`
        : `Household ${hhid} saved`
  );
}

export function deleteDraftHousehold(hhid) {
  const current = loadHouseholds();
  const target = current.find((item) => item.hhid === hhid);
  if (!target || target.status === HOUSEHOLD_STATUS.SUBMITTED) {
    return {
      success: false,
      message: 'Submitted records cannot be deleted.',
      data: null,
      timestamp: new Date().toISOString(),
    };
  }
  const filtered = current.filter((item) => item.hhid !== hhid);
  saveHouseholdsToStorage(filtered);
  return buildResponse(filtered, `Draft ${hhid} removed`);
}

export function resetDemoHouseholds() {
  saveHouseholdsToStorage(INITIAL_HOUSEHOLDS);
  return buildResponse(INITIAL_HOUSEHOLDS, 'Demo census records restored to defaults');
}
