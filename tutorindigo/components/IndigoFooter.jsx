
const IndigoFooter = () => {
  const intl = useIntl();
  const config = getConfig();

  const indigoFooterNavLinks = config.INDIGO_FOOTER_NAV_LINKS || [];

  const messages = {
    "footer.poweredby.text": {
      id: "footer.poweredby.text",
      defaultMessage: "Powered by",
      description: "text for the footer",
    },
    "footer.tutorlogo.altText": {
      id: "footer.tutorlogo.altText",
      defaultMessage: "Runs on Tutor",
      description: "alt text for the footer tutor logo",
    },
    "footer.logo.altText": {
      id: "footer.logo.altText",
      defaultMessage: "Powered by Open edX",
      description: "alt text for the footer logo.",
    },
    "footer.copyright.text": {
      id: "footer.copyright.text",
      defaultMessage: "Copyrights ©{year}. All Rights Reserved.",
      description: "copyright text for the footer",
    },
    "footer.navlink.aboutUs": {
      id: "footer.navlink.aboutUs",
      defaultMessage: "About Us",
      description: "Footer navigation link",
    },
    "footer.navlink.blog": {
      id: "footer.navlink.blog",
      defaultMessage: "Blog",
      description: "Footer navigation link",
    },
    "footer.navlink.donate": {
      id: "footer.navlink.donate",
      defaultMessage: "Donate",
      description: "Footer navigation link",
    },
    "footer.navlink.termsOfService": {
      id: "footer.navlink.termsOfService",
      defaultMessage: "Terms of Service",
      description: "Footer navigation link",
    },
    "footer.navlink.privacyPolicy": {
      id: "footer.navlink.privacyPolicy",
      defaultMessage: "Privacy Policy",
      description: "Footer navigation link",
    },
    "footer.navlink.help": {
      id: "footer.navlink.help",
      defaultMessage: "Help",
      description: "Footer navigation link",
    },
    "footer.navlink.contactUs": {
      id: "footer.navlink.contactUs",
      defaultMessage: "Contact Us",
      description: "Footer navigation link",
    },
  };

  // Map default English titles to message IDs so they get translated.
  // Operator-defined custom titles that don't match will render as-is.
  const navLinkMessageIds = {
    "About Us": "footer.navlink.aboutUs",
    "Blog": "footer.navlink.blog",
    "Donate": "footer.navlink.donate",
    "Terms of Service": "footer.navlink.termsOfService",
    "Privacy Policy": "footer.navlink.privacyPolicy",
    "Help": "footer.navlink.help",
    "Contact Us": "footer.navlink.contactUs",
  };

  return (
    <div className="wrapper wrapper-footer">
      <footer id="footer" className="tutor-container">
        <div className="footer-top">
          <div className="powered-area">
            <ul className="logo-list">
              <li>{intl.formatMessage(messages["footer.poweredby.text"])}</li>
              <li>
                <a
                  href="https://edly.io/tutor/"
                  rel="noreferrer"
                  target="_blank"
                >
                  <img
                    src={`${config.LMS_BASE_URL}/theming/asset/images/tutor-logo.png`}
                    alt={intl.formatMessage(
                      messages["footer.tutorlogo.altText"]
                    )}
                    width="57"
                  />
                </a>
              </li>
              <li>
                <a href="https://open.edx.org" rel="noreferrer" target="_blank">
                  <img
                    src={`${config.LMS_BASE_URL}/theming/asset/images/openedx-logo.png`}
                    alt={intl.formatMessage(messages["footer.logo.altText"])}
                    width="79"
                  />
                </a>
              </li>
            </ul>
          </div>
          <nav className="nav-colophon">
            <ol>
              {indigoFooterNavLinks.map((link) => (
                <li key={link.url}>
                  <a href={`${link.url.startsWith("http") ? link.url : config.LMS_BASE_URL + link.url}`}>
                    {navLinkMessageIds[link.title]
                      ? intl.formatMessage(messages[navLinkMessageIds[link.title]])
                      : link.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </div>
        <span className="copyright-site">
          {intl.formatMessage(messages["footer.copyright.text"], { year: new Date().getFullYear() })}
        </span>
      </footer>
    </div>
  );
};
