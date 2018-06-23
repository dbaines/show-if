const { createInput } = require('./../test-helpers/create-input');
const { createTarget } = require('./../test-helpers/create-target');
const { changeInput, changeChecked } = require('./../test-helpers/change-input');
const { settings } = require('./../../src/lib/settings');
const bindCheckbox = require('./../../src/lib/bindings/bind-checkbox').default;

describe("Bindings", () => {

  describe('Single Radios', () => {
  
    test("Hidden when unchecked", () => {
      const $input = createInput("radio");
      const $target = createTarget();
      // Check that element is visible by default
      expect($target.style.display).toBe("");
      bindCheckbox($input, false, $target);
      // Expect element to now be hidden
      expect($target.style.display).toBe("none");
    });
  
    test("Visible when checked", () => {
      const $input = createInput("radio");
      const $target = createTarget();
      bindCheckbox($input, false, $target);
      // Expect element to be hidden by default
      expect($target.style.display).toBe("none");
      // Check input and update bindings for test
      changeChecked($input, true);
      // Expect element to now be hidden
      expect($target.style.display).toBe("block");
    });

    test("Disable - Disabled on hide and enabled on show", () => {
      const $input = createInput("radio");
      const $target = createTarget({ disable: true });
      const $nestedInput = createInput("text");
      $target.appendChild($nestedInput);
      // Expect input to be enabled
      expect($nestedInput.disabled).toBe(false);
      // Bind
      bindCheckbox($input, false, $target);
      // Expect input to be disabled
      expect($nestedInput.disabled).toBe(true);
      // Change input to checked
      changeChecked($input, true);
      expect($nestedInput.disabled).toBe(false);
    });

    test("Destroy - Data emptied when hiding", () => {
      const $input = createInput("radio");
      const $target = createTarget({ destroy: true });
      const $nestedInput = createInput("text");
      $nestedInput.value = "test data";
      $target.appendChild($nestedInput);
      // Expect value to be set
      expect($nestedInput.value).toBe("test data");
      // Bind
      bindCheckbox($input, false, $target);
      // Expect value to be removed
      expect($nestedInput.value).toBe("");
    });

    test("Inverse - Hidden when checked", () => {
      const $input = createInput("radio");
      const $target = createTarget({ inverse: true });
      // Expect that element is visible by default
      expect($target.style.display).toBe("");
      bindCheckbox($input, false, $target);
      // Expect element to still be visible after binding events
      expect($target.style.display).toBe("block");
      // Check input and expect that element is now hidden
      changeChecked($input, true);
      expect($target.style.display).toBe("none");
    });
  
    test("Inverse - Visible when unchecked", () => {
      const $input = createInput("radio", { checked: true });
      const $target = createTarget({ inverse: true });
      // Expect that element is visible by default
      expect($target.style.display).toBe("");
      bindCheckbox($input, false, $target);
      // Expect element to still be hidden after binding events
      expect($target.style.display).toBe("none");
      // Uncheck input and expect that element is now visible
      changeChecked($input, false);
      expect($target.style.display).toBe("block");
    });
  
  });
  
  describe('Single Checkbox', () => {
  
    test("Hidden when unchecked", () => {
      const $input = createInput("checkbox");
      const $target = createTarget();
      // Check that element is visible by default
      expect($target.style.display).toBe("");
      bindCheckbox($input, false, $target);
      // Expect element to now be hidden
      expect($target.style.display).toBe("none");
    });
  
    test("Visible when checked", () => {
      const $input = createInput("checkbox");
      const $target = createTarget();
      bindCheckbox($input, false, $target);
      // Expect element to be hidden by default
      expect($target.style.display).toBe("none");
      // Check input and update bindings for test
      changeChecked($input, true);
      // Expect element to now be hidden
      expect($target.style.display).toBe("block");
    });

    test("Inverse - Hidden when checked", () => {
      const $input = createInput("checkbox");
      const $target = createTarget({ inverse: true });
      // Expect that element is visible by default
      expect($target.style.display).toBe("");
      bindCheckbox($input, false, $target);
      // Expect element to still be visible after binding events
      expect($target.style.display).toBe("block");
      // Check input and expect that element is now hidden
      changeChecked($input, true);
      expect($target.style.display).toBe("none");
    });
  
    test("Inverse - Visible when unchecked", () => {
      const $input = createInput("checkbox", { checked: true });
      const $target = createTarget({ inverse: true });
      // Expect that element is visible by default
      expect($target.style.display).toBe("");
      bindCheckbox($input, false, $target);
      // Expect element to still be hidden after binding events
      expect($target.style.display).toBe("none");
      // Uncheck input and expect that element is now visible
      changeChecked($input, false);
      expect($target.style.display).toBe("block");
    });
  
  });

})
