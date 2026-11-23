/* MCHD IT — shared content. All strings are verbatim from the live site.
   Fields left null are not visible in the material supplied so far; the UI hides them until filled.
   Detail text (overview / whatWeDo / tools / projects) is transcribed verbatim from the live inner pages
   ("Lead content.png", "EDC content.png", "Mapping listing content.png", "Active survellence content.png").
   projects: [{ name, text }] renders as the "Selected projects" chapter. */
window.MCHD_DATA = (() => {
  const ICONS = {
    survey: '<circle cx="10.5" cy="10.5" r="7"/><path d="m21 21-5.5-5.5M7.5 12.5v-1.5M10.5 12.5V8M13.5 12.5V10"/>',
    edc: '<rect x="5" y="2" width="14" height="20" rx="2.5"/><path d="M11 18h2"/>',
    map: '<path d="M3 6.5 9 4l6 2.5L21 4v13.5L15 20l-6-2.5L3 20z"/><path d="M9 4v13.5M15 6.5V20"/>',
    surveil: '<path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/><circle cx="12" cy="10" r="2.5"/><path d="M7.5 17a4.5 4.5 0 0 1 9 0"/>',
    biobank: '<path d="M9 2v15.5a3 3 0 0 1-6 0V2M21 2v15.5a3 3 0 0 1-6 0V2M2 2h8M14 2h8M3 11h6M15 11h6"/>',
    lims: '<path d="M9 3h6M10 3v6.5L4.6 18.8A1.5 1.5 0 0 0 5.9 21h12.2a1.5 1.5 0 0 0 1.3-2.2L14 9.5V3M7 15h10"/>',
    opd: '<rect x="3" y="4" width="10" height="16" rx="2"/><path d="M8 9v4M6 11h4"/><circle cx="17.5" cy="9" r="2.5"/><path d="M14 19a3.5 3.5 0 0 1 7 0"/>',
    dash: '<path d="M21 12A9 9 0 1 1 12 3v9z"/><path d="M15 3.4A9 9 0 0 1 20.6 9H15z"/>',
    mel: '<path d="M3 3v18h18"/><path d="m7 15 4-4 3 3 6-6"/><path d="M16 8h4v4"/>',
    security: '<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/><path d="m9 12 2 2 4-4"/>',
    api: '<path d="M9 2v5M15 2v5M6 7h12v4a6 6 0 0 1-12 0zM12 17v5"/>',
    ict: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4M7 12l3-3 2 2 4-4"/>'
  };

  const EXPERTISE = [
    {
      slug: 'national-surveys', images: ['assets/img/expertise/national-surveys.jpg'], key: 'survey',
      title: 'Lead, Technical Operations (National Surveys)',
      text: 'Comprehensive technical support and data monitoring for nationally representative surveys, including the Bangladesh Health Facility Survey and Bangladesh Maternal Mortality Survey.',
      overview: [
        'National surveys like the Bangladesh Health Facility Survey (BHFS) and the Bangladesh Maternal Mortality Survey (BMMS) send interview teams to every corner of the country at the same time. The results shape national health policy for years, so the data has to be right the first time.',
        "We lead the technical side of these surveys. We turn the questionnaires into data collection apps for interviewers' tablets, with skip patterns and checks built in, so many errors are caught during the interview itself.",
        'While the survey is running, we build dashboards that show what is happening in the field each day. Survey managers can see how many interviews each team has finished, which areas are behind, and which records need a second look. Problems get fixed while teams are still in the area, not after they have left.'
      ],
      whatWeDo: [
        'Convert survey questionnaires into tablet-based data collection apps',
        'Build in skip logic, range checks and consistency checks',
        'Set up servers to receive data from the field every day',
        'Build dashboards to track field progress by team, district and division',
        'Monitor data quality and flag records that need follow-up',
        'Prepare clean datasets for analysis once fieldwork ends'
      ],
      tools: ['Android tablets', 'CAPI', 'ODK', 'Web dashboards', 'SQL Server']
    },
    { slug: 'electronic-data-capture', images: ['assets/img/expertise/electronic-data-capture.jpg', 'assets/img/expertise/electronic-data-capture-2.jpg'], key: 'edc', title: 'Electronic Data Capture (EDC)', text: 'Offline-first Android applications for field surveys, dietary recalls, and clinical data collection at scale.',
      overview: [
          "A lot of research data still starts on paper. Someone types it in later, and errors creep in at every step. We build Android apps so field teams enter data directly during an interview or household visit.",
          "Our apps are made for the places where research actually happens: rural areas, health facilities and homes with weak or no mobile signal. Data is saved on the device and synced to the server when a connection is available. Checks in the forms catch mistakes while the interviewer is still with the respondent.",
          "We have built EDC tools for national government programmes, multi-country surveillance and individual studies. Some are custom apps; others run on open-source platforms like ODK and REDCap, which we also host on our own servers."
  ],
      whatWeDo: [
          "Turn paper questionnaires into digital forms with skip logic and range checks",
          "Build offline-first Android apps that sync when a network is available",
          "Capture GPS points, photos and timestamps alongside survey answers",
          "Set up supervisor review so problems are fixed during data collection",
          "Host and manage ODK and REDCap servers for studies that prefer those tools",
          "Run one study or many on the same app, each with its own settings"
  ],
      projects: [
          {
                  "name": "eMIS",
                  "text": "four Android apps that replaced the paper health and family planning registers used by DGFP and DGHS field workers"
          },
          {
                  "name": "iHDSS app (CHAMPS)",
                  "text": "offline household surveillance that syncs to central servers"
          },
          {
                  "name": "Food Recall Platform",
                  "text": "dietary recall interviews across several nutrition studies"
          }
  ]
    },
    { slug: 'mapping-listing', images: ['assets/img/expertise/mapping-listing.jpg'], key: 'map', title: 'Mapping & Listing', text: 'GPS-based mapping and household listing that give surveys and surveillance an accurate sampling frame.',
      overview: [
          "A survey or surveillance site is only as good as its list of households. If structures are missed or counted twice, the sample is wrong from the start. Paper maps and handwritten listings go out of date quickly and are hard to check.",
          "We build mobile tools that let field teams walk an area, record every structure and household with a GPS point, and give each one a unique ID. Supervisors see the listing on a map as it comes in, so gaps and overlaps are spotted while the team is still in the field.",
          "The finished listing becomes the sampling frame for a survey, or the starting baseline for a surveillance site, and can be updated in later rounds."
  ],
      whatWeDo: [
          "List structures, households and members on Android, with a GPS point for each",
          "Give each structure and household a unique ID, ready for later rounds",
          "Check coverage, gaps and duplicates on supervisors' map views",
          "Draw cluster and enumeration-area boundaries for sampling",
          "Export listing data as a sampling frame or surveillance baseline"
  ],
      projects: [
          {
                  "name": "iHDSS app (CHAMPS)",
                  "text": "geographic mapping, structure listing and baseline enumeration with GPS at CHAMPS sites"
          },
          {
                  "name": "Food Recall Platform",
                  "text": "participant distribution maps that show how fieldwork is progressing"
          },
          {
                  "name": "Bangladesh Health Facility Survey (BHFS)",
                  "text": "GPS mapping and listing of health facilities across all divisions, which gave the survey its facility sampling frame"
          },
          {
                  "name": "Bangladesh Demographic and Health Survey (BDHS)",
                  "text": "Household listing with GPS in the sampled clusters across Bangladesh, which gave the survey its final household sample"
          }
  ]
    },
    { slug: 'active-surveillance', images: ['assets/img/expertise/active-surveillance.jpg'], key: 'surveil', title: 'Active Surveillance', text: 'Facilitating longitudinal population tracking and automated clinical alerting across integrated multi-site networks.',
      overview: [
          "Surveillance only works if the same people are followed, round after round, without losing track of who is who. We build the systems behind that. They register households and members, give each person a unique ID, and record pregnancies, births, deaths and migrations as they happen.",
          "Our largest work here is with CHAMPS (Child Health and Mortality Prevention Surveillance), a network in nine countries that studies why children under five die. icddr,b leads the CHAMPS HDSS Leadership Centre, and our team designs, builds and supports its core systems. Closer to home, we support the Mirzapur HDSS in Tangail, which has followed more than 300,000 people since 2007. We also support SoLiD, which tracks drowning and injuries among young children in rural Bangladesh.",
          "A large part of the job is linking records. A child’s death may be recorded in one system and their household in another. Our tools match these records by ID, or by name, parents and dates when no ID exists, and send unclear cases to a person to review."
  ],
      whatWeDo: [
          "Register households and members with unique IDs that stay with a person over time",
          "Map households with GPS and keep the map up to date as new households appear",
          "Run routine rounds that track pregnancies, births, deaths and migrations",
          "Link records across HDSS, pregnancy surveillance, MITS and verbal autopsy data",
          "Match records exactly or by weighted fuzzy scores, with manual review of unclear cases",
          "Check, harmonize and back up data from all sites in a central repository",
          "Show coverage, delays and data gaps by site on monitoring dashboards"
  ],
      projects: [
          {
                  "name": "CHAMPS HDSS Leadership Centre",
                  "text": "core surveillance systems for sites in nine countries"
          },
          {
                  "name": "Mirzapur HDSS, Tangail",
                  "text": "population surveillance since 2007 covering 316,000+ people in 81,000+ households across 156 villages. GPS-mapped households, Android data collection since 2013, and rounds every four months."
          },
          {
                  "name": "SoLiD (Saving of Lives from Drowning)",
                  "text": "a surveillance system that tracks drowning and child injury among children aged 9–47 months in seven rural sub-districts, with Johns Hopkins and CIPRB"
          },
          {
                  "name": "CHAMPS Linking System",
                  "text": "matches mortality surveillance records to HDSS members"
          }
  ]
    },
    { slug: 'bio-bank-management', images: ['assets/img/expertise/bio-bank-management.jpg'], key: 'biobank', title: 'Bio-Bank Management', text: 'End-to-end sample tracking and cold-chain monitoring integration for biological repositories.' },
    { slug: 'lims', key: 'lims', title: 'Laboratory Information Management System (LIMS)', text: 'Centralized sample management with standardized workflows and strong data integrity across the testing lifecycle.' },
    // Revealed by "Show More" on the live site
    { slug: 'outpatient-management', key: 'opd', title: 'Outpatient Management (OPD)', text: 'Streamlines patient journeys from registration to prescription while ensuring data consistency across departments.' },
    { slug: 'custom-dashboards-analytics', images: ['assets/img/expertise/custom-dashboards-analytics.jpg'], key: 'dash', title: 'Custom Dashboards & Analytics', text: 'Interactive visualization platforms with real-time KPIs, exportable reports, and multi-source data integration.' },
    { slug: 'monitoring-evaluation', images: ['assets/img/expertise/monitoring-evaluation.jpg', 'assets/img/expertise/monitoring-evaluation-2.jpg'], key: 'mel', title: 'Monitoring & Evaluation (MEL) Platforms', text: 'End-to-end web applications for MEL teams to monitor indicators, outputs, and outcomes across large-scale, multi-component projects such as RDM, EHD, and AdSEARCH.' },
    { slug: 'data-security-compliance', images: ['assets/img/expertise/data-security-compliance.jpg'], key: 'security', title: 'Data Security & Compliance', text: 'Role-based access control, audit trails, and encryption aligned with research ethics and IRB requirements.' },
    { slug: 'api-systems-integration', key: 'api', title: 'API & Systems Integration', text: 'RESTful API development and integrations with platforms such as ODK, REDCap, DHIS2, and hospital information systems.' },
    { slug: 'ict-training', images: ['assets/img/expertise/ict-training.jpg'], key: 'ict', title: 'ICT Training & Capacity Building', text: 'Training programs, SOP development, planned handovers and ongoing technical support for field teams and institutional deployments.' }
  ];


  // Team — order, names, roles and emails from the live Contact page (17 members).
  // Emails shown truncated on the live page were completed with @icddrb.org: toriqul.anam, ashraful.alam2, romana.kanta, md.zaman, mkibhuiyan, asad.zaman, atia.parvin.
  const TEAM = [
    { id: 'qazi', name: 'Qazi Sadeq-ur Rahman', role: 'Senior IT Development Specialist', email: 'qsrahman@icddrb.org', photo: 'assets/img/team/qazi.jpg' },
    { id: 'tanvir', name: 'AKM Tanvir Hossain', role: 'Analyst Programmer', email: 'thossain@icddrb.org', photo: 'assets/img/team/tanvir.jpg' },
    { id: 'shamsul', name: 'Md. Shamsul Haque', role: 'Data Manager', email: 'mshaque@icddrb.org', photo: 'assets/img/team/shamsul.jpg' },
    { id: 'jahiduj', name: 'Md. Jahiduj Jaman', role: 'Senior Programmer', email: 'mdjahiduj@icddrb.org', photo: 'assets/img/team/jahiduj.jpg' },
    { id: 'toriqul', name: 'Md. Toriqul Anam', role: 'Senior Programmer', email: 'toriqul.anam@icddrb.org', photo: 'assets/img/team/toriqul.jpg' },
    { id: 'ashraful', name: 'Md. Ashraful Alam', role: 'Programmer', email: 'ashraful.alam2@icddrb.org', photo: 'assets/img/team/ashraful.jpg' },
    { id: 'romana', name: 'Romana Parvin Kanta', role: 'Programmer (iOS)', email: 'romana.kanta@icddrb.org', photo: 'assets/img/team/romana.jpg' },
    { id: 'alamin', name: 'Md. Al-Amin', role: 'Programmer (UI/UX)', email: 'al.amin12@icddrb.org', photo: 'assets/img/team/alamin.jpg' },
    { id: 'salek', name: 'Md. Salek Mia', role: 'Programmer', email: 'salek.mia@icddrb.org', photo: 'assets/img/team/salek.jpg' },
    { id: 'ashrafuzzaman', name: 'Md. Ashrafuzzaman', role: 'Assistant Programmer', email: 'md.zaman@icddrb.org', photo: 'assets/img/team/ashrafuzzaman.jpg' },
    { id: 'saleheen', name: 'Abu Md. Saleheen', role: 'Data Management Officer', email: 'saleheen@icddrb.org', photo: 'assets/img/team/saleheen.jpg' },
    { id: 'shahidul', name: 'Md. Shahidul Alam', role: 'Senior Data Management Assistant', email: 'mshahidul@icddrb.org', photo: 'assets/img/team/shahidul.jpg' },
    { id: 'khairul', name: 'Md. Khairul Islam Bhuiyan', role: 'Senior Data Management Assistant', email: 'mkibhuiyan@icddrb.org', photo: 'assets/img/team/khairul.jpg' },
    { id: 'asaduzzaman', name: 'Md. Asaduzzaman', role: 'Senior Data Management Assistant', email: 'asad.zaman@icddrb.org', photo: 'assets/img/team/asaduzzaman.jpg' },
    { id: 'atia', name: 'Atia Parvin', role: 'Data Management Assistant', email: 'atia.parvin@icddrb.org', photo: 'assets/img/team/atia.jpg' },
    { id: 'junaed', name: 'SS Junaed Bagdadi', role: 'Senior Data Management Assistant', email: 'junaed@icddrb.org', photo: 'assets/img/team/junaed.jpg' },
    { id: 'razia', name: 'Razia Sultana', role: 'Data Management Assistant', email: 'rozi@icddrb.org', photo: 'assets/img/team/razia.jpg' }
  ];
  const TEAM_VISIBLE = 8; // contact page shows this many before "Show Team Members"

  // Contact details — verbatim from the live Contact page
  const CONTACT = {
    person: { initials: 'QR', name: 'Qazi Sadeq-ur Rahman', role: 'Senior IT Development Specialist' },
    email: 'qsrahman@icddrb.org',
    phone: '+880 1730330936',
    hours: 'Sun – Thu, 9:00 AM – 5:00 PM BST',
    org: 'MCHD IT', orgSub: 'icddr,b — Dhaka',
    generalEmail: 'qsrahman@icddrb.org',
    address: 'Mohakhali, Dhaka 1212, Bangladesh'
  };

  const href = x => `expertise.html?slug=${x.slug}`;
  return { ICONS, EXPERTISE, TEAM, TEAM_VISIBLE, CONTACT, href, XP_VISIBLE: 6 };
})();
