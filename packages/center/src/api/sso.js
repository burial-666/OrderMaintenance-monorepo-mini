import request from '../utlis/request.js';
export const SSOLoginAPI = (code, state) => {
  return request({
    url: '/oauth/callback',
    method: 'get',
    params: {
        code,
        state
    }
  });
};