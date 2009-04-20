from zope.interface import Interface
from zope import schema
from zope.i18nmessageid import MessageFactory
from plone.directives import form

_ = MessageFactory('plone.app.deco')

class IDecoSettings(form.Schema):
    """This interface defines the deco settings."""

    form.fieldset('actions', 
            label=_(u"Actions"),
            fields=['default_available_actions', 'primary_actions', 'secondary_actions']
        )

    primary_actions = schema.List(
        title=_(u"Primary actions"),
        description=_(u"Enter a list of primary actions. Format is name|fieldsetname|fieldsetlable|label|action|icon|menu|item1value|item1label|item2value... one per line."),
        value_type=schema.TextLine(),
        required=False)
    form.widget(primary_actions='plone.z3cform.textlines.TextLinesFieldWidget')

    secondary_actions = schema.List(
        title=_(u"Secondary actions"),
        description=_(u"Enter a list of secondary actions. Format is name|fieldsetname|fieldsetlable|label|action|icon|menu|item1value|item1label|item2value... one per line."),
        value_type=schema.TextLine(),
        required=False)
    form.widget(secondary_actions='plone.z3cform.textlines.TextLinesFieldWidget')

    default_available_actions = schema.List(
        title=_(u"Default available actions"),
        description=_(u"Enter a list of default available actions, one per line."),
        value_type=schema.TextLine(),
        required=False)
    form.widget(default_available_actions='plone.z3cform.textlines.TextLinesFieldWidget')

    form.fieldset('styles', 
            label=_(u"Styles"),
            fields=['style_categories', 'styles']
        )

    style_categories = schema.List(
        title=_(u"Style categories"),
        description=_(u"Enter a list of style categories. Format is name|label, one style per line."),
        value_type= schema.TextLine(),
        required=False)
    form.widget(style_categories='plone.z3cform.textlines.TextLinesFieldWidget')

    styles = schema.List(
        title=_(u"Styles"),
        description=_(u"Enter a list of styles. Format is name|category|label|action|icon|favorite, one style per line."),
        value_type= schema.TextLine(),
        required=False)
    form.widget(styles='plone.z3cform.textlines.TextLinesFieldWidget')

    form.fieldset('tiles', 
            label=_(u"Tiles"),
            fields=['tile_categories', 'structure_tiles', 'app_tiles']
        )

    tile_categories = schema.List(
        title=_(u"Tile categories"),
        description=_(u"Enter a list of tile categories. Format is name|title, one style per line."),
        value_type= schema.TextLine(),
        required=False)
    form.widget(tile_categories='plone.z3cform.textlines.TextLinesFieldWidget')

    structure_tiles = schema.List(
        title=_(u"Structure tiles"),
        description=_(u"Enter a list of structure tiles. Format is name|category|label|type|default_value|read_only|settings|favorite|rich_text|available_actions, one style per line."),
        value_type= schema.TextLine(),
        required=False)
    form.widget(structure_tiles='plone.z3cform.textlines.TextLinesFieldWidget')

    app_tiles = schema.List(
        title=_(u"Application tiles"),
        description=_(u"Enter a list of application tiles, one per line."),
        value_type= schema.TextLine(),
        required=False)
    form.widget(app_tiles='plone.z3cform.textlines.TextLinesFieldWidget')
