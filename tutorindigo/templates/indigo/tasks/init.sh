# Assign themes only if no other theme exists yet
./manage.py lms shell -c "
import sys
from django.contrib.sites.models import Site
def assign_theme(domain):
    site, _ = Site.objects.get_or_create(domain=domain)
    if not site.themes.exists():
        site.themes.create(theme_dir_name='indigo')

assign_theme('{{ LMS_HOST }}')
assign_theme('{{ LMS_HOST }}')
assign_theme('{{ LMS_HOST }}:8000')
assign_theme('{{ CMS_HOST }}')
assign_theme('{{ CMS_HOST }}:8001')
"

# Set COURSE_CATALOG_API_URL on all LMS sites so that get_programs() reads from
# the Memcached catalog cache populated by rwaq_features.programs.cache.
# The URL value is a placeholder — it is never called; only its presence matters
# to satisfy the site_config guard in openedx.core.djangoapps.catalog.utils.
#
# create_or_update_site_configuration has a bug where it fails on get_or_create
# when the site already exists. Ensure all sites have names first (same workaround
# used by tutor-discovery), then update the configuration via shell directly.
./manage.py lms shell -c "
from django.contrib.sites.models import Site
from openedx.core.djangoapps.site_configuration.models import SiteConfiguration

name_max_length = Site._meta.get_field('name').max_length
for site in Site.objects.filter(name=''):
    site.name = site.domain[:name_max_length]
    site.save()

catalog_url_map = {
    '{{ LMS_HOST }}': '{% if ENABLE_HTTPS %}https{% else %}http{% endif %}://{{ LMS_HOST }}/api/v1',
    '{{ LMS_HOST }}:8000': 'http://{{ LMS_HOST }}:8000/api/v1',
}

for domain, catalog_url in catalog_url_map.items():
    try:
        site = Site.objects.get(domain=domain)
        config, _ = SiteConfiguration.objects.get_or_create(site=site, defaults={'enabled': True})
        values = config.site_values or {}
        values['COURSE_CATALOG_API_URL'] = catalog_url
        config.site_values = values
        config.enabled = True
        config.save()
        print(f'Set COURSE_CATALOG_API_URL for {domain}')
    except Site.DoesNotExist:
        print(f'Site {domain} not found, skipping')
"
