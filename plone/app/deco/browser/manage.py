from zope.interface import Interface
from zope.component import getUtility

from zope import schema
from zope.schema.interfaces import IVocabularyFactory

from zope.publisher.browser import BrowserView

from z3c.form import form, field, button

from plone.protect import CheckAuthenticator
from plone.registry.interfaces import IRegistry
from plone.memoize.instance import memoize

from plone.resource.interfaces import IResourceDirectory
from plone.resource.interfaces import IWritableResourceDirectory

from plone.resource.manifest import MANIFEST_FILENAME
from plone.resource.manifest import getAllResources
from plone.resource.manifest import getManifest

from plone.resource.utils import queryResourceDirectory

from plone.app.blocks.interfaces import SITE_LAYOUT_MANIFEST_FORMAT
from plone.app.blocks.interfaces import SITE_LAYOUT_RESOURCE_NAME
from plone.app.blocks.interfaces import SITE_LAYOUT_FILE_NAME

from plone.app.page.interfaces import PAGE_LAYOUT_MANIFEST_FORMAT
from plone.app.page.interfaces import PAGE_LAYOUT_RESOURCE_NAME

from plone.app.page.utils import getPageTypes
from plone.app.page.utils import createSiteLayout
from plone.app.page.utils import createTemplatePageLayout

from Products.CMFCore.utils import getToolByName
from Products.statusmessages.interfaces import IStatusMessage

