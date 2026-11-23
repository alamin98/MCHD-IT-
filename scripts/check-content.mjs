// Content-parity guard: every string from the live site must exist verbatim in the source.
// Run: node scripts/check-content.mjs   (exits 1 on any missing string)
import { readFileSync } from 'node:fs';

const decode = s => s.replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/&#39;|&apos;/g, "'");
const src = decode(readFileSync(new URL('../index.html', import.meta.url), 'utf8')) +
            readFileSync(new URL('../assets/js/main.js', import.meta.url), 'utf8') + readFileSync(new URL('../assets/js/data.js', import.meta.url), 'utf8');

const STRINGS = [
  // nav
  'Home', 'Technology', 'Expertise', 'Our Team', 'Global', 'Contact',
  // hero
  'Research Technology Leader', 'Transforming Research through Digital Excellence',
  'Delivering Scalable Software Solutions and Data-Driven Insights for Research Organizations',
  'Explore Our Work', 'Meet the Team',
  // (hero KPI strip 13+ / 120+ / 10M+ removed at the client's request, round 4)
  'Graveyard Management System', 'Web Dashboard', 'Mobile App', 'Analytics',
  // tech
  'Strength in Stack', 'Trusted Tools & Technologies',
  'Leveraging reliable, scalable technologies to deliver high-performance digital platforms—from data collection and MIS to monitoring systems and advanced analytics.',
  'Web Platform', 'Mobile Platform', 'Databases', 'Open Source Tools',
  // what we do
  'What We Do', 'Core Expertise',
  'End-to-end digital solutions that power health research, clinical operations, and national-scale data systems.',
  // (the 'End-to-End Digital Health Solutions' banner was removed at the client's request, 2026-11-06)
  'Lead, Technical Operations (National Surveys)',
  'Comprehensive technical support and data monitoring for nationally representative surveys, including the Bangladesh Health Facility Survey and Bangladesh Maternal Mortality Survey.',
  'Electronic Data Capture (EDC)',
  'Offline-first Android applications for field surveys, dietary recalls, and clinical data collection at scale.',
  'Mapping & Listing',
  'GPS-based mapping and household listing that give surveys and surveillance an accurate sampling frame.',
  'Active Surveillance',
  'Facilitating longitudinal population tracking and automated clinical alerting across integrated multi-site networks.',
  'Bio-Bank Management',
  'End-to-end sample tracking and cold-chain monitoring integration for biological repositories.',
  'Laboratory Information Management System (LIMS)',
  'Centralized sample management with standardized workflows and strong data integrity across the testing lifecycle.',
  'Learn more', 'Show More',
  // team
  'Talented Professionals', 'Meet the diverse team of specialists — from software architects to data scientists',
  'Md. Ashrafuzzaman', 'Assistant Programmer', 'saleheen@icddrb.org',
  'Abu Md. Saleheen', 'Data Management Officer', 'mshahidul@icddrb.org',
  'Md. Shahidul Alam', 'Senior Data Management Assistant', 'mkibhuiyan@icddrb.org',
  'Md. Khairul Islam Bhuiyan', 'asad.zaman@icddrb.org',
  // global
  'Cross-Border Operations', 'Global Footprint',
  "Our team provides physical and digital support across multiple countries, ensuring technology works in the world's most demanding environments.",
  '11+', 'Countries Supported', 'Physical and digital operations across Asia, Africa & South America',
  '104+', 'Digital Tools Deployed', 'Research platforms, mobile apps and real-time dashboards in active use',
  'Records Managed', 'Structured health and demographic data maintained across active studies',
  'Bangladesh', 'India', 'Nepal', 'Pakistan', 'Mali', 'Gambia', 'Sierra Leone', 'Nigeria', 'Uganda',
  'Ethiopia', 'Kenya', 'Tanzania', 'Mozambique', 'South Africa', 'Argentina',
  // partners + footer
  'Collaboration & Technical Support', 'MCHD IT', 'Client Portal'
];

const missing = STRINGS.filter(s => !src.includes(s));
if (missing.length) { console.error('Missing content:\n - ' + missing.join('\n - ')); process.exit(1); }
console.log(`Content parity OK: ${STRINGS.length} strings present verbatim.`);
