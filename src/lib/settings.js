// =========================================================================
// Default Settings
// these settings can be overwritten on the page by creating a 
// window.showIfSettings object, eg:
// window.showIfSettings = { 
//  showIf: "data-show-something-else" 
// }
// =========================================================================

const defaults = {

  // Core show attribute
  showIf: "data-show-if",

  // Set required state conditinoally without showing/hiding the field
  requiredIf: "data-required-if",

  // The elements to toggle requiredness on and disable
  inputTypes: "input, select, textarea",

  // Text-based input listener for input[type=text] or textarea etc.
  showIfInput: "data-show-input",

  // Select elements need to know which options are the ones that show
  // the element
  showIfSelectOption: "data-show-option",

  // Input text to match
  showIfInputValue: "data-show-input",

  // Type of match (any, *)
  showType: "data-show-type",

  // Inverse logic
  inverse: "data-show-inverse",

  // Focus on inputs in the hidden element
  focusIn: "data-show-focus",

  // Disable hidden form fields when hiding
  disable: "data-show-disable",

  // Destroy data in form fields when hiding
  destroy: "data-show-destroy",

  // Attribute to hold required state when hiding elements
  // so that we can track which elements WERE required so we
  // can then restore that required state when showing again
  requiredStorage: "data-show-required",

  requiredMarker: "abbr[title='required']",
  requiredMarkerDisplayStorage: "data-required-if-display-type",

  // The value used to seperate out logical operations
  controlSeperator: "_&&_",

  // .slideUp(), .slideDown() value
  slideSpeed: 200,

  // Expose helper functions to the window object
  helpers: true,

}

// Build out settings from the defaults and then
// overwrite values from the window object if
// present
const buildSettings = function(){
  let settings = { ...defaults };
  if(window.showIfSettings) {
    settings = {
      ...defaults,
      ...window.showIfSettings,
    }
  }
  return settings;
}

const settings = buildSettings();

export default settings;