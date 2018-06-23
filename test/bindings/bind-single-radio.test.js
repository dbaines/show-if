const { changeChecked } = require('./../test-helpers/change-input');
const { settings } = require('./../../src/lib/settings');
const bindRadio = require('./../../src/lib/bindings/bind-radio').default;

describe("Bindings", () => {

  let $input, $target, $nestedInput;

  beforeEach(() => {
    $target = document.createElement("div");
    $nestedInput = document.createElement("input");
    $nestedInput.type = "text";
    $target.appendChild($nestedInput);
    return true;
  });

  describe('Single Radios', () => {

    beforeEach(() => {
      $input = document.createElement("input");
      $input.type = "radio";
      return true;
    });
  
    test("Hidden when unchecked", () => {
      // Check that element is visible by default
      expect($target.style.display).toBe("");
      bindRadio($input, false, $target);
      // Expect element to now be hidden
      expect($target.style.display).toBe("none");
    });
  
    test("Visible when checked", () => {
      bindRadio($input, false, $target);
      // Expect element to be hidden by default
      expect($target.style.display).toBe("none");
      // Check input and update bindings for test
      changeChecked($input, true);
      // Expect element to now be hidden
      expect($target.style.display).toBe("block");
    });

    test("Disable - Disabled on hide and enabled on show", () => {
      $target.setAttribute(settings.disable, "");
      // Expect input to be enabled
      expect($nestedInput.disabled).toBe(false);
      // Bind
      bindRadio($input, false, $target);
      // Expect input to be disabled
      expect($nestedInput.disabled).toBe(true);
      // Change input to checked
      changeChecked($input, true);
      expect($nestedInput.disabled).toBe(false);
    });

    test("Destroy - Data emptied when hiding", () => {
      $target.setAttribute(settings.destroy, "");
      $nestedInput.value = "test data";
      $target.appendChild($nestedInput);
      // Expect value to be set
      expect($nestedInput.value).toBe("test data");
      // Bind
      bindRadio($input, false, $target);
      // Expect value to be removed
      expect($nestedInput.value).toBe("");
    });

    test("Inverse - Hidden when checked", () => {
      $target.setAttribute(settings.inverse, "");
      // Expect that element is visible by default
      expect($target.style.display).toBe("");
      bindRadio($input, false, $target);
      // Expect element to still be visible after binding events
      expect($target.style.display).toBe("block");
      // Check input and expect that element is now hidden
      changeChecked($input, true);
      expect($target.style.display).toBe("none");
    });
  
    test("Inverse - Visible when unchecked", () => {
      $target.setAttribute(settings.inverse, "");
      $input.checked = true;
      // Expect that element is visible by default
      expect($target.style.display).toBe("");
      bindRadio($input, false, $target);
      // Expect element to still be hidden after binding events
      expect($target.style.display).toBe("none");
      // Uncheck input and expect that element is now visible
      changeChecked($input, false);
      expect($target.style.display).toBe("block");
    });

    test("Inverse + Disable - Disabled on hide and enabled on show", () => {
      $target.setAttribute(settings.inverse, "");
      $target.setAttribute(settings.disable, "");
      // Expect input to be enabled
      expect($nestedInput.disabled).toBe(false);
      // Bind
      bindRadio($input, false, $target);
      // Expect input to be disabled
      expect($nestedInput.disabled).toBe(false);
      // Change input to checked
      changeChecked($input, true);
      expect($nestedInput.disabled).toBe(true);
    });

    test("Inverse + Destroy - Data emptied when hiding", () => {
      $target.setAttribute(settings.inverse, "");
      $target.setAttribute(settings.destroy, "");
      $nestedInput.value = "test data";
      $target.appendChild($nestedInput);
      // Expect value to be set
      expect($nestedInput.value).toBe("test data");
      // Bind
      bindRadio($input, false, $target);
      // Expect value to be removed
      expect($nestedInput.value).toBe("test data");
      changeChecked($input, true);
      expect($nestedInput.value).toBe("");
    });
  
  });
  
  describe('Single Checkbox', () => {
  
    beforeEach(() => {
      $input = document.createElement("input");
      $input.type = "checkbox";
      return true;
    });
  
    test("Hidden when unchecked", () => {
      // Check that element is visible by default
      expect($target.style.display).toBe("");
      bindRadio($input, false, $target);
      // Expect element to now be hidden
      expect($target.style.display).toBe("none");
    });
  
    test("Visible when checked", () => {
      bindRadio($input, false, $target);
      // Expect element to be hidden by default
      expect($target.style.display).toBe("none");
      // Check input and update bindings for test
      changeChecked($input, true);
      // Expect element to now be hidden
      expect($target.style.display).toBe("block");
    });

    test("Disable - Disabled on hide and enabled on show", () => {
      $target.setAttribute(settings.disable, "");
      // Expect input to be enabled
      expect($nestedInput.disabled).toBe(false);
      // Bind
      bindRadio($input, false, $target);
      // Expect input to be disabled
      expect($nestedInput.disabled).toBe(true);
      // Change input to checked
      changeChecked($input, true);
      expect($nestedInput.disabled).toBe(false);
    });

    test("Destroy - Data emptied when hiding", () => {
      $target.setAttribute(settings.destroy, "");
      $nestedInput.value = "test data";
      $target.appendChild($nestedInput);
      // Expect value to be set
      expect($nestedInput.value).toBe("test data");
      // Bind
      bindRadio($input, false, $target);
      // Expect value to be removed
      expect($nestedInput.value).toBe("");
    });

    test("Inverse - Hidden when checked", () => {
      $target.setAttribute(settings.inverse, "");
      // Expect that element is visible by default
      expect($target.style.display).toBe("");
      bindRadio($input, false, $target);
      // Expect element to still be visible after binding events
      expect($target.style.display).toBe("block");
      // Check input and expect that element is now hidden
      changeChecked($input, true);
      expect($target.style.display).toBe("none");
    });
  
    test("Inverse - Visible when unchecked", () => {
      $target.setAttribute(settings.inverse, "");
      $input.checked = true;
      // Expect that element is visible by default
      expect($target.style.display).toBe("");
      bindRadio($input, false, $target);
      // Expect element to still be hidden after binding events
      expect($target.style.display).toBe("none");
      // Uncheck input and expect that element is now visible
      changeChecked($input, false);
      expect($target.style.display).toBe("block");
    });

    test("Inverse + Disable - Disabled on hide and enabled on show", () => {
      $target.setAttribute(settings.inverse, "");
      $target.setAttribute(settings.disable, "");
      // Expect input to be enabled
      expect($nestedInput.disabled).toBe(false);
      // Bind
      bindRadio($input, false, $target);
      // Expect input to be disabled
      expect($nestedInput.disabled).toBe(false);
      // Change input to checked
      changeChecked($input, true);
      expect($nestedInput.disabled).toBe(true);
    });

    test("Inverse + Destroy - Data emptied when hiding", () => {
      $target.setAttribute(settings.inverse, "");
      $target.setAttribute(settings.destroy, "");
      $nestedInput.value = "test data";
      $target.appendChild($nestedInput);
      // Expect value to be set
      expect($nestedInput.value).toBe("test data");
      // Bind
      bindRadio($input, false, $target);
      // Expect value to be removed
      expect($nestedInput.value).toBe("test data");
      changeChecked($input, true);
      expect($nestedInput.value).toBe("");
    });
  
  });

})
