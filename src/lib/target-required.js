import { settings } from './settings';
import { isInput } from './input-helpers';
import getAttribute from './get-attribute';

const targetIsRequiredIf = function($target) {
  return $target.hasAttribute(settings.requiredIf);
}

// Set the requiredness of input fields inside the target element
const setRequired = function($target, required=false) {
  if(isInput($target)) {
    $target.required = required;
  } else {
    const $inputs = $target.querySelectorAll(settings.inputTypes);
    const $markers = $target.querySelectorAll(settings.requiredMarker);
    for(const $input of $inputs) {
      $input.required = required;
    }
    for(const $marker of $markers) {
      // If hiding, store the current display type in a data attribute
      if(!required) {
        $marker.setAttribute(settings.requiredMarkerDisplayStorage, $marker.style.display);
      }
      // Set marker display style to none if not required
      // otherwise get the display type from storage
      const displayType = required ? getAttribute($marker, settings.requiredMarkerDisplayStorage) || "inline" : "none";
      $marker.style.display = displayType;
    }
  }
}

export { targetIsRequiredIf, setRequired }