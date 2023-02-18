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

// goods
export const GetParamsList = (id, params) => request({ url: `categories/${id}/attributes`, method: 'get', params })

export const AddParams = (id, data) => request({ url: `categories/${id}/attributes`, method: 'post', data })

export const searchParams = (id, attrId, params) => request({ url: `categories/${id}/attributes/${attrId}`, method: 'get', params })

export const editParams = (id, attrId, data) => request({ url: `categories/${id}/attributes/${attrId}`, method: 'put', data })

export const DeleteParams = (id, attrId) => request({
    url: `categories/${id}/attributes/${attrId}`,
    method: 'delete'
})
