/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

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
  "use strict";

  var showIf = {
    version: "0.1.0"

    // =========================================================================
    // Helpers
    // =========================================================================

  };var _getAttribute = function _getAttribute($element, attribute) {
    return $element.hasAttribute(attribute) && $element.getAttribute(attribute);
  };

  // =========================================================================
  // Default Settings
  // these settings can be overwritten on the page by creating a 
  // window.showIfSettings object, eg:
  // window.showIfSettings = { 
  //  showIf: "data-show-something-else" 
  // }
  // =========================================================================

  var defaults = {

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
    helpers: true

    // Build out settings from the defaults and then
    // overwrite values from the window object if
    // present
  };showIf._buildSettings = function () {
    showIf.settings = _extends({}, defaults);
    if (window.showIfSettings) {
      showIf.settings = _extends({}, defaults, window.showIfSettings);
    }
    return showIf.settings;
  };

  // =========================================================================
  // Expose helpers to the window for more advanced usage
  // This can be triggered simply by creating a window object:
  // window.showIf = {
  //   helpers: true
  // }
  // =========================================================================

  showIf._exposeHelpers = function () {
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
    } else {
      //
    }
  };

  showIf._afterShow = function ($element) {
    if (showIf.settings.afterShow) {
      showIf.settings.afterShow($element);
    } else {
      //
    }
  };

  showIf._beforeHide = function ($element) {
    if (showIf.settings.beforeHide) {
      showIf.settings.beforeHide($element);
    } else {
      //
    }
  };

  showIf._afterHide = function ($element) {
    if (showIf.settings.afterHide) {
      showIf.settings.afterHide($element);
    } else {
      //
    }
  };

  // =========================================================================
  // Internal functions
  // =========================================================================

  // Get the show value for this element
  // can either be set in data-show-if or data-required-if
  showIf._getShowRuleForElement = function ($element) {
    var ruleTypes = ["showIf", "requiredIf"];
    var rule = "";
    ruleTypes.filter(function (type) {
      var attribute = showIf.settings[type];
      var value = _getAttribute($element, attribute);
      if (value) {
        rule = value;
        return;
      }
    });
    return rule;
  };

  // Quick check to see if an element is an input type
  showIf._isInput = function ($element) {
    return $element.nodeName.toLowerCase().indexOf(showIf.settings.inputTypes) > -1;
  };

  // Determine if a field should use .checked or .value
  // ie. is this field a checkbox or a radio?
  showIf._isInputCheckable = function ($input) {
    var type = _getAttribute($input, "type");
    if (type) {
      return type === "checkbox" || type === "radio";
    } else {
      return false;
    }
  };

  // Find an element and make all input fields within disabled
  showIf._disableFieldsIn = function ($element) {
    if ($element.hasAttribute(showIf.settings.disable)) {
      $element.querySelectorAll(showIf.settings.inputTypes).map(function ($input) {
        $input.disabled = true;
      });
    }
  };

  // Find an element and make all input fields within enabled
  showIf._enableFieldsIn = function ($element) {
    if ($element.hasAttribute(showIf.settings.disable)) {
      $element.querySelectorAll(showIf.settings.inputTypes).map(function ($input) {
        $input.disabled = false;
      });
    }
  };

  // Find an element and destroy all data in any form fields inside
  // said element
  showIf._destroyDataIn = function ($element) {
    if ($element.hasAttribute(showIf.settings.destroy)) {
      $element.querySelectorAll(showIf.settings.inputTypes).map(function ($input) {
        if (showIf._isInputCheckable($input)) {
          $input.checked = false;
        } else {
          $input.value = "";
        }
      });
    }
  };

  showIf._getControlId = function (id) {
    if (showIf.settings.getControlId) {
      return showIf.settings.getControlId(id);
    } else {
      return document.getElementById(id);
    }
  };

  // Get the controls for a show rule, eg:
  // [data-show-if='foobar'] => #foobar
  // [data-show-if='foo_&_bar'] => #foo,#bar
  showIf._getTargetControlsFor = function ($target) {
    var $controls = [];
    var showRules = showIf._getShowRuleForElement($target);
    // Create an array of required targets
    // split by the control seperator
    if (showRules) {
      var controlLabels = [showRules];
      if (showRules.indexOf(showIf.settings.controlSeperator) > -1) {
        controlLabels = showRules.split(showIf.settings.controlSeperator);
      }
      controlLabels.map(function (label) {
        $controls.push(showIf._getControlId(label));
      });
    } else {
      console.warn("[SHOWJS] No controls found for element - does it contain a show target attribute such as `data-show-if`?");
    }
    return $controls;
  };

  // =========================================================================
  // Bind event listeners to inputs and show/hide on page load
  // =========================================================================

  showIf._bindCheckbox = function ($input, $allControls, $target) {
    // Get the name of the input element and check if there
    // are other inputs with the same name (eg. collections, radio, 
    // checkboxes)
    var inputName = _getAttribute($input, "name");
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
        } else if ($input.val() === valueToCheck) {
          numberOfTargetsHit++;
        }
      }
    });

    // Match any or all?
    if (_getAttribute($element, showIf.settings.showType) === "any") {
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

    var selectOption = _getAttribute($target, showIf.settings.showIfSelectOption);
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

    var selectOption = _getAttribute($target, showIf.settings.showIfSelectOption);
    if (selectOption) {
      var shouldShow = showIf._decernMultipleFields(target, $inputs, selectOption);
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
    var valueToMatch = _getAttribute($target, showIf.settings.showIfInputValue).toLowerCase();
    var valueLower = $input.value.toLowerCase();
    var showType = _getAttribute($target, showIf.settings.showType);

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

  showIf.setRequired = function ($target) {
    var required = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    $target.required = required;
  };

  showIf.show = function ($target) {
    var instant = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    showIf._beforeShow($target);

    // Required-if variation
    if (_getAttribute($target, showIf.settings.requiredIf)) {
      if (showIf._isInput($target)) {
        showIf.setRequired($target, true);
      } else {
        var $inputs = $target.querySelectorAll(showIf.settings.inputTypes);
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = $inputs[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var $input = _step2.value;

            showIf.setRequired($target, true);
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
    showIf._afterShow($target);
  };

  showIf.hide = function ($target) {
    var instant = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    showIf._beforeHide($target);

    // Required-if variation
    if (_getAttribute($target, showIf.settings.requiredIf)) {
      if (showIf._isInput($target)) {
        showIf.setRequired($target, false);
      } else {
        var $inputs = $target.querySelectorAll(showIf.settings.inputTypes);
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = $inputs[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var $input = _step3.value;

            showIf.setRequired($target, false);
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
    showIf._afterHide($target);
  };

  showIf.showFunction = function ($target) {
    var instant = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    if (showIf.settings.showFunction) {
      showIf.settings.showFunction();
    } else {
      if (typeof jQuery !== "undefined") {
        jQuery($target).stop().slideDown(showIf.settings.slideSepeed, function () {
          if ($target.hasAttribute("data-showing")) {
            $target.removeAttribute("data-showing");
          }
        });
      } else {
        $target.style.display = "block";
      }
    }
  };

  showIf.hideFunction = function ($target) {
    var instant = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    if (showIf.settings.hideFunction) {
      showIf.settings.hideFunction();
    } else {
      if (typeof jQuery !== "undefined") {
        jQuery($target).stop().slideUp(showIf.settings.slideSepeed, function () {
          if ($target.hasAttribute("data-hiding")) {
            $target.removeAttribute("data-hiding");
          }
        });
      } else {
        $target.style.display = "none";
      }
    }
  };

  showIf.toggle = function ($target) {
    var shouldShow = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var instant = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    if (_getAttribute($target, showIf.settings.inverse)) {
      shouldShow = !shouldShow;
    }
    if (shouldShow) {
      showIf.show($target, instant);
    } else {
      showIf.hide($target, instant);
    }
  };

  showIf.toggleAllElements = function () {
    var _iteratorNormalCompletion4 = true;
    var _didIteratorError4 = false;
    var _iteratorError4 = undefined;

    try {
      for (var _iterator4 = showIf.$targets[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
        var $target = _step4.value;

        var $allControls = showIf._getTargetControlsFor($target);
        var _iteratorNormalCompletion5 = true;
        var _didIteratorError5 = false;
        var _iteratorError5 = undefined;

        try {
          for (var _iterator5 = $allControls[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
            var $thisControl = _step5.value;

            var type = _getAttribute($thisControl, "type");
            var isTextInput = _getAttribute($target, showIf.settings.showIfInput);
            var isCheckboxOrRadio = type === "radio" || type === "checkbox";
            var isSelect = _getAttribute($target, showIf.settings.showIfSelectOption);

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
    // Build settings from defaults and user-defined 
    // settings on the window object
    showIf._buildSettings();
    // Expose helpers to the window object
    showIf._exposeHelpers();
    showIf.$targets = document.querySelectorAll("[" + showIf.settings.showIf + "]," + "[" + showIf.settings.requiredIf + "]");
    showIf.toggleAllElements();
  };

  // Initialise if running in the browser
  if (typeof window !== "undefined") {
    showIf.init();
  }

  return showIf;
})();

/***/ })
/******/ ]);