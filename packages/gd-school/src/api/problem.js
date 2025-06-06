import request from "../api/problem.js";

export function getProblemAPi(page,page_size) {
    return request({
        url: '/problem',
        method: 'get',
        params: {
            page,page_size
        }
    })
}