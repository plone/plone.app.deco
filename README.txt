Introduction
============

plone.app.deco is a package containing the front-end code for the UI specified
in the Deco UI Proposal which can be found here:

http://groups.google.com/group/plone-deco/files

i18n
----

All message strings should be in the Plone domain. If you need to add a Plone 5
packages to extract messages, you only have to add in to plone5 variable in
experimental/i18n.cfg and run the buildout. You can do bin/i18n plone5 at any
moment and if there is no error you can commit the changes from
src/plone.app.locales/plone/app/locales/locales-future
