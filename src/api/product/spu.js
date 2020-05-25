
//包含SPU管理的接口请求函数
import request from '@/utils/request'

export default{
  //获取所有销售属性列表
  getSaleList(){
    return request.get('/admin/product/baseSaleAttrList')
  },
  //删除指定的SPU根据id
  remove(id){
    return request.delete(`/admin/product/deleteSpu/${id}`)
  },
  //获取指定的id的SPU信息
  get(id){
    return request.get(`/admin/product/getSpuById/${id}`)
  },
  //添加/更新SPU
  addUpdate(spuInfo){
    return request.post(`/admin/product/${spuInfo.id ? 'update' : 'save'}SpuInfo`,spuInfo)
  },
  //获取指定分类的SPU分页列表
  getList(page,limit,category3Id){
    return request.get(`/admin/product/${page}/${limit}`,{params:{category3Id}})
  }

}







