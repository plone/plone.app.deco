from zope.interface import implements, classProvides
from zope.component import getUtility

from persistent import Persistent
from zope.schema.fieldproperty import FieldProperty

from plone.app.deco.interfaces import IDecoSettingsStorage, IDecoStyleSettingsStorage, IDecoTileSettingsStorage

def form_adapter(context):
    """Form Adapter"""
    return getUtility(IDecoSettingsStorage, name='deco_config', context=context)

class DecoSettingsStorage(Persistent):
    implements(IDecoSettingsStorage)
    classProvides(
        IDecoStyleSettingsStorage,
        IDecoTileSettingsStorage,
        )

    styles = FieldProperty(IDecoStyleSettingsStorage['styles'])
    structure_tiles = FieldProperty(IDecoTileSettingsStorage['structure_tiles'])
