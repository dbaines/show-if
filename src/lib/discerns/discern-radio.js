import discernMultipleFields from './discern-multiple-fields';

const discernRadio = function($input, $target=false, instant=false, callback=false) {
  const shouldShow = $input.checked === true;
  if(callback && $target) {
    callback($target, shouldShow, instant);
  } else {
    return shouldShow;
  }
}

const discernMultipleRadio = function($inputs, $target, instant=false, callback=false) {
  const shouldShow = discernMultipleFields($target, $inputs);
  if(callback) {
    callback($target, shouldShow, instant);
  } else {
    return shouldShow;
  }
}

export { discernRadio, discernMultipleRadio };