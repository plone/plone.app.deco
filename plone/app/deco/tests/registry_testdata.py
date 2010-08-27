xml = """
<registry>
    <!-- Primary actions -->
    <records prefix="plone.app.deco.primary_actions.save"
            interface='plone.app.deco.interfaces.IAction'>
        <value key="name">save</value>
        <value key="fieldset">save</value>
        <value key="label">Save</value>
        <value key="action">save</value>
        <value key="icon">False</value>
        <value key="menu">False</value>
    </records>

    <records name="plone.app.deco.primary_actions.cancel"
            interface='plone.app.deco.interfaces.IAction'>
        <value key="name">cancel</value>
        <value key="fieldset">None</value>
        <value key="label">Cancel</value>
        <value key="action">cancel</value>
        <value key="icon">False</value>
        <value key="menu">False</value>
    </records>

    <records name="plone.app.deco.primary_actions.page_properties"
             interface='plone.app.deco.interfaces.IAction'>
        <value key="name">page_properties</value>
        <value key="fieldset">None</value>
        <value key="label">Page properties</value>
        <value key="action">page-properties</value>
        <value key="icon">False</value>
        <value key="menu">False</value>
    </records>


    <!-- secondary actions -->
    <records prefix="plone.app.deco.secondary_actions.layout"
            interface='plone.app.deco.interfaces.IAction'>
        <value key="name">layout</value>
        <value key="fieldset">None</value>
        <value key="label">Layout</value>
        <value key="action">layout</value>
        <value key="icon">False</value>
        <value key="menu">True</value>
    </records>
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

    <records prefix="plone.app.deco.secondary_actions.format"
             interface='plone.app.deco.interfaces.IAction'>
        <value key="name">format</value>
        <value key="fieldset">None</value>
        <value key="label">Format</value>
        <value key="action">format</value>
        <value key="icon">False</value>
        <value key="menu">True</value>
    </records>
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

    <records prefix="plone.app.deco.secondary_actions.insert"
            interface='plone.app.deco.interfaces.IAction'>
        <value key="name">insert</value>
        <value key="fieldset">None</value>
        <value key="label">Insert</value>
        <value key="action">insert</value>
        <value key="icon">False</value>
        <value key="menu">True</value>
    </records>
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
            <element>page-properties</element>
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
    <records prefix="plone.app.deco.structure_tiles.text"
            interface="plone.app.deco.interfaces.ITile">
        <value key="default_value">&lt;p&gt;New block&lt;/p&gt;</value>
        <value key="category">structure</value>
        <value key="read_only">False</value>
        <value key="name">text</value>
        <value key="settings">True</value>
        <value key="favorite">False</value>
        <value key="label">Text</value>
        <value key="tile_type">text</value>
        <value key="rich_text">True</value>
    </records>
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

   <records prefix="plone.app.deco.app_tiles.plone_app_standardtiles_title"
            interface="plone.app.deco.interfaces.ITile">
        <value key="name">plone.app.standardtiles.title</value>
        <value key="label">Title</value>
        <value key="category">fields</value>
        <value key="tile_type">app</value>
        <value key="default_value"></value>
        <value key="read_only">false</value>
        <value key="settings">false</value>
        <value key="favorite">false</value>
        <value key="rich_text">true</value>
    </records>
    <record name="plone.app.deco.app_tiles.plone_app_standardtiles_title.available_actions">
        <field type="plone.registry.field.List">
            <title>Available actions for the Title tile</title>
            <value_type type="plone.registry.field.TextLine" />
        </field>
        <value>
             <element>tile-align-block</element>
             <element>tile-align-right</element>
             <element>tile-align-left</element>
        </value>
    </record>

   <records prefix="plone.app.deco.app_tiles.plone_app_standardtiles_description"
            interface="plone.app.deco.interfaces.ITile">
        <value key="name">plone.app.standardtiles.description</value>
        <value key="label">Description</value>
        <value key="category">fields</value>
        <value key="tile_type">app</value>
        <value key="default_value"></value>
        <value key="read_only">false</value>
        <value key="settings">false</value>
        <value key="favorite">false</value>
        <value key="rich_text">true</value>
    </records>
    <record name="plone.app.deco.app_tiles.plone_app_standardtiles_description.available_actions">
        <field type="plone.registry.field.List">
            <title>Available actions for the Description tile</title>
            <value_type type="plone.registry.field.TextLine" />
        </field>
        <value>
             <element>tile-align-block</element>
             <element>tile-align-right</element>
             <element>tile-align-left</element>
        </value>
    </record>

   <records prefix="plone.app.deco.app_tiles.plone_app_standardtiles_image"
            interface="plone.app.deco.interfaces.ITile">
        <value key="name">plone.app.standardtiles.image</value>
        <value key="label">Image</value>
        <value key="category">media</value>
        <value key="tile_type">app</value>
        <value key="default_value"></value>
        <value key="read_only">false</value>
        <value key="settings">true</value>
        <value key="favorite">false</value>
        <value key="rich_text">false</value>
    </records>
    <record name="plone.app.deco.app_tiles.plone_app_standardtiles_image.available_actions">
        <field type="plone.registry.field.List">
            <title>Available actions for the Image tile</title>
            <value_type type="plone.registry.field.TextLine" />
        </field>
        <value>
             <element>blur</element>
             <element>tile-align-block</element>
             <element>tile-align-right</element>
             <element>tile-align-left</element>
        </value>
    </record>

   <records prefix="plone.app.deco.app_tiles.plone_app_standardtiles_attachment"
            interface="plone.app.deco.interfaces.ITile">
        <value key="name">plone.app.standardtiles.attachment</value>
        <value key="label">Attachment</value>
        <value key="category">media</value>
        <value key="tile_type">app</value>
        <value key="default_value"></value>
        <value key="read_only">false</value>
        <value key="settings">true</value>
        <value key="favorite">false</value>
        <value key="rich_text">false</value>
    </records>
    <record name="plone.app.deco.app_tiles.plone_app_standardtiles_attachment.available_actions">
        <field type="plone.registry.field.List">
            <title>Available actions for the Attachment tile</title>
            <value_type type="plone.registry.field.TextLine" />
        </field>
        <value>
             <element>blur</element>
             <element>tile-align-block</element>
             <element>tile-align-right</element>
             <element>tile-align-left</element>
        </value>
    </record>

   <records prefix="plone.app.deco.app_tiles.plone_app_standardtiles_video"
            interface="plone.app.deco.interfaces.ITile">
        <value key="name">plone.app.standardtiles.video</value>
        <value key="label">Video</value>
        <value key="category">media</value>
        <value key="tile_type">app</value>
        <value key="default_value"></value>
        <value key="read_only">false</value>
        <value key="settings">true</value>
        <value key="favorite">false</value>
        <value key="rich_text">false</value>
    </records>
    <record name="plone.app.deco.app_tiles.plone_app_standardtiles_video.available_actions">
        <field type="plone.registry.field.List">
            <title>Available actions for the Video tile</title>
            <value_type type="plone.registry.field.TextLine" />
        </field>
        <value>
             <element>blur</element>
             <element>tile-align-block</element>
             <element>tile-align-right</element>
             <element>tile-align-left</element>
        </value>
    </record>

   <records prefix="plone.app.deco.app_tiles.plone_app_standardtiles_proxy"
            interface="plone.app.deco.interfaces.ITile">
        <value key="name">plone.app.standardtiles.proxy</value>
        <value key="label">Proxy</value>
        <value key="category">media</value>
        <value key="tile_type">app</value>
        <value key="default_value"></value>
        <value key="read_only">false</value>
        <value key="settings">true</value>
        <value key="favorite">false</value>
        <value key="rich_text">false</value>
    </records>
    <record name="plone.app.deco.app_tiles.plone_app_standardtiles_proxy.available_actions">
        <field type="plone.registry.field.List">
            <title>Available actions for the Proxy tile</title>
            <value_type type="plone.registry.field.TextLine" />
        </field>
        <value>
             <element>blur</element>
             <element>tile-align-block</element>
             <element>tile-align-right</element>
             <element>tile-align-left</element>
        </value>
    </record>

   <records prefix="plone.app.deco.app_tiles.plone_app_standardtiles_navigation"
            interface="plone.app.deco.interfaces.ITile">
        <value key="name">plone.app.standardtiles.navigation</value>
        <value key="label">Navtree</value>
        <value key="category">media</value>
        <value key="tile_type">app</value>
        <value key="default_value"></value>
        <value key="read_only">false</value>
        <value key="settings">true</value>
        <value key="favorite">false</value>
        <value key="rich_text">false</value>
    </records>
    <record name="plone.app.deco.app_tiles.plone_app_standardtiles_navigation.available_actions">
        <field type="plone.registry.field.List">
            <title>Available actions for the Navtree tile</title>
            <value_type type="plone.registry.field.TextLine" />
        </field>
        <value>
             <element>blur</element>
             <element>tile-align-block</element>
             <element>tile-align-right</element>
             <element>tile-align-left</element>
        </value>
    </record>

   <records prefix="plone.app.deco.app_tiles.plone_app_standardtiles_discussion"
            interface="plone.app.deco.interfaces.ITile">
        <value key="name">plone.app.standardtiles.discussion</value>
        <value key="label">Discussion</value>
        <value key="category">media</value>
        <value key="tile_type">app</value>
        <value key="default_value"></value>
        <value key="read_only">false</value>
        <value key="settings">true</value>
        <value key="favorite">false</value>
        <value key="rich_text">false</value>
    </records>
    <record name="plone.app.deco.app_tiles.plone_app_standardtiles_discussion.available_actions">
        <field type="plone.registry.field.List">
            <title>Available actions for the Discussion tile</title>
            <value_type type="plone.registry.field.TextLine" />
        </field>
        <value>
             <element>blur</element>
             <element>tile-align-block</element>
             <element>tile-align-right</element>
             <element>tile-align-left</element>
        </value>
    </record>

   <records prefix="plone.app.deco.app_tiles.plone_app_standardtiles_contentlisting"
            interface="plone.app.deco.interfaces.ITile">
        <value key="name">plone.app.standardtiles.contentlisting</value>
        <value key="label">Content listing</value>
        <value key="category">structure</value>
        <value key="tile_type">app</value>
        <value key="default_value"></value>
        <value key="read_only">false</value>
        <value key="settings">true</value>
        <value key="favorite">false</value>
        <value key="rich_text">false</value>
    </records>
    <record name="plone.app.deco.app_tiles.plone_app_standardtiles_contentlisting.available_actions">
        <field type="plone.registry.field.List">
            <title>Available actions for the Content listing tile</title>
            <value_type type="plone.registry.field.TextLine" />
        </field>
        <value>
             <element>blur</element>
             <element>tile-align-block</element>
             <element>tile-align-right</element>
             <element>tile-align-left</element>
        </value>
    </record>

   <records prefix="plone.app.deco.app_tiles.plone_app_standardtiles_rss"
            interface="plone.app.deco.interfaces.ITile">
        <value key="name">plone.app.standardtiles.rss</value>
        <value key="label">RSS</value>
        <value key="category">media</value>
        <value key="tile_type">app</value>
        <value key="default_value"></value>
        <value key="read_only">false</value>
        <value key="settings">true</value>
        <value key="favorite">false</value>
        <value key="rich_text">false</value>
    </records>
    <record name="plone.app.deco.app_tiles.plone_app_standardtiles_rss.available_actions">
        <field type="plone.registry.field.List">
            <title>Available actions for the RSS tile</title>
            <value_type type="plone.registry.field.TextLine" />
        </field>
        <value>
             <element>blur</element>
             <element>tile-align-block</element>
             <element>tile-align-right</element>
             <element>tile-align-left</element>
        </value>
    </record>

   <records prefix="plone.app.deco.app_tiles.plone_app_standardtiles_tableofcontents"
            interface="plone.app.deco.interfaces.ITile">
        <value key="name">plone.app.standardtiles.tableofcontents</value>
        <value key="label">Table of contents</value>
        <value key="category">structure</value>
        <value key="tile_type">app</value>
        <value key="default_value"></value>
        <value key="read_only">false</value>
        <value key="settings">true</value>
        <value key="favorite">false</value>
        <value key="rich_text">false</value>
    </records>
    <record name="plone.app.deco.app_tiles.plone_app_standardtiles_tableofcontents.available_actions">
        <field type="plone.registry.field.List">
            <title>Available actions for the Table of contents tile</title>
            <value_type type="plone.registry.field.TextLine" />
        </field>
        <value>
             <element>blur</element>
             <element>tile-align-block</element>
             <element>tile-align-right</element>
             <element>tile-align-left</element>
        </value>
    </record>

   <records prefix="plone.app.deco.app_tiles.plone_app_standardtiles_document_byline"
            interface="plone.app.deco.interfaces.ITile">
        <value key="name">plone.app.standardtiles.document_byline</value>
        <value key="label">Document byline</value>
        <value key="category">structure</value>
        <value key="tile_type">app</value>
        <value key="default_value"></value>
        <value key="read_only">false</value>
        <value key="settings">true</value>
        <value key="favorite">false</value>
        <value key="rich_text">false</value>
    </records>
    <record name="plone.app.deco.app_tiles.plone_app_standardtiles_document_byline.available_actions">
        <field type="plone.registry.field.List">
            <title>Available actions for the Document byline tile</title>
            <value_type type="plone.registry.field.TextLine" />
        </field>
        <value>
             <element>blur</element>
             <element>tile-align-block</element>
             <element>tile-align-right</element>
             <element>tile-align-left</element>
        </value>
    </record>

   <records prefix="plone.app.deco.app_tiles.plone_app_standardtiles_related_items"
            interface="plone.app.deco.interfaces.ITile">
        <value key="name">plone.app.standardtiles.related_items</value>
        <value key="label">Related items</value>
        <value key="category">structure</value>
        <value key="tile_type">app</value>
        <value key="default_value"></value>
        <value key="read_only">false</value>
        <value key="settings">true</value>
        <value key="favorite">false</value>
        <value key="rich_text">false</value>
    </records>
    <record name="plone.app.deco.app_tiles.plone_app_standardtiles_related_items.available_actions">
        <field type="plone.registry.field.List">
            <title>Available actions for the Related items tile</title>
            <value_type type="plone.registry.field.TextLine" />
        </field>
        <value>
             <element>blur</element>
             <element>tile-align-block</element>
             <element>tile-align-right</element>
             <element>tile-align-left</element>
        </value>
    </record>

   <records prefix="plone.app.deco.app_tiles.plone_app_standardtiles_calendar"
            interface="plone.app.deco.interfaces.ITile">
        <value key="name">plone.app.standardtiles.calendar</value>
        <value key="label">Calendar</value>
        <value key="category">media</value>
        <value key="tile_type">app</value>
        <value key="default_value"></value>
        <value key="read_only">false</value>
        <value key="settings">true</value>
        <value key="favorite">false</value>
        <value key="rich_text">false</value>
    </records>
    <record name="plone.app.deco.app_tiles.plone_app_standardtiles_calendar.available_actions">
        <field type="plone.registry.field.List">
            <title>Available actions for the Calendar tile</title>
            <value_type type="plone.registry.field.TextLine" />
        </field>
        <value>
             <element>blur</element>
             <element>tile-align-block</element>
             <element>tile-align-right</element>
             <element>tile-align-left</element>
        </value>
    </record>

   <records prefix="plone.app.deco.app_tiles.plone_app_standardtiles_keywords"
            interface="plone.app.deco.interfaces.ITile">
        <value key="name">plone.app.standardtiles.keywords</value>
        <value key="label">Keywords</value>
        <value key="category">structure</value>
        <value key="tile_type">app</value>
        <value key="default_value"></value>
        <value key="read_only">false</value>
        <value key="settings">true</value>
        <value key="favorite">false</value>
        <value key="rich_text">false</value>
    </records>
    <record name="plone.app.deco.app_tiles.plone_app_standardtiles_keywords.available_actions">
        <field type="plone.registry.field.List">
            <title>Available actions for the Keywords tile</title>
            <value_type type="plone.registry.field.TextLine" />
        </field>
        <value>
             <element>blur</element>
             <element>tile-align-block</element>
             <element>tile-align-right</element>
             <element>tile-align-left</element>
        </value>
    </record>
 </registry>
"""

