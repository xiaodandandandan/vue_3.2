import request from './request'

export const GetRoleList = () => {
  return request({
    url: '/roles'
  })
}

export const AddRole = (data) => {
  return request({
    url: '/roles',
    method: 'post',
    data
  })
}

export const SearchRole = (id) => {
  return request({
    url: `roles/${id}`
  })
}

export const EditRole = (id, data) => {
  return request({
    url: `roles/${id}`,
    method: 'put',
    data
  })
}

export const DeleteRole = (id) => {
  return request({
    url: `roles/${id}`,
    method: 'delete'
  })
}

export const SetRights = (id, rids) => {
  return request({
    url: `roles/${id}/rights`,
    method: 'post',
    data: {
      rids
    }
  })
}

export const DeleteRoleByRightId = (roleId, rightId) => {
  return request({
    url: `roles/${roleId}/rights/${rightId}`,
    method: 'delete'
  })
}
