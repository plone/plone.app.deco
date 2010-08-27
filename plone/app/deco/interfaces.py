from zope.interface import Interface
from zope import schema


class IDecoRegistryAdapter(Interface):
    """Marker interface for the registry adapter"""


class IFormat(Interface):
    name = schema.TextLine(title=u"Name")
    category = schema.TextLine(title=u"Category")
    label = schema.TextLine(title=u"Label")
    action = schema.TextLine(title=u"Action")
    icon = schema.Bool(title=u"Icon")
    favorite = schema.Bool(title=u"Favorite")
