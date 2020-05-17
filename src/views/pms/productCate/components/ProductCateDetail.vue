<template>
  <el-card class="form-container" shadow="never">
    <el-form :model="productCate"
             :rules="rules"
             ref="productCateFrom"
             label-width="150px">
      <el-form-item label="分类名称：" prop="name">
        <el-input v-model="productCate.name"></el-input>
      </el-form-item>
      <el-form-item label="上级分类：">
        <el-select v-model="productCate.parentId"
                   placeholder="请选择分类">
          <el-option
            v-for="item in selectProductCateList"
            :key="item._id"
            :label="item.name"
            :value="item._id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否显示：">
        <el-radio-group v-model="productCate.showStatus">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('productCateFrom')">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('productCateFrom')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>

  const defaultProductCate = {
    name: '',
    parentId: '',
    showStatus: 0,
  };
  export default {
    name: "ProductCateDetail",
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        productCate: Object.assign({}, defaultProductCate),
        selectProductCateList: [],
        rules: {
          name: [
            {required: true, message: '请输入分类名称', trigger: 'blur'},
            {min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur'}
          ]
        },
        filterAttrs: [],
        filterProductAttrList: [{
          value: []
        }]
      }
    },
    created() {
      this.getList();
      if (this.isEdit) {
        this.getProductAttributeIdList();
      }
    },
    methods: {
      getProductAttributeIdList() {
        this.$axios.get('/productCate/getOne',{params:{parentId:this.$route.query.id}}).then(res=>{
          if (res.status === 200 && res.data.err_code === 0){
            this.productCate = res.data.obj;
          }
        })
      },
      onSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$confirm('是否提交数据', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              if (this.isEdit){
                this.$axios.post('/productCate/update',{_id:this.$route.query.id,updateObj:this.productCate}).then(res=>{
                  if (res.status === 200 && res.data.err_code === 0){
                    this.$message({
                      message:'更新成功',
                      type:'success'
                    });
                    this.$router.push('/pms/productCate')
                  }
                })
              }
              else{
                this.$axios.post('/productCate/add', this.productCate).then(res => {
                  if (res.status === 200) {
                    if (res.data.err_code === 0) {
                      this.$message({
                        message: '添加成功',
                        type: 'success'
                      });
                      this.getList();
                    }
                  }
                });
              }
            });

          } else {
            this.$message({
              message: '验证失败',
              type: 'error',
              duration: 1000
            });
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.productCate = Object.assign({}, defaultProductCate);
        this.filterProductAttrList = [{
          value: []
        }];
      },
      getList() {
        this.$axios.get('/productCate/all',).then(res => {
          if (res.status === 200) {
            this.selectProductCateList = res.data.productCateList;
            this.selectProductCateList.unshift({
              _id: '',
              name: '无'
            })
          }
        })
      }
    },
    filters: {
      filterLabelFilter(index) {
        if (index === 0) {
          return '筛选属性：';
        } else {
          return '';
        }
      }
    }
  }
</script>

<style scoped>

</style>
