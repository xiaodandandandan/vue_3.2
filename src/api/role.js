import request from './request'

export const GetRoleList = () => {
  return request({
    url: '/roles'
  })
}
