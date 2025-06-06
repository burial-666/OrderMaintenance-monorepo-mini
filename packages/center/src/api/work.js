import request from '../utlis/request'

export function getWorkListApi(page,page_size,status,selectedId,description,start_time,end_time) {
    let params = {
        page,
        page_size,
        status,
        description,
        start_time,
        end_time,
    };
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
export function getWorkLogsListApi(id) {
    return request({
        url: `/work-orders/${id}/status-logs`,
        method: 'get'
    })
}
export function getPhoneAndNameApi(id) {
    return request({
        url:`/work-orders/${id}/engineer`,
        method: 'get',
    })
}
export function createWorkApi(data){
    return request({
        url: '/work-orders/',
        method: 'post',
        data
    })
}
export function getAllWorkListApi(page,page_size,search,group_id,start_time,end_time) {
    return request({
        url: '/work-orders/admin',
        method: 'get',
        params: {
            page,
            page_size,
            search,
            group_id,
            start_time,
            end_time,
        }
    })
}
export function getquestionsListApi(page,page_size,group_id,keyword) {
    return request({
        url: '/problems',
        method: 'get',
        params: {
            page,
            page_size,
            group_id,
            keyword
        }
    })
}
export function getGroupListApi(){
    return request({
        url: '/api/groups',
        method: 'get'
    })
}
export function deletequestionApi(id) {
    return request({
        url: `/problems/${id}`,
        method: 'delete'
    })
}

export function createquestionApi(data) {
    return request({
        url: '/problems',
        method: 'post',
        data
    })
}
export function updateWorkStatusApi(id,data) {
    return request({
        url: `/work-orders/${id}/status`,
        method: 'put',
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

export function exportWorkDataApi(data){
    return request({
        url: '/export',
        method:'POST',
        data,
    })
}