import { z } from 'zod';

export const householdSchema = z
  .object({
    district: z.string().min(1, 'District is required'),
    houseAddress: z
      .string()
      .trim()
      .min(3, 'Enter house number and hamlet/street/mohalla'),
    ownerName: z.string().trim().min(2, 'Owner name is required'),
    gender: z.enum(['1', '2', '3'], {
      message: 'Select gender of the head of NHHE',
    }),
    ownsLivestock: z.enum(['1', '2'], {
      message: 'Select whether the household owns livestock/poultry',
    }),
    occupation: z.string().optional(),
    education: z.string().optional(),
    socialStatus: z.string().optional(),
    hasFinancialSupport: z.string().optional(),
    hasBeneficiaryId: z.string().optional(),
    hasInsuranceId: z.string().optional(),
    mobileNumber: z
      .string()
      .trim()
      .refine(
        (val) => val === '' || /^[6-9]\d{9}$/.test(val),
        'Enter a valid 10-digit Indian mobile number or leave blank'
      ),
  })
  .superRefine((data, ctx) => {
    if (data.ownsLivestock === '1') {
      if (!data.occupation) {
        ctx.addIssue({
          code: 'custom',
          path: ['occupation'],
          message: 'Occupation is required when household owns livestock/poultry',
        });
      }
      if (!data.education) {
        ctx.addIssue({
          code: 'custom',
          path: ['education'],
          message: 'Educational status is required',
        });
      }
      if (!data.socialStatus) {
        ctx.addIssue({
          code: 'custom',
          path: ['socialStatus'],
          message: 'Social status is required',
        });
      }
      if (!data.hasFinancialSupport) {
        ctx.addIssue({
          code: 'custom',
          path: ['hasFinancialSupport'],
          message: 'Select Yes or No for institutional financial support',
        });
      }
      if (!data.hasBeneficiaryId) {
        ctx.addIssue({
          code: 'custom',
          path: ['hasBeneficiaryId'],
          message: 'Select Yes or No for Beneficiary ID',
        });
      }
      if (!data.hasInsuranceId) {
        ctx.addIssue({
          code: 'custom',
          path: ['hasInsuranceId'],
          message: 'Select Yes or No for Insurance ID',
        });
      }
    }
  });

export const livestockEntrySchema = z.object({
  villageWard: z.string().min(1, 'Village / Ward is required'),
  unitType: z.string().min(1, 'Unit Type is required'),
  species: z.string().min(1, 'Species is required'),
  speciesCode: z.string().min(1, 'Species Code is required'),
  breedType: z.string().min(1, 'Breed Type is required'),
  breedName: z.string().min(1, 'Breed Name is required'),
  breedCode: z.string().min(1, 'Breed Code is required'),
  sex: z.string().min(1, 'Sex is required'),
  ageGroup: z.string().min(1, 'Age Group is required'),
  purpose: z.string().min(1, 'Use / Purpose is required'),
  protectionStatus: z.string().min(1, 'Protection Status is required'),
  headcount: z.coerce
    .number({ invalid_type_error: 'Headcount must be a valid number' })
    .int('Headcount must be a whole number')
    .min(1, 'Headcount must be at least 1'),
  remarks: z.string().trim().optional(),
  identificationNotes: z.string().trim().optional(),
});
