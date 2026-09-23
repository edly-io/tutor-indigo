/* Edly sales-demo footer.
 *
 * Mirrors tutorindigo/templates/indigo/lms/templates/footer.html so that the
 * legacy LMS pages and the MFEs render the same footer. React, hooks and
 * getConfig are provided by Imports.jsx. Social icons are inline SVGs so that
 * no extra npm dependency is required in any MFE.
 *
 * This component carries class names only. Its styling lives in brand-openedx
 * (paragon/_edly-footer.scss, shipped in core.min.css), which every MFE loads
 * at runtime, so footer styling changes never need an MFE image rebuild. The
 * previous inline styles could not carry media queries, and the five-column
 * grid forced every page to ~740px on a phone.
 */

const indigoFooterSections = [
  {
    title: 'Industries',
    links: [
      ['K12', 'https://edly.io/k12-lms/'],
      ['Higher Ed', 'https://edly.io/higher-education-lms/'],
      ['Corporate', 'https://edly.io/corporate-lms/'],
      ['Non Profit', 'https://edly.io/nonprofit-lms/'],
      ['Business', 'https://edly.io/business-lms/'],
    ],
  },
  {
    title: 'Services',
    links: [
      ['Managed Hosting', 'https://edly.io/services/open-edx-managed-hosting/'],
      ['Open edX Installation', 'https://edly.io/services/open-edx-installation/'],
      ['Open edX Custom Solutions', 'https://edly.io/services/open-edx-custom-solutions/'],
      ['Instructional Design', 'https://edly.io/services/instructional-design/'],
      ['LMS Training and Support', 'https://edly.io/services/lms-training-support/'],
      ['Data Migration', 'https://edly.io/services/lms-data-migration/'],
    ],
  },
  {
    title: 'Resources',
    links: [
      ['Blog', 'https://edly.io/resources/blog/'],
      ['Case Studies', 'https://edly.io/resources/case-studies/'],
      ['Guides and Whitepapers', 'https://edly.io/resources/guides-and-whitepapers/'],
      ['Product Updates', 'https://edly.io/resources/news-and-updates/'],
      ['FAQs', 'https://edly.io/resources/faqs/'],
    ],
  },
  {
    title: 'About',
    links: [
      ['Why Edly', 'https://edly.io/why-edly/'],
      ['Our Customers', 'https://edly.io/customers/'],
      ['Features', 'https://edly.io/features/'],
      ['Edly Plans', 'https://edly.io/pricing-and-plans/'],
      ['Contact us', 'https://edly.io/contact-us/'],
      ['Sign In', 'https://panel.edly.io/'],
    ],
  },
];

const IndigoFooter = () => {
  const config = getConfig();
  const currentYear = new Date().getFullYear();

  return (
    <div className="react-footer">
      <footer>
        <div className="react-footer__inner">

          {/* MAIN */}
          <div className="react-footer__main">
            <div className="react-footer__brand">
              <a href={`${config.LMS_BASE_URL}/`} className="react-footer__logo">
                <img
                  src={`${config.LMS_BASE_URL}/static/indigo/images/logo.png`}
                  alt="Edly"
                />
              </a>
            </div>

            {indigoFooterSections.map((section) => (
              <div key={section.title}>
                <h3 className="react-footer__heading">{section.title}</h3>
                <ul className="react-footer__links">
                  {section.links.map(([label, url]) => (
                    <li key={label}>
                      <a href={url}>{label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <hr className="react-footer__divider" />

          {/* BOTTOM */}
          <div className="react-footer__bottom">
            <div className="react-footer__copyright">
              <p>EDX, Open EDX are registered trademarks of edX Inc. All Rights Reserved.</p>
              <p>© Edly {currentYear}. All rights reserved.</p>
            </div>

            <div className="react-footer__legal react-footer-legal">
              <a href="https://edly.io/privacy-policy/">Privacy Policy</a>
              <a href="https://edly.io/refund-policy/">Refund Policy</a>
              <a href="https://edly.io/cancellation-policy/">Cancellation Policy</a>
              <a href="https://edly.io/terms-and-conditions/">Terms & Conditions</a>
            </div>
          </div>

          {/* SOCIAL */}
          <div className="react-footer__social">
            <a
              href="https://twitter.com/edly_inc"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231z" />
              </svg>
            </a>

            <a
              href="https://www.linkedin.com/company/edly"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M22.23 0H1.77C.79 0 0 .774 0 1.727v20.545C0 23.227.79 24 1.77 24h20.46C23.2 24 24 23.227 24 22.272V1.727C24 .774 23.2 0 22.23 0zM7.09 20.45H3.56V9h3.53v11.45zM5.32 7.43c-1.13 0-2.05-.92-2.05-2.05 0-1.13.92-2.05 2.05-2.05s2.05.92 2.05 2.05c0 1.13-.92 2.05-2.05 2.05zM20.45 20.45h-3.53v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.15 1.45-2.15 2.94v5.67H9.39V9h3.39v1.56h.05c.47-.9 1.63-1.85 3.35-1.85 3.58 0 4.24 2.36 4.24 5.44v6.3z" />
              </svg>
            </a>
          </div>

        </div>
      </footer>
    </div>
  );
};
