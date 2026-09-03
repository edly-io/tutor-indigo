from __future__ import annotations

import os
import typing as t
from glob import glob

import importlib_resources
from tutor import hooks
from tutor.__about__ import __version_suffix__
from tutormfe.hooks import PLUGIN_SLOTS

from .__about__ import __version__

# Handle version suffix in main mode, just like tutor core
if __version_suffix__:
    __version__ += "-" + __version_suffix__


################# Configuration
config: t.Dict[str, t.Dict[str, t.Any]] = {
    # Add here your new settings
    "defaults": {
        "VERSION": __version__,
        "WELCOME_MESSAGE": "The place for all your online learning",
        "PRIMARY_COLOR": "#15376D",  # Indigo
        "ENABLE_DARK_TOGGLE": True,
        # Footer links are dictionaries with a "title" and "url"
        # To remove all links, run:
        # tutor config save --set INDIGO_FOOTER_NAV_LINKS=[]
        "FOOTER_NAV_LINKS": [
            {"title": "About Us", "url": "/about"},
            {"title": "Blog", "url": "/blog"},
            {"title": "Donate", "url": "/donate"},
            {"title": "Terms of Service", "url": "/tos"},
            {"title": "Privacy Policy", "url": "/privacy"},
            {"title": "Help", "url": "/help"},
            {"title": "Contact Us", "url": "/contact"},
        ],
    },
    "unique": {},
    "overrides": {},
}

# Theme templates
hooks.Filters.ENV_TEMPLATE_ROOTS.add_item(
    str(importlib_resources.files("tutorindigo") / "templates")
)
# This is where the theme is rendered in the openedx build directory
hooks.Filters.ENV_TEMPLATE_TARGETS.add_items(
    [
        ("indigo", "build/openedx/themes"),
        ("indigo/env.config.jsx", "plugins/mfe/build/mfe"),
    ],
)

# Force the rendering of scss files, even though they are included in a
# "partials" directory
hooks.Filters.ENV_PATTERNS_INCLUDE.add_items(
    [
        r"indigo/lms/static/sass/partials/lms/theme/",
        r"indigo/cms/static/sass/partials/cms/theme/",
    ]
)


# init script: set theme automatically
with open(
    os.path.join(
        str(importlib_resources.files("tutorindigo") / "templates"),
        "indigo",
        "tasks",
        "init.sh",
    ),
    encoding="utf-8",
) as task_file:
    hooks.Filters.CLI_DO_INIT_TASKS.add_item(("lms", task_file.read()))


# Override openedx & mfe docker image names
@hooks.Filters.CONFIG_DEFAULTS.add(priority=hooks.priorities.LOW)
def _override_openedx_docker_image(
    items: list[tuple[str, t.Any]],
) -> list[tuple[str, t.Any]]:
    openedx_image = ""
    mfe_image = ""
    for k, v in items:
        if k == "DOCKER_IMAGE_OPENEDX":
            openedx_image = v
        elif k == "MFE_DOCKER_IMAGE":
            mfe_image = v
    if openedx_image:
        items.append(("DOCKER_IMAGE_OPENEDX", f"{openedx_image}-indigo"))
    if mfe_image:
        items.append(("MFE_DOCKER_IMAGE", f"{mfe_image}-indigo"))
    return items


# Load all configuration entries
hooks.Filters.CONFIG_DEFAULTS.add_items(
    [(f"INDIGO_{key}", value) for key, value in config["defaults"].items()]
)
hooks.Filters.CONFIG_UNIQUE.add_items(
    [(f"INDIGO_{key}", value) for key, value in config["unique"].items()]
)
hooks.Filters.CONFIG_OVERRIDES.add_items(list(config["overrides"].items()))


#  MFEs that are styled using Indigo
indigo_styled_mfes = [
    "learning",
    "learner-dashboard",
    "profile",
    "account",
    "discussions",
    "authoring", 
    "gradebook",
    "ora-grading",
    "communications",
    "learner-record"
]

brand_styled_mfes = [
    "learning",
    "learner-dashboard",
    "profile",
    "account",
    "discussions",
]

