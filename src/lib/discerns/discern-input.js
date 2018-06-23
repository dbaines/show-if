import { settings } from './../settings';
import getAttribute from './../get-attribute';
import checkValue from './discern-value';

const discernInput = function($target, $input, instant=false, callback=false) {
  let shouldShow = false;
  const valueToMatch = getAttribute($target, settings.showIfInputValue).toLowerCase();
  const valueLower = $input.value.toLowerCase();
  const showType = getAttribute($target, settings.showType);

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
    shouldShow = checkValue(valueLower, valueToMatch);
  }
  if(callback) {
    callback($target, shouldShow, instant);
  } else {
    return shouldShow;
  }
}

export { discernInput }