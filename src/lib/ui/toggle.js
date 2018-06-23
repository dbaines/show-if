import { settings } from './../settings';
import { show } from './show';
import { hide } from './hide';

// Toggle an element
// const element = document.querySelector("[data-test-element]");
// showIf.toggle(element, true);   // show
// showIf.toggle(element, false);  // hide
const toggle = function($target, shouldShow=false, instant=false) {
  if($target.hasAttribute(settings.inverse)) {
    shouldShow = !shouldShow;
  }
  if(shouldShow) {
    show($target, instant);
  } else {
    hide($target, instant);
  }
}

export default toggle;