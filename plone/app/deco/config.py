
from zope.interface import implements
from zope.component import adapts
from zope.component import getUtility
from zope.i18n import translate
from zope.publisher.browser import BrowserView
from plone.registry.interfaces import IRegistry
from plone.app.deco.interfaces import ITile
from plone.app.deco.interfaces import IDecoConfig
from plone.app.deco import PloneMessageFactory as _

try:
    import json
except:
    import simplejson as json


TRANSLATIONS = {

    # tiles categories
    'tiles-category-structure-label':
        _(u'tiles-category-structure-label', default=u'Structure'),
    'tiles-category-media-label':
        _(u'tiles-category-media-label', default=u'Media'),
    'tiles-category-fields-label':
        _(u'tiles-category-fields-label', default=u'Fields'),
    'tiles-category-applications-label':
        _(u'tiles-category-applications-label', default=u'Applications'),
    'tiles-category-properties-label':
        _(u'tiles-category-properties-label', default=u'Properties'),
    'tiles-category-advanced-label':
        _(u'tiles-category-advanced-label', default=u'Advanced'),

    # tiles
    'tile-text-label':
        _(u'tile-text-label', default=u'Text'),
    'tile-plone.app.deco.title-label':
        _(u'tile-plone.app.deco.title-label', default=u'Title'),
    'tile-plone.app.deco.description-label':
        _(u'tile-plone.app.deco.description-label', default=u'Description'),

}


class DecoConfigView(BrowserView):
    """ JSON view of deco configuration.
    """

    def __call__(self):
        self.request.response.setHeader('Content-Type', 'application/json')
        config = IDecoConfig(getUtility(IRegistry))(self.request)
        return json.dumps(config)


class DecoConfig(object):
    """ Adapts a registry object to parse the deco settings data.
    """

    implements(IDecoConfig)
    adapts(IRegistry)
    prefix = "plone.app.deco"

    def __init__(self, registry):
        self.registry = registry

    def __call__(self, request):
        config = {}

        # tiles categories
        config['tiles_categories'] = []
        for category in self.registry.get(
                self.prefix + '.tiles_categories', []):

            category_label_id = 'tiles-category-' + category + '-label'
            if category_label_id in TRANSLATIONS:
                category_label = TRANSLATIONS[category_label_id]
            else:
                category_label = translate(category_label_id, context=request)

            config['tiles_categories'].append({
                'name': category,
                'label': category_label,
                })

        # tiles
        config['tiles'] = []
        for tile_id in self.registry[self.prefix + '.tiles']:
            tile = self.registry.forInterface(ITile, prefix=tile_id)

            tile_label_id = 'tile-' + tile.name + '-label'
            if tile_label_id in TRANSLATIONS:
                tile_label = TRANSLATIONS[tile_label_id]
            else:
                tile_label = translate(tile_label_id, context=request)

            config['tiles'].append({

                'name': tile.name,
                'category': tile.category,
                'weight': tile.weight,
                })
        # TODO: add field tiles

        return config

