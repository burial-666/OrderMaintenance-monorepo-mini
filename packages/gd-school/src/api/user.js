import request from '../utlis/request.js';

export function login(phone_number, code)  {
    return request({
        url: '/users/login-with-code',
        method: 'post',
        data: {
            phone_number,
            code
        }
    })
}
export function getcode(phone_number) {
    return request({
        url: '/users/send-verification-code',
        method: 'post',
        data: {
            phone_number
        }
    })
}

export function getUserApi(id){
    return request({
        url: `/users/${id}`,
        method: 'GET'
    })
}