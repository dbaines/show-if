import { discernRadio, discernMultipleRadio } from './../discerns/discern-radio';
import getAttribute from './../get-attribute';
import toggle from './../ui/toggle';

const bindCheckbox = function($input, $allControls, $target) {
  // Get the name of the input element and check if there
  // are other inputs with the same name (eg. collections, radio, 
  // checkboxes)
  const inputName = getAttribute($input, "name");
  let $siblingTargets = [];
  if(inputName) {
    $siblingTargets = document.querySelectorAll("[name='" + inputName + "']");
  }

  const changeFunction = function(event, instant=false) {
    // Check if there are multiple controls determining the
    // visibility of the element
    if($allControls.length > 1) {
      discernMultipleRadio($target, $allControls, instant, toggle);
    } else {
      discernRadio($target, $input, instant, toggle);
    }
  }

  // Check on change events
  if($siblingTargets.length) {
    for(const $sibling of $siblingTargets) {
      $sibling.addEventListener("change", changeFunction);
    }
  } else {
    $input.addEventListener("change", changeFunction);
  }

  // Check on page load
  changeFunction(false, true);
}

export default bindCheckbox;