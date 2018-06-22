// Simple helper to get an attribute if an element has the attribute
// eg. element.getAttribute("blah") will crash if element does not have an
// attribute of "blah"
export default function($element, attribute) {
  return $element.hasAttribute(attribute) && $element.getAttribute(attribute);
}