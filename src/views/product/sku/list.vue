<template>
<el-card class="sku-list">
  <!-- 列表 -->
  <div>
      <el-table border stripe :data="skuList" v-loading="loading">
          <el-table-column label="序号" type="index"  align="center" width="80"
          row-key="id"></el-table-column>
          <el-table-column label="名称"  prop="skuName"></el-table-column>
          <el-table-column label="描述" prop="skuDesc"></el-table-column>
          <el-table-column label="默认图片" width="150" align="center">
            <template slot-scope="{row}">
              <div class="info">
                <div class="pic">
                  <img :src="row.skuDefaultImg" alt="商品图片" style="width:80px;">
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="重量（KG）" prop="weight"></el-table-column>
          <el-table-column label="价格（元）" prop="price" width="80"></el-table-column>

          <el-table-column  label="操作" width="250" align="center">
          <template slot-scope="{row}">
            <hint-button v-if="row.isSale == 0" title="上架"  icon="el-icon-top" type="info"
            @click="onSale(row.id)" size="mini" ></hint-button>
            <hint-button v-if="row.isSale == 1" title="下架"  icon="el-icon-bottom" type="success"
            @click="cancelSale(row.id)" size="mini" ></hint-button>
            <hint-button title="修改"  icon="el-icon-edit"  type="primary"
            @click="toUpdateSku(row.id)" size="mini" ></hint-button>
            <hint-button  title="查看详情" icon="el-icon-info" type="primary"
            @click="showSkuInfo(row.id)" size="mini"></hint-button>
            <el-popconfirm :title="`确定删除 ${row.skuName} 吗`" @onConfirm="deleteSku(row.id)">
              <hint-button slot="reference" type="danger" size="mini" icon="el-icon-delete" title="删除"></hint-button>
            </el-popconfirm>
          </template>
          </el-table-column>
      </el-table>
  </div>
  <!-- 分页 -->
  <el-pagination
      background
      style="padding: 20px 0; text-align: center;"
      :current-page="page"
      :page-sizes="[5, 10, 20, 30, 40, 50]"
      :page-size="limit"
      layout=" prev, pager, next, jumper,->, sizes,total"
      :total="total"
      @current-change="getSkuList"
      @size-change="changeSize"
      >
  </el-pagination>

  <el-drawer
      :visible.sync="isShowSkuInfo"
      direction="rtl"
      :withHeader="false"
      size="50%">
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{skuInfo.skuName}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{skuInfo.skuDesc}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{skuInfo.price}}</el-col>
      </el-row>

      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="18">
          <el-tag type="success" style="margin-right: 5px" v-for="value in skuInfo.skuAttrValueList" :key="value.id">
              {{value.attrId + '-' + value.valueId}}
          </el-tag>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="5">销售属性</el-col>
        <el-col :span="18">
          <el-tag type="success" style="margin-right: 5px" v-for="value in skuInfo.skuSaleAttrValueList" :key="value.id">
              {{value.id + '-' + value.saleAttrValueId}}
          </el-tag>
        </el-col>
      </el-row>

      <el-row >
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">
           <el-carousel class="img-carousel" trigger="click" height="400px">
            <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
              <img :src="item.imgUrl" alt="">
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>

</el-card>
</template>

<script>
export default {
  name: 'SkuList',
  data() {
    return {
      total:0,//总数量
      page:1,//当前页码
      limit:10,//每页数量
      skuList: [],
      loading: false,
      skuInfo: {},
      isShowSkuInfo: false
    }
  },
  mounted() {
    this.getSkuList()
  },
  methods: {
    handleClose(close){
      this.skuInfo = {}
      this.isShowSkuInfo = false
    },
    //显示SKU详情
    async showSkuInfo(id){
      this.isShowSkuInfo = true
      const result = await this.$API.sku.get(id)
      this.skuInfo = result.data
    },
    //当页码发生改变自动调用
    changeSize(size){
      this.limit = size
      this.getSkuList(1)
    },
    //异步获取指定页码的sku列表
    async getSkuList(page=1){
      this.page = page
      this.loading=true
      const result = await this.$API.sku.getList(this.page,this.limit)
      this.skuList = result.data.records
      this.total = result.data.total
      this.loading=false
    },
    //对指定SKu进行上架请求
    onSale(skuId){
      this.$API.sku.onSale(skuId).then(result=>{
        this.$message({
          type:'success',
          message:'上架成功'
        })
        this.getSkuList(this.page)
      })
    },
    //对指定SKu进行下架请求
    cancelSale(skuId){
      this.$API.sku.cancelSale(skuId).then(result=>{
        this.$message({
          type:'success',
          message:'下架成功'
        })
        this.getSkuList(this.page)
      })
    },
    //到SKU的更新界面去
    toUpdateSku(skuId){
      this.$message.warning('待完成')
    },
    //删除SKU
    async deleteSku(skuId){
      const result = await this.$API.sku.remove(skuId)
      if(result.code===200){
        this.$message({
          message:'删除SKU成功',
          type:'success'
        })
        this.getSkuList(1)
      }else{
        this.$message({
          message:result.data || result.message || '删除SKU失败',
          type:'error'
        })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
  .sku-list {
    .el-row {
      height: 40px;
      margin-left: 10px;
      .el-col {
        line-height: 40px;
        &.el-col-5 {
          text-align: right;
          font-weight: bold;
          font-size: 18px;
          margin-right: 15px;
        }
      }
    }
    .img-carousel {
      width: 400px;
      border: 1px solid #ccc;
      img {
        width: 100%;
        height: 100%;
      }

      /deep/ .el-carousel__indicator {
        button {
          background-color: hotpink;
        }

        &.is-active {
          button {
            background-color: green;
          }
        }
      }
    }
  }
</style>

