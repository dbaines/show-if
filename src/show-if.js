/*!
 * ShowIf is used to show/hide elements based 
 * on form selections using simple HTML data-attribute
 * helpers
 * 
 * @license MIT
 * @author David Baines <david@katalyst.com.au>
*/

/*global jQuery */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else {
    root.showIf = factory(root);
  }
}(this, function () {

  let showIf = {
    version: "0.1.0",
  }

  // =========================================================================
  // Helpers
  // =========================================================================

  const _getAttribute = function($element, attribute) {
    return $element.hasAttribute(attribute) && $element.getAttribute(attribute);
  }

  // =========================================================================
  // Default Settings
  // these settings can be overwritten on the page by creating a 
  // window.showIfSettings object, eg:
  // window.showIfSettings = { 
  //  showIf: "data-show-something-else" 
  // }
  // =========================================================================

  const defaults = {

    // Core show attribute
    showIf: "data-show-if",

    // Set required state conditinoally without showing/hiding the field
    requiredIf: "data-required-if",

    // The elements to toggle requiredness on and disable
    inputTypes: "input, select, textarea",

    // Text-based input listener for input[type=text] or textarea etc.
    showIfInput: "data-show-input",

    // Select elements need to know which options are the ones that show
    // the element
    showIfSelectOption: "data-show-option",

    // Input text to match
    showIfInputValue: "data-show-input",

    // Type of match (any, *)
    showType: "data-show-type",

    // Inverse logic
    inverse: "data-show-inverse",

    // Disable hidden form fields when hiding
    disable: "data-show-disable",

    // Destroy data in form fields when hiding
    destroy: "data-show-destroy",

    // Attribute to hold required state when hiding elements
    // so that we can track which elements WERE required so we
    // can then restore that required state when showing again
    requiredStorage: "data-show-required",

    // The value used to seperate out logical operations
    controlSeperator: "_&_",

    // .slideUp(), .slideDown() value
    slideSpeed: "fast",

    // Expose helper functions to the window object
    helpers: true,

  }

  // Build out settings from the defaults and then
  // overwrite values from the window object if
  // present
  showIf._buildSettings = function(){
    showIf.settings = { ...defaults };
    if(window.showIfSettings) {
      showIf.settings = {
        ...defaults,
        ...window.showIfSettings,
      }
    }
    return showIf.settings;
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
  // Internal functions
  // =========================================================================

  // Get the show value for this element
  // can either be set in data-show-if or data-required-if
  showIf._getShowRuleForElement = function($element) {
    const ruleTypes = [
      "showIf",
      "requiredIf",
    ];
    let rule = "";
    ruleTypes.filter(type => {
      const attribute = showIf.settings[type];
      const value = _getAttribute($element, attribute);
      if(value) {
        rule = value;
        return;
      }
    });
    return rule;
  }

  // Quick check to see if an element is an input type
  showIf._isInput = function($element) {
    return $element.nodeName.toLowerCase().indexOf(showIf.settings.inputTypes) > -1;
  }

  // Determine if a field should use .checked or .value
  // ie. is this field a checkbox or a radio?
  showIf._isInputCheckable = function($input) {
    const type = _getAttribute($input, "type");
    if(type) {
      return type === "checkbox" || type === "radio";
    } else {
      return false;
    }
  }

  // Find an element and make all input fields within disabled
  showIf._disableFieldsIn = function($element) {
    if($element.hasAttribute(showIf.settings.disable)) {
      $element.querySelectorAll(showIf.settings.inputTypes).map($input => {
        $input.disabled = true;
      })
    }
  }

  // Find an element and make all input fields within enabled
  showIf._enableFieldsIn = function($element) {
    if($element.hasAttribute(showIf.settings.disable)) {
      $element.querySelectorAll(showIf.settings.inputTypes).map($input => {
        $input.disabled = false;
      })
    }
  }

  // Find an element and destroy all data in any form fields inside
  // said element
  showIf._destroyDataIn = function($element) {
    if($element.hasAttribute(showIf.settings.destroy)) {
      $element.querySelectorAll(showIf.settings.inputTypes).map($input => {
        if(showIf._isInputCheckable($input)) {
          $input.checked = false;
        } else {
          $input.value = "";
        }
      });
    }
  }

  showIf._getControlId = function(id) {
    if(showIf.settings.getControlId) {
      return showIf.settings.getControlId(id);
    } else {
      return document.getElementById(id);
    }
  }

  // Get the controls for a show rule, eg:
  // [data-show-if='foobar'] => #foobar
  showIf._getTargetControlsFor = function($target) {
    let $controls = [];
    const showRules = showIf._getShowRuleForElement($target);
    // Create an array of required targets
    // split by the control seperator
    if(showRules) {
      let controlLabels = [showRules];
      if(showRules.indexOf(showIf.settings.controlSeperator) > -1) {
        controlLabels = showRules.split(showIf.settings.controlSeperator);
      }
      controlLabels.map(label => {
        $controls.push(showIf._getControlId(label));
      });
    } else {
      console.warn("[SHOWJS] No controls found for element - does it contain a show target attribute such as `data-show-if`?");
    }
    return $controls;
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
      $siblingTargets = document.querySelectorAll("[name='" + inputName + "]");
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
      $siblingTargets.map($ibling => {
        $sibling.addEventListener("change", changeFunction);
      });
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

  // Check a value against an array of values or a single value
  // eg:
  // "test", ["foo", bar"] = false
  // "test", "foobar" = false
  // "test", ["foo", "bar", "test"] = true
  // "test", "test" = true
  showIf._checkValue = function(currentValue, requiredValue) {
    if(requiredValue.indexOf(showIf.settings.controlSeperator) > -1) {
      requiredValue = requiredValue.split(showIf.settings.controlSeperator);
      return requiredValue.indexOf(currentValue) > -1;
    } else {
      return currentValue === requiredValue;
    }
  }

  showIf._decernMultipleFields = function($target, $inputs, value=true) {
    const numberOfTargets = $inputs.length;
    let shouldShow = false;
    let numberOfTargetsHit = 0;

    // Check if there are multiple values passed in eg:
    // value1_&_value2
    const multipleValues = (value + "").indexOf(showIf.settings.controlSeperator) > -1;
    if(multipleValues) {
      value = value.split(showIf.settings.controlSeperator);
    }

    // Loop through all controls
    $inputs.map(($input, index) => {
      let valueToCheck = value;
      const useProp = showIf._isInputCheckable($input);
      if(multipleValues) {
        valueToCheck = value[index] || true;
      }
      if(useProp) {
        if($input.checked === valueToCheck) {
          numberOfTargetsHit++;
        } else if($input.val() === valueToCheck) {
          numberOfTargetsHit++;
        }
      }
    });

    // Match any or all?
    if(_getAttribute($element, showIf.settings.showType) === "any") {
      // If match any, check that there's at least one hit
      shouldShow = numberOfTargetsHit > 0;
    } else {
      // If match all, check if the number of targets hit matches the
      // number of targets
      shouldShow = numberOfTargetsHit === numberOfTargets;
    }

    return shouldShow;
  }

  showIf.decernSelect = function($target, $select, instant=false, callback=false) {
    let selectOption = _getAttribute($target, showIf.settings.showIfSelectOption);
    if(selectOption) {
      const shouldShow = showIf._checkValue($select.value, selectOption);
      showIf.toggle($target, shouldShow, instant);
      if(callback) {
        callback($target, shouldShow, instant);
      } else {
        return shouldShow;
      }
    } else {
      console.warn("[SHOWJS] Attempting to determine select logic with no `data-show-option` attribute present.");
    }
  }

  showIf.decernMultipleSelect = function($target, $inputs, instant=false, callback) {
    let selectOption = _getAttribute($target, showIf.settings.showIfSelectOption);
    if(selectOption) {
      const shouldShow = showIf._decernMultipleFields(target, $inputs, selectOption);
      if(callback) {
        callback($target, shouldShow, instant);
      } else {
        return shouldShow;
      }
    } else {
      console.warn("[SHOWJS] Attempting to determine select logic with no `data-show-option` attribute present.");
    }
  }

  showIf.decernRadio = function($target, $input, instant=false, callback=false) {
    const shouldShow = $input.checked === true;
    if(callback) {
      callback($target, shouldShow, instant);
    } else {
      return shouldShow;
    }
  }

  showIf.decernMultipleRadio = function($target, $inputs, instant=false, callback=false) {
    const shouldShow = showIf._decernMultipleFields(target, $inputs, selectOption);
    if(callback) {
      callback($target, shouldShow, instant);
    } else {
      return shouldShow;
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

  showIf.setRequired = function($target, required=false) {
    $target.required = required;
  }

  showIf.show = function($target, instant=false){
    showIf._beforeShow($target);

    // Required-if variation
    if(_getAttribute($target, showIf.settings.requiredIf)) {
      if(showIf._isInput($target)) {
        showIf.setRequired($target, true);
      } else {
        const $inputs = $target.querySelectorAll(showIf.settings.inputTypes);
        for($input of $inputs) {
          showIf.setRequired($target, true);
        }
      }

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
    showIf._afterShow($target);
  }

  showIf.hide = function($target, instant=false) {
    showIf._beforeHide($target);

    // Required-if variation
    if(_getAttribute($target, showIf.settings.requiredIf)) {
      if(showIf._isInput($target)) {
        showIf.setRequired($target, false);
      } else {
        const $inputs = $target.querySelectorAll(showIf.settings.inputTypes);
        for($input of $inputs) {
          showIf.setRequired($target, false);
        }
      }

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
    showIf._afterHide($target);
  }

  showIf.showFunction = function($target, instant=false) {
    if(showIf.settings.showFunction) {
      showIf.settings.showFunction();
    } else {
      if(typeof(jQuery) !== "undefined") {
        jQuery($target).stop().slideDown(showIf.settings.slideSepeed, () => {
          if($target.hasAttribute("data-showing")) {
            $target.removeAttribute("data-showing");
          }
        });
      } else {
        $target.style.display = "block";
      }
    }
  }

  showIf.hideFunction = function($target, instant=false) {
    if(showIf.settings.hideFunction) {
      showIf.settings.hideFunction();
    } else {
      if(typeof(jQuery) !== "undefined") {
        jQuery($target).stop().slideUp(showIf.settings.slideSepeed, () => {
          if($target.hasAttribute("data-hiding")) {
            $target.removeAttribute("data-hiding");
          }
        });
      } else {
        $target.style.display = "none";
      }
    }
  }

  showIf.toggle = function($target, shouldShow=false, instant=false) {
    if(_getAttribute($target, showIf.settings.inverse)) {
      shouldShow = !shouldShow;
    }
    if(shouldShow) {
      showIf.show($target, instant);
    } else {
      showIf.hide($target, instant);
    }
  }

  showIf.toggleAllElements = function(){
    for(const $target of showIf.$targets) {
      const $allControls = showIf._getTargetControlsFor($target);
      for(const $thisControl of $allControls) {
        const type = _getAttribute($thisControl, "type");
        const isTextInput = _getAttribute($target, showIf.settings.showIfInput);
        const isCheckboxOrRadio = type === "radio" || type === "checkbox";
        const isSelect = _getAttribute($target, showIf.settings.showIfSelectOption);

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
    // Build settings from defaults and user-defined 
    // settings on the window object
    showIf._buildSettings();
    // Expose helpers to the window object
    showIf._exposeHelpers();
    showIf.$targets = document.querySelectorAll(
      "[" + showIf.settings.showIf + "]," +
      "[" + showIf.settings.requiredIf + "]"
    );
    showIf.toggleAllElements();
  }

  // Initialise if running in the browser
  if(this === window) {
    showIf.init();
  }

  return showIf;
}));