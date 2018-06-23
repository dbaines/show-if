import { settings } from './../settings';
import { beforeHide, afterHide } from './toggle-helpers';
import { targetIsRequiredIf, setRequired } from './../target-required';
import { targetShouldDisable, disableFieldsIn } from './../target-disables';
import { targetShouldDestroy, destroyDataIn } from './../target-destroy';

// The function used for hiding an element
const hideFunction = function($target, instant=false) {
  if(settings.hideFunction) {
    settings.hideFunction($target, instant);
  } else {
    if(typeof(jQuery) !== "undefined") {
      const slideSpeed = instant ? 0 : settings.slideSepeed;
      jQuery($target).stop().slideUp(slideSpeed, () => {
        if($target.hasAttribute("data-hiding")) {
          $target.removeAttribute("data-hiding");
        }
      });
    } else {
      $target.style.display = "none";
    }
  }
}

// Tell an element to hide
const hide = function($target, instant=false) {
  beforeHide($target, instant);

  // Required-if variation
  if(targetIsRequiredIf($target)) {
    setRequired($target, false);

  // Show-if variation
  } else {
    if(instant) {
      $target.style.display = "none";
    } else {
      if(!$target.hasAttribute("data-hiding")) {
        $target.setAttribute("data-hiding", "true");
        $target.removeAttribute("data-showing");
        hideFunction($target, instant);
      }
    }
  }

  // Disable
  if(targetShouldDisable($target)) {
    disableFieldsIn($target);
  }

  // Destroy
  if(targetShouldDestroy($target)) {
    destroyDataIn($target);
  }

  afterHide($target, instant);
}

export { hide, hideFunction };
export default hide;