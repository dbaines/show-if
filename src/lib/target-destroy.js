import { settings} from './settings';
import { isInputCheckable } from './input-helpers';

// Find an element and destroy all data in any form fields inside
// said element
const destroyDataIn = function($element) {
  if($element.hasAttribute(settings.destroy)) {
    const $inputs = $element.querySelectorAll(settings.inputTypes);
    for(const $input of $inputs) {
      if(isInputCheckable($input)) {
        $input.checked = false;
      } else {
        $input.value = "";
      }
    }
  }
}

export { destroyDataIn };