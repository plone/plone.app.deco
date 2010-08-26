import unittest2 as unittest
from zope.component import getGlobalSiteManager
from plone.registry import Registry
from plone.registry.interfaces import IRegistry
from plone.app.deco.interfaces import IDecoRegistryAdapter
from plone.app.deco.tests.base import PADECO_FUNCTIONAL_TESTING
import plone.app.deco.tests.registry_testdata as td


class DecoRegistryTest(unittest.TestCase):

    layer = PADECO_FUNCTIONAL_TESTING

    def getLogger(self, value):
        return 'plone.app.deco'

    def shouldPurge(self):
        return False

    def createRegistry(self, xml):
        """Create a registry from a minimal set of fields and operators"""
        from plone.app.registry.exportimport.handler import RegistryImporter
        gsm = getGlobalSiteManager()
        self.registry = Registry()
        gsm.registerUtility(self.registry, IRegistry)

        importer = RegistryImporter(self.registry, self)
        importer.importDocument(xml)
        return self.registry

    def test_format_categories(self):
        registry = self.createRegistry(td.xml)
        adapted = IDecoRegistryAdapter(registry)
        settings = adapted.parseRegistry()
        config = adapted.mapFormatCategories(settings, {})
        self.assertEqual(config, td.parsed_format_categories_data)

    def test_formats(self):
        registry = self.createRegistry(td.xml)
        adapted = IDecoRegistryAdapter(registry)
        settings = adapted.parseRegistry()
        config = adapted.mapFormatCategories(settings, {})
        config = adapted.mapFormats(settings, config)
        self.assertEqual(config, td.parsed_format_data)

    def test_tiles_categories(self):
        registry = self.createRegistry(td.xml)
        adapted = IDecoRegistryAdapter(registry)
        settings = adapted.parseRegistry()
        config = adapted.mapTilesCategories(settings, {})
        self.assertEqual(config, td.parsed_tiles_categories_data)

    def test_parse_registry(self):
        """tests if the parsed registry data is correct"""
        registry = self.createRegistry(td.xml)
        settings = IDecoRegistryAdapter(registry)()
        # self.maxDiff = None
        self.assertEqual(settings, td.parsed_data)
