from plone.testing import z2
from plone.app.testing import PloneSandboxLayer
from plone.app.testing import PLONE_FIXTURE
from plone.app.testing import applyProfile
from plone.app.testing import login
from plone.app.testing import setRoles
from plone.app.testing import TEST_USER_NAME
from plone.app.testing import TEST_USER_ID

from zope.configuration import xmlconfig
from plone.app.testing.layers import IntegrationTesting
from plone.app.testing.layers import FunctionalTesting

from plone.dexterity.utils import createContent


class PADeco(PloneSandboxLayer):
    defaultBases = (PLONE_FIXTURE,)

    def setUpZope(self, app, configurationContext):
        # load ZCML
        import plone.app.deco
        xmlconfig.file('configure.zcml', plone.app.deco, context=configurationContext)

    def setUpPloneSite(self, portal):
        # install into the Plone site
        applyProfile(portal, 'plone.app.deco:default')

        # add a manager user
        portal['acl_users'].userFolderAddUser('admin',
                                              'secret',
                                              ['Manager'],
                                              [])

        # add a plone.page type, where we can test with
        page = createContent("page")
        page.id = 'page'
        portal._setObject('page', page)
        
        # set up content required for acceptance tests
        login(portal, TEST_USER_NAME)
        setRoles(portal, TEST_USER_ID, ['Manager', ])
        portal.invokeFactory(
            'Folder','acceptance-test-folder', title='Acceptance Test Folder')


DECO_FIXTURE = PADeco()
DECO_INTEGRATION_TESTING = IntegrationTesting(bases=(DECO_FIXTURE,), name="PADeco:Integration")
DECO_FUNCTIONAL_TESTING = FunctionalTesting(bases=(DECO_FIXTURE,), name="PADeco:Functional")
DECO_ACCEPTANCE_TESTING = FunctionalTesting(bases=(DECO_FIXTURE,z2.ZSERVER_FIXTURE,), name="PADeco:Acceptance")
