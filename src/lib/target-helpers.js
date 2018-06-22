import { settings } from './settings';

const targetIsRequiredIf = function($target) {
  return $target.hasAttribute(settings.requiredIf);
}

const targetShouldDisable = function($target){
  return $target.hasAttribute(settings.disable);
}

const targetShouldDestroy = function($target){
  return $target.hasAttribute(settings.destroy);
}

const targetShouldFocusIn = function($target) {
  return $target.hasAttribute(settings.focusIn);
}

export { targetIsRequiredIf, targetShouldDisable, targetShouldDestroy, targetShouldFocusIn }