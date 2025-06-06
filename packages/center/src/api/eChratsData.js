import request from '../utlis/request.js'

export function getPieEchratsApi(){
    return request({
        url: '/work-orders/status-distribution',
        method: 'GET'
    })
}

export function getBarEchratsApi(){
    return request({
        url: '/work-orders/group-distribution',
        method: 'GET'
    })
}

export function getLineEchratsApi(){
    return request({
        url: '/work-orders/trend',
        method: 'GET'
    })
}