for mfe in indigo_styled_mfes:
    if mfe in brand_styled_mfes:
        hooks.Filters.ENV_PATCHES.add_items(
            [
                (
                    f"mfe-dockerfile-post-npm-install-{mfe}",
                    """
                    RUN npm install '@edx/brand@npm:@edly-io/indigo-brand-openedx@^2.2.2'
                    """,
                ),
            ]
        )

    hooks.Filters.ENV_PATCHES.add_items(
        [
            (
                f"mfe-dockerfile-post-npm-install-{mfe}",
                """
                RUN npm install '@edly-io/edly-saas-widget'
                RUN npm install '@edx/brand@github:@edly-io/brand-openedx#ulmo/indigo'
""",  # noqa: E501
            ),
            (
                f"mfe-env-config-runtime-definitions-{mfe}",
                """
                const { HeaderWidget, FooterWidget, MultiSiteBannerWidget, DiscussionSidebarWidget, PaidCourseUnenrollWidget, CourseBannerWidget } = require("@edly-io/edly-saas-widget");
                """,
            )
        ]
    )


hooks.Filters.ENV_PATCHES.add_item(
    (
        "mfe-dockerfile-post-npm-install-authn",
        """
        RUN npm install '@edx/brand@github:@edly-io/brand-openedx#ulmo/indigo'
        RUN npm install @edly-io/edly-saas-widget
        """,
    )
)

# Include js file in lms main.html, main_django.html, and certificate.html

hooks.Filters.ENV_PATCHES.add_items(
    [
        # for production
        (
            "openedx-common-assets-settings",
            """
javascript_files = ['base_application', 'application', 'certificates_wv']
dark_theme_filepath = ['indigo/js/dark-theme.js']

for filename in javascript_files:
    if filename in PIPELINE['JAVASCRIPT']:
        PIPELINE['JAVASCRIPT'][filename]['source_filenames'] += dark_theme_filepath
""",
        ),
        # for development
        (
            "openedx-lms-development-settings",
            """
javascript_files = ['base_application', 'application', 'certificates_wv']
dark_theme_filepath = ['indigo/js/dark-theme.js']

for filename in javascript_files:
    if filename in PIPELINE['JAVASCRIPT']:
        PIPELINE['JAVASCRIPT'][filename]['source_filenames'] += dark_theme_filepath

MFE_CONFIG['INDIGO_ENABLE_DARK_TOGGLE'] = {{ INDIGO_ENABLE_DARK_TOGGLE }}
MFE_CONFIG['INDIGO_FOOTER_NAV_LINKS'] = {{ INDIGO_FOOTER_NAV_LINKS }}
""",
        ),
        (
            "openedx-lms-production-settings",
            """
MFE_CONFIG['INDIGO_ENABLE_DARK_TOGGLE'] = {{ INDIGO_ENABLE_DARK_TOGGLE }}
MFE_CONFIG['INDIGO_FOOTER_NAV_LINKS'] = {{ INDIGO_FOOTER_NAV_LINKS }}
""",
        ),
    ]
)


# Apply patches from tutor-indigo
for path in glob(
    os.path.join(
        str(importlib_resources.files("tutorindigo") / "patches"),
        "*",
    )
):
    with open(path, encoding="utf-8") as patch_file:
        hooks.Filters.ENV_PATCHES.add_item((os.path.basename(path), patch_file.read()))


FOOTER_WIDGET = """
{
    op: PLUGIN_OPERATIONS.Hide,
    widgetId: 'default_contents',
},
{
    op: PLUGIN_OPERATIONS.Insert,
    widget: {
        id: 'default_contents',
        type: DIRECT_PLUGIN,
        priority: 1,
        RenderWidget: <FooterWidget />,
    },
},
"""

ACCOUNT_FOOTER_WIDGET = FOOTER_WIDGET + """
{
    op: PLUGIN_OPERATIONS.Insert,
    widget: {
        id: 'multi_site_banner_injector',
        type: DIRECT_PLUGIN,
        RenderWidget: MultiSiteBannerWidget,
    },
},
"""

LEARNING_FOOTER_WIDGET = FOOTER_WIDGET + """
{
    op: PLUGIN_OPERATIONS.Insert,
    widget: {
        id: 'discussion_sidebar_closed_by_default',
        type: DIRECT_PLUGIN,
        RenderWidget: DiscussionSidebarWidget,
    },
},
"""

# EDLYCUSTOM: FooterWidget's FA6 CDN import breaks gradebook's own FA4 icons.
# Scoped to `main` so it doesn't touch Header/FooterSlot's own FA6 usage.
GRADEBOOK_FOOTER_WIDGET = FOOTER_WIDGET + """
{
    op: PLUGIN_OPERATIONS.Insert,
    widget: {
        id: 'edly_gradebook_fa4_icon_fix',
        type: DIRECT_PLUGIN,
        RenderWidget: () => (
            <style>
                {`
                    main .fa {
                        font-family: "FontAwesome" !important;
                        font-weight: normal !important;
                    }
                `}
            </style>
        ),
    },
},
"""

