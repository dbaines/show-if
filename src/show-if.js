import { version } from '../package.json';
import { settings } from './lib/settings';
import _getAttribute from './lib/get-attribute';
import { isInput, isInputCheckable } from './lib/input-helpers';
import { targetIsRequiredIf, setRequired } from './lib/target-required';
import { targetShouldFocusIn, focusInTarget } from './lib/target-focus';
import { targetShouldDisable, disableFieldsIn, enableFieldsIn } from './lib/target-disables';
import { targetShouldDestroy, destroyDataIn } from './lib/target-destroy';
import { getShowRuleForTarget, getControlId, getTargetControlsFor } from './lib/get-target-rules';
import checkValue from './lib/discerns/discern-value';

import discernMultipleFields from './lib/discerns/discern-multiple-fields';
import { discernSelect, discernMultipleSelect } from './lib/discerns/discern-select';
import { discernRadio, discernMultipleRadio } from './lib/discerns/discern-radio';
import { discernInput } from './lib/discerns/discern-input';

import toggle from './lib/ui/toggle';

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
    setRequired: setRequired,

    _decernMultipleFields: discernMultipleFields,
    decernSelect: discernSelect,
    decernRadio: discernRadio,
    decernMultipleRadio: discernMultipleRadio,
    decernMultipleSelect: discernMultipleSelect,
    decernInput: discernInput,

    toggle: toggle,
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

    // Expose helpers to the window for more advanced usage
    // This can be triggered simply by creating a window object:
    // window.showIf = {
    //   helpers: true
    // }
    if(showIf.settings.helpers) {
      window.showIf = showIf;
    }

    // Build list of target elements
    showIf.$targets = document.querySelectorAll(
      "[" + showIf.settings.showIf + "]," +
      "[" + showIf.settings.requiredIf + "]"
    );

    // Bind listeners to the target controls
    showIf.bindListeners();
  }

  // Initialise if running in the browser
  if(typeof(window) !== "undefined") {
    showIf.init();
  }

  return showIf;

}());