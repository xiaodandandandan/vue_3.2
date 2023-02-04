import request from '@/api/request'
export const login = (params) => {
    return request({
        url: '/login',
        method: 'POST',
        data: params
    })
}
