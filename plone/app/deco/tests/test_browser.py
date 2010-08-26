import unittest2 as unittest
import doctest
import pprint
import interlude
from plone.testing import layered

from plone.app.deco.tests.base import PADECO_FUNCTIONAL_TESTING

optionflags = (doctest.ELLIPSIS | doctest.NORMALIZE_WHITESPACE)
testfiles = (
    'test_browser_decoconfig.txt',
    'test_browser_controlpanel.txt',
)
testfiles = ()

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
