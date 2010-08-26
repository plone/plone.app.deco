xml = """
<registry>
  <record interface="plone.app.deco.interfaces.IDecoSettings" field="primary_actions">
    <value>
      <element>save|save|Save|Save|save|false|false</element>
      <element>cancel|||Cancel|cancel|false|false</element>
      <element>page_properties|||Page properties|page-properties|false|false</element>
    </value>
  </record>

  <record interface="plone.app.deco.interfaces.IDecoSettings" field="secondary_actions">
    <value>
      <element>layout|||Layout|layout|false|true|none|Layout|newslisting|News listing|projectdetails|Project details|gallery|Gallery|another|Choose another...|template|Save as template...</element>
      <element>format|||Format|format|false|true|none|Format</element>
      <element>insert|||Insert|insert|false|true|none|Insert</element>
    </value>
  </record>

  <record interface="plone.app.deco.interfaces.IDecoSettings" field="default_available_actions">
    <value>
      <element>save</element>
      <element>cancel</element>
      <element>page-properties</element>
      <element>undo</element>
      <element>redo</element>
      <element>format</element>
      <element>insert</element>
    </value>
  </record>

  <record interface="plone.app.deco.interfaces.IDecoSettings" field="format_categories">
    <value>
      <element>actions|Actions</element>
      <element>text|Text</element>
      <element>selection|Selection</element>
      <element>lists|Lists</element>
      <element>justify|Justify</element>
      <element>print|Print</element>
    </value>
  </record>

  <record interface="plone.app.deco.interfaces.IDecoSettings" field="formats">
    <value>
      <element>strong|text|B|strong|false|true</element>
      <element>em|text|I|em|false|true</element>
      <element>paragraph|text|Paragraph|paragraph|true|false</element>
      <element>heading|text|Heading|heading|true|false</element>
      <element>subheading|text|Subheading|subheading|true|false</element>
      <element>discreet|text|Discreet|discreet|true|false</element>
      <element>literal|text|Literal|literal|true|false</element>
      <element>quote|text|Quote|quote|true|false</element>
      <element>callout|text|Callout|callout|true|false</element>
      <element>highlight|selection|Highlight|highlight|true|false</element>
      <element>sub|selection|Subscript|sub|true|false</element>
      <element>sup|selection|Superscript|sup|true|false</element>
      <element>remove-format|selection|(Remove format)|remove-format|true|false</element>
      <element>ul|lists|Unordered list|ul|true|false</element>
      <element>ol|lists|Ordered list|ol|true|false</element>
      <element>justify-left|justify|Left-aligned|justify-left|true|false</element>
      <element>justify-center|justify|Center|justify-center|true|false</element>
      <element>justify-right|justify|Right-aligned|justify-right|true|false</element>
      <element>justify-justify|justify|Justified|justify-justify|true|false</element>
      <element>tile-align-block|justify|Tile block|tile-align-block|true|false</element>
      <element>tile-align-left|justify|Tile left|tile-align-left|true|false</element>
      <element>tile-align-right|justify|Tile right|tile-align-right|true|false</element>
      <element>pagebreak|print|Page break|pagebreak|true|false</element>
    </value>
  </record>

  <record interface="plone.app.deco.interfaces.IDecoSettings" field="tile_categories">
    <value>
      <element>structure|Structure</element>
      <element>media|Media</element>
      <element>fields|Fields</element>
    </value>
  </record>

  <record interface="plone.app.deco.interfaces.IDecoSettings" field="structure_tiles">
    <value>
      <element>text|structure|Text|text|&lt;p&gt;New block&lt;/p&gt;|false|true|false|true|strong|em|paragraph|heading|subheading|discreet|literal|quote|callout|highlight|sub|sup|remove-format|pagebreak|ul|ol|justify-left|justify-center|justify-right|justify-justify|tile-align-block|tile-align-right|tile-align-left'</element>
    </value>
  </record>

  <record interface="plone.app.deco.interfaces.IDecoSettings" field="app_tiles">
    <value>
      <element>plone.app.standardtiles.title|fields|Title|false|false|false|true|tile-align-block|tile-align-right|tile-align-left</element>
      <element>plone.app.standardtiles.description|fields|Description|false|false|false|true|tile-align-block|tile-align-right|tile-align-left</element>
    </value>
  </record>
</registry>
"""

