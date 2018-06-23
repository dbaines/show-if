const changeInput = function($input){
  const event = new Event("change");
  $input.dispatchEvent(event);
}

const changeChecked = function($input, value=false) {
  $input.checked = value;
  changeInput($input);
}

export { changeInput, changeChecked };