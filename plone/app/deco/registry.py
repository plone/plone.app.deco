from zope.component import adapts
from zope.interface import implements
from plone.registry.interfaces import IRegistry
from interfaces import IDecoRegistryAdapter
from Products.CMFCore.interfaces._content import IFolderish


class DottedDict(dict):
    """A dictionary where you can access nested dicts with dotted names"""

    def get(self, k, default=None):
        if not '.' in k:
            return super(DottedDict, self).get(k, default)
        val = self
        for x in k.split('.'):
            val = val[x]
        return val


def GetBool(value):
    return value.lower() == 'true'


def GetCategoryIndex(tiles, category):
    index = 0
    count = 0
    for tile in tiles:
        if tile['name'] == category:
            index = count
        count += 1
    return index


class DecoRegistry(object):
    """Adapts a registry object to parse the deco settings data"""

    implements(IDecoRegistryAdapter)
    adapts(IRegistry)
    prefix = "plone.app.deco"

    def __init__(self, context, registry):
        self.context = context
        self.registry = registry

    def parseRegistry(self):
        """Make a dictionary structure for the values in the registry"""
        result = DottedDict()
        for record in self.context.records:
            splitted = record.split('.')
            current = result
            for x in splitted[:-1]:
                # create the key if it's not there
                if not x in current:
                    current[x] = {}
                current = current[x]

            # store actual key/value
            key = splitted[-1]
            current[key] = self.context.records[record].value

        return result

    def __call__(self):
        settings = self.registry

        # Create empty configuration
        config = {}

        # Primary / Secondary Actions
        for action_type in ['primary_actions', 'secondary_actions']:
            config[action_type] = []
            for action in getattr(settings, action_type):
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

        # Formats
        config['formats'] = []

        # Format Categories
        for format_category in settings.format_categories:
            config['formats'].append({
                'name': format_category.split('|')[0],
                'label': format_category.split('|')[1],
                'actions': [],
            })

        # Formats
        for format in settings.formats:
            format_fields = format.split('|')
            config['formats'][GetCategoryIndex(config['formats'], format_fields[1])]['actions'].append({
                'name': format_fields[0],
                'label': format_fields[2],
                'action': format_fields[3],
                'icon': GetBool(format_fields[4]),
                'favorite': GetBool(format_fields[5]),
            })

        # Default Available Actions
        config['default_available_actions'] = settings.default_available_actions

        # Tiles
        config['tiles'] = []

        # Tile Categories
        for tile_category in settings.tile_categories:
            config['tiles'].append({
                'name': tile_category.split('|')[0],
                'label': tile_category.split('|')[1],
                'tiles': [],
            })

        # Structure Tiles
        for structure_tile in settings.structure_tiles:
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

        # Application Tiles
        if settings.app_tiles:
            for app_tile in settings.app_tiles:
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

        # URLs
        config['document_url'] = self.context.absolute_url()
        if IFolderish.providedBy(self.context):
            config['parent'] = self.context.absolute_url() + "/"
        else:
            config['parent'] = getattr(self.context.aq_inner, 'aq_parent', None).absolute_url() + "/"

        return config
