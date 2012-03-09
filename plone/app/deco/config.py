
import lxml
from urlparse import urljoin
from zope.interface import implements
from zope.component import adapts
from zope.component import getUtility
from zope.i18n import translate
from zope.publisher.browser import BrowserView
from plone.app.blocks import utils
from plone.registry.interfaces import IRegistry
from plone.app.deco.interfaces import ITile
from plone.app.deco.interfaces import IDecoConfig
from plone.app.deco import PloneMessageFactory as _

try:
    import json
except:
    import simplejson as json


TRANSLATIONS = {

    # tiles categories
    'tiles-category-structure-label':
        _(u'tiles-category-structure-label', default=u'Structure'),
    'tiles-category-media-label':
        _(u'tiles-category-media-label', default=u'Media'),
    'tiles-category-fields-label':
        _(u'tiles-category-fields-label', default=u'Fields'),
    'tiles-category-applications-label':
        _(u'tiles-category-applications-label', default=u'Applications'),
    'tiles-category-properties-label':
        _(u'tiles-category-properties-label', default=u'Properties'),
    'tiles-category-advanced-label':
        _(u'tiles-category-advanced-label', default=u'Advanced'),

    # tiles
    'tile-text-label':
        _(u'tile-text-label', default=u'Text'),
    'tile-plone.app.deco.title-label':
        _(u'tile-plone.app.deco.title-label', default=u'Title'),
    'tile-plone.app.deco.description-label':
        _(u'tile-plone.app.deco.description-label', default=u'Description'),

}


class DecoConfigView(BrowserView):
    """ JSON view of deco configuration.
    """

    def __call__(self):
        self.request.response.setHeader('Content-Type', 'application/json')
        config = IDecoConfig(getUtility(IRegistry))(self.request)
        return json.dumps(config)


class DecoConfig(object):
    """ Adapts a registry object to parse the deco settings data.
    """

    implements(IDecoConfig)
    adapts(IRegistry)
    prefix = "plone.app.deco"

    def __init__(self, registry):
        self.registry = registry

    def __call__(self, request):
        return {
            'panels': self.panels(request),
            'tiles_options': self.tiles_options(request),
            'buttons_order': [],
            'buttons': {},
            'tiles': self.tiles(request),
                }

    def panels(self, request):
        panels = {}
        panels['content'] = {
            '': ''
            }
        return panels

    def tiles_options(self, request):
        categories = []
        for category in self.registry.get(
                self.prefix + '.tiles_categories', []):

            category_label_id = 'tiles-category-' + category + '-label'
            if category_label_id in TRANSLATIONS:
                category_label = translate(
                        TRANSLATIONS[category_label_id],
                        context=request,
                        )
            else:
                category_label = translate(
                        _(category_label_id),
                        context=request,
                        )

            categories.append({
                'name': category,
                'label': category_label,
                })

        return categories

    def tiles(self, request):
        tiles = []
        baseURL = request.getURL()
        for tile_id in self.registry[self.prefix + '.tiles']:
            tile = self.registry.forInterface(ITile, prefix=tile_id)

            tile_label_id = 'tile-' + tile.name + '-label'
            if tile_label_id in TRANSLATIONS:
                tile_label = translate(
                        TRANSLATIONS[tile_label_id],
                        context=request,
                        )
            else:
                tile_label = translate(
                        _(tile_label_id, default=tile.label),
                        context=request)

            tile_default = ''
            tile_url = urljoin(baseURL, '@@' + tile.name)
            try:
                tile_el = utils.resolve(tile_url).find('body')
                tile_default = (tile_el.text or '') + \
                    ''.join([lxml.html.tostring(child) for child in tile_el])
            except:
                pass

            tiles.append({
                'title': tile_label,
                'url': tile_url,
                'id': tile_id,
                'group': tile.group,
                'icon': tile.icon,
                'name': tile.name,
                'default_content': tile_default,
                })

        return tiles
