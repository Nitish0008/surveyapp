export const GENDER_OPTIONS = [
  { value: '1', label: 'Male – 1', shortLabel: 'Male' },
  { value: '2', label: 'Female – 2', shortLabel: 'Female' },
  { value: '3', label: 'Transgender – 3', shortLabel: 'Transgender' },
];

export const YES_NO_OPTIONS = [
  { value: '1', label: 'Yes – 1' },
  { value: '2', label: 'No – 2' },
];

export const OCCUPATION_OPTIONS = [
  'Cultivator / Agriculture',
  'Livestock & Dairy Farming',
  'Piggery / Goatry / Poultry Farming',
  'Agricultural / Daily Wage Labour',
  'Government / Semi-Govt. Service',
  'Private Employment / Business',
  'Artisan / Fishery / Other',
];

export const EDUCATION_OPTIONS = [
  'Non-Literate',
  'Literate (Non-Formal)',
  'Below Primary (Class I–IV)',
  'Primary (Class V)',
  'Middle (Class VI–VIII)',
  'Matriculate / HSLC (Class X)',
  'Higher Secondary (Class XII)',
  'Graduate & Above',
];

export const SOCIAL_STATUS_OPTIONS = [
  'General',
  'OBC (Other Backward Class)',
  'MOBC (More Other Backward Class)',
  'SC (Scheduled Caste)',
  'ST (Plains)',
  'ST (Hills)',
];

export const DISTRICT_CODES = {
  Sonitpur: 'SON',
  Kamrup: 'KAM',
  Nagaon: 'NAG',
  Barpeta: 'BAR',
  Dibrugarh: 'DIB',
};

export const VILLAGES_BY_DISTRICT = {
  Sonitpur: [
    'Dekargaon (Tezpur Block)',
    'Bihaguri Gaon (Bihaguri Block)',
    'Rangapara Ward 04 (Rangapara)',
    'Balipara Chariali (Balipara Block)',
    'Dhekiajuli Ward 02 (Dhekiajuli)',
  ],
  Kamrup: [
    'Chaygaon Pt-I (Chaygaon Block)',
    'Boko Gaon (Boko Block)',
    'Hajo Ramdia (Hajo Block)',
    'Amingaon Ward 03 (North Guwahati)',
    'Mirza Palashbari (Rani Block)',
  ],
  Nagaon: [
    'Kaliabor Kuwaritol (Kaliabor Block)',
    'Raha Chaparmukh (Raha Block)',
    'Dhing Ward 05 (Dhing)',
    'Samaguri Gaon (Bajiagaon Block)',
    'Kampur Town Ward 01 (Kathiatoli)',
  ],
  Barpeta: [
    'Howly Ward 02 (Barpeta Block)',
    'Sarthebari Gaon (Sarukhetri Block)',
    'Pathsala Ward 01 (Bajali)',
    'Mandia Char (Mandia Block)',
    'Sorbhog Town Ward 03 (Chakchaka)',
  ],
  Dibrugarh: [
    'Chabua Hatigarh (Panitola Block)',
    'Naharkatia Ward 04 (Joypur Block)',
    'Moranhat Gaon (Khowang Block)',
    'Lahowal Borbaruah (Barbaruah Block)',
    'Tengakhat Gaon (Tengakhat Block)',
  ],
};

export const UNIT_TYPE_OPTIONS = [
  'Household / Backyard Unit',
  'Smallholder Farm Unit',
  'Commercial Dairy Unit',
  'Commercial Piggery Unit',
  'Commercial Poultry Unit',
  'Gaushala / Institutional Farm',
];

export const SPECIES_MASTER = [
  {
    id: 'SP-01',
    code: '01',
    name: 'Cattle',
    categoryGroup: 'Bovine',
    description: 'Indigenous, crossbred & exotic cows/bulls',
  },
  {
    id: 'SP-02',
    code: '02',
    name: 'Buffalo',
    categoryGroup: 'Bovine',
    description: 'Swamp & riverine buffaloes',
  },
  {
    id: 'SP-04',
    code: '04',
    name: 'Mithun',
    categoryGroup: 'Bovine',
    description: 'Semi-domesticated hill & foothill mithun',
  },
  {
    id: 'SP-05',
    code: '05',
    name: 'Sheep',
    categoryGroup: 'Ovine',
    description: 'Indigenous & crossbred sheep flocks',
  },
  {
    id: 'SP-06',
    code: '06',
    name: 'Goat',
    categoryGroup: 'Caprine',
    description: 'Assam Hill, Black Bengal & crossbred goats',
  },
  {
    id: 'SP-12',
    code: '12',
    name: 'Pig',
    categoryGroup: 'Porcine',
    description: 'Doom, Mali, Hampshire & crossbred pigs',
  },
  {
    id: 'SP-15',
    code: '15',
    name: 'Poultry',
    categoryGroup: 'Avian',
    description: 'Desi fowl, broiler, layer & ducks (Pati/Chara)',
  },
  {
    id: 'SP-18',
    code: '18',
    name: 'Horse / Pony & Other',
    categoryGroup: 'Equine / Other',
    description: 'Equines, rabbits & other census species',
  },
];

export const BREED_TYPE_OPTIONS = [
  'Indigenous / Pure Local',
  'Crossbred',
  'Exotic',
  'Non-Descript',
];

