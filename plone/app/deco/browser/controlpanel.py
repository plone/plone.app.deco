from zope.interface import implements
from zope.i18nmessageid import MessageFactory
from plone.fieldsets.fieldsets import FormFieldsets

from plone.app.controlpanel.form import ControlPanelForm

from plone.app.deco.interfaces import IDecoStyleSettingsStorage, IDecoTileSettingsStorage, IDecoSettingsStorage
from plone.app.deco.browser.interfaces import IDecoControlPanelForm

_ = MessageFactory('plone.app.deco')

class DecoControlPanelForm(ControlPanelForm):
    """Deco Control Panel Form"""
    implements(IDecoControlPanelForm)

    decostylesettings = FormFieldsets(IDecoStyleSettingsStorage)
    decostylesettings.id = 'decostylesettings'
    decostylesettings.label = _(u'decostylesettings', default=u'Styles')

    decotilesettings = FormFieldsets(IDecoTileSettingsStorage)
    decotilesettings.id = 'decotilesettings'
    decotilesettings.label = _(u'decotilesettings', default=u'Tiles')

    form_fields = FormFieldsets(decostylesettings, decotilesettings)

    label = _(u"Layout and Content editing")
    description = _(u"Settings for Layout and Content editing.")
    form_name = _("Layout and Content editing")
