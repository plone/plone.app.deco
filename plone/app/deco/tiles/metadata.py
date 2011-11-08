from plone.app.deco.interfaces import IMetadataTile
from plone.tiles.tile import Tile
from zope.interface import implements


class BaseMetadataTile(Tile):
    """The base class for metadata tiles (such as title and description)
    """

    implements(IMetadataTile)

    def get_value(self):
        return u""

    @property
    def value(self):
        return self.get_value()


class DefaultTitleTile(BaseMetadataTile):
    """A default tile for title
    """

    def get_value(self):
        return u"Insert the content title here"


class DefaultDescriptionTile(BaseMetadataTile):
    """A default tile for description
    """

    def get_value(self):
        return u"Insert the content description here"


class DexterityTitleTile(BaseMetadataTile):
    """A tile for dexterity content title
    """

    def get_value(self):
        return self.context.title


class DexterityDescriptionTile(BaseMetadataTile):
    """A tile for dexterity content description
    """

    def get_value(self):
        return self.context.description
