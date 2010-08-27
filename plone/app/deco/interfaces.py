from zope.interface import Interface
from zope import schema


class IDecoRegistryAdapter(Interface):
    """Marker interface for the registry adapter"""


class IFormat(Interface):
    """Interface for the format configuration in the registry"""
    name = schema.TextLine(title=u"Name")
    category = schema.TextLine(title=u"Category")
    label = schema.TextLine(title=u"Label")
    action = schema.TextLine(title=u"Action")
    icon = schema.Bool(title=u"Icon")
    favorite = schema.Bool(title=u"Favorite")

class ITile(Interface):
    """Interface for the tile configuration in the registry"""
    label = schema.TextLine(title=u"Label")
    category = schema.TextLine(title=u"Category")
    type = schema.TextLine(title=u"Type")
    default_value = schema.TextLine(title=u"Default value",
                                    required=False)
    read_only = schema.Bool(title=u"Read only")    
    settings = schema.Bool(title=u"Settings")    
    favorite = schema.Bool(title=u"Favorite")    
    rich_text = schema.Bool(title=u"Rich Text")    
