import request from '../utlis/request';

export function createSearchAPI(data){
    return request({
        url: '/api/search/record',
        method: 'POST',
        data
    });
}

export function getSearchListAPI(limit){
    return request({
        url: '/api/search/history',
        method: 'GET',
        params: {
            limit
        }
    })
}