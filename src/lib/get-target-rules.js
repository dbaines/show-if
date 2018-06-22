import { settings } from './settings';
import getAttribute from './get-attribute';

// Get the show value for this element
// can either be set in data-show-if or data-required-if
const getShowRuleForTarget = function($element) {
  const ruleTypes = [
    "showIf",
    "requiredIf",
  ];
  let rule = "";
  ruleTypes.filter(type => {
    const attribute = settings[type];
    const value = getAttribute($element, attribute);
    if(value) {
      rule = value;
      return;
    }
  });
  return rule;
}

// Get the dom nodes for a target rule
const getControlId = function(id) {
  if(settings.getControlId) {
    return settings.getControlId(id);
  } else {
    return document.getElementById(id);
  }
}

// Get the controls for a show rule, eg:
// [data-show-if='foobar'] => #foobar
// [data-show-if='foo_&_bar'] => #foo,#bar
const getTargetControlsFor = function($target) {
  let $controls = [];
  const showRules = getShowRuleForTarget($target);
  // Create an array of required targets
  // split by the control seperator
  if(showRules) {
    let controlLabels = [showRules];
    if(showRules.indexOf(settings.controlSeperator) > -1) {
      controlLabels = showRules.split(settings.controlSeperator);
    }
    controlLabels.map(label => {
      $controls.push(getControlId(label));
    });
  } else {
    console.warn("[SHOWJS] No controls found for element - does it contain a show target attribute such as `data-show-if`?");
  }
  return $controls;
}

export { getShowRuleForTarget, getControlId, getTargetControlsFor };