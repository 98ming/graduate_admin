<template>
  <el-card class="form-container" shadow="never">
    <el-form :model="productAttr" :rules="rules" ref="productAttrFrom" label-width="150px">
      <el-form-item label="属性名称：" prop="attrName">
        <el-input v-model="productAttr.attrName"></el-input>
      </el-form-item>
      <el-form-item label="商品类型：" prop="_id">
        <el-select v-model="productAttr._id" placeholder="请选择" disabled>
          <el-option
            v-for="item in productAttrCateList"
            :key="item._id"
            :label="item.name"
            :value="item._id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="属性值可选值列表:">
        <el-input :autosize="true" type="textarea" v-model="inputListFormat"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('productAttrFrom')">提交</el-button>
        <el-button  v-if="!isEdit" @click="resetForm('productAttrFrom')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>

  const defaultProductAttr = {
    attr:{
      name: '',
      attrList:[]
    },
    attrName:'',
    _id: '',
  };
  export default {
    name: "ProductAttrDetail",
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        productAttr: {
          attr:{
            name: '',
            attrList:[]
          },
          attrName:'',
          _id: this.$route.query.cid,
        },
        rules: {
          attrName: [
            {required: true, message: '请输入属性名称', trigger: 'blur'},
            {min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur'}
          ],
          _id:[
            {required: true, message: '请选择商品类型', trigger: 'blur'}
          ]
        },
        productAttrCateList: null,
        inputListFormat:null,
        index:this.$route.query.index,
        list:null
      }
    },
    created() {
      this.getCateList();
      if (this.isEdit){
        this.$axios.get('/productAttr/getAttr',{params:{_id:this.$route.query.cid}}).then(res=>{
          if (res.status === 200 && res.data.err_code === 0){
            this.list = res.data.attrList;
            this.productAttr.attrName = res.data.attrList[this.index].name;
            this.inputListFormat = res.data.attrList[this.index].attrList.join('\n');
          }
        })
      }
    },
    watch:{
      inputListFormat: function (newValue, oldValue) {
        newValue = newValue.replace(/\n/g,',');
        newValue = newValue.split(',');
        this.productAttr.attr.attrList = newValue;
      }
    },
    methods: {
      getCateList() {
        this.$axios.get('/productAttr/all').then(res=>{
          if (res.data.err_code === 0 && res.status === 200) {
            this.productAttrCateList = res.data.productAttrList;
          }
        })
      },
      resetProductAttr() {
        this.productAttr = Object.assign({}, defaultProductAttr);
        this.productAttr._id = this.$route.query.cid;
        this.inputListFormat = '';
      },
      onSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$confirm('是否提交数据', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.productAttr.attr.name = this.productAttr.attrName;
              if(this.isEdit){
                this.list[this.index] = this.productAttr.attr;
                this.$axios.post('/productAttr/updateAttr',{_id:this.productAttr._id,attr:this.list}).then(res=>{
                  if (res.status === 200 && res.data.err_code === 0){
                    this.$message({
                      message:res.data.message,
                      type:'success'
                    });
                    this.$router.push({path: '/pms/productAttrList',query:{cid:this.productAttr._id,cname:this.$route.query.cname}})
                  }
                })
              }else{
                this.$axios.post('/productAttr/addAttr',this.productAttr).then(res=>{
                  if (res.status === 200 && res.data.err_code === 0){
                    this.$message({
                      message:res.data.message,
                      type:'success'
                    });
                    this.$router.push({path: '/pms/productAttrList',query:{cid:this.productAttr._id,cname:this.$route.query.cname}})
                  }
                })
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
        this.resetProductAttr();
      }
    },
  }
</script>

<style scoped>

</style>
