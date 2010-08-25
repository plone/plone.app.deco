import unittest2 as unittest
import doctest
import pprint
import interlude
from plone.testing import layered

#from plone.app.testing.layers import IntegrationTesting
from plone.app.testing.layers import FunctionalTesting
from plone.app.deco.tests.base import PADECO_FIXTURE

PADECO_FUNCTIONAL_TESTING = FunctionalTesting(bases=(PADECO_FIXTURE,),
                                              name="PADeco:Functional")

optionflags = (doctest.ELLIPSIS | doctest.NORMALIZE_WHITESPACE)
testfiles = (
    'test_browser_decoconfig.txt',
    'test_browser_controlpanel.txt',
)

def test_suite():
    suite = unittest.TestSuite()
    suite.addTests([
        layered(doctest.DocFileSuite(test,
                                     optionflags=optionflags,
                                     globs={'interact': interlude.interact,
                                            'pprint': pprint.pprint,
                                            }),
                layer=PADECO_FUNCTIONAL_TESTING)
        for test in testfiles])
    return suite
