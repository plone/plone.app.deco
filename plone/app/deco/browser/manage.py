from zope.component import getUtility
from zope.publisher.browser import BrowserView

from plone.protect import CheckAuthenticator
from plone.memoize.instance import memoize

from plone.resource.interfaces import IResourceDirectory
from plone.resource.interfaces import IWritableResourceDirectory
from plone.resource.manifest import getAllResources
from plone.resource.utils import queryResourceDirectory

from plone.app.blocks.interfaces import SITE_LAYOUT_MANIFEST_FORMAT
from plone.app.blocks.interfaces import SITE_LAYOUT_RESOURCE_NAME
from plone.app.blocks.interfaces import SITE_LAYOUT_FILE_NAME

from plone.app.page.interfaces import PAGE_LAYOUT_MANIFEST_FORMAT
from plone.app.page.interfaces import PAGE_LAYOUT_RESOURCE_NAME
from plone.app.page.interfaces import PAGE_LAYOUT_FILE_NAME

from plone.app.page.utils import getPageTypes

from Products.CMFCore.utils import getToolByName
from Products.statusmessages.interfaces import IStatusMessage

from plone.app.deco import PloneMessageFactory as _

class ManageDeco(BrowserView):
    """Control panel view:
    
    - Manage page types
    - Manage site layouts
    - Manage page layouts
    """
    
    def __call__(self):
        
        self.errors = {}
        
        if self.request.method == 'POST':
            CheckAuthenticator(self.request)
        
        catalog = getToolByName(self.context, 'portal_catalog')
        
        form = self.request.form
        if 'form.button.DeletePageType' in form:
            portal_type = form.get('id')
            if len(catalog({'portal_type': portal_type})) > 0:
                IStatusMessage(self.request).add(_(u"Cannot delete a type that is in use"), type="error")
            else:
                portal_types = getToolByName(self, 'portal_types')
                del portal_types[portal_type]
                IStatusMessage(self.request).add(_(u"Type deleted"), type="info")
        
        if 'form.button.DeleteSiteLayout' in form:
            name = form.get('id')
            resources = getUtility(IResourceDirectory, name='persistent')
            sitelayouts = resources[SITE_LAYOUT_RESOURCE_NAME]
            del sitelayouts[name]
            IStatusMessage(self.request).add(_(u"Site layout deleted"), type="info")
        
        if 'form.button.DeletePageLayout' in form:
            name = form.get('id')
            resources = getUtility(IResourceDirectory, name='persistent')
            pagelayouts = resources[PAGE_LAYOUT_RESOURCE_NAME]
            del pagelayouts[name]
            IStatusMessage(self.request).add(_(u"Page layout deleted"), type="info")
        
        return self.index()
    
    @memoize
    def pageTypes(self):
        portal_types = getToolByName(self.context, 'portal_types')
        return getPageTypes(portal_types)

    @memoize
    def siteLayouts(self):
        layouts = []
        for name, info in getAllResources(SITE_LAYOUT_MANIFEST_FORMAT).items():
            if info is None:
                info = {}
            
            dir = queryResourceDirectory(SITE_LAYOUT_RESOURCE_NAME, name)
            editable = IWritableResourceDirectory.providedBy(dir)
            
            layouts.append({
                    'id': name,
                    'title': info.get('title', name.capitalize().replace('-', ' ').replace('.', ' ')),
                    'description':  info.get('description', None),
                    'url': "%s/++%s++%s/%s" % (
                            self.context.absolute_url(),
                            SITE_LAYOUT_RESOURCE_NAME,
                            name,
                            info.get('file', SITE_LAYOUT_FILE_NAME)
                        ),
                    'editable': editable,
                })
        
        return layouts

    @memoize
    def pageLayouts(self):
        layouts = []
        for name, info in getAllResources(PAGE_LAYOUT_MANIFEST_FORMAT).items():
            if info is None:
                info = {}
            
            dir = queryResourceDirectory(PAGE_LAYOUT_RESOURCE_NAME, name)
            editable = IWritableResourceDirectory.providedBy(dir)
            
            layouts.append({
                    'id': name,
                    'title': info.get('title', name.capitalize().replace('-', ' ').replace('.', ' ')),
                    'description':  info.get('description', None),
                    'url': "%s/++%s++%s/%s" % (
                            self.context.absolute_url(),
                            PAGE_LAYOUT_RESOURCE_NAME,
                            name,
                            info.get('file', PAGE_LAYOUT_FILE_NAME)
                        ),
                    'editable': editable,
                })
        
        return layouts
