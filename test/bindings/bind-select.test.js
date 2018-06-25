const { changeInputValue } = require('./../test-helpers/change-input');
const { settings } = require('./../../src/lib/settings');
const bindSelect = require('./../../src/lib/bindings/bind-select').default;
const checkValue = require('./../../src/lib/discerns/discern-value').default;

const { getControlsFromRule } = require('./../../src/lib/get-target-rules');

describe("Bindings", () => {
  
  let $select, $target, $nestedInput, $select1, $select2;
  let selectValues = [{
    label: "Please select",
    value: "",
  },{
    label: "Yes",
    value: "true",
  },{
    label: "No",
    value: "false",
  },{
    label: "Maybe",
    value: "undecided"
  }];

  function buildSelectMenu(values=["Please select", "Yes", "No", "Maybe"]) {
    let $select = document.createElement("select");
    $select.id = 'test-0';
    for(const value of values) {
      const $option = document.createElement("option");
      if(typeof(value) === "object") {
        $option.value = value.value;
        $option.innerHTML = value.label;
      } else {
        $option.innerHTML = value;
      }
      $select.appendChild($option);
    }
    return $select;
  }

  beforeEach(() => {
    $select = buildSelectMenu();
    $target = document.createElement("div");
    $nestedInput = document.createElement("input");
    $nestedInput.type = "text";
    $target.appendChild($nestedInput);
    document.body.innerHTML = "";
    document.body.appendChild($select);
    document.body.appendChild($target);
    return true;
  });

  describe('Single Select', () => {
    describe('Requires "Yes" from value', () => {

      beforeEach(() => {
        $target.setAttribute(settings.showIfSelectOption, "Yes");
      });

      test("Hidden when no selection", () => {
        bindSelect($select, [], $target);
        expect($target.style.display).toBe("none");
      });
  
      test("Visible when 'Yes' is selected", () => {
        bindSelect($select, [], $target);
        changeInputValue($select, "Yes");
        expect($target.style.display).toBe("block");
      });

      test("Run through options", () => {
        bindSelect($select, [], $target);
        expect($target.style.display).toBe("none");
        changeInputValue($select, "Yes");
        expect($target.style.display).toBe("block");
        changeInputValue($select, "No");
        expect($target.style.display).toBe("none");
        changeInputValue($select, "Maybe");
        expect($target.style.display).toBe("none");
      });

      test("Inverse - Run through options", () => {
        $target.setAttribute(settings.inverse, "");
        bindSelect($select, [], $target);
        expect($target.style.display).toBe("block");
        changeInputValue($select, "Yes");
        expect($target.style.display).toBe("none");
        changeInputValue($select, "No");
        expect($target.style.display).toBe("block");
        changeInputValue($select, "Maybe");
        expect($target.style.display).toBe("block");
      });

    });

    describe('Requires "Yes" from label', () => {

      beforeEach(() => {
        $select = buildSelectMenu(selectValues);
        $target.setAttribute(settings.showIfSelectOption, "Yes");
        $target.setAttribute(settings.showIfSelectUsesLabel, "");
      })

      test("Hidden when no selection", () => {
        bindSelect($select, [], $target);
        expect($target.style.display).toBe("none");
      });
  
      test("Visible when 'Yes' is selected", () => {
        bindSelect($select, [], $target);
        changeInputValue($select, "true");
        expect($target.style.display).toBe("block");
      });

      test("Run through options", () => {
        bindSelect($select, [], $target);
        expect($target.style.display).toBe("none");
        changeInputValue($select, "true");
        expect($target.style.display).toBe("block");
        changeInputValue($select, "false");
        expect($target.style.display).toBe("none");
        changeInputValue($select, "undecided");
        expect($target.style.display).toBe("none");
      });

      test("Inverse - Run through options", () => {
        $target.setAttribute(settings.inverse, "");
        bindSelect($select, [], $target);
        expect($target.style.display).toBe("block");
        changeInputValue($select, "true");
        expect($target.style.display).toBe("none");
        changeInputValue($select, "false");
        expect($target.style.display).toBe("block");
        changeInputValue($select, "undecided");
        expect($target.style.display).toBe("block");
      });

    });
  });

  describe('Multiple Selects', () => {

    beforeEach(() => {
      $select1 = buildSelectMenu();
      $select2 = buildSelectMenu();
      document.body.innerHTML = "";
      document.body.appendChild($select1);
      document.body.appendChild($select2);
      document.body.appendChild($target);
      return true;
    });

    describe('Requires "Yes" from both selects', () => {
      test('From labels', () => {
        $target.setAttribute(settings.showIfSelectOption, "Yes");
        bindSelect($select1, [], $target);
        expect($target.style.display).toBe("none");
      });
      describe('From values', () => {

      });
    });

    describe('Requires "Yes" from select1 and "No" from select2 labels', () => {
      describe('From labels', () => {

      });
      describe('From values', () => {

      });
    });

    describe('Requires "Yes" from either of the selects', () => {
      describe('From labels', () => {

      });
      describe('From values', () => {

      });
    });

    describe('Requires "Yes" from select1 or "No" from select2 labels', () => {
      describe('From labels', () => {

      });
      describe('From values', () => {

      });
    });
    
  });

});