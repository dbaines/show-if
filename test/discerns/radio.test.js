const { createInput } = require('./../test-helpers/create-input');
const { createTarget } = require('./../test-helpers/create-target');
const { discernRadio, discernMultipleRadio } = require('./../../src/lib/discerns/discern-radio');

describe('Discerns', () => {

  let $input;

  beforeEach(() => {
    $input = document.createElement("input");
  })

  describe('Single Radio', () => {

    beforeEach(() => {
      $input.type = "radio";
    });

    test("False when unchecked", () => {
      expect(discernRadio($input)).toBeFalsy();
    });

    test("True when checked", () => {
      $input.checked = true;
      expect(discernRadio($input)).toBeTruthy();
    });

  });

  describe('Single Checkbox', () => {

    beforeEach(() => {
      $input.type = "checkbox";
    });

    test("False when unchecked", () => {
      expect(discernRadio($input)).toBeFalsy();
    });

    test("True when checked", () => {
      $input.checked = true;
      expect(discernRadio($input)).toBeTruthy();
    });

  });

});