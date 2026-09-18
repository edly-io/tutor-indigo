
const MobileViewHeader = () => {
  const config = getConfig();
  const intl = useIntl();
  const messages = {
    "mobile.view.header.logo.altText": {
      id: "mobile.view.header.logo.altText",
      defaultMessage: "My Open edX",
      description: "alt text for the mobile view header logo",
    },
  };

  const BASE_URL = config.LMS_BASE_URL;

  return (
    <>
      <style>
        {`
          #root .indigo-mobile-header {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            padding: 0 1rem;
          }
          #root .indigo-mobile-header .logo {
            display: inline-flex;
            align-items: center;
            min-width: 0;
          }
          #root .logo-image.logo-white {
            display: none;
          }
          [data-paragon-theme-variant="dark"] #root .logo-image {
            display: none;
          }
          [data-paragon-theme-variant="dark"] #root .logo-white {
            display: block;
          }
          #root .logo .logo-image {
            height: 60px;
          }
        `}
      </style>
      <div className="indigo-mobile-header">
        <a href={`${BASE_URL}/dashboard`} title="Open edX" className="logo">
          <img className="logo-image" src={`${BASE_URL}/static/indigo/images/logo.png`} alt={intl.formatMessage(messages["mobile.view.header.logo.altText"])} />
          <img className="logo-image logo-white" src={`${BASE_URL}/static/indigo/images/logo-white.png`} alt={intl.formatMessage(messages["mobile.view.header.logo.altText"])} />
        </a>
      </div>
    </>
  );
};
