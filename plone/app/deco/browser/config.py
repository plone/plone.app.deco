
from zope.publisher.browser import BrowserView
from zope.component import getUtility
try:
    import json
except:
    import simplejson as json

from plone.registry.interfaces import IRegistry
from plone.app.deco.interfaces import IDecoRegistry
from Products.CMFCore.utils import getToolByName


class DecoConfigView(BrowserView):

    # TODO: this should move to DecoRegistry
    def _type(self):
        """ Obtains the type of the context object or of the object we are
            adding.
        """

        if '++add++' in self.request.getURL():
            return self.request.getURL().split('++add++')[1]

        else:
            if hasattr(self.context, 'portal_type'):
                return self.context.portal_type

        return None

    @property
    def config(self):
        registry = IDecoRegistry(getUtility(IRegistry))
        config = registry(**{
            'type': self.type(),
            'context': self.context,
            'request': self.request,
            })

        # does user have permission to change layout
        membership = getToolByName(self.context, 'portal_membership')
        can_change_layout = membership.checkPermission(
                'Plone: Change Deco Layout', self.context)

        # remove add-tile and insert action from config if user doesn't have
        # permission to change layout 
        config['can_change_layout'] = bool(can_change_layout)
        if not can_change_layout:
            if 'insert' in config['default_available_actions']:
                config['default_available_actions'].remove('insert')
            if 'add-tile' in config['default_available_actions']:
                config['default_available_actions'].remove('add-tile')

        return json.dumps(config)


class DecoConfigJSONView(DecoConfigView):

    def __call__(self):
        self.request.response.setHeader('Content-Type', 'application/json')
        return self.config
