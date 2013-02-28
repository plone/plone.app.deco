GIT = git
NPM = npm
JAM = ./node_modules/.bin/jam
LESSC = ./node_modules/.bin/lessc
CSSMIN = ./node_modules/.bin/cssmin
UGLIFYJS = ./node_modules/.bin/uglifyjs
TESTEM = ./node_modules/.bin/testem

DECO = build/deco.js build/deco.toolbar.js build/deco.tile.js build/deco.panel.js build/deco.row.js build/deco.column.js

all:: deco

clean: clean_deco

bootstrap:
	mkdir -p build
	$(NPM) install jamjs less cssmin uglify-js --prefix=./node_modules
	$(NPM) install testem --prefix=./node_modules
	$(JAM) install


test:
	$(TESTEM)

test-ci:
	$(TESTEM) ci


clean_deco:
	rm -rf $(DECO)

deco: clean_deco $(DECO)
	# ----------------------------------------------------------------------- #
	# cp build/deco* path/to/plone.app.deco/plone/app/deco/resources/lib/     #
	# ----------------------------------------------------------------------- #

build/toolbar_init.js:
	cat js/iframe.js > $@

build/toolbar_init.min.js:
	$(UGLIFYJS) js/iframe.js > $@

build/toolbar_init.css:
	$(LESSC) less/toolbar_init.less | $(CSSMIN) >> $@                           

build/toolbar.js:
	$(JAM) compile -i js/bundles/toolbar -e jquery --no-minify --almond $@
	echo "require(['js/bundles/toolbar']);" >> $@

build/toolbar.min.js: build/toolbar.js
	$(UGLIFYJS) build/toolbar.js > $@

build/toolbar.css: build/widgets.css
	cat build/widgets.css > $@
	$(LESSC) less/toolbar.less | $(CSSMIN) >> $@                                
	sed -i -e 's@../img/glyphicons-halflings.png@++resource++plone.app.toolbar.png@g' $@

build/toolbar.png:
	cp jam/bootstrap/img/glyphicons-halflings.png $@


.PHONY: all clean bootstrap test test-ci docs publish-demo widgets toolbar
