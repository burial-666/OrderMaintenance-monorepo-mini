import request from '../utlis/request.js'

export function getSoftwareListApi(page,page_size) {
    return request({
        url:'software-install-requests/',
        method: 'GET',
        params: {
            page,
            page_size
        }
    })
}

export function getSoftwareDetailApi(id) {
    return request({
        url:`software-install-requests/${id}`,
        method: 'GET'
    })
}

export function approveSoftwareApi(id, data){
    return request({
        url:`software-install-requests/${id}/approve`,
        method: 'POST',
        data
    })
}