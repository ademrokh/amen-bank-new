'use client';

import Link from 'next/link';
import {
  ArrowRight,
  Wheat,
  Hotel,
  Landmark,
  ShieldPlus,
  Briefcase,
  Truck,
  Building2,
  Users,
} from 'lucide-react';
import { useLang } from '@/hooks/useLang';

type Language = 'fr' | 'ar' | 'en';

export default function GroupIdentity() {
  const { lang, isRTL } = useLang();
  const l = lang as Language;

  const content = {
    fr: {
      hero: {
        badge: 'Groupe Amen',
        title: 'Partenaire privilégié sur la durée',
        sub: '60 sociétés, 6 pôles d\u2019activité.',
      },
      overview: {
        title: 'Un acteur économique majeur',
        desc: 'Aujourd\u2019hui, Amen Group compte une soixantaine de sociétés contrôlées par une société mère, la PGI \u2013 Holding. Le Chiffre d\u2019Affaires d\u2019Amen Group dépasse 1,5 Milliard de Dinars Tunisiens, dont une partie est réalisée à l\u2019international. Il s\u2019agit là d\u2019un axe de développement stratégique. Amen Group emploie environ 4000 personnes et est réputé pour son éthique, son sérieux, sa solidité financière et sa volonté d\u2019établir des relations de long terme avec ses partenaires et clients.',
        stats: [
          { value: '60', label: 'Sociétés' },
          { value: '6', label: 'Pôles' },
          { value: '1,5 Md', label: 'DT de C.A.' },
          { value: '4000', label: 'Collaborateurs' },
        ],
      },
      polesTitle: 'Nos 6 Pôles d\u2019Activité',
      poles: [
        {
          icon: Wheat,
          title: 'Pôle Agroalimentaire',
          desc: 'Neuf sociétés, dont Cafés Ben Yedder, première société du Groupe (1934), Cafés Bondin (acquise en 1964) ou encore Kawaris, Société de Mise en Valeur et de Développement Agricole créée en 1993.',
          brands: ['Cafés Bondin', 'Secafé', 'G.F.C.O.', 'Huilerie Ben Yedder', 'Cafés Ben Yedder', 'La Générale Alimentaire', 'Kawaris'],
        },
        {
          icon: Hotel,
          title: 'Pôle Hôtelier',
          desc: 'Trois hôtels \u2013 le Majestic Hôtel, construit à Tunis en 1911, Dar Saïd Hôtel à Sidi Bou Saïd et l\u2019Hôtel Tunisia Palace, à proximité de la Médina \u2013 ainsi que le restaurant 3 fourchettes Dar Zarrouk.',
          brands: ['Hôtel Majestic', 'Dar Saïd', 'Tunisia Palace', 'Dar Zarrouk'],
        },
        {
          icon: Landmark,
          title: 'Pôle Bancaire',
          desc: 'Huit sociétés financières, dont Amen Bank, Amen Invest, Amen Capital, Sicar Amen, Amen Project, Sogerec, Le Recouvrement et Tunisys.',
          brands: ['Amen Bank', 'Amen Invest', 'Amen Capital', 'Amen Project', 'Sicar Amen', 'Tunisys'],
        },
        {
          icon: ShieldPlus,
          title: 'Pôle Assurance et Santé',
          desc: 'Cinq sociétés, dont les Assurances Comar et Hayett, et six cliniques (Mutuelleville, La Marsa, Gafsa, Béja, Nabeul et Bizerte) gérées par Amen Santé, créée en 2009.',
          brands: ['Comar', 'Hayett', 'Amen Santé'],
        },
        {
          icon: Briefcase,
          title: 'Pôle Services Financiers Spécialisés',
          desc: 'Cinq sociétés, dont Tunisie Leasing, pionnière du leasing en Tunisie, Maghreb Leasing Algérie, Tunisie Factoring, Tunisie LLD et Alios, présente en Afrique depuis 1956.',
          brands: ['Tunisie Leasing', 'Maghreb Leasing', 'Tunisie Factoring', 'Tunisie LLD', 'Alios'],
        },
        {
          icon: Building2,
          title: 'Pôle Commerce de biens d\u2019équipements',
          desc: 'Quatre sociétés : Parenin, créée en 1902, concessionnaire de Caterpillar, Atlas Copco et John Deere, MTI sa filiale concessionnaire Caterpillar en Libye, AL Tractors et Sinew Tunisie.',
          brands: ['Parenin', 'MTI', 'AL Tractors', 'Sinew'],
        },
        {
          icon: Truck,
          title: 'Pôle Matériel de transport',
          desc: 'Deux sociétés : Ennakl Automobiles, distributeur du Groupe Volkswagen en Tunisie depuis 2010, et Car Gros, filiale d\u2019Ennakl Automobiles créée en 2007.',
          brands: ['Ennakl', 'Car Gros'],
        },
      ],
      historyTitle: 'Plus d\u2019un siècle d\u2019histoire',
      historyDesc: 'De ses racines agro-alimentaires à un groupe multidisciplinaire, découvrez les étapes clés du développement d\u2019Amen Group, fondé par feu Brahim Ben Yedder.',
      timeline: [
        { year: '1934', event: 'Création de la société Cafés Ben Yedder, spécialisée dans la torréfaction et la distribution de café en Tunisie.' },
        { year: '1957', event: 'Acquisition de la \u201cGrande Fabrique de Confiserie Orientale\u201d (G.F.C.O.), productrice et distributrice de Halwa Chamia.' },
        { year: '1961', event: 'Création de l\u2019Huilerie Ben Yedder, société pionnière dans l\u2019extraction et la commercialisation d\u2019huiles d\u2019olive.' },
        { year: '1971', event: 'Acquisition du \u201cCrédit Foncier et Commercial de Tunisie\u201d (C.F.C.T.), qui sera renommé Amen Bank en 1995.' },
        { year: '1973', event: 'Acquisition de la compagnie d\u2019Assurances COMAR (Compagnie Méditerranéenne d\u2019Assurances et de Réassurances).' },
        { year: '1977', event: 'Acquisition de la Société Parenin, fondée en 1902, concessionnaire de Caterpillar, John Deere et Atlas Copco.' },
        { year: '2005', event: 'Naissance de la société Maghreb Leasing Algérie, renforçant la position d\u2019Amen Group dans le secteur financier régional.' },
        { year: '2012', event: 'Acquisition de la majorité du capital de la société Ennakl, distributeur du Groupe Volkswagen en Tunisie.' },
        { year: '2015', event: 'Extension de l\u2019activité du Groupe à l\u2019Afrique sub-saharienne avec le rachat de la société Alios Finance.' },
      ],
      takeoff: {
        badge: 'Amen Group',
        title: 'Les années 2000\u2026 l\u2019envol',
        desc: 'La prise de participation majoritaire dans le Groupe Tunisie Leasing a permis à Amen Group de renforcer sa position d\u2019acteur de premier plan dans le secteur financier en Tunisie puis en Algérie, par la création en 2005 de la société Maghreb Leasing Algérie. En 2012, Amen Group, en consortium avec Poulina Group Holding, acquiert la majorité du capital de la société Ennakl, distributeur du Groupe Volkswagen en Tunisie depuis 1965. En 2015, Amen Group étend son activité à l\u2019Afrique sub-saharienne avec le rachat de la société Alios Finance.',
      },
      mgmtTitle: 'Direction Générale de la PGI \u2013 Holding',
      mgmt: [
        { name: 'Mr. Karim BEN YEDDER', role: 'Président - Directeur Général' },
        { name: 'Mme. Selma BABBOU', role: 'Directeur Général Adjoint' },
        { name: 'Mr. Kamel TELLILI', role: 'Consultant' },
      ],
      ctaTitle: 'Découvrir Amen Bank',
      ctaDesc: 'Explorez l\u2019univers bancaire de notre groupe.',
      ctaBtn: 'Visiter Amen Bank',
    },
    en: {
      hero: {
        badge: 'Amen Group',
        title: 'Privileged partner over time',
        sub: '60 companies, 6 business poles.',
      },
      overview: {
        title: 'A major economic player',
        desc: 'Today, Amen Group counts around sixty companies controlled by a parent company, PGI \u2013 Holding. Amen Group\u2019s turnover exceeds 1.5 billion Tunisian Dinars, part of which is achieved internationally \u2014 a key strategic development axis. Amen Group employs around 4,000 people and is renowned for its ethics, seriousness, financial solidity, and its commitment to building long-term relationships with its partners and clients.',
        stats: [
          { value: '60', label: 'Companies' },
          { value: '6', label: 'Poles' },
          { value: '1.5 Bn', label: 'TND turnover' },
          { value: '4,000', label: 'Employees' },
        ],
      },
      polesTitle: 'Our 6 Business Poles',
      poles: [
        {
          icon: Wheat,
          title: 'Agri-food Pole',
          desc: 'Nine companies, including Cafés Ben Yedder, the Group\u2019s first company (1934), Cafés Bondin (acquired in 1964), and Kawaris, an agricultural development company created in 1993.',
          brands: ['Cafés Bondin', 'Secafé', 'G.F.C.O.', 'Huilerie Ben Yedder', 'Cafés Ben Yedder', 'La Générale Alimentaire', 'Kawaris'],
        },
        {
          icon: Hotel,
          title: 'Hospitality Pole',
          desc: 'Three hotels \u2014 the Majestic Hotel, built in Tunis in 1911, Dar Saïd Hotel in Sidi Bou Saïd, and Hôtel Tunisia Palace near the Medina \u2014 along with the three-fork restaurant Dar Zarrouk.',
          brands: ['Hôtel Majestic', 'Dar Saïd', 'Tunisia Palace', 'Dar Zarrouk'],
        },
        {
          icon: Landmark,
          title: 'Banking Pole',
          desc: 'Eight financial companies, including Amen Bank, Amen Invest, Amen Capital, Sicar Amen, Amen Project, Sogerec, Le Recouvrement, and Tunisys.',
          brands: ['Amen Bank', 'Amen Invest', 'Amen Capital', 'Amen Project', 'Sicar Amen', 'Tunisys'],
        },
        {
          icon: ShieldPlus,
          title: 'Insurance & Health Pole',
          desc: 'Five companies, including Comar and Hayett insurance, and six clinics (Mutuelleville, La Marsa, Gafsa, Béja, Nabeul, and Bizerte) managed by Amen Santé, founded in 2009.',
          brands: ['Comar', 'Hayett', 'Amen Santé'],
        },
        {
          icon: Briefcase,
          title: 'Specialized Financial Services Pole',
          desc: 'Five companies, including Tunisie Leasing, a pioneer of leasing in Tunisia, Maghreb Leasing Algérie, Tunisie Factoring, Tunisie LLD, and Alios, present in Africa since 1956.',
          brands: ['Tunisie Leasing', 'Maghreb Leasing', 'Tunisie Factoring', 'Tunisie LLD', 'Alios'],
        },
        {
          icon: Building2,
          title: 'Equipment Goods Trading Pole',
          desc: 'Four companies: Parenin, founded in 1902, dealer for Caterpillar, Atlas Copco, and John Deere; MTI, its Caterpillar dealership subsidiary in Libya; AL Tractors; and Sinew Tunisie.',
          brands: ['Parenin', 'MTI', 'AL Tractors', 'Sinew'],
        },
        {
          icon: Truck,
          title: 'Transport Equipment Pole',
          desc: 'Two companies: Ennakl Automobiles, distributor of the Volkswagen Group in Tunisia since 2010, and Car Gros, a subsidiary of Ennakl Automobiles created in 2007.',
          brands: ['Ennakl', 'Car Gros'],
        },
      ],
      historyTitle: 'More than a century of history',
      historyDesc: 'From its agri-food roots to a multidisciplinary group, discover the key milestones in the development of Amen Group, founded by the late Brahim Ben Yedder.',
      timeline: [
        { year: '1934', event: 'Creation of Cafés Ben Yedder, specializing in coffee roasting and distribution in Tunisia.' },
        { year: '1957', event: 'Acquisition of the \u201cGrande Fabrique de Confiserie Orientale\u201d (G.F.C.O.), producer and distributor of Halwa Chamia.' },
        { year: '1961', event: 'Creation of Huilerie Ben Yedder, a pioneering company in olive oil extraction and marketing.' },
        { year: '1971', event: 'Acquisition of the \u201cCrédit Foncier et Commercial de Tunisie\u201d (C.F.C.T.), later renamed Amen Bank in 1995.' },
        { year: '1973', event: 'Acquisition of the COMAR insurance company (Compagnie Méditerranéenne d\u2019Assurances et de Réassurances).' },
        { year: '1977', event: 'Acquisition of Parenin, founded in 1902, dealer for Caterpillar, John Deere, and Atlas Copco.' },
        { year: '2005', event: 'Birth of Maghreb Leasing Algérie, strengthening Amen Group\u2019s position in the regional financial sector.' },
        { year: '2012', event: 'Acquisition of a majority stake in Ennakl, distributor of the Volkswagen Group in Tunisia.' },
        { year: '2015', event: 'Expansion into sub-Saharan Africa with the acquisition of Alios Finance.' },
      ],
      takeoff: {
        badge: 'Amen Group',
        title: 'The 2000s\u2026 Take-off',
        desc: 'Taking a majority stake in the Tunisie Leasing Group allowed Amen Group to strengthen its position as a leading player in the financial sector in Tunisia and then in Algeria, through the creation in 2005 of Maghreb Leasing Algérie. In 2012, Amen Group, in a consortium with Poulina Group Holding, acquired a majority stake in Ennakl, distributor of the Volkswagen Group in Tunisia since 1965. In 2015, Amen Group expanded into sub-Saharan Africa with the acquisition of Alios Finance.',
      },
      mgmtTitle: 'Group Management (PGI \u2013 Holding)',
      mgmt: [
        { name: 'Mr. Karim BEN YEDDER', role: 'Chairman - CEO' },
        { name: 'Ms. Selma BABBOU', role: 'Deputy CEO' },
        { name: 'Mr. Kamel TELLILI', role: 'Consultant' },
      ],
      ctaTitle: 'Discover Amen Bank',
      ctaDesc: 'Explore the banking universe of our group.',
      ctaBtn: 'Visit Amen Bank',
    },
    ar: {
      hero: {
        badge: 'مجموعة أمين',
        title: 'شريك متميز عبر الزمن',
        sub: '60 شركة، 6 قطاعات نشاط.',
      },
      overview: {
        title: 'فاعل اقتصادي رئيسي',
        desc: 'تضم مجموعة أمين اليوم نحو ستين شركة تسيطر عليها شركة أم، وهي PGI القابضة. يتجاوز رقم معاملات مجموعة أمين 1,5 مليار دينار تونسي، يتحقق جزء منه على المستوى الدولي، وهو محور استراتيجي للتطور. تشغّل مجموعة أمين حوالي 4000 شخص، وتشتهر بأخلاقياتها وجديتها ومتانتها المالية ورغبتها في بناء علاقات طويلة الأمد مع شركائها وعملائها.',
        stats: [
          { value: '60', label: 'شركة' },
          { value: '6', label: 'قطاعات' },
          { value: '1,5 مليار', label: 'دينار رقم معاملات' },
          { value: '4000', label: 'موظف' },
        ],
      },
      polesTitle: 'قطاعات النشاط الستة',
      poles: [
        {
          icon: Wheat,
          title: 'قطاع الصناعات الغذائية',
          desc: 'تسع شركات، من بينها مقاهي بن يدر، أول شركة للمجموعة (1934)، ومقاهي بوندان (المستحوذ عليها سنة 1964)، وكواريس، شركة الاستثمار والتنمية الفلاحية التي أُنشئت سنة 1993.',
          brands: ['مقاهي بوندان', 'سيكافي', 'G.F.C.O.', 'معصرة بن يدر', 'مقاهي بن يدر', 'الجنرال الغذائية', 'كواريس'],
        },
        {
          icon: Hotel,
          title: 'قطاع الفندقة',
          desc: 'ثلاثة فنادق: فندق الماجستيك، الذي بُني بتونس سنة 1911، وفندق دار سعيد بسيدي بوسعيد، وفندق تونيزيا بالاس قرب المدينة العتيقة، إلى جانب مطعم دار زروق ذي الثلاث شوكات.',
          brands: ['فندق الماجستيك', 'دار سعيد', 'تونيزيا بالاس', 'دار زروق'],
        },
        {
          icon: Landmark,
          title: 'قطاع البنوك',
          desc: 'ثماني شركات مالية، من بينها بنك آمن، أمين إنفست، أمين كابيتال، سيكار أمين، أمين بروجيكت، سوجيرك، لو ركوفرمون، وتونيزيس.',
          brands: ['بنك آمن', 'أمين إنفست', 'أمين كابيتال', 'أمين بروجيكت', 'سيكار أمين', 'تونيزيس'],
        },
        {
          icon: ShieldPlus,
          title: 'قطاع التأمين والصحة',
          desc: 'خمس شركات، من بينها شركتا التأمين كومار وحياة، وست عيادات (المنزه السادس، المرسى، قفصة، باجة، نابل وبنزرت) تديرها شركة أمين الصحة، التي أُنشئت سنة 2009.',
          brands: ['كومار', 'حياة', 'أمين الصحة'],
        },
        {
          icon: Briefcase,
          title: 'قطاع الخدمات المالية المتخصصة',
          desc: 'خمس شركات، من بينها تونيزي ليزينغ، الرائدة في التأجير التمويلي بتونس، ومغرب ليزينغ الجزائر، وتونيزي فاكتورينغ، وتونيزي LLD، وأليوس الحاضرة في أفريقيا منذ 1956.',
          brands: ['تونيزي ليزينغ', 'مغرب ليزينغ', 'تونيزي فاكتورينغ', 'تونيزي LLD', 'أليوس'],
        },
        {
          icon: Building2,
          title: 'قطاع تجارة معدات التجهيز',
          desc: 'أربع شركات: بارنين، التي أُسست سنة 1902، وكيل كاتربيلر وأطلس كوبكو وجون دير، وMTI فرعها الوكيل لكاتربيلر بليبيا، وAL Tractors، وسينيو تونس.',
          brands: ['بارنين', 'MTI', 'AL Tractors', 'سينيو'],
        },
        {
          icon: Truck,
          title: 'قطاع معدات النقل',
          desc: 'شركتان: إنّاكل للسيارات، موزّع مجموعة فولكسفاغن بتونس منذ 2010، وكار غروس، فرع تابع لإنّاكل للسيارات أُنشئ سنة 2007.',
          brands: ['إنّاكل', 'كار غروس'],
        },
      ],
      historyTitle: 'أكثر من قرن من التاريخ',
      historyDesc: 'من جذورها الفلاحية والغذائية إلى مجموعة متعددة التخصصات، اكتشفوا المحطات الرئيسية في تطور مجموعة أمين، التي أسسها الراحل إبراهيم بن يدر.',
      timeline: [
        { year: '1934', event: 'إنشاء شركة مقاهي بن يدر، المتخصصة في تحميص وتوزيع القهوة بتونس.' },
        { year: '1957', event: 'الاستحواذ على \u201cالمصنع الكبير للحلويات الشرقية\u201d (G.F.C.O.)، المُصنّعة والموزّعة للحلوى الشامية.' },
        { year: '1961', event: 'إنشاء معصرة بن يدر، الشركة الرائدة في استخراج وتسويق زيت الزيتون.' },
        { year: '1971', event: 'الاستحواذ على \u201cالائتمان العقاري والتجاري لتونس\u201d (C.F.C.T.)، التي ستُسمّى بنك آمن سنة 1995.' },
        { year: '1973', event: 'الاستحواذ على شركة التأمين كومار (الشركة المتوسطية للتأمين وإعادة التأمين).' },
        { year: '1977', event: 'الاستحواذ على شركة بارنين، التي أُسست سنة 1902، وكيل كاتربيلر وجون دير وأطلس كوبكو.' },
        { year: '2005', event: 'تأسيس شركة مغرب ليزينغ الجزائر، مما يعزز مكانة مجموعة أمين في القطاع المالي الجهوي.' },
        { year: '2012', event: 'الاستحواذ على غالبية رأس مال شركة إنّاكل، موزّع مجموعة فولكسفاغن بتونس.' },
        { year: '2015', event: 'التوسع نحو أفريقيا جنوب الصحراء عبر الاستحواذ على شركة أليوس فينانس.' },
      ],
      takeoff: {
        badge: 'مجموعة أمين',
        title: 'سنوات الألفين... الانطلاق',
        desc: 'سمحت المساهمة الأغلبية في مجموعة تونيزي ليزينغ لمجموعة أمين بتعزيز مكانتها كفاعل رائد في القطاع المالي بتونس ثم بالجزائر، من خلال تأسيس شركة مغرب ليزينغ الجزائر سنة 2005. وفي 2012، استحوذت مجموعة أمين، بالتشارك مع مجموعة بولينا القابضة، على غالبية رأس مال شركة إنّاكل، موزّع مجموعة فولكسفاغن بتونس منذ 1965. وفي 2015، توسعت مجموعة أمين نحو أفريقيا جنوب الصحراء عبر الاستحواذ على شركة أليوس فينانس.',
      },
      mgmtTitle: 'الإدارة العامة لـ PGI القابضة',
      mgmt: [
        { name: 'السيد كريم بن يدر', role: 'رئيس مجلس الإدارة - المدير العام' },
        { name: 'السيدة سلمى بابو', role: 'نائب المدير العام' },
        { name: 'السيد كمال التليلي', role: 'مستشار' },
      ],
      ctaTitle: 'اكتشف بنك آمن',
      ctaDesc: 'استكشف عالم البنوك لمجموعتنا.',
      ctaBtn: 'زيارة بنك آمن',
    },
  };

  const t = content[l];

  return (
    <main className="min-h-screen" dir={isRTL ? 'rtl' : 'ltr'} style={{ background: '#f8fafc' }}>

      {/* Hero Section */}
      <section className="section" style={{ background: '#0f172a' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '48rem', margin: '0 auto' }}>
            <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>
              {t.hero.badge}
            </span>
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, color: '#ffffff', marginBottom: '1.25rem', lineHeight: 1.15 }}>
              {t.hero.title}
            </h1>
            <p style={{ fontSize: '1.125rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, margin: 0 }}>
              {t.hero.sub}
            </p>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="section-sm" style={{ background: '#ffffff' }}>
        <div className="container">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>{t.overview.title}</h2>
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              {t.overview.stats.map((stat, idx) => (
                <div key={idx} style={{ background: '#f8fafc', padding: '1.5rem 2rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', minWidth: '8rem' }}>
                  <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#006B3C' }}>{stat.value}</div>
                  <div style={{ color: '#64748b', fontSize: '0.875rem' }}>{stat.label}</div>
                </div>
              ))}
            </div>
            <p style={{ maxWidth: '52rem', color: '#64748b', lineHeight: 1.7, marginTop: '0.5rem', fontSize: '1.0625rem' }}>{t.overview.desc}</p>
          </div>
        </div>
      </section>

      {/* Business Poles */}
      <section className="section" style={{ background: '#f8fafc' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '42rem', margin: '0 auto 4rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>{t.polesTitle}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {t.poles.map((pole, idx) => {
              const Icon = pole.icon;
              return (
                <div key={idx} className="card flex flex-col h-full" style={{ borderTop: '4px solid #003DA5' }}>
                  <div style={{ width: '3rem', height: '3rem', borderRadius: '0.5rem', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                    <Icon size={24} style={{ color: '#003DA5' }} />
                  </div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.75rem', textAlign: isRTL ? 'right' : 'left' }}>
                    {pole.title}
                  </h3>
                  <p style={{ color: '#64748b', fontSize: '0.9375rem', lineHeight: 1.65, textAlign: isRTL ? 'right' : 'left', margin: 0, marginBottom: '1rem' }}>
                    {pole.desc}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: 'auto' }}>
                    {pole.brands.map((brand, bIdx) => (
                      <span
                        key={bIdx}
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          color: '#003DA5',
                          background: '#eff6ff',
                          padding: '0.25rem 0.625rem',
                          borderRadius: '999px',
                        }}
                      >
                        {brand}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* History Timeline */}
      <section className="section" style={{ background: '#ffffff' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '42rem', margin: '0 auto 4rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>{t.historyTitle}</h2>
            <p style={{ color: '#64748b', lineHeight: 1.7, margin: 0 }}>{t.historyDesc}</p>
          </div>

          <div style={{ maxWidth: '48rem', margin: '0 auto' }}>
            {t.timeline.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem', position: 'relative' }}>
                {/* Line */}
                {idx !== t.timeline.length - 1 && (
                  <div style={{ position: 'absolute', left: isRTL ? 'auto' : '1.25rem', right: isRTL ? '1.25rem' : 'auto', top: '2.5rem', bottom: '-0.5rem', width: '2px', background: '#e2e8f0' }}></div>
                )}

                {/* Dot */}
                <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', background: '#006B3C', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.65rem', flexShrink: 0, zIndex: 1, textAlign: 'center' }}>
                  {item.year}
                </div>

                {/* Content */}
                <div style={{ background: '#f8fafc', padding: '1.25rem 1.5rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', flex: 1 }}>
                  <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem', textAlign: isRTL ? 'right' : 'left' }}>{item.year}</div>
                  <div style={{ color: '#64748b', fontSize: '0.9375rem', textAlign: isRTL ? 'right' : 'left' }}>{item.event}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Take-off (2000s expansion) */}
      <section className="section-sm" style={{ background: '#006B3C' }}>
        <div className="container">
          <div style={{ maxWidth: '48rem', margin: '0 auto', textAlign: isRTL ? 'right' : 'left' }}>
            <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
              {t.takeoff.badge}
            </span>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#ffffff', marginBottom: '1rem' }}>{t.takeoff.title}</h2>
            <p style={{ color: 'rgba(255,255,255,0.85)', lineHeight: 1.75, margin: 0 }}>{t.takeoff.desc}</p>
          </div>
        </div>
      </section>

      {/* Management */}
      <section className="section" style={{ background: '#f8fafc' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '42rem', margin: '0 auto 4rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>{t.mgmtTitle}</h2>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {t.mgmt.map((member, idx) => (
              <div key={idx} className="card text-center" style={{ minWidth: '16rem', maxWidth: '18rem' }}>
                <div style={{ width: '4rem', height: '4rem', borderRadius: '50%', background: '#e2e8f0', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {idx === 0 ? <Briefcase size={24} style={{ color: '#64748b' }} /> : <Users size={24} style={{ color: '#64748b' }} />}
                </div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>{member.name}</h3>
                <p style={{ color: '#006B3C', fontSize: '0.875rem', fontWeight: 600 }}>{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-sm" style={{ background: '#0f172a' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '40rem', margin: '0 auto' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#ffffff', marginBottom: '1rem' }}>{t.ctaTitle}</h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '2rem' }}>{t.ctaDesc}</p>
            <Link
              href={`/${lang}/particuliers`}
              className="btn btn-white btn-lg inline-flex"
              style={{ color: '#0f172a', textDecoration: 'none' }}
            >
              {t.ctaBtn}
              <ArrowRight size={18} className={`ml-2 ${isRTL ? 'rotate-180 mr-2 ml-0' : ''}`} />
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}