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
        for name, label in categories.items():
            config['formats'].append({
                'name': name,
                'label': label,
                'actions': [],
            })
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

    def mapFieldTiles(self, settings, config):
        return config

    def __call__(self):
        settings = self.parseRegistry()
        config = {}
        config = self.mapFormatCategories(settings, config)
        config = self.mapFormats(settings, config)
        config = self.mapActions(settings, config)
        config = self.mapTilesCategories(settings, config)
        config = self.mapStructureTiles(settings, config)
        config = self.mapApplicationTiles(settings, config)
        config = self.mapFieldTiles(settings, config)
        return config
