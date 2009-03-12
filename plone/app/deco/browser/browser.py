from Products.Five import BrowserView
from zope.component import getUtility
from z3c.json import interfaces
from z3c.json import testing
from plone.autoform.interfaces import IFormFieldProvider
from plone.dexterity.interfaces import IDexterityFTI
from plone.dexterity.utils import resolve_dotted_name
from plone.registry.interfaces import IRegistry
from plone.app.deco.interfaces import IDecoSettings
from Products.CMFPlone.utils import log
from Acquisition import aq_inner

class DecoConfigView(BrowserView):

    def __call__(self):
        return self.getConfiguration()

    def getConfiguration(self):
        """Get the configuration of current content type"""

        settings = getUtility(IRegistry).for_interface(IDecoSettings)
        log(settings.structure_tiles)

        fti = getUtility(IDexterityFTI, name=self.context.portal_type)
        for x in fti.lookup_schema():
            log(x)

        for behavior_name in fti.behaviors:
            try:
                behavior_interface = resolve_dotted_name(behavior_name)
            except ValueError:
                continue
            if behavior_interface is not None:
                behavior_schema = IFormFieldProvider(behavior_interface, None)
                if behavior_schema is not None:
                    for x in behavior_schema:
                        log(x)

        config = {}

        config['primary_actions'] = {
            'save': {
                'label': 'Save',
                'actions': {
                    'save': {
                        'label': 'Save',
                        'action': 'save',
                        'icon': False
                    }
                }
            },
            'cancel': {
                'label': 'Cancel',
                'action': 'cancel',
                'icon': False
            },
            'page_properties': {
                'label': 'Page properties',
                'action': 'page-properties',
                'icon': False
            }
        }

        config['secondary_actions'] = {
            'layout': {
                'label': 'Layout...',
                'action': 'layout',
                'icon': False,
                'menu': True,
                'items': [
                    {
                        'value': 'none',
                        'label': 'Layout...'
                    },
                    {
                        'value': 'newslisting',
                        'label': 'News listing'
                    },
                    {
                        'value': 'projectdetails',
                        'label': 'Project details'
                    },
                    {
                        'value': 'gallery',
                        'label': 'Gallery'
                    },
                    {
                        'value': 'another',
                        'label': 'Choose another...'
                    },
                    {
                        'value': 'template',
                        'label': 'Save as template...'
                    }
                ]
            },
            'style': {
                'label': 'Style...',
                'action': 'style',
                'icon': False,
                'menu': True,
                'items': [
                    {
                        'value': 'none',
                        'label': 'Style...'
                    }
                ]
            },
            'insert': {
                'label': 'Insert...',
                'action': 'insert',
                'icon': False,
                'menu': True,
                'items': [
                    {
                        'value': 'none',
                        'label': 'Insert...'
                    }
                ]
            }
        }

        config['styles'] = {
            'text': {
                'label': 'Text',
                'actions': {
                    'strong': {
                        'label': 'B',
                        'action': 'strong',
                        'icon': False,
                        'favorite': True
                    },
                    'em': {
                        'label': 'I',
                        'action': 'em',
                        'icon': False,
                        'favorite': True
                    },
                    'paragraph': {
                        'label': 'Paragraph',
                        'action': 'paragraph',
                        'icon': True,
                        'favorite': False
                    },
                    'heading': {
                        'label': 'Heading',
                        'action': 'heading',
                        'icon': True,
                        'favorite': False
                    },
                    'subheading': {
                        'label': 'Subheading',
                        'action': 'subheading',
                        'icon': True,
                        'favorite': False
                    },
                    'discreet': {
                        'label': 'Discreet',
                        'action': 'discreet',
                        'icon': True,
                        'favorite': False
                    },
                    'literal': {
                        'label': 'Literal',
                        'action': 'literal',
                        'icon': True,
                        'favorite': False
                    },
                    'quote': {
                        'label': 'Quote',
                        'action': 'quote',
                        'icon': True,
                        'favorite': False
                    },
                    'callout': {
                        'label': 'Callout',
                        'action': 'callout',
                        'icon': True,
                        'favorite': False
                    }
                }
            },
            'selection': {
                'label': 'Selection',
                'actions': {
                    'highlight': {
                        'label': 'Highlight',
                        'action': 'highlight',
                        'icon': True,
                        'favorite': False
                    },
                    'sub': {
                        'label': 'Subscript',
                        'action': 'sub',
                        'icon': True,
                        'favorite': False
                    },
                    'sup': {
                        'label': 'Superscript',
                        'action': 'sup',
                        'icon': True,
                        'favorite': False
                    },
                    'remove-style': {
                        'label': '(remove style)',
                        'action': 'remove-style',
                        'icon': True,
                        'favorite': False
                    }
                }
            },
            'lists': {
                'label': 'Lists',
                'actions': {
                    'ul': {
                        'label': 'Unordered list',
                        'action': 'ul',
                        'icon': True,
                        'favorite': True
                    },
                    'ol': {
                        'label': 'Ordered list',
                        'action': 'ol',
                        'icon': True,
                        'favorite': True
                    }
                }
            },
            'justify': {
                'label': 'Justify',
                'actions': {
                    'justify-left': {
                        'label': 'Left-aligned',
                        'action': 'justify-left',
                        'icon': True,
                        'favorite': False
                    },
                    'justify-center': {
                        'label': 'Center',
                        'action': 'justify-center',
                        'icon': True,
                        'favorite': False
                    },
                    'justify-right': {
                        'label': 'Right-aligned',
                        'action': 'justify-right',
                        'icon': True,
                        'favorite': False
                    },
                    'justify-justify': {
                        'label': 'Justified',
                        'action': 'justify-justify',
                        'icon': True,
                        'favorite': False
                    }
                }
            },
            'print': {
                'label': 'Print',
                'actions': {
                    'pagebreak': {
                        'label': 'Page break',
                        'action': 'pagebreak',
                        'icon': True,
                        'favorite': False
                    }
                }
            }
        }

        config['tiles'] = {}
        config['tiles']['structure'] = {
                'label': 'Structure',
                'tiles': {
                    'text': {
                        'label': 'Text',
                        'type': 'text',
                        'default_value': '<p>New block</p>',
                        'read_only': False,
                        'settings': True,
                        'favorite': False,
                        'rich_text': True,
                        'available_actions': ['strong', 'em', 'paragraph', 'heading', 'subheading', 'discreet', 'literal', 'quote', 'callout', 'highlight', 'sub', 'sup', 'remove-style', 'pagebreak', 'ul', 'ol', 'justify-left', 'justify-center', 'justify-right', 'justify-justify', 'tile-align-block', 'tile-align-right', 'tile-align-left']
                    }
                }
            }

        config['tiles']['media'] = {
            'label': 'Media',
            'tiles': {
                'image': {
                    'label': 'Image',
                    'type': 'app',
                    'default_value': '<img src="++resource++plone.app.deco.images/image-placeholder.png" alt="New image"/>',
                    'read_only': True,
                    'settings': True,
                    'favorite': False,
                    'rich_text': False,
                    'available_actions': ['tile-align-block', 'tile-align-right', 'tile-align-left']
                },
                'pony': {
                    'label': 'Pony',
                    'type': 'app',
                    'default_value': "<pre>\n        .,,.\n     ,;;*;;;;,\n    .-'``;-');;.\n   /'  .-.  /*;;\n .'    \d    \;;               .;;;,\n/ o      `    \;    ,__.     ,;*;;;*;,\n\__, _.__,'   \_.-') __)--.;;;;;*;;;;,\n `\"\"`;;;\       /-')_) __)  `\' ';;;;;;\n    ;*;;;        -') `)_)  |\ |  ;;;;*;\n    ;;;;|        `---`    O | | ;;*;;;\n    *;*;\|                 O  / ;;;;;*\n   ;;;;;/|    .-------\      / ;*;;;;;\n  ;;;*;/ \    |        '.   (`. ;;;*;;;\n  ;;;;;'. ;   |          )   \ | ;;;;;;\n  ,;*;;;;\/   |.        /   /` | ';;;*;\n   ;;;;;;/    |/       /   /__/   ';;;\n   '*jgs/     |       /    |      ;*;\n        `\"\"\"\"`        `\"\"\"\"`     ;'\n</pre>",
                    'read_only': True,
                    'settings': True,
                    'favorite': False,
                    'rich_text': False,
                    'available_actions': ['tile-align-block', 'tile-align-right', 'tile-align-left']
                }
            }
        }

        config['tiles']['fields'] = {
            'label': 'Fields',
            'tiles': {}
        }

        config['tiles']['fields']['tiles'] = {
            'title': {
                'label': 'Title',
                'type': 'field',
                'field_type': 'Text line',
                'widget': 'TextFieldWidget',
                'tag': 'h1',
                'id': 'form-widgets-IDublinCore-title',
                'read_only': False,
                'settings': True,
                'favorite': False,
                'available_actions': ['tile-align-block', 'tile-align-right', 'tile-align-left']
            },
            'description': {
                'label': 'Description',
                'type': 'field',
                'field_type': 'Text',
                'widget': 'TextAreaFieldWidget',
                'tag': 'p',
                'id': 'form-widgets-IDublinCore-description',
                'read_only': False,
                'settings': True,
                'favorite': False,
                'available_actions': ['tile-align-block', 'tile-align-right', 'tile-align-left']
            },
            'date': {
                'label': 'Date',
                'type': 'field',
                'field_type': 'Datetime',
                'widget': 'DateTimePickerFieldWidget',
                'id': 'form-widgets-date',
                'read_only': False,
                'settings': True,
                'favorite': False,
                'available_actions': ['tile-align-block', 'tile-align-right', 'tile-align-left']
            },
            'agenda': {
                'label': 'Agenda',
                'type': 'field',
                'field_type': 'Text',
                'widget': 'WysiwygFieldWidget',
                'id': 'form.widgets.agenda',
                'read_only': False,
                'settings': True,
                'favorite': False,
                'available_actions': ['strong', 'em', 'paragraph', 'heading', 'subheading', 'discreet', 'literal', 'quote', 'callout', 'highlight', 'sub', 'sup', 'remove-style', 'pagebreak', 'ul', 'ol', 'justify-left', 'justify-center', 'justify-right', 'justify-justify', 'tile-align-block', 'tile-align-right', 'tile-align-left']
            },
            'recurrence': {
                'label': 'Recurrence',
                'type': 'field',
                'field_type': 'Choice',
                'widget': 'SelectFieldWidget',
                'id': 'form-widgets-recurrence',
                'read_only': True,
                'settings': False,
                'favorite': False,
                'rich_text': True,
                'available_actions': ['tile-align-block', 'tile-align-right', 'tile-align-left']
            }
        }

        config['default_available_actions'] = ['save', 'cancel', 'page-properties', 'undo', 'redo', 'style', 'insert']

        testing.setUpJSONConverter()
        jsonWriter = getUtility(interfaces.IJSONWriter)
        return jsonWriter.write(config)
