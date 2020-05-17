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
            <el-input v-model="listQuery.email" class="input-width" placeholder="帐号" clearable></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
    </el-card>
    <div class="table-container">
      <el-table ref="adminTable"
                :data="list"
                style="width: 100%;"
                v-loading="listLoading" border>
        <el-table-column label="用户名" align="center">
          <template slot-scope="scope">{{scope.row.nickname}}</template>
        </el-table-column>
        <el-table-column label="账号" align="center">
          <template slot-scope="scope">{{scope.row.email}}</template>
        </el-table-column>
        <el-table-column label="添加时间" width="160" align="center">
          <template slot-scope="scope">{{scope.row.createTime | formatDateTime}}</template>
        </el-table-column>
        <el-table-column label="最后登录" width="160" align="center">
          <template slot-scope="scope">{{scope.row.loginTime | formatDateTime}}</template>
        </el-table-column>
        <el-table-column label="是否启用" width="140" align="center">
          <template slot-scope="scope">
            <el-switch
              disabled
              :active-value="0"
              :inactive-value="1"
              v-model="scope.row.status">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button size="mini"
                       type="text"
                       @click="handleUpdate(scope.$index, scope.row)">
              编辑
            </el-button>
            <el-button size="mini"
                       type="text"
                       @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :current-page.sync="listQuery.pageNum"
        :page-size="listQuery.pageSize"
        :page-sizes="[10,15,20]"
        :total="total">
      </el-pagination>
    </div>
    <el-dialog
      :title="isEdit?'编辑用户':'添加用户'"
      :visible.sync="dialogVisible"
      width="40%">
      <el-form :model="admin"
               ref="adminForm"
               label-width="150px" size="small">
        <el-form-item label="用户名：">
          <el-input v-model="admin.nickname" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="账号：">
          <el-input v-model="admin.email" style="width: 250px" disabled></el-input>
        </el-form-item>
        <el-form-item label="生日：">
          <el-date-picker
            v-model="admin.birthday"
            type="date"
            placeholder="选择日期"
            style="width: 250px"
            :default-value="admin.birthday">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="密码：">
          <el-input v-model="admin.password"  type="password" style="width: 250px" disabled></el-input>
        </el-form-item>
        <el-form-item label="性别：">
          <el-radio-group v-model="admin.sex">
            <el-radio :label="0">女</el-radio>
            <el-radio :label="1">男</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否启用：">
          <el-radio-group v-model="admin.status">
            <el-radio :label="0">是</el-radio>
            <el-radio :label="1">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm()" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import {formatDate} from '@/utils/date';

  const defaultListQuery = {
    pageNum: 1,
    pageSize: 10,
    email: null
  };
  const defaultAdmin = {
    id: null,
    password: null,
    nickname: null,
    email: null,
    sex:0,
    birthday:null,
    status: 0
  };
  export default {
    name: 'adminList',
    data() {
      return {
        listQuery: Object.assign({}, defaultListQuery),
        list: null,
        total: null,
        listLoading: true,
        dialogVisible: false,
        admin: Object.assign({}, defaultAdmin),
        isEdit: false,
      }
    },
    created() {
      this.getList();
    },
    filters: {
      formatDateTime(time) {
        if (time == null || time === '') {
          return 'N/A';
        }
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
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
      handleSizeChange(val) {
        this.listQuery.pageNum = 1;
        this.listQuery.pageSize = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.pageNum = val;
        this.getList();
      },
      handleDelete(index, row) {
        this.$confirm('是否要删除该用户?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios.get('/users/remove',{params:{_id:row._id}}).then(res=>{
            if (res.status === 200 && res.data.err_code === 0){
              this.$message({
                type:'success',
                message:res.data.message
              });
              this.getList();
            }
          })
        });
      },
      handleUpdate(index, row) {
        this.dialogVisible = true;
        this.isEdit = true;
        this.admin = Object.assign({},row);
        this.admin.id = row._id;
      },
      handleDialogConfirm() {
        this.$confirm('是否要确认?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (this.isEdit) {
            this.$axios.post('/users/updateInfo',this.admin).then(res=>{
              if (res.status === 200 && res.data.err_code === 0){
                this.$message({
                  type:'success',
                  message:'更新成功'
                });
                this.dialogVisible = false;
                this.getList();
              }
            })
          } else {

          }
        })
      },
      getList() {
        this.$axios.get('/users/adminGetAll',{params:this.listQuery}).then(res=>{
          if (res.data.err_code === 0 && res.status === 200){
            this.listLoading = false;
            this.total = res.data.total;
            this.list = res.data.list;
          }
        });
      }
    }
  }
</script>
<style></style>


