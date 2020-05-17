<template> 
  <div class="detail-container">
    <div v-if="order.status !== -1">
      <el-steps :active="formatStepStatus(order.status)" finish-status="success" align-center>
        <el-step title="提交订单" :description="formatTime(order.createTime)"></el-step>
        <el-step title="支付订单" :description="formatTime(order.paymentTime)"></el-step>
        <el-step title="平台发货" :description="formatTime(order.deliveryTime)"></el-step>
        <el-step title="确认收货" :description="formatTime(order.receiveTime)"></el-step>
        <el-step title="完成评价" :description="formatTime(order.commentTime)"></el-step>
      </el-steps>
    </div>
    <el-card shadow="never" style="margin-top: 15px">
      <div class="operate-container">
        <i class="el-icon-warning color-danger" style="margin-left: 20px"></i>
        <span class="color-danger">当前订单状态：{{order.status | formatStatus}}</span>
        <div class="operate-button-container" v-show="order.status===0">
          <el-button size="mini" @click="showUpdateReceiverDialog">修改收货人信息</el-button>
          <el-button size="mini" @click="showUpdateMoneyDialog">修改费用信息</el-button>
          <el-button size="mini" @click="handleCloseOrder">关闭订单</el-button>
          <el-button size="mini" @click="showMarkOrderDialog">备注订单</el-button>
        </div>
        <div class="operate-button-container" v-show="order.status===1">
          <el-button size="mini" @click="showUpdateReceiverDialog">修改收货人信息</el-button>
          <el-button size="mini" @click="showMarkOrderDialog">备注订单</el-button>
        </div>
        <div class="operate-button-container" v-show="order.status===2||order.status===3">
          <el-button size="mini" @click="showLogisticsDialog">订单跟踪</el-button>
          <el-button size="mini" @click="showMarkOrderDialog">备注订单</el-button>
        </div>
        <div class="operate-button-container" v-show="order.status===4">
          <el-button size="mini" @click="handleDeleteOrder">删除订单</el-button>
          <el-button size="mini" @click="showMarkOrderDialog">备注订单</el-button>
        </div>
      </div>
      <div style="margin-top: 20px">
        <svg-icon icon-class="marker" style="color: #606266"></svg-icon>
        <span class="font-small">基本信息</span>
      </div>
      <div class="table-layout">
        <el-row>
          <el-col :span="6" class="table-cell-title">订单编号</el-col>
          <el-col :span="6" class="table-cell-title">发货单流水号</el-col>
          <el-col :span="6" class="table-cell-title">用户账号</el-col>
          <el-col :span="6" class="table-cell-title">支付方式</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell">{{order.orderSn}}</el-col>
          <el-col :span="6" class="table-cell">暂无</el-col>
          <el-col :span="6" class="table-cell">{{$route.query.member}}</el-col>
          <el-col :span="6" class="table-cell">{{order.payType | formatPayType}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell-title">配送方式</el-col>
          <el-col :span="6" class="table-cell-title">物流单号</el-col>
          <el-col :span="6" class="table-cell-title">自动确认收货时间</el-col>
          <el-col :span="6" class="table-cell-title">活动信息</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell">{{order.deliveryCompany | formatDelivery}}</el-col>
          <el-col :span="6" class="table-cell">{{order.deliverySn ? order.deliverySn : '暂无'}}</el-col>
          <el-col :span="6" class="table-cell">{{order.autoConfirmDay}}天</el-col>
          <el-col :span="6" class="table-cell">暂无</el-col>
        </el-row>
      </div>
      <div style="margin-top: 20px">
        <svg-icon icon-class="marker" style="color: #606266"></svg-icon>
        <span class="font-small">收货人信息</span>
      </div>
      <div class="table-layout">
        <el-row>
          <el-col :span="4" class="table-cell-title">收货人</el-col>
          <el-col :span="4" class="table-cell-title">手机号码</el-col>
          <el-col :span="4" class="table-cell-title">邮政编码</el-col>
          <el-col :span="12" class="table-cell-title">收货地址</el-col>
        </el-row>
        <el-row>
          <el-col :span="4" class="table-cell">{{receiveInfo.name}}</el-col>
          <el-col :span="4" class="table-cell">{{receiveInfo.telephoneNum}}</el-col>
          <el-col :span="4" class="table-cell">{{receiveInfo.email}}</el-col>
          <el-col :span="12" class="table-cell">{{receiveInfo.detailInfo.province}} {{receiveInfo.detailInfo.city}}
            {{receiveInfo.detailInfo.area}} {{receiveInfo.detailAddress}}</el-col>
        </el-row>
      </div>
      <div style="margin-top: 20px">
        <svg-icon icon-class="marker" style="color: #606266"></svg-icon>
        <span class="font-small">商品信息</span>
      </div>
      <el-table
        ref="orderItemTable"
        :data="productDetail"
        style="width: 100%;margin-top: 20px" border>
        <el-table-column label="商品图片" width="120" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.pic[0].url" style="height: 80px">
          </template>
        </el-table-column>
        <el-table-column label="商品名称" align="center">
          <template slot-scope="scope">
            <p>{{scope.row.name}}</p>
          </template>
        </el-table-column>
        <el-table-column label="价格/货号" width="180" align="center">
          <template slot-scope="scope">
            <p>价格：￥{{scope.row.price}}</p>
            <p>货号：{{scope.row.productSn}}</p>
          </template>
        </el-table-column>
        <el-table-column label="属性" width="120" align="center">
          <template slot-scope="scope">
            {{scope.row.skuData}}
          </template>
        </el-table-column>
        <el-table-column label="数量" width="120" align="center">
          <template slot-scope="scope">
            {{scope.row.num}}
          </template>
        </el-table-column>
        <el-table-column label="小计" width="120" align="center">
          <template slot-scope="scope">
            ￥{{scope.row.price*scope.row.num}}
          </template>
        </el-table-column>
      </el-table>
      <div style="float: right;margin: 20px">
        合计：<span class="color-danger">￥{{order.totalAmount}}</span>
      </div>
      <div style="margin-top: 60px">
        <svg-icon icon-class="marker" style="color: #606266"></svg-icon>
        <span class="font-small">费用信息</span>
      </div>
      <div class="table-layout">
        <el-row>
          <el-col :span="8" class="table-cell-title">商品合计</el-col>
          <el-col :span="8" class="table-cell-title">运费</el-col>
          <el-col :span="8" class="table-cell-title">优惠券</el-col>
        </el-row>
        <el-row>
          <el-col :span="8" class="table-cell">￥{{order.totalAmount}}</el-col>
          <el-col :span="8" class="table-cell">￥{{order.freightAmount}}</el-col>
          <el-col :span="8" class="table-cell">-￥{{order.promotionAmount}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="8" class="table-cell-title">活动优惠</el-col>
          <el-col :span="8" class="table-cell-title">折扣金额</el-col>
          <el-col :span="8" class="table-cell-title">订单总金额</el-col>
        </el-row>
        <el-row>
          <el-col :span="8" class="table-cell">-￥0</el-col>
          <el-col :span="8" class="table-cell">-￥{{order.discountAmount}}</el-col>
          <el-col :span="8" class="table-cell">
            <span class="color-danger">￥{{(order.totalAmount+order.freightAmount-order.promotionAmount-order.discountAmount) > 0 ? (order.totalAmount+order.freightAmount-order.promotionAmount-order.discountAmount).toFixed(2) : '0.00'}}</span>
          </el-col>
        </el-row>
      </div>
      <div style="margin-top: 20px">
        <svg-icon icon-class="marker" style="color: #606266"></svg-icon>
        <span class="font-small">操作信息</span>
      </div>
      <el-table style="margin-top: 20px;width: 100%"
                ref="orderHistoryTable"
                :data="order.historyList" border>
        <el-table-column label="操作者"  width="120" align="center">
          <template slot-scope="scope">
            管理员
          </template>
        </el-table-column>
        <el-table-column label="操作时间"  width="160" align="center">
          <template slot-scope="scope">
            {{formatTime(scope.row.createTime)}}
          </template>
        </el-table-column>
        <el-table-column label="订单状态"  width="120" align="center">
          <template slot-scope="scope">
            {{scope.row.orderStatus | formatStatus}}
          </template>
        </el-table-column>
        <el-table-column label="付款状态"  width="120" align="center">
          <template slot-scope="scope">
            {{scope.row.orderStatus | formatPayStatus}}
          </template>
        </el-table-column>
        <el-table-column label="发货状态"  width="120" align="center">
          <template slot-scope="scope">
            {{scope.row.orderStatus | formatDeliverStatus}}
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center">
          <template slot-scope="scope">
            {{scope.row.note}}
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog title="修改收货人信息"
               :visible.sync="receiverDialogVisible"
               width="40%">
      <el-form :model="receiveInfo"
               ref="receiverInfoForm"
               label-width="150px">
        <el-form-item label="收货人姓名：">
          <el-input v-model="receiveInfo.name" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="手机号码：">
          <el-input v-model="receiveInfo.telephoneNum" style="width: 200px">
          </el-input>
        </el-form-item>
        <el-form-item label="邮政编码：">
          <el-input v-model="receiveInfo.email" style="width: 200px">
          </el-input>
        </el-form-item>
        <el-form-item label="所在区域：">
          <v-distpicker :province="receiveInfo.detailInfo.province"
                        :city="receiveInfo.detailInfo.city"
                        :area="receiveInfo.detailInfo.area"
                        @selected="onSelectRegion"></v-distpicker>
        </el-form-item>
        <el-form-item label="详细地址：">
          <el-input v-model="receiveInfo.detailAddress" type="textarea" rows="3">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
      <el-button @click="receiverDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleUpdateReceiverInfo">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="修改费用信息"
               :visible.sync="moneyDialogVisible"
               width="40%">
      <div class="table-layout">
        <el-row>
          <el-col :span="8" class="table-cell-title">商品合计</el-col>
          <el-col :span="8" class="table-cell-title">运费</el-col>
          <el-col :span="8" class="table-cell-title">优惠券</el-col>
        </el-row>
        <el-row>
          <el-col :span="8" class="table-cell">￥{{order.totalAmount}}</el-col>
          <el-col :span="8" class="table-cell">
            <el-input v-model.number="moneyInfo.freightAmount" size="mini"><template slot="prepend">￥</template></el-input>
          </el-col>
          <el-col :span="8" class="table-cell">-￥{{order.couponAmount}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="8" class="table-cell-title">活动优惠</el-col>
          <el-col :span="8" class="table-cell-title">折扣金额</el-col>
          <el-col :span="8" class="table-cell-title">订单总金额</el-col>
        </el-row>
        <el-row>
          <el-col :span="8" class="table-cell">-￥{{order.promotionAmount}}</el-col>
          <el-col :span="8" class="table-cell">
            <el-input v-model.number="moneyInfo.discountAmount" size="mini"><template slot="prepend">-￥</template></el-input>
          </el-col>
          <el-col :span="8" class="table-cell">
            <span class="color-danger">￥{{order.totalAmount+moneyInfo.freightAmount-moneyInfo.discountAmount-order.promotionAmount}}</span>
          </el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
      <el-button @click="moneyDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleUpdateMoneyInfo">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="备注订单"
               :visible.sync="markOrderDialogVisible"
               width="40%">
      <el-form :model="markInfo"
               label-width="150px">
        <el-form-item label="操作备注：">
          <el-input v-model="markInfo.note" type="textarea" rows="3">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="markOrderDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleMarkOrder">确 定</el-button>
      </span>
    </el-dialog>
    <logistics-dialog v-model="logisticsDialogVisible"></logistics-dialog>
  </div>
</template>
<script>
  import LogisticsDialog from '@/views/oms/order/components/logisticsDialog';
  import {formatDate} from '@/utils/date';
  import VDistpicker from 'v-distpicker';
  export default {
    name: 'orderDetail',
    components: { VDistpicker, LogisticsDialog},
    data() {
      return {
        id: null,
        order: {},
        productDetail: [],
        receiveInfo: {
          detailInfo:{
            province:null,
            city:null,
            area:null
          }
        },
        receiverDialogVisible:false,
        moneyDialogVisible:false,
        moneyInfo:{ freightAmount:0, discountAmount:0},
        markOrderDialogVisible:false,
        markInfo:{note:null},
        logisticsDialogVisible:false
      }
    },
    created() {
      this.getOrderDetail();
    },
    filters: {
      formatPayType(value) {
        if (value === 0) {
          return '支付宝';
        } else if (value === 1) {
          return '微信';
        } else if (value === 2) {
          return '银联支付';
        }
        else{
          return '货到付款'
        }
      },
      formatStatus(value) {
        if (value === 0) {
          return '待付款';
        } else if (value === 1) {
          return '待发货';
        } else if (value === 2) {
          return '已发货';
        } else if (value === 3) {
          return '已完成';
        } else if (value === 4) {
          return '已关闭';
        } else {
          return '退换中';
        }
      },
      formatDelivery(value){
        if (value === 0) {
          return '顺丰快递';
        } else if (value === 1) {
          return '百世快递';
        } else if (value === 2) {
          return '圆通快递';
        }
        else{
          return '中通快递'
        }
      },
      formatPayStatus(value) {
        if (value === 0) {
          return '未支付';
        } else if(value===4){
          return '已退款';
        }else{
          return '已支付';
        }
      },
      formatDeliverStatus(value) {
        if (value === 0||value === 1) {
          return '未发货';
        } else {
          return '已发货';
        }
      }
    },
    methods: {
      getOrderDetail(){
        this.$axios.get('/order/getOne',{params:{orderSn:this.$route.query.orderSn}}).then(res=>{
          if (res.status === 200 && res.data.err_code === 0){
            this.order = res.data.list[0];
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
            this.productDetail.push(detail);
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
      onSelectRegion(data){
        this.receiveInfo.detailInfo.province=data.province.value;
        this.receiveInfo.detailInfo.city=data.city.value;
        this.receiveInfo.detailInfo.area=data.area.value;
      },
      formatTime(time) {
        if (time == null || time === '') {
          return '';
        }
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
      },
      formatStepStatus(value) {
        if (value === 1) {
          //待发货
          return 2;
        } else if (value === 2) {
          //已发货
          return 3;
        } else if (value === 3) {
          //已完成
          if (this.order.commentTime !== '' && this.order.commentTime !== undefined){
            return 5;
          }
          else{
            return 4;
          }
        }else {
          //待付款、已关闭、无限订单
          return 1;
        }
      },
      showUpdateReceiverDialog(){
        this.receiverDialogVisible=true;
      },
      handleUpdateReceiverInfo(){
        this.$confirm('是否要修改收货信息?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios.post('/address/update', this.receiveInfo).then(res => {
            if (res.status === 200 && res.data.err_code === 0) {
              this.getReceiveInfo(this.receiveInfo._id);
              this.receiverDialogVisible=false;
              this.$message({
                message: res.data.message,
                type: 'success'
              })
            }
          });
        });
      },
      showUpdateMoneyDialog(){
        this.moneyDialogVisible=true;
        this.moneyInfo.freightAmount=this.order.freightAmount;
        this.moneyInfo.discountAmount=this.order.discountAmount;
      },
      handleUpdateMoneyInfo(){
        this.$confirm('是否要修改费用信息?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios.post('/order/updateMoney',{_id:this.order._id,moneyInfo:this.moneyInfo}).then(res=>{
            if (res.status === 200 && res.data.err_code === 0){
              this.$message({
                message:res.data.message,
                type:'success'
              });
              this.moneyDialogVisible=false;
              this.getOrderDetail();
            }
          })
        });
      },
      handleCloseOrder(){
        this.$confirm('是否要关闭?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios.get('/order/closeOrder',{params:{orderSn:this.order.orderSn}}).then(res=>{
            if (res.status === 200 && res.data.err_code === 0){
              this.$message({
                message:res.data.message,
                type:'success'
              });
              this.getOrderDetail();
            }
          })
        });
      },
      showMarkOrderDialog(){
        this.markOrderDialogVisible=true;
        this.markInfo.note = null;
      },
      handleMarkOrder(){
        this.$confirm('是否要备注订单?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var noteInfo = {};
          noteInfo.note = this.markInfo.note;
          noteInfo.createTime = new Date();
          noteInfo.orderStatus = this.order.status;
          this.$axios.post('/order/addHistory',{orderSn:this.order.orderSn,history:noteInfo}).then(res=>{
            if (res.status === 200 && res.data.err_code === 0){
              this.markOrderDialogVisible=false;
              this.$message({
                message:res.data.message,
                type:'success'
              });
              this.getOrderDetail();
            }
          })
        });
      },
      handleDeleteOrder(){
        this.$confirm('是否要进行该删除操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios.get('/order/remove',{params:{orderSn:this.order.orderSn}}).then(res=>{
            if (res.status === 200 && res.data.err_code === 0){
              this.$message({
                message:res.data.message,
                type:'success'
              });
              this.$router.push('/oms/order');
            }
          })
        })
      },
      showLogisticsDialog(){
        this.logisticsDialogVisible=true;
      }
    }
  }
</script>
<style scoped>
  .detail-container {
    width: 80%;
    padding: 20px 20px 20px 20px;
    margin: 20px auto;
  }

  .operate-container {
    background: #F2F6FC;
    height: 80px;
    margin: -20px -20px 0;
    line-height: 80px;
  }

  .operate-button-container {
    float: right;
    margin-right: 20px
  }

  .table-layout {
    margin-top: 20px;
    border-left: 1px solid #DCDFE6;
    border-top: 1px solid #DCDFE6;
  }

  .table-cell {
    height: 60px;
    line-height: 40px;
    border-right: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
    padding: 10px;
    font-size: 14px;
    color: #606266;
    text-align: center;
    overflow: hidden;
  }

  .table-cell-title {
    border-right: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
    padding: 10px;
    background: #F2F6FC;
    text-align: center;
    font-size: 14px;
    color: #303133;
  }
</style>


