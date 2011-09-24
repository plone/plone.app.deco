import unittest2 as unittest

from plone.app.testing import selenium_layers as layers

from plone.app.deco import testing

DECO_SELENIUM_TESTING = testing.FunctionalTesting(
    bases=(testing.DECO_FUNCTIONAL_TESTING,
           layers.SELENIUM_PLONE_FUNCTIONAL_TESTING),
    name="Deco:Selenium")


class SimpleScenarioTestCase(unittest.TestCase):

    layer = DECO_SELENIUM_TESTING

    def test_basic_deco(self):

        portal = self.layer['portal']
        selenium = self.layer['selenium']

        layers.login(selenium, portal)
