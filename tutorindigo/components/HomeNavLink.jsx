
const HomeNavLink = () => {
  const config = getConfig();
  const intl = useIntl();
  const SITE_URL = config.MARKETING_SITE_URL || (() => {
    const url = new URL(config.LMS_BASE_URL);
    return `${url.protocol}//${url.hostname}`;
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
