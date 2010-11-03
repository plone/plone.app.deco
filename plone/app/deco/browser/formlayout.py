import os.path

from plone.z3cform.templates import ZopeTwoFormTemplateFactory
from plone.app.z3cform.interfaces import IPloneFormLayer

from plone.app.page.interfaces import IPageForm

path = lambda p: os.path.join(os.path.dirname(__file__), 'templates', p)

# Override the plone layout wrapper with an special one to work with Deco
formTemplateFactory = ZopeTwoFormTemplateFactory(
        path('formlayout.pt'),
        form=IPageForm,
        request=IPloneFormLayer,
    )