from plone.app.deco.interfaces import DEFAULT_SITE_LAYOUT_CONTENT
from plone.app.deco.interfaces import DEFAULT_PAGE_LAYOUT_CONTENT

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
        
        if 'form.button.SaveGeneral' in form:
            name = form.get('defaultSiteLayout')
            directory = queryResourceDirectory(SITE_LAYOUT_RESOURCE_NAME, name)
            if directory is None:
                IStatusMessage(self.request).add(_(u"Cannot find resource directory"), type="error")
            else:
                
                filename = SITE_LAYOUT_FILE_NAME
                
                if directory.isFile(MANIFEST_FILENAME):
                    manifest = getManifest(directory.openFile(MANIFEST_FILENAME), SITE_LAYOUT_MANIFEST_FORMAT)
                    filename = manifest.get('file', filename)
                
                registry = getUtility(IRegistry)
                registry['plone.defaultSiteLayout'] = "./++%s++%s/%s" % \
                        (SITE_LAYOUT_RESOURCE_NAME, name, filename)
                
                IStatusMessage(self.request).add(_(u"Default site layout updated"), type="info")
            
        elif 'form.button.DeletePageType' in form:
            portal_type = form.get('id')
            if len(catalog({'portal_type': portal_type})) > 0:
                IStatusMessage(self.request).add(_(u"Cannot delete a type that is in use"), type="error")
            else:
                portal_types = getToolByName(self, 'portal_types')
                del portal_types[portal_type]
                IStatusMessage(self.request).add(_(u"Type deleted"), type="info")
        
        elif 'form.button.DeleteSiteLayout' in form:
            name = form.get('id')
            resources = getUtility(IResourceDirectory, name='persistent')
            sitelayouts = resources[SITE_LAYOUT_RESOURCE_NAME]
            del sitelayouts[name]
            IStatusMessage(self.request).add(_(u"Site layout deleted"), type="info")
        
        elif 'form.button.DeletePageLayout' in form:
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
            
            directory = queryResourceDirectory(SITE_LAYOUT_RESOURCE_NAME, name)
            editable = IWritableResourceDirectory.providedBy(directory)
            
            layouts.append({
                    'id': name,
                    'title': info.get('title', name.capitalize().replace('-', ' ').replace('.', ' ')),
                    'description':  info.get('description', None),
                    'url': "%s/++%s++%s" % (
                            self.context.absolute_url(),
                            SITE_LAYOUT_RESOURCE_NAME,
                            name,
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
            
            directory = queryResourceDirectory(PAGE_LAYOUT_RESOURCE_NAME, name)
            editable = IWritableResourceDirectory.providedBy(directory)
            
            layouts.append({
                    'id': name,
                    'title': info.get('title', name.capitalize().replace('-', ' ').replace('.', ' ')),
                    'description':  info.get('description', None),
                    'url': "%s/++%s++%s" % (
                            self.context.absolute_url(),
                            PAGE_LAYOUT_RESOURCE_NAME,
                            name,
                        ),
                    'editable': editable,
                })
        
        return layouts

    @memoize
    def defaultSiteLayout(self):
        registry = getUtility(IRegistry)
        layout = registry.get('plone.defaultSiteLayout', None)
        if layout is None:
            return None
        
        if "++%s++" % SITE_LAYOUT_RESOURCE_NAME not in layout:
            return None
        
        return layout.split('++%s++' % SITE_LAYOUT_RESOURCE_NAME, -1)[1].split('/', 1)[0]
    
    @memoize
    def availableSiteLayouts(self):
        vocabularyFactory = getUtility(IVocabularyFactory, name='plone.availableSiteLayouts')
        return vocabularyFactory(self.context)

class IManageLayoutForm(Interface):
    """Edit a site or page layout
    """
    
    title = schema.TextLine(
            title=_(u"Title"),
            description=_(u"Title of the new page type"),
        )
    
    description = schema.Text(
            title=_(u"Description"),
            description=_(u"A short description of the new page type"),
            required=False,
        )
    
    content = schema.Text(
            title=_(u"Contents"),
            description=_(u"Layout contents (HTML)"),
        )

class AddPageLayoutForm(form.Form):
    
    fields = field.Fields(IManageLayoutForm)
    label = _(u"Add template page layout")
    
    def getContent(self):
        return {
            'title': u"",
            'description': u"",
            'content': DEFAULT_PAGE_LAYOUT_CONTENT,
        }
    
    def updateWidgets(self):
        super(AddPageLayoutForm, self).updateWidgets()
        self.widgets["content"].rows = 30
    
    @button.buttonAndHandler(_(u"Save"))
    def handleSave(self, action):
        data, errors = self.extractData()
        if errors:
            self.status = self.formErrorsMessage
            return
        
        title = data['title']
        description = data['description']
        content = data['content']
        
        createTemplatePageLayout(title, description, content)
                
        self.request.response.redirect(self.context.absolute_url() + "/@@deco-controlpanel")
    
    @button.buttonAndHandler(_(u'Cancel'))
    def cancel(self, action):
        self.request.response.redirect(self.context.absolute_url())
    
class AddSiteLayoutForm(form.Form):
    
    fields = field.Fields(IManageLayoutForm)
    label = _(u"Add site layout")
    
    def getContent(self):
        return {
            'title': u"",
            'description': u"",
            'content': DEFAULT_SITE_LAYOUT_CONTENT,
        }
    
    def updateWidgets(self):
        super(AddSiteLayoutForm, self).updateWidgets()
        self.widgets["content"].rows = 30
    
    @button.buttonAndHandler(_(u"Save"))
    def handleSave(self, action):
        data, errors = self.extractData()
        if errors:
            self.status = self.formErrorsMessage
            return
        
        title = data['title']
        description = data['description']
        content = data['content']
        
        createSiteLayout(title, description, content)
                
        self.request.response.redirect(self.context.absolute_url() + "/@@deco-controlpanel")
    
    @button.buttonAndHandler(_(u'Cancel'))
    def cancel(self, action):
        self.request.response.redirect(self.context.absolute_url())
    
class ManagePageLayoutForm(form.Form):
    
    fields = field.Fields(IManageLayoutForm)
    
    label = _(u"Edit layout")
    
    # def getContent(self):
    # 
    #     # TODO: Read layout - we need to distinguish between site and 
    #     # page layout here :-/
    #     
    #     return {
    #             'title': title,
    #             'description': description,
    #             'contents': contents,
    #         }
    
    @button.buttonAndHandler(_(u"Save"))
    def handleSave(self, action):
        data, errors = self.extractData()
        if errors:
            self.status = self.formErrorsMessage
            return
        
        title = data['title']
        description = data['description']
        contents = data['contents']
        
        
        self.request.response.redirect(self.context.absolute_url())
    
    @button.buttonAndHandler(_(u'Cancel'))
    def cancel(self, action):
        self.request.response.redirect(self.context.absolute_url())