parsed_data = {'tiles': [{'tiles': [{'default_value': u'<p>New block</p>', 'read_only': False, 'name': u'text', 'available_actions': [u'strong', u'em', u'paragraph', u'heading', u'subheading', u'discreet', u'literal', u'quote', u'callout', u'highlight', u'sub', u'sup', u'remove-format', u'pagebreak', u'ul', u'ol', u'justify-left', u'justify-center', u'justify-right', u'justify-justify', u'tile-align-block', u'tile-align-right'], 'settings': True, 'favorite': False, 'type': u'text', 'rich_text': True, 'label': u'Text'}], 'name': u'structure', 'label': u'Structure'}, {'tiles': [], 'name': u'media', 'label': u'Media'}, {'tiles': [{'default_value': '', 'read_only': False, 'name': u'plone.app.standardtiles.title', 'available_actions': [u'tile-align-block', u'tile-align-right'], 'settings': False, 'favorite': False, 'type': 'app', 'rich_text': True, 'label': u'Title'}, {'default_value': '', 'read_only': False, 'name': u'plone.app.standardtiles.description', 'available_actions': [u'tile-align-block', u'tile-align-right'], 'settings': False, 'favorite': False, 'type': 'app', 'rich_text': True, 'label': u'Description'}, {'read_only': False, 'field_type': 'Datetime', 'widget': 'DateTimePickerFieldWidget', 'name': 'date', 'available_actions': ['tile-align-block', 'tile-align-right', 'tile-align-left'], 'settings': True, 'favorite': False, 'type': 'field', 'id': 'formfield-form-widgets-date', 'label': 'Date'}, {'read_only': False, 'field_type': 'Text', 'widget': 'WysiwygFieldWidget', 'name': 'agenda', 'available_actions': ['strong', 'em', 'paragraph', 'heading', 'subheading', 'discreet', 'literal', 'quote', 'callout', 'highlight', 'sub', 'sup', 'remove-format', 'pagebreak', 'ul', 'ol', 'justify-left', 'justify-center', 'justify-right', 'justify-justify', 'tile-align-block', 'tile-align-right', 'tile-align-left'], 'settings': True, 'favorite': False, 'type': 'field', 'id': 'formfield-form-widgets-agenda', 'label': 'Agenda'}, {'widget': 'SelectFieldWidget', 'id': 'formfield-form-widgets-recurrence', 'read_only': True, 'field_type': 'Choice', 'name': 'recurrence', 'settings': False, 'type': 'field', 'favorite': False, 'label': 'Recurrence', 'available_actions': ['tile-align-block', 'tile-align-right', 'tile-align-left'], 'rich_text': True}], 'name': u'fields', 'label': u'Fields'}], 'parent': 'http://nohost/plone/page/', 'default_available_actions': [u'save', u'cancel', u'page-properties', u'undo', u'redo', u'format', u'insert'], 'primary_actions': [{'name': u'save', 'actions': [{'name': u'save', 'menu': False, 'label': u'Save', 'items': [], 'action': u'save', 'icon': False}], 'label': u'Save'}, {'name': u'cancel', 'menu': False, 'label': u'Cancel', 'items': [], 'action': u'cancel', 'icon': False}, {'name': u'page_properties', 'menu': False, 'label': u'Page properties', 'items': [], 'action': u'page-properties', 'icon': False}], 'secondary_actions': [{'name': u'layout', 'menu': True, 'label': u'Layout', 'items': [{'value': u'none', 'label': u'Layout'}, {'value': u'newslisting', 'label': u'News listing'}, {'value': u'projectdetails', 'label': u'Project details'}, {'value': u'gallery', 'label': u'Gallery'}, {'value': u'another', 'label': u'Choose another...'}, {'value': u'template', 'label': u'Save as template...'}], 'action': u'layout', 'icon': False}, {'name': u'format', 'menu': True, 'label': u'Format', 'items': [{'value': u'none', 'label': u'Format'}], 'action': u'format', 'icon': False}, {'name': u'insert', 'menu': True, 'label': u'Insert', 'items': [{'value': u'none', 'label': u'Insert'}], 'action': u'insert', 'icon': False}], 'document_url': 'http://nohost/plone/page', 'formats': [{'name': u'actions', 'actions': [], 'label': u'Actions'}, {'name': u'text', 'actions': [{'action': u'strong', 'icon': False, 'favorite': True, 'name': u'strong', 'label': u'B'}, {'action': u'em', 'icon': False, 'favorite': True, 'name': u'em', 'label': u'I'}, {'action': u'paragraph', 'icon': True, 'favorite': False, 'name': u'paragraph', 'label': u'Paragraph'}, {'action': u'heading', 'icon': True, 'favorite': False, 'name': u'heading', 'label': u'Heading'}, {'action': u'subheading', 'icon': True, 'favorite': False, 'name': u'subheading', 'label': u'Subheading'}, {'action': u'discreet', 'icon': True, 'favorite': False, 'name': u'discreet', 'label': u'Discreet'}, {'action': u'literal', 'icon': True, 'favorite': False, 'name': u'literal', 'label': u'Literal'}, {'action': u'quote', 'icon': True, 'favorite': False, 'name': u'quote', 'label': u'Quote'}, {'action': u'callout', 'icon': True, 'favorite': False, 'name': u'callout', 'label': u'Callout'}], 'label': u'Text'}, {'name': u'selection', 'actions': [{'action': u'highlight', 'icon': True, 'favorite': False, 'name': u'highlight', 'label': u'Highlight'}, {'action': u'sub', 'icon': True, 'favorite': False, 'name': u'sub', 'label': u'Subscript'}, {'action': u'sup', 'icon': True, 'favorite': False, 'name': u'sup', 'label': u'Superscript'}, {'action': u'remove-format', 'icon': True, 'favorite': False, 'name': u'remove-format', 'label': u'(Remove format)'}], 'label': u'Selection'}, {'name': u'lists', 'actions': [{'action': u'ul', 'icon': True, 'favorite': False, 'name': u'ul', 'label': u'Unordered list'}, {'action': u'ol', 'icon': True, 'favorite': False, 'name': u'ol', 'label': u'Ordered list'}], 'label': u'Lists'}, {'name': u'justify', 'actions': [{'action': u'justify-left', 'icon': True, 'favorite': False, 'name': u'justify-left', 'label': u'Left-aligned'}, {'action': u'justify-center', 'icon': True, 'favorite': False, 'name': u'justify-center', 'label': u'Center'}, {'action': u'justify-right', 'icon': True, 'favorite': False, 'name': u'justify-right', 'label': u'Right-aligned'}, {'action': u'justify-justify', 'icon': True, 'favorite': False, 'name': u'justify-justify', 'label': u'Justified'}, {'action': u'tile-align-block', 'icon': True, 'favorite': False, 'name': u'tile-align-block', 'label': u'Tile block'}, {'action': u'tile-align-left', 'icon': True, 'favorite': False, 'name': u'tile-align-left', 'label': u'Tile left'}, {'action': u'tile-align-right', 'icon': True, 'favorite': False, 'name': u'tile-align-right', 'label': u'Tile right'}], 'label': u'Justify'}, {'name': u'print', 'actions': [{'action': u'pagebreak', 'icon': True, 'favorite': False, 'name': u'pagebreak', 'label': u'Page break'}], 'label': u'Print'}]}
