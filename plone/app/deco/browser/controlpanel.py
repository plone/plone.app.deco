from plone.app.registry.browser.controlpanel import RegistryEditForm
from plone.app.registry.browser.controlpanel import ControlPanelFormWrapper
from plone.app.deco.interfaces import IDecoStyleSettings
from plone.app.deco.interfaces import IDecoTileSettings
from plone.z3cform import layout
from zope import schema
from plone.directives import form

class IDecoSettings(form.Schema, IDecoStyleSettings, IDecoTileSettings):

    form.fieldset('style', 
            label=u"Style",
            fields=['styles']
        )

    form.fieldset('tile', 
            label=u"Tile",
            fields=['structure_tiles']
        )

class DecoControlPanelForm(RegistryEditForm):
    schema = IDecoSettings

DecoControlPanelFormView = layout.wrap_form(DecoControlPanelForm, ControlPanelFormWrapper)
