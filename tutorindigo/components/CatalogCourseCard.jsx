
/* Indigo course card for the Course Catalog MFE (home page and catalog data table). */

const catalogCourseCardMessages = {
  startDate: {
    id: 'generic.course-card.start-date',
    defaultMessage: 'Starts: {startDate}',
    description: 'Start date.',
  },
};

const getCatalogFullImageUrl = (path) => {
  if (!path) {
    return '';
  }
  return path.startsWith('http') ? path : `${getConfig().LMS_BASE_URL}${path}`;
};

const getCatalogStartDateDisplay = (courseStartDate, courseAdvertisedStart, intl) => {
  if (courseAdvertisedStart) {
    return courseAdvertisedStart;
  }
  if (courseStartDate) {
    return intl.formatDate(new Date(courseStartDate), { month: 'short', day: 'numeric', year: 'numeric' });
  }
  return '';
};

const CatalogCourseCard = ({
  isLoading,
  courseId,
  courseOrg,
  courseName,
  courseNumber,
  courseImageUrl,
  courseStartDate,
  courseAdvertisedStart,
}) => {
  const intl = useIntl();
  const isExtraSmall = useMediaQuery({ maxWidth: breakpoints.small.maxWidth });
  const noCourseImg = `${getConfig().LMS_BASE_URL}/theming/asset/images/no_course_image.png`;
  const startDateDisplay = getCatalogStartDateDisplay(courseStartDate, courseAdvertisedStart, intl);

  return (
    <Card
      className={`course-card d-flex ${isExtraSmall ? 'w-100' : 'course-card-desktop'}`}
      isLoading={isLoading}
      data-testid="course-card"
    >
      <Card.ImageCap
        src={getCatalogFullImageUrl(courseImageUrl)}
        fallbackSrc={noCourseImg}
        srcAlt={`${courseName} ${courseNumber}`}
        skeletonDuringImageLoad
      />
      <div className="px-4 py-2 text-left x-small">{courseNumber}</div>
      <Card.Header
        title={courseName}
        subtitle={<div className="course-organization">{courseOrg}</div>}
        size="sm"
      />
      <Card.Section />
      {!isLoading && (
        <Button
          as={Link}
          to={courseId ? `/courses/${courseId}/about` : undefined}
          className="mx-4 mb-4"
        >
          Learn More
        </Button>
      )}
      <Card.Footer className="justify-content-start py-3">
        <Icon className="mr-2" src={Calendar} aria-label={intl.formatMessage(catalogCourseCardMessages.startDate, { startDate: startDateDisplay })} />
        {startDateDisplay && intl.formatMessage(catalogCourseCardMessages.startDate, { startDate: startDateDisplay })}
      </Card.Footer>
    </Card>
  );
};
