from Acquisition import aq_inner
from zope.component import getUtility
from zope.security import checkPermission
from plone.app.blocks import utils
from plone.tiles import Tile
from plone.tiles.interfaces import ITileDataManager
from plone.tiles.interfaces import ITileType
from plone.registry.interfaces import IRegistry
from plone.uuid.interfaces import IUUIDGenerator
from plone.app.deco import PloneMessageFactory as _
from plone.app.blocks.utils import bodyTileXPath
from lxml.html import tostring
from lxml.html import fromstring
from lxml.etree import XPath


bodyXPath = XPath('/html/body//*')

class DecoToolbarTile(Tile):

    def __init__(self, context, request):
        super(DecoToolbarTile, self).__init__(context, request)
        self.context = aq_inner(self.context)
        self.context_url = self.context.absolute_url()
        self.registry = getUtility(IRegistry)
        self.get_uuid = getUtility(IUUIDGenerator)

    def tiles(self):
        tiles = []
        for tile_name in self.registry['plone.app.tiles']:
            tiletype = getUtility(ITileType, tile_name)

            # check if we have permission to add this tile
            if not checkPermission(tiletype.add_permission, self.context):
                continue

            tile_id = self.get_uuid()
            addform_view  = self.context.restrictedTraverse(str(
                    '@@add-tile/%s/%s' % (tile_name, tile_id)))
            addform = bodyXPath(fromstring(addform_view()))

            form = ''
            if addform:
                for el in addform:
                    form += tostring(el)

            tiles.append({
                'name': tile_name,
                'title': tiletype.title,
                'description': tiletype.description,
                'url': '%s/@@%s' % (self.context_url, tile_name),
                'form': form,
                })

        return tiles
