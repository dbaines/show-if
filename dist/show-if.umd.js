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

    // Select element uses label rather than value
    showIfSelectUsesLabel: "data-show-option-labels",

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
    helpers: false,

    // Prefix for custom events
    // eg: element.addEventListener("<eventPrefix>:before-show", ...);
    eventPrefix: 'show-if'

    // Build out settings from the defaults and then
    // overwrite values from the window object if
    // present
  };var buildSettings = function buildSettings() {
    var settings = _extends({}, defaults$1);
    if (window.showIf) {
      settings = _extends({}, defaults$1, window.showIf);
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
    var showRules = getShowRuleForTarget($target);
    return getControlsFromRule(showRules);
  };

  // Create an array of required targets
  // split by the control seperator
  var getControlsFromRule = function getControlsFromRule(showRules) {
    var $controls = [];
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

  var discernMultipleFields = function discernMultipleFields($target, $inputs) {
    var value = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

    var numberOfTargets = $inputs.length;
    var shouldShow = false;
    var numberOfTargetsHit = 0;

    // Check if there are multiple values passed in eg:
    // value1_&_value2
    var multipleValues = (value + "").indexOf(settings.controlSeperator) > -1;
    if (multipleValues) {
      value = value.split(settings.controlSeperator);
    }

    // Loop through all controls
    $inputs.map(function ($input, index) {
      var valueToCheck = value;
      var useProp = isInputCheckable($input);
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
    if (getAttribute($target, settings.showType) === "any") {
      // If match any, check that there's at least one hit
      shouldShow = numberOfTargetsHit > 0;
    } else {
      // If match all, check if the number of targets hit matches the
      // number of targets
      shouldShow = numberOfTargetsHit === numberOfTargets;
    }

    return shouldShow;
  };

  var discernRadio = function discernRadio($input) {
    var $target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var instant = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

    var shouldShow = $input.checked === true;
    if (callback && $target) {
      callback($target, shouldShow, instant);
    } else {
      return shouldShow;
    }
  };

  var discernMultipleRadio = function discernMultipleRadio($inputs, $target) {
    var instant = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

    var shouldShow = discernMultipleFields($target, $inputs);
    if (callback) {
      callback($target, shouldShow, instant);
    } else {
      return shouldShow;
    }
  };

  var customEvent = function customEvent(eventName, $element) {
    var eventFullName = settings.eventPrefix + ":" + eventName;
    if (typeof jQuery !== "undefined") {
      $($element).trigger(eventFullName, [$element]);
    } else {
      var event = new CustomEvent(eventFullName, {
        detail: {
          showTarget: $element
        }
      });
      $element.dispatchEvent(event);
    }
  };

  var beforeShow = function beforeShow($element) {
    customEvent("before-show", $element);
    if (settings.beforeShow) {
      settings.beforeShow($element);
    }
  };

  var afterShow = function afterShow($element) {
    customEvent("after-show", $element);
    if (settings.afterShow) {
      settings.afterShow($element);
    }
  };

  var beforeHide = function beforeHide($element) {
    customEvent("before-hide", $element);
    if (settings.beforeHide) {
      settings.beforeHide($element);
    }
  };

  var afterHide = function afterHide($element) {
    customEvent("after-hide", $element);
    if (settings.afterHide) {
      settings.afterHide($element);
    }
  };

  var targetIsRequiredIf = function targetIsRequiredIf($target) {
    return $target.hasAttribute(settings.requiredIf);
  };

  // Set the requiredness of input fields inside the target element
  var setRequired = function setRequired($target) {
    var required = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    if (isInput($target)) {
      $target.required = required;
    } else {
      var $inputs = $target.querySelectorAll(settings.inputTypes);
      var $markers = $target.querySelectorAll(settings.requiredMarker);
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = $inputs[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var $input = _step.value;

          $input.required = required;
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

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = $markers[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var $marker = _step2.value;

          // If hiding, store the current display type in a data attribute
          if (!required) {
            $marker.setAttribute(settings.requiredMarkerDisplayStorage, $marker.style.display);
          }
          // Set marker display style to none if not required
          // otherwise get the display type from storage
          var displayType = required ? getAttribute($marker, settings.requiredMarkerDisplayStorage) || "inline" : "none";
          $marker.style.display = displayType;
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

  // The function used for showing an element
  var showFunction = function showFunction($target) {
    var instant = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    if (settings.showFunction) {
      settings.showFunction($target, instant);
    } else {
      if (typeof jQuery !== "undefined") {
        var slideSpeed = instant ? 0 : settings.slideSepeed;
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

  // Tell an element to show
  var show = function show($target) {
    var instant = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    beforeShow($target);

    // Required-if variation
    if (targetIsRequiredIf($target)) {
      setRequired($target, true);

      // Show-if variation
    } else {
      if (instant) {
        $target.style.display = "block";
      } else {
        if (!$target.hasAttribute("data-showing")) {
          $target.setAttribute("data-showing", "true");
          $target.removeAttribute("data-hiding");
          showFunction($target, instant);
        }
      }
    }

    // Focus
    if (targetShouldFocusIn($target)) {
      focusInTarget($target);
    }

    // Re-enable
    if (targetShouldDisable($target)) {
      enableFieldsIn($target);
    }

    afterShow($target);
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

  // The function used for hiding an element
  var hideFunction = function hideFunction($target) {
    var instant = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    if (settings.hideFunction) {
      settings.hideFunction($target, instant);
    } else {
      if (typeof jQuery !== "undefined") {
        var slideSpeed = instant ? 0 : settings.slideSepeed;
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

  // Tell an element to hide
  var hide = function hide($target) {
    var instant = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    beforeHide($target, instant);

    // Required-if variation
    if (targetIsRequiredIf($target)) {
      setRequired($target, false);

      // Show-if variation
    } else {
      if (instant) {
        $target.style.display = "none";
      } else {
        if (!$target.hasAttribute("data-hiding")) {
          $target.setAttribute("data-hiding", "true");
          $target.removeAttribute("data-showing");
          hideFunction($target, instant);
        }
      }
    }

    // Disable
    if (targetShouldDisable($target)) {
      disableFieldsIn($target);
    }

    // Destroy
    if (targetShouldDestroy($target)) {
      destroyDataIn($target);
    }

    afterHide($target, instant);
  };

  // Toggle an element
  // const element = document.querySelector("[data-test-element]");
  // showIf.toggle(element, true);   // show
  // showIf.toggle(element, false);  // hide
  var toggle = function toggle($target) {
    var shouldShow = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var instant = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    if ($target.hasAttribute(settings.inverse)) {
      shouldShow = !shouldShow;
    }
    if (shouldShow) {
      show($target, instant);
    } else {
      hide($target, instant);
    }
  };

  var bindRadio = function bindRadio($input, $allControls, $target) {
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
        discernMultipleRadio($allControls, $target, instant, toggle);
      } else {
        discernRadio($input, $target, instant, toggle);
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

  // Check a value against an array of values or a single value
  // eg:
  // "test", "foo_&&_bar" = false
  // "test", "foobar" = false
  // "test", "foo_&&_test_bar" = true
  // "test", "test" = true
  var checkValue = function checkValue(currentValue, requiredValue) {
    if (requiredValue.indexOf(settings.controlSeperator) > -1) {
      requiredValue = requiredValue.split(settings.controlSeperator);
      return requiredValue.indexOf(currentValue) > -1;
    } else {
      return currentValue === requiredValue;
    }
  };

  var discernInput = function discernInput($target, $input) {
    var instant = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

    var shouldShow = false;
    var valueToMatch = getAttribute($target, settings.showIfInputValue).toLowerCase();
    var valueLower = $input.value.toLowerCase();
    var showType = getAttribute($target, settings.showType);

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
      shouldShow = checkValue(valueLower, valueToMatch);
    }
    if (callback) {
      callback($target, shouldShow, instant);
    } else {
      return shouldShow;
    }
  };

  var bindInput = function bindInput($input, $allControls, $target) {
    var changeFunction = function changeFunction(event) {
      var instant = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      discernInput($target, $input, instant, toggle);
    };
    // Check on keyup
    $input.removeEventListener("keyup", changeFunction);
    $input.addEventListener("keyup", changeFunction);

    // Check on page load
    changeFunction(false, true);
  };

  var shouldTargetRequireSelectLabel = function shouldTargetRequireSelectLabel($target) {
    return $target.hasAttribute(settings.showIfSelectUsesLabel);
  };

  var discernSelect = function discernSelect($target, $select) {
    var instant = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;


    var selectOption = getAttribute($target, settings.showIfSelectOption);
    if (selectOption) {
      var valueToCheck = $select.value;
      if (shouldTargetRequireSelectLabel($target)) {
        valueToCheck = $select.options[$select.selectedIndex].innerHTML;
      }
      var shouldShow = checkValue(valueToCheck, selectOption);
      if (callback) {
        callback($target, shouldShow, instant);
      } else {
        return shouldShow;
      }
    } else {
      console.warn("[SHOWJS] Attempting to determine select logic with no `data-show-option` attribute present.");
    }
  };

  var discernMultipleSelect = function discernMultipleSelect($target, $inputs) {
    var instant = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var callback = arguments[3];

    var selectOption = getAttribute($target, settings.showIfSelectOption);
    if (selectOption) {
      var shouldShow = discernMultipleFields($target, $inputs, selectOption);
      if (callback) {
        callback($target, shouldShow, instant);
      } else {
        return shouldShow;
      }
    } else {
      console.warn("[SHOWJS] Attempting to determine select logic with no `data-show-option` attribute present.");
    }
  };

  var bindSelect = function bindSelect($select, $allControls, $target) {
    var changeFunction = function changeFunction(event) {
      var instant = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      if ($allControls.length > 1) {
        discernMultipleSelect($target, $allControls, instant, toggle);
      } else {
        discernSelect($target, $select, instant, toggle);
      }
    };

    // Check on change
    $select.addEventListener("change", changeFunction);

    // Check on page load
    changeFunction(false, true);
  };

  var $targets = document.querySelectorAll("[" + settings.showIf + "]," + "[" + settings.requiredIf + "]");

  // Get all the elements that need to show or hide in showIf.$listeners
  // Then get the controls that determine their visibility
  // Then set the visibility based on those controls' state
  var bindListeners = function bindListeners() {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = $targets[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var $target = _step.value;

        // Get the input controls for this target
        var $allControls = getTargetControlsFor($target);
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = $allControls[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var $thisControl = _step2.value;

            // Determine which sort of input control this is
            var type = getAttribute($thisControl, "type");
            var isTextInput = getAttribute($target, settings.showIfInput);
            var isCheckboxOrRadio = type === "radio" || type === "checkbox";
            var isSelect = getAttribute($target, settings.showIfSelectOption);

            // Bind the appopriate listeners to this controls
            if (isCheckboxOrRadio) {
              bindRadio($thisControl, $allControls, $target);
            } else if (isTextInput) {
              bindInput($thisControl, $allControls, $target);
            } else if (isSelect) {
              bindSelect($thisControl, $allControls, $target);
            }
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

  // Expose helpers to the window for more advanced usage
  // This can be triggered simply by creating a window object:
  // window.showIf = {
  //   helpers: true
  // }
  var exposeHelpers = function exposeHelpers() {
    var showIf = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};


    // Don't do anything if helpers setting is disabled
    if (!showIf.settings || !showIf.settings.helpers) {
      return;
    }

    // Build out a combination object of the current
    // window settings and the showIf object that's 
    // passed in to this function
    showIf = _extends({}, showIf, {
      getAttribute: getAttribute,
      isInput: isInput,
      isInputCheckable: isInputCheckable,
      targetIsRequiredIf: targetIsRequiredIf,
      setRequired: setRequired,
      targetShouldFocusIn: targetShouldFocusIn,
      focusInTarget: focusInTarget,
      targetShouldDisable: targetShouldDisable,
      disableFieldsIn: disableFieldsIn,
      enableFieldsIn: enableFieldsIn,
      targetShouldDestroy: targetShouldDestroy, destroyDataIn: destroyDataIn,
      getShowRuleForTarget: getShowRuleForTarget,
      getControlId: getControlId,
      getTargetControlsFor: getTargetControlsFor,
      checkValue: checkValue,
      discernMultipleFields: discernMultipleFields,
      discernSelect: discernSelect,
      discernMultipleSelect: discernMultipleSelect,
      discernRadio: discernRadio,
      discernMultipleRadio: discernMultipleRadio,
      discernInput: discernInput,
      toggle: toggle,
      show: show,
      hide: hide,
      showFunction: showFunction,
      hideFunction: hideFunction,
      beforeShow: beforeShow,
      afterShow: afterShow,
      beforeHide: beforeHide,
      afterHide: afterHide,
      bindRadio: bindRadio,
      bindInput: bindInput,
      bindSelect: bindSelect,
      bindAll: bindListeners
    }, window.showIf);

    // Expose helpers to window, replacing the current
    // window object
    window.showIf = showIf;
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
      settings: settings
    };

    showIf.init = function () {

      // Expose helpers to the window for more advanced usage
      // This can be triggered simply by creating a window object:
      // window.showIf = {
      //   helpers: true
      // }
      exposeHelpers(showIf);

      // Bind listeners to the target controls
      bindListeners();
    };

    // Initialise if running in the browser
    if (typeof window !== "undefined") {
      window.addEventListener("DOMContentLoaded", showIf.init);
    }

    return showIf;
  })();

})));
