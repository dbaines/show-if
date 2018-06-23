import { settings } from './../settings';
import { beforeShow, afterShow } from './toggle-helpers';
import { targetIsRequiredIf, setRequired } from './../target-required';
import { targetShouldDisable, enableFieldsIn } from './../target-disables';
import { targetShouldFocusIn, focusInTarget } from './../target-focus';

// The function used for showing an element
const showFunction = function($target, instant=false) {
  if(settings.showFunction) {
    settings.showFunction($target, instant);
  } else {
    if(typeof(jQuery) !== "undefined") {
      const slideSpeed = instant ? 0 : settings.slideSepeed;
      jQuery($target).stop().slideDown(slideSpeed, () => {
        if($target.hasAttribute("data-showing")) {
          $target.removeAttribute("data-showing");
        }
      });
    } else {
      $target.style.display = "block";
    }
  }
}

// Tell an element to show
const show = function($target, instant=false){
  beforeShow($target);

  // Required-if variation
  if(targetIsRequiredIf($target)) {
    setRequired($target, true);

  // Show-if variation
  } else {
    if(instant) {
      $target.style.display = "block";
    } else {
      if(!$target.hasAttribute("data-showing")) {
        $target.setAttribute("data-showing", "true");
        $target.removeAttribute("data-hiding");
        showFunction($target, instant);
      }
    }
  }

  // Focus
  if(targetShouldFocusIn($target)) {
    focusInTarget($target);
  }

  // Re-enable
  if(targetShouldDisable($target)) {
    enableFieldsIn($target);
  }

  afterShow($target);
}

export default show;
export { show, showFunction }