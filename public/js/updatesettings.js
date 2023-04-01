import { alert } from './alert';
import axios from 'axios';

export const updateSettings = async (data) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: 'http://127.0.0.1:8000/v1/user/updatdata',
      data,
    });
    if (res.data.status === 'success') {
      alert('success', 'Data changed');
    }
  } catch (error) {
    alert('error', error.response.data.message);
  }
};
