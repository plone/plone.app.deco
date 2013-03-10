from setuptools import setup, find_packages
import sys

version = '1.0'

if sys.version_info[0] == 2 and sys.version_info[1] < 6:
    requires = ['simplejson']
else:
    requires = []

tests_require = [
    'interlude',
    'z3c.form [test]',
    'unittest2',
    'plone.app.testing',
    'robotsuite',
    'robotframework-selenium2library',
    'plone.act',
]


setup(
    name='plone.app.deco',
    version=version,
    description="Package for Deco UI functionality",
    long_description=open("README.rst").read() + "\n" + \
                     open("CHANGELOG.rst").read(),
    classifiers=[
        "Framework :: Plone",
        "Programming Language :: Python",
        "Topic :: Software Development :: Libraries :: Python Modules",
        ],
    keywords='deco plone editor toolbar',
    author='Rob Gietema',
    author_email='rob@fourdigits.nl',
    url='https://github.com/plone/plone.app.deco',
    license='GPL',
    packages=find_packages(),
    namespace_packages=['plone', 'plone.app'],
    include_package_data=True,
    zip_safe=False,
    install_requires=[
        'setuptools',
        'plone.app.jquery',
        'plone.app.blocks',
        'plone.app.tiles',
        'plone.app.toolbar',
        'plone.app.registry>=1.2.2',
        'plone.app.layoutpage',
        'plone.app.texttile',
        'plone.app.imagetile',
#        'plone.app.contenttile',
#        'plone.app.contentlistingtile',
        ] + requires,
    tests_require=tests_require,
    extras_require={'test': tests_require},
    entry_points="""
        [z3c.autoinclude.plugin]
        target = plone
        """,
    )
