import { Lang } from '../models/biodata.model';
import { TemplateCategory, TemplateTier } from '../models/template.model';

/** A titled point inside a section, rendered as an H3 with a paragraph. */
export interface LandingItem {
  title: string;
  text: string;
}

export interface LandingSection {
  heading: string;
  /** Paragraphs. Internal links are written as [anchor text](/path). */
  body?: string[];
  /** Sub-headings (H3) with a short paragraph each. */
  items?: LandingItem[];
  /** A bulleted list. */
  list?: string[];
}

export interface Landing {
  slug: string;
  /** Language the page is written in. */
  lang: Lang;
  /** Short label for footer links and "related guides". */
  navLabel: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  cta: string;
  /** Templates shown on the page. */
  category: TemplateCategory | null;
  /** Show only free or only premium designs on the page. */
  tier?: TemplateTier;
  gridHeading: string;
  sections: LandingSection[];
  /** Slugs of other landing pages to link to at the bottom. */
  related?: string[];
}

/**
 * Search landing pages. Each one answers a different question, so none repeats another:
 * the general format guide, the free maker, the online step-by-step guide, bride and groom guides,
 * and one page per community or language.
 */
export const LANDINGS: readonly Landing[] = [
  {
    slug: 'marriage-biodata-format',
    lang: 'en',
    navLabel: 'Marriage biodata format',
    title: 'Marriage Biodata Format: What to Include | ShubhPatra',
    description:
      'A simple marriage biodata format for Indian families: personal, family, education, horoscope and contact details, with tips and a free maker to create yours.',
    h1: 'Marriage Biodata Format',
    intro:
      'A marriage biodata is a one or two page introduction that families exchange before a first meeting. This guide explains the format most Indian families follow, section by section, so you can include the right details in the right order. When you are ready, [create your biodata online for free](/free-marriage-biodata-maker) and download it as a PDF.',
    cta: 'Create your biodata',
    category: null,
    gridHeading: 'Popular marriage biodata formats',
    sections: [
      {
        heading: 'What is a marriage biodata?',
        body: [
          'A marriage biodata, also called a matrimonial biodata or marriage profile, is a short document that introduces a prospective bride or groom and their family. Relatives, matchmakers and families usually share it, often on WhatsApp, before the two families meet.',
          'A good biodata is clear, accurate and easy to read in a minute or two. It gives the other family enough information to decide on the next step without overwhelming them.',
        ],
      },
      {
        heading: 'Marriage biodata format: what to include',
        items: [
          {
            title: 'Heading and blessing',
            text: 'Start with a blessing line such as Shree Ganeshaya Namah, Bismillah, Ik Onkar or a Bible verse, followed by the heading "Biodata". Both are optional and you can choose what suits your family.',
          },
          {
            title: 'Personal details',
            text: 'Full name, date of birth, age, height, weight, religion, caste or community, sub-caste, mother tongue, marital status and blood group. A recent, clear photograph goes at the top.',
          },
          {
            title: 'Birth and horoscope details',
            text: 'Many Hindu families add birth time, birth place, rashi, nakshatra, gotra and manglik status. Skip this section if your family does not use horoscopes.',
          },
          {
            title: 'Education and career',
            text: 'Highest qualification, college or university, occupation, employer, work location and, if you want to share it, annual income.',
          },
          {
            title: 'Family details',
            text: "Father's and mother's names and occupations, brothers and sisters, family type (joint or nuclear), family values, native place and, if you like, relatives' surnames.",
          },
          {
            title: 'Lifestyle and interests',
            text: 'Diet, smoking and drinking habits, hobbies and interests. This helps the other family picture daily life and values.',
          },
          {
            title: 'Partner expectations',
            text: 'A few honest, respectful lines about the age, education, occupation and location you prefer. Realistic expectations are received better.',
          },
          {
            title: 'Contact details',
            text: 'A mobile number, an email address and the family address. Share them only with people you trust.',
          },
        ],
      },
      {
        heading: 'Tips for a biodata that reads well',
        list: [
          'Keep it to one page where possible and two pages at most.',
          'Use a recent, clear photograph with a plain background.',
          'Check the spelling of names and places, and ask a family member to read it once before you share it.',
          'Leave out anything you are not comfortable sharing. In ShubhPatra every field is optional except the name.',
          'Choose a clean design with readable text, because most biodatas are read on a phone.',
        ],
      },
      {
        heading: 'Create your biodata in this format',
        body: [
          'ShubhPatra follows this format by default. Choose from [marriage biodata templates](/templates) in traditional, modern and royal styles, fill in your details once and switch designs without retyping anything.',
          "Looking for something more specific? See the guides for a [bride's biodata](/marriage-biodata-for-bride), a [groom's biodata](/marriage-biodata-for-groom) and the [Hindu marriage biodata format](/hindu-marriage-biodata).",
        ],
      },
    ],
    related: [
      'free-marriage-biodata-maker',
      'online-marriage-biodata-maker',
      'marriage-biodata-for-bride',
      'marriage-biodata-for-groom',
      'hindu-marriage-biodata',
    ],
  },
  {
    slug: 'free-marriage-biodata-maker',
    lang: 'en',
    navLabel: 'Free marriage biodata maker',
    title: 'Free Marriage Biodata Maker Online | ShubhPatra',
    description:
      'Make a marriage biodata for free in minutes. Pick a free design, add your details and photo and download an A4 PDF. No sign-up, and nothing is uploaded.',
    h1: 'Free Marriage Biodata Maker',
    intro:
      'ShubhPatra is a free marriage biodata maker for Indian families. Pick a free design, fill in your details, add a photo and download an A4 PDF in a few minutes. There is no sign-up, and your details never leave your browser.',
    cta: 'Create free biodata',
    category: null,
    tier: 'free',
    gridHeading: 'Free marriage biodata templates',
    sections: [
      {
        heading: 'What you get for free',
        list: [
          'Free marriage biodata templates in traditional, modern, minimal and floral styles',
          'PDF downloads of free designs with no watermark, as many times as you like',
          'A live preview that updates as you type',
          'English, Hindi and Marathi labels in the editor and on the biodata',
          'Photo upload with cropping, custom fields and the freedom to hide any section',
          'No account, email address or phone number needed to start',
        ],
      },
      {
        heading: 'What is free and what is paid',
        body: [
          'Free designs are free from start to finish. Premium designs are optional extras: you can preview them with your own details, and you pay once through Razorpay only if you want the watermark-free download. There is no subscription and no auto-renewal.',
          'If a free design already looks right for your family, there is nothing more to buy. The [pricing page](/pricing) shows the current prices.',
        ],
      },
      {
        heading: 'How to make a free marriage biodata',
        items: [
          {
            title: 'Choose a free template',
            text: 'Browse the [marriage biodata templates](/templates), filter by Free and preview a design with sample details.',
          },
          {
            title: 'Enter your details',
            text: 'Fill in personal, education, family and contact details. Only the name is required, and empty fields are left out automatically.',
          },
          {
            title: 'Download the PDF',
            text: 'Check the live preview and download your A4 PDF. Print it, or share it on WhatsApp or email.',
          },
        ],
      },
      {
        heading: 'Your details stay private',
        body: [
          'Your biodata and photo are stored only in your browser and are not uploaded to our servers. The PDF is created on your own device. If you clear your browser data your biodata is removed, so keep a copy of the PDF.',
        ],
      },
      {
        heading: 'Questions people ask',
        items: [
          {
            title: 'Is it really free?',
            text: 'Yes, for the free designs. Premium designs are optional and paid once.',
          },
          {
            title: 'Do I need an account?',
            text: 'No. You can start without signing up, and nothing has to be created or verified.',
          },
          {
            title: 'Can I edit my biodata later?',
            text: 'Yes. It is saved in your browser, so you can return on the same device, change any field and download it again.',
          },
        ],
      },
    ],
    related: ['online-marriage-biodata-maker', 'marriage-biodata-format', 'marriage-biodata-for-bride', 'marriage-biodata-for-groom'],
  },
  {
    slug: 'online-marriage-biodata-maker',
    lang: 'en',
    navLabel: 'Online marriage biodata maker',
    title: 'Online Marriage Biodata Maker, Step by Step | ShubhPatra',
    description:
      'Create a marriage biodata online without Word or Photoshop. Follow six simple steps in your browser, on a phone or computer, and download a print-ready PDF.',
    h1: 'Online Marriage Biodata Maker',
    intro:
      'Make your marriage biodata online, without Word, Photoshop or any design skills. ShubhPatra runs in your browser on a phone or a computer: choose a design, type your details, watch the live preview and download a PDF.',
    cta: 'Create biodata online',
    category: null,
    gridHeading: 'Marriage biodata templates to start with',
    sections: [
      {
        heading: 'How to create marriage biodata online, step by step',
        items: [
          {
            title: '1. Choose a marriage biodata template',
            text: 'Open the [template gallery](/templates), filter by community or style and preview designs with sample details. You can change your mind later without losing anything you have typed.',
          },
          {
            title: '2. Enter personal information',
            text: 'Add your name, date of birth, height, religion, caste, mother tongue and marital status, plus a photograph if you like. The photo is cropped in your browser to fit the frame.',
          },
          {
            title: '3. Add education and professional details',
            text: 'Fill in your qualification, college, occupation, employer, work location and income. Skip anything you prefer to keep private.',
          },
          {
            title: '4. Add family information',
            text: "Add your parents and their occupations, brothers and sisters, native place and relatives' surnames. Use the family member list for each brother, sister or relative you want to mention.",
          },
          {
            title: '5. Customize your biodata',
            text: 'Change the heading and blessing, hide or reorder sections, add your own fields and pick a larger or smaller text size. Switch between English, Hindi and Marathi at any time.',
          },
          {
            title: '6. Preview and download',
            text: 'Check the live preview, then download a high-resolution A4 PDF to print or share. Free designs download without a watermark.',
          },
        ],
      },
      {
        heading: 'Works on your phone and your computer',
        body: [
          'The builder has a form and a live preview. On a computer they sit side by side. On a phone you switch between editing and previewing with one tap, so you can finish a biodata from the couch or on the way.',
          'The PDF is A4 size, so it prints well and also reads well on a phone screen when you send it on WhatsApp.',
        ],
      },
      {
        heading: 'Made for English, Hindi and Marathi',
        body: [
          'Switch the language and the editor and the biodata change together: headings, labels and dropdown options. The text you type stays exactly as you wrote it, and the PDF uses proper Devanagari fonts.',
          'If you are not sure what to include, read the [marriage biodata format](/marriage-biodata-format) guide first.',
        ],
      },
      {
        heading: 'Online, but private',
        body: [
          'Everything happens in your browser. Your details and photo are not uploaded to our servers, and you do not need an account, so you can fill in personal details without handing them to anyone.',
        ],
      },
      {
        heading: 'Get ready before you start',
        list: [
          'A recent, clear photograph',
          'Date and time of birth, if you want to add horoscope details',
          "Your parents' names and occupations, and details of brothers and sisters",
          'Your qualification, employer and work location',
          'A mobile number and address you are happy to share',
        ],
      },
    ],
    related: ['free-marriage-biodata-maker', 'marriage-biodata-format', 'marriage-biodata-for-bride', 'marriage-biodata-for-groom'],
  },
  {
    slug: 'marriage-biodata-for-bride',
    lang: 'en',
    navLabel: 'Marriage biodata for bride',
    title: 'Marriage Biodata for Bride: Format and Free Maker | ShubhPatra',
    description:
      "What to include in a bride's marriage biodata, with a simple format, design tips and modern bride templates. Fill in your details and download a PDF.",
    h1: 'Marriage Biodata for Bride',
    intro:
      "A bride's biodata should feel warm, clear and easy to read. This guide covers what to include, how to present it and which designs suit a modern bride's biodata. When you are ready, use ShubhPatra's [free marriage biodata maker](/free-marriage-biodata-maker) to fill in your details and download a PDF.",
    cta: 'Create biodata for bride',
    category: 'bride',
    gridHeading: 'Modern bride biodata templates',
    sections: [
      {
        heading: 'What to include in a marriage biodata for a bride',
        items: [
          {
            title: 'Personal details',
            text: 'Full name, date of birth, height, religion, community, mother tongue and marital status, with a recent, clear photograph.',
          },
          {
            title: 'Education and profession',
            text: 'Highest qualification and college or university and, if she works, her occupation, employer and city.',
          },
          {
            title: 'Family details',
            text: 'Parents and their occupations, brothers and sisters, family type and native place.',
          },
          {
            title: 'Interests and lifestyle',
            text: 'Hobbies such as music, dance, cooking, reading or travel, and diet. A few lines give a real sense of the person.',
          },
          {
            title: 'Horoscope details (optional)',
            text: 'Birth time, birth place, rashi, nakshatra, gotra and manglik status, for families that match kundli. Hide the section if you do not need it.',
          },
          {
            title: 'Partner expectations and contact',
            text: 'A short, respectful description of what the family is looking for, and a mobile number and address for the family.',
          },
        ],
      },
      {
        heading: "Choosing a design for a bride's biodata",
        body: [
          'Soft colours, round photo frames and clean cards make a modern bride biodata feel friendly and polished. Browse the [modern bride templates](/templates/bride) or pick a traditional look from the [Hindu](/templates/hindu), [Marathi](/templates/marathi) or [floral](/templates/floral) collections.',
          'You can switch between designs at any time without retyping, so try a few with your own details before you decide.',
        ],
      },
      {
        heading: 'Tips for a good bride biodata',
        list: [
          'Use a recent photograph in good light with a plain background.',
          'Keep the language simple and the layout uncluttered.',
          'Check the spelling of names and places, and have a family member read it before you share it.',
          'Share only what the family is comfortable sharing. Every field except the name is optional, and you can add your own fields, such as languages known.',
          'Keep it to one page if you can, because it will mostly be read on a phone.',
        ],
      },
      {
        heading: 'Preparing a biodata for a groom?',
        body: [
          'The format is similar, with more emphasis on career. See the [marriage biodata for groom](/marriage-biodata-for-groom) guide, or read the general [marriage biodata format](/marriage-biodata-format).',
        ],
      },
    ],
    related: ['marriage-biodata-for-groom', 'marriage-biodata-format', 'free-marriage-biodata-maker', 'online-marriage-biodata-maker'],
  },
  {
    slug: 'marriage-biodata-for-groom',
    lang: 'en',
    navLabel: 'Marriage biodata for groom',
    title: 'Marriage Biodata for Groom: Format and Free Maker | ShubhPatra',
    description:
      "What to include in a groom's marriage biodata: career, family and horoscope details, with design tips and modern groom templates. Download a PDF.",
    h1: 'Marriage Biodata for Groom',
    intro:
      "A groom's biodata should be easy to read in a minute. This guide shows what to include, in what order, and which designs suit it. Fill in your details with ShubhPatra's [free marriage biodata maker](/free-marriage-biodata-maker) and download a PDF.",
    cta: 'Create biodata for groom',
    category: 'groom',
    gridHeading: 'Modern groom biodata templates',
    sections: [
      {
        heading: 'What to include in a marriage biodata for a groom',
        items: [
          {
            title: 'Personal details',
            text: 'Full name, date of birth, height, religion, community, mother tongue and marital status, with a recent photograph where the face is clearly visible.',
          },
          {
            title: 'Education and career',
            text: 'Highest qualification, college, designation, company, work location and, if you want to share it, annual income. Families look closely at this section, so keep it accurate.',
          },
          {
            title: 'Family details',
            text: "Parents' names and occupations, brothers and sisters, family type, native place and the family's background in a line or two.",
          },
          {
            title: 'Interests and lifestyle',
            text: 'Diet, habits and hobbies such as cricket, travel, music or photography.',
          },
          {
            title: 'Horoscope details (optional)',
            text: 'Birth time and place, rashi, nakshatra, gotra and manglik status, for families that match kundli.',
          },
          {
            title: 'Partner expectations and contact',
            text: 'A few respectful lines on what you are looking for, followed by a mobile number and address for the family.',
          },
        ],
      },
      {
        heading: "Choosing a design for a groom's biodata",
        body: [
          'Bold headings, a clear layout and a sharp photo frame suit a groom biodata. Look at the [modern groom templates](/templates/groom), or choose a more formal look from the [royal](/templates/royal) or [traditional](/templates/traditional) collections.',
          'Your details are stored separately from the design, so you can try several templates with your own information and switch freely.',
        ],
      },
      {
        heading: 'Presenting career details well',
        body: [
          'Families often read the career section first, so give it a clear order: designation, company, city and the field you work in. If you run a family business or your own practice, say so plainly, and mention where you plan to settle only if it matters to you.',
        ],
      },
      {
        heading: 'Tips for a good groom biodata',
        list: [
          'Use a recent, well lit photograph with a plain background.',
          'Write the designation and company exactly as they appear on your offer or ID.',
          'Keep expectations realistic and respectful.',
          'Check spellings and ask a family member to read it once.',
          'Keep it to one page where possible, since it is usually read on a phone.',
        ],
      },
      {
        heading: 'Preparing a biodata for a bride?',
        body: [
          'See the [marriage biodata for bride](/marriage-biodata-for-bride) guide, or the general [marriage biodata format](/marriage-biodata-format).',
        ],
      },
    ],
    related: ['marriage-biodata-for-bride', 'marriage-biodata-format', 'free-marriage-biodata-maker', 'online-marriage-biodata-maker'],
  },
  {
    slug: 'hindu-marriage-biodata',
    lang: 'en',
    navLabel: 'Hindu marriage biodata format',
    title: 'Hindu Marriage Biodata Format and Maker | ShubhPatra',
    description:
      'The Hindu marriage biodata format with Ganesh blessing, rashi, nakshatra, gotra and manglik fields. Choose a design, add your details and download a PDF.',
    h1: 'Hindu Marriage Biodata Format',
    intro:
      'Create a Hindu marriage biodata with a Ganesh blessing, auspicious symbols and the horoscope details most families expect. Choose a design, fill in your details once and download a print-ready PDF.',
    cta: 'Create Hindu biodata',
    category: 'hindu',
    gridHeading: 'Hindu marriage biodata templates',
    sections: [
      {
        heading: 'Hindu marriage biodata format',
        items: [
          {
            title: 'Blessing and symbol',
            text: 'Hindu biodatas often open with "Shree Ganeshaya Namah" or a line for the family deity, with a symbol such as Om, Shree or a kalash. You can type your own line or pick one of the presets.',
          },
          {
            title: 'Personal and community details',
            text: 'Name, date of birth, height, religion, caste, sub-caste, gotra and mother tongue. Many families also mention the native place and family type.',
          },
          {
            title: 'Birth and horoscope details',
            text: 'Birth time, birth place, rashi, nakshatra and manglik status are used for kundli matching. ShubhPatra has dropdowns for the twelve rashis and twenty-seven nakshatras.',
          },
          {
            title: 'Education, career and family',
            text: 'Qualification, occupation, employer and location, along with parents, brothers and sisters, and relatives you would like to mention.',
          },
        ],
      },
      {
        heading: 'Choosing a Hindu biodata design',
        body: [
          'Traditional designs with mandalas, toran borders and gold detailing suit a formal Hindu biodata. Browse the [Hindu marriage biodata templates](/templates/hindu), or look at the [Marathi](/templates/marathi) and [royal](/templates/royal) collections.',
          'All designs share the same form, so you can preview several with your own details before you decide.',
        ],
      },
      {
        heading: 'Questions families ask',
        items: [
          {
            title: 'Do we have to include horoscope details?',
            text: 'No. Birth time, rashi and nakshatra are useful only if both families match kundli. If yours does not, hide the section and keep the biodata shorter.',
          },
          {
            title: 'Which blessing line should we use?',
            text: 'Most Hindu families use "Shree Ganeshaya Namah", but you can use the name of the family deity, a mantra or no line at all. The field accepts any text.',
          },
          {
            title: 'Can the biodata be in Hindi or Marathi?',
            text: 'Yes. Pick Hindi or Marathi and the headings and labels change in the editor and on the biodata, while your own words stay as you typed them.',
          },
        ],
      },
      {
        heading: 'Tips for a Hindu marriage biodata',
        list: [
          'Add horoscope details only if both families use them. The section can be hidden in one tap.',
          'Write the gotra and sub-caste the way your family writes them.',
          'Use a recent photograph, and keep the biodata to one page if you can.',
          'You can create it in [Hindi](/hindi-biodata-maker) or [Marathi](/marathi-biodata-maker) as well as English.',
        ],
      },
    ],
    related: ['marriage-biodata-format', 'marriage-biodata-for-bride', 'marriage-biodata-for-groom', 'hindi-biodata-maker', 'marathi-biodata-maker'],
  },
  {
    slug: 'muslim-marriage-biodata',
    lang: 'en',
    navLabel: 'Muslim marriage biodata',
    title: 'Muslim Marriage Biodata Maker (Nikah Biodata) | ShubhPatra',
    description:
      'Create a Muslim marriage biodata for nikah with a Bismillah heading and crescent symbol. Elegant templates, live preview and PDF download.',
    h1: 'Muslim Marriage Biodata Maker',
    intro:
      'Create a graceful nikah biodata with a Bismillah heading, a crescent symbol and geometric patterns. Add sect, family and education details, then download a PDF.',
    cta: 'Create Muslim biodata',
    category: 'muslim',
    gridHeading: 'Muslim marriage biodata templates',
    sections: [
      {
        heading: 'Muslim marriage biodata format',
        items: [
          {
            title: 'Bismillah and heading',
            text: 'A Muslim biodata usually begins with Bismillah-ir-Rahman-ir-Rahim, which you can type in the blessing line with the crescent symbol.',
          },
          {
            title: 'Personal details and community',
            text: 'Date of birth, height, mother tongue, education and, if your family mentions them, the sect or maslak and the biradari. You can add these as your own fields.',
          },
          {
            title: 'Education, career and family',
            text: 'Qualification, occupation and work location, along with parents, brothers and sisters and the native place. Family background matters to many families.',
          },
          {
            title: 'Horoscope is not needed',
            text: 'Hide the birth and horoscope section in one tap. Many families add details such as namaz and fasting, or interest in the Quran, as custom fields.',
          },
        ],
      },
      {
        heading: 'Choosing a design for a nikah biodata',
        body: [
          'Teal, emerald and gold with geometric lattices give a Muslim biodata a refined look. Browse the [Muslim marriage biodata templates](/templates/muslim) or see the [royal](/templates/royal) collection for a more formal style.',
        ],
      },
      {
        heading: 'Questions families ask',
        items: [
          {
            title: 'Can I hide the horoscope section?',
            text: 'Yes. Turn off the birth and horoscope section and it disappears from the preview and the PDF, so nothing is left blank.',
          },
          {
            title: 'Can I write the biodata in Hindi or Marathi?',
            text: 'The headings and labels can be switched to Hindi or Marathi. Urdu is not offered as a language yet, so the labels are in English, Hindi or Marathi, and your own text stays as you typed it.',
          },
          {
            title: 'Is the PDF suitable for printing?',
            text: 'Yes. The download is an A4 PDF made for printing, and it also reads well on a phone when you share it by message.',
          },
        ],
      },
      {
        heading: 'Get your details ready',
        list: [
          'A recent, clear photograph',
          'Date of birth, height and mother tongue',
          'Education, occupation and work location',
          'Names of parents and siblings, and the native place',
          'Any custom fields you want to add, such as sect or biradari',
          'A contact number and address you are happy to share',
        ],
      },
      {
        heading: 'Tips',
        list: [
          'Keep it to one page if you can, with a clear recent photograph.',
          'Write names and places the way your family writes them. Your own text is never changed or translated.',
          'See the general [marriage biodata format](/marriage-biodata-format) if you are unsure what to include.',
        ],
      },
    ],
    related: ['marriage-biodata-format', 'marriage-biodata-for-bride', 'marriage-biodata-for-groom', 'free-marriage-biodata-maker'],
  },
  {
    slug: 'jain-marriage-biodata',
    lang: 'en',
    navLabel: 'Jain marriage biodata',
    title: 'Jain Marriage Biodata Maker with PDF Download | ShubhPatra',
    description:
      'Create a Jain marriage biodata with a Jai Jinendra heading and the Jain emblem. Add sect, gotra and family details and download a PDF.',
    h1: 'Jain Marriage Biodata Maker',
    intro:
      'Create a Jain marriage biodata that opens with Jai Jinendra and the Jain emblem. Add your sect, gotra, family and career details and download a print-ready PDF.',
    cta: 'Create Jain biodata',
    category: 'jain',
    gridHeading: 'Jain marriage biodata templates',
    sections: [
      {
        heading: 'Jain marriage biodata format',
        items: [
          {
            title: 'Jai Jinendra heading',
            text: 'Jain biodatas commonly begin with "Jai Jinendra" and the Jain emblem. Both can be chosen in the heading and symbol options.',
          },
          {
            title: 'Sect, sub-sect and gotra',
            text: 'Mention the sect (Digambar or Shwetambar), the sub-sect or samaj such as Oswal, the gotra and the native place, along with the family business or profession.',
          },
          {
            title: 'Diet and lifestyle',
            text: 'Diet is important to Jain families. The lifestyle section has a Jain diet option, and you can add custom fields for anything specific to your family.',
          },
        ],
      },
      {
        heading: 'Get your details ready',
        list: [
          'A recent, clear photograph',
          'Date of birth, height and mother tongue',
          'Education, occupation or family business',
          'Sect, sub-sect, gotra and native place',
          'Names and occupations of parents, brothers and sisters',
          'A contact number and address you are happy to share',
        ],
      },
      {
        heading: 'Questions families ask',
        items: [
          {
            title: 'Can I add the sub-sect and samaj?',
            text: 'Yes. Add any number of your own fields, such as sub-sect, samaj or gotra, and they appear in the preview and the PDF with the rest of the details.',
          },
          {
            title: 'Can I hide the horoscope section?',
            text: 'Yes. If your family does not match kundli, turn the section off and the biodata becomes shorter and cleaner.',
          },
          {
            title: 'Can I check the biodata before downloading?',
            text: 'The preview updates as you type, so you see exactly how the page will look. Change a design at any time without re-entering your details.',
          },
        ],
      },
      {
        heading: 'Tips for a Jain biodata',
        list: [
          'Keep it to one page if you can, with a clear recent photograph.',
          'Write names, the sect and the native place the way your family writes them. Your own text is never changed or translated.',
          'Mention diet and lifestyle plainly, since they matter to many Jain families.',
          'Check the spelling of every name in the preview before you download.',
        ],
      },
      {
        heading: 'Designs for a Jain biodata',
        body: [
          'Saffron and gold with the Jain emblem and lotus motifs give a Jain biodata a calm, traditional feel. Browse the [Jain marriage biodata templates](/templates/jain) or look at the [traditional](/templates/traditional) collection.',
          'New to biodatas? Start with the [marriage biodata format](/marriage-biodata-format) guide.',
        ],
      },
    ],
    related: ['marriage-biodata-format', 'hindu-marriage-biodata', 'marriage-biodata-for-bride', 'marriage-biodata-for-groom'],
  },
  {
    slug: 'sikh-marriage-biodata',
    lang: 'en',
    navLabel: 'Sikh marriage biodata',
    title: 'Sikh Marriage Biodata Maker and Format | ShubhPatra',
    description:
      'Create a Sikh marriage biodata with the Ik Onkar heading in saffron and blue. Add family, education and career details and download a PDF online.',
    h1: 'Sikh Marriage Biodata Maker',
    intro:
      'Create a Sikh marriage biodata that opens with Ik Onkar and uses saffron and blue. Add family, education and career details, then download a print-ready PDF.',
    cta: 'Create Sikh biodata',
    category: 'sikh',
    gridHeading: 'Sikh marriage biodata templates',
    sections: [
      {
        heading: 'Sikh marriage biodata format',
        items: [
          {
            title: 'Ik Onkar heading',
            text: 'Many Sikh biodatas begin with Ik Onkar or a line such as "Ik Onkar Satgur Prasad". Type your own opening line in the blessing field and choose the Ik Onkar symbol.',
          },
          {
            title: 'Personal details',
            text: 'Date of birth, height, mother tongue, education and career. Families often mention whether the person is Amritdhari, Keshdhari or Sehajdhari, and the community or zaat. Add these as your own fields.',
          },
          {
            title: 'Horoscope and family',
            text: 'Horoscope details are usually not needed, so the birth and horoscope section can be hidden. Parents, brothers and sisters and the native place give the other family a clear picture.',
          },
        ],
      },
      {
        heading: 'Get your details ready',
        list: [
          'A recent, clear photograph',
          'Date of birth, height and mother tongue',
          'Education, occupation and work location',
          'Names and occupations of parents, brothers and sisters',
          'Any custom fields you want, such as Amritdhari or Keshdhari status or the community',
          'A contact number and address you are happy to share',
        ],
      },
      {
        heading: 'Questions families ask',
        items: [
          {
            title: 'Can I add Amritdhari or Keshdhari status?',
            text: 'Yes. Add it as a custom field with any label you like, and it appears in the preview and the PDF with the rest of the personal details.',
          },
          {
            title: 'Can I hide the horoscope section?',
            text: 'Yes. Turn the birth and horoscope section off and it is removed from the page, so there are no empty rows.',
          },
          {
            title: 'Can I check the biodata before downloading?',
            text: 'The preview updates as you type, so you see exactly how the page will look. Change a design at any time without re-entering your details.',
          },
        ],
      },
      {
        heading: 'Tips for a Sikh biodata',
        list: [
          'Keep it to one page if you can, with a clear recent photograph.',
          'Write names, the community and the native place the way your family writes them. Your own text is never changed or translated.',
          'Mention your outlook on faith and family in a line or two, and keep the rest factual.',
          'Check the spelling of every name in the preview before you download.',
        ],
      },
      {
        heading: 'Designs for a Sikh biodata',
        body: [
          'Saffron and deep blue with a checked border give a Sikh biodata a confident look. Browse the [Sikh marriage biodata templates](/templates/sikh).',
          'Not sure what to include? The [marriage biodata format](/marriage-biodata-format) guide explains each section.',
        ],
      },
    ],
    related: ['marriage-biodata-format', 'marriage-biodata-for-bride', 'marriage-biodata-for-groom', 'free-marriage-biodata-maker'],
  },
  {
    slug: 'christian-marriage-biodata',
    lang: 'en',
    navLabel: 'Christian marriage biodata',
    title: 'Christian Marriage Biodata Maker and Format | ShubhPatra',
    description:
      'Create a Christian marriage biodata with a cross symbol and soft, clean designs. Add denomination, family and career details and download a PDF.',
    h1: 'Christian Marriage Biodata Maker',
    intro:
      'Create a calm, well organised Christian marriage biodata with a cross symbol and soft colours. Add your denomination, family and career details and download a PDF.',
    cta: 'Create Christian biodata',
    category: 'christian',
    gridHeading: 'Christian marriage biodata templates',
    sections: [
      {
        heading: 'Christian marriage biodata format',
        items: [
          {
            title: 'Blessing and symbol',
            text: 'A Christian biodata often opens with a short blessing or Bible verse. Type it into the blessing field and choose the cross symbol, or none at all.',
          },
          {
            title: 'Denomination and parish',
            text: 'Along with the usual details, many families mention the denomination, such as Roman Catholic, Syrian Christian or Protestant, and the parish or church they belong to. Add these as your own fields.',
          },
          {
            title: 'Horoscope is not needed',
            text: 'Hide the birth and horoscope section. Add family details, interests and partner expectations to finish.',
          },
        ],
      },
      {
        heading: 'Get your details ready',
        list: [
          'A recent, clear photograph',
          'Date of birth, height and mother tongue',
          'Education, occupation and work location',
          'Denomination, parish or church, and the names of parents and siblings',
          'A short blessing or Bible verse, if you want one at the top',
          'A contact number and address you are happy to share',
        ],
      },
      {
        heading: 'Questions families ask',
        items: [
          {
            title: 'Can I add the denomination and parish?',
            text: 'Yes. Add them as custom fields with any label you like, and they appear in the preview and the PDF with the rest of the personal details.',
          },
          {
            title: 'Can I hide the horoscope section?',
            text: 'Yes. Turn the birth and horoscope section off and it is removed from the page, so there are no empty rows.',
          },
          {
            title: 'Can I check the biodata before downloading?',
            text: 'The preview updates as you type, so you see exactly how the page will look. Change a design at any time without re-entering your details.',
          },
        ],
      },
      {
        heading: 'Tips for a Christian biodata',
        list: [
          'Keep it to one page if you can, with a clear recent photograph.',
          'Write names, the parish and the native place the way your family writes them. Your own text is never changed or translated.',
          'Add a line about your interests and what you are looking for, and keep the rest factual.',
          'Check the spelling of every name in the preview before you download.',
        ],
      },
      {
        heading: 'Designs for a Christian biodata',
        body: [
          'Soft blues, sage greens and olive-branch borders give a Christian biodata a gentle look. Browse the [Christian marriage biodata templates](/templates/christian) or see the [elegant](/templates/elegant) collection.',
          'The [marriage biodata format](/marriage-biodata-format) guide covers everything else you might include.',
        ],
      },
    ],
    related: ['marriage-biodata-format', 'marriage-biodata-for-bride', 'marriage-biodata-for-groom', 'free-marriage-biodata-maker'],
  },
  {
    slug: 'marathi-biodata-maker',
    lang: 'mr',
    navLabel: 'मराठी बायोडाटा',
    title: 'मराठी लग्न बायोडाटा मेकर | Marathi Biodata | ShubhPatra',
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
          'पत्रिकेच्या माहितीत रास, नक्षत्र, गोत्र आणि मंगळ यांचा समावेश होतो. कौटुंबिक माहितीत आई-वडील, भाऊ, बहीण, मूळ गाव, नातेवाईकांची आडनावे तसेच मामा किंवा आजोळ यांचा उल्लेख करता येतो. त्यासाठी स्वतःचे फील्ड जोडा.',
        ],
      },
      {
        heading: 'मराठी, हिंदी किंवा इंग्रजीत',
        body: [
          'बायोडाटाची भाषा मराठी निवडल्यावर संपादक आणि बायोडाटा दोन्हीतील सर्व शीर्षके आणि लेबल मराठीत दिसतात. PDF मध्ये देवनागरी अक्षरे अगदी व्यवस्थित येतात. तुम्ही लिहिलेली माहिती जशीच्या तशी राहते.',
        ],
      },
      {
        heading: 'योग्य डिझाइन निवडा',
        body: [
          'तोरण, पैठणी किनार आणि मराठी शीर्षके असलेले [मराठी बायोडाटा डिझाइन](/templates/marathi) पहा किंवा [सर्व टेम्पलेट](/templates) तपासा. तुमची माहिती एकदा भरली की डिझाइन कधीही बदलता येते.',
        ],
      },
      {
        heading: 'सुरू करण्यापूर्वी तयार ठेवा',
        list: [
          'अलीकडचा स्पष्ट फोटो',
          'जन्मतारीख आणि वेळ, कुंडलीची माहिती हवी असल्यास',
          'आई-वडिलांची नावे आणि व्यवसाय, भाऊ-बहिणींची माहिती',
          'शिक्षण, नोकरी किंवा व्यवसाय आणि कामाचे ठिकाण',
          'संपर्कासाठी मोबाईल क्रमांक आणि पत्ता',
        ],
      },
      {
        heading: 'आणखी मार्गदर्शन',
        body: ['इंग्रजीत माहिती हवी असल्यास [marriage biodata format](/marriage-biodata-format) हे मार्गदर्शक वाचा, किंवा [हिंदू लग्न बायोडाटा नमुना](/hindu-marriage-biodata) पाहा.'],
      },
    ],
    related: ['hindi-biodata-maker', 'hindu-marriage-biodata', 'marriage-biodata-format'],
  },
  {
    slug: 'hindi-biodata-maker',
    lang: 'hi',
    navLabel: 'हिंदी बायोडाटा',
    title: 'हिंदी में विवाह बायोडाटा बनाएँ | Hindi Biodata | ShubhPatra',
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
          'कुंडली विवरण में राशि, नक्षत्र, गोत्र और मांगलिक की जानकारी होती है। पारिवारिक जानकारी में माता-पिता, भाई-बहन, परिवार का प्रकार, मूल निवास और रिश्तेदारों के उपनाम लिखें।',
        ],
      },
      {
        heading: 'हिंदी, मराठी या अंग्रेज़ी में',
        body: [
          'बायोडाटा की भाषा हिंदी चुनते ही एडिटर और बायोडाटा, दोनों के सभी शीर्षक और लेबल हिंदी में दिखते हैं। PDF में देवनागरी अक्षर बिल्कुल सही आते हैं। आपकी लिखी जानकारी जैसी की तैसी रहती है।',
        ],
      },
      {
        heading: 'सही डिज़ाइन चुनें',
        body: [
          'गणेश वंदना, मंडला और सुनहरी किनारों वाले [हिंदू बायोडाटा डिज़ाइन](/templates/hindu) देखें, या [सभी टेम्पलेट](/templates) जाँचें। अपनी जानकारी एक बार भरने के बाद डिज़ाइन कभी भी बदल सकते हैं।',
        ],
      },
      {
        heading: 'शुरू करने से पहले तैयार रखें',
        list: [
          'हाल की साफ़ फ़ोटो',
          'जन्म तिथि और समय, यदि कुंडली का विवरण जोड़ना हो',
          'माता-पिता के नाम और व्यवसाय, भाई-बहनों की जानकारी',
          'शिक्षा, नौकरी या व्यवसाय और कार्यस्थल',
          'संपर्क के लिए मोबाइल नंबर और पता',
        ],
      },
      {
        heading: 'और जानकारी',
        body: ['अंग्रेज़ी में विस्तृत गाइड के लिए [marriage biodata format](/marriage-biodata-format) पढ़ें, या [हिंदू विवाह बायोडाटा प्रारूप](/hindu-marriage-biodata) देखें।'],
      },
    ],
    related: ['marathi-biodata-maker', 'hindu-marriage-biodata', 'marriage-biodata-format'],
  },
];

/**
 * Earlier addresses of pages that now live under a better-matching address. They still open, but
 * their canonical URL points at the new page, so search engines index only one copy.
 */
export const LANDING_ALIASES: readonly { slug: string; to: string }[] = [
  { slug: 'biodata-format-for-girl', to: 'marriage-biodata-for-bride' },
  { slug: 'biodata-format-for-boy', to: 'marriage-biodata-for-groom' },
];

export function findLanding(slug: string): Landing | undefined {
  return LANDINGS.find((l) => l.slug === slug);
}
