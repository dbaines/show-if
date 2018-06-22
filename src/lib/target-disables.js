import { settings } from './settings';

const targetShouldDisable = function($target){
  return $target.hasAttribute(settings.disable);
}

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

export { targetShouldDisable, disableFieldsIn, enableFieldsIn };