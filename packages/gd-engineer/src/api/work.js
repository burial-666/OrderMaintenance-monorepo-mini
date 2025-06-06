import request from '../utlis/request.js';

export function getWorkListApi(page,page_size,status,selectedId,idType,description,start_time,end_time) {
    let params = {
        page,
        page_size,
        status,
        description,
        start_time,
        end_time,
    };
    if (idType === 'user') {
        params.user_id = selectedId;
    } else if (idType === 'group') {
        params.group_id = selectedId;
    } else if (idType === 'engineer') {
        params.engineer_id = selectedId;
    }
    return request({
        url: '/work-orders/',
        method: 'get',
        params: params
    })
}
export function getWorkDetailApi(id) {
    return request({
        url: `/work-orders/${id}`,
        method: 'get'
    })
}
export function getPhoneAndNameApi(id) {
    return request({
        url:`/work-orders/${id}/engineer`,
        method: 'get',
    })
}
export function getWorkLogsListApi(id) {
    return request({
        url: `/work-orders/${id}/status-logs`,
        method: 'get'
    })
}
export function updateWorkStatusApi(id,data) {
    return request({
        url: `/work-orders/${id}/status`,
        method: 'put',
        data
    })
}
export function deleteWorkApi(id) {
    return request({
        url: `/work-orders/${id}`,
        method: 'delete'
    })
}

export function getSelectedEngineersIdApi(id){
    return request({
        url: '/work-orders/engineer-ids',
        method: 'GET',
        params:{id}
    })
}
export function getquestionsListApi(page,page_size,group_id) {
    return request({
        url: '/problems',
        method: 'get',
        params: {
            page,
            page_size,
            group_id
        }
    })
}
export function createWorkApi(data){
    return request({
        url: '/work-orders/',
        method: 'post',
        data
    })
}

export function returnWorkStatusApi(id,data) {
    return request({
        url: `/work-orders/${id}/return`,
        method: 'POST',
        data
    })
}