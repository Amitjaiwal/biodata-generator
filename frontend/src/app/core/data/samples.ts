import { createEmptyBiodata } from '../../biodata/store/biodata.factory';
import { Biodata, FamilyMember, Lang, SymbolKey } from '../models/biodata.model';
import { SamplePersona } from '../models/template.model';

interface SampleSpec {
  lang: Lang;
  blessing: string;
  symbol: SymbolKey;
  avatar: 'female' | 'male';
  values: Record<string, string>;
  members: Omit<FamilyMember, 'id'>[];
  custom?: { section: string; label: string; value: string }[];
}

const svgUri = (svg: string): string => `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

/** Flat illustrated portraits so sample biodatas never use a real person's photo. */
const AVATARS: Record<'female' | 'male', string> = {
  female: svgUri(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500">` +
      `<rect width="400" height="500" fill="#F1DFCB"/>` +
      `<circle cx="200" cy="205" r="150" fill="#E9CFB4"/>` +
      `<path d="M92 250c-8-120 52-178 108-178s116 58 108 178c-4 60-20 110-40 150H132c-20-40-36-90-40-150z" fill="#2A1A16"/>` +
      `<path d="M40 500c6-96 62-140 160-140s154 44 160 140z" fill="#B3261E"/>` +
      `<path d="M150 372c14 26 86 26 100 0l34 128H116z" fill="#C9A227" opacity=".9"/>` +
      `<rect x="172" y="300" width="56" height="80" rx="24" fill="#DDA57E"/>` +
      `<ellipse cx="200" cy="232" rx="74" ry="90" fill="#E8B48E"/>` +
      `<path d="M126 222c0-74 34-108 74-108s74 34 74 108c-18-34-40-58-74-66-34 8-56 32-74 66z" fill="#2A1A16"/>` +
      `<circle cx="200" cy="196" r="5" fill="#B3261E"/>` +
      `<path d="M176 268q24 18 48 0" stroke="#A8553F" stroke-width="5" fill="none" stroke-linecap="round"/>` +
      `<circle cx="124" cy="258" r="7" fill="#C9A227"/><circle cx="276" cy="258" r="7" fill="#C9A227"/>` +
      `</svg>`,
  ),
  male: svgUri(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500">` +
      `<rect width="400" height="500" fill="#DCE5EC"/>` +
      `<circle cx="200" cy="205" r="150" fill="#C9D6E0"/>` +
      `<path d="M36 500c6-100 62-146 164-146s158 46 164 146z" fill="#F4EBDD"/>` +
      `<path d="M168 356l32 60 32-60 22 10-54 134-54-134z" fill="#C9A227"/>` +
      `<rect x="170" y="296" width="60" height="84" rx="26" fill="#C88F68"/>` +
      `<ellipse cx="200" cy="226" rx="76" ry="92" fill="#D9A17A"/>` +
      `<path d="M122 214c-6-70 30-110 78-110s86 36 78 110c-10-30-22-46-36-52-28 10-70 10-92-2-12 10-22 28-28 54z" fill="#1E1512"/>` +
      `<path d="M176 268q24 16 48 0" stroke="#8C4A36" stroke-width="5" fill="none" stroke-linecap="round"/>` +
      `</svg>`,
  ),
};

