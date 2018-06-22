(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (factory());
}(this, (function () { 'use strict';

  var version = "0.1.0";

  var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  // =========================================================================
  // Default Settings
  // these settings can be overwritten on the page by creating a 
  // window.showIfSettings object, eg:
  // window.showIfSettings = { 
  //  showIf: "data-show-something-else" 
  // }
  // =========================================================================

  var defaults$1 = {

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

    // Focus on inputs in the hidden element
    focusIn: "data-show-focus",

    // Disable hidden form fields when hiding
    disable: "data-show-disable",

    // Destroy data in form fields when hiding
    destroy: "data-show-destroy",

    // Attribute to hold required state when hiding elements
    // so that we can track which elements WERE required so we
    // can then restore that required state when showing again
    requiredStorage: "data-show-required",

    requiredMarker: "abbr[title='required']",
    requiredMarkerDisplayStorage: "data-required-if-display-type",

    // The value used to seperate out logical operations
    controlSeperator: "_&&_",

    // .slideUp(), .slideDown() value
    slideSpeed: 200,

    // Expose helper functions to the window object
    helpers: true

    // Build out settings from the defaults and then
    // overwrite values from the window object if
    // present
  };var buildSettings = function buildSettings() {
    var settings = _extends({}, defaults$1);
    if (window.showIfSettings) {
      settings = _extends({}, defaults$1, window.showIfSettings);
    }
    return settings;
  };

  var settings = buildSettings();

  // Simple helper to get an attribute if an element has the attribute
  // eg. element.getAttribute("blah") will crash if element does not have an
  // attribute of "blah"
  function getAttribute ($element, attribute) {
    return $element.hasAttribute(attribute) && $element.getAttribute(attribute);
  }

  var targetIsRequiredIf = function targetIsRequiredIf($target) {
    return $target.hasAttribute(settings.requiredIf);
  };

  // Quick check to see if an element is an input type
  var isInput = function isInput($element) {
    return settings.inputTypes.indexOf($element.nodeName.toLowerCase()) > -1;
  };

  // Determine if a field should use .checked or .value
  // ie. is this field a checkbox or a radio?
  var isInputCheckable = function isInputCheckable($input) {
    var type = getAttribute($input, "type");
    if (type) {
      return type === "checkbox" || type === "radio";
    } else {
      return false;
    }
  };

  var targetShouldFocusIn = function targetShouldFocusIn($target) {
    return $target.hasAttribute(settings.focusIn);
  };

  var focusInTarget = function focusInTarget($target) {
    var focusTarget = getAttribute($target, settings.focusIn) || settings.inputTypes;
    var $inputs = $target.querySelectorAll(focusTarget);
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = $inputs[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var $input = _step.value;

        if ($input.offsetWidth > 0 && $input.offsetHeight > 0) {
          $input.focus();
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  };

  var targetShouldDisable = function targetShouldDisable($target) {
    return $target.hasAttribute(settings.disable);
  };

  // Find an element and make all input fields within disabled
  var disableFieldsIn = function disableFieldsIn($element) {
    if ($element.hasAttribute(settings.disable)) {
      var $inputs = $element.querySelectorAll(settings.inputTypes);
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = $inputs[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var $input = _step.value;

          $input.disabled = true;
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  };

  // Find an element and make all input fields within enabled
  var enableFieldsIn = function enableFieldsIn($element) {
    if ($element.hasAttribute(settings.disable)) {
      var $inputs = $element.querySelectorAll(settings.inputTypes);
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = $inputs[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var $input = _step2.value;

          $input.disabled = false;
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }
  };

  var targetShouldDestroy = function targetShouldDestroy($target) {
    return $target.hasAttribute(settings.destroy);
  };

  // Find an element and destroy all data in any form fields inside
  // said element
  var destroyDataIn = function destroyDataIn($element) {
    if ($element.hasAttribute(settings.destroy)) {
      var $inputs = $element.querySelectorAll(settings.inputTypes);
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = $inputs[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var $input = _step.value;

          if (isInputCheckable($input)) {
            $input.checked = false;
          } else {
            $input.value = "";
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  };

  // Get the show value for this element
  // can either be set in data-show-if or data-required-if
  var getShowRuleForTarget = function getShowRuleForTarget($element) {
    var ruleTypes = ["showIf", "requiredIf"];
    var rule = "";
    ruleTypes.filter(function (type) {
      var attribute = settings[type];
      var value = getAttribute($element, attribute);
      if (value) {
        rule = value;
        return;
      }
    });
    return rule;
  };

  // Get the dom nodes for a target rule
  var getControlId = function getControlId(id) {
    if (settings.getControlId) {
      return settings.getControlId(id);
    } else {
      return document.getElementById(id);
    }
  };

  // Get the controls for a show rule, eg:
  // [data-show-if='foobar'] => #foobar
  // [data-show-if='foo_&_bar'] => #foo,#bar
  var getTargetControlsFor = function getTargetControlsFor($target) {
    var $controls = [];
    var showRules = getShowRuleForTarget($target);
    // Create an array of required targets
    // split by the control seperator
    if (showRules) {
      var controlLabels = [showRules];
      if (showRules.indexOf(settings.controlSeperator) > -1) {
        controlLabels = showRules.split(settings.controlSeperator);
      }
      controlLabels.map(function (label) {
        $controls.push(getControlId(label));
      });
    } else {
      console.warn("[SHOWJS] No controls found for element - does it contain a show target attribute such as `data-show-if`?");
    }
    return $controls;
  };

  /*!
   * ShowIf is used to show/hide elements based 
   * on form selections using simple HTML data-attribute
   * helpers
   * 
   * @license MIT
   * @author David Baines <david@katalyst.com.au>
  */

  /*global jQuery */
  (function () {

    var showIf = {
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
      _getControlId: getControlId

      // =========================================================================
      // Expose helpers to the window for more advanced usage
      // This can be triggered simply by creating a window object:
      // window.showIf = {
      //   helpers: true
      // }
      // =========================================================================

    };showIf._exposeHelpers = function () {
      if (showIf.settings.helpers) {
        window.showIf = showIf;
      }
    };

    // =========================================================================
    // Convenience functions
    // =========================================================================

    showIf._beforeShow = function ($element) {
      if (showIf.settings.beforeShow) {
        showIf.settings.beforeShow($element);
      }
    };

    showIf._afterShow = function ($element) {
      if (showIf.settings.afterShow) {
        showIf.settings.afterShow($element);
      }
    };

    showIf._beforeHide = function ($element) {
      if (showIf.settings.beforeHide) {
        showIf.settings.beforeHide($element);
      }
    };

    showIf._afterHide = function ($element) {
      if (showIf.settings.afterHide) {
        showIf.settings.afterHide($element);
      }
    };

    // =========================================================================
    // Bind event listeners to inputs and show/hide on page load
    // =========================================================================

    showIf._bindCheckbox = function ($input, $allControls, $target) {
      // Get the name of the input element and check if there
      // are other inputs with the same name (eg. collections, radio, 
      // checkboxes)
      var inputName = getAttribute($input, "name");
      var $siblingTargets = [];
      if (inputName) {
        $siblingTargets = document.querySelectorAll("[name='" + inputName + "']");
      }

      var changeFunction = function changeFunction(event) {
        var instant = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        // Check if there are multiple controls determining the
        // visibility of the element
        if ($allControls.length > 1) {
          showIf.decernMultipleRadio($target, $allControls, instant, showIf.toggle);
        } else {
          showIf.decernRadio($target, $input, instant, showIf.toggle);
        }
      };

      // Check on change events
      if ($siblingTargets.length) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = $siblingTargets[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var $sibling = _step.value;

            $sibling.addEventListener("change", changeFunction);
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      } else {
        $input.addEventListener("change", changeFunction);
      }

      // Check on page load
      changeFunction(false, true);
    };

    showIf._bindInput = function ($input, $allControls, $target) {
      var changeFunction = function changeFunction(event) {
        var instant = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        showIf.decernInput($target, $input, instant, showIf.toggle);
      };
      // Check on keyup
      $input.removeEventListener("keyup", changeFunction);
      $input.addEventListener("keyup", changeFunction);

      // Check on page load
      changeFunction(false, true);
    };

    showIf._bindSelect = function ($select, $allControls, $target) {
      var changeFunction = function changeFunction(event) {
        var instant = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        if ($allControls.length > 1) {
          showIf.decernMultipleSelect($target, $allControls, instant, showIf.toggle);
        } else {
          showIf.decernSelect($target, $select, instant, showIf.toggle);
        }
      };

      // Check on change
      $select.addEventListener("change", changeFunction);

      // Check on page load
      changeFunction(false, true);
    };

    // =========================================================================
    // Checking and matching
    // =========================================================================

    // Check a value against an array of values or a single value
    // eg:
    // "test", ["foo", bar"] = false
    // "test", "foobar" = false
    // "test", ["foo", "bar", "test"] = true
    // "test", "test" = true
    showIf._checkValue = function (currentValue, requiredValue) {
      if (requiredValue.indexOf(showIf.settings.controlSeperator) > -1) {
        requiredValue = requiredValue.split(showIf.settings.controlSeperator);
        return requiredValue.indexOf(currentValue) > -1;
      } else {
        return currentValue === requiredValue;
      }
    };

    showIf._decernMultipleFields = function ($target, $inputs) {
      var value = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      var numberOfTargets = $inputs.length;
      var shouldShow = false;
      var numberOfTargetsHit = 0;

      // Check if there are multiple values passed in eg:
      // value1_&_value2
      var multipleValues = (value + "").indexOf(showIf.settings.controlSeperator) > -1;
      if (multipleValues) {
        value = value.split(showIf.settings.controlSeperator);
      }

      // Loop through all controls
      $inputs.map(function ($input, index) {
        var valueToCheck = value;
        var useProp = showIf._isInputCheckable($input);
        if (multipleValues) {
          valueToCheck = value[index] || true;
        }
        if (useProp) {
          if ($input.checked === valueToCheck) {
            numberOfTargetsHit++;
          } else if ($input.value === valueToCheck) {
            numberOfTargetsHit++;
          }
        }
      });

      // Match any or all?
      if (getAttribute($target, showIf.settings.showType) === "any") {
        // If match any, check that there's at least one hit
        shouldShow = numberOfTargetsHit > 0;
      } else {
        // If match all, check if the number of targets hit matches the
        // number of targets
        shouldShow = numberOfTargetsHit === numberOfTargets;
      }

      return shouldShow;
    };

    showIf.decernSelect = function ($target, $select) {
      var instant = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

      var selectOption = getAttribute($target, showIf.settings.showIfSelectOption);
      if (selectOption) {
        var shouldShow = showIf._checkValue($select.value, selectOption);
        showIf.toggle($target, shouldShow, instant);
        if (callback) {
          callback($target, shouldShow, instant);
        } else {
          return shouldShow;
        }
      } else {
        console.warn("[SHOWJS] Attempting to determine select logic with no `data-show-option` attribute present.");
      }
    };

    showIf.decernMultipleSelect = function ($target, $inputs) {
      var instant = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var callback = arguments[3];

      var selectOption = getAttribute($target, showIf.settings.showIfSelectOption);
      if (selectOption) {
        var shouldShow = showIf._decernMultipleFields($target, $inputs, selectOption);
        if (callback) {
          callback($target, shouldShow, instant);
        } else {
          return shouldShow;
        }
      } else {
        console.warn("[SHOWJS] Attempting to determine select logic with no `data-show-option` attribute present.");
      }
    };

    showIf.decernRadio = function ($target, $input) {
      var instant = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

      var shouldShow = $input.checked === true;
      if (callback) {
        callback($target, shouldShow, instant);
      } else {
        return shouldShow;
      }
    };

    showIf.decernMultipleRadio = function ($target, $inputs) {
      var instant = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

      var shouldShow = showIf._decernMultipleFields($target, $inputs);
      if (callback) {
        callback($target, shouldShow, instant);
      } else {
        return shouldShow;
      }
    };

    showIf.decernInput = function ($target, $input) {
      var instant = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

      var shouldShow = false;
      var valueToMatch = getAttribute($target, showIf.settings.showIfInputValue).toLowerCase();
      var valueLower = $input.value.toLowerCase();
      var showType = getAttribute($target, showIf.settings.showType);

      // value to match is required if type isn't set to *
      if (showType !== "*" && !valueToMatch) {
        console.warn("[SHOWJS] Missing value to match on input field");
      }

      // Return true if there is anything in the input field
      if (showType === "*") {
        shouldShow = valueLower.length > 0;
      } else if (showType === "any") {
        shouldShow = valueLower.indexOf(valueToMatch) > -1;
      } else {
        shouldShow = showIf._checkValue(valueLower, valueToMatch);
      }
      if (callback) {
        callback($target, shouldShow, instant);
      } else {
        return shouldShow;
      }
    };

    // =========================================================================
    // Show / Hide functions
    // =========================================================================

    // Set the requiredness of input fields inside the target element
    showIf.setRequired = function ($target) {
      var required = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      if (showIf._isInput($target)) {
        $target.required = required;
      } else {
        var $inputs = $target.querySelectorAll(showIf.settings.inputTypes);
        var $markers = $target.querySelectorAll(showIf.settings.requiredMarker);
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = $inputs[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var $input = _step2.value;

            $input.required = required;
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }

        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = $markers[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var $marker = _step3.value;

            // If hiding, store the current display type in a data attribute
            if (!required) {
              $marker.setAttribute(showIf.settings.requiredMarkerDisplayStorage, $marker.style.display);
            }
            // Set marker display style to none if not required
            // otherwise get the display type from storage
            var displayType = required ? getAttribute($marker, showIf.settings.requiredMarkerDisplayStorage) || "inline" : "none";
            $marker.style.display = displayType;
          }
        } catch (err) {
          _didIteratorError3 = true;
          _iteratorError3 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion3 && _iterator3.return) {
              _iterator3.return();
            }
          } finally {
            if (_didIteratorError3) {
              throw _iteratorError3;
            }
          }
        }
      }
    };

    // Tell an element to show
    showIf.show = function ($target) {
      var instant = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      showIf._beforeShow($target);

      // Required-if variation
      if (showIf._targetIsRequiredIf($target)) {
        showIf.setRequired($target, true);

        // Show-if variation
      } else {
        if (instant) {
          $target.style.display = "block";
        } else {
          if (!$target.hasAttribute("data-showing")) {
            $target.setAttribute("data-showing", "true");
            $target.removeAttribute("data-hiding");
            showIf.showFunction($target, instant);
          }
        }
      }

      // Focus
      if (showIf._targetShouldFocusIn($target)) {
        showIf._focusInTarget($target);
      }

      // Re-enable
      if (showIf._targetShouldDisable($target)) {
        showIf._enableFieldsIn($target);
      }

      showIf._afterShow($target);
    };

    // Tell an element to hide
    showIf.hide = function ($target) {
      var instant = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      showIf._beforeHide($target, instant);

      // Required-if variation
      if (showIf._targetIsRequiredIf($target)) {
        showIf.setRequired($target, false);

        // Show-if variation
      } else {
        if (instant) {
          $target.style.display = "none";
        } else {
          if (!$target.hasAttribute("data-hiding")) {
            $target.setAttribute("data-hiding", "true");
            $target.removeAttribute("data-showing");
            showIf.hideFunction($target, instant);
          }
        }
      }

      // Disable
      if (showIf._targetShouldDisable($target)) {
        showIf._disableFieldsIn($target);
      }

      // Destroy
      if (showIf._targetShouldDestroy($target)) {
        showIf._destroyDataIn($target);
      }

      showIf._afterHide($target, instant);
    };

    // The function used for showing an element
    showIf.showFunction = function ($target) {
      var instant = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      if (showIf.settings.showFunction) {
        showIf.settings.showFunction($target, instant);
      } else {
        if (typeof jQuery !== "undefined") {
          var slideSpeed = instant ? 0 : showIf.settings.slideSepeed;
          jQuery($target).stop().slideDown(slideSpeed, function () {
            if ($target.hasAttribute("data-showing")) {
              $target.removeAttribute("data-showing");
            }
          });
        } else {
          $target.style.display = "block";
        }
      }
    };

    // The function used for hiding an element
    showIf.hideFunction = function ($target) {
      var instant = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      if (showIf.settings.hideFunction) {
        showIf.settings.hideFunction($target, instant);
      } else {
        if (typeof jQuery !== "undefined") {
          var slideSpeed = instant ? 0 : showIf.settings.slideSepeed;
          jQuery($target).stop().slideUp(slideSpeed, function () {
            if ($target.hasAttribute("data-hiding")) {
              $target.removeAttribute("data-hiding");
            }
          });
        } else {
          $target.style.display = "none";
        }
      }
    };

    // Toggle an element
    // const element = document.querySelector("[data-test-element]");
    // showIf.toggle(element, true);   // show
    // showIf.toggle(element, false);  // hide
    showIf.toggle = function ($target) {
      var shouldShow = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var instant = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      if ($target.hasAttribute(showIf.settings.inverse)) {
        shouldShow = !shouldShow;
      }
      if (shouldShow) {
        showIf.show($target, instant);
      } else {
        showIf.hide($target, instant);
      }
    };

    // Get all the elements that need to show or hide in showIf.$listeners
    // Then get the controls that determine their visibility
    // Then set the visibility based on those controls' state
    showIf.bindListeners = function () {
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = showIf.$targets[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var $target = _step4.value;

          // Get the input controls for this target
          var $allControls = showIf._getTargetControlsFor($target);
          var _iteratorNormalCompletion5 = true;
          var _didIteratorError5 = false;
          var _iteratorError5 = undefined;

          try {
            for (var _iterator5 = $allControls[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
              var $thisControl = _step5.value;

              // Determine which sort of input control this is
              var type = getAttribute($thisControl, "type");
              var isTextInput = getAttribute($target, showIf.settings.showIfInput);
              var isCheckboxOrRadio = type === "radio" || type === "checkbox";
              var isSelect = getAttribute($target, showIf.settings.showIfSelectOption);

              // Bind the appopriate listeners to this controls
              if (isCheckboxOrRadio) {
                showIf._bindCheckbox($thisControl, $allControls, $target);
              } else if (isTextInput) {
                showIf._bindInput($thisControl, $allControls, $target);
              } else if (isSelect) {
                showIf._bindSelect($thisControl, $allControls, $target);
              }
            }
          } catch (err) {
            _didIteratorError5 = true;
            _iteratorError5 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion5 && _iterator5.return) {
                _iterator5.return();
              }
            } finally {
              if (_didIteratorError5) {
                throw _iteratorError5;
              }
            }
          }
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4.return) {
            _iterator4.return();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }
    };

    // =========================================================================
    // Initialise
    // =========================================================================

    showIf.init = function () {
      // Expose helpers to the window object
      showIf._exposeHelpers();
      showIf.$targets = document.querySelectorAll("[" + showIf.settings.showIf + "]," + "[" + showIf.settings.requiredIf + "]");
      showIf.bindListeners();
    };

    // Initialise if running in the browser
    if (typeof window !== "undefined") {
      showIf.init();
    }

    return showIf;
  })();

})));
