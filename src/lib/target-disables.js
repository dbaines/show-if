import { settings } from './settings';

// Find an element and make all input fields within disabled
const disableFieldsIn = function($element) {
  if($element.hasAttribute(settings.disable)) {
    const $inputs = $element.querySelectorAll(settings.inputTypes);
    for(const $input of $inputs) {
      $input.disabled = true;
    }
  }
}

// Find an element and make all input fields within enabled
const enableFieldsIn = function($element) {
  if($element.hasAttribute(settings.disable)) {
    const $inputs = $element.querySelectorAll(settings.inputTypes);
    for(const $input of $inputs) {
      $input.disabled = false;
    }
  }
}

export { disableFieldsIn, enableFieldsIn };