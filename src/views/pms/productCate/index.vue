<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" style="margin-top: 5px"></i>
      <span style="margin-top: 5px">数据列表</span>
      <el-button
        class="btn-add"
        @click="handleAddProductCate()"
        size="mini">
        添加
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="productCateTable"
                style="width: 100%"
                :data="list"
                v-loading="listLoading" border>
        <el-table-column label="分类名称" align="center">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column label="级别" width="100" align="center">
          <template slot-scope="scope">{{scope.row.parentId | levelFilter}}</template>
        </el-table-column>
        <el-table-column label="商品数量" width="100" align="center">
          <template slot-scope="scope">{{scope.row.productCount }}</template>
        </el-table-column>
        <el-table-column label="是否显示" width="100" align="center">
          <template slot-scope="scope">
            <el-switch
              @change="handleShowStatusChange(scope.$index, scope.row)"
              :active-value="1"
              :inactive-value="0"
              disabled
              v-model="scope.row.showStatus">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="设置" width="200" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              :disabled="scope.row.parentId | disableNextLevel"
              @click="handleShowNextLevel(scope.$index, scope.row)">查看下级
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
  </div>
</template>

<script>

  export default {
    name: "productCateList",
    data() {
      return {
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          pageNum: 1,
          pageSize: 5,
          parentId : this.$route.query.parentId
        },
        parentId: 0
      }
    },
    created() {
      this.resetParentId();
      this.getList();
    },
    watch: {
      $route(route) {
        this.resetParentId();
        this.getList();
      }
    },
    methods: {
      resetParentId() {
        this.listQuery.pageNum = 1;
        if (this.$route.query.parentId != null) {
          this.listQuery.parentId = this.$route.query.parentId;
        } else {
          this.listQuery.parentId = '';
        }
      },
      handleAddProductCate() {
        this.$router.push('/pms/addProductCate');
      },
      getList() {
        this.$axios.get('/productCate/all',{params:this.listQuery}).then(res=>{
          this.listLoading = false;
          if(res.status === 200){
            this.list = res.data.productCateList;
            this.total = res.data.totalCount;
          }
        })
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
      handleNavStatusChange(index, row) {
        let data = new URLSearchParams();
        let ids = [];
        ids.push(row.id);
        data.append('ids', ids);
        data.append('navStatus', row.navStatus);

      },
      handleShowStatusChange(index, row) {
        console.log(row);
      },
      handleShowNextLevel(index, row) {
        this.$router.push({path: '/pms/productCate', query: {parentId: row._id}})
      },
      handleUpdate(index, row) {
        this.$router.push({path: '/pms/updateProductCate', query: {id: row._id}});
      },
      handleDelete(index, row) {
        this.$confirm('是否要删除该类别连同下级类别', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios.get('/productCate/remove',{params:{_id:row._id}}).then(res=>{
            if (res.status === 200 && res.data.err_code === 0){
              this.$message({
                message:'删除成功',
                type:'success'
              });
              this.getList();
            }
          })
        });
      }
    },
    filters: {
      levelFilter(value) {
        if (value === '') {
          return '一级';
        } else {
          return '二级';
        }
      },
      disableNextLevel(value) {
        if (value === '') {
          return false;
        } else {
          return true;
        }
      }
    }
  }
</script>

<style scoped>

</style>
