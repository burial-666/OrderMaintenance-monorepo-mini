import request from "../utlis/request.js";

export function createFreeDayAPI(data){
    return request({
        url: '/leave-requests',
        method: 'POST',
        data
    })
}

export function getFreeDayListAPI(page, pageSize){
    return request({
        url: '/leave-requests',
        method: 'GET',
        params: {
            page,
            pageSize
        }
    })
}
export function deleteFreeDayAPI(id){
    return request({
        url: `/leave-requests/${id}`,
        method: 'DELETE'
    })
}
export function updateFreeDayAPI(id, data){
    return request({
        url: `/leave-requests/${id}/approve`,
        method: 'post',
        data
    })
}