const { createInput } = require('./../test-helpers/create-input');
const { createTarget } = require('./../test-helpers/create-target');
const { discernRadio, discernMultipleRadio } = require('./../../src/lib/discerns/discern-radio');

describe('Single Radio/Checkbox', () => {

  test("Single Radio - False when unchecked", () => {
    const $input = createInput("radio");
    expect(discernRadio($input)).toBeFalsy();
  });

  test("Single Radio - True when checked", () => {
    const $input = createInput("radio", { checked: true });
    expect(discernRadio($input)).toBeTruthy();
  });

});
