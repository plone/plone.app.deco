xml = """
<registry>
    <!-- Primary actions -->
    <record name="plone.app.deco.primary_actions.save">
        <field type="plone.registry.field.Dict">
            <title>plone.app.deco.primary_actions.save Save</title>
            <key_type type="plone.registry.field.TextLine" />
            <value_type type="plone.registry.field.TextLine" />
        </field>
        <value>
            <element key="name">save</element>
            <element key="fieldset">save</element>
            <element key="label">Save</element>
            <element key="action">save</element>
            <element key="icon">False</element>
            <element key="menu">False</element>
        </value>
    </record>
    <record name="plone.app.deco.primary_actions.cancel">
        <field type="plone.registry.field.Dict">
            <title>plone.app.deco.primary_actions.cancel Cancel</title>
            <key_type type="plone.registry.field.TextLine" />
            <value_type type="plone.registry.field.TextLine" />
        </field>
        <value>
            <element key="name">cancel</element>
            <element key="fieldset"></element>
            <element key="label">Cancel</element>
            <element key="action">cancel</element>
            <element key="icon">False</element>
            <element key="menu">False</element>
        </value>
    </record>
    <record name="plone.app.deco.primary_actions.page_properties">
        <field type="plone.registry.field.Dict">
            <title>plone.app.deco.primary_actions.page_properties Page properties</title>
            <key_type type="plone.registry.field.TextLine" />
            <value_type type="plone.registry.field.TextLine" />
        </field>
        <value>
            <element key="name">page_properties</element>
            <element key="fieldset"></element>
            <element key="label">Page properties</element>
            <element key="action">page-properties</element>
            <element key="icon">False</element>
            <element key="menu">False</element>
        </value>
    </record>


    <!-- secondary actions -->
    <record name="plone.app.deco.secondary_actions.layout">
        <field type="plone.registry.field.Dict">
            <title>plone.app.deco.secondary_actions.layout Layout</title>
            <key_type type="plone.registry.field.TextLine" />
            <value_type type="plone.registry.field.TextLine" />
        </field>
        <value>
            <element key="name">layout</element>
            <element key="fieldset"></element>
            <element key="label">Layout</element>
            <element key="action">layout</element>
            <element key="icon">False</element>
            <element key="menu">True</element>
        </value>
    </record>
    <record name="plone.app.deco.secondary_actions.layout.items">
        <field type="plone.registry.field.Dict">
            <title>Available items for the layout action</title>
            <key_type type="plone.registry.field.TextLine" />
            <value_type type="plone.registry.field.TextLine" />
        </field>
        <value>
            <element key="none">Layout</element>
            <element key="newslisting">News listing</element>
            <element key="projectdetails">Project details</element>
            <element key="gallery">Gallery</element>
            <element key="another">Choose another...</element>
            <element key="template">Save as template...</element>
        </value>
    </record>
    <record name="plone.app.deco.secondary_actions.format">
        <field type="plone.registry.field.Dict">
            <title>plone.app.deco.secondary_actions.format Format</title>
            <key_type type="plone.registry.field.TextLine" />
            <value_type type="plone.registry.field.TextLine" />
        </field>
        <value>
            <element key="name">format</element>
            <element key="fieldset"></element>
            <element key="label">Format</element>
            <element key="action">format</element>
            <element key="icon">False</element>
            <element key="menu">True</element>
        </value>
    </record>
    <record name="plone.app.deco.secondary_actions.format.items">
        <field type="plone.registry.field.Dict">
            <title>Available items for the format action</title>
            <key_type type="plone.registry.field.TextLine" />
            <value_type type="plone.registry.field.TextLine" />
        </field>
        <value>
            <element key="none">Format</element>
        </value>
    </record>
    <record name="plone.app.deco.secondary_actions.insert">
        <field type="plone.registry.field.Dict">
            <title>plone.app.deco.secondary_actions.insert Insert</title>
            <key_type type="plone.registry.field.TextLine" />
            <value_type type="plone.registry.field.TextLine" />
        </field>
        <value>
            <element key="name">insert</element>
            <element key="fieldset"></element>
            <element key="label">Insert</element>
            <element key="action">insert</element>
            <element key="icon">False</element>
            <element key="menu">True</element>
        </value>
    </record>
    <record name="plone.app.deco.secondary_actions.insert.items">
        <field type="plone.registry.field.Dict">
            <title>Available items for the insert action</title>
            <key_type type="plone.registry.field.TextLine" />
            <value_type type="plone.registry.field.TextLine" />
        </field>
        <value>
            <element key="none">Insert</element>
        </value>
    </record>



    <!-- Default actions -->
    <record name="plone.app.deco.default_available_actions">
        <field type="plone.registry.field.List">
            <title>Default available actions</title>
            <value_type type="plone.registry.field.TextLine" />
        </field>
        <value>
            <element>save</element>
            <element>cancel</element>
            <element>page_propertiesproperties</element>
            <element>undo</element>
            <element>redo</element>
            <element>format</element>
            <element>insert</element>
        </value>
    </record>

    <!-- Format categories -->
    <record name="plone.app.deco.format_categories">
        <field type="plone.registry.field.Dict">
            <title>Tile categories</title>
            <key_type type="plone.registry.field.TextLine" />
            <value_type type="plone.registry.field.TextLine" />
        </field>
        <value>
            <element key="actions">Actions</element>
            <element key="text">Text</element>
            <element key="selection">Selection</element>
            <element key="lists">Lists</element>
            <element key="justify">Justify</element>
            <element key="print">Print</element>
        </value>
    </record>

    <!-- Formats -->
    <records interface="plone.app.deco.interfaces.IFormat"
             prefix="plone.app.deco.formats.strong"
             >
        <value key="name">strong</value>
        <value key="category">text</value>
        <value key="label">B</value>
        <value key="action">strong</value>
        <value key="icon">false</value>
        <value key="favorite">true</value>
    </records>
    <records interface="plone.app.deco.interfaces.IFormat"
             prefix="plone.app.deco.formats.em"
             >
        <value key="name">em</value>
        <value key="category">text</value>
        <value key="label">I</value>
        <value key="action">em</value>
        <value key="icon">false</value>
        <value key="favorite">true</value>
    </records>
    <records interface="plone.app.deco.interfaces.IFormat"
             prefix="plone.app.deco.formats.paragraph">
        <value key="name">paragraph</value>
        <value key="category">text</value>
        <value key="label">Paragraph</value>
        <value key="action">paragraph</value>
        <value key="icon">true</value>
        <value key="favorite">false</value>
    </records>
    <records interface="plone.app.deco.interfaces.IFormat"
             prefix="plone.app.deco.formats.heading">
        <value key="name">heading</value>
        <value key="category">text</value>
        <value key="label">Heading</value>
        <value key="action">heading</value>
        <value key="icon">true</value>
        <value key="favorite">false</value>
    </records>
    <records interface="plone.app.deco.interfaces.IFormat"
             prefix="plone.app.deco.formats.subheading">
        <value key="name">subheading</value>
        <value key="category">text</value>
        <value key="label">Subheading</value>
        <value key="action">subheading</value>
        <value key="icon">true</value>
        <value key="favorite">false</value>
    </records>
    <records interface="plone.app.deco.interfaces.IFormat"
             prefix="plone.app.deco.formats.discreet">
        <value key="name">discreet</value>
        <value key="category">text</value>
        <value key="label">Discreet</value>
        <value key="action">discreet</value>
        <value key="icon">true</value>
        <value key="favorite">false</value>
    </records>
    <records interface="plone.app.deco.interfaces.IFormat"
             prefix="plone.app.deco.formats.literal">
        <value key="name">literal</value>
        <value key="category">text</value>
        <value key="label">Literal</value>
        <value key="action">literal</value>
        <value key="icon">true</value>
        <value key="favorite">false</value>
    </records>
    <records interface="plone.app.deco.interfaces.IFormat"
             prefix="plone.app.deco.formats.quote">
        <value key="name">quote</value>
        <value key="category">text</value>
        <value key="label">Quote</value>
        <value key="action">quote</value>
        <value key="icon">true</value>
        <value key="favorite">false</value>
    </records>
    <records interface="plone.app.deco.interfaces.IFormat"
             prefix="plone.app.deco.formats.callout">
        <value key="name">callout</value>
        <value key="category">text</value>
        <value key="label">Callout</value>
        <value key="action">callout</value>
        <value key="icon">true</value>
        <value key="favorite">false</value>
    </records>
    <records interface="plone.app.deco.interfaces.IFormat"
             prefix="plone.app.deco.formats.highlight">
        <value key="name">highlight</value>
        <value key="category">selection</value>
        <value key="label">Highlight</value>
        <value key="action">highlight</value>
        <value key="icon">true</value>
        <value key="favorite">false</value>
    </records>
    <records interface="plone.app.deco.interfaces.IFormat"
             prefix="plone.app.deco.formats.sub">
        <value key="name">sub</value>
        <value key="category">selection</value>
        <value key="label">Subscript</value>
        <value key="action">sub</value>
        <value key="icon">true</value>
        <value key="favorite">false</value>
    </records>
    <records interface="plone.app.deco.interfaces.IFormat"
             prefix="plone.app.deco.formats.sup">
        <value key="name">sup</value>
        <value key="category">selection</value>
        <value key="label">Superscript</value>
        <value key="action">sup</value>
        <value key="icon">true</value>
        <value key="favorite">false</value>
    </records>
    <records interface="plone.app.deco.interfaces.IFormat"
             prefix="plone.app.deco.formats.remove_format">
        <value key="name">remove-format</value>
        <value key="category">selection</value>
        <value key="label">(Remove format)</value>
        <value key="action">remove-format</value>
        <value key="icon">true</value>
        <value key="favorite">false</value>
    </records>
    <records interface="plone.app.deco.interfaces.IFormat"
             prefix="plone.app.deco.formats.ul">
        <value key="name">ul</value>
        <value key="category">lists</value>
        <value key="label">Unordered list</value>
        <value key="action">ul</value>
        <value key="icon">true</value>
        <value key="favorite">false</value>
    </records>
    <records interface="plone.app.deco.interfaces.IFormat"
             prefix="plone.app.deco.formats.ol">
        <value key="name">ol</value>
        <value key="category">lists</value>
        <value key="label">Ordered list</value>
        <value key="action">ol</value>
        <value key="icon">true</value>
        <value key="favorite">false</value>
    </records>
    <records interface="plone.app.deco.interfaces.IFormat"
             prefix="plone.app.deco.formats.justify_left">
        <value key="name">justify-left</value>
        <value key="category">justify</value>
        <value key="label">Left-aligned</value>
        <value key="action">justify-left</value>
        <value key="icon">true</value>
        <value key="favorite">false</value>
    </records>
    <records interface="plone.app.deco.interfaces.IFormat"
             prefix="plone.app.deco.formats.justify_center">
        <value key="name">justify-center</value>
        <value key="category">justify</value>
        <value key="label">Center</value>
        <value key="action">justify-center</value>
        <value key="icon">true</value>
        <value key="favorite">false</value>
    </records>
    <records interface="plone.app.deco.interfaces.IFormat"
             prefix="plone.app.deco.formats.justify_right">
        <value key="name">justify-right</value>
        <value key="category">justify</value>
        <value key="label">Right-aligned</value>
        <value key="action">justify-right</value>
        <value key="icon">true</value>
        <value key="favorite">false</value>
    </records>
    <records interface="plone.app.deco.interfaces.IFormat"
             prefix="plone.app.deco.formats.justify_justify">
        <value key="name">justify-justify</value>
        <value key="category">justify</value>
        <value key="label">Justified</value>
        <value key="action">justify-justify</value>
        <value key="icon">true</value>
        <value key="favorite">false</value>
    </records>
    <records interface="plone.app.deco.interfaces.IFormat"
             prefix="plone.app.deco.formats.tile_align_block">
        <value key="name">tile-align-block</value>
        <value key="category">justify</value>
        <value key="label">Tile block</value>
        <value key="action">tile-align-block</value>
        <value key="icon">true</value>
        <value key="favorite">false</value>
    </records>
    <records interface="plone.app.deco.interfaces.IFormat"
             prefix="plone.app.deco.formats.tile_align_left">
        <value key="name">tile-align-left</value>
        <value key="category">justify</value>
        <value key="label">Tile left</value>
        <value key="action">tile-align-left</value>
        <value key="icon">true</value>
        <value key="favorite">false</value>
    </records>
    <records interface="plone.app.deco.interfaces.IFormat"
             prefix="plone.app.deco.formats.tile_align_right">
        <value key="name">tile-align-right</value>
        <value key="category">justify</value>
        <value key="label">Tile right</value>
        <value key="action">tile-align-right</value>
        <value key="icon">true</value>
        <value key="favorite">false</value>
    </records>
    <records interface="plone.app.deco.interfaces.IFormat"
             prefix="plone.app.deco.formats.pagebreak">
        <value key="name">pagebreak</value>
        <value key="category">print</value>
        <value key="label">Page break</value>
        <value key="action">pagebreak</value>
        <value key="icon">true</value>
        <value key="favorite">false</value>
    </records>

    <records interface="plone.app.deco.interfaces.IFormat"
             prefix="plone.app.deco.formats.pagebreak">
        <value key="name">pagebreak</value>
        <value key="category">print</value>
        <value key="label">Page break</value>
        <value key="action">pagebreak</value>
        <value key="icon">true</value>
        <value key="favorite">false</value>
    </records>

    <!-- Tile categories -->
    <record name="plone.app.deco.tiles_categories">
        <field type="plone.registry.field.Dict">
            <title>Tile categories</title>
            <key_type type="plone.registry.field.TextLine" />
            <value_type type="plone.registry.field.TextLine" />
        </field>
        <value>
            <element key="structure">Structure</element>
            <element key="media">Media</element>
            <element key="fields">Fields</element>
        </value>
    </record>

    <!-- Tiles -->
    <record name="plone.app.deco.structure_tiles.text">
        <field type="plone.registry.field.Dict">
            <title>Tile categories</title>
            <key_type type="plone.registry.field.TextLine" />
            <value_type type="plone.registry.field.TextLine" />
        </field>
        <value>
            <element key="default_value">&lt;p&gt;New block&lt;/p&gt;</element>
            <element key="category">structure</element>
            <element key="read_only">False</element>
            <element key="name">text</element>
            <element key="settings">True</element>
            <element key="favorite">False</element>
            <element key="label">Text</element>
            <element key="type">text</element>
            <element key="rich_text">True</element>
        </value>
    </record>
    <record name="plone.app.deco.structure_tiles.text.available_actions">
        <field type="plone.registry.field.List">
            <title>Available actions for the Text structure tile</title>
            <value_type type="plone.registry.field.TextLine" />
        </field>
        <value>
            <element>strong</element>
            <element>em</element>
            <element>paragraph</element>
            <element>heading</element>
            <element>subheading</element>
            <element>discreet</element>
            <element>literal</element>
            <element>quote</element>
            <element>callout</element>
            <element>highlight</element>
            <element>sub</element>
            <element>sup</element>
            <element>remove-format</element>
            <element>pagebreak</element>
            <element>ul</element>
            <element>ol</element>
            <element>justify-left</element>
            <element>justify-center</element>
            <element>justify-right</element>
            <element>justify-justify</element>
            <element>tile-align-block</element>
            <element>tile-align-right</element>
        </value>
    </record>

    <record name="plone.app.deco.app_tiles.plone_app_standardtiles_title">
        <field type="plone.registry.field.Dict">
            <title>plone.app.standardtiles.title</title>
            <key_type type="plone.registry.field.TextLine" />
            <value_type type="plone.registry.field.TextLine" />
        </field>
        <value>
            <element key="read_only">False</element>
            <element key="category">fields</element>
            <element key="name">plone.app.standardtiles.title</element>
            <element key="settings">False</element>
            <element key="favorite">False</element>
            <element key="label">Title</element>
            <element key="rich_text">True</element>
        </value>
    </record>
    <record name="plone.app.deco.app_tiles.plone_app_standardtiles_title.available_actions">
        <field type="plone.registry.field.List">
            <title>Available actions for the Text structure tile</title>
            <value_type type="plone.registry.field.TextLine" />
        </field>
        <value>
            <element>tile-align-block</element>
            <element>tile-align-right</element>
            <element>tile-align-left</element>
        </value>
    </record>
    <record name="plone.app.deco.app_tiles.plone_app_standardtiles_description">
        <field type="plone.registry.field.Dict">
            <title>plone.app.standardtiles.description</title>
            <key_type type="plone.registry.field.TextLine" />
            <value_type type="plone.registry.field.TextLine" />
        </field>
        <value>
            <element key="read_only">False</element>
            <element key="category">fields</element>
            <element key="name">plone.app.standardtiles.description</element>
            <element key="settings">False</element>
            <element key="favorite">False</element>
            <element key="label">Description</element>
            <element key="rich_text">True</element>
        </value>
    </record>
    <record name="plone.app.deco.app_tiles.plone_app_standardtiles_description.available_actions">
        <field type="plone.registry.field.List">
            <title>Available actions for the Text structure tile</title>
            <value_type type="plone.registry.field.TextLine" />
        </field>
        <value>
            <element>tile-align-block</element>
            <element>tile-align-right</element>
            <element>tile-align-left</element>
        </value>
    </record>

</registry>
"""

