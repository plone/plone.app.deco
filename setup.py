from setuptools import setup, find_packages
import os
import sys

version = '0.1'

if sys.version_info[0] == 2 and sys.version_info[1] < 6:
    requires = ['simplejson']
else:
    requires = []

setup(name='plone.app.deco',
      version=version,
      description="Package for Deco UI functionality",
      long_description=open("README.txt").read() + "\n" +
                       open(os.path.join("docs", "HISTORY.txt")).read(),
      # Get more strings from
      # http://www.python.org/pypi?%3Aaction=list_classifiers
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
      packages=find_packages(exclude=['ez_setup']),
      namespace_packages=['plone', 'plone.app'],
      include_package_data=True,
      zip_safe=False,
      install_requires=[
          'setuptools',
          'plone.app.blocks',
          'plone.app.tiles',
          'plone.app.registry',
          'plone.app.dexterity',
          'plone.app.standardtiles',
          'plone.app.page',
          'plone.app.cmsui',
      ] + requires,
      extras_require={
          'test': [
            'interlude',
            'z3c.form [test]',
            'unittest2',
            'plone.app.testing', ]},
      entry_points="""
      [z3c.autoinclude.plugin]
      target = plone
      """,
      )