PAID_COURSE_UNENROLL_WIDGET = """
{
    op: PLUGIN_OPERATIONS.Insert,
    widget: {
        id: 'paid_course_unenroll_guard',
        type: DIRECT_PLUGIN,
        RenderWidget: PaidCourseUnenrollWidget,
    },
},
"""

HEADER_WIDGET = """
{
    op: PLUGIN_OPERATIONS.Hide,
    widgetId: 'default_contents',
},
{
    op: PLUGIN_OPERATIONS.Insert,
    widget: {
        id: 'custom_desktop_header_component',
        type: DIRECT_PLUGIN,
        priority: 1,
        RenderWidget: () => <HeaderWidget />
    },
},
"""

# No slot renders at the top of the learning MFE's content column, so the banner is mounted
# on the breadcrumbs slot and CourseBannerWidget prepends it into `.unit-container` -- the
# column holding the unit beside the course outline sidebar. That is where the banner sat
# before the upgrade. Renders nothing unless the tenant sets
# MFE_CONFIG.COURSE_BANNER_IMAGE_URL.
LEARNING_BANNER_WIDGET = """
{
    op: PLUGIN_OPERATIONS.Insert,
    widget: {
        id: 'edly_course_banner',
        type: DIRECT_PLUGIN,
        RenderWidget: () => <CourseBannerWidget placement="content" />,
    },
},
"""

# frontend-app-discussions ships only a FooterSlot -- no header/top slot -- so the banner
# mounts in the footer and CourseBannerWidget places it above `<main>`.
DISCUSSIONS_BANNER_WIDGET = """
{
    op: PLUGIN_OPERATIONS.Insert,
    widget: {
        id: 'edly_course_banner_injector',
        type: DIRECT_PLUGIN,
        RenderWidget: CourseBannerWidget,
    },
},
"""

CERTIFICATE_WIDGET =  """
{
    op: PLUGIN_OPERATIONS.Modify,
    widgetId: 'default_contents',
    fn: (widget) => {
        const { RenderWidget } = widget;
        if (RenderWidget.props.id === "notAvailable_certificate_status") {
            widget.RenderWidget = <></>;
        }

        return widget;
    },
},
"""

MFE_CONFIG = {
    "learning": {
        "footer_slot": LEARNING_FOOTER_WIDGET,
        "header_slot": HEADER_WIDGET,
        "course_breadcrumbs_slot": LEARNING_BANNER_WIDGET,
        "progress_certificate_status_slot": CERTIFICATE_WIDGET
    },
    "authoring": {
        "studio_footer_slot": FOOTER_WIDGET
    },
    "account": {
        "footer_slot": ACCOUNT_FOOTER_WIDGET,
        "desktop_header_slot": HEADER_WIDGET,
    },
    "gradebook": {
        "footer_slot": GRADEBOOK_FOOTER_WIDGET,
        "desktop_header_slot": HEADER_WIDGET,
    },
    # Own entry means no DEFAULT_CONFIG fallback, so desktop_header_slot is repeated here
    # to keep the header this MFE already got.
    "discussions": {
        "footer_slot": FOOTER_WIDGET + DISCUSSIONS_BANNER_WIDGET,
        "desktop_header_slot": HEADER_WIDGET,
    },
    "learner-dashboard": {
        # Keep the same footer/header widgets learner-dashboard already gets via
        # DEFAULT_CONFIG below - giving this MFE its own MFE_CONFIG entry means it no
        # longer falls back to DEFAULT_CONFIG at all, so those two must be repeated here.
        "footer_slot": FOOTER_WIDGET,
        "desktop_header_slot": HEADER_WIDGET,
        # No short alias exists for this slot (unlike footer_slot/desktop_header_slot),
        # so the full slot ID is used directly. Mounted here (page-level, once) rather
        # than in the per-card course_card_action_slot because PaidCourseUnenrollWidget
        # now targets the "⋮" menu's Unenroll item via DOM, not a per-card render slot.
        "org.openedx.frontend.learner_dashboard.dashboard_modal.v1": PAID_COURSE_UNENROLL_WIDGET,
    },
}

DEFAULT_CONFIG = {
    "footer_slot": FOOTER_WIDGET,
    "desktop_header_slot": HEADER_WIDGET,
}

for mfe in indigo_styled_mfes:
    config = MFE_CONFIG.get(mfe, DEFAULT_CONFIG)

    for slot_name, slot_content in config.items():
        PLUGIN_SLOTS.add_item(
            (
                mfe,
                slot_name,
                slot_content,
            )
        )
