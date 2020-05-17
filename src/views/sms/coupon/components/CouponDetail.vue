<template> 
  <el-card class="form-container" shadow="never">
    <el-form :model="coupon"
             :rules="rules"
             ref="couponFrom"
             label-width="150px"
             size="small">
      <el-form-item label="优惠券名称：" prop="name">
        <el-input v-model="coupon.name" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="总发行量：" prop="publishCount">
        <el-input v-model.number="coupon.publishCount" placeholder="只能输入正整数" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="面额：" prop="amount">
        <el-input v-model.number="coupon.amount" placeholder="面值只能是数值，限2位小数" class="input-width">
          <template slot="append">元</template>
        </el-input>
      </el-form-item>
      <el-form-item label="每人限领：">
        <el-input v-model="coupon.perLimit" placeholder="只能输入正整数" class="input-width">
          <template slot="append">张</template>
        </el-input>
      </el-form-item>
      <el-form-item label="使用门槛：" prop="minPoint">
        <el-input v-model.number="coupon.minPoint" placeholder="只能输入正整数" class="input-width">
          <template slot="prepend">满</template>
          <template slot="append">元可用</template>
        </el-input>
      </el-form-item>
      <el-form-item label="有效期：">
        <el-date-picker type="date" placeholder="选择日期" v-model="coupon.startTime" style="width: 150px"></el-date-picker>
        <span style="margin-left: 20px;margin-right: 20px">至</span>
        <el-date-picker type="date" placeholder="选择日期" v-model="coupon.endTime" style="width: 150px"></el-date-picker>
      </el-form-item>
      <el-form-item label="可使用商品：">
        <el-radio-group v-model="coupon.useType">
          <el-radio-button :label="0">全场通用</el-radio-button>
          <el-radio-button :label="1">指定分类</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-show="coupon.useType===1">
        <el-cascader
          clearable
          placeholder="请选择分类名称"
          v-model="selectProductCate"
          :options="productCateOptions">
        </el-cascader>
        <el-button @click="handleAddProductCategoryRelation()">添加</el-button>
        <el-table ref="productCateRelationTable"
                  :data="coupon.productCategoryRelationList"
                  style="width: 100%;margin-top: 20px"
                  border>
          <el-table-column label="分类名称" align="center">
            <template slot-scope="scope">{{scope.row.parentCategoryName}}{{scope.row.productCategoryName === undefined ? null : '>' + scope.row.productCategoryName}}</template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="100">
            <template slot-scope="scope">
              <el-button size="mini"
                         type="text"
                         @click="handleDeleteProductCateRelation(scope.$index, scope.row)">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('couponFrom')">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('couponFrom')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
  const defaultCoupon = {
    name: null,
    amount: null,
    perLimit: 1,
    minPoint: null,
    startTime: null,
    endTime: null,
    useType: 0,
    publishCount: null,
    productCategoryRelationList: []
  };
  export default {
    name: 'CouponDetail',
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        coupon: Object.assign({}, defaultCoupon),
        rules: {
          name: [
            {required: true, message: '请输入优惠券名称', trigger: 'blur'},
            {min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur'}
          ],
          publishCount: [
            {type: 'number', required: true, message: '只能输入正整数', trigger: 'blur'}
          ],
          amount: [
            {type: 'number', required: true, message: '面值只能是数值，0.01-10000，限2位小数', trigger: 'blur'}
          ],
          minPoint: [
            {type: 'number', required: true, message: '只能输入正整数', trigger: 'blur'}
          ]
        },
        selectProduct: null,
        selectProductLoading: false,
        selectProductOptions: [],
        selectProductCate: null,
        productCateOptions: []
      }
    },
    created() {
      if (this.isEdit) {
        this.$axios.get('/coupon/getCouponById',{params:{_id:this.$route.query.id}}).then(res=>{
          if (res.status === 200 && res.data.err_code === 0){
            this.coupon = res.data.data;
          }
        })
      }
      this.getProductCateList();
    },
    methods: {
      onSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$confirm('是否提交数据', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              if (this.coupon.useType === 1 && this.coupon.productCategoryRelationList.length === 0){
                this.$message({
                  type:'warning',
                  message:'请选择使用优惠券的商品类型'
                });
                return;
              }
              if (this.isEdit) {
                this.$axios.post('/coupon/update',this.coupon).then(res=>{
                  if (res.status === 200 && res.data.err_code === 0){
                    this.$message({
                      type:'success',
                      message:res.data.message
                    });
                    this.$router.push('/sms/coupon');
                  }
                })
              } else {
                this.$axios.post('/coupon/add', this.coupon).then(res => {
                  if (res.status === 200 && res.data.err_code === 0){
                    this.$message({
                      type:'success',
                      message:res.data.message
                    });
                    this.$router.push('/sms/coupon');
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
        this.coupon = Object.assign({}, defaultCoupon);
      },
      handleAddProductCategoryRelation() {
        if (this.selectProductCate === null || this.selectProductCate.length === 0) {
          this.$message({
            message: '请先选择商品分类',
            type: 'warning'
          });
          return
        }
        this.coupon.productCategoryRelationList.push(this.getProductCateByIds(this.selectProductCate));
        this.selectProductCate = [];
      },
      handleDeleteProductCateRelation(index, row) {
        this.coupon.productCategoryRelationList.splice(index, 1);
      },
      getProductCateList() {
        this.$axios.get('/productCate/getAll').then(res => {
          var productCate = [];
          res.data.dataList.forEach(function (item) {
            item.label = item.name;
            item.value = item._id;
            if (item.parentId === '') {
              productCate.push(item)
            }
          });
          res.data.dataList.forEach(function (item) {
            if (item.parentId !== '') {
              productCate.forEach(function (item2) {
                if (item2.children === undefined && item.parentId === item2._id) {
                  item2.children = [];
                }
                if (item.parentId === item2._id) {
                  item2.children.push(item);
                }
              })
            }
          });
          this.productCateOptions = productCate;
        });
      },
      getProductCateByIds(ids) {
        let name;
        let parentName;
        if (ids.length === 1) {
          for (let i = 0; i < this.productCateOptions.length; i++) {
            if (this.productCateOptions[i].value === ids[0]) {
              parentName = this.productCateOptions[i].label;
              return {productCategoryId: ids[0], parentCategoryName: parentName,productCategoryName: name};
            }
          }
        } else {
          for (let i = 0; i < this.productCateOptions.length; i++) {
            if (this.productCateOptions[i].value === ids[0]) {
              parentName = this.productCateOptions[i].label;
              for (let j = 0; j < this.productCateOptions[i].children.length; j++) {
                if (this.productCateOptions[i].children[j].value === ids[1]) {
                  name = this.productCateOptions[i].children[j].label;
                }
              }
            }
          }
          return {productCategoryId: ids[1], productCategoryName: name, parentCategoryName: parentName};
        }
      }
    }
  }
</script>
<style scoped>
  .input-width {
    width: 60%;
  }
</style>


