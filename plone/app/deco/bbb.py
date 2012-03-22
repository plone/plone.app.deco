from lxml import html
from zope.component import getMultiAdapter
from zope.viewlet.viewlet import ViewletBase


class DecoToolbarViewlet(ViewletBase):

    def render(self):
        context, request = self.context, self.request
        tile = getMultiAdapter((context, request), name=u'plone.deco_toolbar')

        tile_body = ''
        tree = html.fromstring(tile.index())
        for el in tree.body.getchildren():
            tile_body += html.tostring(el)

        return u'<div style="display:none;" ' + \
                    u'data-iframe="true" ' + \
                    u'data-iframe-target="#plone-toolbar" ' + \
                    u'>%s</div>' % (tile_body)

