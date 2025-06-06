import request from '../utlis/request.js'

export function getDutyPicture(id){
    return request({
        url: `/api/groups/${id}/schedule`,
        method: 'GET'
    })
}

export function setDutyPicture(id,schedule){
    return request({
        url: `/api/groups/${id}/schedule`,
        method: 'put',
        data: {
            schedule
        }
    })
}