parsed_data = {'tiles': [{'tiles': [{'default_value': u'<p>New block</p>', 'read_only': False, 'name': u'text', 'available_actions': [u'strong', u'em', u'paragraph', u'heading', u'subheading', u'discreet', u'literal', u'quote', u'callout', u'highlight', u'sub', u'sup', u'remove-format', u'pagebreak', u'ul', u'ol', u'justify-left', u'justify-center', u'justify-right', u'justify-justify', u'tile-align-block', u'tile-align-right'], 'settings': True, 'favorite': False, 'type': u'text', 'rich_text': True, 'label': u'Text'}], 'name': u'structure', 'label': u'Structure'}, {'tiles': [], 'name': u'media', 'label': u'Media'}, {'tiles': [{'default_value': '', 'read_only': False, 'name': u'plone.app.standardtiles.title', 'available_actions': [u'tile-align-block', u'tile-align-right'], 'settings': False, 'favorite': False, 'type': 'app', 'rich_text': True, 'label': u'Title'}, {'default_value': '', 'read_only': False, 'name': u'plone.app.standardtiles.description', 'available_actions': [u'tile-align-block', u'tile-align-right'], 'settings': False, 'favorite': False, 'type': 'app', 'rich_text': True, 'label': u'Description'}, {'read_only': False, 'field_type': 'Datetime', 'widget': 'DateTimePickerFieldWidget', 'name': 'date', 'available_actions': ['tile-align-block', 'tile-align-right', 'tile-align-left'], 'settings': True, 'favorite': False, 'type': 'field', 'id': 'formfield-form-widgets-date', 'label': 'Date'}, {'read_only': False, 'field_type': 'Text', 'widget': 'WysiwygFieldWidget', 'name': 'agenda', 'available_actions': ['strong', 'em', 'paragraph', 'heading', 'subheading', 'discreet', 'literal', 'quote', 'callout', 'highlight', 'sub', 'sup', 'remove-format', 'pagebreak', 'ul', 'ol', 'justify-left', 'justify-center', 'justify-right', 'justify-justify', 'tile-align-block', 'tile-align-right', 'tile-align-left'], 'settings': True, 'favorite': False, 'type': 'field', 'id': 'formfield-form-widgets-agenda', 'label': 'Agenda'}, {'widget': 'SelectFieldWidget', 'id': 'formfield-form-widgets-recurrence', 'read_only': True, 'field_type': 'Choice', 'name': 'recurrence', 'settings': False, 'type': 'field', 'favorite': False, 'label': 'Recurrence', 'available_actions': ['tile-align-block', 'tile-align-right', 'tile-align-left'], 'rich_text': True}], 'name': u'fields', 'label': u'Fields'}], 'default_available_actions': [u'save', u'cancel', u'page-properties', u'undo', u'redo', u'format', u'insert'], 'primary_actions': [{'name': u'save', 'actions': [{'name': u'save', 'menu': False, 'label': u'Save', 'items': [], 'action': u'save', 'icon': False}], 'label': u'Save'}, {'name': u'cancel', 'menu': False, 'label': u'Cancel', 'items': [], 'action': u'cancel', 'icon': False}, {'name': u'page_properties', 'menu': False, 'label': u'Page properties', 'items': [], 'action': u'page-properties', 'icon': False}], 'secondary_actions': [{'name': u'layout', 'menu': True, 'label': u'Layout', 'items': [{'value': u'none', 'label': u'Layout'}, {'value': u'newslisting', 'label': u'News listing'}, {'value': u'projectdetails', 'label': u'Project details'}, {'value': u'gallery', 'label': u'Gallery'}, {'value': u'another', 'label': u'Choose another...'}, {'value': u'template', 'label': u'Save as template...'}], 'action': u'layout', 'icon': False}, {'name': u'format', 'menu': True, 'label': u'Format', 'items': [{'value': u'none', 'label': u'Format'}], 'action': u'format', 'icon': False}, {'name': u'insert', 'menu': True, 'label': u'Insert', 'items': [{'value': u'none', 'label': u'Insert'}], 'action': u'insert', 'icon': False}], 'formats': [{'name': u'actions', 'actions': [], 'label': u'Actions'}, {'name': u'text', 'actions': [{'action': u'strong', 'icon': False, 'favorite': True, 'name': u'strong', 'label': u'B'}, {'action': u'em', 'icon': False, 'favorite': True, 'name': u'em', 'label': u'I'}, {'action': u'paragraph', 'icon': True, 'favorite': False, 'name': u'paragraph', 'label': u'Paragraph'}, {'action': u'heading', 'icon': True, 'favorite': False, 'name': u'heading', 'label': u'Heading'}, {'action': u'subheading', 'icon': True, 'favorite': False, 'name': u'subheading', 'label': u'Subheading'}, {'action': u'discreet', 'icon': True, 'favorite': False, 'name': u'discreet', 'label': u'Discreet'}, {'action': u'literal', 'icon': True, 'favorite': False, 'name': u'literal', 'label': u'Literal'}, {'action': u'quote', 'icon': True, 'favorite': False, 'name': u'quote', 'label': u'Quote'}, {'action': u'callout', 'icon': True, 'favorite': False, 'name': u'callout', 'label': u'Callout'}], 'label': u'Text'}, {'name': u'selection', 'actions': [{'action': u'highlight', 'icon': True, 'favorite': False, 'name': u'highlight', 'label': u'Highlight'}, {'action': u'sub', 'icon': True, 'favorite': False, 'name': u'sub', 'label': u'Subscript'}, {'action': u'sup', 'icon': True, 'favorite': False, 'name': u'sup', 'label': u'Superscript'}, {'action': u'remove-format', 'icon': True, 'favorite': False, 'name': u'remove-format', 'label': u'(Remove format)'}], 'label': u'Selection'}, {'name': u'lists', 'actions': [{'action': u'ul', 'icon': True, 'favorite': False, 'name': u'ul', 'label': u'Unordered list'}, {'action': u'ol', 'icon': True, 'favorite': False, 'name': u'ol', 'label': u'Ordered list'}], 'label': u'Lists'}, {'name': u'justify', 'actions': [{'action': u'justify-left', 'icon': True, 'favorite': False, 'name': u'justify-left', 'label': u'Left-aligned'}, {'action': u'justify-center', 'icon': True, 'favorite': False, 'name': u'justify-center', 'label': u'Center'}, {'action': u'justify-right', 'icon': True, 'favorite': False, 'name': u'justify-right', 'label': u'Right-aligned'}, {'action': u'justify-justify', 'icon': True, 'favorite': False, 'name': u'justify-justify', 'label': u'Justified'}, {'action': u'tile-align-block', 'icon': True, 'favorite': False, 'name': u'tile-align-block', 'label': u'Tile block'}, {'action': u'tile-align-left', 'icon': True, 'favorite': False, 'name': u'tile-align-left', 'label': u'Tile left'}, {'action': u'tile-align-right', 'icon': True, 'favorite': False, 'name': u'tile-align-right', 'label': u'Tile right'}], 'label': u'Justify'}, {'name': u'print', 'actions': [{'action': u'pagebreak', 'icon': True, 'favorite': False, 'name': u'pagebreak', 'label': u'Page break'}], 'label': u'Print'}]}

