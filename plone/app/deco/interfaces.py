from zope.interface import Interface
from zope import schema

from plone.app.deco import PloneMessageFactory as _

DEFAULT_PAGE_LAYOUT_CONTENT = u"""\
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en" data-layout="./@@page-site-layout">
  <head>
    <link rel="panel" rev="content" target="content" />
  </head>
  <body>
    <div id="content">
    </div>
  </body>
</html>

"""

DEFAULT_SITE_LAYOUT_CONTENT = u"""\
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
    <link rel="panel" rev="content" target="content" />
    
    <link rel="tile" href="./@@plone.app.standardtiles.headtitle" />
    <link rel="tile" href="./@@plone.app.standardtiles.stylesheets" />
    <link rel="tile" href="./@@plone.app.standardtiles.javascripts" />
    
    <link rel="tile" target="menu-link" href="./@@plone.app.standardtiles.menu_link" />
</head>
<body>
    <div id="menu-link" />
    <div id="content" />
  </body>
</html>
"""

class IDecoRegistryAdapter(Interface):
    """Marker interface for the registry adapter"""


class IWeightedDict(Interface):
    name = schema.TextLine(title=_(u"Name"))
    label = schema.TextLine(title=_(u"Label"))
    weight = schema.Int(title=_(u"Weight"))


class IFormat(Interface):
    """Interface for the format configuration in the registry"""
    name = schema.TextLine(title=_(u"Name"))
    category = schema.TextLine(title=_(u"Category"))
    label = schema.TextLine(title=_(u"Label"))
    action = schema.TextLine(title=_(u"Action"))
    icon = schema.Bool(title=_(u"Icon"))
    favorite = schema.Bool(title=_(u"Favorite"))
    weight = schema.Int(title=_(u"Weight"))


class IAction(Interface):
    name = schema.TextLine(title=_(u"Name"))
    fieldset = schema.TextLine(title=_(u"Fieldset"))
    label = schema.TextLine(title=_(u"Label"))
    action = schema.TextLine(title=_(u"Action"))
    icon = schema.Bool(title=_(u"Icon"))
    menu = schema.Bool(title=_(u"Menu"))
    weight = schema.Int(title=_(u"Weight"))


class IFieldTile(Interface):
    """Interface for the field tile configuration in the registry
    """
    id = schema.TextLine(title=_(u"The widget id"))
    name = schema.TextLine(title=_(u"Name"))
    label = schema.TextLine(title=_(u"Label"))
    category = schema.TextLine(title=_(u"Category"))
    tile_type = schema.TextLine(title=_(u"Type"))
    read_only = schema.Bool(title=_(u"Read only"))
    favorite = schema.Bool(title=_(u"Favorite"))
    widget = schema.TextLine(title=_(u"Field widget"))
    available_actions = schema.List(title=_(u"Actions"),
                                    value_type=schema.TextLine())


class ITile(Interface):
    """Interface for the tile configuration in the registry"""
    name = schema.TextLine(title=_(u"Name"))
    label = schema.TextLine(title=_(u"Label"))
    category = schema.TextLine(title=_(u"Category"))
    tile_type = schema.TextLine(title=_(u"Type"))
    default_value = schema.TextLine(title=_(u"Default value"), required=False)
    read_only = schema.Bool(title=_(u"Read only"))
    settings = schema.Bool(title=_(u"Settings"))
    favorite = schema.Bool(title=_(u"Favorite"))
    rich_text = schema.Bool(title=_(u"Rich Text"))
    weight = schema.Int(title=_(u"Weight"))


class IWidgetAction(Interface):
    name = schema.TextLine(title=_(u"Name"))
    actions = schema.List(title=_(u"Actions"),
                          value_type=schema.TextLine())

class ILayoutWidget(Interface):
    """Marker interface for the layout widget
    """
