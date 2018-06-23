import { discernSelect, discernMultipleSelect } from './../discerns/discern-select';
import toggle from './../ui/toggle';

const bindSelect = function($select, $allControls, $target) {
  const changeFunction = function(event, instant=false) {
    if($allControls.length > 1) {
      discernMultipleSelect($target, $allControls, instant, toggle);
    } else {
      discernSelect($target, $select, instant, toggle);
    }
  }
  
  // Check on change
  $select.addEventListener("change", changeFunction);

  // Check on page load
  changeFunction(false, true);
}

export default bindSelect;