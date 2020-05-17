<template>
  <div class="detail-container">
    <el-card shadow="never">
      <span class="font-title-medium">退货商品</span>
      <el-table
        border
        class="standard-margin"
        ref="productTable"
        :data="productList">
        <el-table-column label="商品图片" width="160" align="center">
          <template slot-scope="scope">
            <img style="height:80px" :src="scope.row.pic[0].url">
          </template>
        </el-table-column>
        <el-table-column label="商品名称" align="center">
          <template slot-scope="scope">
            <span class="font-small">{{scope.row.name}}</span><br>
          </template>
        </el-table-column>
        <el-table-column label="价格/货号" width="180" align="center">
          <template slot-scope="scope">
            <span class="font-small">价格：￥{{scope.row.price}}</span><br>
          </template>
        </el-table-column>
        <el-table-column label="属性" width="180" align="center">
          <template slot-scope="scope">{{scope.row.skuData}}</template>
        </el-table-column>
        <el-table-column label="数量" width="100" align="center">
          <template slot-scope="scope">{{scope.row.num}}</template>
        </el-table-column>
        <el-table-column label="小计" width="100" align="center">
          <template slot-scope="scope">￥{{scope.row.price}}</template>
        </el-table-column>
      </el-table>
      <div style="float:right;margin-top:15px;margin-bottom:15px">
        <span class="font-title-medium">合计：</span>
        <span class="font-title-medium color-danger">￥{{order.totalAmount}}</span>
      </div>
    </el-card>
    <el-card shadow="never" class="standard-margin">
      <span class="font-title-medium">服务单信息</span>
      <div class="form-container-border">
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6">申请状态</el-col>
          <el-col class="form-border font-small" :span="18" style="color: red">{{orderReturnApply.status |
            formatStatus}}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="form-border form-left-bg font-small" style="height:50px;line-height:30px">订单编号
          </el-col>
          <el-col class="form-border font-small" :span="18" style="height:50px">
            {{orderReturnApply.orderSn}}
            <el-button type="text" size="small" @click="handleViewOrder">查看</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6">申请时间</el-col>
          <el-col class="form-border font-small" :span="18" style="height: 40px;line-height: 20px">
            {{orderReturnApply.createTime | formatTime}}
          </el-col>
        </el-row>
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6">用户账号</el-col>
          <el-col class="form-border font-small" :span="18" style="height: 40px;line-height: 20px">
            {{orderReturnApply.memberUsername}}
          </el-col>
        </el-row>
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6">联系人</el-col>
          <el-col class="form-border font-small" :span="18">{{receiveInfo.name}}</el-col>
        </el-row>
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6">联系电话</el-col>
          <el-col class="form-border font-small" :span="18" style="height: 40px;line-height: 20px">
            {{receiveInfo.telephoneNum}}
          </el-col>
        </el-row>
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6">退货原因</el-col>
          <el-col class="form-border font-small" :span="18" style="height: 40px;line-height: 20px">{{reasonTypeName}}
          </el-col>
        </el-row>
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6">问题描述</el-col>
          <el-col class="form-border font-small" :span="18" style="height: 40px;line-height: 20px">
            {{orderReturnApply.reasonDetail}}
          </el-col>
        </el-row>
      </div>
      <div class="form-container-border">
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6">订单金额</el-col>
          <el-col class="form-border font-small" :span="18">
            ￥{{order.totalAmount+order.freightAmount-order.discountAmount-order.promotionAmount}}
          </el-col>
        </el-row>
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6" style="height:52px;line-height:32px">确认退款金额
          </el-col>
          <el-col class="form-border font-small" style="height:52px" :span="18">
            ￥
            <el-input size="small" v-model="orderReturnApply.confirmApplyPrice"
                      :disabled="orderReturnApply.status === 0 ? false : true"
                      style="width:200px;margin-left: 10px"></el-input>
          </el-col>
        </el-row>
        <el-row v-if="orderReturnApply.status === 1 || orderReturnApply.status === 2">
          <el-col class="form-border form-left-bg font-small" :span="6">配送方式</el-col>
          <el-col class="form-border font-small" :span="18">{{orderReturnApply.deliveryCompany | companyFormat}}
          </el-col>
        </el-row>
        <el-row v-if="orderReturnApply.status === 1 || orderReturnApply.status === 2">
          <el-col class="form-border form-left-bg font-small" :span="6">物流编号</el-col>
          <el-col class="form-border font-small" :span="18" style="height: 40px;line-height: 20px">
            {{orderReturnApply.deliverySn === '' ? '暂未发货' : orderReturnApply.deliverySn}}
          </el-col>
        </el-row>
      </div>
      <div style="margin-top:15px;text-align: center" v-show="orderReturnApply.status===0">
        <el-button type="primary" size="small" @click="handleUpdateStatus(1)">确认退货</el-button>
        <el-button type="danger" size="small" @click="handleUpdateStatus(3)">拒绝退货</el-button>
      </div>
      <div style="margin-top:15px;text-align: center" v-show="orderReturnApply.status===1">
        <el-button type="primary" size="small" @click="handleUpdateStatus(2)">确认收货</el-button>
      </div>
    </el-card>
  </div>
