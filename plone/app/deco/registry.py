from zope.component import adapts
from zope.interface import implements
from plone.registry.interfaces import IRegistry
from plone.app.deco.interfaces import IDecoRegistryAdapter


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


class DecoRegistry(object):
    """Adapts a registry object to parse the deco settings data"""

    implements(IDecoRegistryAdapter)
    adapts(IRegistry)
    prefix = "plone.app.deco"

    def __init__(self, registry):
        self.registry = registry

    def parseRegistry(self, registry):
        """Make a dictionary structure for the values in the registry"""

        result = DottedDict()
        for record in registry.records:
            splitted = record.split('.')
            current = result
            for x in splitted[:-1]:
                # create the key if it's not there
                if not x in current:
                    current[x] = {}
                current = current[x]

            # store actual key/value
            key = splitted[-1]
            current[key] = registry.records[record].value

        return result

    def mapActions(self, settings, config):
        return config
        # Primary / Secondary Actions
        for action_type in ['primary_actions', 'secondary_actions']:
            config[action_type] = []
            for action in settings.get(action_type, []):
                action_fields = action.split('|')
                items = []
                if GetBool(action_fields[6]):
                    for i in range(7, len(action_fields), 2):
                        items.append({
                            'value': action_fields[i],
                            'label': action_fields[i + 1],
                        })

                record = {
                    'name': action_fields[0],
                    'label': action_fields[3],
                    'action': action_fields[4],
                    'icon': GetBool(action_fields[5]),
                    'menu': GetBool(action_fields[6]),
                    'items': items,
                }

                # If no fieldset
                if action_fields[1] == '':
                    config[action_type].append(record)

                # Fieldset
                else:

                    # Find fieldset
                    fieldset_index = -1
                    count = 0
                    for config_action in config[action_type]:
                        if config_action['name'] == action_fields[1]:
                            fieldset_index = count
                        count += 1

                    # Fieldset not found
                    if fieldset_index == -1:
                        config[action_type].append({
                            'name': action_fields[1],
                            'label': action_fields[2],
                            'actions': [record],
                        })

                    # Fieldset not found
                    else:
                        config[action_type][fieldset_index]['actions'].append(record)

        # Default Available Actions
        config['default_available_actions'] = settings.get('default_available_actions', [])
        return config

    def mapTilesCategories(self, settings, config):
        config['tiles'] = config.get('tiles', [])
        categories = settings.get("%s.tiles_categories" % self.prefix, [])
        for name, label in categories.items():
            config['tiles'].append({
                'name': name,
                'label': label,
                'tiles': [],
            })
        return config

    def mapFormatCategories(self, settings, config):
        config['formats'] = config.get('formats', [])
        categories = settings.get("%s.format_categories" % self.prefix, [])
        for name, label in categories.items():
            config['formats'].append({
                'name': name,
                'label': label,
                'actions': [],
            })
        return config

    def mapFormats(self, settings, config):
        formats = settings.get('%s.formats' % self.prefix, [])
        for key, format in formats.items():
            index = GetCategoryIndex(config['formats'], format['category'])
            config['formats'][index]['actions'].append(format)

        return config

    def mapStructureTiles(self, settings, config):
        return config
        # Structure Tiles
        for structure_tile in settings.get('structure_tiles', []):
            tile_fields = structure_tile.split('|')
            config['tiles'][GetCategoryIndex(config['tiles'], tile_fields[1])]['tiles'].append({
                'name': tile_fields[0],
                'label': tile_fields[2],
                'type': tile_fields[3],
                'default_value': tile_fields[4],
                'read_only': GetBool(tile_fields[5]),
                'settings': GetBool(tile_fields[6]),
                'favorite': GetBool(tile_fields[7]),
                'rich_text': GetBool(tile_fields[8]),
                'available_actions': tile_fields[9:-1],
            })
        return config

    def mapApplicationTiles(self, settings, config):
        return config
        # Application Tiles
        app_tiles = settings.get('app_tiles', [])
        if app_tiles:
            for app_tile in app_tiles:
                tile_fields = app_tile.split('|')
                config['tiles'][GetCategoryIndex(config['tiles'], tile_fields[1])]['tiles'].append({
                    'name': tile_fields[0],
                    'label': tile_fields[2],
                    'type': 'app',
                    'default_value': '',
                    'read_only': GetBool(tile_fields[3]),
                    'settings': GetBool(tile_fields[4]),
                    'favorite': GetBool(tile_fields[5]),
                    'rich_text': GetBool(tile_fields[6]),
                    'available_actions': tile_fields[7:-1],
                })
        return config

    def mapFieldTiles(self, settings, config):
        return config
        # Field Tiles
        #type = self.context.portal_type
        #if hasattr(self.context.REQUEST, 'type'):
        #    type = self.context.REQUEST['type']
        #fti = getUtility(IDexterityFTI, name=type)
        #for x in fti.lookupSchema():
        #    pass
        #    #log(x)

        #for behavior_name in fti.behaviors:
        #    try:
        #        behavior_interface = resolveDottedName(behavior_name)
        #    except ValueError:
        #        continue
        #    if behavior_interface is not None:
        #        behavior_schema = IFormFieldProvider(behavior_interface, None)
        #        if behavior_schema is not None:
        #            for x in behavior_schema:
        #                pass
        #                #log(x)

        config['tiles'][GetCategoryIndex(config['tiles'], 'fields')]['tiles'].append({
            'name': 'date',
            'label': 'Date',
            'type': 'field',
            'field_type': 'Datetime',
            'widget': 'DateTimePickerFieldWidget',
            'id': 'formfield-form-widgets-date',
            'read_only': False,
            'settings': True,
            'favorite': False,
            'available_actions': ['tile-align-block', 'tile-align-right', 'tile-align-left', ],
        })

        config['tiles'][GetCategoryIndex(config['tiles'], 'fields')]['tiles'].append({
            'name': 'agenda',
            'label': 'Agenda',
            'type': 'field',
            'field_type': 'Text',
            'widget': 'WysiwygFieldWidget',
            'id': 'formfield-form-widgets-agenda',
            'read_only': False,
            'settings': True,
            'favorite': False,
            'available_actions': ['strong', 'em', 'paragraph', 'heading', 'subheading', 'discreet', 'literal', 'quote', 'callout', 'highlight', 'sub', 'sup', 'remove-format', 'pagebreak', 'ul', 'ol', 'justify-left', 'justify-center', 'justify-right', 'justify-justify', 'tile-align-block', 'tile-align-right', 'tile-align-left'],
        })

        config['tiles'][GetCategoryIndex(config['tiles'], 'fields')]['tiles'].append({
            'name': 'recurrence',
            'label': 'Recurrence',
            'type': 'field',
            'field_type': 'Choice',
            'widget': 'SelectFieldWidget',
            'id': 'formfield-form-widgets-recurrence',
            'read_only': True,
            'settings': False,
            'favorite': False,
            'rich_text': True,
            'available_actions': ['tile-align-block', 'tile-align-right', 'tile-align-left'],
        })

        return config

    def __call__(self):
        settings = self.parseRegistry(self.registry)
        config = {}
        config = self.mapFormatCategories(settings, config)
        config = self.mapFormats(settings, config)
        config = self.mapActions(settings, config)
        config = self.mapTilesCategories(settings, config)
        config = self.mapStructureTiles(settings, config)
        config = self.mapApplicationTiles(settings, config)
        config = self.mapFieldTiles(settings, config)
        return config
