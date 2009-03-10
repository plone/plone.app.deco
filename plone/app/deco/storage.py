from zope.interface import implements, classProvides

from persistent import Persistent
from zope.schema.fieldproperty import FieldProperty

from plone.app.deco.interfaces import IDecoSettingsStorage, IDecoStyleSettingsStorage, IDecoTileSettingsStorage

class DecoSettingsStorage(Persistent):
    implements(IDecoSettingsStorage)
    classProvides(
        IDecoStyleSettingsStorage,
        IDecoTileSettingsStorage,
        )

    styles = FieldProperty(IDecoStyleSettingsStorage['styles'])
    structure_tiles = FieldProperty(IDecoTileSettingsStorage['structure_tiles'])
