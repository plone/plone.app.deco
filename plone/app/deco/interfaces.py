from zope.interface import Interface
from zope import schema
from zope.i18nmessageid import MessageFactory

_ = MessageFactory('plone.app.deco')

class IDecoStyleSettings(Interface):
    """This interface defines the style settings."""

    styles = schema.Text(
        title=_(u'label_styles', default=u'Styles'),
        description=_(u'help_styles', default=u"Enter a list of styles. Format is name|category|label|action|icon|favorite|menu|items, one style per line."),
        default=u'strong|Text|B|strong|true|true|false|',
        required=False) 

class IDecoTileSettings(Interface):
    """This interface defines the tile settings."""

    structure_tiles = schema.Text(
        title=_(u'label_structure_tiles', default=u'Structure tiles'),
        description=_(u'help_structure_tiles', default=u"Enter a list of structure tiles. Format is name|category|label|type|default_value|read_only|settings|favorite|rich_text|available_actions, one style per line."),
        default=u'text|Structure|Text|text|<p>New block</p>|false|true|false|true|strong|em|paragraph|heading|subheading|discreet|literal|quote|callout|highlight|sub|sup|remove-style|pagebreak|ul|ol|justify-left|justify-center|justify-right|justify-justify|tile-align-block|tile-align-right|tile-align-left',
        required=False) 
