<template>
  <div>
    <el-card>
      <CategorySelector @categoryChange="handleCategoryChange"/>
    </el-card>
    <el-card>
      <div v-show="isShowList">
        <el-button type="primary" icon="el-icon-plus" style="margin-bottom:20px"
        @click="showAdd"
        :disabled="!category3Id"
        >添加属性</el-button>
        <el-table border :data="attrs">
          <el-table-column label="序号" type="index" width="80" align="center"></el-table-column>
          <el-table-column label="属性名称" width="150" prop="attrName"></el-table-column>
          <el-table-column label="属性值列表" >
            <template slot-scope="{row}">
              <el-tag style="margin: 2px" type="info" v-for="value in row.attrValueList" :key="value.id">{{value.valueName}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
          <template slot-scope="{row}">
            <HintButton title="修改" type="primary" size="mini" icon="el-icon-edit" @click="showUpdate(row)"></HintButton>
            <HintButton title="删除" type="danger" size="mini" icon="el-icon-delete"></HintButton>
          </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="!isShowList">
        <el-form inline :model="attr">
          <el-form-item label="属性名">
            <el-input type="text" v-model="attr.attrName" placeholder="请输入属性名"></el-input>
          </el-form-item>
        </el-form>

        <el-button type="primary" icon="el-icon-plus"
        :disabled="!attr.attrName"
        @click="addAttrValue"
        >添加属性值</el-button>
        <el-button @click="isShowList=true">取消</el-button>

        <el-table border style="margin: 20px 0" :data="attr.attrValueList">
          <el-table-column label="序号"  type="index" width="80" align="center"></el-table-column>
          <el-table-column label="属性值名称">
            <template slot-scope="{row}">
              <el-input v-if="row.edit" v-model="row.valueName"
              size="mini" placeholder="请输入属性值名称"
              @blur="toShow(row)"
              @keyup.enter.native="toShow(row)"></el-input>
              <span v-else @click="toEdit(row)">{{row.valueName}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{$index}">
              <HintButton title="删除" type="danger" icon="el-icon-delete" size="mini"
              @click="attr.attrValueList.splice($index, 1)"></HintButton>
            </template>
          </el-table-column>
        </el-table>

        <el-button type="primary">保存</el-button>
        <el-button @click="isShowList=true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'AttrList',
  data() {
    return {
      category1Id:'',
      category2Id:'',
      category3Id:'',
      attrs:[],
      isShowList:true,//是否显示属性列表页面
      attr:{//要添加的平台属性对象
        attrName:'',//属性名
        attrValueList:[],//属性值列表
        categoryId:'',
        categoryLevel:3,
      },
    }
  },
  mounted() {
    this.category1Id = 2
    this.category2Id = 13
    this.category3Id = 61
    this.getAttrs()
  },
  methods: {
    //将指定属性值对象界面变为编辑模式
    toEdit(value){
      if(value.hasOwnProperty('edit')){
        value.edit = true
      }else{
        this.$set(value,'edit',true)
      }

    },
    //将指定属性值对象界面变为查看模式
    toShow(value){
      if(value.valueName){
        const isRepeat = this.attr.attrValueList.some((item,index)=>{
          if(item !== value){
            return item.valueName === value.valueName
          }
        })
        if(!isRepeat){
          value.edit = false
        }else{
          value.valueName = ''
          this.$message.warning('输入的名称已存在')
        }
      }
    },
    //显示添加属性的界面
    showAdd(){
      this.attr = {
        attrName:'',
        attrValueList:[],
        categoryId: this.category3Id,
        categoryLevel:3,
      },
      this.isShowList = false
    },
    //显示修改属性界面
    showUpdate(attr){
      this.attr = attr
      this.isShowList = false
    },
    //添加属性值
    addAttrValue(){
      this.attr.attrValueList.push({
        attrId:this.attr.id,
        valueName:'',
        edit:true,//添加的新属性值是编辑模式的
      })
    },
    //
    handleCategoryChange({categoryId,level}){
      if(level===1){
        this.category1Id = categoryId
        this.category3Id = ''
        this.category2Id = ''
        this.attrs = []
      }else if(level===2){
        this.category2Id = categoryId
        this.category3Id = ''
        this.attrs = []
      }else{
        this.category3Id = categoryId
        this.getAttrs()
      }
    },
    //异步请求获取属性列表显示
    async getAttrs(){
      const {category1Id,category2Id,category3Id} = this
      const result = await this.$API.attr.getList(category1Id,category2Id,category3Id)
      this.attrs = result.data
    },
    //
  },
}
</script>

<style scoped>
.edit-input {
  padding-right: 60px;
}
.save-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>

