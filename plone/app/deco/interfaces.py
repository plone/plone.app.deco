from zope.interface import Interface
from zope import schema
from zope.i18nmessageid import MessageFactory
from plone.directives import form

_ = MessageFactory('plone.app.deco')

class IDecoSettings(form.Schema):
    """This interface defines the deco settings."""

    default_available_actions = schema.List(
        title=_(u"Default available actions"),
        description=_(u"Enter a list of default available actions, one per line."),
        value_type=schema.TextLine(),
        required=False)
    form.widget(default_available_actions='plone.z3cform.textlines.TextLinesFieldWidget')

    form.fieldset('style', 
            label=_(u"Style"),
            fields=['styles']
        )

    styles = schema.List(
        title=_(u"Styles"),
        description=_(u"Enter a list of styles. Format is name|category|label|action|icon|favorite|menu|items, one style per line."),
        value_type=schema.TextLine(),
        required=False)
    form.widget(styles='plone.z3cform.textlines.TextLinesFieldWidget')

    form.fieldset('tile', 
            label=_(u"Tile"),
            fields=['structure_tiles']
        )

    structure_tiles = schema.Text(
        title=_(u"Structure tiles"),
        description=_(u"Enter a list of structure tiles. Format is name|category|label|type|default_value|read_only|settings|favorite|rich_text|available_actions, one style per line."),
        default=u'text|Structure|Text|text|<p>New block</p>|false|true|false|true|strong|em|paragraph|heading|subheading|discreet|literal|quote|callout|highlight|sub|sup|remove-style|pagebreak|ul|ol|justify-left|justify-center|justify-right|justify-justify|tile-align-block|tile-align-right|tile-align-left',
        required=False) 
