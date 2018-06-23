import { settings } from './../settings';
import checkValue from './discern-value';
import getAttribute from './../get-attribute';
import discernMultipleFields from './discern-multiple-fields';

const discernSelect = function($target, $select, instant=false, callback=false) {
  let selectOption = getAttribute($target, settings.showIfSelectOption);
  if(selectOption) {
    const shouldShow = checkValue($select.value, selectOption);
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