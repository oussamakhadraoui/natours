import '@babel/polyfill';
import { login, logout } from './login';
import { updateSettings } from './updatesettings';
import { updatePass } from './updatePass';
import { booking } from './booking';
import { map } from './map';

const mapBox = document.getElementById('map');
const form = document.querySelector('.form--login');
const logoutbtn = document.querySelector('.nav__el--logout');
const settings = document.querySelector('.form-user-data');
const passInput = document.querySelector('.form-user-settings');
const bookingbtn = document.getElementById('bookingbtn');

if (bookingbtn) {
  bookingbtn.addEventListener('click', (e) => {
    e.preventDefault();
    const tourid = e.target.dataset.tourId;
    booking(tourid);
  });
}

if (passInput) {
  passInput.addEventListener('submit', async (e) => {
    e.preventDefault();
    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updatePass(passwordCurrent, password, passwordConfirm);

    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
}
if (settings) {
  settings.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('email', document.getElementById('email').value);
    form.append('name', document.getElementById('name').value);
    form.append('photo', document.getElementById('photo').files[0]);
    updateSettings(form);
  });
}

if (mapBox) {
  const location = JSON.parse(mapBox.dataset.location);
  map(location);
}

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}
if (logoutbtn) {
  logoutbtn.addEventListener('click', () => {
    return logout();
  });
}
