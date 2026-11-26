export const ROLES = {
  ADMIN: 'ADMIN',
  DISTRICT_USER: 'DISTRICT_USER',
  ENUMERATOR: 'ENUMERATOR',
  DIRECTOR: 'DIRECTOR',
};

export const ROLE_LABELS = {
  [ROLES.ADMIN]: 'Administrator',
  [ROLES.DISTRICT_USER]: 'District-level User',
  [ROLES.ENUMERATOR]: 'Enumerator / Data Entry Operator',
  [ROLES.DIRECTOR]: 'Director / Department Official',
};

export const ASSAM_DISTRICTS = [
  'Sonitpur',
  'Kamrup',
  'Nagaon',
  'Barpeta',
  'Dibrugarh',
];

export const DEMO_USERS = [
  {
    id: 'USR-001',
    username: 'admin@vet.assam.gov.in',
    password: 'Password@123',
    name: 'Dr. Bhaskarjyoti Kalita',
    designation: 'System Administrator',
    role: ROLES.ADMIN,
    district: 'All Districts (State HQ)',
    assignedDistricts: ASSAM_DISTRICTS,
    employeeCode: 'ASM-VET-001',
  },
  {
    id: 'USR-002',
    username: 'dvo.sonitpur@vet.assam.gov.in',
    password: 'Password@123',
    name: 'Dr. Anupama Bora',
    designation: 'District Veterinary Officer',
    role: ROLES.DISTRICT_USER,
    district: 'Sonitpur',
    assignedDistricts: ['Sonitpur'],
    employeeCode: 'ASM-SON-014',
  },
  {
    id: 'USR-003',
    username: 'enum.kamrup@vet.assam.gov.in',
    password: 'Password@123',
    name: 'Pranjal Das',
    designation: 'Field Enumerator (Chaygaon Block)',
    role: ROLES.ENUMERATOR,
    district: 'Kamrup',
    assignedDistricts: ['Kamrup'],
    employeeCode: 'ASM-KAM-108',
  },
  {
    id: 'USR-004',
    username: 'director@vet.assam.gov.in',
    password: 'Password@123',
    name: 'Shri R. K. Sarmah, IAS',
    designation: 'Director, Veterinary Department',
    role: ROLES.DIRECTOR,
    district: 'All Districts (State HQ)',
    assignedDistricts: ASSAM_DISTRICTS,
    employeeCode: 'ASM-DIR-001',
  },
];
