import { settings } from './settings';

const targetIsRequiredIf = function($target) {
  return $target.hasAttribute(settings.requiredIf);
}

export { targetIsRequiredIf }