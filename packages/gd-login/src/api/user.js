import request from '../utlis/request.js';
import useLoginStore from '../store/login.js';

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



export function loginSuccess(){
  const loginStore = useLoginStore()
  let url = ''
  if (loginStore.role_id === 0) {
    url = 'school'
  }
  else if (loginStore.role_id === 1) {
    url = 'engineer'
  }
  else if (loginStore.role_id === 2) {
    url = 'group'
  }
  else if (loginStore.role_id === 3) {
    url = 'center'
  }
  window.location.href = window.location.href.replace(/(^[^\\/]*\/\/[^\\/]*\/).*$/, '$1' + url);
}