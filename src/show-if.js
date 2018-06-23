import { version } from '../package.json';
import { settings } from './lib/settings';
import bindAll from './lib/bindings/bind-all';
import exposeHelpers from './lib/expose-helpers';

/*!
 * ShowIf is used to show/hide elements based 
 * on form selections using simple HTML data-attribute
 * helpers
 * 
 * @license MIT
 * @author David Baines <david@katalyst.com.au>
*/

/*global jQuery */
(function() {
  "use strict";

  let showIf = {
    version: version,
    settings: settings,
  }

  showIf.init = function(){

    // Expose helpers to the window for more advanced usage
    // This can be triggered simply by creating a window object:
    // window.showIf = {
    //   helpers: true
    // }
    exposeHelpers(showIf);

    // Bind listeners to the target controls
    bindAll();
  }

  // Initialise if running in the browser
  if(typeof(window) !== "undefined") {
    window.addEventListener("DOMContentLoaded", showIf.init);
  }

  return showIf;

}());