const { changeChecked } = require('./../test-helpers/change-input');
const { settings } = require('./../../src/lib/settings');
const bindRadio = require('./../../src/lib/bindings/bind-radio').default;

describe("Bindings", () => {

  let $controlInput, $inputGroup, $allInputs, $target, $nestedInput;

  beforeEach(() => {
    $inputGroup = document.createElement("div");
    for(let i = 0; i < 5; i++) {
      const $input = document.createElement("input");
      $input.name = "test-name";
      $input.id = `test-${i}`;
      $inputGroup.appendChild($input);
    }
    $allInputs = $inputGroup.querySelectorAll("input");
    $controlInput = $allInputs[0];
    $target = document.createElement("div");
    $nestedInput = document.createElement("input");
    $nestedInput.type = "text";
    $target.appendChild($nestedInput);
    document.body.innerHTML = "";
    document.body.appendChild($inputGroup);
    document.body.appendChild($target);
    return true;
  });

  describe('Radio Group', () => {

    beforeEach(() => {
      for(const $input of $allInputs) {
        $input.type = "radio";
      }
      return true;
    });
  
    test("Hidden when none checked", () => {
      bindRadio($controlInput, [], $target);
      expect($target.style.display).toBe("none");
    });

    describe('Requires option 1', () => {

      beforeEach(() => {
        $controlInput = $inputGroup.querySelector("#test-1");
        bindRadio($controlInput, [], $target);
      });

      test("Hidden when option 0 is selected", () => {
        expect($target.style.display).toBe("none");
        changeChecked($inputGroup.querySelector("#test-0"),true);
        expect($target.style.display).toBe("none");
      });

      test("Visible when option 1 is selected", () => {
        expect($target.style.display).toBe("none");
        changeChecked($inputGroup.querySelector("#test-1"), true);
        expect($target.style.display).toBe("block");
      });

      test("Visible when option 1 is selected, then hidden when option 2 is selected", () => {
        expect($target.style.display).toBe("none");
        changeChecked($inputGroup.querySelector("#test-1"), true);
        expect($target.style.display).toBe("block");
        changeChecked($inputGroup.querySelector("#test-2"), true);
        expect($target.style.display).toBe("none");
      });

    });
  
  });
  
  describe('Checkbox Group', () => {
  
    beforeEach(() => {
      for(const $input of $allInputs) {
        $input.type = "checkbox";
      }
      return true;
    });

    test("Hidden when none checked", () => {
      bindRadio($controlInput, [], $target);
      expect($target.style.display).toBe("none");
    });

    describe('Requires option 1', () => {

      beforeEach(() => {
        $controlInput = $inputGroup.querySelector("#test-1");
        bindRadio($controlInput, [], $target);
      });

      test("Hidden when option 0 is selected", () => {
        expect($target.style.display).toBe("none");
        changeChecked($inputGroup.querySelector("#test-0"),true);
        expect($target.style.display).toBe("none");
      });

      test("Visible when option 1 is selected", () => {
        expect($target.style.display).toBe("none");
        changeChecked($inputGroup.querySelector("#test-1"), true);
        expect($target.style.display).toBe("block");
      });

      test("Visible when option 1 and 2 are selected", () => {
        expect($target.style.display).toBe("none");
        changeChecked($inputGroup.querySelector("#test-1"), true);
        expect($target.style.display).toBe("block");
        changeChecked($inputGroup.querySelector("#test-2"), true);
        expect($target.style.display).toBe("block");
      });

      test("Visible when all options are selected", () => {
        expect($target.style.display).toBe("none");
        changeChecked($inputGroup.querySelector("#test-0"), true);
        changeChecked($inputGroup.querySelector("#test-1"), true);
        changeChecked($inputGroup.querySelector("#test-2"), true);
        changeChecked($inputGroup.querySelector("#test-3"), true);
        changeChecked($inputGroup.querySelector("#test-4"), true);
        expect($target.style.display).toBe("block");
      });

      test("Hidden when all but option 1 are selected", () => {
        expect($target.style.display).toBe("none");
        changeChecked($inputGroup.querySelector("#test-0"), true);
        changeChecked($inputGroup.querySelector("#test-2"), true);
        changeChecked($inputGroup.querySelector("#test-3"), true);
        changeChecked($inputGroup.querySelector("#test-4"), true);
        expect($target.style.display).toBe("none");
      });

      test("Visible when option 1 is selected, then hidden when option 1 is selected again", () => {
        expect($target.style.display).toBe("none");
        changeChecked($inputGroup.querySelector("#test-1"), true);
        expect($target.style.display).toBe("block");
        changeChecked($inputGroup.querySelector("#test-1"), false);
        expect($target.style.display).toBe("none");
      });

    });


  });

})
