import { settings } from './../settings';
import getAttribute from './../get-attribute';
import { getTargetControlsFor } from './../get-target-rules';
import bindCheckbox from './bind-checkbox';
import bindInput from './bind-input';
import bindSelect from './bind-select';

const $targets = document.querySelectorAll(
  "[" + settings.showIf + "]," +
  "[" + settings.requiredIf + "]"
);

// Get all the elements that need to show or hide in showIf.$listeners
// Then get the controls that determine their visibility
// Then set the visibility based on those controls' state
const bindListeners = function(){
  for(const $target of $targets) {
    // Get the input controls for this target
    const $allControls = getTargetControlsFor($target);
    for(const $thisControl of $allControls) {
      // Determine which sort of input control this is
      const type = getAttribute($thisControl, "type");
      const isTextInput = getAttribute($target, settings.showIfInput);
      const isCheckboxOrRadio = type === "radio" || type === "checkbox";
      const isSelect = getAttribute($target, settings.showIfSelectOption);

      // Bind the appopriate listeners to this controls
      if(isCheckboxOrRadio) {
        bindCheckbox($thisControl, $allControls, $target);
      } else if(isTextInput) {
        bindInput($thisControl, $allControls, $target);
      } else if(isSelect) {
        bindSelect($thisControl, $allControls, $target);
      }
    }
  }
}

export { $targets, bindListeners };
export default bindListeners;