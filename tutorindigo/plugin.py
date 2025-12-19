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
    "learner-record",
]

# Edly: MFEs that get the base brand CSS overrides (standard 5)
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
RUN npm install '@anas_hameed/edly-saas-widget'
RUN npm install '@edx/brand@github:@edly-io/brand-openedx#indigo-2.5.3'
""",  # noqa: E501
            ),
            (
                f"mfe-env-config-runtime-definitions-{mfe}",
                """
const { HeaderWidget, FooterWidget, MultiSiteBannerWidget } = require("@anas_hameed/edly-saas-widget");
""",
            ),
        ]
    )

hooks.Filters.ENV_PATCHES.add_item(
    (
        "mfe-dockerfile-post-npm-install-authn",
        """
RUN npm install '@edx/brand@github:@edly-io/brand-openedx#indigo-2.5.3'
RUN npm install @anas_hameed/edly-saas-widget
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


# Add react components and patches from tutor-indigo
for path in itertools.chain(
    glob(
        os.path.join(str(importlib_resources.files("tutorindigo") / "components"), "*")
    ),
    glob(os.path.join(str(importlib_resources.files("tutorindigo") / "patches"), "*")),
):
    with open(path, encoding="utf-8") as patch_file:
        hooks.Filters.ENV_PATCHES.add_item((os.path.basename(path), patch_file.read()))


# Edly: Custom header/footer widget slot configs (SaaS widget injection)
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

CERTIFICATE_WIDGET = """
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
        "footer_slot": FOOTER_WIDGET,
        "header_slot": HEADER_WIDGET,
        "progress_certificate_status_slot": CERTIFICATE_WIDGET,
    },
    "authoring": {
        "studio_footer_slot": FOOTER_WIDGET,
    },
    "account": {
        "footer_slot": ACCOUNT_FOOTER_WIDGET,
        "desktop_header_slot": HEADER_WIDGET,
    },
}

DEFAULT_CONFIG = {
    "footer_slot": FOOTER_WIDGET,
    "desktop_header_slot": HEADER_WIDGET,
}

for mfe in indigo_styled_mfes:
    mfe_config = MFE_CONFIG.get(mfe, DEFAULT_CONFIG)

    for slot_name, slot_content in mfe_config.items():
        PLUGIN_SLOTS.add_item(
            (
                mfe,
                slot_name,
                slot_content,
            )
        )


# Upstream: Indigo footer, theme toggle, and mobile header slots
for mfe in ["learning", "learner-dashboard", "profile", "account", "discussions"]:
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
    ]
)

paragon_theme_urls = {
    "variants": {
        "light": {
            "urls": {
                "default": "https://raw.githubusercontent.com/edly-io/brand-openedx/refs/heads/ulmo/indigo/dist/light.min.css",
                "brandOverride": "https://raw.githubusercontent.com/edly-io/brand-openedx/refs/heads/ulmo/indigo/dist/light.min.css",
            },
        },
        "dark": {
            "urls": {
                "default": "https://raw.githubusercontent.com/edly-io/brand-openedx/refs/heads/ulmo/indigo/dist/dark.min.css",
                "brandOverride": "https://raw.githubusercontent.com/edly-io/brand-openedx/refs/heads/ulmo/indigo/dist/dark.min.css",
            }
        },
    }
}

fstring = f"""
MFE_CONFIG["PARAGON_THEME_URLS"] = {json.dumps(paragon_theme_urls)}
"""

hooks.Filters.ENV_PATCHES.add_item(("mfe-lms-common-settings", fstring))


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
