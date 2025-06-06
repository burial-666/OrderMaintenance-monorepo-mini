import request from '../utlis/request.js';

export function getUserApi(id){
    return request({
        url: `/users/${id}`,
        method: 'GET'
    })
}
export function getDashboardApi(id){
    return request({
        url:`/work-orders/dashboard/${id}`,
        method: 'GET'
    })
}

export function getUsersListApi(page,pageSize,status,role_ids,group_id){
    return request({
        url: '/users/',
        method: 'GET',
        params:{page,pageSize,status,role_ids,group_id}
    })
}
export function updateEngineerStatusApi(id,data){
    return request({
        url: `/users/update-engineer-status/${id}`,
        method: 'POST',
        data
    })
}