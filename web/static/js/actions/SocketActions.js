import { CREATE_SOCKET } from '../constants';
import axios from 'axios';

const Phoenix = require('../phoenix');

const createSocket = () => {
  return async function(dispatch) {
    const r = await axios.get('/api/user-id');
    const socket = new Phoenix.Socket('/socket', {
      params: { user_id: r.data.id }
    });

    socket.connect();

    dispatch({
      type: CREATE_SOCKET,
      payload: {
        socket,
        userId: r.data.id
      }
    });
  };
};

export default createSocket;
