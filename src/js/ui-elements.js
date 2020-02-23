/* global document */
function setUiElements(ids, obj = {}) {
    ids.forEach(setUiElement, obj);
    return obj;
}

function setUiElement(elementId) {
    this[kebabToCamel(elementId)] = document.getElementById(elementId);
}

function kebabToCamel(str) {
    return str.replace(/(-\w)/g, match => match[1].toUpperCase());
}

export default setUiElements;
