import React, { useEffect } from 'react';
import { Mail, Plus, X } from 'lucide-react';
import type { TabId } from '../types';
import { TABS } from './Navigation';
import { BrandLogo } from './BrandLogo';
import { PWAInstallButton, ShareAppButton } from './PWAInstallBanner';
import { MICRO1_COMPANY_REFERRAL_URL } from '../utils/referralLinks';

export type LegalModalType = 'about' | 'contact' | 'privacy' | 'terms' | null;

interface FooterProps {
  onSelectTab: (tab: TabId) => void;
  onScrollToBriefings: () => void;
  onOpenPostJob: () => void;
  legalModal: LegalModalType;
  onChangeLegalModal: (modal: LegalModalType) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectTab,
  onScrollToBriefings,
  onOpenPostJob,
  legalModal,
  onChangeLegalModal,
}) => {
  useEffect(() => {
    if (!legalModal) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onChangeLegalModal(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [legalModal, onChangeLegalModal]);

  return (
    <>
      <footer className="no-print border-t border-slate-200 bg-slate-50 text-slate-600">
        <div className="mx-auto max-w-7xl px-4 pt-14 pb-24 sm:px-6 md:pb-12">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {/* Column 1: PlanetAI Hub Info + Share/Install Buttons */}
            <div>
              <button
                type="button"
                onClick={() => onSelectTab('jobs')}
                className="inline-flex items-center gap-2.5 font-display text-xl font-bold tracking-tight text-slate-900 transition-colors hover:text-[#1D4ED8]"
              >
                <BrandLogo className="h-7 w-7 shrink-0" />
                <span>PlanetAI Hub</span>
              </button>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                Editorial remote AI &amp; engineering job board paired with an offline-ready career, finance, and productivity workspace. Zero signup required.
              </p>
              <p className="mt-3 font-mono text-xs text-slate-500">
                planetaihub.com · LocalStorage PWA
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <ShareAppButton variant="light" />
                <PWAInstallButton variant="light" />
              </div>
            </div>

            {/* Column 2: Platform Tab Links (All 9 Platform Sections) */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900">
                Platform
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm text-slate-600">
                {TABS.map((tab) => (
                  <li key={tab.id}>
                    <button
                      type="button"
                      onClick={() => onSelectTab(tab.id)}
                      className="text-left font-medium text-slate-600 transition-colors hover:text-[#1D4ED8] whitespace-nowrap"
                    >
                      {tab.label}
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    type="button"
                    onClick={onScrollToBriefings}
                    className="text-left font-medium text-slate-600 transition-colors hover:text-[#1D4ED8] whitespace-nowrap"
                  >
                    Briefings
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: For Employers */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900">
                For Employers
              </h3>
              <ul className="mt-4 space-y-3.5 text-sm text-slate-600">
                <li>
                  <button
                    type="button"
                    onClick={onOpenPostJob}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#1D4ED8] px-4 py-2 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-[#1E40AF] whitespace-nowrap"
                  >
                    <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Post a Job</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onSelectTab('jobs')}
                    className="text-left font-medium text-slate-600 transition-colors hover:text-[#1D4ED8] whitespace-nowrap"
                  >
                    Featured Company Spotlight
                  </button>
                </li>
                <li>
                  <a
                    href={MICRO1_COMPANY_REFERRAL_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold leading-snug text-[#1D4ED8] shadow-2xs transition-all duration-200 hover:border-blue-300 hover:bg-blue-50/70"
                  >
                    Hiring AI Talent? Source Pre-Vetted Engineers via micro1 →
                  </a>
                </li>
                <li className="text-xs leading-relaxed text-slate-500">
                  100% Transparent Pay Standard: every listing displays verified USD hourly or annual bands with direct ATS links.
                </li>
              </ul>
            </div>

            {/* Column 4: Legal & Info */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900">
                Legal &amp; Info
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm text-slate-600">
                <li>
                  <button
                    type="button"
                    onClick={() => onChangeLegalModal('about')}
                    className="text-left font-medium text-slate-600 transition-colors hover:text-[#1D4ED8] whitespace-nowrap"
                  >
                    About Us
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onChangeLegalModal('contact')}
                    className="text-left font-medium text-slate-600 transition-colors hover:text-[#1D4ED8] whitespace-nowrap"
                  >
                    Contact Us
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onChangeLegalModal('privacy')}
                    className="text-left font-medium text-slate-600 transition-colors hover:text-[#1D4ED8] whitespace-nowrap"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onChangeLegalModal('terms')}
                    className="text-left font-medium text-slate-600 transition-colors hover:text-[#1D4ED8] whitespace-nowrap"
                  >
                    Terms of Service
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-2 border-t border-slate-200 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} PlanetAI Hub. All bookmarks, notes, expenses, and vitals stay private in your browser.
            </p>
            <p className="font-mono text-[11px] text-slate-500">
              Offline-Ready PWA · Transparent Pay Directory
            </p>
          </div>
        </div>
      </footer>

      {/* Comprehensive AdSense-Compliant Legal & Info Modals */}
      {legalModal && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/60 backdrop-blur-sm sm:items-center sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="legal-modal-title"
          onClick={() => onChangeLegalModal(null)}
        >
          <div
            className="max-h-[85vh] w-full max-w-xl overflow-y-auto rounded-t-3xl border border-slate-200 bg-white p-6 text-slate-900 shadow-2xl sm:rounded-2xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
              <h2
                id="legal-modal-title"
                className="font-display text-2xl font-bold text-slate-900"
              >
                {legalModal === 'about'
                  ? 'About PlanetAI Hub'
                  : legalModal === 'contact'
                  ? 'Contact Us'
                  : legalModal === 'privacy'
                  ? 'Privacy Policy'
                  : 'Terms of Service'}
              </h2>
              <button
                type="button"
                onClick={() => onChangeLegalModal(null)}
                aria-label="Close dialog"
                className="inline-flex min-h-[40px] min-w-[40px] items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            {legalModal === 'about' && (
              <div className="mt-4 space-y-4 text-sm leading-relaxed text-slate-700">
                <p>
                  <strong>PlanetAI Hub</strong> (
                  <a
                    href="https://planetaihub.com"
                    className="font-medium text-[#1D4ED8] underline"
                  >
                    planetaihub.com
                  </a>
                  ) is an independent editorial platform dedicated to remote artificial intelligence, machine learning training, prompt engineering, voice AI, and software engineering career opportunities.
                </p>
                <p>
                  Our mission is to bring absolute transparency to remote employment by curating verified listings that feature transparent USD compensation bands and direct employer ATS links. In addition to our job board, we publish in-depth editorial intelligence briefings and provide professional offline-capable career, finance, and productivity utilities.
                </p>
                <p>
                  We operate with a zero-signup, local-first design philosophy, ensuring user privacy and instant accessibility across desktop and mobile devices.
                </p>
              </div>
            )}

            {legalModal === 'contact' && (
              <div className="mt-4 space-y-4 text-sm leading-relaxed text-slate-700">
                <p>
                  We welcome inquiries from job seekers, hiring managers, and editorial partners. Whether you have questions about our remote listings, employer video spotlights, or technical feedback, our team is ready to assist you.
                </p>
                <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-4">
                  <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1D4ED8] uppercase tracking-wider">
                    <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Editorial &amp; Support Desk</span>
                  </p>
                  <p className="mt-1 text-base font-bold text-slate-900">
                    <a
                      href="mailto:team@planetaihub.com"
                      className="hover:text-[#1D4ED8] underline"
                    >
                      team@planetaihub.com
                    </a>
                  </p>
                </div>
                <p className="text-xs text-slate-600">
                  We strive to respond to all publisher and employer placement inquiries within 24–48 business hours.
                </p>
              </div>
            )}

            {legalModal === 'privacy' && (
              <div className="mt-4 space-y-4 text-sm leading-relaxed text-slate-700">
                <p>
                  At PlanetAI Hub, accessible at{' '}
                  <a
                    href="https://planetaihub.com"
                    className="font-medium text-[#1D4ED8] underline"
                  >
                    planetaihub.com
                  </a>
                  , one of our main priorities is the privacy of our visitors. This Privacy Policy document outlines the types of information collected and recorded by PlanetAI Hub and how we use it.
                </p>
                <p>
                  <strong>Browser Local Storage Privacy:</strong> PlanetAI Hub operates on a zero-signup model. All user shortlists, bookmarks, notes, resume drafts, expense records, and health vitals are stored exclusively inside your device’s browser{' '}
                  <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-xs text-[#1D4ED8]">
                    localStorage
                  </code>
                  . We do not transmit or store personal workspace records on external servers.
                </p>
                <p>
                  <strong>Google AdSense &amp; Third-Party Cookies:</strong> Google, as a third-party vendor, uses cookies (such as DART cookies) to serve ads on PlanetAI Hub. Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our site and/or other sites on the internet.
                </p>
                <p>
                  Users may opt out of personalized advertising by visiting the{' '}
                  <a
                    href="https://adssettings.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-[#1D4ED8] underline"
                  >
                    Google Ads Settings
                  </a>{' '}
                  page.
                </p>
                <p className="text-xs text-slate-600">
                  If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us at{' '}
                  <a
                    href="mailto:team@planetaihub.com"
                    className="font-medium text-[#1D4ED8] underline"
                  >
                    team@planetaihub.com
                  </a>
                  .
                </p>
              </div>
            )}

            {legalModal === 'terms' && (
              <div className="mt-4 space-y-4 text-sm leading-relaxed text-slate-700">
                <p>
                  By accessing and using PlanetAI Hub (
                  <a
                    href="https://planetaihub.com"
                    className="font-medium text-[#1D4ED8] underline"
                  >
                    planetaihub.com
                  </a>
                  ), you agree to comply with and be bound by the following terms and conditions of use.
                </p>
                <p>
                  <strong>Aggregated Job Listings &amp; ATS Links:</strong> Job listings displayed on PlanetAI Hub are curated from public remote RSS feeds, employer career pages, and direct submissions. We do not act as an employer or recruitment agency. Users must verify final compensation, employment contracts, and regional eligibility directly on the hiring company's official ATS portal.
                </p>
                <p>
                  <strong>Utility Disclaimer:</strong> Financial calculators, resume builders, and productivity tools provided on this platform are for informational and workflow assistance only and do not constitute formal legal, financial, or tax advice.
                </p>
                <p>
                  <strong>Intellectual Property:</strong> Editorial briefings, interface design, and branding are the property of PlanetAI Hub. Unauthorized scraping or republishing of proprietary editorial content is prohibited.
                </p>
                <p className="text-xs text-slate-600">
                  For questions regarding these Terms of Service, please contact{' '}
                  <a
                    href="mailto:team@planetaihub.com"
                    className="font-medium text-[#1D4ED8] underline"
                  >
                    team@planetaihub.com
                  </a>
                  .
                </p>
              </div>
            )}

            <div className="mt-6 flex justify-end border-t border-slate-200 pt-4">
              <button
                type="button"
                onClick={() => onChangeLegalModal(null)}
                className="min-h-[40px] rounded-full bg-[#1D4ED8] px-6 py-2 text-xs font-semibold text-white hover:bg-[#1E40AF]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
