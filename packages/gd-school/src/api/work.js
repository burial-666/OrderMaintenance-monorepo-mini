import request from '../utlis/request.js';

export function getWorkListApi(page,page_size,status,selectedId,idType,description,start_time,end_time) {
    let params = {
        page,
        page_size,
        status,
        start_time,
        end_time,
        description,
        is_main_engineer: true
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
export function deleteWorkApi(id) {
    return request({
        url: `/work-orders/${id}`,
        method: 'delete'
    })
}
export function createWorkApi(data){
    return request({
        url: '/work-orders/',
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

export function getquestionsListApi(page,page_size) {
    return request({
        url: '/problems',
        method: 'get',
        params: {
            page,
            page_size            
        }
    })
}

export function createSoftwareApi(data){
    return request({
        url: '/software-install-requests/',
        method: 'POST',
        data
    })
}
export function getSoftwareApi(page,page_size,user_name_or_contact_phone){
    return request({
        url: '/software-install-requests/',
        method: 'GET',
        params: {
            page,
            page_size,
            user_name_or_contact_phone
        }
    })
}
export function getSoftwareDetailApi(id){
    return request({
        url: `/software-install-requests/${id}`,
        method: 'GET'
    })
}