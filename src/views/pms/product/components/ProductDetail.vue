<template> 
  <el-card class="form-container" shadow="never">
    <el-steps :active="active" finish-status="success" align-center>
      <el-step title="填写商品信息"></el-step>
      <el-step title="填写商品促销"></el-step>
      <el-step title="填写商品属性"></el-step>
    </el-steps>
    <product-info-detail
      v-show="showStatus[0]"
      v-model="productParam"
      :is-edit="isEdit"
      @nextStep="nextStep">
    </product-info-detail>
    <product-sale-detail
      v-show="showStatus[1]"
      v-model="productParam"
      :is-edit="isEdit"
      @nextStep="nextStep"
      @prevStep="prevStep">
    </product-sale-detail>
    <product-attr-detail
      v-show="showStatus[2]"
      v-model="productParam"
      :is-edit="isEdit"
      @prevStep="prevStep"
      @finishCommit="finishCommit">
    </product-attr-detail>
  </el-card>
</template>
<script>
  import ProductInfoDetail from './ProductInfoDetail';
  import ProductSaleDetail from './ProductSaleDetail';
  import ProductAttrDetail from './ProductAttrDetail';

  const defaultProductParam = {
    detailDesc: '',
    detailHtml: '',
    detailMobileHtml: '',
    detailTitle: '',
    name: '',
    newStatus: 0,
    indexStatus: 0,
    pic: [],
    //商品满减
    productFullReductionList: [{fullPrice: 0, reducePrice: 0}],
    price: 0,
    productAttributeCategoryId: null,
    //商品sku库存信息{lowStock: 0, pic: '', price: 0, sale: 0, skuCode: '', spData: '', stock: 0}
    skuStockList: [],
    productCategoryId: null,
    productSn: '',
    promotionEndTime: '',
    promotionPrice: null,
    promotionStartTime: '',
    promotionType: 0,
    publishStatus: 0,
    recommandStatus: 0,
    sale: 0,
    serviceIds: '',
    stock: 0,
    productAttrPics:[]
  };

  export default {
    name: 'ProductDetail',
    components: {ProductInfoDetail, ProductSaleDetail, ProductAttrDetail},
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        active: 0,
        productParam: Object.assign({}, defaultProductParam),
        showStatus: [true, false, false]
      }
    },
    created(){
      if (this.isEdit){
        this.$axios.post('/productDetail/getDetailById',{_id:this.$route.query.id}).then(res=>{
          if (res.data.err_code === 0 && res.status === 200){
            this.productParam = res.data.productDetail;
          }
        })
      }
    },
    methods: {
      hideAll() {
        for (let i = 0; i < this.showStatus.length; i++) {
          this.showStatus[i] = false;
        }
      },
      prevStep() {
        if (this.active > 0) {
          this.active--;
          this.hideAll();
          this.showStatus[this.active] = true;
        }
      },
      nextStep() {
        if (this.active < this.showStatus.length - 1) {
          this.active++;
          this.hideAll();
          this.showStatus[this.active] = true;
        }
      },
      finishCommit() {
        this.$confirm('是否要提交该产品', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (this.isEdit){
            this.$axios.post('/productDetail/update',this.productParam).then(res=>{
              if (res.status === 200 && res.data.err_code === 0){
                this.$message({
                  message:'更新成功',
                  type:'success'
                });
                this.$router.push('/pms/product')
              }
            })
          }
          else {
            this.$axios.post('/productDetail/add',this.productParam).then(res=>{
              if (res.status === 200 && res.data.err_code === 0){
                this.$message({
                  message:'添加成功',
                  type:'success'
                });
                this.$router.push('/pms/product')
              }
            });
          }
        })
      }
    }
  }
</script>
<style>
  .form-container {
    width: 800px;
  }
</style>