</template>
<script>
  import {formatDate} from '@/utils/date';

  const defaultOrderReturnApply = {
    _id: null,
    orderSn: null,
    createTime: null,
    memberUsername: null,
    status: null,
    handleTime: null,
    reasonType: null,
    reasonDetail: null,
    confirmApplyPrice: null
  };
  export default {
    name: 'returnApplyDetail',
    data() {
      return {
        id: null,
        order: {},
        orderReturnApply: Object.assign({}, defaultOrderReturnApply),
        productList: [],
        receiveInfo: {},
        reasonTypeName: null
      }
    },
    created() {
      this.id = this.$route.query._id;
      this.getDetail();
    },
    filters: {
      formatStatus(status) {
        if (status === 0) {
          return "待处理";
        } else if (status === 1) {
          return "退货中";
        } else if (status === 2) {
          return "已完成";
        } else {
          return "已拒绝";
        }
      },
      formatTime(time) {
        if (time == null || time === '') {
          return 'N/A';
        }
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
      },
      companyFormat(val) {
        if (val === 0) {
          return '顺丰快递'
        } else if (val === 1) {
          return '百世快通'
        } else if (val === 2) {
          return '圆通快递'
        } else {
          return '中通快递'
        }
      }
    },
    methods: {
      handleViewOrder() {
        this.$router.push({path: '/oms/orderDetail', query: {orderSn: this.orderReturnApply.orderSn,member:this.orderReturnApply.memberUsername}});
      },
      getDetail() {
        this.$axios.get('/apply/getApplyById', {params: {_id: this.id}}).then(res => {
          if (res.status === 200 && res.data.err_code === 0) {
            this.orderReturnApply = res.data.list;
            this.getOrderDetail(this.orderReturnApply.orderSn);
            this.getReasonType();
          }
        })
      },
      getReasonType() {
        this.$axios.get('/returnReason/all', {params: {status: 1}}).then(res => {
          if (res.status === 200 && res.data.err_code === 0) {
            res.data.list.forEach(item => {
              if (item._id === this.orderReturnApply.reasonType) {
                this.reasonTypeName = item.name;
              }
            })
          }
        })
      },
      getOrderDetail(orderSn) {
        this.$axios.get('/order/getOne', {params: {orderSn: orderSn}}).then(res => {
          if (res.status === 200 && res.data.err_code === 0) {
            this.order = res.data.list[0];
            this.productList = [];
            this.order.productList.forEach(item => {
              this.getProductDetail(item.productId, item.skuCode, item.num);
            });
            this.getReceiveInfo(this.order.receiveId);
          }
        })
      },
      getProductDetail(id, skuCode, num) {
        this.$axios.post('/productDetail/getDetailById', {_id: id}).then(res => {
          if (res.status === 200 && res.data.err_code === 0) {
            var detail = res.data.productDetail;
            detail.skuStockList.forEach(item2 => {
              if (item2.skuCode === skuCode) {
                var sku = JSON.parse(item2.spData);
                detail.pic = item2.pic;
                detail.skuData = '';
                detail.price = item2.price;
                detail.num = num;
                sku.forEach(i => {
                  detail.skuData += i.value;
                })
              }
            });
            this.productList.push(detail);
          }
        })
      },
      getReceiveInfo(receiveId) {
        this.$axios.get('/address/findById', {params: {_id: receiveId}}).then(res => {
          if (res.status === 200 && res.data.err_code === 0) {
            this.receiveInfo = res.data.addressInfo;
          }
        })
      },
      handleUpdateStatus(status) {
        this.$confirm('是否要进行此操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (status === 1) {
            // 确认退货
            this.$axios.post('/apply/agree', {
              _id: this.id,
              price: this.orderReturnApply.confirmApplyPrice
            }).then(res => {
              if (res.data.err_code === 0 && res.status === 200) {
                this.$message({
                  type: 'success',
                  message: res.data.message
                });
                this.getDetail();
              }
            })
          } else if (status === 2) {
            // 确认收货
            this.$axios.get('/apply/confirm', {
              params:
                {
                  _id: this.id,
                  orderSn: this.orderReturnApply.orderSn
                }
            }).then(res => {
              if (res.data.err_code === 0 && res.status === 200) {
                this.$message({
                  type: 'success',
                  message: res.data.message
                });
                this.getDetail();
              }
            })
          } else {
            // 拒绝退货
            this.$axios.get('/apply/reject', {params: {_id: this.id}}).then(res => {
              if (res.data.err_code === 0 && res.status === 200) {
                this.$message({
                  type: 'success',
                  message: res.data.message
                });
                this.getDetail();
              }
            })
          }
        });
      }
    }
  }
</script>
<style scoped>
  .detail-container {
    position: absolute;
    left: 0;
    right: 0;
    width: 1080px;
    padding: 35px 35px 15px 35px;
    margin: 20px auto;
  }

  .standard-margin {
    margin-top: 15px;
  }

  .form-border {
    border-right: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
    padding: 10px;
  }

  .form-container-border {
    border-left: 1px solid #DCDFE6;
    border-top: 1px solid #DCDFE6;
    margin-top: 15px;
  }

  .form-left-bg {
    background: #F2F6FC;
  }
</style>


