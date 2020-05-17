<template> 
  <div class="app-container">
    <el-card class="operate-container" shadow="never">

      <i class="el-icon-tickets" style="margin-top: 5px"></i>
      <span style="margin-top: 5px">数据列表</span>
      <el-button
        class="btn-add"
        @click="addProductAttr()"
        size="mini">
        添加
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="productAttrTable"
                :data="list"
                style="width: 100%"
                v-loading="listLoading"
                border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{scope.$index + 1}}</template>
        </el-table-column>
        <el-table-column label="属性名称" width="140" align="center">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column label="商品类型" width="140" align="center">
          <template slot-scope="scope">{{$route.query.cname}}</template>
        </el-table-column>
        <el-table-column label="可选值列表" align="center">
          <template slot-scope="scope">{{scope.row.attrList.toString()}}</template>
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
  </div>
</template>
<script>
  export default {
    name: 'productAttrList',
    data() {
      return {
        list: null,
        listLoading: true,
        operateType: null
      }
    },
    created() {
      this.getList();
    },
    methods: {
      getList() {
        this.$axios.get('/productAttr/getAttr',{params:{_id:this.$route.query.cid}}).then(res=>{
          if (res.status === 200 && res.data.err_code === 0){
            this.listLoading = false;
            this.list = res.data.attrList;
          }
        })
      },
      addProductAttr() {
        this.$router.push({path:'/pms/addProductAttr',query:{cid:this.$route.query.cid,cname:this.$route.query.cname}});
      },
      handleUpdate(index, row) {
        this.$router.push({path:'/pms/updateProductAttr',query:{cid:this.$route.query.cid,index:index,cname:this.$route.query.cname},});
      },
      handleDelete(index, row) {
        this.list.splice(index,1);
        this.$axios.post('/productAttr/updateAttr',{_id:this.$route.query.cid,attr:this.list}).then(res=>{
          if (res.status === 200 && res.data.err_code === 0){
            this.$message({
              message:'删除成功',
              type:'success'
            });
            this.getList();
          }
        })
      },
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>


