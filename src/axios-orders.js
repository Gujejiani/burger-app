import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://react-burger-ee2bc.firebaseio.com/'
});

export default instance;