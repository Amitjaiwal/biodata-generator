import { FieldDef, SectionKey } from '../models/biodata.model';

/** Built-in sections in their default order. */
export const DEFAULT_SECTIONS: readonly Exclude<SectionKey, 'custom'>[] = [
  'personal',
  'birth',
  'education',
  'family',
  'lifestyle',
  'partner',
  'contact',
];

/** The single source of truth for built-in fields. Templates never reference these directly. */
export const FIELD_DEFS: readonly FieldDef[] = [
  // Personal
  { key: 'fullName', section: 'personal', type: 'text', required: true, wide: true, maxLength: 80 },
  { key: 'gender', section: 'personal', type: 'select', options: 'gender' },
  { key: 'dob', section: 'personal', type: 'date' },
  { key: 'age', section: 'personal', type: 'number' },
  { key: 'height', section: 'personal', type: 'select', options: 'height' },
  { key: 'weight', section: 'personal', type: 'text', maxLength: 20 },
  { key: 'religion', section: 'personal', type: 'text', suggest: 'religion', maxLength: 40 },
  { key: 'caste', section: 'personal', type: 'text', maxLength: 60 },
  { key: 'subCaste', section: 'personal', type: 'text', maxLength: 60 },
  { key: 'motherTongue', section: 'personal', type: 'text', suggest: 'motherTongue', maxLength: 40 },
  { key: 'maritalStatus', section: 'personal', type: 'select', options: 'marital' },
  { key: 'bloodGroup', section: 'personal', type: 'select', options: 'blood' },
  // Birth details
  { key: 'birthTime', section: 'birth', type: 'time' },
  { key: 'birthPlace', section: 'birth', type: 'text', maxLength: 80 },
  { key: 'rashi', section: 'birth', type: 'select', options: 'rashi' },
  { key: 'nakshatra', section: 'birth', type: 'select', options: 'nakshatra' },
  { key: 'gotra', section: 'birth', type: 'text', maxLength: 60 },
  { key: 'manglik', section: 'birth', type: 'select', options: 'manglik' },
  // Education and career
  { key: 'education', section: 'education', type: 'text', maxLength: 120 },
  { key: 'college', section: 'education', type: 'text', maxLength: 120 },
  { key: 'occupation', section: 'education', type: 'text', maxLength: 100 },
  { key: 'company', section: 'education', type: 'text', maxLength: 100 },
  { key: 'income', section: 'education', type: 'text', maxLength: 60 },
  { key: 'workLocation', section: 'education', type: 'text', maxLength: 80 },
  // Family
  { key: 'fatherName', section: 'family', type: 'text', maxLength: 80 },
  { key: 'fatherOccupation', section: 'family', type: 'text', maxLength: 100 },
  { key: 'motherName', section: 'family', type: 'text', maxLength: 80 },
  { key: 'motherOccupation', section: 'family', type: 'text', maxLength: 100 },
  { key: 'brothers', section: 'family', type: 'text', maxLength: 60 },
  { key: 'sisters', section: 'family', type: 'text', maxLength: 60 },
  { key: 'familyType', section: 'family', type: 'select', options: 'familyType' },
  { key: 'familyValues', section: 'family', type: 'select', options: 'familyValues' },
  { key: 'nativePlace', section: 'family', type: 'text', maxLength: 80 },
  { key: 'relativesSurnames', section: 'family', type: 'textarea', wide: true, maxLength: 300, placeholder: true, hint: true },
  { key: 'familyAddress', section: 'family', type: 'textarea', wide: true, maxLength: 200 },
  // Lifestyle
  { key: 'diet', section: 'lifestyle', type: 'select', options: 'diet' },
  { key: 'smoking', section: 'lifestyle', type: 'select', options: 'habit' },
  { key: 'drinking', section: 'lifestyle', type: 'select', options: 'habit' },
  { key: 'hobbies', section: 'lifestyle', type: 'text', wide: true, maxLength: 160 },
  { key: 'interests', section: 'lifestyle', type: 'text', wide: true, maxLength: 160 },
  // Partner expectations
  { key: 'prefAge', section: 'partner', type: 'text', maxLength: 60 },
  { key: 'prefHeight', section: 'partner', type: 'text', maxLength: 60 },
  { key: 'prefEducation', section: 'partner', type: 'text', maxLength: 120 },
  { key: 'prefOccupation', section: 'partner', type: 'text', maxLength: 120 },
  { key: 'prefLocation', section: 'partner', type: 'text', maxLength: 120 },
  { key: 'prefOther', section: 'partner', type: 'textarea', wide: true, maxLength: 300 },
  // Contact
  { key: 'mobile', section: 'contact', type: 'tel', maxLength: 30 },
  { key: 'email', section: 'contact', type: 'email', maxLength: 100 },
  { key: 'address', section: 'contact', type: 'textarea', wide: true, maxLength: 200 },
];

