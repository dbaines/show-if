const changeInput = function($input){
  const event = new Event("change");
  $input.dispatchEvent(event);
}

const changeChecked = function($input, value=false) {
  $input.checked = value;
  changeInput($input);
}

const changeInputValue = function($input, value="") {
  $input.value = value;
  changeInput($input);
}

export { changeInput, changeChecked, changeInputValue };