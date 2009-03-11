from plone.app.registry.browser.controlpanel import RegistryEditForm
from plone.app.registry.browser.controlpanel import ControlPanelFormWrapper
from plone.app.deco.interfaces import IDecoSettings
from plone.z3cform import layout
from zope.i18nmessageid import MessageFactory

_ = MessageFactory('plone.app.deco')

class DecoControlPanelForm(RegistryEditForm):
    schema = IDecoSettings
    label = _(u'label_deco_settings', default=u'Layout and Content editing settings'),

DecoControlPanelFormView = layout.wrap_form(DecoControlPanelForm, ControlPanelFormWrapper)
