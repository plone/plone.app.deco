This repository is archived and read only.

If you want to unarchive it, then post to the [Admin & Infrastructure (AI) Team category on the Plone Community Forum](https://community.plone.org/c/aiteam/55).

====================
Introduction to Deco
====================

Deco is a graphical editor for Plone.

Concepts
========

Deco, Blocks and Tiles provider a simple, yet powerful way to manage the pages
on your Plone website. At their core, they rely on semantic HTML and resources
with valid, publishable URLs. Below, we will provide an overview of the core
concepts that make up Deco, Blocks and Tiles.

Deco
----

Deco is a visual editor for pages rendered using Blocks. It relies on the
Deco Grid System to place tiles onto a page in an intuitive, WYSIWYG,
drag-and-drop manner. Using Deco, it is easy to compose pages with complex,
balanced and visually appealing layouts.

The Deco editor is invoked when the user switches a page into Edit mode using
the CMS UI toolbar.

The Deco Grid System
--------------------

The Deco Grid System is a simple CSS grid framework. It uses robust,
cross-browser CSS techniques to allow a page to be divided up into logical,
proportionate rows and columns.

The Deco editor uses the CSS classes in the Deco Grid System to allow the
user to resize rows and columns to predefined, visually consistent
proportions.

**Note:** The Deco Grid CSS needs to be included in every Deco-managed page
that is rendered.

Blocks
------

Blocks is a rendering algorithm based on HTML markup conventions. A page
managed by Deco is stored as a simple HTML document representing the actual
content of that page as a standalone, publishable resource devoid of any site
layout content (e.g. global navigation elements). This is referred to as the
**page layout**.

In its ``<html />`` a page layout will have a data attribute like this::

    <html data-layout="..." />

Blocks runs as a post-publication transformation that turns the page layout
into the final page that is returned to the user's browser by merging the page
layout into the referenced **site layout**, and then incorporating tiles into
the page.

**Note:** If Blocks rendering is disabled, requesting a page will return
just the page's content, in a valid, standalone HTML document.

It is important to realise that Blocks does not care how a page was rendered:
it could be a verbatim chunk of HTML fetched from the database (as is usually
the case with Deco-managed pages), the result of rendering a page template, or
some other dynamically generated content. If it has a ``data-layout`` attribute in the
html tag, it will be transformed and merged into the site layout.

**Note:** When ``plone.app.deco`` is installed, it will enable a theme called
``deco`` in portal_skins and switch to it as the default. This installs an
override for Plone's ``main_template`` that lets non-Deco-managed pages
participate in Blocks rendering (i.e. use the current site layout and
tiles).

You can read more about Blocks
`here <http://pypi.python.org/pypi/plone.app.blocks>`_.

Site layout
-----------

As alluded to, the site layout controls the global elements on the final,
rendered page, such as global navigational aids, a search box, header/footer
content and so forth.

The site layout is also just an HTML document as far as Blocks is concerned.
It could be rendered by a page template belonging a view, for example. The
most common approach, however, is to use a **resource directory** of type
``sitelayout``. The Deco control panel and page editing UI provide tools for
managing such resources.

Resource directories are provided by `plone.resource`_. Resources can be
created through the web (including from the Deco control panel), on the
filesystem in a global resource directory (e.g. inside a buildout), or in a
filesystem Python package using a ``<plone:static />`` ZCML directive such
as::

    <plone:static
        type="sitelayout"
        name="mylayout"
        directory="sitelayouts/mylayout"
        />

Inside the resource directory, the site layout should be placed in a file
called ``site.html``. There can optionally also be a file ``manifest.cfg``,
which contains metadata about the layout, e.g.::

    [sitelayout]
    title = My site layout
    description = An interesting site layout

If a layout is created through the web, it will be placed in the
``portal_resources`` directory in the ZODB. See `plone.resource`_ for more.

There is always a site-wide default site layout. This can be changed through
the Deco control panel or with GenericSetup in a ``registry.xml`` file::

    <?xml version="1.0"?>
    <registry>
    
        <record name="plone.defaultSiteLayout">
            <value>./++sitelayout++mylayout/site.html</value>
        </record>
    
    </registry>

Note that this provides a relative path from the context to the site layout.
A URL starting with a ``/`` will be relative to the portal root. The
``++sitelayout++`` traversal namespace allows access to resources of that
type. ``mylayout`` is the name of the layout and ``site.html`` the name of
the file containing the actual layout HTML document.

For Deco-managed pages, site layouts can also be managed per page and per
section:

* Per-page layouts allow the user to switch from, say, a three-column site
  layout with global elements on the left and right to a full-width splash
  page, presuming two site layouts (e.g. ``three-column`` and ``splash-page``)
  have been defined.
  
* Per-section layouts allow the default site layout for all pages underneath
  a given section (i.e. all children and children's children of a given page)
  to be changed.

For this to work without having to modify every page each time the default
or section layout is changed, most page will use a layout attribute like the
following::

    <html data-layout="./@@page-site-layout">...

The ``@@page-site-layout`` view will locate the correct page layout to
use in any given context and return its contents, taking per-page layouts into
account.

For other views, there is a more appropriate site layout indirection view::

    <html data-layout="./@@default-site-layout">...

This still respects global and section layouts, but will not utilise the
page's site layout, which should only apply to the specific view of that page.

Panels
------

Panels are the means by which content from the page layout and site layout
get merged. A panel is a region on the site layout, identified by an ``id``,
that *may* be replaced by a corresponding region on the site.

A panel is defined in the site layout using a link in its head like so::

    <link rel="panel" rev="panel-name" target="placeholder-id" />

In the body of the *site layout*, there should be a placeholder element with
an ``id`` attribute value corresponding to the placeholder id (the ``target``
attribute). If there is an element in the body of the *page layout* with an id
corresponding to the panel name (the ``rev`` attribute), then that element
will replace the corresponding placeholder in the site layout.

**Note:** Any content in the body of the page that is not inside a panel that
is registered in the site layout is discarded when panel merging takes place.

Content in the head of the page layout is merged into the head of the site
layout automatically. For elements such as ``<title />`` or ``<base />`` that
can only appear once, any corresponding element in the site layout is replaced
if it exists in both layouts. For other elements, the page layout's head
contents are merged into the site layout after the site layout's own head
content.

See the `plone.app.blocks`_ documentation for more detailed examples about
this algorithm.

Tiles
-----

Tiles represent the dynamic portions of a page. At its most basic level, a
tile is simply an HTML document with a publishable URL.

In practice, tiles are usually implemented as browser views deriving from the
``Tile`` base class and registered with the ``<plone:tile />`` ZCML directive.
This allows tiles to have some basic metadata and automatically generated edit
forms for any configurable aspects , which Deco will expose to users. See
`plone.tiles`_ for examples.

When work with tiles in Deco, there are three types of tiles:

Text tiles
    Static HTML markup (WYSIWYG-edited text) placed into the page or site
    layout. Strictly speaking, text tiles are not tiles in that they do not
    involve any tile fetching or merging - instead they are stored as part of
    the page or site layout. To the user, however, a text tile can be moved
    around and managed like any other.

Field tiles
    Render the value of a metadata field such as the title or description. The
    values of field tiles may be edited in-place in the page, but the value is
    stored in the underlying field and can be indexed in the catalog, used for
    navigation and so on. In practice, a field tile is an instance of the
    special tile ``plone.app.standardtiles.fields`` with the field name passed
    as a parameter.

App tiles
    Any other type of dynamic tile. Examples may include a folder listing,
    a media player, a poll or pretty much anything else you can think of.

For Deco to know about a tile and make it insertable in the WYSIWYG editor, it
must be registered in ``portal_registry``, usually using the ``registry.xml``
GenericSetup import step. Here is a snippet for the calendar tile::

    <records prefix="plone.app.deco.app_tiles.plone_app_standardtiles_calendar"
            interface="plone.app.deco.interfaces.ITile">
        <value key="name">plone.app.standardtiles.calendar</value>
        <value key="label">Calendar</value>
        <value key="category">applications</value>
        <value key="tile_type">app</value>
        <value key="default_value"></value>
        <value key="read_only">false</value>
        <value key="settings">true</value>
        <value key="favorite">false</value>
        <value key="rich_text">false</value>
        <value key="weight">10</value>
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

Note the ``plone_app_standardtiles_calendar`` unique id that is used in both
records, and the reference to the tile name
(``plone.app.standardtiles.calendar``), which should correspond to the name
used in the ``<plone:tile />`` ZCML directive.

Tiles may be placed in both page layouts and site layouts. In both cases, they
consist of a placeholder element with a unique id and a tile link in the head
of the page, such as::

    <link rel="tile" target="logo" href="./@@plone.app.standardtiles.logo" />

With this link, Blocks will look for the element with id ``logo`` and replace
it with the contents of the tile found by traversing to
``./@@plone.app.standardtiles.logo`` relative to the current context.

If a tile has configuration parameters, these will usually be embedded in a
query string. Tiles with such parameters are known as **transient tiles**::

    <link rel="tile" target="footer-viewlets"
        href="./@@plone.app.standardtiles.viewletmanager/footer?manager=plone.portalfooter" />

If the tile requires more complex configuration that cannot be marshalled into
a query string, it may look up data stored in a persistent annotation on the
current context; in this case, it is known as a **persistent tile**.

**Note:** Where possible, it is best to avoid persistent tiles, as they are
slower and store their data opaquely.

When a tile is rendered (i.e. when its URL is invoked), it should return a
full HTML document. The contents of the ``<body />`` tag will be used to
replace the tile placeholder. Any contents in the tile's ``<head />`` tag will
be merged into the final rendered page's head section. This allows tiles to
request specific CSS or script resources, for instance.

**Note:** In many cases, it will be better to register resources with the
``portal_css`` and ``portal_javascripts`` registries to allow proper merging
and managing of cache headers.

Some tiles are intended for use in the head only, and will have no 
``<body />`` element. In this case, the placeholder id in the tile link (the
``target`` attribute) can be skipped.

See `plone.app.blocks`_ and `plone.tiles`_ for more information about tiles
and how they are incorporated into the page.

Page types (categories)
-----------------------

When Deco is installed, it adds a new type in ``portal_types`` called, simply,
``page``. This is a Dexterity content type that uses the ``ILayoutAware``
behaviour to manage page- and section-specific site layouts as well as the
Deco page layout itself. This in turn is used by the ``@@page-site-layout``
and ``@@default-site-layout`` views.

The ``page`` type uses a special *Factory Type Information* (FTI) type called
the ``Page FTI``. This is an extension of the standard Dexterity FTI that also
stores the default site layout and the template page layout for a site.

A **template page layout** is a resource (in the `plone.resource`_ sense) of
type ``pagelayout``. When a new instance of a given page type is created,
the contents of its template page layout are used as the starting point for
the new content item. 

A page may be *saved as* a new type - which will be addable from the standard
*Add content* user interface - from within the content page editing screens.
Behind the scenes, this results in a copy of the ``page`` portal type being
made with a new title and description as well as a new template page
layout based on the contents of the current page.

**Note:** Page types are sometimes referred to as page *categories*.

Template page layouts, site layouts and page types can all be managed from
the *Deco* control panel.

.. _plone.resource: http://pypi.python.org/pypi/plone.resource
.. _plone.tiles: http://pypi.python.org/pypi/plone.tiles
.. _plone.app.blocks: http://pypi.python.org/pypi/plone.app.blocks
.. _Diazo: http://diazo.org
.. _plone.app.theming: http://pypi.python.org/pypi/plone.app.theming
