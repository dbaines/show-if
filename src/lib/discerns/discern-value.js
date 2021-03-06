import { settings } from './../settings';

// Check a value against an array of values or a single value
// eg:
// "test", "foo_&&_bar" = false
// "test", "foobar" = false
// "test", "foo_&&_test_bar" = true
// "test", "test" = true
const checkValue = function(currentValue, requiredValue) {
  if(requiredValue.indexOf(settings.controlSeperator) > -1) {
    requiredValue = requiredValue.split(settings.controlSeperator);
    return requiredValue.indexOf(currentValue) > -1;
  } else {
    return currentValue === requiredValue;
  }
}

export default checkValue;