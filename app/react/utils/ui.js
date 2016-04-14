const setCursorToEnd = (inputElement) => {
  const lastPos = inputElement.value.length;

  inputElement.selectionStart = lastPos;
  inputElement.selectionEnd   = lastPos;
};

export {
  setCursorToEnd,
}
