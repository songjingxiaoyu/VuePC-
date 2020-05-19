//商品管理的品牌管理相关接口请求函数的模块


import request from '@/utils/request'

const api_name = '/admin/product/baseTrademark'

export default {

  /*
  根据id获取对应品牌
  */
  getById(id) {
    return request({
      url: `${api_name}/get/${id}`,
      method: 'GET',
    })
  },

  /*
  获取所有品牌的列表
  */
 getList(page, limit) {
  if (page && limit) {
      return request(`/admin/product/baseTrademark/${page}/${limit}`)
    } else {
      return request('/admin/product/baseTrademark/getTrademarkList')
    }
 },

  /*
  添加一个新的品牌
  */
 add(trademark) {
  return request.post(`${api_name}/save`,trademark)
 },
  /*
  更新品牌
  */
 update(trademark) {
  return request.put(`${api_name}/update`,trademark)
 },
 /*
  根据id删除对应品牌
  */
 remove(id) {
  return request.delete(`/admin/product/baseTrademark/remove/${id}`)
},

}


