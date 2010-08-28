from zope.component import adapts
from zope.i18n import translate
from zope.interface import implements
from plone.registry.interfaces import IRegistry
from plone.app.deco.interfaces import IDecoRegistryAdapter
from Products.CMFCore.interfaces._content import IFolderish
from zope.site.hooks import getSite

from utils import iterSchemataForType, extractFieldInformation


class DottedDict(dict):
    """A dictionary where you can access nested dicts with dotted names"""

    def get(self, k, default=None):
        if not '.' in k:
            return super(DottedDict, self).get(k, default)
        val = self
        for x in k.split('.'):
            try:
                val = val[x]
            except:
                return default
        return val


def GetBool(value):
    return value.lower() == 'true'


def GetCategoryIndex(tiles, category):
    index = 0
    for tile in tiles:
        if tile['name'] == category:
            return index
        index += 1
    return None


def weightedSort(x, y):
    weight_x = x[1]['weight']
    weight_y = y[1]['weight']
    if weight_x < weight_y:
        return -1
    elif weight_x == weight_y:
        return 0
    return 1


class DecoRegistry(object):
    """Adapts a registry object to parse the deco settings data"""

    implements(IDecoRegistryAdapter)
    adapts(IRegistry)
    prefix = "plone.app.deco"

    def __init__(self, registry):
        self.registry = registry

    def parseRegistry(self):
        """Make a dictionary structure for the values in the registry"""

        result = DottedDict()
        for record in self.registry.records:
            if not record.startswith(self.prefix):
                continue

            splitted = record.split('.')
            current = result
            for x in splitted[:-1]:
                # create the key if it's not there
                if not x in current:
                    current[x] = {}
                current = current[x]

            # store actual key/value
            key = splitted[-1]
            current[key] = self.registry.records[record].value
        return result

    def mapActions(self, settings, config):

        for action_type in ['primary_actions', 'secondary_actions']:
            config[action_type] = []
            key = '%s.%s' % (self.prefix, action_type)
            actions = settings.get(key, {}).items()
            actions.sort(cmp=weightedSort)
            for key, action in actions:
                if not action['fieldset']:
                    config[action_type].append(action)
                    continue

                index = GetCategoryIndex(config[action_type],
                                         action['fieldset'])
                if not index:
                    config[action_type].append({'name': action['fieldset'],
                                                'label': action['fieldset'],
                                                'actions': []})
                    index = GetCategoryIndex(config[action_type],
                                             action['fieldset'])

                config[action_type][index]['actions'].append(action)

        # Default Available Actions
        key = '%s.default_available_actions' % self.prefix
        config['default_available_actions'] = settings.get(key, [])

        return config

    def mapTilesCategories(self, settings, config):
        config['tiles'] = config.get('tiles', [])
        categories = settings.get("%s.tiles_categories" % self.prefix, {})
        for name, label in categories.items():
            config['tiles'].append({
                'name': name,
                'label': label,
                'tiles': [],
            })
        return config

    def mapFormatCategories(self, settings, config):
        config['formats'] = config.get('formats', [])
        categories = settings.get("%s.format_categories" % self.prefix, {})
        sorted_categories = [(x, categories[x]) for x in categories.keys()]
        sorted_categories.sort(cmp=weightedSort)
        for key, category in sorted_categories:
            category['actions'] = []
            config['formats'].append(category)
        print config
        return config

    def mapFormats(self, settings, config):
        formats = settings.get('%s.formats' % self.prefix, {})
        for key, format in formats.items():
            index = GetCategoryIndex(config['formats'], format['category'])
            config['formats'][index]['actions'].append(format)

        return config

    def mapStructureTiles(self, settings, config):
        # Structure Tiles
        tiles = settings.get('%s.structure_tiles' % self.prefix, {})

        for key, tile in tiles.items():
            if not 'category' in tile:
                continue
            index = GetCategoryIndex(config['tiles'], tile['category'])
            config['tiles'][index]['tiles'].append(tile)
        return config

    def mapApplicationTiles(self, settings, config):
        tiles = settings.get('%s.app_tiles' % self.prefix, {})
        for key, tile in tiles.items():
            if not 'category' in tile:
                continue
            index = GetCategoryIndex(config['tiles'], tile['category'])
            config['tiles'][index]['tiles'].append(tile)
        return config

    # BBB: needs a bit of thought, I'm nowhere near satisfied with this
    # solution
    @staticmethod
    def actionsForWidget(settings, widget_name):
        """Looks up which (deco) actions are associated to a certain z3c
        widget.

        The lookup is made in 3 parts:

        - First the registry is looked for a key named
          plone.app.deco.widget_actions.<full widget dotted name>

        - If the key's not found, looks for
          plone.app.deco.widget_actions.<widget name>

        - If it is not found, looks for
          plone.app.deco.default_widget_actions

        The rationale is that using the full dotted name will yield very long
        keys, which can be painful to edit, especially through the web
        interface. Therefore a "shortened" version is provided, and can be used
        as long as naming conflicts do not ensue. If a "short key" is found
        used, the developer has to fall back to the long key: the lookup
        ordering ensures that the right key is always picked up.
        """
        _marker = object()
        for name in [widget_name, widget_name.split('.')[-1]]:
            actions = settings.get(
                'plone.app.deco.widget_actions.%s.actions' % name,
                default=_marker)
            if not actions == _marker:
                return actions
        return settings.get(
            'plone.app.deco.default_widget_actions',
            default=[])

    def mapFieldTiles(self, settings, config, kwargs):
        args = {
            'type': None,
            'context': None,
            'request': None,
        }
        args.update(kwargs)
        if args['type'] is None:
            return config
        prefixes = []

        # Get a request so we can do translations.
        site = getSite()
        request = getattr(site, 'REQUEST', None)
        for index, schema in enumerate(iterSchemataForType(args['type'])):
            prefix = ''
            if index > 0:
                prefix = schema.__name__
                if prefix in prefixes:
                    prefix = schema.__identifier__
                prefixes.append(prefix)
            for fieldconfig in extractFieldInformation(
                        schema, args['context'], args['request'], prefix):
                label = translate(fieldconfig['title'], context=request)
                tileconfig = {
                    'id': 'formfield-form-widgets-%s' % fieldconfig['name'],
                    'name': fieldconfig['name'],
                    'label': label,
                    'category': 'fields',
                    'tile_type': 'field',
                    'read_only': fieldconfig['readonly'],
                    'favorite': False,
                    'widget': fieldconfig['widget'],
                    'available_actions': self.actionsForWidget(
                        settings,
                        fieldconfig['widget']),
                }
                index = GetCategoryIndex(config['tiles'], 'fields')
                config['tiles'][index]['tiles'].append(tileconfig)
        return config

    def __call__(self, **kwargs):
        settings = self.parseRegistry()
        config = {}
        config = self.mapFormatCategories(settings, config)
        config = self.mapFormats(settings, config)
        config = self.mapActions(settings, config)
        config = self.mapTilesCategories(settings, config)
        config = self.mapStructureTiles(settings, config)
        config = self.mapApplicationTiles(settings, config)
        config = self.mapFieldTiles(settings, config, kwargs)

        args = {
            'type': None,
            'context': None,
            'request': None,
        }
        args.update(kwargs)
        if IFolderish.providedBy(args['context']):
            config['parent'] = args['context'].absolute_url() + "/"
        elif args['context']:
            config['parent'] = getattr(args['context'].aq_inner, 'aq_parent',
                                       None).absolute_url() + "/"
        else:
            # context can be None, at least in tests.  Do nothing
            # then.  See test_config in test_decoregistry.py
            pass

        return config
