import ActualitesList, { Article } from '@/components/ActualitesList';

type Language = 'fr' | 'ar' | 'en';

export function generateStaticParams() {
  return [{ lang: 'fr' }, { lang: 'en' }, { lang: 'ar' }];
}

export const metadata = {
  title: 'Actualités - Amen Bank',
  description: "Dernières actualités et communiqués de presse d'Amen Bank",
};

export default async function ActualitesPage({
  params,
}: {
  params: Promise<{ lang: Language }>;
}) {
  const { lang } = await params;
  const isRTL = lang === 'ar';

  const content: Record<
    Language,
    {
      label: string;
      title: string;
      subtitle: string;
      readMore: string;
      close: string;
      articles: Article[];
    }
  > = {
    fr: {
      label: 'Actualités',
      title: 'Actualités',
      subtitle: "Restez informé des dernières nouvelles d'Amen Bank",
      readMore: 'Lire plus',
      close: 'Fermer',
      articles: [
        {
          date: '1 Mai 2026',
          title: "Assemblée Générale d'AMEN BANK : solidité confirmée",
          excerpt: "L'Assemblée Générale Ordinaire d'AMEN BANK a passé en revue les performances de l'exercice 2025, confirmant la solidité financière de la banque au service d'une croissance durable.",
          body: [
            "L'Assemblée Générale Ordinaire d'AMEN BANK, réunie le 30 avril 2026 à son siège, a passé en revue les performances de l'exercice 2025 avec une forte présence des actionnaires. Au total, 158 participants étaient présents ou représentés, détenant 25,7 millions d'actions, soit 71,98% du capital, un niveau de quorum largement au-dessus des exigences réglementaires.",
            "Sans surprise, les commissaires aux comptes ont validé les états financiers arrêtés au 31 décembre 2025, confirmant leur conformité aux normes en vigueur. Aucun manquement notable n'a été relevé, ni sur le plan du contrôle interne ni en matière de règles comptables ou prudentielles.",
            "Sur le plan opérationnel, la banque affiche des indicateurs en progression. Les dépôts de la clientèle ont atteint 8 720,4 millions de dinars, en hausse de 8,79% par rapport à 2024, tirés principalement par la dynamique des dépôts à vue et de l'épargne.",
          ],
          category: 'Gouvernance',
          icon: 'governance',
        },
        {
          date: '22 Avr 2026',
          title: "Le PNB d'Amen Bank bondit de 13% à fin mars",
          excerpt: "Au premier trimestre 2026, AMEN BANK affiche un Produit Net Bancaire en forte progression, porté par la dynamique des activités de marché et des commissions.",
          body: [
            "Amen Bank livre, au premier trimestre 2026, une performance objectivement remarquable dans l'univers bancaire tunisien. La structure du bilan révèle une politique délibérément prudente sur l'octroi de crédit : les dépôts de la clientèle progressent de 8,3% à 9 047,6 millions de dinars, tandis que les crédits n'augmentent que de 3,1% à 7 551,8 millions de dinars.",
            "Ce différentiel marqué entre collecte et crédit génère une surliquidité structurelle, que la banque choisit d'orienter vers les marchés financiers plutôt que vers des engagements de crédit jugés moins attractifs dans le contexte économique actuel.",
            "Le coefficient d'exploitation s'améliore à 36,37%, contre 38,00% un an plus tôt, soit un gain de 164 points de base en douze mois. La combinaison d'un PNB en hausse de 13,5%, d'un coefficient d'exploitation en baisse et d'une collecte dynamique dessine le profil d'une banque qui a su adapter rapidement sa stratégie.",
          ],
          category: 'Résultats',
          icon: 'results',
        },
        {
          date: '28 Mars 2026',
          title: 'Amen Bank dégage un bénéfice net de 248,7 MD en 2025',
          excerpt: "Le Conseil de Surveillance a examiné les états financiers arrêtés au 31 décembre 2025, faisant ressortir un résultat net en hausse de 8,13% par rapport à 2024.",
          body: [
            "AMEN BANK a annoncé, dans un communiqué publié le 27 mars 2026, que son Conseil de Surveillance, réuni le même jour, a examiné l'activité de l'établissement ainsi que les états financiers arrêtés au 31 décembre 2025.",
            "Les chiffres individuels font ressortir un produit net bancaire (PNB) de 590,1 millions de dinars, tandis que le résultat net de l'exercice s'est établi à 248,7 millions de dinars, enregistrant une progression de 8,13% par rapport à l'exercice 2024.",
            "Tenant compte du résultat réalisé, les capitaux propres ont atteint 1 707,4 millions de dinars à fin 2025. Sur le plan prudentiel, la banque affiche des ratios largement supérieurs aux exigences réglementaires : le ratio de capital s'est établi à 16,85%, contre un minimum réglementaire de 10%, tandis que le ratio Tier I a atteint 12,47%, au-dessus du seuil minimum fixé à 7%.",
          ],
          category: 'Résultats',
          icon: 'profit',
        },
        {
          date: '24 Mars 2026',
          title: 'Amen Bank lève 60 millions de dinars sur le marché obligataire',
          excerpt: "AMEN BANK a réussi le placement de son emprunt obligataire subordonné de 60 millions de dinars en une seule journée de souscription.",
          body: [
            "AMEN BANK a réussi le placement intégral de son emprunt obligataire subordonné de 60 millions de dinars en une seule journée de souscription, confirmant la confiance des investisseurs institutionnels et particuliers dans la signature de la banque.",
            "Cette opération s'inscrit dans la stratégie de diversification des sources de financement de la banque et vient renforcer ses fonds propres complémentaires dans un contexte de croissance soutenue de l'activité de crédit.",
          ],
          category: 'Marchés',
          icon: 'markets',
        },
        {
          date: '12 Fév 2026',
          title: 'Amen Bank publie son Reporting ESG',
          excerpt: "Dans le cadre de sa démarche de Responsabilité Sociétale, AMEN BANK met à disposition son rapport sur les enjeux Environnementaux, Sociaux et de Gouvernance.",
          body: [
            "Dans le cadre de sa démarche de Responsabilité Sociétale des Entreprises (RSE), AMEN BANK met à la disposition de ses parties prenantes son Reporting ESG, détaillant ses engagements et réalisations en matière environnementale, sociale et de gouvernance.",
            "La banque s'affirme comme un acteur de référence du financement de la transition énergétique en Tunisie, avec plusieurs dizaines de projets financés et une part de marché significative dans le secteur du photovoltaïque.",
          ],
          category: 'RSE',
          icon: 'esg',
        },
        {
          date: '1 Oct 2024',
          title: 'Carte Visa Infinite — Nationale & Internationale',
          excerpt: "Décollez en toute sérénité avec AMEN BANK grâce à la nouvelle Carte Visa Infinite, nationale et internationale.",
          body: [
            "À partir du 1er octobre 2024, décollez en toute sérénité avec AMEN BANK. Grâce à la carte Visa Infinite Nationale et Internationale, profitez d'avantages exclusifs : assurance voyage, accès aux salons VIP dans les aéroports du monde entier, et plafonds de paiement et de retrait élevés.",
            "Cette carte haut de gamme s'adresse à une clientèle exigeante recherchant flexibilité, sécurité et services premium au quotidien comme à l'international.",
          ],
          category: 'Produits',
          icon: 'card',
        },
        {
          date: '1 Sep 2024',
          title: 'Offre exceptionnelle crédit immobilier',
          excerpt: "Boostez vos projets immobiliers avec AMEN BANK ! Profitez de conditions exceptionnelles sur les Crédits Habitat.",
          body: [
            "Boostez vos projets immobiliers avec AMEN BANK ! Du 1er septembre au 31 décembre 2024, profitez de conditions exceptionnelles sur nos Crédits Habitat : taux préférentiels, frais de dossier réduits et accompagnement personnalisé tout au long de votre projet.",
            "Cette offre s'adresse aussi bien aux primo-accédants qu'aux clients souhaitant investir dans l'immobilier locatif.",
          ],
          category: 'Produits',
          icon: 'home',
        },
        {
          date: '10 Jan 2024',
          title: 'AmenPay — Application de mobile payment',
          excerpt: "AMEN BANK met à votre disposition son application de mobile payment AmenPay. Payez en toute simplicité.",
          body: [
            "AMEN BANK met à votre disposition son application de mobile payment AmenPay, ainsi que toute sa panoplie de cartes bancaires, pour régler vos achats en toute simplicité, où que vous soyez.",
            "AmenPay permet d'effectuer des paiements instantanés, des transferts d'argent et des recharges téléphoniques, avec une sécurité renforcée grâce à l'authentification biométrique.",
          ],
          category: 'Innovation',
          icon: 'mobile',
        },
        {
          date: '5 Dec 2023',
          title: 'First Pay obtient son agrément BCT',
          excerpt: 'First Pay a obtenu son agrément officiel de la Banque Centrale de Tunisie (BCT) en tant qu\u2019établissement de paiement.',
          body: [
            "« First Pay » a le plaisir d'annoncer l'obtention de son agrément officiel de la Banque Centrale de Tunisie (BCT) en tant qu'établissement de paiement, une étape clé dans sa stratégie de développement des services financiers digitaux en Tunisie.",
            "Cet agrément permettra à First Pay de proposer une gamme élargie de solutions de paiement innovantes à destination des particuliers et des entreprises.",
          ],
          category: 'Expansion',
          icon: 'approval',
        },
        {
          date: '1 Jun 2023',
          title: 'Rapport Annuel 2023',
          excerpt: "Consultez le Rapport Annuel 2023 d'AMEN BANK et découvrez nos performances et engagements.",
          body: [
            "Consultez le Rapport Annuel 2023 d'AMEN BANK et découvrez en détail nos performances financières, nos engagements en matière de responsabilité sociétale, ainsi que les grandes orientations stratégiques de la banque pour les années à venir.",
          ],
          category: 'Expansion',
          icon: 'report',
        },
      ],
    },
    en: {
      label: 'News',
      title: 'News',
      subtitle: 'Stay informed about the latest Amen Bank updates',
      readMore: 'Read more',
      close: 'Close',
      articles: [
        {
          date: 'May 1, 2026',
          title: 'AMEN BANK General Meeting: solidity confirmed',
          excerpt: "AMEN BANK's Ordinary General Meeting reviewed the 2025 financial year's performance, confirming the bank's financial solidity in support of sustainable growth.",
          body: [
            "AMEN BANK's Ordinary General Meeting, held on April 30, 2026 at its headquarters, reviewed the performance of the 2025 financial year with strong shareholder attendance. A total of 158 participants were present or represented, holding 25.7 million shares, or 71.98% of the capital — a quorum level well above regulatory requirements.",
            "Unsurprisingly, the statutory auditors approved the financial statements for the year ended December 31, 2025, confirming their compliance with applicable standards. No notable shortcomings were identified, whether in terms of internal controls or accounting and prudential rules.",
            "Operationally, the bank's indicators are trending upward. Customer deposits reached TND 8,720.4 million, up 8.79% compared to 2024, driven mainly by the dynamism of demand deposits and savings.",
          ],
          category: 'Governance',
          icon: 'governance',
        },
        {
          date: 'Apr 22, 2026',
          title: "Amen Bank's net banking income up 13% at end of March",
          excerpt: "In Q1 2026, AMEN BANK posted strong growth in net banking income, driven by market activities and commission income.",
          body: [
            "Amen Bank delivered an objectively remarkable performance in the Tunisian banking landscape in the first quarter of 2026. The balance sheet structure reveals a deliberately cautious lending policy: customer deposits grew 8.3% to TND 9,047.6 million, while loans increased by only 3.1% to TND 7,551.8 million.",
            "This marked gap between deposit collection and lending generates structural excess liquidity, which the bank chooses to direct toward financial markets rather than credit commitments deemed less attractive in the current economic context.",
            "The cost-to-income ratio improved to 36.37%, compared to 38.00% a year earlier — a gain of 164 basis points in twelve months. The combination of net banking income up 13.5%, a declining cost-to-income ratio, and dynamic deposit growth paints the picture of a bank that has quickly adapted its strategy.",
          ],
          category: 'Results',
          icon: 'results',
        },
        {
          date: 'Mar 28, 2026',
          title: 'Amen Bank posts net profit of TND 248.7M in 2025',
          excerpt: "The Supervisory Board reviewed the financial statements for the year ended December 31, 2025, showing net income up 8.13% year-on-year.",
          body: [
            "AMEN BANK announced, in a press release published on March 27, 2026, that its Supervisory Board, meeting that same day, reviewed the institution's activity as well as the financial statements for the year ended December 31, 2025.",
            "The standalone figures show net banking income of TND 590.1 million, while net income for the year stood at TND 248.7 million, an increase of 8.13% compared to fiscal year 2024.",
            "Taking the results into account, shareholders' equity reached TND 1,707.4 million at the end of 2025. On the prudential front, the bank's ratios remain well above regulatory requirements: the capital ratio stood at 16.85%, against a regulatory minimum of 10%, while the Tier 1 ratio reached 12.47%, above the minimum threshold of 7%.",
          ],
          category: 'Results',
          icon: 'profit',
        },
        {
          date: 'Mar 24, 2026',
          title: 'Amen Bank raises TND 60 million on the bond market',
          excerpt: "AMEN BANK successfully placed its TND 60 million subordinated bond issue in a single day of subscription.",
          body: [
            "AMEN BANK successfully placed the entirety of its TND 60 million subordinated bond issue in a single day of subscription, confirming the confidence of both institutional and retail investors in the bank's credit standing.",
            "This transaction is part of the bank's strategy to diversify its funding sources and strengthens its supplementary capital amid sustained growth in lending activity.",
          ],
          category: 'Markets',
          icon: 'markets',
        },
        {
          date: 'Feb 12, 2026',
          title: 'Amen Bank publishes its ESG Reporting',
          excerpt: "As part of its Corporate Social Responsibility approach, AMEN BANK releases its report on Environmental, Social and Governance matters.",
          body: [
            "As part of its Corporate Social Responsibility (CSR) approach, AMEN BANK is making its ESG Reporting available to stakeholders, detailing its commitments and achievements in environmental, social, and governance matters.",
            "The bank positions itself as a leading player in financing Tunisia's energy transition, having financed dozens of projects and holding a significant market share in the photovoltaic sector.",
          ],
          category: 'CSR',
          icon: 'esg',
        },
        {
          date: 'Oct 1, 2024',
          title: 'Visa Infinite Card — National & International',
          excerpt: 'Fly with complete peace of mind with AMEN BANK thanks to the new national and international Visa Infinite Card.',
          body: [
            "Starting October 1, 2024, fly with complete peace of mind with AMEN BANK. With the national and international Visa Infinite Card, enjoy exclusive benefits: travel insurance, access to VIP airport lounges worldwide, and high payment and withdrawal limits.",
            "This premium card is aimed at a discerning clientele seeking flexibility, security, and premium service both at home and abroad.",
          ],
          category: 'Products',
          icon: 'card',
        },
        {
          date: 'Sep 1, 2024',
          title: 'Exceptional home loan offer',
          excerpt: 'Boost your real estate projects with AMEN BANK! Enjoy exceptional conditions on Home Loans.',
          body: [
            "Boost your real estate projects with AMEN BANK! From September 1 to December 31, 2024, enjoy exceptional conditions on our Home Loans: preferential rates, reduced processing fees, and personalized support throughout your project.",
            "This offer is aimed at both first-time buyers and clients looking to invest in rental property.",
          ],
          category: 'Products',
          icon: 'home',
        },
        {
          date: 'Jan 10, 2024',
          title: 'AmenPay — Mobile Payment App',
          excerpt: "AMEN BANK makes its mobile payment application AmenPay available to you. Pay with complete ease.",
          body: [
            "AMEN BANK makes its mobile payment application AmenPay, along with its full range of bank cards, available to you to pay for your purchases with complete ease, wherever you are.",
            "AmenPay enables instant payments, money transfers, and phone top-ups, with enhanced security through biometric authentication.",
          ],
          category: 'Innovation',
          icon: 'mobile',
        },
        {
          date: 'Dec 5, 2023',
          title: 'First Pay obtains BCT approval',
          excerpt: 'First Pay has obtained its official approval from the Central Bank of Tunisia (BCT) as a payment institution.',
          body: [
            "\u201cFirst Pay\u201d is pleased to announce that it has obtained official approval from the Central Bank of Tunisia (BCT) as a payment institution, a key milestone in its strategy to develop digital financial services in Tunisia.",
            "This approval will allow First Pay to offer an expanded range of innovative payment solutions for individuals and businesses.",
          ],
          category: 'Expansion',
          icon: 'approval',
        },
        {
          date: 'Jun 1, 2023',
          title: 'Annual Report 2023',
          excerpt: "Consult AMEN BANK's 2023 Annual Report and discover our performance and commitments.",
          body: [
            "Consult AMEN BANK's 2023 Annual Report and discover in detail our financial performance, our corporate social responsibility commitments, and the bank's key strategic priorities for the years ahead.",
          ],
          category: 'Expansion',
          icon: 'report',
        },
      ],
    },
    ar: {
      label: 'الأخبار',
      title: 'الأخبار',
      subtitle: 'ابق على اطلاع بآخر أخبار بنك آمن',
      readMore: 'اقرأ المزيد',
      close: 'إغلاق',
      articles: [
        {
          date: '1 ماي 2026',
          title: 'الجمعية العامة لبنك آمن: متانة مؤكدة',
          excerpt: 'استعرضت الجمعية العامة العادية لبنك آمن أداء السنة المالية 2025، مؤكدة المتانة المالية للبنك خدمةً لنمو مستدام.',
          body: [
            'استعرضت الجمعية العامة العادية لبنك آمن، المنعقدة في 30 أفريل 2026 بمقره، أداء السنة المالية 2025 بحضور قوي للمساهمين. شارك في الجلسة أو كان ممثلاً فيها 158 مشاركاً، يملكون 25,7 مليون سهم، أي 71,98% من رأس المال، وهو مستوى نصاب يتجاوز بكثير المتطلبات التنظيمية.',
            'دون مفاجأة، صادق مراقبو الحسابات على القوائم المالية المختومة في 31 ديسمبر 2025، مؤكدين مطابقتها للمعايير المعمول بها، دون رصد أي إخلال يُذكر، سواء على مستوى الرقابة الداخلية أو القواعد المحاسبية والاحترازية.',
            'على المستوى التشغيلي، يُظهر البنك مؤشرات في تطور. بلغت ودائع الزبائن 8 720,4 مليون دينار، بارتفاع 8,79% مقارنة بسنة 2024، مدفوعة أساساً بدينامية ودائع تحت الطلب والادخار.',
          ],
          category: 'الحوكمة',
          icon: 'governance',
        },
        {
          date: '22 أفريل 2026',
          title: 'الناتج المصرفي الصافي لبنك آمن يقفز بـ13% إلى نهاية مارس',
          excerpt: 'سجل بنك آمن في الثلاثية الأولى من 2026 ارتفاعاً قوياً في الناتج المصرفي الصافي، مدفوعاً بنشاط الأسواق والعمولات.',
          body: [
            'يقدم بنك آمن، في الثلاثية الأولى من 2026، أداءً لافتاً بكل المقاييس في المجال المصرفي التونسي. يكشف هيكل الميزانية عن سياسة حذرة فيما يتعلق بمنح القروض: تتطور ودائع الزبائن بنسبة 8,3% إلى 9 047,6 مليون دينار، في حين لا تتطور القروض إلا بنسبة 3,1% إلى 7 551,8 مليون دينار.',
            'هذا التفاوت الملحوظ بين جمع الودائع ومنح القروض يولّد سيولة فائضة هيكلية، يختار البنك توجيهها نحو الأسواق المالية بدلاً من الالتزامات القروضية التي تُعتبر أقل جاذبية في السياق الاقتصادي الحالي.',
            'تحسّن مردود الاستغلال إلى 36,37%، مقارنة بـ38,00% قبل سنة، أي مكسب 164 نقطة أساس في اثني عشر شهراً. يعكس هذا الجمع بين ارتفاع الناتج المصرفي الصافي بنسبة 13,5% وتراجع مردود الاستغلال ودينامية جمع الودائع، صورة بنك تمكّن من تكييف استراتيجيته بسرعة.',
          ],
          category: 'النتائج',
          icon: 'results',
        },
        {
          date: '28 مارس 2026',
          title: 'بنك آمن يحقق ربحاً صافياً بـ248,7 مليون دينار في 2025',
          excerpt: 'راجع مجلس المراقبة القوائم المالية المختومة في 31 ديسمبر 2025، والتي أظهرت نتيجة صافية في ارتفاع بنسبة 8,13% مقارنة بسنة 2024.',
          body: [
            'أعلن بنك آمن، في بلاغ نُشر في 27 مارس 2026، أن مجلس المراقبة، المنعقد في نفس اليوم، راجع نشاط المؤسسة وكذلك القوائم المالية المختومة في 31 ديسمبر 2025.',
            'تُظهر الأرقام الفردية ناتجاً مصرفياً صافياً بـ590,1 مليون دينار، في حين بلغت النتيجة الصافية للسنة المالية 248,7 مليون دينار، بتطور نسبته 8,13% مقارنة بالسنة المالية 2024.',
            'باعتبار النتيجة المحققة، بلغت الأموال الذاتية 1 707,4 مليون دينار في نهاية 2025. وعلى المستوى الاحترازي، تُظهر نسب البنك مستويات تتجاوز بكثير المتطلبات التنظيمية: بلغت نسبة رأس المال 16,85%، في حين الحد الأدنى التنظيمي هو 10%، كما بلغت نسبة الشريحة الأولى 12,47%، فوق الحد الأدنى المحدد بـ7%.',
          ],
          category: 'النتائج',
          icon: 'profit',
        },
        {
          date: '24 مارس 2026',
          title: 'بنك آمن يجمع 60 مليون دينار في السوق المالي',
          excerpt: 'نجح بنك آمن في طرح قرضه السندي المساند بقيمة 60 مليون دينار في يوم واحد من الاكتتاب.',
          body: [
            'نجح بنك آمن في طرح كامل قرضه السندي المساند بقيمة 60 مليون دينار في يوم واحد فقط من الاكتتاب، مؤكداً ثقة المستثمرين المؤسساتيين والأفراد في توقيع البنك.',
            'تندرج هذه العملية في إطار استراتيجية البنك لتنويع مصادر التمويل، وتعزز أمواله الذاتية التكميلية في سياق نمو مستدام لنشاط القروض.',
          ],
          category: 'الأسواق',
          icon: 'markets',
        },
        {
          date: '12 فيفري 2026',
          title: 'بنك آمن ينشر تقريره حول المعايير البيئية والاجتماعية والحوكمة',
          excerpt: 'في إطار مقاربته للمسؤولية المجتمعية، يضع بنك آمن على ذمة الجميع تقريره حول القضايا البيئية والاجتماعية وحوكمة الشركات.',
          body: [
            'في إطار مقاربته للمسؤولية المجتمعية للشركات، يضع بنك آمن على ذمة أصحاب المصلحة تقريره حول المعايير البيئية والاجتماعية وحوكمة الشركات، الذي يفصّل التزاماته وإنجازاته في هذه المجالات.',
            'يؤكد البنك مكانته كفاعل مرجعي في تمويل التحول الطاقي بتونس، بعد تمويله لعشرات المشاريع وحصوله على نصيب سوقي معتبر في قطاع الطاقة الشمسية الكهروضوئية.',
          ],
          category: 'المسؤولية المجتمعية',
          icon: 'esg',
        },
        {
          date: '1 أكتوبر 2024',
          title: 'بطاقة Visa Infinite — وطنية ودولية',
          excerpt: 'انطلق بكل راحة مع بنك آمن بفضل بطاقة Visa Infinite الجديدة، الوطنية والدولية.',
          body: [
            'ابتداءً من 1 أكتوبر 2024، انطلق بكل راحة مع بنك آمن. بفضل بطاقة Visa Infinite الوطنية والدولية، استفد من مزايا حصرية: تأمين على السفر، الوصول إلى صالات كبار الزوار في مطارات العالم، وسقوف دفع وسحب مرتفعة.',
            'تستهدف هذه البطاقة الراقية حرفاء يبحثون عن المرونة والأمان والخدمات المتميزة سواء داخل تونس أو خارجها.',
          ],
          category: 'منتجات',
          icon: 'card',
        },
        {
          date: '1 سبتمبر 2024',
          title: 'عرض استثنائي للقروض العقارية',
          excerpt: 'عزز مشاريعك العقارية مع بنك آمن! استفد من شروط استثنائية على القروض السكنية.',
          body: [
            'عزز مشاريعك العقارية مع بنك آمن! من 1 سبتمبر إلى 31 ديسمبر 2024، استفد من شروط استثنائية على قروضنا السكنية: نسب تفضيلية، مصاريف ملف مخفضة، ومرافقة شخصية طوال مدة مشروعك.',
            'يستهدف هذا العرض المقتنين لأول مرة وكذلك الحرفاء الراغبين في الاستثمار في العقارات المعدّة للإيجار.',
          ],
          category: 'منتجات',
          icon: 'home',
        },
        {
          date: '10 جانفي 2024',
          title: 'AmenPay — تطبيق الدفع المحمول',
          excerpt: 'يضع بنك آمن تحت تصرفك تطبيق الدفع المحمول AmenPay. ادفع بكل سهولة.',
          body: [
            'يضع بنك آمن تحت تصرفك تطبيق الدفع المحمول AmenPay، إلى جانب كامل تشكيلة بطاقاته البنكية، لتسديد مشترياتك بكل سهولة، أينما كنت.',
            'يتيح AmenPay إجراء عمليات دفع فورية وتحويلات مالية وإعادة شحن الهاتف، مع أمان معزز بفضل المصادقة البيومترية.',
          ],
          category: 'ابتكار',
          icon: 'mobile',
        },
        {
          date: '5 ديسمبر 2023',
          title: 'First Pay يحصل على اعتماد البنك المركزي',
          excerpt: 'حصلت First Pay على اعتمادها الرسمي من البنك المركزي التونسي كمؤسسة دفع.',
          body: [
            'يسرّ "First Pay" أن تعلن عن حصولها على الاعتماد الرسمي من البنك المركزي التونسي كمؤسسة دفع، وهي محطة أساسية في استراتيجيتها لتطوير الخدمات المالية الرقمية بتونس.',
            'سيسمح هذا الاعتماد لـ First Pay بتقديم تشكيلة موسّعة من حلول الدفع المبتكرة الموجهة للأفراد والمؤسسات.',
          ],
          category: 'توسع',
          icon: 'approval',
        },
        {
          date: '1 جوان 2023',
          title: 'التقرير السنوي 2023',
          excerpt: 'اطلع على التقرير السنوي لبنك آمن لعام 2023 واكتشف أداءنا والتزاماتنا.',
          body: [
            'اطلع على التقرير السنوي لبنك آمن لعام 2023 واكتشف بالتفصيل أداءنا المالي، التزاماتنا في مجال المسؤولية المجتمعية للشركات، والتوجهات الاستراتيجية الكبرى للبنك للسنوات القادمة.',
          ],
          category: 'توسع',
          icon: 'report',
        },
      ],
    },
  };

  const d = content[lang];

  return (
    <div className="min-h-screen" dir={isRTL ? 'rtl' : 'ltr'}>

      {/* ── HERO BAND ── */}
      <section className="section-sm" style={{ background: '#0f172a' }}>
        <div className="container">
          <span
            className="section-badge"
            style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '1rem', display: 'block' }}
          >
            Amen Bank · {d.label}
          </span>
          <h1 className="text-4xl md:text-5xl text-white mt-2 mb-4" style={{ fontWeight: 700, lineHeight: 1.15 }}>
            {d.title}
          </h1>
          <p className="text-lg max-w-2xl leading-relaxed" style={{ color: '#94a3b8' }}>
            {d.subtitle}
          </p>
        </div>
      </section>

      {/* ── ARTICLES LIST (client component handles click-to-expand) ── */}
      <section className="section" style={{ background: '#f8fafc' }}>
        <div className="container">
          <ActualitesList
            lang={lang}
            isRTL={isRTL}
            readMore={d.readMore}
            closeLabel={d.close}
            articles={d.articles}
          />
        </div>
      </section>

    </div>
  );
}