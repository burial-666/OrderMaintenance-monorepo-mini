import request from '../utlis/request.js';

export function uploadApi(file) {
    const formData = new FormData();
    formData.append('file', file);
    return request({
        url: '/upload',
        method: 'POST',
        data: formData,
        headers: {
            'Content-Type':'multipart/form-data'
            }
    })
}