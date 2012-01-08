from zope.publisher.browser import BrowserView
from zope.component import getUtility
try:
    import json
except:
    import simplejson as json

from plone.registry.interfaces import IRegistry
from plone.app.deco.interfaces import IDecoRegistryAdapter
from Products.CMFCore.utils import getToolByName


class DecoConfigView(BrowserView):

    def obtainType(self):
        """
        Obtains the type of the context object or of the object we are adding
        """
        if 'type' in self.request.form:
            return self.request.form['type']
        else:
            if hasattr(self.context, 'portal_type'):
                return self.context.portal_type
        return None

    def __call__(self):
        self.request.response.setHeader('Content-Type', 'application/json')
        registry = getUtility(IRegistry)
        adapted = IDecoRegistryAdapter(registry)
        pm = getToolByName(self.context, 'portal_membership')
        kwargs = {
            'type': self.obtainType(),
            'context': self.context,
            'request': self.request,
        }
        result = adapted(**kwargs)
        can_change_layout = pm.checkPermission(
                'Plone: Change Deco Layout', self.context)
        result['can_change_layout'] = bool(can_change_layout)
        if not can_change_layout:
            if 'insert' in result['default_available_actions']:
                result['default_available_actions'].remove('insert')
            if 'add-tile' in result['default_available_actions']:
                result['default_available_actions'].remove('add-tile')
        return json.dumps(result)
