from zope.interface import Interface
from zope.component import getUtility

from zope import schema
from zope.schema.interfaces import IVocabularyFactory

from zope.publisher.browser import BrowserView

from z3c.form.interfaces import HIDDEN_MODE
from z3c.form import form, field, button

from plone.protect import CheckAuthenticator
from plone.registry.interfaces import IRegistry
from plone.memoize.instance import memoize
from plone.i18n.normalizer.interfaces import IIDNormalizer

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
from plone.app.page.interfaces import PAGE_LAYOUT_FILE_NAME
from plone.app.page.interfaces import DEFAULT_PAGE_TYPE_NAME

from plone.app.page.utils import getPageTypes
from plone.app.page.utils import createSiteLayout
from plone.app.page.utils import createTemplatePageLayout
from plone.app.page.utils import clonePageType

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
            portal_type = form.get('name')
            if portal_type == DEFAULT_PAGE_TYPE_NAME:
                IStatusMessage(self.request).add(_(u"Cannot delete the default page type"), type="error")
            elif len(catalog({'portal_type': portal_type})) > 0:
                IStatusMessage(self.request).add(_(u"Cannot delete a type that is in use"), type="error")
            else:
                portal_types = getToolByName(self, 'portal_types')
                del portal_types[portal_type]
                IStatusMessage(self.request).add(_(u"Type deleted"), type="info")
        
        elif 'form.button.DeleteSiteLayout' in form:
            name = form.get('name')
            resources = getUtility(IResourceDirectory, name='persistent')
            sitelayouts = resources[SITE_LAYOUT_RESOURCE_NAME]
            del sitelayouts[name]
            IStatusMessage(self.request).add(_(u"Site layout deleted"), type="info")
        
        elif 'form.button.DeletePageLayout' in form:
            name = form.get('name')
            resources = getUtility(IResourceDirectory, name='persistent')
            pagelayouts = resources[PAGE_LAYOUT_RESOURCE_NAME]
            del pagelayouts[name]
            IStatusMessage(self.request).add(_(u"Page layout deleted"), type="info")
        
        return self.index()
    
    @memoize
    def pageTypes(self):
        portal_types = getToolByName(self.context, 'portal_types')
        return getPageTypes(portal_types)
    
    def defaultPageType(self):
        return DEFAULT_PAGE_TYPE_NAME
    
    @memoize
    def siteLayouts(self):
        layouts = []
        for name, info in getAllResources(SITE_LAYOUT_MANIFEST_FORMAT).items():
            if info is None:
                info = {}
            
            directory = queryResourceDirectory(SITE_LAYOUT_RESOURCE_NAME, name)
            editable = IWritableResourceDirectory.providedBy(directory)
            
            layouts.append({
                    'name': name,
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
                    'name': name,
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

#
# Add forms
# 

class IAddLayoutForm(Interface):
    """Add a site or page layout
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
    
    content = schema.ASCII(
            title=_(u"Contents"),
            description=_(u"Layout contents (HTML)"),
        )

class AddPageLayoutForm(form.Form):
    
    fields = field.Fields(IAddLayoutForm)
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
        
        IStatusMessage(self.request).add(_(u"Changes saved"), type="info")
        self.request.response.redirect(self.context.absolute_url() + "/@@deco-controlpanel#fieldset")
    
    @button.buttonAndHandler(_(u'Cancel'))
    def cancel(self, action):
        IStatusMessage(self.request).add(_(u"Operation cancelled"), type="info")
        self.request.response.redirect(self.context.absolute_url() + "/@@deco-controlpanel")
    
class AddSiteLayoutForm(form.Form):
    
    fields = field.Fields(IAddLayoutForm)
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
        
        IStatusMessage(self.request).add(_(u"Changes saved"), type="info")
        self.request.response.redirect(self.context.absolute_url() + "/@@deco-controlpanel")
    
    @button.buttonAndHandler(_(u'Cancel'))
    def cancel(self, action):
        IStatusMessage(self.request).add(_(u"Operation cancelled"), type="info")
        self.request.response.redirect(self.context.absolute_url() + "/@@deco-controlpanel")

#
# Edit forms
# 


class IEditLayoutForm(IAddLayoutForm):
    """Edit a site or page layout
    """
    
    # hidden fields
    name = schema.ASCIILine()
    filename = schema.ASCIILine()

class EditPageLayoutForm(form.Form):
    
    fields = field.Fields(IEditLayoutForm)
    
    label = _(u"Edit template page layout")
    
    def updateWidgets(self):
        super(EditPageLayoutForm, self).updateWidgets()
        self.widgets["content"].rows = 30
        self.widgets["name"].mode = HIDDEN_MODE
        self.widgets["filename"].mode = HIDDEN_MODE
    
    def getContent(self):
        name = self.request.get('name', self.request.get('form.widgets.name'))
        
        title = u""
        description = u""
        filename = PAGE_LAYOUT_FILE_NAME
        
        directory = queryResourceDirectory(PAGE_LAYOUT_RESOURCE_NAME, name)
        if directory.isFile(MANIFEST_FILENAME):
            manifest = getManifest(directory.openFile(MANIFEST_FILENAME), PAGE_LAYOUT_MANIFEST_FORMAT)
            title = manifest.get('title', title)
            description = manifest.get('description', description)
            filename = manifest.get('file', filename)
        
        if isinstance(title, str):
            title = title.decode('utf-8')
        if isinstance(description, str):
            description = description.decode('utf-8')
        
        content = directory.readFile(filename)
        
        return {
                'name': name,
                'filename': filename,
                'title': title,
                'description': description,
                'content': content,
            }
    
    @button.buttonAndHandler(_(u"Save"))
    def handleSave(self, action):
        data, errors = self.extractData()
        if errors:
            self.status = self.formErrorsMessage
            return
        
        name = data['name']
        title = data['title']
        description = data['description']
        content = data['content']
        filename = data['filename']
        
        title = title.encode('utf-8')
        description = description.encode('utf-8')
        
        directory = queryResourceDirectory(PAGE_LAYOUT_RESOURCE_NAME, name)
        directory.writeFile(MANIFEST_FILENAME, """\
[%s]
title = %s
description = %s
file = %s
""" % (PAGE_LAYOUT_RESOURCE_NAME, title or '', description or '', filename))

        directory.writeFile(filename, content)
        
        IStatusMessage(self.request).add(_(u"Changes saved"), type="info")
        self.request.response.redirect(self.context.absolute_url() + "/@@deco-controlpanel")
    
    @button.buttonAndHandler(_(u'Cancel'))
    def cancel(self, action):
        IStatusMessage(self.request).add(_(u"Operation cancelled"), type="info")
        self.request.response.redirect(self.context.absolute_url() + "/@@deco-controlpanel")

class EditSiteLayoutForm(form.Form):
    
    fields = field.Fields(IEditLayoutForm)
    
    label = _(u"Edit site layout")
    
    def updateWidgets(self):
        super(EditSiteLayoutForm, self).updateWidgets()
        self.widgets["content"].rows = 30
        self.widgets["name"].mode = HIDDEN_MODE
        self.widgets["filename"].mode = HIDDEN_MODE
    
    def getContent(self):
        name = self.request.get('name', self.request.get('form.widgets.name'))
        
        title = u""
        description = u""
        filename = SITE_LAYOUT_FILE_NAME
        
        directory = queryResourceDirectory(SITE_LAYOUT_RESOURCE_NAME, name)
        if directory.isFile(MANIFEST_FILENAME):
            manifest = getManifest(directory.openFile(MANIFEST_FILENAME), SITE_LAYOUT_MANIFEST_FORMAT)
            title = manifest.get('title', title)
            description = manifest.get('description', description)
            filename = manifest.get('file', filename)
        
        if isinstance(title, str):
            title = title.decode('utf-8')
        if isinstance(description, str):
            description = description.decode('utf-8')
        
        content = directory.readFile(filename)
        
        return {
                'name': name,
                'filename': filename,
                'title': title,
                'description': description,
                'content': content,
            }
    
    @button.buttonAndHandler(_(u"Save"))
    def handleSave(self, action):
        data, errors = self.extractData()
        if errors:
            self.status = self.formErrorsMessage
            return
        
        name = data['name']
        title = data['title']
        description = data['description']
        content = data['content']
        filename = data['filename']
        
        title = title.encode('utf-8')
        description = description.encode('utf-8')
        
        directory = queryResourceDirectory(SITE_LAYOUT_RESOURCE_NAME, name)
        directory.writeFile(MANIFEST_FILENAME, """\
[%s]
title = %s
description = %s
file = %s
""" % (SITE_LAYOUT_RESOURCE_NAME, title or '', description or '', filename))

        directory.writeFile(filename, content)
        
        IStatusMessage(self.request).add(_(u"Changes saved"), type="info")
        self.request.response.redirect(self.context.absolute_url() + "/@@deco-controlpanel")
    
    @button.buttonAndHandler(_(u'Cancel'))
    def cancel(self, action):
        IStatusMessage(self.request).add(_(u"Operation cancelled"), type="info")
        self.request.response.redirect(self.context.absolute_url() + "/@@deco-controlpanel")

#
# Type edit form
# 

class IPageTypeForm(Interface):
    """Fields for the page type edit form
    """
    
    # TODO: Icon? Add permission? Type filtering? Behaviours?
    
    title = schema.TextLine(
            title=_(u"Title"),
            description=_(u"The title that appears in the add menu"),
        )
    
    description = schema.Text(
            title=_(u"Description"),
            description=_(u"A short description for the page type"),
            required=False,
        )
    
    defaultSiteLayout = schema.Choice(
            title=_(u"Default site layout"),
            description=_(u"The default site layout used when creating new pages of this type" +
                          u"If no value is selected, the parent or global default will be used."),
            vocabulary='plone.availableSiteLayouts',
            required=False,
        )
    
    defaultPageLayoutTemplate = schema.Choice(
            title=_(u"Default page layout template"),
            description=_(u"The default page layout template used when creating new pages of this type"),
            vocabulary='plone.availablePageLayouts',
        )

class AddPageTypeForm(form.Form):
    
    fields = field.Fields(IPageTypeForm)
    ignoreContext = True
    
    defaultType = DEFAULT_PAGE_TYPE_NAME
    
    label = _(u"Add page type")
    
    @button.buttonAndHandler(_(u"Save"))
    def handleSave(self, action):
        data, errors = self.extractData()
        if errors:
            self.status = self.formErrorsMessage
            return
        
        title = data['title']
        description = data['description']
        defaultSiteLayout = data['defaultSiteLayout']
        defaultPageLayoutTemplate = data['defaultPageLayoutTemplate']
        
        portal_types = getToolByName(self.context, 'portal_types')
        
        name = basename = getUtility(IIDNormalizer).normalize(title)
        idx = 1
        while name in portal_types:
            name = "%s-%d" % (basename, idx,)
            idx += 1
        
        clonePageType(portal_types, self.defaultType, name,
                title=title,
                description=description,
                default_site_layout=defaultSiteLayout,
                default_page_layout_template=defaultPageLayoutTemplate,
            )
        
        IStatusMessage(self.request).add(_(u"Page type added"), type="info")
        self.request.response.redirect(self.context.absolute_url() + "/@@deco-controlpanel")
    
    @button.buttonAndHandler(_(u'Cancel'))
    def cancel(self, action):
        IStatusMessage(self.request).add(_(u"Operation cancelled"), type="info")
        self.request.response.redirect(self.context.absolute_url() + "/@@deco-controlpanel")

class EditPageTypeForm(form.Form):
    
    fields = field.Fields(IPageTypeForm)
    
    label = _(u"Edit page type")
    
    def getContent(self):
        
        title = self.context.Title()
        if isinstance(title, str):
            title = title.decode('utf-8')
        description = self.context.Description()
        if isinstance(description, str):
            description = description.decode('utf-8')
        
        return {
                'title': title,
                'description': description,
                'defaultSiteLayout': self.context.default_site_layout,
                'defaultPageLayoutTemplate': self.context.default_page_layout_template,
            }
    
    @button.buttonAndHandler(_(u"Save"))
    def handleSave(self, action):
        data, errors = self.extractData()
        if errors:
            self.status = self.formErrorsMessage
            return
        
        title = data['title']
        description = data['description']
        defaultSiteLayout = data['defaultSiteLayout']
        defaultPageLayoutTemplate = data['defaultPageLayoutTemplate']
        
        self.context.title = title
        self.context.description = description
        self.context.default_site_layout = defaultSiteLayout
        self.context.default_page_layout_template = defaultPageLayoutTemplate
        
        IStatusMessage(self.request).add(_(u"Changes saved"), type="info")
        
        portal_url = getToolByName(self.context, 'portal_url')
        self.request.response.redirect(portal_url() + "/@@deco-controlpanel")
    
    @button.buttonAndHandler(_(u'Cancel'))
    def cancel(self, action):
        IStatusMessage(self.request).add(_(u"Operation cancelled"), type="info")
        
        portal_url = getToolByName(self.context, 'portal_url')
        self.request.response.redirect(portal_url() + "/@@deco-controlpanel")
