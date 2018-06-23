const createInput = function(type="text", options={}) {
  let $input = document.createElement("input");
  $input.type = type;
  if(options.checked) {
    $input.checked = options.checked;
  }
  if(options.name) {
    $input.name = options.name;
  }
  if(options.id) {
    $input.id = options.id;
  }
  return $input;
}

const createInputGroup = function(type, name, count=5) {
  const $container = document.createElement("div");
  for(let i; i < count; i++) {
    const $element = createInput(type, {
      name: name,
      id: i,
    });
    $container.appendChild($element);
  }
  return $container;
}

export { createInput, createInputGroup };