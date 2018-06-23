import { settings } from './../settings';

const customEvent = function(eventName, $element) {
  const eventFullName = `${settings.eventPrefix}:${eventName}`;
  if(typeof(jQuery) !== "undefined") {
    $($element).trigger(eventFullName, [$element]);
  } else {
    const event = new CustomEvent(eventFullName, {
      detail: {
        showTarget: $element
      }
    });
    $element.dispatchEvent(event);
  }
}

const beforeShow = function($element){
  customEvent("before-show", $element);
  if(settings.beforeShow) {
    settings.beforeShow($element);
  }
}

const afterShow = function($element){
  customEvent("after-show", $element);
  if(settings.afterShow) {
    settings.afterShow($element);
  }
}

const beforeHide = function($element){
  customEvent("before-hide", $element);
  if(settings.beforeHide) {
    settings.beforeHide($element);
  }
}

const afterHide = function($element){
  customEvent("after-hide", $element);
  if(settings.afterHide) {
    settings.afterHide($element);
  }
}

export { beforeShow, afterShow, beforeHide, afterHide }