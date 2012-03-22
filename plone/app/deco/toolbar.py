from zope.component import getUtility
from zope.security import checkPermission
from plone.registry.interfaces import IRegistry
from plone.tiles.interfaces import ITileType
from plone.tiles import Tile
from plone.app.blocks import utils
from Acquisition import aq_inner


class DecoToolbarTile(Tile):

    def __init__(self, context, request):
        super(DecoToolbarTile, self).__init__(context, request)
        self.context = aq_inner(self.context)
        self.context_url = self.context.absolute_url()
        self.registry = getUtility(IRegistry)

    def tiles(self):
        tiles = []
        for tile_name in self.registry['plone.app.tiles']:
            tile = getUtility(ITileType, tile_name)

            # check if we have permission to add this tile
            if not checkPermission(tile.add_permission, self.context):
                continue

            tiles.append({
                'name': tile_name,
                'title': tile.title,
                'description': tile.description,
                })

        return tiles
