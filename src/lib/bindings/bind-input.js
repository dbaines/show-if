import { discernInput } from './../discerns/discern-input';
import toggle from './../ui/toggle';

const bindInput = function($input, $allControls, $target){
  const changeFunction = function(event, instant=false) {
    discernInput($target, $input, instant, toggle);
  }
  // Check on keyup
  $input.removeEventListener("keyup", changeFunction);
  $input.addEventListener("keyup", changeFunction);

  // Check on page load
  changeFunction(false, true);
}

export default bindInput;