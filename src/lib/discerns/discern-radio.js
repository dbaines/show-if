import discernMultipleFields from './discern-multiple-fields';

const discernRadio = function($target, $input, instant=false, callback=false) {
  const shouldShow = $input.checked === true;
  if(callback) {
    callback($target, shouldShow, instant);
  } else {
    return shouldShow;
  }
}

const discernMultipleRadio = function($target, $inputs, instant=false, callback=false) {
  const shouldShow = discernMultipleFields($target, $inputs);
  if(callback) {
    callback($target, shouldShow, instant);
  } else {
    return shouldShow;
  }
}

export { discernRadio, discernMultipleRadio };