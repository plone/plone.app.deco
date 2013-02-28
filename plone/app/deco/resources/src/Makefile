GIT = git
NPM = npm
JAM = ./node_modules/.bin/jam
UGLIFYJS = ./node_modules/.bin/uglifyjs
TESTEM = ./node_modules/.bin/testem

DECO = build/deco.full.js build/deco.min.js

all:: deco

clean: clean_deco

bootstrap:
	mkdir -p build
	$(NPM) install jamjs uglify-js --prefix=./node_modules
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

build/deco.full.js:
	$(JAM) compile -i js/deco.init -e jquery --no-minify --almond $@
	echo "require(['deco.init']);" >> $@

build/deco.min.js: build/deco.full.js
	$(UGLIFYJS) build/deco.full.js > $@


.PHONY: all clean bootstrap test test-ci deco
