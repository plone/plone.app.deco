import unittest2 as unittest
import doctest


from plone.testing import layered
from plone.testing.zca import UNIT_TESTING

optionflags = (doctest.ELLIPSIS | doctest.NORMALIZE_WHITESPACE)

def test_suite():
    suite = unittest.TestSuite()
    suite.addTests(
            layered(doctest.DocFileSuite('test_layout_widget.txt', optionflags=optionflags),
                layer=UNIT_TESTING)
        )
    return suite
