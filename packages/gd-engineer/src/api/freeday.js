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