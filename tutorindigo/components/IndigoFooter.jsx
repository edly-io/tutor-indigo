
const IndigoFooter = () => {
  const intl = useIntl();
  const config = getConfig();

  const messages = {
    "footer.logo.altText": {
      id: "footer.logo.altText",
      defaultMessage: "Logo",
      description: "Alt text for the footer logo",
    },
    "footer.copyright.text": {
      id: "footer.copyright.text",
      defaultMessage: "{organization} ©{year}. All Rights Reserved.",
      description: "copyright text for the footer",
    },
    "footer.navlink.aboutUs": {
      id: "footer.navlink.aboutUs",
      defaultMessage: "About Us",
      description: "Footer navigation link",
    },
    "footer.navlink.privacyPolicy": {
      id: "footer.navlink.privacyPolicy",
      defaultMessage: "Privacy Policy",
      description: "Footer navigation link",
    },
    "footer.navlink.joinAsPartner": {
      id: "footer.navlink.joinAsPartner",
      defaultMessage: "Join as Partner",
      description: "Footer navigation link",
    },
    "footer.navlink.joinAsInstructor": {
      id: "footer.navlink.joinAsInstructor",
      defaultMessage: "Join as Instructor",
      description: "Footer navigation link",
    },
    "footer.navlink.contactUs": {
      id: "footer.navlink.contactUs",
      defaultMessage: "Contact Us",
      description: "Footer navigation link",
    },
  };

  const SITE_URL = config.MARKETING_SITE_URL || (() => {
    const url = new URL(config.LMS_BASE_URL);
    return `${url.protocol}//${url.hostname}`;
  })();

  return (
    <div className="wrapper wrapper-footer">
      <footer id="footer" className="tutor-container">

        <div className="footer-social-row">
          <div className="footer-container">
            <nav className="social-nav">
              <a href={`${SITE_URL}/`} className="logo">
                <img src={`${config.LMS_BASE_URL}/theming/asset/images/logo.png`} alt={intl.formatMessage(messages["footer.logo.altText"])} />
              </a>
            </nav>
            <nav className="privacy-nav">
              <ul>
                <li>
                  <a href={`${SITE_URL}/about/`}>
                    {intl.formatMessage(messages["footer.navlink.aboutUs"])}
                  </a>
                </li>
                <li>
                  <a href={`${SITE_URL}/policy/`}>
                    {intl.formatMessage(messages["footer.navlink.privacyPolicy"])}
                  </a>
                </li>
                <li>
                  <a href={`${SITE_URL}/partners-join/`}>
                    {intl.formatMessage(messages["footer.navlink.joinAsPartner"])}
                  </a>
                </li>
                <li>
                  <a href={`${SITE_URL}/instructor-join/`}>
                    {intl.formatMessage(messages["footer.navlink.joinAsInstructor"])}
                  </a>
                </li>
                <li>
                  <a href={`${SITE_URL}/contact-us/`}>
                    {intl.formatMessage(messages["footer.navlink.contactUs"])}
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
        <div className="footer-copyright-row">
          <div className="footer-container">
            {intl.formatMessage(messages["footer.copyright.text"], { organization: config.SITE_NAME || 'Arbisoft', year: new Date().getFullYear() })}
          </div>
        </div>
      </footer>
    </div>
  );
};
