
import gocept.jslint


class JSLintTest(gocept.jslint.TestCase):

    include = ('plone.app.deco.browser:javascripts',)
    options = (gocept.jslint.TestCase.options +
                ('--predef=jQuery',))
