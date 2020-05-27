import axios from 'axios';

const instance = axios.create();

export const getUserId = () => {
    return instance.get('api/v1/login')
};