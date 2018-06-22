import { settings } from './settings';
import getAttribute from './get-attribute';

const targetShouldFocusIn = function($target) {
  return $target.hasAttribute(settings.focusIn);
}

const focusInTarget = function($target) {
  const focusTarget = getAttribute($target, settings.focusIn) || settings.inputTypes;
  const $inputs = $target.querySelectorAll(focusTarget);
  for(const $input of $inputs) {
    if($input.offsetWidth > 0 && $input.offsetHeight > 0) {
      $input.focus();
    }
  }
}

export { targetShouldFocusIn, focusInTarget };