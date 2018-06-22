import { settings } from './../settings';
import { isInputCheckable } from './../input-helpers';
import getAttribute from './../get-attribute';

const discernMultipleFields = function($target, $inputs, value=true) {
  const numberOfTargets = $inputs.length;
  let shouldShow = false;
  let numberOfTargetsHit = 0;

  // Check if there are multiple values passed in eg:
  // value1_&_value2
  const multipleValues = (value + "").indexOf(settings.controlSeperator) > -1;
  if(multipleValues) {
    value = value.split(settings.controlSeperator);
  }

  // Loop through all controls
  $inputs.map(($input, index) => {
    let valueToCheck = value;
    const useProp = isInputCheckable($input);
    if(multipleValues) {
      valueToCheck = value[index] || true;
    }
    if(useProp) {
      if($input.checked === valueToCheck) {
        numberOfTargetsHit++;
      } else if($input.value === valueToCheck) {
        numberOfTargetsHit++;
      }
    }
  });

  // Match any or all?
  if(getAttribute($target, settings.showType) === "any") {
    // If match any, check that there's at least one hit
    shouldShow = numberOfTargetsHit > 0;
  } else {
    // If match all, check if the number of targets hit matches the
    // number of targets
    shouldShow = numberOfTargetsHit === numberOfTargets;
  }

  return shouldShow;
}

export default discernMultipleFields;