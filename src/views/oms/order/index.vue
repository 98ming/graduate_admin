<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button
          style="float:right"
          type="primary"
          @click="handleSearchList()"
          size="small">
          查询搜索
        </el-button>
        <el-button
          style="float:right;margin-right: 15px"
          @click="handleResetSearch()"
          size="small">
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="输入搜索：">
            <el-input v-model="listQuery.orderSn" class="input-width" placeholder="订单编号"></el-input>
          </el-form-item>
          <el-form-item label="收货人：">
            <el-input v-model="listQuery.receiverKeyword" class="input-width" placeholder="收货人姓名/手机号码"></el-input>
          </el-form-item>
          <br>
          <el-form-item label="提交时间：">
            <el-date-picker
              class="input-width"
              v-model="listQuery.createTime"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="请选择时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="订单状态：">
            <el-select v-model="listQuery.status" class="input-width" placeholder="全部" clearable>
              <el-option v-for="item in statusOptions"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
    </el-card>
    <div class="table-container">
      <el-table ref="orderTable"
                :data="list"
                style="width: 100%;"
                @selection-change="handleSelectionChange"
                v-loading="listLoading" border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="订单编号" width="120" align="center">
          <template slot-scope="scope">{{scope.row.orderSn}}</template>
        </el-table-column>
        <el-table-column label="提交时间" width="180" align="center">
          <template slot-scope="scope">{{scope.row.createTime | formatCreateTime}}</template>
        </el-table-column>
        <el-table-column label="用户账号" align="center" width="180">
          <template slot-scope="scope">{{scope.row.memberUsername}}</template>
        </el-table-column>
        <el-table-column label="订单金额" width="120" align="center">
          <template slot-scope="scope">￥{{scope.row.totalAmount}}</template>
        </el-table-column>
        <el-table-column label="支付方式" width="120" align="center">
          <template slot-scope="scope">{{scope.row.payType | formatPayType}}</template>
        </el-table-column>
        <el-table-column label="订单状态" width="120" align="center">
          <template slot-scope="scope">{{scope.row.status | formatStatus}}</template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleViewOrder(scope.$index, scope.row)"
            >查看订单</el-button>
            <el-button
              size="mini"
              @click="handleCloseOrder(scope.$index, scope.row)"
              v-show="scope.row.status===0">关闭订单</el-button>
            <el-button
              size="mini"
              @click="handleDeliveryOrder(scope.$index, scope.row)"
              v-show="scope.row.status===1">订单发货</el-button>
            <el-button
              size="mini"
              @click="handleViewLogistics(scope.$index, scope.row)"
              v-show="scope.row.status===2||scope.row.status===3">订单跟踪</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDeleteOrder(scope.$index, scope.row)"
              v-show="scope.row.status===4">删除订单</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="batch-operate-container">
      <el-select
        size="small"
        v-model="operateType" placeholder="批量操作">
        <el-option
          v-for="item in operateOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button
        style="margin-left: 20px"
        class="search-button"
        @click="handleBatchOperate()"
        type="primary"
        size="small">
        确定
      </el-button>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :current-page.sync="listQuery.pageNum"
        :page-size="listQuery.pageSize"
        :page-sizes="[5,10,15]"
        :total="total">
      </el-pagination>
    </div>
    <logistics-dialog v-model="logisticsDialogVisible"></logistics-dialog>
  </div>
</template>
<script>
  import {formatDate} from '@/utils/date';
  import LogisticsDialog from '@/views/oms/order/components/logisticsDialog';
  const defaultListQuery = {
    pageNum: 1,
    pageSize: 10,
    orderSn: null,
    receiverKeyword: null,
    status: null,
    createTime: null,
  };
  export default {
    name: "orderList",
    components:{LogisticsDialog},
    data() {
      return {
        listQuery: Object.assign({}, defaultListQuery),
        listLoading: true,
        list: null,
        total: null,
        operateType: null,
        multipleSelection: [],
        statusOptions: [
          {
            label: '待付款',
            value: 0
          },
          {
            label: '待发货',
            value: 1
          },
          {
            label: '已发货',
            value: 2
          },
          {
            label: '已完成',
            value: 3
          },
          {
            label: '已关闭',
            value: 4
          }
        ],
        operateOptions: [
          {
            label: "批量发货",
            value: 1
          },
          {
            label: "关闭订单",
            value: 2
          },
          {
            label: "删除订单",
            value: 3
          }
        ],
        logisticsDialogVisible:false
      }
    },
    created() {
      this.getList();
    },
    filters: {
      formatCreateTime(time) {
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
      },
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
          return '无效订单';
        }
      },
    },
    methods: {
      handleResetSearch() {
        this.listQuery = Object.assign({}, defaultListQuery);
      },
      handleSearchList() {
        this.listQuery.pageNum = 1;
        this.getList();
      },
      handleSelectionChange(val){
        this.multipleSelection = val;
      },
      handleViewOrder(index, row){
        this.$router.push({path:'/oms/orderDetail',query:{orderSn:row.orderSn,member:row.memberUsername}})
      },
      handleCloseOrder(index, row){
        this.$confirm('是否要关闭该订单?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios.get('/order/closeOrder',{params:{orderSn:row.orderSn}}).then(res=>{
            if (res.status === 200 && res.data.err_code === 0){
              this.$message({
                message:res.data.message,
                type:'success'
              });
              this.getList();
            }
          })
        })
      },
      handleDeliveryOrder(index, row){
        var orderSn = [];
        orderSn.push({orderSn:row.orderSn});
        this.$router.push({path:'/oms/deliverOrderList',query:{orderSn:JSON.stringify(orderSn)}})
      },
      handleViewLogistics(index, row){
        this.logisticsDialogVisible=true;
      },
      handleDeleteOrder(index, row){
        this.$confirm('是否要进行该删除操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios.get('/order/remove',{params:{orderSn:row.orderSn}}).then(res=>{
            if (res.status === 200 && res.data.err_code === 0){
              this.$message({
                message:res.data.message,
                type:'success'
              });
              this.getList();
            }
          })
        })
      },
      handleBatchOperate(){
        if(this.multipleSelection==null||this.multipleSelection.length<1){
          this.$message({
            message: '请选择要操作的订单',
            type: 'warning',
            duration: 1000
          });
          return;
        }
        if(this.operateType===1){
          //批量发货

        }else if(this.operateType===2){
          //关闭订单

        }else if(this.operateType===3){
          //删除订单

        }
      },
      handleSizeChange(val){
        this.listQuery.pageNum = 1;
        this.listQuery.pageSize = val;
        this.getList();
      },
      handleCurrentChange(val){
        this.listQuery.pageNum = val;
        this.getList();
      },
      getList() {
        this.list = [];
        this.$axios.get('/order/adminGetAll',{params:this.listQuery}).then(res=>{
          if (res.status === 200 && res.data.err_code === 0){
            this.total = res.data.total;
            this.listLoading = false;
            var length = res.data.list.length - 1;
            if (res.data.list.length === 0){
              this.list = [];
            }
            res.data.list.forEach((item,index)=>{
              this.$axios.get('/users/find',{params:{_id:item.userId}}).then(res2=>{
                if (res2.data.err_code === 0 && res2.status === 200){
                  item.memberUsername = res2.data.user.email;
                  this.list.push(item);
                }
              })
            })
          }
        })
      },
    }
  }
</script>
<style scoped>
  .input-width {
    width: 203px;
  }
</style>


