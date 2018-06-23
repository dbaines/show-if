import getAttribute from './get-attribute';
import { isInput, isInputCheckable } from './input-helpers';
import { targetIsRequiredIf, setRequired } from './target-required';
import { targetShouldFocusIn, focusInTarget } from './target-focus';
import { targetShouldDisable, disableFieldsIn, enableFieldsIn } from './target-disables';
import { targetShouldDestroy, destroyDataIn } from './target-destroy';
import { getShowRuleForTarget, getControlId, getTargetControlsFor } from './get-target-rules';
import checkValue from './discerns/discern-value';

// Discerns
import discernMultipleFields from './discerns/discern-multiple-fields';
import { discernSelect, discernMultipleSelect } from './discerns/discern-select';
import { discernRadio, discernMultipleRadio } from './discerns/discern-radio';
import { discernInput } from './discerns/discern-input';

// Bindings
import bindRadio from './bindings/bind-radio';
import bindInput from './bindings/bind-input';
import bindSelect from './bindings/bind-select';
import bindAll from './bindings/bind-all';

// UI
import { show, showFunction } from './ui/show';
import { hide, hideFunction } from './ui/hide';
import { beforeShow, afterShow, beforeHide, afterHide } from './ui/toggle-helpers';
import toggle from './ui/toggle';

// Expose helpers to the window for more advanced usage
// This can be triggered simply by creating a window object:
// window.showIf = {
//   helpers: true
// }
const exposeHelpers = function(showIf={}) {

  // Don't do anything if helpers setting is disabled
  if(!showIf.settings || !showIf.settings.helpers) {
    return;
  }

  // Build out a combination object of the current
  // window settings and the showIf object that's 
  // passed in to this function
  showIf = {
    ...showIf,
    getAttribute,
    isInput,
    isInputCheckable,
    targetIsRequiredIf,
    setRequired,
    targetShouldFocusIn,
    focusInTarget,
    targetShouldDisable,
    disableFieldsIn,
    enableFieldsIn,
    targetShouldDestroy, destroyDataIn,
    getShowRuleForTarget,
    getControlId,
    getTargetControlsFor,
    checkValue,
    discernMultipleFields,
    discernSelect,
    discernMultipleSelect,
    discernRadio,
    discernMultipleRadio,
    discernInput,
    toggle,
    show,
    hide,
    showFunction,
    hideFunction,
    beforeShow,
    afterShow,
    beforeHide,
    afterHide,
    bindRadio,
    bindInput,
    bindSelect,
    bindAll,
    ...window.showIf,
  }

  // Expose helpers to window, replacing the current
  // window object
  window.showIf = showIf;
}

export default exposeHelpers;