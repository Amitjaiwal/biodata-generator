import { Lang } from '../models/biodata.model';
import { TemplateCategory } from '../models/template.model';

export interface LandingSection {
  heading: string;
  body: string[];
}

export interface Landing {
  slug: string;
  /** Language the page is written in. */
  lang: Lang;
  /** Short label for footer links. */
  navLabel: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  cta: string;
  /** Templates shown on the page. */
  category: TemplateCategory | null;
  gridHeading: string;
  sections: LandingSection[];
}

/** Search landing pages for communities, languages and the general format guide. */
export const LANDINGS: readonly Landing[] = [
  {
    slug: 'marriage-biodata-format',
    lang: 'en',
    navLabel: 'Marriage biodata format',
    title: 'Marriage Biodata Format: What to Include (with Free Maker) | ShubhPatra',
    description:
      'A clear marriage biodata format for boys and girls: personal, family, education, horoscope and contact details. Create yours online and download a PDF.',
    h1: 'Marriage Biodata Format',
    intro:
      'A marriage biodata is a one or two page introduction that families exchange before the first meeting. Here is the format most Indian families follow, and a free online marriage biodata maker to create yours.',
    cta: 'Create your biodata',
    category: null,
    gridHeading: 'Popular marriage biodata formats',
    sections: [
      {
        heading: 'What a marriage biodata should include',
        body: [
          'Start with a blessing line and your full name, followed by personal details: date of birth, height, religion, caste or community, mother tongue and marital status.',
          'Add education and career next: your highest qualification, college, occupation, employer, work location and, if you wish, annual income.',
          'Family details matter a great deal to most families. Mention your parents, their occupations, brothers and sisters, family type and native place.',
          'Many Hindu families also add birth time, birth place, rashi, nakshatra, gotra and manglik status. Finish with partner expectations and contact details.',
        ],
      },
      {
        heading: 'Tips for a biodata that reads well',
        body: [
          'Keep it to one page where you can, and two at most. Leave out anything you are not comfortable sharing; every field in ShubhPatra is optional except the name.',
          'Use a recent, clear photograph with a plain background. Check spellings of names and places, and ask a family member to read it once before you share it.',
        ],
      },
    ],
  },
  {
    slug: 'hindu-marriage-biodata',
    lang: 'en',
    navLabel: 'Hindu marriage biodata',
    title: 'Hindu Marriage Biodata Maker Online with PDF Download | ShubhPatra',
    description:
      'Create a Hindu marriage biodata online with Shree Ganeshaya Namah heading, rashi, nakshatra, gotra and manglik fields. Free templates and PDF download.',
    h1: 'Hindu Marriage Biodata Maker',
    intro:
      'Make a Hindu marriage biodata with the traditional blessing, Om or kalash symbol and full horoscope details. Choose a design, fill in your details and download a print-ready PDF.',
    cta: 'Create Hindu biodata',
    category: 'hindu',
    gridHeading: 'Hindu marriage biodata templates',
    sections: [
      {
        heading: 'Hindu marriage biodata format',
        body: [
          'A Hindu biodata usually opens with "Shree Ganeshaya Namah" or the name of the family deity. ShubhPatra offers ready blessing lines and symbols such as Om, Shree, kalash, lotus and diya, or you can write your own.',
          'The horoscope section covers birth time, birth place, rashi, nakshatra, gotra and manglik status. If your family does not follow horoscope matching, hide the section with one tap.',
        ],
      },
      {
        heading: 'In Hindi, Marathi or English',
        body: [
          'Switch the biodata language and all headings and labels change to Hindi or Marathi, with proper Devanagari fonts in the PDF. Your own details stay exactly as you typed them.',
        ],
      },
    ],
  },
  {
    slug: 'muslim-marriage-biodata',
    lang: 'en',
    navLabel: 'Muslim marriage biodata',
    title: 'Muslim Marriage Biodata Maker Online (Nikah Biodata) | ShubhPatra',
    description:
      'Create a Muslim marriage biodata for nikah with Bismillah heading and crescent symbol. Elegant templates, live preview and PDF download.',
    h1: 'Muslim Marriage Biodata Maker',
    intro:
      'Create a graceful nikah biodata with a Bismillah heading, crescent symbol and geometric patterns. Add sect, family and education details, then download a PDF.',
    cta: 'Create Muslim biodata',
    category: 'muslim',
    gridHeading: 'Muslim marriage biodata templates',
    sections: [
      {
        heading: 'Muslim marriage biodata format',
        body: [
          'A Muslim biodata usually begins with Bismillah, followed by personal details such as date of birth, height, sect or maslak, mother tongue and education.',
          'Horoscope fields are not needed, so simply hide the birth and horoscope section. You can add your own fields, for example namaz, or details about your family background.',
        ],
      },
    ],
  },
  {
    slug: 'jain-marriage-biodata',
    lang: 'en',
    navLabel: 'Jain marriage biodata',
    title: 'Jain Marriage Biodata Maker Online with PDF Download | ShubhPatra',
    description:
      'Create a Jain marriage biodata with Jai Jinendra heading and the Jain emblem. Add sect, gotra and family details and download a PDF.',
    h1: 'Jain Marriage Biodata Maker',
    intro:
      'Create a Jain marriage biodata that opens with Jai Jinendra and the Jain emblem. Add your sect, gotra, family and career details and download a print-ready PDF.',
    cta: 'Create Jain biodata',
    category: 'jain',
    gridHeading: 'Jain marriage biodata templates',
    sections: [
      {
        heading: 'Jain marriage biodata format',
        body: [
          'Jain biodatas commonly mention the sect (Digambar or Shwetambar), sub-sect, gotra and native place, along with the family business or profession.',
          'Diet is often important to Jain families. The lifestyle section includes a Jain diet option, and you can add custom fields for anything specific to your family.',
        ],
      },
    ],
  },
  {
    slug: 'marathi-biodata-maker',
    lang: 'mr',
    navLabel: 'मराठी बायोडाटा',
    title: 'मराठी लग्न बायोडाटा मेकर | Marathi Marriage Biodata Format | ShubhPatra',
    description:
      'मराठीत लग्नाचा बायोडाटा ऑनलाइन बनवा. तोरण, पैठणी डिझाइन, रास, नक्षत्र, गोत्र आणि मामा यांसारखी माहिती भरा आणि PDF डाउनलोड करा.',
    h1: 'मराठी लग्न बायोडाटा मेकर',
    intro:
      'मराठीत सुंदर लग्नाचा बायोडाटा काही मिनिटांत बनवा. डिझाइन निवडा, तुमची माहिती भरा आणि प्रिंटसाठी तयार A4 PDF डाउनलोड करा. लॉगिनची गरज नाही.',
    cta: 'मराठी बायोडाटा बनवा',
    category: 'marathi',
    gridHeading: 'मराठी बायोडाटा टेम्पलेट',
    sections: [
      {
        heading: 'मराठी बायोडाटा फॉरमॅट',
        body: [
          'मराठी बायोडाटाची सुरुवात साधारणपणे "॥ श्री गणेशाय नमः ॥" किंवा कुलदैवताच्या नावाने होते. त्यानंतर संपूर्ण नाव, जन्म तारीख, जन्म वेळ, जन्म ठिकाण, उंची, शिक्षण आणि नोकरीची माहिती येते.',
          'पत्रिकेच्या माहितीत रास, नक्षत्र, गोत्र आणि मंगळ यांचा समावेश होतो. कौटुंबिक माहितीत आई-वडील, भाऊ, बहीण, मूळ गाव तसेच मामा किंवा आजोळ यांचा उल्लेख करता येतो. त्यासाठी स्वतःचे फील्ड जोडा.',
        ],
      },
      {
        heading: 'मराठी, हिंदी किंवा इंग्रजीत',
        body: [
          'बायोडाटाची भाषा मराठी निवडल्यावर सर्व शीर्षके आणि लेबल मराठीत दिसतात. PDF मध्ये देवनागरी अक्षरे अगदी व्यवस्थित येतात. तुम्ही लिहिलेली माहिती जशीच्या तशी राहते.',
        ],
      },
    ],
  },
  {
    slug: 'hindi-biodata-maker',
    lang: 'hi',
    navLabel: 'हिंदी बायोडाटा',
    title: 'हिंदी में विवाह बायोडाटा बनाएँ | Marriage Biodata in Hindi | ShubhPatra',
    description:
      'हिंदी में शादी का बायोडाटा ऑनलाइन बनाएँ। राशि, नक्षत्र, गोत्र और पारिवारिक जानकारी भरें और प्रिंट के लिए तैयार PDF डाउनलोड करें।',
    h1: 'हिंदी विवाह बायोडाटा मेकर',
    intro:
      'हिंदी में सुंदर विवाह बायोडाटा कुछ ही मिनटों में बनाएँ। डिज़ाइन चुनें, अपनी जानकारी भरें और प्रिंट के लिए तैयार A4 PDF डाउनलोड करें। लॉगिन की ज़रूरत नहीं।',
    cta: 'हिंदी बायोडाटा बनाएँ',
    category: 'hindu',
    gridHeading: 'हिंदी बायोडाटा टेम्पलेट',
    sections: [
      {
        heading: 'हिंदी बायोडाटा का प्रारूप',
        body: [
          'हिंदी बायोडाटा की शुरुआत आम तौर पर "॥ श्री गणेशाय नमः ॥" से होती है। इसके बाद पूरा नाम, जन्म तिथि, जन्म समय, जन्म स्थान, कद, शिक्षा और व्यवसाय की जानकारी आती है।',
          'कुंडली विवरण में राशि, नक्षत्र, गोत्र और मांगलिक की जानकारी होती है। पारिवारिक जानकारी में माता-पिता, भाई-बहन, परिवार का प्रकार और मूल निवास लिखें।',
        ],
      },
      {
        heading: 'हिंदी, मराठी या अंग्रेज़ी में',
        body: [
          'बायोडाटा की भाषा हिंदी चुनते ही सभी शीर्षक और लेबल हिंदी में दिखते हैं। PDF में देवनागरी अक्षर बिल्कुल सही आते हैं। आपकी लिखी जानकारी जैसी की तैसी रहती है।',
        ],
      },
    ],
  },
];

export function findLanding(slug: string): Landing | undefined {
  return LANDINGS.find((l) => l.slug === slug);
}
