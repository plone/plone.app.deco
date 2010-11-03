from zope.component import adapter

from zope.interface import implements
from zope.interface import implementer

from z3c.form.interfaces import IFieldWidget
from z3c.form.interfaces import IFormLayer

from z3c.form.widget import FieldWidget

from z3c.form.browser.widget import addFieldClass
from z3c.form.browser.textarea import TextAreaWidget

from plone.app.page.interfaces import ILayoutField

from plone.app.deco.interfaces import ILayoutWidget

class LayoutWidget(TextAreaWidget):
    """Default widget for the ILayoutField
    """
    
    implements(ILayoutWidget)

    klass = u'layout-widget'
    
    def update(self):
        super(LayoutWidget, self).update()
        addFieldClass(self)

@implementer(IFieldWidget)
@adapter(ILayoutField, IFormLayer)
def LayoutFieldWidget(field, request):
    return FieldWidget(field, LayoutWidget(request))
