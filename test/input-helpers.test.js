const { createInput } = require('./test-helpers/create-input');
const { createTarget } = require('./test-helpers/create-target');
const { isInput, isInputCheckable } = require('./../src/lib/input-helpers');

describe('Input Helpers', () => {

  describe('isInput', () => {
    test('[input type=checkbox] is true', () => {
      const $element = createInput("checkbox");
      expect(isInput($element)).toBe(true);
    });
    test('[input type=radio] is true', () => {
      const $element = createInput("radio");
      expect(isInput($element)).toBe(true);
    });
    test('[input type=text] is true', () => {
      const $element = createInput("text");
      expect(isInput($element)).toBe(true);
    });
    test('[select] is true', () => {
      const $element = document.createElement("select");
      expect(isInput($element)).toBe(true);
    });
    test('[textarea] is true', () => {
      const $element = document.createElement("textarea");
      expect(isInput($element)).toBe(true);
    });
    test('[div] is false', () => {
      const $element = document.createElement("div");
      expect(isInput($element)).toBe(false);
    });
  });

  describe('isInputCheckable', () => {
    test('[input type=checkbox] is true', () => {
      const $element = createInput("checkbox");
      expect(isInputCheckable($element)).toBe(true);
    });
    test('[input type=radio] is true', () => {
      const $element = createInput("radio");
      expect(isInputCheckable($element)).toBe(true);
    });
    test('[input type=text] is false', () => {
      const $element = createInput("text");
      expect(isInputCheckable($element)).toBe(false);
    });
    test('[select] is false', () => {
      const $element = document.createElement("select");
      expect(isInputCheckable($element)).toBe(false);
    });
    test('[textarea] is false', () => {
      const $element = document.createElement("textarea");
      expect(isInputCheckable($element)).toBe(false);
    });
    test('[div] is false', () => {
      const $element = document.createElement("div");
      expect(isInputCheckable($element)).toBe(false);
    });
  });

});