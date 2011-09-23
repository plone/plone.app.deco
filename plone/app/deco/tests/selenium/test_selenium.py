import unittest2 as unittest

from plone.app.testing import selenium_layers as layers


class SimpleScenarioTestCase(unittest.TestCase):

    layer = layers.SELENIUM_PLONE_FUNCTIONAL_TESTING

    def test_basic_deco(self):

        portal = self.layer['portal']
        sel = self.layer['selenium']

        layers.open(sel, portal.absolute_url())
