import unittest2 as unittest
import doctest
import pprint
import interlude
from plone.testing import layered

from plone.app.deco.testing import DECO_FUNCTIONAL_TESTING

optionflags = (doctest.ELLIPSIS | doctest.NORMALIZE_WHITESPACE)
functionalTestFiles = (
    'test_browser_decoconfig.txt',
)

def test_suite():
    suite = unittest.TestSuite()
    suite.addTests([
        layered(doctest.DocFileSuite(test,
                                     optionflags=optionflags,
                                     globs={'interact': interlude.interact,
                                            'pprint': pprint.pprint,
                                            }),
                layer=DECO_FUNCTIONAL_TESTING)
        for test in functionalTestFiles])
    return suite