parsed_data = {'tiles': [{'tiles': [{'category': u'media', 'default_value': None, 'name': u'plone.app.standardtiles.discussion', 'settings': True, 'tile_type': u'app', 'favorite': False, 'label': u'Discussion', 'read_only': False, 'available_actions': [u'blur', u'tile-align-block', u'tile-align-right', u'tile-align-left'], 'rich_text': False}, {'category': u'media', 'default_value': None, 'name': u'plone.app.standardtiles.video', 'settings': True, 'tile_type': u'app', 'favorite': False, 'label': u'Video', 'read_only': False, 'available_actions': [u'blur', u'tile-align-block', u'tile-align-right', u'tile-align-left'], 'rich_text': False}, {'category': u'media', 'default_value': None, 'name': u'plone.app.standardtiles.navigation', 'settings': True, 'tile_type': u'app', 'favorite': False, 'label': u'Navtree', 'read_only': False, 'available_actions': [u'blur', u'tile-align-block', u'tile-align-right', u'tile-align-left'], 'rich_text': False}, {'category': u'media', 'default_value': None, 'name': u'plone.app.standardtiles.rss', 'settings': True, 'tile_type': u'app', 'favorite': False, 'label': u'RSS', 'read_only': False, 'available_actions': [u'blur', u'tile-align-block', u'tile-align-right', u'tile-align-left'], 'rich_text': False}, {'category': u'media', 'default_value': None, 'name': u'plone.app.standardtiles.image', 'settings': True, 'tile_type': u'app', 'favorite': False, 'label': u'Image', 'read_only': False, 'available_actions': [u'blur', u'tile-align-block', u'tile-align-right', u'tile-align-left'], 'rich_text': False}, {'category': u'media', 'default_value': None, 'name': u'plone.app.standardtiles.calendar', 'settings': True, 'tile_type': u'app', 'favorite': False, 'label': u'Calendar', 'read_only': False, 'available_actions': [u'blur', u'tile-align-block', u'tile-align-right', u'tile-align-left'], 'rich_text': False}, {'category': u'media', 'default_value': None, 'name': u'plone.app.standardtiles.proxy', 'settings': True, 'tile_type': u'app', 'favorite': False, 'label': u'Proxy', 'read_only': False, 'available_actions': [u'blur', u'tile-align-block', u'tile-align-right', u'tile-align-left'], 'rich_text': False}, {'category': u'media', 'default_value': None, 'name': u'plone.app.standardtiles.attachment', 'settings': True, 'tile_type': u'app', 'favorite': False, 'label': u'Attachment', 'read_only': False, 'available_actions': [u'blur', u'tile-align-block', u'tile-align-right', u'tile-align-left'], 'rich_text': False}], 'name': u'media', 'label': u'Media'}, {'tiles': [{'category': u'structure', 'default_value': u'<p>New block</p>', 'name': u'text', 'settings': True, 'tile_type': u'text', 'favorite': False, 'label': u'Text', 'read_only': False, 'available_actions': [u'strong', u'em', u'paragraph', u'heading', u'subheading', u'discreet', u'literal', u'quote', u'callout', u'highlight', u'sub', u'sup', u'remove-format', u'pagebreak', u'ul', u'ol', u'justify-left', u'justify-center', u'justify-right', u'justify-justify', u'tile-align-block', u'tile-align-right'], 'rich_text': True}, {'category': u'structure', 'default_value': None, 'name': u'plone.app.standardtiles.keywords', 'settings': True, 'tile_type': u'app', 'favorite': False, 'label': u'Keywords', 'read_only': False, 'available_actions': [u'blur', u'tile-align-block', u'tile-align-right', u'tile-align-left'], 'rich_text': False}, {'category': u'structure', 'default_value': None, 'name': u'plone.app.standardtiles.contentlisting', 'settings': True, 'tile_type': u'app', 'favorite': False, 'label': u'Content listing', 'read_only': False, 'available_actions': [u'blur', u'tile-align-block', u'tile-align-right', u'tile-align-left'], 'rich_text': False}, {'category': u'structure', 'default_value': None, 'name': u'plone.app.standardtiles.related_items', 'settings': True, 'tile_type': u'app', 'favorite': False, 'label': u'Related items', 'read_only': False, 'available_actions': [u'blur', u'tile-align-block', u'tile-align-right', u'tile-align-left'], 'rich_text': False}, {'category': u'structure', 'default_value': None, 'name': u'plone.app.standardtiles.document_byline', 'settings': True, 'tile_type': u'app', 'favorite': False, 'label': u'Document byline', 'read_only': False, 'available_actions': [u'blur', u'tile-align-block', u'tile-align-right', u'tile-align-left'], 'rich_text': False}, {'category': u'structure', 'default_value': None, 'name': u'plone.app.standardtiles.tableofcontents', 'settings': True, 'tile_type': u'app', 'favorite': False, 'label': u'Table of contents', 'read_only': False, 'available_actions': [u'blur', u'tile-align-block', u'tile-align-right', u'tile-align-left'], 'rich_text': False}], 'name': u'structure', 'label': u'Structure'}, {'tiles': [{'category': u'fields', 'default_value': None, 'name': u'plone.app.standardtiles.description', 'settings': False, 'tile_type': u'app', 'favorite': False, 'label': u'Description', 'read_only': False, 'available_actions': [u'tile-align-block', u'tile-align-right', u'tile-align-left'], 'rich_text': True}, {'category': u'fields', 'default_value': None, 'name': u'plone.app.standardtiles.title', 'settings': False, 'tile_type': u'app', 'favorite': False, 'label': u'Title', 'read_only': False, 'available_actions': [u'tile-align-block', u'tile-align-right', u'tile-align-left'], 'rich_text': True}], 'name': u'fields', 'label': u'Fields'}], 'secondary_actions': [{'name': u'None', 'actions': [{'fieldset': u'None', 'name': u'insert', 'items': {u'none': u'Insert'}, 'label': u'Insert', 'menu': True, 'action': u'insert', 'icon': False}, {'fieldset': u'None', 'name': u'layout', 'items': {u'none': u'Layout', u'another': u'Choose another...', u'template': u'Save as template...', u'newslisting': u'News listing', u'projectdetails': u'Project details', u'gallery': u'Gallery'}, 'label': u'Layout', 'menu': True, 'action': u'layout', 'icon': False}, {'fieldset': u'None', 'name': u'format', 'items': {u'none': u'Format'}, 'label': u'Format', 'menu': True, 'action': u'format', 'icon': False}], 'label': u'None'}, {'name': u'None', 'actions': [], 'label': u'None'}, {'name': u'None', 'actions': [], 'label': u'None'}], 'primary_actions': [{'name': u'save', 'actions': [{'fieldset': u'save', 'name': u'save', 'menu': False, 'label': u'Save', 'action': u'save', 'icon': False}], 'label': u'save'}], 'default_available_actions': [u'save', u'cancel', u'page-properties', u'undo', u'redo', u'format', u'insert'], 'formats': [{'name': u'selection', 'actions': [{'category': u'selection', 'name': u'sub', 'favorite': False, 'label': u'Subscript', 'action': u'sub', 'icon': True}, {'category': u'selection', 'name': u'sup', 'favorite': False, 'label': u'Superscript', 'action': u'sup', 'icon': True}, {'category': u'selection', 'name': u'highlight', 'favorite': False, 'label': u'Highlight', 'action': u'highlight', 'icon': True}, {'category': u'selection', 'name': u'remove-format', 'favorite': False, 'label': u'(Remove format)', 'action': u'remove-format', 'icon': True}], 'label': u'Selection'}, {'name': u'actions', 'actions': [], 'label': u'Actions'}, {'name': u'print', 'actions': [{'category': u'print', 'name': u'pagebreak', 'favorite': False, 'label': u'Page break', 'action': u'pagebreak', 'icon': True}], 'label': u'Print'}, {'name': u'text', 'actions': [{'category': u'text', 'name': u'em', 'favorite': True, 'label': u'I', 'action': u'em', 'icon': False}, {'category': u'text', 'name': u'callout', 'favorite': False, 'label': u'Callout', 'action': u'callout', 'icon': True}, {'category': u'text', 'name': u'subheading', 'favorite': False, 'label': u'Subheading', 'action': u'subheading', 'icon': True}, {'category': u'text', 'name': u'literal', 'favorite': False, 'label': u'Literal', 'action': u'literal', 'icon': True}, {'category': u'text', 'name': u'quote', 'favorite': False, 'label': u'Quote', 'action': u'quote', 'icon': True}, {'category': u'text', 'name': u'discreet', 'favorite': False, 'label': u'Discreet', 'action': u'discreet', 'icon': True}, {'category': u'text', 'name': u'strong', 'favorite': True, 'label': u'B', 'action': u'strong', 'icon': False}, {'category': u'text', 'name': u'paragraph', 'favorite': False, 'label': u'Paragraph', 'action': u'paragraph', 'icon': True}, {'category': u'text', 'name': u'heading', 'favorite': False, 'label': u'Heading', 'action': u'heading', 'icon': True}], 'label': u'Text'}, {'name': u'lists', 'actions': [{'category': u'lists', 'name': u'ol', 'favorite': False, 'label': u'Ordered list', 'action': u'ol', 'icon': True}, {'category': u'lists', 'name': u'ul', 'favorite': False, 'label': u'Unordered list', 'action': u'ul', 'icon': True}], 'label': u'Lists'}, {'name': u'justify', 'actions': [{'category': u'justify', 'name': u'tile-align-right', 'favorite': False, 'label': u'Tile right', 'action': u'tile-align-right', 'icon': True}, {'category': u'justify', 'name': u'justify-justify', 'favorite': False, 'label': u'Justified', 'action': u'justify-justify', 'icon': True}, {'category': u'justify', 'name': u'tile-align-block', 'favorite': False, 'label': u'Tile block', 'action': u'tile-align-block', 'icon': True}, {'category': u'justify', 'name': u'justify-left', 'favorite': False, 'label': u'Left-aligned', 'action': u'justify-left', 'icon': True}, {'category': u'justify', 'name': u'tile-align-left', 'favorite': False, 'label': u'Tile left', 'action': u'tile-align-left', 'icon': True}, {'category': u'justify', 'name': u'justify-center', 'favorite': False, 'label': u'Center', 'action': u'justify-center', 'icon': True}, {'category': u'justify', 'name': u'justify-right', 'favorite': False, 'label': u'Right-aligned', 'action': u'justify-right', 'icon': True}], 'label': u'Justify'}]}