parsed_format_categories_data = {'formats': [{'name': u'selection', 'actions': [], 'label': u'Selection'}, {'name': u'actions', 'actions': [], 'label': u'Actions'}, {'name': u'print', 'actions': [], 'label': u'Print'}, {'name': u'text', 'actions': [], 'label': u'Text'}, {'name': u'lists', 'actions': [], 'label': u'Lists'}, {'name': u'justify', 'actions': [], 'label': u'Justify'}]}

parsed_format_data = {'formats': [{'name': u'selection', 'actions': [{'category': u'selection', 'name': u'sub', 'favorite': False, 'label': u'Subscript', 'action': u'sub', 'icon': True}, {'category': u'selection', 'name': u'sup', 'favorite': False, 'label': u'Superscript', 'action': u'sup', 'icon': True}, {'category': u'selection', 'name': u'highlight', 'favorite': False, 'label': u'Highlight', 'action': u'highlight', 'icon': True}, {'category': u'selection', 'name': u'remove-format', 'favorite': False, 'label': u'(Remove format)', 'action': u'remove-format', 'icon': True}], 'label': u'Selection'}, {'name': u'actions', 'actions': [], 'label': u'Actions'}, {'name': u'print', 'actions': [{'category': u'print', 'name': u'pagebreak', 'favorite': False, 'label': u'Page break', 'action': u'pagebreak', 'icon': True}], 'label': u'Print'}, {'name': u'text', 'actions': [{'category': u'text', 'name': u'em', 'favorite': True, 'label': u'I', 'action': u'em', 'icon': False}, {'category': u'text', 'name': u'callout', 'favorite': False, 'label': u'Callout', 'action': u'callout', 'icon': True}, {'category': u'text', 'name': u'subheading', 'favorite': False, 'label': u'Subheading', 'action': u'subheading', 'icon': True}, {'category': u'text', 'name': u'literal', 'favorite': False, 'label': u'Literal', 'action': u'literal', 'icon': True}, {'category': u'text', 'name': u'quote', 'favorite': False, 'label': u'Quote', 'action': u'quote', 'icon': True}, {'category': u'text', 'name': u'discreet', 'favorite': False, 'label': u'Discreet', 'action': u'discreet', 'icon': True}, {'category': u'text', 'name': u'strong', 'favorite': True, 'label': u'B', 'action': u'strong', 'icon': False}, {'category': u'text', 'name': u'paragraph', 'favorite': False, 'label': u'Paragraph', 'action': u'paragraph', 'icon': True}, {'category': u'text', 'name': u'heading', 'favorite': False, 'label': u'Heading', 'action': u'heading', 'icon': True}], 'label': u'Text'}, {'name': u'lists', 'actions': [{'category': u'lists', 'name': u'ol', 'favorite': False, 'label': u'Ordered list', 'action': u'ol', 'icon': True}, {'category': u'lists', 'name': u'ul', 'favorite': False, 'label': u'Unordered list', 'action': u'ul', 'icon': True}], 'label': u'Lists'}, {'name': u'justify', 'actions': [{'category': u'justify', 'name': u'tile-align-right', 'favorite': False, 'label': u'Tile right', 'action': u'tile-align-right', 'icon': True}, {'category': u'justify', 'name': u'justify-justify', 'favorite': False, 'label': u'Justified', 'action': u'justify-justify', 'icon': True}, {'category': u'justify', 'name': u'tile-align-block', 'favorite': False, 'label': u'Tile block', 'action': u'tile-align-block', 'icon': True}, {'category': u'justify', 'name': u'justify-left', 'favorite': False, 'label': u'Left-aligned', 'action': u'justify-left', 'icon': True}, {'category': u'justify', 'name': u'tile-align-left', 'favorite': False, 'label': u'Tile left', 'action': u'tile-align-left', 'icon': True}, {'category': u'justify', 'name': u'justify-center', 'favorite': False, 'label': u'Center', 'action': u'justify-center', 'icon': True}, {'category': u'justify', 'name': u'justify-right', 'favorite': False, 'label': u'Right-aligned', 'action': u'justify-right', 'icon': True}], 'label': u'Justify'}]}

parsed_tiles_categories_data = {'tiles': [{'tiles': [], 'name': u'media', 'label': u'Media'}, {'tiles': [], 'name': u'structure', 'label': u'Structure'}, {'tiles': [], 'name': u'fields', 'label': u'Fields'}]}

parsed_structure_tiles_data = {'tiles': [{'tiles': [], 'name': u'media', 'label': u'Media'}, {'tiles': [{u'default_value': u'<p>New block</p>', u'category': u'structure', u'name': u'text', u'settings': u'True', 'available_actions': [u'strong', u'em', u'paragraph', u'heading', u'subheading', u'discreet', u'literal', u'quote', u'callout', u'highlight', u'sub', u'sup', u'remove-format', u'pagebreak', u'ul', u'ol', u'justify-left', u'justify-center', u'justify-right', u'justify-justify', u'tile-align-block', u'tile-align-right'], u'favorite': u'False', u'label': u'Text', u'read_only': u'False', u'type': u'text', u'rich_text': u'True'}], 'name': u'structure', 'label': u'Structure'}, {'tiles': [], 'name': u'fields', 'label': u'Fields'}]}