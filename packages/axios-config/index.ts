import axios from 'axios';
import axios_config from './axios-config.json';

const api = axios.create(axios_config);

export default api;