parsed_format_categories_data = {'formats': [{'name': u'selection', 'actions': [], 'label': u'Selection'}, {'name': u'actions', 'actions': [], 'label': u'Actions'}, {'name': u'print', 'actions': [], 'label': u'Print'}, {'name': u'text', 'actions': [], 'label': u'Text'}, {'name': u'lists', 'actions': [], 'label': u'Lists'}, {'name': u'justify', 'actions': [], 'label': u'Justify'}]}

parsed_format_data = {'formats': [{'name': u'selection', 'actions': [{'category': u'selection', 'name': u'sub', 'favorite': False, 'label': u'Subscript', 'action': u'sub', 'icon': True}, {'category': u'selection', 'name': u'sup', 'favorite': False, 'label': u'Superscript', 'action': u'sup', 'icon': True}, {'category': u'selection', 'name': u'highlight', 'favorite': False, 'label': u'Highlight', 'action': u'highlight', 'icon': True}, {'category': u'selection', 'name': u'remove-format', 'favorite': False, 'label': u'(Remove format)', 'action': u'remove-format', 'icon': True}], 'label': u'Selection'}, {'name': u'actions', 'actions': [], 'label': u'Actions'}, {'name': u'print', 'actions': [{'category': u'print', 'name': u'pagebreak', 'favorite': False, 'label': u'Page break', 'action': u'pagebreak', 'icon': True}], 'label': u'Print'}, {'name': u'text', 'actions': [{'category': u'text', 'name': u'em', 'favorite': True, 'label': u'I', 'action': u'em', 'icon': False}, {'category': u'text', 'name': u'callout', 'favorite': False, 'label': u'Callout', 'action': u'callout', 'icon': True}, {'category': u'text', 'name': u'subheading', 'favorite': False, 'label': u'Subheading', 'action': u'subheading', 'icon': True}, {'category': u'text', 'name': u'literal', 'favorite': False, 'label': u'Literal', 'action': u'literal', 'icon': True}, {'category': u'text', 'name': u'quote', 'favorite': False, 'label': u'Quote', 'action': u'quote', 'icon': True}, {'category': u'text', 'name': u'discreet', 'favorite': False, 'label': u'Discreet', 'action': u'discreet', 'icon': True}, {'category': u'text', 'name': u'strong', 'favorite': True, 'label': u'B', 'action': u'strong', 'icon': False}, {'category': u'text', 'name': u'paragraph', 'favorite': False, 'label': u'Paragraph', 'action': u'paragraph', 'icon': True}, {'category': u'text', 'name': u'heading', 'favorite': False, 'label': u'Heading', 'action': u'heading', 'icon': True}], 'label': u'Text'}, {'name': u'lists', 'actions': [{'category': u'lists', 'name': u'ol', 'favorite': False, 'label': u'Ordered list', 'action': u'ol', 'icon': True}, {'category': u'lists', 'name': u'ul', 'favorite': False, 'label': u'Unordered list', 'action': u'ul', 'icon': True}], 'label': u'Lists'}, {'name': u'justify', 'actions': [{'category': u'justify', 'name': u'tile-align-right', 'favorite': False, 'label': u'Tile right', 'action': u'tile-align-right', 'icon': True}, {'category': u'justify', 'name': u'justify-justify', 'favorite': False, 'label': u'Justified', 'action': u'justify-justify', 'icon': True}, {'category': u'justify', 'name': u'tile-align-block', 'favorite': False, 'label': u'Tile block', 'action': u'tile-align-block', 'icon': True}, {'category': u'justify', 'name': u'justify-left', 'favorite': False, 'label': u'Left-aligned', 'action': u'justify-left', 'icon': True}, {'category': u'justify', 'name': u'tile-align-left', 'favorite': False, 'label': u'Tile left', 'action': u'tile-align-left', 'icon': True}, {'category': u'justify', 'name': u'justify-center', 'favorite': False, 'label': u'Center', 'action': u'justify-center', 'icon': True}, {'category': u'justify', 'name': u'justify-right', 'favorite': False, 'label': u'Right-aligned', 'action': u'justify-right', 'icon': True}], 'label': u'Justify'}]}