"""
class test(object):

    def test2(self):
        settings = self.parseRegistry()
        config = {}
        config = self.mapFormatCategories(settings, config)
        config = self.mapFormats(settings, config)
        config = self.mapActions(settings, config)
        config = self.mapTilesCategories(settings, config)
        for tile_category in ['structure_tiles', 'app_tiles']:
            config = self.mapTiles(settings, config, tile_category)
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

    def parseRegistry(self):
        Make a dictionary structure for the values in the registry

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
                # sort items
                items = action.get('items', {}).values()
                if items:
                    action['items'] = items
                    action['items'].sort(key=itemgetter('weight'))
                    for x in action['items']:
                        x['value'] = x['name']

                if not action['fieldset']:
                    config[action_type].append(action)
                    continue

                index = getCategoryIndex(config[action_type],
                                         action['fieldset'])
                if not index:
                    config[action_type].append({'name': action['fieldset'],
                                                'label': action['fieldset'],
                                                'actions': []})
                    index = getCategoryIndex(config[action_type],
                                             action['fieldset'])

                config[action_type][index]['actions'].append(action)

        # Default Available Actions
        key = '%s.default_available_actions' % self.prefix
        config['default_available_actions'] = settings.get(key, [])

        return config

    def mapTilesCategories(self, settings, config):
        config['tiles'] = config.get('tiles', [])
        categories = settings.get("%s.tiles_categories" % self.prefix, {})
        sorted_categories = [(x, categories[x]) for x in categories.keys()]
        sorted_categories.sort(cmp=weightedSort)
        for key, category in sorted_categories:
            category['tiles'] = []
            config['tiles'].append(category)
        return config

    def mapFormatCategories(self, settings, config):
        config['formats'] = config.get('formats', [])
        categories = settings.get("%s.format_categories" % self.prefix, {})
        sorted_categories = [(x, categories[x]) for x in categories.keys()]
        sorted_categories.sort(cmp=weightedSort)
        for key, category in sorted_categories:
            category['actions'] = []
            config['formats'].append(category)
        return config

    def mapFormats(self, settings, config):
        formats = settings.get('%s.formats' % self.prefix, {})
        for key, format in formats.items():
            index = getCategoryIndex(config['formats'], format['category'])
            config['formats'][index]['actions'].append(format)
        # sort the formats
        for format in config['formats']:
            format['actions'].sort(key=itemgetter('weight'))
        return config

    #def mapStructureTiles(self, settings, config):
    #    # Structure Tiles
    #    tiles = settings.get('%s.structure_tiles' % self.prefix, {})
    #
    #    for key, tile in tiles.items():
    #        if not 'category' in tile:
    #            continue
    #        index = getCategoryIndex(config['tiles'], tile['category'])
    #        config['tiles'][index]['tiles'].append(tile)
    #    for tile in config['tiles']:
    #        tile['tiles'].sort(key=itemgetter('weight'))
    #    return config
    #
    #def mapApplicationTiles(self, settings, config):
    #    tiles = settings.get('%s.app_tiles' % self.prefix, {})
    #    for key, tile in tiles.items():
    #        if not 'category' in tile:
    #            continue
    #        index = getCategoryIndex(config['tiles'], tile['category'])
    #        config['tiles'][index]['tiles'].append(tile)
    #    for tile in config['tiles']:
    #        tile['tiles'].sort(key=itemgetter('weight'))
    #    return config

    def mapTiles(self, settings, config, tile_category):
        tiles = settings.get('%s.%s' % (self.prefix, tile_category), {})
        for key, tile in tiles.items():
            if not 'category' in tile:
                continue
            index = getCategoryIndex(config['tiles'], tile['category'])
            config['tiles'][index]['tiles'].append(tile)
        for tile in config['tiles']:
            tile['tiles'].sort(key=itemgetter('weight'))
        return config

    # BBB: needs a bit of thought, I'm nowhere near satisfied with this
    # solution
    @classmethod
    def actionsForWidget(cls, settings, widget_name):
        Looks up which (deco) actions are associated to a certain z3c
        widget.

        The lookup is made in 2 parts:

        - First the registry is looked for a key named
          plone.app.deco.widget_actions.<'full.widget.dotted.name'
          .replace('.','_')>

        - If it is not found, looks for
          plone.app.deco.default_widget_actions

        The rationale is that this way the three default actions are there by
        default, and only if you need special stuff (probably if you provide an
        inline widget) you can override the default, but for the simple use
        case no interaction is needed

        actions = settings.get(
            '%s.widget_actions.%s.actions' % (
                cls.prefix, widget_name.replace('.', '_'),
            ),
            default=None
        )
        if actions is not None:
            return actions
        return settings.get(
            cls.prefix + '.default_widget_actions',
            default=[],
        )

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

        for index, schema in enumerate(iterSchemataForType(args['type'])):
            prefix = ''
            if index > 0:
                prefix = schema.__name__
                if prefix in prefixes:
                    prefix = schema.__identifier__
                prefixes.append(prefix)
            registry_omitted = settings.get(
                '%s.omitted_fields.%s' % (self.prefix,
                                          args['type'].replace('.', '_')),
                default=None,
            )
            if registry_omitted is None:
                registry_omitted = settings.get(
                    self.prefix + '.default_omitted_fields',
                    default=[],
                )
            for fieldconfig in extractFieldInformation(
                        schema, args['context'], args['request'], prefix):
                if fieldconfig['id'] not in registry_omitted:
                    label = translate(fieldconfig['title'],
                                      context=args['request'])
                    tileconfig = {
                        'id': 'formfield-form-widgets-%s' % (
                            fieldconfig['name'],
                        ),
                        'name': fieldconfig['name'],
                        'label': label,
                        'category': 'fields',
                        'tile_type': 'field',
                        'read_only': fieldconfig['readonly'],
                        'favorite': False,
                        'widget': fieldconfig['widget'],
                        'available_actions': self.actionsForWidget(
                            settings,
                            fieldconfig['widget']
                        ),
                    }
                    index = getCategoryIndex(config['tiles'], 'fields')
                    config['tiles'][index]['tiles'].append(tileconfig)
        return config



class DottedDict(dict):
    A dictionary where you can access nested dicts with dotted names

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


def getBool(value):
    return value.lower() == 'true'


def getCategoryIndex(tiles, category):
    index = 0
    for tile in tiles:
        if tile['name'] == category:
            return index
        index += 1
    return None


def weightedSort(x, y):
    weight_x = x[1]['weight']
    weight_y = y[1]['weight']
    return cmp(weight_x, weight_y)

"""
