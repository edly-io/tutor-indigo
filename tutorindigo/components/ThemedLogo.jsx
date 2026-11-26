const ThemedLogo = () => {
  const { LMS_BASE_URL: BASE_URL, SITE_NAME } = getConfig();

  return (
    <>
      <style>
        {`
          #root header .logo-image.logo-white {
            display: none !important;
          }
          [data-paragon-theme-variant="dark"] #root header .logo-image {
            display: none;
          }
          [data-paragon-theme-variant="dark"] #root header .logo-white {
            display: block !important;
          }
          #root header .logo {
            margin-right: 30px !important;
            height: fit-content !important;
            top: 0 !important;
            padding-bottom: 4px !important;
          }
          #root header .logo .logo-image {
            height: 60px !important;
          }
          #root .learning-header .container-xl {
            padding: 0 !important;
          }
        `}
      </style>
      <a href={`${BASE_URL}/dashboard`} title={SITE_NAME} className="logo">
        <img
          className="logo-image"
          src={`${BASE_URL}/static/indigo/images/logo.png`}
          alt={SITE_NAME}
        />
        <img
          className="logo-image logo-white"
          src={`${BASE_URL}/static/indigo/images/logo-white.png`}
          alt={SITE_NAME}
        />
      </a>
    </>
  );
};
