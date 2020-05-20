//商品管理的平台属性相关接口请求函数


import request from '@/utils/request'

export default {
  //获取属性信息列表
  // /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
  getList(category1Id,category2Id,category3Id){
    return request(`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`)
  },
  //删除属性根据id
  // /admin/product/deleteAttr/{attrId}
  remove(id){
    return request.delete(`/admin/product/deleteAttr/${id}`)
  },
  //获取属性值列表根据id
  // /admin/product/getAttrValueList/{attrId}
  getValueList(attrId){
    return request(`/admin/product/getAttrValueList/${attrId}`)
  },
  //添加/更新属性
  //  /admin/product/saveAttrInfo
  addOrUpdate(attrInfo){
    return request.post('/admin/product/saveAttrInfo',attrInfo)
  }
}

