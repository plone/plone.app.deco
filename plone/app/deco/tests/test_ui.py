import unittest
from niteoweb.windmill import WindmillTestCase
from Products.PloneTestCase.setup import setupPloneSite
from Products.PloneTestCase.layer import onsetup
from Products.Five.zcml import load_config
from Testing import ZopeTestCase as ztc
from plone.dexterity.utils import createContent

@onsetup
def load_zcml():
    import plone.app.page
    load_config('configure.zcml', plone.app.page)
    ztc.installPackage('plone.app.page')

load_zcml()
setupPloneSite(products=['plone.app.page'])

class DecoUITestCase(WindmillTestCase):

    def afterSetUp(self):
        """Setup for each test
        """
        ztc.utils.setupCoreSessions(self.app)
        self.setRoles(['Manager'])
        self.login_user()


    def test_exporter(self):
        client = self.wm

        # Create a new page with the title 'Page'
        client.open(url=u'/plone/++add++plone.app.page')
        client.waits.forPageLoad(timeout=u'20000')
        client.execJS(js=u"$('.deco-plone\\\\.app\\\\.standardtiles\\\\.title-tile h1').html('Page')")
        client.mouseDown(jquery=u'(".deco-button-save")[0]')
        client.waits.forPageLoad(timeout=u'20000')

        # Edit the newly created page
        client.click(jquery=u'("#contentview-edit a")[0]')
        client.waits.forPageLoad(timeout=u'20000')


def test_suite():
    return unittest.defaultTestLoader.loadTestsFromName(__name__)
