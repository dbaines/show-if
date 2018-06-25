import { settings } from './../settings';
import checkValue from './discern-value';
import getAttribute from './../get-attribute';
import discernMultipleFields from './discern-multiple-fields';

const shouldTargetRequireSelectLabel = function($target) {
  return $target.hasAttribute(settings.showIfSelectUsesLabel);
}

const discernSelect = function($target, $select, instant=false, callback=false) {
  
  const selectOption = getAttribute($target, settings.showIfSelectOption);
  if(selectOption) {
    let valueToCheck = $select.value;
    if(shouldTargetRequireSelectLabel($target)) {
      valueToCheck = $select.options[$select.selectedIndex].innerHTML;
    }
    const shouldShow = checkValue(valueToCheck, selectOption);
    if(callback) {
      callback($target, shouldShow, instant);
    } else {
      return shouldShow;
    }
  } else {
    console.warn("[SHOWJS] Attempting to determine select logic with no `data-show-option` attribute present.");
  }
}

const discernMultipleSelect = function($target, $inputs, instant=false, callback) {
  let selectOption = getAttribute($target, settings.showIfSelectOption);
  if(selectOption) {
    const shouldShow = discernMultipleFields($target, $inputs, selectOption);
    if(callback) {
      callback($target, shouldShow, instant);
    } else {
      return shouldShow;
    }
  } else {
    console.warn("[SHOWJS] Attempting to determine select logic with no `data-show-option` attribute present.");
  }
}

export { discernSelect, discernMultipleSelect };