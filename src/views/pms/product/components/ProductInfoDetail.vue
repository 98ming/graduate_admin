<template>
  <div style="margin-top: 50px">
    <el-form :model="value" :rules="rules" ref="productInfoForm" label-width="120px" style="width: 600px" size="small">
      <el-form-item label="商品分类：" prop="productCategoryId">
        <el-cascader
          v-model="selectProductCateValue"
          :options="productCateOptions">
        </el-cascader>
      </el-form-item>
      <el-form-item label="商品名称：" prop="name">
        <el-input v-model="value.name"></el-input>
      </el-form-item>
      <el-form-item label="商品货号：" prop="productSn">
        <el-input v-model="value.productSn" disabled></el-input>
      </el-form-item>
      <el-form-item label="商品售价：" prop="price">
        <el-input v-model="value.price"></el-input>
      </el-form-item>
      <el-form-item label="商品库存：" prop="stock">
        <el-input v-model="value.stock"></el-input>
      </el-form-item>
      <el-form-item style="text-align: center">
        <el-button type="primary" size="medium" @click="handleNext('productInfoForm')">下一步，填写商品促销</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

  export default {
    name: "ProductInfoDetail",
    props: {
      value: Object,
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        hasEditCreated:false,
        //选中商品分类的值
        /*selectProductCateValue: [
          '5e81cefdd54a5612a4d428ec',
          '5e81cf3fd54a5612a4d428ef'
        ],*/
        selectProductCateValue:[],
        productCateOptions: [],
        rules: {
          name: [
            {required: true, message: '请输入商品名称', trigger: 'blur'},
            {min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur'}
          ],
          productCategoryId: [{required: true, message: '请选择商品分类', trigger: 'blur'}],
          price: [{required: true, message: '请选择商品价格', trigger: 'blur'}],
          stock: [{required: true, message: '请选择商品库存', trigger: 'blur'}],
          requiredProp: [{required: true, message: '该项为必填项', trigger: 'blur'}]
        }
      };
    },
    created() {
      if (this.isEdit){

      }
      else{
        this.getProductCateList();
        this.value.productSn = ("0000000" + 100000000 * Math.random()).match(/(\d{8})(\.|$)/)[1];
      }
    },
    computed:{
      //商品的编号
      productId(){
        return this.value._id;
      }
    },
    watch: {
      productId:function(newValue){
        if(!this.isEdit)return;
        if(this.hasEditCreated)return;
        if(newValue===undefined||newValue==null||newValue===0)return;
        this.handleEditCreated();
      },
      selectProductCateValue: function (newValue) {
        if (newValue != null && newValue.length === 2) {
          this.value.productCategoryId = newValue[1];
        } else {
          this.value.productCategoryId = newValue[0];
        }
      }
    },
    methods: {
      handleEditCreated(){
        if(this.value.productCategoryId!=null){
          this.$axios.get('/productCate/getParentId',{params:{_id:this.value.productCategoryId}}).then(res=>{
            this.selectProductCateValue.push(res.data.parentId);
            this.selectProductCateValue.push(this.value.productCategoryId);
            this.getProductCateList();
          })
        }
        this.hasEditCreated=true;
      },
      getProductCateList() {
        this.$axios.get('/productCate/getAll').then(res=>{
          var productCate = [];
          res.data.dataList.forEach(function (item) {
            item.label = item.name;
            item.value = item._id;
            if (item.parentId === ''){
              productCate.push(item)
            }
          });
          res.data.dataList.forEach(function (item) {
            if (item.parentId != ''){
              productCate.forEach(function (item2) {
                if (item2.children == undefined && item.parentId === item2._id){
                  item2.children = [];
                }
                if (item.parentId === item2._id){
                  item2.children.push(item);
                }
              })
            }
          });
          this.productCateOptions = productCate;
        });
      },
      handleNext(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$emit('nextStep');
          } else {
            this.$message({
              message: '验证失败',
              type: 'error',
              duration:1000
            });
            return false;
          }
        });
      }
    }
  }
</script>

<style scoped>
</style>