export const FIELD_DEF_BY_KEY: ReadonlyMap<string, FieldDef> = new Map(FIELD_DEFS.map((d) => [d.key, d]));

const heights: string[] = [];
for (let ft = 4; ft <= 6; ft++) {
  for (let inch = 0; inch < 12; inch++) {
    if (ft === 4 && inch < 5) continue;
    if (ft === 6 && inch > 8) continue;
    heights.push(`${ft}-${inch}`);
  }
}

/** Option codes for select fields. Labels live in the i18n dictionaries under `o.<group>.<code>`. */
export const OPTION_GROUPS: Readonly<Record<string, readonly string[]>> = {
  gender: ['male', 'female'],
  marital: ['never', 'divorced', 'widowed', 'awaiting'],
  blood: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
  manglik: ['no', 'yes', 'anshik', 'unknown'],
  familyType: ['joint', 'nuclear'],
  familyValues: ['traditional', 'moderate', 'liberal'],
  diet: ['veg', 'nonveg', 'egg', 'jain', 'vegan'],
  habit: ['no', 'occasionally', 'yes'],
  rashi: [
    'mesh', 'vrishabh', 'mithun', 'kark', 'simha', 'kanya',
    'tula', 'vrishchik', 'dhanu', 'makar', 'kumbh', 'meen',
  ],
  nakshatra: [
    'ashwini', 'bharani', 'krittika', 'rohini', 'mrigashira', 'ardra', 'punarvasu', 'pushya', 'ashlesha',
    'magha', 'purvaphalguni', 'uttaraphalguni', 'hasta', 'chitra', 'swati', 'vishakha', 'anuradha', 'jyeshtha',
    'mula', 'purvashadha', 'uttarashadha', 'shravana', 'dhanishta', 'shatabhisha', 'purvabhadrapada',
    'uttarabhadrapada', 'revati',
  ],
  height: heights,
};

/** Free-text suggestion lists, per language. Picking one just fills the text box. */
export const SUGGESTIONS: Readonly<Record<string, Readonly<Record<'en' | 'hi' | 'mr', readonly string[]>>>> = {
  religion: {
    en: ['Hindu', 'Muslim', 'Jain', 'Sikh', 'Christian', 'Buddhist', 'Parsi'],
    hi: ['हिंदू', 'मुस्लिम', 'जैन', 'सिख', 'ईसाई', 'बौद्ध', 'पारसी'],
    mr: ['हिंदू', 'मुस्लिम', 'जैन', 'शीख', 'ख्रिश्चन', 'बौद्ध', 'पारशी'],
  },
  motherTongue: {
    en: ['Hindi', 'Marathi', 'Gujarati', 'Punjabi', 'Bengali', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Urdu', 'Konkani', 'Marwari', 'English'],
    hi: ['हिंदी', 'मराठी', 'गुजराती', 'पंजाबी', 'बंगाली', 'तमिल', 'तेलुगु', 'कन्नड़', 'मलयालम', 'उर्दू', 'कोंकणी', 'मारवाड़ी', 'अंग्रेज़ी'],
    mr: ['मराठी', 'हिंदी', 'गुजराती', 'पंजाबी', 'बंगाली', 'तमिळ', 'तेलुगू', 'कन्नड', 'मल्याळम', 'उर्दू', 'कोकणी', 'मारवाडी', 'इंग्रजी'],
  },
};

/** Ready-made blessing lines. The user can also type their own. */
export const BLESSING_PRESETS: readonly string[] = [
  '॥ श्री गणेशाय नमः ॥',
  '|| Shree Ganeshaya Namah ||',
  '॥ ॐ नमः शिवाय ॥',
  '॥ जय श्री कृष्ण ॥',
  '॥ श्री स्वामी समर्थ ॥',
  '॥ कुलदेवता प्रसन्न ॥',
  '॥ जय जिनेन्द्र ॥',
  'Bismillah-ir-Rahman-ir-Rahim',
  'बिस्मिल्लाह-इर-रहमान-इर-रहीम',
  'ੴ ਸਤਿ ਨਾਮੁ',
  'Ik Onkar Satnam',
  'With the blessings of God',
];
