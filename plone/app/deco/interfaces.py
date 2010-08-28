from zope.interface import Interface
from zope import schema


class IDecoRegistryAdapter(Interface):
    """Marker interface for the registry adapter"""


class IWeightedDict(Interface):
    name = schema.TextLine(title=u"Name")
    label = schema.TextLine(title=u"Label")
    weight = schema.Int(title=u"Weight")


class IFormat(Interface):
    """Interface for the format configuration in the registry"""
    name = schema.TextLine(title=u"Name")
    category = schema.TextLine(title=u"Category")
    label = schema.TextLine(title=u"Label")
    action = schema.TextLine(title=u"Action")
    icon = schema.Bool(title=u"Icon")
    favorite = schema.Bool(title=u"Favorite")
    weight = schema.Int(title=u"Weight")


class IAction(Interface):
    name = schema.TextLine(title=u"Name")
    fieldset = schema.TextLine(title=u"Fieldset")
    label = schema.TextLine(title=u"Label")
    action = schema.TextLine(title=u"Action")
    icon = schema.Bool(title=u"Icon")
    menu = schema.Bool(title=u"Menu")
    weight = schema.Int(title=u"Weight")


class IFieldTile(Interface):
    """Interface for the field tile configuration in the registry
    """
    id = schema.TextLine(title=u"The widget id")
    name = schema.TextLine(title=u"Name")
    label = schema.TextLine(title=u"Label")
    category = schema.TextLine(title=u"Category")
    tile_type = schema.TextLine(title=u"Type")
    read_only = schema.Bool(title=u"Read only")
    favorite = schema.Bool(title=u"Favorite")
    widget = schema.TextLine(title=u"Field widget")
    available_actions = schema.List(title=u"Actions",
                                    value_type=schema.TextLine())


class ITile(Interface):
    """Interface for the tile configuration in the registry"""
    name = schema.TextLine(title=u"Name")
    label = schema.TextLine(title=u"Label")
    category = schema.TextLine(title=u"Category")
    tile_type = schema.TextLine(title=u"Type")
    default_value = schema.TextLine(title=u"Default value", required=False)
    read_only = schema.Bool(title=u"Read only")
    settings = schema.Bool(title=u"Settings")
    favorite = schema.Bool(title=u"Favorite")
    rich_text = schema.Bool(title=u"Rich Text")
    weight = schema.Int(title=u"Weight")

class IWidgetAction(Interface):
    name = schema.TextLine(title=u"Name")
    actions = schema.List(title=u"Actions",
                          value_type=schema.TextLine())


