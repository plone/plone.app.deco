from zope.interface import Interface
from zope import schema
from zope.i18nmessageid import MessageFactory
from plone.directives import form

_ = MessageFactory('plone.app.deco')


class IDecoSettings(form.Schema):
    """This interface defines the deco settings."""

    form.fieldset('actions',
            label=_(u"Actions"),
            fields=['default_available_actions', 'primary_actions', 'secondary_actions'],
        )

    primary_actions = schema.List(
        title=_(u"Primary actions"),
        description=_(u"Enter a list of primary actions. Format is name|fieldsetname|fieldsetlable|label|action|icon|menu|item1value|item1label|item2value... one per line."),
        value_type=schema.TextLine(),
        required=False)

    secondary_actions = schema.List(
        title=_(u"Secondary actions"),
        description=_(u"Enter a list of secondary actions. Format is name|fieldsetname|fieldsetlable|label|action|icon|menu|item1value|item1label|item2value... one per line."),
        value_type=schema.TextLine(),
        required=False)

    default_available_actions = schema.List(
        title=_(u"Default available actions"),
        description=_(u"Enter a list of default available actions, one per line."),
        value_type=schema.TextLine(),
        required=False)

    form.fieldset('formats',
            label=_(u"Styles"),
            fields=['formats'],
        )

#    format_categories = schema.List(
#        title=_(u"Style categories"),
#        description=_(u"Enter a list of format categories. Format is name|label, one format per line."),
#        value_type=schema.TextLine(),
#        required=False)

#    formats = schema.List(
#        title=_(u"Styles"),
#        description=_(u"Enter a list of formats. Format is name|category|label|action|icon|favorite, one format per line."),
#        value_type=schema.TextLine(),
#        required=False)

#    form.fieldset('tiles',
#            label=_(u"Tiles"),
#            fields=['tile_categories', 'structure_tiles', 'app_tiles'],
#        )

#    tile_categories = schema.List(
#        title=_(u"Tile categories"),
#        description=_(u"Enter a list of tile categories. Format is name|title, one format per line."),
#        value_type=schema.TextLine(),
#        required=False)

#    structure_tiles = schema.List(
#        title=_(u"Structure tiles"),
#        description=_(u"Enter a list of structure tiles. Format is name|category|label|type|default_value|read_only|settings|favorite|rich_text|available_actions, one format per line."),
#        value_type=schema.TextLine(),
#        required=False)

#    app_tiles = schema.List(
#        title=_(u"Application tiles"),
#        description=_(u"Enter a list of application tiles. Format is name|category|label|read_only|settings|favorite|rich_text|available_actions, one format per line."),
#        value_type=schema.TextLine(),
#        required=False)


class IDecoRegistryAdapter(Interface):
    """Marker interface for the registry adapter"""


class IFormat(Interface):
    name = schema.TextLine(title=u"Name")
    category = schema.TextLine(title=u"Category")
    label = schema.TextLine(title=u"Label")
    action = schema.TextLine(title=u"Action")
    icon = schema.Bool(title=u"Icon")
    favorite = schema.Bool(title=u"Favorite")
