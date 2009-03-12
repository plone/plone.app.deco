from plone.app.registry.browser.controlpanel import RegistryEditForm
from plone.app.registry.browser.controlpanel import ControlPanelFormWrapper
from plone.app.deco.interfaces import IDecoSettings
from plone.z3cform import layout
from zope.i18nmessageid import MessageFactory
from Products.CMFPlone.utils import log

_ = MessageFactory('plone.app.deco')

class DecoControlPanelForm(RegistryEditForm):
    schema = IDecoSettings
    label = _(u"Layout and Content editing settings")
    description = _(u"Please enter the settings for the layout and content editing.") 

class DecoControlPanelFormView(ControlPanelFormWrapper):
    form = DecoControlPanelForm 