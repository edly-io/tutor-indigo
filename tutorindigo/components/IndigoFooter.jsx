const { useState, useEffect } = await import('react');
const { getConfig } = await import('@edx/frontend-platform');

/* ================= STYLES ================= */

const footerStyle = {
  backgroundColor: '#2a2a2a',
  color: '#fff',
  padding: '60px 0 30px',
};

const innerStyle = {
  maxWidth: '100%',
  padding: '0 60px',
};

const mainStyle = {
  display: 'grid',
  gridTemplateColumns: '1.5fr repeat(4, 1fr)',
  gap: '50px',
  marginBottom: '50px',
  marginLeft: '30px',
};

const logoStyle = {
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
};

const headingStyle = {
  fontSize: '15px',
  marginBottom: '20px',
  borderBottom: '2px solid #dd1e26',
  display: 'inline-block',
  paddingBottom: '10px',
  color: '#fff',
};

const linksStyle = { listStyle: 'none', padding: 0 };
const linkItemStyle = { marginBottom: '12px' };
const linkStyle = { color: '#b0b0b0', textDecoration: 'none', fontSize: '14px' };

const dividerStyle = {
  border: 'none',
  borderTop: '1px solid #444',
  margin: '30px 0',
};

const bottomStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: '20px',
};

const legalLinkStyle = {
  marginLeft: '20px',
  color: '#ffffff',
  fontSize: '13px',
  textDecoration: 'none',
};

const copyrightStyle = {
  fontSize: '13px',
  color: '#fff',
  lineHeight: '1.5',
  margin: '0 0 8px 0',
};

const socialStyle = {
  marginTop: '30px',
  display: 'flex',
  justifyContent: 'center',
  gap: '28px',
};

const socialLinkStyle = {
  color: '#f9f9f9',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'transform 0.3s ease, opacity 0.3s ease',
};

const socialIconStyle = {
  width: '28px',
  height: '28px',
  fill: 'currentColor',
};

/* ================= COMPONENT ================= */

const IndigoFooter = () => {
  const [Icons, setIcons] = useState(null);
  const [logoHeight, setLogoHeight] = useState(
    window.innerWidth >= 1024 ? '52px' : '89px'
  );

  /* Responsive logo size (matches Django) */
  useEffect(() => {
    const handleResize = () => {
      setLogoHeight(window.innerWidth >= 1024 ? '52px' : '89px');
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  /* Load icons */
  useEffect(() => {
    (async () => {
      const { FontAwesomeIcon } = await import('@fortawesome/react-fontawesome');
      const { faXTwitter, faLinkedin } = await import('@fortawesome/free-brands-svg-icons'); // <- update here
      setIcons({ FontAwesomeIcon, faXTwitter, faLinkedin });
    })();
  }, []);


  if (!Icons) return null;

  const logoImgStyle = {
    height: logoHeight,
    width: 'auto',
    display: 'block',
  };

  const currentYear = new Date().getFullYear();

  return (
    <div style={footerStyle} className="react-footer">
      <footer>
        <div style={innerStyle}>

          {/* MAIN */}
          <div style={mainStyle}>
            <div>
              <a href="/" style={logoStyle}>
                <img
                  src={`${getConfig().LMS_BASE_URL}/static/indigo/images/logo.png`}
                  alt="Sales Demo Logo"
                  style={logoImgStyle}
                />
              </a>
            </div>

            {[
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
            ].map(section => (
              <div key={section.title}>
                <h3 style={headingStyle}>{section.title}</h3>
                <ul style={linksStyle}>
                  {section.links.map(([label, url]) => (
                    <li key={label} style={linkItemStyle}>
                      <a href={url} style={linkStyle}>{label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <hr style={dividerStyle} />

          {/* BOTTOM */}
          <div style={bottomStyle}>
            <div>
              <p style={copyrightStyle}>
                EDX, Open EDX are registered trademarks of edX Inc. All Rights Reserved.
              </p>
              <p style={copyrightStyle}>
                © Edly {currentYear}. All rights reserved.
              </p>
            </div>

            <div className="react-footer-legal">
              <a href="https://edly.io/privacy-policy/" style={legalLinkStyle}>Privacy Policy</a>
              <a href="https://edly.io/refund-policy/" style={legalLinkStyle}>Refund Policy</a>
              <a href="https://edly.io/cancellation-policy/" style={legalLinkStyle}>Cancellation Policy</a>
              <a href="https://edly.io/terms-and-conditions/" style={legalLinkStyle}>Terms & Conditions</a>
            </div>
          </div>

          {/* SOCIAL */}
          <div style={socialStyle}>
            <a
              href="https://twitter.com/edly_inc"
              target="_blank"
              rel="noopener noreferrer"
              style={socialLinkStyle}
            >
              <Icons.FontAwesomeIcon icon={Icons.faXTwitter} style={socialIconStyle} />
            </a>

            <a
              href="https://www.linkedin.com/company/edly"
              target="_blank"
              rel="noopener noreferrer"
              style={socialLinkStyle}
            >
              <Icons.FontAwesomeIcon icon={Icons.faLinkedin} style={socialIconStyle} />
            </a>
          </div>


        </div>
      </footer>
    </div>
  );
};
