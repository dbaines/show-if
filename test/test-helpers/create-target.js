import { settings } from './../../src/lib/settings';

const createTarget = function(options={}) {
  let $node = document.createElement("div");
  if(options.inverse) {
    $node.setAttribute(settings.inverse, "");
  }
  if(options.disable) {
    $node.setAttribute(settings.disable, "");
  }
  if(options.destroy) {
    $node.setAttribute(settings.destroy, "");
  }
  return $node;
}

export { createTarget }