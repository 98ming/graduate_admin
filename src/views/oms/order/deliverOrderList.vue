<template> 
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>发货列表</span>
    </el-card>
    <div class="table-container">
      <el-table ref="deliverOrderTable"
                style="width: 100%;"
                :data="receiveInfo" border>
        <el-table-column label="订单编号" width="120" align="center">
          <template slot-scope="scope">{{scope.row.orderSn}}</template>
        </el-table-column>
        <el-table-column label="收货人" width="120" align="center">
          <template slot-scope="scope">{{scope.row.address.name}}</template>
        </el-table-column>
        <el-table-column label="手机号码" width="120" align="center">
          <template slot-scope="scope">{{scope.row.address.telephoneNum}}</template>
        </el-table-column>
        <el-table-column label="邮政编码" width="120" align="center">
          <template slot-scope="scope">{{scope.row.address.email}}</template>
        </el-table-column>
        <el-table-column label="收货地址" align="center">
          <template slot-scope="scope">{{scope.row.address.detailInfo.province}}{{scope.row.address.detailInfo.city}}
            {{scope.row.address.detailInfo.area}}{{scope.row.address.detailAddress}}</template>
        </el-table-column>
        <el-table-column label="配送方式" width="160" align="center">
          <template slot-scope="scope">
            <el-select placeholder="请选择物流公司"
                       v-model="scope.row.deliveryCompany"
                       disabled=""
                       size="small">
              <el-option v-for="item in companyOptions"
                         :key="item.id"
                         :label="item.name"
                         :value="item.id">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="物流单号" width="180" align="center">
          <template slot-scope="scope">
            <el-input size="small" v-model="scope.row.deliverySn"></el-input>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 15px;text-align: center">
        <el-button @click="cancel">取消</el-button>
        <el-button @click="confirm" type="primary">确定</el-button>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'deliverOrderList',
    data() {
      return {
        orderSn:null,
        list:[],
        companyOptions:[
          {id:0,name:'顺丰快递'},
          {id:1,name:'百世快通'},
          {id:2,name:'圆通快递'},
          {id:3,name:'中通快递'},
        ],
        receiveInfo:[]
      }
    },
    created(){
      this.orderSn = JSON.parse(this.$route.query.orderSn);
      this.getList();
    },
    methods:{
      cancel(){
        this.$router.back();
      },
      getList(){
        this.orderSn.forEach((item,index)=>{
          this.$axios.get('/order/getOne',{params:{orderSn:item.orderSn}}).then(res=>{
            if (res.status === 200 && res.data.err_code === 0){
              var orderInfo = res.data.list[0];
              this.list.push(orderInfo);
              this.getReceiveInfo(orderInfo.receiveId,index);
            }
          })
        })
      },
      getReceiveInfo(receiveId,index) {
        this.$axios.get('/address/findById', {params: {_id: receiveId}}).then(res => {
          if (res.status === 200 && res.data.err_code === 0) {
            this.list[index].address = res.data.addressInfo
            if (index === this.list.length - 1){
              this.receiveInfo = this.list;
            }
          }
        })
      },
      confirm(){
        this.$confirm('是否要进行发货操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.receiveInfo.forEach((item,index)=>{
            if (item.deliverySn !== ''){
              this.$axios.post('/order/delivery',{orderSn:item.orderSn,deliverySn:item.deliverySn}).then(res=>{
                if (res.status === 200 && res.data.err_code === 0){
                  if (index === this.receiveInfo.length - 1){
                    this.$message({
                      message:'订单发货成功',
                      type:'success'
                    });
                    this.$router.push('/oms/order')
                  }
                }
              })
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消发货'
          });
        });
      }
    }
  }
</script>
<style></style>


