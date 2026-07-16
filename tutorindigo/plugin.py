from __future__ import annotations

import itertools
import json
import os
import typing as t
from glob import glob

import importlib_resources
from tutor import hooks
from tutor.__about__ import __version_suffix__
from tutormfe.hooks import MFE_APPS, MFE_ATTRS_TYPE, PLUGIN_SLOTS

from .__about__ import __version__

# Handle version suffix in main mode, just like tutor core
if __version_suffix__:
    __version__ += "-" + __version_suffix__


hooks.Filters.MOUNTED_DIRECTORIES.add_items([
    ("openedx", "rwaq-features"),
])


################# Configuration
config: t.Dict[str, t.Dict[str, t.Any]] = {
    # Add here your new settings
    "defaults": {
        "VERSION": __version__,
        "WELCOME_MESSAGE": "The place for all your online learning",
        "PRIMARY_COLOR": "#449CC2",  # Rwaq
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
hooks.Filters.CONFIG_DEFAULTS.add_item(("PAT", ""))
hooks.Filters.CONFIG_DEFAULTS.add_item(("ENABLE_PROGRAMS", False))
hooks.Filters.CONFIG_DEFAULTS.add_item(("COURSE_ACCESS_DURATION_MIN_WEEKS", 12))
hooks.Filters.CONFIG_DEFAULTS.add_item(("COURSE_ACCESS_DURATION_MAX_WEEKS", 18))
hooks.Filters.CONFIG_UNIQUE.add_items(
    [(f"INDIGO_{key}", value) for key, value in config["unique"].items()]
)
hooks.Filters.CONFIG_OVERRIDES.add_items(list(config["overrides"].items()))

hooks.Filters.CONFIG_DEFAULTS.add_item(("RWAQ_VIDEO_S3_BUCKET", ""))
# Regional S3 endpoint for the video bucket. edx-platform's video upload code
# (storage_service_bucket) uses boto2's S3Connection, which defaults to the
# global s3.amazonaws.com endpoint and SigV2 -- rejected by buckets outside
# us-east-1. Point boto at the bucket's regional host and force SigV4 (below).
hooks.Filters.CONFIG_DEFAULTS.add_item(
    ("RWAQ_VIDEO_S3_HOST", "s3.eu-central-1.amazonaws.com")
)

hooks.Filters.ENV_PATCHES.add_items(
    [
        (
            "cms-env-features",
            """
{% if RWAQ_VIDEO_S3_BUCKET %}
ENABLE_VIDEO_UPLOAD_PIPELINE: true
{% endif %}
""",
        ),
        (
            "cms-env",
            """
{% if RWAQ_VIDEO_S3_BUCKET %}
VIDEO_UPLOAD_PIPELINE:
  VEM_S3_BUCKET: "{{ RWAQ_VIDEO_S3_BUCKET }}"
  BUCKET: "{{ RWAQ_VIDEO_S3_BUCKET }}"
  ROOT_PATH: "video"
  CONCURRENT_UPLOAD_LIMIT: 4
{% endif %}
""",
        ),
        (
            "mfe-lms-common-settings",
            """
{% if RWAQ_VIDEO_S3_BUCKET %}
MFE_CONFIG['ENABLE_VIDEO_UPLOAD_PAGE_LINK_IN_CONTENT_DROPDOWN'] = 'true'
{% endif %}
""",
        ),
        (
            "mfe-cms-common-settings",
            """
{% if RWAQ_VIDEO_S3_BUCKET %}
MFE_CONFIG['ENABLE_VIDEO_UPLOAD_PAGE_LINK_IN_CONTENT_DROPDOWN'] = 'true'
{% endif %}
""",
        ),
        # storage_service_bucket() presigns the upload URL with boto2's
        # S3Connection, which uses the global endpoint + SigV2. Buckets outside
        # us-east-1 (ours is eu-central-1) reject SigV2 with HTTP 400
        # ("Please use AWS4-HMAC-SHA256"). Force SigV4 and point boto at the
        # regional endpoint via boto's own config, at CMS settings import time.
        (
            "openedx-cms-common-settings",
            """
{% if RWAQ_VIDEO_S3_BUCKET %}
import os as _os
_os.environ["S3_USE_SIGV4"] = "True"
try:
    import boto as _boto
    if not _boto.config.has_section("s3"):
        _boto.config.add_section("s3")
    _boto.config.set("s3", "use-sigv4", "True")
    _boto.config.set("s3", "host", "{{ RWAQ_VIDEO_S3_HOST }}")
except ImportError:
    pass
{% endif %}
""",
        ),
    ]
)

# The pipeline settings above are necessary but not sufficient: the upload
# endpoints (generate_video_upload_link / videos_handler) still 404 until
# `course.video_pipeline_configured` is true. That relies on
# VideoUploadsEnabledByDefault.feature_enabled(), which returns true for every
# course only when BOTH `enabled` and `enabled_for_all_courses` are set (with
# `enabled` alone it falls back to per-course CourseVideoUploadsEnabledByDefault
# rows). Enable both, platform-wide, at init time.
hooks.Filters.CLI_DO_INIT_TASKS.add_item(
    (
        "cms",
        """
{% if RWAQ_VIDEO_S3_BUCKET %}
./manage.py cms shell -c "
from openedx.core.djangoapps.video_pipeline.models import VideoUploadsEnabledByDefault
current = VideoUploadsEnabledByDefault.current()
if not (current.enabled and current.enabled_for_all_courses):
    VideoUploadsEnabledByDefault.objects.create(enabled=True, enabled_for_all_courses=True)
    print('indigo: enabled VideoUploadsEnabledByDefault for all courses')
else:
    print('indigo: VideoUploadsEnabledByDefault already enabled for all courses')
"
{% endif %}
""",
    )
)


#  MFEs that are styled using Indigo
indigo_styled_mfes = [
    "learning",
    "learner-dashboard",
    "profile",
    "account",
    "discussions",
    "authoring",
]

for mfe in indigo_styled_mfes:
    hooks.Filters.ENV_PATCHES.add_items(
        [
            (
                f"mfe-dockerfile-post-npm-install-{mfe}",
                """
RUN npm install '@edx/brand@github:@edly-io/brand-openedx#ulmo/rwaq'
""",  # noqa: E501
            ),
        ]
    )

hooks.Filters.ENV_PATCHES.add_item(
    (
        "mfe-dockerfile-post-npm-install-authn",
        "RUN npm install '@edx/brand@github:@edly-io/brand-openedx#ulmo/rwaq'",
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


# Add react components and patches from tutor-indigo
for path in itertools.chain(
    glob(
        os.path.join(str(importlib_resources.files("tutorindigo") / "components"), "*")
    ),
    glob(os.path.join(str(importlib_resources.files("tutorindigo") / "patches"), "*")),
):
    with open(path, encoding="utf-8") as patch_file:
        hooks.Filters.ENV_PATCHES.add_item((os.path.basename(path), patch_file.read()))


PLUGIN_SLOTS.add_item(
    (
        "authoring",
        "org.openedx.frontend.layout.studio_footer.v1",
        """
            {
                op: PLUGIN_OPERATIONS.Hide,
                widgetId: 'default_contents',
            },
            {
                op: PLUGIN_OPERATIONS.Insert,
                widget: {
                    id: 'indigo_footer',
                    type: DIRECT_PLUGIN,
                    priority: 1,
                    RenderWidget: IndigoFooter,
                },
            },
            {
                op: PLUGIN_OPERATIONS.Insert,
                widget: {
                    id: 'read_theme_cookie',
                    type: DIRECT_PLUGIN,
                    priority: 2,
                    RenderWidget: AddDarkTheme,
                },
            },
  """,
    ),
)


for mfe in indigo_styled_mfes:
    PLUGIN_SLOTS.add_item(
        (
            mfe,
            "org.openedx.frontend.layout.footer.v1",
            """
            {
                op: PLUGIN_OPERATIONS.Hide,
                widgetId: 'default_contents',
            },
            {
                op: PLUGIN_OPERATIONS.Insert,
                widget: {
                    id: 'indigo_footer',
                    type: DIRECT_PLUGIN,
                    priority: 1,
                    RenderWidget: IndigoFooter,
                },
            },
            {
                op: PLUGIN_OPERATIONS.Insert,
                widget: {
                    id: 'read_theme_cookie',
                    type: DIRECT_PLUGIN,
                    priority: 2,
                    RenderWidget: AddDarkTheme,
                },
            },
  """,
        ),
    )
    if mfe != "learning":
        PLUGIN_SLOTS.add_item(
            (
                mfe,
                "desktop_main_menu_slot",
                """
                {
                    op: PLUGIN_OPERATIONS.Insert,
                    widget: {
                        id: 'home_nav_link',
                        type: DIRECT_PLUGIN,
                        priority: 1,
                        RenderWidget: HomeNavLink,
                    },
                },
        """,
            )
        )
        PLUGIN_SLOTS.add_item(
            (
                mfe,
                "desktop_secondary_menu_slot",
                """
                {
                    op: PLUGIN_OPERATIONS.Insert,
                    widget: {
                        id: 'theme_switch_button',
                        type: DIRECT_PLUGIN,
                        RenderWidget: ToggleThemeButton,
                    },
                },
        """,
            )
        )
        PLUGIN_SLOTS.add_items(
            [
                (
                    # Hide the default mobile header as it only shows logo
                    mfe,
                    "mobile_header_slot",
                    """
                {
                    op: PLUGIN_OPERATIONS.Hide,
                    widgetId: 'default_contents',
                }
                """,
                ),
                (
                    mfe,
                    "mobile_header_slot",
                    """
                {
                    op: PLUGIN_OPERATIONS.Insert,
                    widget: {
                        id: 'theme_switch_button',
                        type: DIRECT_PLUGIN,
                        RenderWidget: MobileViewHeader,
                    },
                },
                """,
                ),
            ]
        )

PLUGIN_SLOTS.add_items(
    [
        (
            # Hide the default Help Link added in plugin slot
            "learning",
            "learning_help_slot",
            """
        {
            op: PLUGIN_OPERATIONS.Hide,
            widgetId: 'default_contents',
        }
        """,
        ),
        (
            "learning",
            "learning_help_slot",
            """
        {
            op: PLUGIN_OPERATIONS.Insert,
            widget: {
                id: 'theme_switch_button',
                type: DIRECT_PLUGIN,
                RenderWidget: ToggleThemeButton,
            },
        },
        """,
        ),
        (
            "learning",
            "org.openedx.frontend.layout.learning_header_actions.v1",
            """
        {
            op: PLUGIN_OPERATIONS.Insert,
            widget: {
                id: 'home_nav_link',
                type: DIRECT_PLUGIN,
                priority: 1,
                RenderWidget: HomeNavLink,
            },
        },
        """,
        ),
    ]
)

paragon_theme_urls = {
    "variants": {
        "light": {
            "urls": {
                "default": "https://raw.githubusercontent.com/edly-io/brand-openedx/refs/heads/ulmo/rwaq/dist/light.min.css",
                "brandOverride": "https://raw.githubusercontent.com/edly-io/brand-openedx/refs/heads/ulmo/rwaq/dist/light.min.css",
            },
        },
        "dark": {
            "urls": {
                "default": "https://raw.githubusercontent.com/edly-io/brand-openedx/refs/heads/ulmo/rwaq/dist/dark.min.css",
                "brandOverride": "https://raw.githubusercontent.com/edly-io/brand-openedx/refs/heads/ulmo/rwaq/dist/dark.min.css",
            }
        },
    }
}

fstring = f"""
MFE_CONFIG["PARAGON_THEME_URLS"] = {json.dumps(paragon_theme_urls)}
"""

hooks.Filters.ENV_PATCHES.add_item(("mfe-lms-common-settings", fstring))
hooks.Filters.ENV_PATCHES.add_item(("mfe-cms-common-settings", fstring))


@MFE_APPS.add()  # type: ignore
def _add_themed_logo(
    mfes: dict[str, MFE_ATTRS_TYPE],
) -> dict[str, MFE_ATTRS_TYPE]:
    for mfe in mfes:
        PLUGIN_SLOTS.add_item(
            (
                str(mfe),
                "logo_slot",
                """
                {
                    op: PLUGIN_OPERATIONS.Hide,
                    widgetId: 'default_contents',
                },
                {
                    op: PLUGIN_OPERATIONS.Insert,
                    widget: {
                        id: 'custom_logo',
                        type: DIRECT_PLUGIN,
                        RenderWidget: ThemedLogo,
                    }
                }
            """,
            )
        )

    return mfes


@MFE_APPS.add()
def _add_my_mfe(mfes):  # type: ignore[no-untyped-def]
    mfes["authoring"] = {
        "repository": "https://github.com/edly-io/frontend-app-authoring.git",
        "port": 2001,
        "version": "ulmo/rwaq",
    }
    mfes["learner-dashboard"] = {
        "repository": "https://github.com/edly-io/frontend-app-learner-dashboard.git",
        "port": 1996,
        "version": "ulmo/rwaq",
    }
    mfes["learning"] = {
        "repository": "https://github.com/edly-io/frontend-app-learning.git",
        "port": 2000,
        "version": "ulmo/rwaq",
    }

    return mfes
