<template> 
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" style="margin-top: 5px"></i>
      <span style="margin-top: 5px">数据列表</span>
      <el-button
        class="btn-add"
        @click="addProductAttrCate()"
        size="mini">
        添加
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="productAttrCateTable"
                style="width: 100%"
                :data="list"
                v-loading="listLoading"
                border>
        <el-table-column label="编号" align="center">
          <template slot-scope="scope">{{scope.$index + 1}}</template>
        </el-table-column>
        <el-table-column label="类型名称" align="center">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column label="属性数量" width="200" align="center">
          <template slot-scope="scope">{{scope.row.attr.length}}</template>
        </el-table-column>
        <el-table-column label="设置" width="200" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="getAttrList(scope.$index, scope.row)">属性列表
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleUpdate(scope.$index, scope.row)">编辑
            </el-button>
            <el-button
              size="mini"
              type="danger"
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
        :page-size="listQuery.pageSize"
        :page-sizes="[5,10,15]"
        :current-page.sync="listQuery.pageNum"
        :total="total">
      </el-pagination>
    </div>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="30%">
      <el-form ref="productAttrCatForm":model="productAttrCate" :rules="rules" label-width="120px">
        <el-form-item label="类型名称" prop="name">
          <el-input v-model="productAttrCate.name" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleConfirm('productAttrCatForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>

  export default {
    name: 'productAttrCateList',
    data() {
      return {
        list: null,
        total: 15,
        listLoading: true,
        listQuery: {
          pageNum: 1,
          pageSize: 5
        },
        dialogVisible: false,
        dialogTitle:'',
        productAttrCate:{
          name:'',
          _id:null
        },
        rules: {
          name: [
            { required: true, message: '请输入类型名称', trigger: 'blur' }
          ]
        }
      }
    },
    created() {
      this.getList();
    },
    methods: {
      getList() {
        this.$axios.get('/productAttr/all',{params:this.listQuery}).then(res=>{
          if (res.status === 200 && res.data.err_code === 0){
            this.listLoading = false;
            this.total = res.data.totalCount;
            this.list = res.data.productAttrList;
          }
        })
      },
      addProductAttrCate() {
        this.dialogVisible = true;
        this.dialogTitle = "添加类型";
        this.productAttrCate.name = '';
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
        this.$confirm('是否要删除该类型', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios.get('/productAttr/remove',{params:{_id:row._id}}).then(res=>{
            if (res.status === 200 && res.data.err_code === 0){
              this.getList();
              this.$message({
                message:res.data.message,
                type:'success'
              })
            }
          })
        });
      },
      handleUpdate(index, row) {
        this.dialogVisible = true;
        this.dialogTitle = "编辑类型";
        this.productAttrCate.name = row.name;
        this.productAttrCate._id = row._id;
      },
      getAttrList(index, row) {
        this.$router.push({path: '/pms/productAttrList',query:{cid:row._id,cname:row.name}})
      },
      handleConfirm(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.dialogTitle == '添加类型') {
              this.$axios.get('/productAttr/add',{params:{name:this.productAttrCate.name}}).then(res=>{
                if (res.status === 200 && res.data.err_code === 0){
                  this.$message({
                    message:res.data.message,
                    type:'success'
                  });
                  this.dialogVisible = false;
                  this.getList();
                }
              })
            }
            else{
              this.$axios.post('/productAttr/update',this.productAttrCate).then(res=>{
                if (res.status === 200 && res.data.err_code === 0){
                  this.dialogVisible = false;
                  this.getList();
                  this.$message({
                    message:res.data.message,
                    type:'success'
                  })
                }
              })
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
</style>


