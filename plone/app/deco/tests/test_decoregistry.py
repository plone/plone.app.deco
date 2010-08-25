import unittest2 as unittest
from plone.app.deco.tests.base import PADECO_FUNCTIONAL_TESTING


class DecoRegistryTest(unittest.TestCase):

    layer = PADECO_FUNCTIONAL_TESTING

    def test_parse_registry(self):
        """tests if the parsed registry data is correct"""
        # stub
        self.assertEqual(True, True)
