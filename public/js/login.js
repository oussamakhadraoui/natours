import axios from 'axios';
import { alert } from './alert';

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'post',
      url: '/v1/user/login',
      data: {
        email,
        password,
      },
    });
    if (res.data.status === 'success') {
      alert('success', 'success login');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (error) {
    alert('error', error.response.data.message);
  }
};
export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',

      url: '/v1/user/logout',
    });
    if (res.data.status === 'success') {
      location.reload(true);
    }
  } catch (error) {
    alert('error', 'something goes wrong! Try later.');
  }
};
