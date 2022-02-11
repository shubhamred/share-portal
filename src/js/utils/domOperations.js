/* eslint-disable import/prefer-default-export */
// disables the scrolling on input type numbers
export const disableMouseWheelOnNumbers = () => {
  document.addEventListener('wheel', () => {
    if (document.activeElement.type === 'number') {
      document.activeElement.blur();
    }
  });
};