parsed_tiles_categories_data = {'tiles': [{'tiles': [], 'name': u'media', 'label': u'Media'}, {'tiles': [], 'name': u'structure', 'label': u'Structure'}, {'tiles': [], 'name': u'fields', 'label': u'Fields'}]}

parsed_structure_tiles_data = {'tiles': [{'tiles': [], 'name': u'media', 'label': u'Media'}, {'tiles': [{'category': u'structure', 'default_value': u'<p>New block</p>', 'name': u'text', 'settings': True, 'tile_type': u'text', 'favorite': False, 'label': u'Text', 'read_only': False, 'available_actions': [u'strong', u'em', u'paragraph', u'heading', u'subheading', u'discreet', u'literal', u'quote', u'callout', u'highlight', u'sub', u'sup', u'remove-format', u'pagebreak', u'ul', u'ol', u'justify-left', u'justify-center', u'justify-right', u'justify-justify', u'tile-align-block', u'tile-align-right'], 'rich_text': True}], 'name': u'structure', 'label': u'Structure'}, {'tiles': [], 'name': u'fields', 'label': u'Fields'}]}

parsed_application_tiles_data = {'tiles': [{'tiles': [{'category': u'media', 'default_value': None, 'name': u'plone.app.standardtiles.discussion', 'settings': True, 'tile_type': u'app', 'favorite': False, 'label': u'Discussion', 'read_only': False, 'available_actions': [u'blur', u'tile-align-block', u'tile-align-right', u'tile-align-left'], 'rich_text': False}, {'category': u'media', 'default_value': None, 'name': u'plone.app.standardtiles.video', 'settings': True, 'tile_type': u'app', 'favorite': False, 'label': u'Video', 'read_only': False, 'available_actions': [u'blur', u'tile-align-block', u'tile-align-right', u'tile-align-left'], 'rich_text': False}, {'category': u'media', 'default_value': None, 'name': u'plone.app.standardtiles.navigation', 'settings': True, 'tile_type': u'app', 'favorite': False, 'label': u'Navtree', 'read_only': False, 'available_actions': [u'blur', u'tile-align-block', u'tile-align-right', u'tile-align-left'], 'rich_text': False}, {'category': u'media', 'default_value': None, 'name': u'plone.app.standardtiles.rss', 'settings': True, 'tile_type': u'app', 'favorite': False, 'label': u'RSS', 'read_only': False, 'available_actions': [u'blur', u'tile-align-block', u'tile-align-right', u'tile-align-left'], 'rich_text': False}, {'category': u'media', 'default_value': None, 'name': u'plone.app.standardtiles.image', 'settings': True, 'tile_type': u'app', 'favorite': False, 'label': u'Image', 'read_only': False, 'available_actions': [u'blur', u'tile-align-block', u'tile-align-right', u'tile-align-left'], 'rich_text': False}, {'category': u'media', 'default_value': None, 'name': u'plone.app.standardtiles.calendar', 'settings': True, 'tile_type': u'app', 'favorite': False, 'label': u'Calendar', 'read_only': False, 'available_actions': [u'blur', u'tile-align-block', u'tile-align-right', u'tile-align-left'], 'rich_text': False}, {'category': u'media', 'default_value': None, 'name': u'plone.app.standardtiles.proxy', 'settings': True, 'tile_type': u'app', 'favorite': False, 'label': u'Proxy', 'read_only': False, 'available_actions': [u'blur', u'tile-align-block', u'tile-align-right', u'tile-align-left'], 'rich_text': False}, {'category': u'media', 'default_value': None, 'name': u'plone.app.standardtiles.attachment', 'settings': True, 'tile_type': u'app', 'favorite': False, 'label': u'Attachment', 'read_only': False, 'available_actions': [u'blur', u'tile-align-block', u'tile-align-right', u'tile-align-left'], 'rich_text': False}], 'name': u'media', 'label': u'Media'}, {'tiles': [{'category': u'structure', 'default_value': None, 'name': u'plone.app.standardtiles.keywords', 'settings': True, 'tile_type': u'app', 'favorite': False, 'label': u'Keywords', 'read_only': False, 'available_actions': [u'blur', u'tile-align-block', u'tile-align-right', u'tile-align-left'], 'rich_text': False}, {'category': u'structure', 'default_value': None, 'name': u'plone.app.standardtiles.contentlisting', 'settings': True, 'tile_type': u'app', 'favorite': False, 'label': u'Content listing', 'read_only': False, 'available_actions': [u'blur', u'tile-align-block', u'tile-align-right', u'tile-align-left'], 'rich_text': False}, {'category': u'structure', 'default_value': None, 'name': u'plone.app.standardtiles.related_items', 'settings': True, 'tile_type': u'app', 'favorite': False, 'label': u'Related items', 'read_only': False, 'available_actions': [u'blur', u'tile-align-block', u'tile-align-right', u'tile-align-left'], 'rich_text': False}, {'category': u'structure', 'default_value': None, 'name': u'plone.app.standardtiles.document_byline', 'settings': True, 'tile_type': u'app', 'favorite': False, 'label': u'Document byline', 'read_only': False, 'available_actions': [u'blur', u'tile-align-block', u'tile-align-right', u'tile-align-left'], 'rich_text': False}, {'category': u'structure', 'default_value': None, 'name': u'plone.app.standardtiles.tableofcontents', 'settings': True, 'tile_type': u'app', 'favorite': False, 'label': u'Table of contents', 'read_only': False, 'available_actions': [u'blur', u'tile-align-block', u'tile-align-right', u'tile-align-left'], 'rich_text': False}], 'name': u'structure', 'label': u'Structure'}, {'tiles': [{'category': u'fields', 'default_value': None, 'name': u'plone.app.standardtiles.description', 'settings': False, 'tile_type': u'app', 'favorite': False, 'label': u'Description', 'read_only': False, 'available_actions': [u'tile-align-block', u'tile-align-right', u'tile-align-left'], 'rich_text': True}, {'category': u'fields', 'default_value': None, 'name': u'plone.app.standardtiles.title', 'settings': False, 'tile_type': u'app', 'favorite': False, 'label': u'Title', 'read_only': False, 'available_actions': [u'tile-align-block', u'tile-align-right', u'tile-align-left'], 'rich_text': True}], 'name': u'fields', 'label': u'Fields'}]}