export const BREEDS_MASTER = [
  // Cattle (01)
  { speciesCode: '01', breedType: 'Indigenous / Pure Local', name: 'Lakhimi Cattle', code: 'CAT-IND-01' },
  { speciesCode: '01', breedType: 'Indigenous / Pure Local', name: 'Sahiwal', code: 'CAT-IND-02' },
  { speciesCode: '01', breedType: 'Indigenous / Pure Local', name: 'Gir', code: 'CAT-IND-03' },
  { speciesCode: '01', breedType: 'Crossbred', name: 'Jersey Crossbred', code: 'CAT-CRS-01' },
  { speciesCode: '01', breedType: 'Crossbred', name: 'Holstein Friesian Cross', code: 'CAT-CRS-02' },
  { speciesCode: '01', breedType: 'Exotic', name: 'Pure Jersey', code: 'CAT-EXO-01' },
  { speciesCode: '01', breedType: 'Non-Descript', name: 'Local Non-Descript Cattle', code: 'CAT-ND-01' },

  // Buffalo (02)
  { speciesCode: '02', breedType: 'Indigenous / Pure Local', name: 'Assam Swamp Buffalo', code: 'BUF-IND-01' },
  { speciesCode: '02', breedType: 'Indigenous / Pure Local', name: 'Murrah', code: 'BUF-IND-02' },
  { speciesCode: '02', breedType: 'Crossbred', name: 'Murrah Graded Cross', code: 'BUF-CRS-01' },
  { speciesCode: '02', breedType: 'Non-Descript', name: 'Local Non-Descript Buffalo', code: 'BUF-ND-01' },

  // Mithun (04)
  { speciesCode: '04', breedType: 'Indigenous / Pure Local', name: 'Assam Hill Mithun', code: 'MTH-IND-01' },
  { speciesCode: '04', breedType: 'Non-Descript', name: 'Non-Descript Mithun', code: 'MTH-ND-01' },

  // Sheep (05)
  { speciesCode: '05', breedType: 'Indigenous / Pure Local', name: 'Garole Sheep', code: 'SHP-IND-01' },
  { speciesCode: '05', breedType: 'Crossbred', name: 'Corriedale Cross', code: 'SHP-CRS-01' },
  { speciesCode: '05', breedType: 'Non-Descript', name: 'Local Non-Descript Sheep', code: 'SHP-ND-01' },

  // Goat (06)
  { speciesCode: '06', breedType: 'Indigenous / Pure Local', name: 'Assam Hill Goat', code: 'GOT-IND-01' },
  { speciesCode: '06', breedType: 'Indigenous / Pure Local', name: 'Black Bengal', code: 'GOT-IND-02' },
  { speciesCode: '06', breedType: 'Crossbred', name: 'Beetal Cross', code: 'GOT-CRS-01' },
  { speciesCode: '06', breedType: 'Non-Descript', name: 'Local Non-Descript Goat', code: 'GOT-ND-01' },

  // Pig (12)
  { speciesCode: '12', breedType: 'Indigenous / Pure Local', name: 'Doom Pig', code: 'PIG-IND-01' },
  { speciesCode: '12', breedType: 'Indigenous / Pure Local', name: 'Mali / Ghungroo', code: 'PIG-IND-02' },
  { speciesCode: '12', breedType: 'Crossbred', name: 'Hampshire Crossbred', code: 'PIG-CRS-01' },
  { speciesCode: '12', breedType: 'Crossbred', name: 'Large White Yorkshire Cross', code: 'PIG-CRS-02' },
  { speciesCode: '12', breedType: 'Exotic', name: 'Large Black / Hampshire', code: 'PIG-EXO-01' },
  { speciesCode: '12', breedType: 'Non-Descript', name: 'Local Non-Descript Pig', code: 'PIG-ND-01' },

  // Poultry (15)
  { speciesCode: '15', breedType: 'Indigenous / Pure Local', name: 'Assam Desi Fowl (Miri/Aseel)', code: 'PLT-IND-01' },
  { speciesCode: '15', breedType: 'Indigenous / Pure Local', name: 'Pati Duck (Indigenous)', code: 'PLT-IND-02' },
  { speciesCode: '15', breedType: 'Crossbred', name: 'Kuroiler / Vanaraja', code: 'PLT-CRS-01' },
  { speciesCode: '15', breedType: 'Exotic', name: 'Commercial Broiler / Layer', code: 'PLT-EXO-01' },
  { speciesCode: '15', breedType: 'Non-Descript', name: 'Backyard Mixed Poultry', code: 'PLT-ND-01' },

  // Horse / Pony & Other (18)
  { speciesCode: '18', breedType: 'Indigenous / Pure Local', name: 'Manipuri / Bhutia Pony', code: 'OTH-IND-01' },
  { speciesCode: '18', breedType: 'Non-Descript', name: 'Other Domesticated Species', code: 'OTH-ND-01' },
];

export const SEX_OPTIONS = ['Male', 'Female', 'Mixed / Flock (Unsexed)'];

export const AGE_GROUP_OPTIONS = [
  'Young (< 1 Year / Calf / Kid / Piglet / Chick)',
  'Sub-Adult (1 to 2 Years)',
  'Adult — Breeding / Milking',
  'Adult — Draught / Non-Breeding',
  'Aged / Culled',
];

export const PURPOSE_OPTIONS = [
  'Milk Production',
  'Meat / Pork / Chevon',
  'Egg Production',
  'Breeding & Multiplication',
  'Draught / Agricultural Work',
  'Dual Purpose (Milk & Draught)',
  'Wool / Fibre / Other',
];

export const PROTECTION_STATUS_OPTIONS = [
  'Vaccinated & Ear-Tagged',
  'Vaccinated Only (Untagged)',
  'Ear-Tagged Only',
  'Insured & Vaccinated',
  'Not Protected / Pending Vaccination',
];
