from plone.app.deco.interfaces import IDecoSettingsStorage
from plone.app.deco.storage import DecoSettingsStorage

def add_utility(context):
    portal = context.getSite()
    sm = portal.getSiteManager()

    if not sm.queryUtility(IDecoSettingsStorage, 'deco_config'):
        sm.registerUtility(DecoSettingsStorage(),
                           IDecoSettingsStorage,
                           'deco_config')
