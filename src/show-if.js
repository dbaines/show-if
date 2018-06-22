import { version } from '../package.json';
import { settings } from './lib/settings';
import _getAttribute from './lib/get-attribute';
import { targetIsRequiredIf } from './lib/target-required';
import { isInput, isInputCheckable } from './lib/input-helpers';
import { targetShouldFocusIn, focusInTarget } from './lib/target-focus';
import { targetShouldDisable, disableFieldsIn, enableFieldsIn } from './lib/target-disables';
import { targetShouldDestroy, destroyDataIn } from './lib/target-destroy';
import { getShowRuleForTarget, getControlId, getTargetControlsFor } from './lib/get-target-rules';
import checkValue from './lib/discerns/discern-value';

import discernMultipleFields from './lib/discerns/discern-multiple-fields';
import discernSelect from './lib/discerns/discern-select';
import { discernRadio, discernMultipleRadio } from './lib/discerns/discern-radio';

/*!
 * ShowIf is used to show/hide elements based 
 * on form selections using simple HTML data-attribute
 * helpers
 * 
 * @license MIT
 * @author David Baines <david@katalyst.com.au>
*/

/*global jQuery */
(function() {
  "use strict";

  let showIf = {
    version: version,
    settings: settings,
    _targetIsRequiredIf: targetIsRequiredIf,
    _targetShouldDisable: targetShouldDisable,
    _targetShouldDestroy: targetShouldDestroy,
    _targetShouldFocusIn: targetShouldFocusIn,
    _isInput: isInput,
    _isInputCheckable: isInputCheckable,
    _disableFieldsIn: disableFieldsIn,
    _enableFieldsIn: enableFieldsIn,
    _destroyDataIn: destroyDataIn,
    _focusInTarget: focusInTarget,
    _getTargetControlsFor: getTargetControlsFor,
    _getShowRuleForElement: getShowRuleForTarget,
    _getControlId: getControlId,
    _checkValue: checkValue,

    _decernMultipleFields: discernMultipleFields,
    decernSelect: discernSelect,
    decernRadio: discernRadio,
    decernMultipleRadio: discernMultipleRadio,
  }

  // =========================================================================
  // Expose helpers to the window for more advanced usage
  // This can be triggered simply by creating a window object:
  // window.showIf = {
  //   helpers: true
  // }
  // =========================================================================

  showIf._exposeHelpers = function() {
    if(showIf.settings.helpers) {
      window.showIf = showIf;
    }
  }

  // =========================================================================
  // Convenience functions
  // =========================================================================

  showIf._beforeShow = function($element){
    if(showIf.settings.beforeShow) {
      showIf.settings.beforeShow($element);
    } else {
      //
    }
  }

  showIf._afterShow = function($element){
    if(showIf.settings.afterShow) {
      showIf.settings.afterShow($element);
    } else {
      //
    }
  }

  showIf._beforeHide = function($element){
    if(showIf.settings.beforeHide) {
      showIf.settings.beforeHide($element);
    } else {
      //
    }
  }

  showIf._afterHide = function($element){
    if(showIf.settings.afterHide) {
      showIf.settings.afterHide($element);
    } else {
      //
    }
  }

  // =========================================================================
  // Bind event listeners to inputs and show/hide on page load
  // =========================================================================

  showIf._bindCheckbox = function($input, $allControls, $target) {
    // Get the name of the input element and check if there
    // are other inputs with the same name (eg. collections, radio, 
    // checkboxes)
    const inputName = _getAttribute($input, "name");
    let $siblingTargets = [];
    if(inputName) {
      $siblingTargets = document.querySelectorAll("[name='" + inputName + "']");
    }

    const changeFunction = function(event, instant=false) {
      // Check if there are multiple controls determining the
      // visibility of the element
      if($allControls.length > 1) {
        showIf.decernMultipleRadio($target, $allControls, instant, showIf.toggle);
      } else {
        showIf.decernRadio($target, $input, instant, showIf.toggle);
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

  showIf._bindInput = function($input, $allControls, $target){
    const changeFunction = function(event, instant=false) {
      showIf.decernInput($target, $input, instant, showIf.toggle);
    }
    // Check on keyup
    $input.removeEventListener("keyup", changeFunction);
    $input.addEventListener("keyup", changeFunction);

    // Check on page load
    changeFunction(false, true);
  }

  showIf._bindSelect = function($select, $allControls, $target) {
    const changeFunction = function(event, instant=false) {
      if($allControls.length > 1) {
        showIf.decernMultipleSelect($target, $allControls, instant, showIf.toggle);
      } else {
        showIf.decernSelect($target, $select, instant, showIf.toggle);
      }
    }
    
    // Check on change
    $select.addEventListener("change", changeFunction);

    // Check on page load
    changeFunction(false, true);
  }

  // =========================================================================
  // Checking and matching
  // =========================================================================

  showIf.decernMultipleSelect = function($target, $inputs, instant=false, callback) {
    let selectOption = _getAttribute($target, showIf.settings.showIfSelectOption);
    if(selectOption) {
      const shouldShow = showIf._decernMultipleFields($target, $inputs, selectOption);
      if(callback) {
        callback($target, shouldShow, instant);
      } else {
        return shouldShow;
      }
    } else {
      console.warn("[SHOWJS] Attempting to determine select logic with no `data-show-option` attribute present.");
    }
  }

  showIf.decernInput = function($target, $input, instant=false, callback=false) {
    let shouldShow = false;
    const valueToMatch = _getAttribute($target, showIf.settings.showIfInputValue).toLowerCase();
    const valueLower = $input.value.toLowerCase();
    const showType = _getAttribute($target, showIf.settings.showType);

    // value to match is required if type isn't set to *
    if(showType !== "*" && !valueToMatch) {
      console.warn("[SHOWJS] Missing value to match on input field");
    }

    // Return true if there is anything in the input field
    if(showType === "*") {
      shouldShow = valueLower.length > 0;
    } else if(showType === "any") {
      shouldShow = valueLower.indexOf(valueToMatch) > -1;
    } else {
      shouldShow = showIf._checkValue(valueLower, valueToMatch);
    }
    if(callback) {
      callback($target, shouldShow, instant);
    } else {
      return shouldShow;
    }
  }

  // =========================================================================
  // Show / Hide functions
  // =========================================================================

  // Set the requiredness of input fields inside the target element
  showIf.setRequired = function($target, required=false) {
    if(showIf._isInput($target)) {
      $target.required = required;
    } else {
      const $inputs = $target.querySelectorAll(showIf.settings.inputTypes);
      const $markers = $target.querySelectorAll(showIf.settings.requiredMarker);
      for(const $input of $inputs) {
        $input.required = required;
      }
      for(const $marker of $markers) {
        // If hiding, store the current display type in a data attribute
        if(!required) {
          $marker.setAttribute(showIf.settings.requiredMarkerDisplayStorage, $marker.style.display);
        }
        // Set marker display style to none if not required
        // otherwise get the display type from storage
        const displayType = required ? _getAttribute($marker, showIf.settings.requiredMarkerDisplayStorage) || "inline" : "none";
        $marker.style.display = displayType;
      }
    }
  }

  // Tell an element to show
  showIf.show = function($target, instant=false){
    showIf._beforeShow($target);

    // Required-if variation
    if(showIf._targetIsRequiredIf($target)) {
      showIf.setRequired($target, true);

    // Show-if variation
    } else {
      if(instant) {
        $target.style.display = "block";
      } else {
        if(!$target.hasAttribute("data-showing")) {
          $target.setAttribute("data-showing", "true");
          $target.removeAttribute("data-hiding");
          showIf.showFunction($target, instant);
        }
      }
    }

    // Focus
    if(showIf._targetShouldFocusIn($target)) {
      showIf._focusInTarget($target);
    }

    // Re-enable
    if(showIf._targetShouldDisable($target)) {
      showIf._enableFieldsIn($target);
    }

    showIf._afterShow($target);
  }

  // Tell an element to hide
  showIf.hide = function($target, instant=false) {
    showIf._beforeHide($target, instant);

    // Required-if variation
    if(showIf._targetIsRequiredIf($target)) {
      showIf.setRequired($target, false);

    // Show-if variation
    } else {
      if(instant) {
        $target.style.display = "none";
      } else {
        if(!$target.hasAttribute("data-hiding")) {
          $target.setAttribute("data-hiding", "true");
          $target.removeAttribute("data-showing");
          showIf.hideFunction($target, instant);
        }
      }
    }

    // Disable
    if(showIf._targetShouldDisable($target)) {
      showIf._disableFieldsIn($target);
    }

    // Destroy
    if(showIf._targetShouldDestroy($target)) {
      showIf._destroyDataIn($target);
    }

    showIf._afterHide($target, instant);
  }

  // The function used for showing an element
  showIf.showFunction = function($target, instant=false) {
    if(showIf.settings.showFunction) {
      showIf.settings.showFunction($target, instant);
    } else {
      if(typeof(jQuery) !== "undefined") {
        const slideSpeed = instant ? 0 : showIf.settings.slideSepeed;
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

  // The function used for hiding an element
  showIf.hideFunction = function($target, instant=false) {
    if(showIf.settings.hideFunction) {
      showIf.settings.hideFunction($target, instant);
    } else {
      if(typeof(jQuery) !== "undefined") {
        const slideSpeed = instant ? 0 : showIf.settings.slideSepeed;
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

  // Toggle an element
  // const element = document.querySelector("[data-test-element]");
  // showIf.toggle(element, true);   // show
  // showIf.toggle(element, false);  // hide
  showIf.toggle = function($target, shouldShow=false, instant=false) {
    if($target.hasAttribute(showIf.settings.inverse)) {
      shouldShow = !shouldShow;
    }
    if(shouldShow) {
      showIf.show($target, instant);
    } else {
      showIf.hide($target, instant);
    }
  }

  // Get all the elements that need to show or hide in showIf.$listeners
  // Then get the controls that determine their visibility
  // Then set the visibility based on those controls' state
  showIf.bindListeners = function(){
    for(const $target of showIf.$targets) {
      // Get the input controls for this target
      const $allControls = showIf._getTargetControlsFor($target);
      for(const $thisControl of $allControls) {
        // Determine which sort of input control this is
        const type = _getAttribute($thisControl, "type");
        const isTextInput = _getAttribute($target, showIf.settings.showIfInput);
        const isCheckboxOrRadio = type === "radio" || type === "checkbox";
        const isSelect = _getAttribute($target, showIf.settings.showIfSelectOption);

        // Bind the appopriate listeners to this controls
        if(isCheckboxOrRadio) {
          showIf._bindCheckbox($thisControl, $allControls, $target);
        } else if(isTextInput) {
          showIf._bindInput($thisControl, $allControls, $target);
        } else if(isSelect) {
          showIf._bindSelect($thisControl, $allControls, $target);
        }
      }
    }
  }

  // =========================================================================
  // Initialise
  // =========================================================================

  showIf.init = function(){
    // Expose helpers to the window object
    showIf._exposeHelpers();
    showIf.$targets = document.querySelectorAll(
      "[" + showIf.settings.showIf + "]," +
      "[" + showIf.settings.requiredIf + "]"
    );
    showIf.bindListeners();
  }

  // Initialise if running in the browser
  if(typeof(window) !== "undefined") {
    showIf.init();
  }

  return showIf;

}());