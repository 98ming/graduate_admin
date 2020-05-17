<template>
  <div style="margin-top: 50px">
    <el-form :model="value" ref="productSaleForm" label-width="120px" style="width: 600px" size="small">
      <el-form-item label="推荐首页：">
        <el-switch
          v-model="value.indexStatus"
          :active-value="1"
          :inactive-value="0">
        </el-switch>
      </el-form-item>
      <el-form-item label="商品上架：">
        <el-switch
          v-model="value.publishStatus"
          :active-value="1"
          :inactive-value="0">
        </el-switch>
      </el-form-item>
      <el-form-item label="商品推荐：">
        <span style="margin-right: 10px">新品</span>
        <el-switch
          v-model="value.newStatus"
          :active-value="1"
          :inactive-value="0">
        </el-switch>
        <span style="margin-left: 10px;margin-right: 10px">推荐</span>
        <el-switch
          v-model="value.recommandStatus"
          :active-value="1"
          :inactive-value="0">
        </el-switch>
      </el-form-item>
      <el-form-item label="服务保证：">
        <el-checkbox-group v-model="selectServiceList">
          <el-checkbox :label="1">无忧退货</el-checkbox>
          <el-checkbox :label="2">快速退款</el-checkbox>
          <el-checkbox :label="3">免费包邮</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="详细页标题：">
        <el-input v-model="value.detailTitle"></el-input>
      </el-form-item>
      <el-form-item label="详细页描述：">
        <el-input v-model="value.detailDesc"></el-input>
      </el-form-item>
      <el-form-item label="选择优惠方式：">
        <el-radio-group v-model="value.promotionType" size="small">
          <el-radio-button :label="0">无优惠</el-radio-button>
          <el-radio-button :label="1">特惠促销</el-radio-button>
          <el-radio-button :label="2">满减价格</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-show="value.promotionType===1">
        <div>
          开始时间：
          <el-date-picker
            v-model="value.promotionStartTime"
            value-format="timestamp"
            type="datetime"
            :picker-options="pickerOptions1"
            placeholder="选择开始时间">
          </el-date-picker>
        </div>
        <div class="littleMargin">
          结束时间：
          <el-date-picker
            v-model="value.promotionEndTime"
            value-format="timestamp"
            type="datetime"
            :picker-options="pickerOptions1"
            placeholder="选择结束时间">
          </el-date-picker>
        </div>
        <div class="littleMargin">
          促销价格：
          <el-input style="width: 220px" v-model="value.promotionPrice" placeholder="输入促销价格"></el-input>
        </div>

      </el-form-item>
      <el-form-item v-show="value.promotionType===2">
        <el-table :data="value.productFullReductionList"
                  style="width: 80%" border>
          <el-table-column
            label="满"
            align="center"
            width="120">
            <template slot-scope="scope">
              <el-input v-model="scope.row.fullPrice"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            label="立减"
            align="center"
            width="120">
            <template slot-scope="scope">
              <el-input v-model="scope.row.reducePrice"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="handleRemoveFullReduction(scope.$index, scope.row)">删除</el-button>
              <el-button type="text" @click="handleAddFullReduction(scope.$index, scope.row)">添加</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item style="text-align: center">
        <el-button size="medium" @click="handlePrev">上一步，填写商品信息</el-button>
        <el-button type="primary" size="medium" @click="handleNext">下一步，填写商品属性</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

  export default {
    name: "ProductSaleDetail",
    props: {
      value: Object,
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        //日期选择器配置
        pickerOptions1: {
          disabledDate(time) {
            return time.getTime() < Date.now();
          }
        }
      }
    },
    created() {

    },
    computed: {
      //选中的服务保证
      selectServiceList: {
        get() {
          let list = [];
          if (this.value.serviceIds === undefined || this.value.serviceIds == null || this.value.serviceIds === '') return list;
          let ids = this.value.serviceIds.split(',');
          for (let i = 0; i < ids.length; i++) {
            list.push(Number(ids[i]));
          }
          return list;
        },
        set(newValue) {
          let serviceIds = '';
          if (newValue != null && newValue.length > 0) {
            for (let i = 0; i < newValue.length; i++) {
              serviceIds += newValue[i] + ',';
            }
            if (serviceIds.endsWith(',')) {
              serviceIds = serviceIds.substr(0, serviceIds.length - 1)
            }
            this.value.serviceIds = serviceIds;
          } else {
            this.value.serviceIds = null;
          }
        }
      }
    },
    methods: {
      handleEditCreated() {
        let ids = this.value.serviceIds.split(',');
        console.log('handleEditCreated', ids);
        for (let i = 0; i < ids.length; i++) {
          this.selectServiceList.push(Number(ids[i]));
        }
      },
      handleRemoveFullReduction(index, row) {
        let fullReductionList = this.value.productFullReductionList;
        if (fullReductionList.length === 1) {
          fullReductionList.pop();
          fullReductionList.push({
            fullPrice: 0,
            reducePrice: 0
          });
        } else {
          fullReductionList.splice(index, 1);
        }
      },
      handleAddFullReduction(index, row) {
        let fullReductionList = this.value.productFullReductionList;
        if (fullReductionList.length < 3) {
          fullReductionList.push({
            fullPrice: 0,
            reducePrice: 0
          });
        } else {
          this.$message({
            message: '最多只能添加三条',
            type: 'warning'
          });
        }
      },
      handlePrev() {
        this.$emit('prevStep')
      },
      handleNext() {
        if (this.value.promotionType === 1){
          if (this.value.promotionStartTime === '' || this.value.promotionEndTime === '' || this.value.promotionPrice === ''
               || this.value.promotionStartTime === null || this.value.promotionEndTime === null || this.value.promotionPrice === null){
            this.$message({
              type:'warning',
              message:'请填写商品促销时间及价格'
            });
            return;
          }
        }
        else if (this.value.promotionType === 2 && this.value.productFullReductionList.length === 0){
          this.$message({
            type:'warning',
            message:'请填写满减价格表'
          });
          return;
        }
        this.$emit('nextStep')
      }
    }
  }
</script>

<style scoped>
  .littleMargin {
    margin-top: 10px;
  }
</style>
