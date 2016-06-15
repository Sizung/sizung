const setCursorToEnd = (inputElement) => {
  if (inputElement && inputElement.value) {
    const lastPos = inputElement.value.length;

    inputElement.selectionStart = lastPos;
    inputElement.selectionEnd   = lastPos;
  }
};

export {
  setCursorToEnd,
};
