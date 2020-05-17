<template> 
  <div>
    <el-upload
      action="123"
      list-type="picture-card"
      :file-list="value"
      :before-upload="beforeUpload"
      :on-remove="handleRemove"
      :on-success="handleUploadSuccess"
      :on-preview="handlePreview"
      :limit="maxCount"
      :on-exceed="handleExceed"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>
<script>

  export default {
    name: 'multiUpload',
    props: {
      //图片属性数组
      value: Array,
      //最大上传图片数量
      maxCount:{
        type:Number,
        default:5
      }
    },
    data() {
      return {
        dataObj: {
          policy: '',
          signature: '',
          key: '',
          ossaccessKeyId: '',
          dir: '',
          host: ''
        },
        fileList:this.value? this.value : [],
        dialogVisible: false,
        dialogImageUrl:null,
        useOss:true, //使用oss->true;使用MinIO->false
        ossUploadUrl:'http://127.0.0.1:3000/uploadFile',
        minioUploadUrl:'http://localhost:8080/minio/upload',
      };
    },
    methods: {
      handleRemove(file, fileList) {

      },
      handlePreview(file) {
        this.dialogVisible = true;
        this.dialogImageUrl=file.url;
      },
      beforeUpload(file) {
        let fd = new FormData();
        fd.append('file', file);
        let config = {
          headers: {'Content-Type': 'multipart/form-data'}
        };
        this.$axios.post('/uploadFile', fd, config).then(res => {
          if (res.status === 200) {
            // this.fileList.push({url: res.data.url});
            this.value.push({url:res.data.url});
          }
        });
        return false;
      },
      handleUploadSuccess(res, file) {

      },
      handleExceed(files, fileList) {
        this.$message({
          message: '最多只能上传'+this.maxCount+'张图片',
          type: 'warning',
          duration:1000
        });
      },
    }
  }
</script>
<style>

</style>


