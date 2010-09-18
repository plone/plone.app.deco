from plone.app.testing import PloneSandboxLayer
from plone.app.testing import PLONE_FIXTURE
from plone.app.testing import applyProfile

from zope.configuration import xmlconfig
#from plone.app.testing.layers import IntegrationTesting
from plone.app.testing.layers import FunctionalTesting

from plone.dexterity.utils import createContent


class PADeco(PloneSandboxLayer):
    defaultBases = (PLONE_FIXTURE,)

    def setUpZope(self, app, configurationContext):
        # load ZCML
        import plone.app.deco
        import plone.app.layoutbehavior
        import plone.app.page
        xmlconfig.file('configure.zcml', plone.app.page,
                       context=configurationContext)

    def setUpPloneSite(self, portal):
        # install into the Plone site
        applyProfile(portal, 'plone.app.page:default')

        # add a manager user
        portal.acl_users.userFolderAddUser('admin',
                                           'secret',
                                           ['Manager'],
                                           [])

        # add a plone.page type, where we can test with
        page = createContent("plone.app.page")
        page.id = 'page'
        portal._setObject('page', page)
        from transaction import commit
        commit()

PADECO_FIXTURE = PADeco()

PADECO_FUNCTIONAL_TESTING = FunctionalTesting(bases=(PADECO_FIXTURE,),
                                              name="PADeco:Functional")
