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
          <el-form-item label="商品名称：">
            <el-input v-model.trim="listQuery.name" class="input-width" placeholder="商品名称"></el-input>
          </el-form-item>
          <el-form-item label="推荐状态：">
            <el-select v-model="listQuery.newStatus" placeholder="全部" clearable class="input-width">
              <el-option v-for="item in recommendOptions"
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
      <el-button size="mini" class="btn-add" @click="handleSelectProduct()">选择商品</el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="newProductTable"
                :data="list"
                style="width: 100%;"
                @selection-change="handleSelectionChange"
                v-loading="listLoading" border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="商品图片" width="120" align="center">
          <template slot-scope="scope"><img style="height: 80px" :src="scope.row.pic[0].url"></template>
        </el-table-column>
        <el-table-column label="商品名称" align="center">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column label="是否推荐" width="200" align="center">
          <template slot-scope="scope">
            <el-switch
              @change="handleRecommendStatusStatusChange(scope.$index, scope.row)"
              :active-value="1"
              :inactive-value="0"
              v-model="scope.row.newStatus">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="160" align="center">
          <template slot-scope="scope">{{scope.row.newStatus | formatRecommendStatus}}</template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button size="mini"
                       type="text"
                       @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="batch-operate-container">
      <el-select
        size="small"
        v-model="operateType" placeholder="批量操作">
        <el-option
          v-for="item in operates"
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
        :page-size="listQuery.pageSize"
        :page-sizes="[5,10,15]"
        :current-page.sync="listQuery.pageNum"
        :total="total">
      </el-pagination>
    </div>
    <el-dialog title="选择商品" :visible.sync="selectDialogVisible" width="50%">
      <el-input v-model.trim="dialogData.listQuery.name"
                style="width: 250px;margin-bottom: 20px"
                size="small"
                placeholder="商品名称搜索">
        <el-button slot="append" icon="el-icon-search" @click="handleSelectSearch()"></el-button>
      </el-input>
      <el-table :data="dialogData.list"
                @selection-change="handleDialogSelectionChange" border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="商品名称" align="center">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column label="货号" width="160" align="center">
          <template slot-scope="scope">NO.{{scope.row.productSn}}</template>
        </el-table-column>
        <el-table-column label="价格" width="120" align="center">
          <template slot-scope="scope">￥{{scope.row.price}}</template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination
          background
          @size-change="handleDialogSizeChange"
          @current-change="handleDialogCurrentChange"
          layout="prev, pager, next"
          :current-page.sync="dialogData.listQuery.pageNum"
          :page-size="dialogData.listQuery.pageSize"
          :page-sizes="[5,10,15]"
          :total="dialogData.total">
        </el-pagination>
      </div>
      <div style="clear: both;"></div>
      <div slot="footer">
        <el-button  size="small" @click="selectDialogVisible = false">取 消</el-button>
        <el-button  size="small" type="primary" @click="handleSelectDialogConfirm()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>

  const defaultListQuery = {
    pageNum: 1,
    pageSize: 5,
    name: null,
    newStatus: 1
  };
  const defaultRecommendOptions = [
    {
      label: '未推荐',
      value: 0
    },
    {
      label: '推荐中',
      value: 1
    }
  ];
  export default {
    name: 'newProductList',
    data() {
      return {
        listQuery: Object.assign({}, defaultListQuery),
        recommendOptions: Object.assign({}, defaultRecommendOptions),
        list: null,
        total: null,
        listLoading: false,
        multipleSelection: [],
        operates: [
          {
            label: "设为推荐",
            value: 0
          },
          {
            label: "取消推荐",
            value: 1
          },
          {
            label: "删除",
            value: 2
          }
        ],
        operateType: null,
        selectDialogVisible:false,
        dialogData:{
          list: null,
          total: null,
          multipleSelection:[],
          listQuery:{
            name: null,
            pageNum: 1,
            pageSize: 5,
            newStatus:0
          }
        }
      }
    },
    created() {
      this.getList();
    },
    filters:{
      formatRecommendStatus(status){
        if(status===1){
          return '推荐中';
        }else{
          return '未推荐';
        }
      }
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
      handleSizeChange(val) {
        this.listQuery.pageNum = 1;
        this.listQuery.pageSize = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.pageNum = val;
        this.getList();
      },
      handleRecommendStatusStatusChange(index,row){
        this.updateRecommendStatusStatus(row._id,row.newStatus);
      },
      handleDelete(index,row){
        this.deleteProduct(row._id);
      },
      handleBatchOperate(){
        if (this.multipleSelection < 1) {
          this.$message({
            message: '请选择一条记录',
            type: 'warning',
            duration: 1000
          });
          return;
        }
        let ids = [];
        for (let i = 0; i < this.multipleSelection.length; i++) {
          ids.push(this.multipleSelection[i]._id);
        }
        if (this.operateType === 0) {
          //设为推荐
          ids.forEach((item,index)=>{
            this.$axios.post('/productDetail/update',{_id:item,newStatus:1}).then(res=>{
              if (res.status === 200 && res.data.err_code === 0){
                if (index === ids.length - 1){
                  this.getList();
                  this.$message({
                    message:'所选商品全部推荐成功',
                    type:'success'
                  });
                }
              }
            })
          })
        } else if (this.operateType === 1) {
          //取消推荐
          ids.forEach((item,index)=>{
            this.$axios.post('/productDetail/update',{_id:item,newStatus:0}).then(res=>{
              if (res.status === 200 && res.data.err_code === 0){
                if (index === ids.length - 1){
                  this.getList();
                  this.$message({
                    message:'所选商品全部推荐成功',
                    type:'success'
                  });
                }
              }
            })
          })
        } else if(this.operateType===2){
          //删除
          ids.forEach((item,index)=>{
            this.$axios.post('/productDetail/remove',{_id:item}).then(res=>{
              if (res.status === 200 && res.data.err_code === 0){
                if (index === ids.length - 1){
                  this.getList();
                  this.$message({
                    message:'删除成功',
                    type:'success'
                  });
                }
              }
            })
          })
        }else {
          this.$message({
            message: '请选择批量操作类型',
            type: 'warning',
            duration: 1000
          });
        }
      },
      handleSelectProduct(){
        this.selectDialogVisible=true;
        this.getDialogList();
      },
      handleSelectSearch(){
        this.getDialogList();
      },
      handleDialogSizeChange(val) {
        this.dialogData.listQuery.pageNum = 1;
        this.dialogData.listQuery.pageSize = val;
        this.getDialogList();
      },
      handleDialogCurrentChange(val) {
        this.dialogData.listQuery.pageNum = val;
        this.getDialogList();
      },
      handleDialogSelectionChange(val){
        this.dialogData.multipleSelection = val;
      },
      handleSelectDialogConfirm(){
        if (this.dialogData.multipleSelection < 1) {
          this.$message({
            message: '请选择一条记录',
            type: 'warning',
            duration: 1000
          });
          return;
        }
        let selectProducts = [];
        for (let i = 0; i < this.dialogData.multipleSelection.length; i++) {
          selectProducts.push({
            _id:this.dialogData.multipleSelection[i]._id,
            newStatus:1
          });
        }
        this.$confirm('使用要进行添加操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          selectProducts.forEach((item,index)=>{
            this.$axios.post('/productDetail/update',item).then(res=>{
              if (res.status === 200 && res.data.err_code === 0){
                if (index === selectProducts.length - 1){
                  this.$message({
                    message:'所选商品全部推荐成功',
                    type:'success'
                  });
                  this.selectDialogVisible = false;
                  this.getList();
                }
              }
            })
          })
        });
      },
      getList() {
        this.$axios.post('/productDetail/all',this.listQuery).then(res=>{
          if (res.status === 200){
            this.listLoading = false;
            this.list = res.data.list;
            this.total = res.data.totalCount;
          }
        });
      },
      updateRecommendStatusStatus(ids,status){
        this.$confirm('是否要修改推荐状态?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios.post('/productDetail/update',{_id:ids,newStatus:status}).then(res=>{
            if (res.status === 200 && res.data.err_code === 0){
              this.$message({
                message:'此商品信息更新成功',
                type:'success'
              })
            }
          })
        }).catch(() => {
          this.$message({
            type: 'success',
            message: '已取消操作!'
          });
          this.getList();
        });
      },
      deleteProduct(ids){
        this.$confirm('是否要删除该推荐?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios.post('/productDetail/remove',{_id:ids}).then(res=>{
            if (res.status === 200 && res.data.err_code === 0){
              this.getList();
              this.$message({
                message:'删除成功',
                type:'success'
              })
            }
          })
        })
      },
      getDialogList(){
        this.$axios.post('/productDetail/all',this.dialogData.listQuery).then(res=>{
          if (res.status === 200){
            this.dialogData.list = res.data.list;
            this.dialogData.total = res.data.totalCount;
          }
        });
      }
    }
  }
</script>
<style></style>
