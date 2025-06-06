import request from '../utlis/request.js';

export function getWorkListApi(page,page_size,status,selectedId,idType,description,start_time,end_time,is_main_engineer) {
    let params = {
        page,
        page_size,
        status,
        description,
        start_time,
        end_time,
        is_main_engineer
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
export function manualAssignmentApi(id,data) {
    return request({
        url: `/work-orders/${id}/assign-to-engineers`,
        method: 'post',
        data
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

export function autoAssignmentApi(data) {
    return request({
        url: '/work-orders/auto-assign',
        method: 'post',
        data
    })
}

export function getAutoAssignmentStatusApi() {
    return request({
        url: '/work-orders/auto-assign',
        method: 'get'
    })
}
export function createWorkApi(data){
    return request({
        url: '/work-orders/',
        method: 'post',
        data
    })
}

export function getGroupListApi(){
    return request({
        url: '/api/groups',
        method: 'get'
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
export function deleteWorkApi(id) {
    return request({
        url: `/work-orders/${id}`,
        method: 'delete'
    })
}

export function getSelectedEngineersIdApi(id){
    return request({
        url: '/api/engineers/engineer-ids',
        method: 'GET',
        params:{id}
    })
}

export function returnWorkStatusApi(id,data) {
    return request({
        url: `/work-orders/${id}/return`,
        method: 'POST',
        data
    })
}