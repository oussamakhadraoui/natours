const hide = () => {
  const el = document.querySelector('.alert');
  if (el) {
    el.parentElement.removeChild(el);
  }
};

export const alert = (type, text) => {
  hide();
  const el = `<div class="alert alert--${type}">${text}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', el);
  window.setTimeout(hide, 3000);
};
