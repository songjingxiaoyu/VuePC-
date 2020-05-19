<template>
  <div>
    <!-- 按钮 -->
    <el-button type="primary" icon="el-icon-plus" @click="showAdd" style="margin-bottom:20px">添加</el-button>
    <!-- 列表 -->
    <el-table
    v-loading="loading"
      :data="trademarks"
      border
      stripe>
      <!-- 序号列 -->
       <el-table-column
        label="序号"
        type="index"
        width="80"
        align="center">
      </el-table-column>
      <el-table-column
        prop="tmName"
        label="品牌名称"
        align="center">
      </el-table-column>
      <el-table-column
        label="logo"
        >
        <template slot-scope="{row}">
          <img :src="row.logoUrl" alt="" style="width:100px; height:60px">
        </template>
      </el-table-column>
      <el-table-column
        prop="address"
        label="操作"
        >
        <template slot-scope="{row}">
        <el-button
          type="warning"
          icon="el-icon-edit"
          size="mini"
          @click="showUpdate(row)"
          >修改</el-button>
        <el-button
          icon="el-icon-delete"
          type="danger"
          size="mini"
          @click="deleteTrademark(row)"
         >删除</el-button>
      </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
     <el-pagination
      background
      style="text-align:center; margin-top:20px"
      :current-page="page"
      :page-sizes="[3, 6, 9, 12]"
      :page-size="limit"
      layout=" prev, pager, next, jumper,->, sizes,total"
      :total="total"
      @current-change="getTrademarks"
      @size-change="handleSizeChange">
    </el-pagination>

    <!-- 品牌添加 -->
    <el-dialog :title="form.id ? '更新' : '添加' " :visible.sync="isShowDialog">
      <el-form :model="form" style="width:80%">
        <el-form-item label="品牌名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off" placeholder="请输入品牌名称"></el-input>
        </el-form-item>
        <el-form-item label="品牌logo" :label-width="formLabelWidth">
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleLogoSuccess"
            :before-upload="beforeLogoUpload">
            <img v-if="form.logoUrl" :src="form.logoUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div class="el-upload__tip" siot="tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowDialog = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTrademark">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'TrademarkList',
     data() {
        return {
          loading:false,
          trademarks:[],//当前页的列表数据
          total:0,//总数量
          page:1,//当前页码
          limit:3,//每页数量
          isShowDialog:false,
          form:{
            tmName:'',
            logoUrl:'',
          },
          formLabelWidth:'100px',
        }
      },
    mounted() {
      this.getTrademarks()
    },
    methods: {
      //图片上传成功时调用
      handleLogoSuccess(res,file){
        const logourl = res.data
        // const logourl = file.response.data
        //保存图片url
        this.from.logoUrl = logoUrl
      },
      //指定在准备发送上传图片请求前的回调函数
      beforeLogoUpload(file){
        const isJPGOrPNG = ['image/jpeg', 'image/png'].indexOf(file.type)>=0
        const isLt500KB = file.size / 1024 < 500
        if(!isJPGOrPNG){
          this.$message.error('上传头像图片只能是 JPG/PNG 格式')
        }
        if(!isLt500KB){
          this.$message.error('上传头像大小不能超过500kb')
        }
        return isJPGOrPNG && isLt500KB
      },
      //异步获取指定页码
      async getTrademarks(page=1){
        this.page = page
        this.loading = true
        const result = await this.$API.trademark.getList(page,this.limit)
        this.loading = false
        if(result.code===200){
          const {records,total} = result.data
          this.trademarks = records
          this.total = total
        }else{
          this.$message.error('获取品牌列表失败')
        }
      },
      //每页数据改变的监听数据回调
      handleSizeChange(pageSize){
        this.limit = pageSize
        this.getTrademarks()
      },
      //显示添加页面
      showAdd(){
        //重置from数据
        this.from = {
            tmName:'',
            logoUrl:''
          }
        this.isShowDialog = true
      },
      //显示修改界面
      showUpdate(trademark){
        this.from = trademark
        this.isShowDialog = true
      },
      //添加或更新品牌
      async addOrUpdateTrademark(){
        const trademark = this.from
        let result
        if(trademark.id){
           result = await this.$API.trademark.update(trademark)
        }else{
           result = await this.$API.trademark.add(trademark)
        }
        if(result.code===200){
          this.$message.success(`${trademark.id ? '更新' : '添加'} '品牌成功'`)
          this.isShowDialog = false
          this.getTrademarks(trademark.id ? this.page : 1)
          this.from = {
            tmName:'',
            logoUrl:''
          }
        }else{
          this.$message.error(`${trademark.id ? '更新' : '添加'}品牌失败`)
        }
      },
      //删除指定品牌
      deleteTrademark (trademark) {
        this.$confirm(`确定删除 ${trademark.tmName} 吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => { // 点击确定
          // 发送删除品牌的请求
          const result = await this.$API.trademark.remove(trademark.id)
          // 如果成功了
          if (result.code===200) {
            this.$message.success('删除品牌成功!')
            // 重新获取分页列表显示
            // 方式一: 固定去第1页面
            // this.getTrademarks(1)
            // 方式二: 还显示当前页(有可能当前页已经不存在了)
              // 特别: 如果当前页只剩一条数据, 获取上一页显示, 否则获取当前页
            const page = this.trademarks.length===1 ? this.page-1 : this.page
            this.getTrademarks(page)

          } else { // 如果失败了
            this.$message.error('删除品牌失败!')
          }
        }).catch(() => { // 点击取消
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      }
    },
  }
</script>

<style scoped>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