const SAMPLES: Record<SamplePersona, SampleSpec> = {
  hindu: {
    lang: 'en',
    blessing: '॥ श्री गणेशाय नमः ॥',
    symbol: 'om',
    avatar: 'female',
    values: {
      fullName: 'Ananya Sharma',
      gender: 'female',
      dob: '1998-03-14',
      age: '27',
      height: '5-4',
      weight: '54 kg',
      religion: 'Hindu',
      caste: 'Brahmin',
      subCaste: 'Gaur',
      motherTongue: 'Hindi',
      maritalStatus: 'never',
      bloodGroup: 'B+',
      birthTime: '06:45',
      birthPlace: 'Jaipur, Rajasthan',
      rashi: 'kanya',
      nakshatra: 'hasta',
      gotra: 'Bharadwaj',
      manglik: 'no',
      education: 'MBA (Finance)',
      college: 'Symbiosis International University, Pune',
      occupation: 'Senior Financial Analyst',
      company: 'Deloitte India',
      income: '₹ 14 LPA',
      workLocation: 'Pune',
      fatherName: 'Shri Rajesh Sharma',
      fatherOccupation: 'Retired Bank Manager (SBI)',
      motherName: 'Smt. Sunita Sharma',
      motherOccupation: 'Homemaker',
      brothers: '1 (Younger)',
      sisters: 'None',
      familyType: 'nuclear',
      familyValues: 'moderate',
      nativePlace: 'Jaipur, Rajasthan',
      diet: 'veg',
      smoking: 'no',
      drinking: 'no',
      hobbies: 'Kathak, reading, travel photography',
      prefAge: '27 to 31 years',
      prefEducation: 'Graduate or above',
      prefOccupation: 'Well settled professional',
      prefLocation: 'Pune, Mumbai or Bengaluru',
      mobile: '+91 98765 43210',
      email: 'sharma.family@example.com',
      address: 'B-204, Sunrise Residency, Baner, Pune 411045',
    },
    members: [{ relation: 'brother', relationLabel: '', name: 'Aarav Sharma', details: 'B.Tech student' }],
  },
  marathi: {
    lang: 'mr',
    blessing: '॥ श्री गणेशाय नमः ॥',
    symbol: 'shree',
    avatar: 'male',
    values: {
      fullName: 'ओंकार विजय देशमुख',
      gender: 'male',
      dob: '1996-08-21',
      age: '29',
      height: '5-10',
      weight: '72 किलो',
      religion: 'हिंदू',
      caste: 'मराठा',
      subCaste: '९६ कुळी',
      motherTongue: 'मराठी',
      maritalStatus: 'never',
      bloodGroup: 'O+',
      birthTime: '10:20',
      birthPlace: 'पुणे, महाराष्ट्र',
      rashi: 'simha',
      nakshatra: 'magha',
      gotra: 'कश्यप',
      manglik: 'no',
      education: 'बी.ई. (कॉम्प्युटर)',
      college: 'सावित्रीबाई फुले पुणे विद्यापीठ',
      occupation: 'सॉफ्टवेअर इंजिनिअर',
      company: 'इन्फोसिस लिमिटेड',
      income: '₹ १२ लाख',
      workLocation: 'हिंजवडी, पुणे',
      fatherName: 'श्री. विजय रामचंद्र देशमुख',
      fatherOccupation: 'शेती व व्यवसाय',
      motherName: 'सौ. सुनीता विजय देशमुख',
      motherOccupation: 'गृहिणी',
      brothers: '१ (विवाहित)',
      sisters: '१ (विवाहित)',
      familyType: 'joint',
      familyValues: 'traditional',
      nativePlace: 'वाई, जि. सातारा',
      diet: 'veg',
      smoking: 'no',
      drinking: 'no',
      hobbies: 'ट्रेकिंग, क्रिकेट, वाचन',
      prefAge: '२४ ते २८ वर्षे',
      prefEducation: 'पदवीधर',
      prefOccupation: 'नोकरी / गृहिणी',
      prefLocation: 'पुणे किंवा पश्चिम महाराष्ट्र',
      mobile: '+91 98765 43210',
      email: 'deshmukh.family@example.com',
      address: 'श्रीराम निवास, शिवाजीनगर, पुणे ४११००५',
    },
    members: [{ relation: 'sister', relationLabel: '', name: 'सौ. प्रिया अमोल जाधव', details: 'सातारा' }],
    custom: [{ section: 'family', label: 'मामा', value: 'श्री. अनिल पाटील (कोल्हापूर)' }],
  },
  hindi: {
    lang: 'hi',
    blessing: '॥ श्री गणेशाय नमः ॥',
    symbol: 'kalash',
    avatar: 'female',
    values: {
      fullName: 'प्रिया अग्रवाल',
      gender: 'female',
      dob: '1999-11-05',
      age: '26',
      height: '5-3',
      weight: '52 किलो',
      religion: 'हिंदू',
      caste: 'अग्रवाल',
      subCaste: 'गर्ग',
      motherTongue: 'हिंदी',
      maritalStatus: 'never',
      bloodGroup: 'A+',
      birthTime: '14:30',
      birthPlace: 'इंदौर, मध्य प्रदेश',
      rashi: 'tula',
      nakshatra: 'swati',
      gotra: 'गर्ग',
      manglik: 'no',
      education: 'एम.कॉम., सी.ए.',
      college: 'देवी अहिल्या विश्वविद्यालय, इंदौर',
      occupation: 'चार्टर्ड अकाउंटेंट',
      company: 'निजी फर्म',
      income: '₹ 10 लाख',
      workLocation: 'इंदौर',
      fatherName: 'श्री महेश अग्रवाल',
      fatherOccupation: 'कपड़ा व्यवसायी',
      motherName: 'श्रीमती रेखा अग्रवाल',
      motherOccupation: 'गृहिणी',
      brothers: '1 (बड़े, विवाहित)',
      sisters: 'नहीं',
      familyType: 'joint',
      familyValues: 'traditional',
      nativePlace: 'उज्जैन, मध्य प्रदेश',
      diet: 'veg',
      smoking: 'no',
      drinking: 'no',
      hobbies: 'संगीत, चित्रकला, खाना बनाना',
      prefAge: '26 से 30 वर्ष',
      prefEducation: 'स्नातक या उससे अधिक',
      prefOccupation: 'व्यवसाय या नौकरी',
      prefLocation: 'मध्य प्रदेश या महाराष्ट्र',
      mobile: '+91 98765 43210',
      email: 'agrawal.parivar@example.com',
      address: '12, विजय नगर, इंदौर 452010',
    },
    members: [{ relation: 'brother', relationLabel: '', name: 'रोहित अग्रवाल', details: 'पारिवारिक व्यवसाय' }],
  },
  muslim: {
    lang: 'en',
    blessing: 'Bismillah-ir-Rahman-ir-Rahim',
    symbol: 'crescent',
    avatar: 'male',
    values: {
      fullName: 'Arshad Ali Khan',
      gender: 'male',
      dob: '1995-06-18',
      age: '30',
      height: '5-11',
      weight: '74 kg',
      religion: 'Muslim',
      caste: 'Sunni',
      subCaste: 'Pathan',
      motherTongue: 'Urdu',
      maritalStatus: 'never',
      bloodGroup: 'O+',
      birthPlace: 'Lucknow, Uttar Pradesh',
      education: 'B.Tech, MBA',
      college: 'Aligarh Muslim University',
      occupation: 'Product Manager',
      company: 'Tata Consultancy Services',
      income: '₹ 22 LPA',
      workLocation: 'Hyderabad',
      fatherName: 'Janab Imran Ali Khan',
      fatherOccupation: 'Retired Government Officer',
      motherName: 'Mohtarma Shabana Khan',
      motherOccupation: 'Homemaker',
      brothers: '1 (Elder, Married)',
      sisters: '1 (Younger)',
      familyType: 'joint',
      familyValues: 'moderate',
      nativePlace: 'Lucknow, Uttar Pradesh',
      diet: 'nonveg',
      smoking: 'no',
      drinking: 'no',
      hobbies: 'Urdu poetry, cricket, travelling',
      prefAge: '24 to 28 years',
      prefEducation: 'Graduate or above',
      prefOccupation: 'Any',
      prefLocation: 'Hyderabad or Lucknow',
      prefOther: 'Deendar, family oriented and well educated.',
      mobile: '+91 98765 43210',
      email: 'khan.family@example.com',
      address: '27, Hazratganj, Lucknow 226001',
    },
    members: [{ relation: 'sister', relationLabel: '', name: 'Sana Khan', details: 'M.Sc. student' }],
  },
  jain: {
    lang: 'en',
    blessing: '॥ जय जिनेन्द्र ॥',
    symbol: 'jain',
    avatar: 'female',
    values: {
      fullName: 'Riddhi Jain',
      gender: 'female',
      dob: '1997-09-02',
      age: '28',
      height: '5-5',
      weight: '56 kg',
      religion: 'Jain',
      caste: 'Shwetambar',
      subCaste: 'Oswal',
      motherTongue: 'Gujarati',
      maritalStatus: 'never',
      bloodGroup: 'AB+',
      birthTime: '09:15',
      birthPlace: 'Ahmedabad, Gujarat',
      gotra: 'Kothari',
      manglik: 'no',
      education: 'B.Arch',
      college: 'CEPT University, Ahmedabad',
      occupation: 'Architect',
      company: 'Studio Aangan (own practice)',
      income: '₹ 16 LPA',
      workLocation: 'Ahmedabad',
      fatherName: 'Shri Mahendra Jain',
      fatherOccupation: 'Diamond Merchant',
      motherName: 'Smt. Kalpana Jain',
      motherOccupation: 'Homemaker',
      brothers: '1 (Elder, Married)',
      sisters: 'None',
      familyType: 'joint',
      familyValues: 'traditional',
      nativePlace: 'Palitana, Gujarat',
      diet: 'jain',
      smoking: 'no',
      drinking: 'no',
      hobbies: 'Sketching, classical music, volunteering',
      prefAge: '28 to 32 years',
      prefEducation: 'Professional degree',
      prefOccupation: 'Business or profession',
      prefLocation: 'Ahmedabad, Mumbai or Surat',
      mobile: '+91 98765 43210',
      email: 'jain.parivar@example.com',
      address: '14, Paldi Society, Ahmedabad 380007',
    },
    members: [{ relation: 'brother', relationLabel: '', name: 'Darshan Jain', details: 'Family business' }],
  },
};

