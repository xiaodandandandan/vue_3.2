import request from './request'
// categories
export const GetGoodsCateList = (params) => {
    return request({
        url: '/categories',
        method: 'get',
        params
    })
}

export const DeleteCate = (id) => request({ url: `categories/${id}`, method: 'delete' })

export const AddCate = (data) => request({ url: '/categories', method: 'post', data })

export const SearchCate = (id) => request({ url: `categories/${id}` })

export const EditCate = (id, catName) => request({ url: `categories/${id}`, method: 'put', data: { cat_name: catName } })
