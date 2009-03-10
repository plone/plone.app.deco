from setuptools import setup, find_packages
import os

version = '0.1'

setup(name='experimental.deco',
      version=version,
      description="Experimental package for Deco functionality",
      long_description=open("README.txt").read() + "\n" +
                       open(os.path.join("docs", "HISTORY.txt")).read(),
      # Get more strings from http://www.python.org/pypi?%3Aaction=list_classifiers
      classifiers=[
        "Framework :: Plone",
        "Programming Language :: Python",
        "Topic :: Software Development :: Libraries :: Python Modules",
        ],
      keywords='deco plone4',
      author='Rob Gietema',
      author_email='rob@fourdigits.nl',
      url='http://plone.org/products/plone',
      license='GPL',
      packages=find_packages(exclude=['ez_setup']),
      namespace_packages=['experimental'],
      include_package_data=True,
      zip_safe=False,
      install_requires=[
          'setuptools',
          'z3c.json',
          # -*- Extra requirements: -*-
      ],
      entry_points="""
      # -*- Entry points: -*-
      """,
      )
