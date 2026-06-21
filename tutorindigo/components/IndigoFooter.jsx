
const IndigoFooter = () => {
  const intl = useIntl();
  const config = getConfig();

  const messages = {
    "footer.logo.altText": {
      id: "footer.logo.altText",
      defaultMessage: "Rwaq",
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

  return (
    <div className="wrapper wrapper-footer">
      <footer id="footer" className="tutor-container">

        <div className="footer-social-row">
          <div className="footer-container">
            <nav className="social-nav">
              <a href="https://site.${config.LMS_BASE_URL}/" className="logo">
                <img src={`${config.LMS_BASE_URL}/theming/asset/images/logo.png`} alt={intl.formatMessage(messages["footer.logo.altText"])} />
              </a>
              <ul>
                <li>
                  <a href="https://www.instagram.com/rwaq_/" target="_blank">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none"><mask id="path-1-inside-1_7278_2079" fill="white"><path d="M0 20C0 8.95431 8.95431 0 20 0C31.0457 0 40 8.95431 40 20C40 31.0457 31.0457 40 20 40C8.95431 40 0 31.0457 0 20Z"></path></mask><path d="M0 20M40 20M40 20M0 20M20 0M40 20M20 40M0 20M20 40V39C9.50659 39 1 30.4934 1 20H0H-1C-1 31.598 8.40202 41 20 41V40ZM40 20H39C39 30.4934 30.4934 39 20 39V40V41C31.598 41 41 31.598 41 20H40ZM20 0V1C30.4934 1 39 9.50659 39 20H40H41C41 8.40202 31.598 -1 20 -1V0ZM20 0V-1C8.40202 -1 -1 8.40202 -1 20H0H1C1 9.50659 9.50659 1 20 1V0Z" fill="#4A5565" mask="url(#path-1-inside-1_7278_2079)"></path><path d="M24.1667 11.667H15.8334C13.5322 11.667 11.6667 13.5325 11.6667 15.8337V24.167C11.6667 26.4682 13.5322 28.3337 15.8334 28.3337H24.1667C26.4679 28.3337 28.3334 26.4682 28.3334 24.167V15.8337C28.3334 13.5325 26.4679 11.667 24.1667 11.667Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M23.3333 19.4753C23.4361 20.1688 23.3176 20.8771 22.9947 21.4994C22.6718 22.1218 22.1609 22.6264 21.5346 22.9416C20.9083 23.2569 20.1986 23.3666 19.5064 23.2552C18.8142 23.1438 18.1747 22.817 17.679 22.3212C17.1832 21.8255 16.8564 21.186 16.745 20.4938C16.6336 19.8015 16.7433 19.0918 17.0585 18.4656C17.3737 17.8393 17.8784 17.3284 18.5007 17.0055C19.1231 16.6825 19.8314 16.5641 20.5249 16.6669C21.2324 16.7718 21.8873 17.1015 22.393 17.6072C22.8987 18.1129 23.2283 18.7678 23.3333 19.4753Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M24.5833 15.417H24.5916" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                  </a>
                </li>
                <li>
                  <a href="https://www.youtube.com/rwaqorg" target="_blank">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none"><mask id="path-1-inside-1_7278_2075" fill="white"><path d="M0 20C0 8.95431 8.95431 0 20 0C31.0457 0 40 8.95431 40 20C40 31.0457 31.0457 40 20 40C8.95431 40 0 31.0457 0 20Z"></path></mask><path d="M0 20M40 20M40 20M0 20M20 0M40 20M20 40M0 20M20 40V39C9.50659 39 1 30.4934 1 20H0H-1C-1 31.598 8.40202 41 20 41V40ZM40 20H39C39 30.4934 30.4934 39 20 39V40V41C31.598 41 41 31.598 41 20H40ZM20 0V1C30.4934 1 39 9.50659 39 20H40H41C41 8.40202 31.598 -1 20 -1V0ZM20 0V-1C8.40202 -1 -1 8.40202 -1 20H0H1C1 9.50659 9.50659 1 20 1V0Z" fill="#4A5565" mask="url(#path-1-inside-1_7278_2075)"></path><path d="M12.0833 24.1667C11.5012 21.4194 11.5012 18.5806 12.0833 15.8333C12.1598 15.5543 12.3076 15.3001 12.5122 15.0955C12.7167 14.8909 12.971 14.7432 13.25 14.6667C17.7195 13.9262 22.2805 13.9262 26.75 14.6667C27.029 14.7432 27.2833 14.8909 27.4878 15.0955C27.6924 15.3001 27.8402 15.5543 27.9167 15.8333C28.4988 18.5806 28.4988 21.4194 27.9167 24.1667C27.8402 24.4457 27.6924 24.6999 27.4878 24.9045C27.2833 25.1091 27.029 25.2568 26.75 25.3333C22.2805 26.0739 17.7195 26.0739 13.25 25.3333C12.971 25.2568 12.7167 25.1091 12.5122 24.9045C12.3076 24.6999 12.1598 24.4457 12.0833 24.1667Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M18.3333 22.5L22.4999 20L18.3333 17.5V22.5Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                  </a>
                </li>
                <li>
                  <a href="https://www.facebook.com/RwaqOrg" target="_blank">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none"><mask id="path-1-inside-1_7483_3147" fill="white"><path d="M0 20C0 8.95431 8.95431 0 20 0C31.0457 0 40 8.95431 40 20C40 31.0457 31.0457 40 20 40C8.95431 40 0 31.0457 0 20Z"></path></mask><path d="M0 20M40 20M40 20M0 20M20 0M40 20M20 40M0 20M20 40V39C9.50659 39 1 30.4934 1 20H0H-1C-1 31.598 8.40202 41 20 41V40ZM40 20H39C39 30.4934 30.4934 39 20 39V40V41C31.598 41 41 31.598 41 20H40ZM20 0V1C30.4934 1 39 9.50659 39 20H40H41C41 8.40202 31.598 -1 20 -1V0ZM20 0V-1C8.40202 -1 -1 8.40202 -1 20H0H1C1 9.50659 9.50659 1 20 1V0Z" fill="#4A5565" mask="url(#path-1-inside-1_7483_3147)"></path><g clip-path="url(#clip0_7483_3147)"><path d="M15.8335 18.3333V21.6667H18.3335V27.5H21.6668V21.6667H24.1668L25.0002 18.3333H21.6668V16.6667C21.6668 16.4457 21.7546 16.2337 21.9109 16.0774C22.0672 15.9211 22.2791 15.8333 22.5002 15.8333H25.0002V12.5H22.5002C21.3951 12.5 20.3353 12.939 19.5539 13.7204C18.7725 14.5018 18.3335 15.5616 18.3335 16.6667V18.3333H15.8335Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></g><defs><clipPath id="clip0_7483_3147"><rect width="20" height="20" fill="white" transform="translate(10 10)"></rect></clipPath></defs></svg>
                  </a>
                </li>
                <li>
                  <a href="https://twitter.com/rwaq" target="_blank">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none"><mask id="path-1-inside-1_7483_3142" fill="white"><path d="M0 20C0 8.95431 8.95431 0 20 0C31.0457 0 40 8.95431 40 20C40 31.0457 31.0457 40 20 40C8.95431 40 0 31.0457 0 20Z"></path></mask><path d="M0 20M40 20M40 20M0 20M20 0M40 20M20 40M0 20M20 40V39C9.50659 39 1 30.4934 1 20H0H-1C-1 31.598 8.40202 41 20 41V40ZM40 20H39C39 30.4934 30.4934 39 20 39V40V41C31.598 41 41 31.598 41 20H40ZM20 0V1C30.4934 1 39 9.50659 39 20H40H41C41 8.40202 31.598 -1 20 -1V0ZM20 0V-1C8.40202 -1 -1 8.40202 -1 20H0H1C1 9.50659 9.50659 1 20 1V0Z" fill="#4A5565" mask="url(#path-1-inside-1_7483_3142)"></path><g clip-path="url(#clip0_7483_3142)"><path d="M23.733 28L12 12H16.267L28 28H23.733Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M12 28L18.768 21.232M21.228 18.772L28 12" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></g><defs><clipPath id="clip0_7483_3142"><rect width="24" height="24" fill="white" transform="translate(8 8)"></rect></clipPath></defs></svg>
                  </a>
                </li>
              </ul>
            </nav>
            <nav className="privacy-nav">
              <ul>
                <li>
                  <a href={`${config.LMS_BASE_URL?.replace('://', '://site.')}/about/`}>
                    {intl.formatMessage(messages["footer.navlink.aboutUs"])}
                  </a>
                </li>
                <li>
                  <a href={`${config.LMS_BASE_URL?.replace('://', '://site.')}/policy/`}>
                    {intl.formatMessage(messages["footer.navlink.privacyPolicy"])}
                  </a>
                </li>
                <li>
                  <a href={`${config.LMS_BASE_URL?.replace('://', '://site.')}/partners-join/`}>
                    {intl.formatMessage(messages["footer.navlink.joinAsPartner"])}
                  </a>
                </li>
                <li>
                  <a href={`${config.LMS_BASE_URL?.replace('://', '://site.')}/instructor-join/`}>
                    {intl.formatMessage(messages["footer.navlink.joinAsInstructor"])}
                  </a>
                </li>
                <li>
                  <a href={`${config.LMS_BASE_URL?.replace('://', '://site.')}/contact-us/`}>
                    {intl.formatMessage(messages["footer.navlink.contactUs"])}
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
        <div className="footer-copyright-row">
          <div className="footer-container">
            {intl.formatMessage(messages["footer.copyright.text"], { organization: 'Rwaq', year: new Date().getFullYear() })}
          </div>
        </div>
      </footer>
    </div>
  );
};
