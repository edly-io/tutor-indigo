
const HomeNavLink = () => {
  const config = getConfig();
  const intl = useIntl();
  const BASE_URL = config.LMS_BASE_URL;
  const SITE_URL = (() => {
    const url = new URL(BASE_URL);
    return `${url.protocol}//site.${url.hostname}`;
  })();

  return (
    <a
      href={SITE_URL}
      className="nav-link"
    >
      {intl.formatMessage({ id: 'indigo.home.nav.link', defaultMessage: 'Home' })}
    </a>
  );
};
