from setuptools import setup, find_packages
import os
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
    'selenium>=2.0a5'
]


setup(
    name='plone.app.deco',
    version=version,
    description="Package for Deco UI functionality",
    long_description=open("README.rst").read(),
    classifiers=[
        "Framework :: Plone",
        "Programming Language :: Python",
        "Topic :: Software Development :: Libraries :: Python Modules",
        ],
    keywords='deco plone4',
    author='Rob Gietema',
    author_email='rob@fourdigits.nl',
    url='http://plone.org',
    license='GPL',
    packages=find_packages(),
    namespace_packages=['plone', 'plone.app'],
    include_package_data=True,
    zip_safe=False,
    install_requires=[
        'setuptools',
        'plone.app.blocks',
        'plone.app.tiles',
        'plone.app.registry',
        'plone.app.texttile',
        'plone.app.imagetile',
        'plone.app.layoutpage',
        'plone.app.toolbar',
        'plone.app.jquery',
        ] + requires,
    tests_require=tests_require,
    extras_require={'test': tests_require},
    entry_points="""
        [z3c.autoinclude.plugin]
        target = plone
        """,
    )
