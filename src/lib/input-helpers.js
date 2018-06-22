import { settings } from './settings';
import getAttribute from './get-attribute';

// Quick check to see if an element is an input type
const isInput = function($element) {
  return settings.inputTypes.indexOf($element.nodeName.toLowerCase()) > -1;
}

// Determine if a field should use .checked or .value
// ie. is this field a checkbox or a radio?
const isInputCheckable = function($input) {
  const type = getAttribute($input, "type");
  if(type) {
    return type === "checkbox" || type === "radio";
  } else {
    return false;
  }
}

export { isInput, isInputCheckable };