import { alert } from './alert';
import axios from 'axios';

export const updateSettings = async (data) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: '/v1/user/updatdata',
      data,
    });
    if (res.data.status === 'success') {
      alert('success', 'Data changed');
    }
  } catch (error) {
    alert('error', error.response.data.message);
  }
};