/** Fields kept in compact samples so a thumbnail fits on a single A4 page in every design. */
const COMPACT_KEEP = new Set([
  "fullName", "dob", "height", "religion", "caste", "motherTongue", "maritalStatus",
  "birthTime", "birthPlace", "rashi", "gotra",
  "education", "occupation", "company", "income", "workLocation",
  "fatherName", "fatherOccupation", "motherName", "brothers", "nativePlace",
  "mobile", "address",
]);

export const PERSONA_FOR_LANG: Record<Lang, SamplePersona> = { en: 'hindu', hi: 'hindi', mr: 'marathi' };

/** Builds a complete sample biodata. `compact` trims it so it fits a single A4 thumbnail. */
export function sampleBiodata(persona: SamplePersona, compact = false): Biodata {
  const spec = SAMPLES[persona];
  const b = createEmptyBiodata(spec.lang);
  b.blessing = spec.blessing;
  b.symbol = spec.symbol;
  b.photo = AVATARS[spec.avatar];
  for (const section of b.sections) {
    for (const f of section.fields) {
      if (!f.key || (compact && !COMPACT_KEEP.has(f.key))) continue;
      f.value = spec.values[f.key] ?? '';
    }
    for (const c of compact ? [] : (spec.custom ?? [])) {
      if (c.section === section.key) {
        section.fields.push({ id: `sample-${section.key}-${section.fields.length}`, key: null, label: c.label, value: c.value });
      }
    }
  }
  b.members = compact ? [] : spec.members.map((m, i) => ({ ...m, id: `sample-m${i}` }));
  return b;
}
