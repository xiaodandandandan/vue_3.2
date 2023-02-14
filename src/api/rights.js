import request from './request'

export const getRightsList = () => {
    return request({
        url: 'rights/list'
    })
}

export const getRightsTree = () => {
    return request({
        url: 'rights/tree'
    })
}
