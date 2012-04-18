from Acquisition import aq_inner
from zope.component import getUtility
from zope.component import getMultiAdapter
from zope.security import checkPermission
from plone.app.blocks import utils
from plone.tiles import Tile
from plone.tiles.interfaces import ITileDataManager
from plone.tiles.interfaces import ITileType
from plone.registry.interfaces import IRegistry
from plone.uuid.interfaces import IUUIDGenerator
from plone.app.deco import PloneMessageFactory as _
from plone.app.tiles.interfaces import ITileAddView
from plone.app.blocks.utils import bodyTileXPath
from lxml.html import tostring
from lxml.html import fromstring
from lxml.etree import XPath



class DecoToolbarTile(Tile):

    def __init__(self, context, request):
        super(DecoToolbarTile, self).__init__(context, request)
        self.context = aq_inner(self.context)
        self.context_url = self.context.absolute_url()
        self.registry = getUtility(IRegistry)
        self.get_uuid = getUtility(IUUIDGenerator)

    def tiles(self):
        tiles = []
        bodyXPath = XPath("descendant-or-self::*[@id = 'portal-column-content']")
        for tile_name in self.registry['plone.app.tiles']:
            tiletype = getUtility(ITileType, tile_name)

            # check if we have permission to add this tile
            if not checkPermission(tiletype.add_permission, self.context):
                continue

            try:
                form_view = getMultiAdapter(
                    (self.context, self.request, tiletype),
                        ITileAddView, name=tile_name)
            except:
                form_view = getMultiAdapter(
                    (self.context, self.request, tiletype),
                        ITileAddView)

            form_view.tileId = self.get_uuid()
            form_etree = bodyXPath(fromstring(form_view()))

            form = ''.join([tostring(i) for i in form_etree])

            tiles.append({
                'name': tile_name,
                'title': tiletype.title,
                'description': tiletype.description,
                'url': '%s/@@%s' % (self.context_url, tile_name),
                'form': form,
                })

        return tiles
