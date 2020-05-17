<template> 
  <div>
    <el-upload
      class="upload-demo"
      action="123"
      :before-upload="beforeUpload"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :file-list="fileList"
      list-type="picture">
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>
  </div>
</template>
<script>

  export default {
    name: 'singleUpload',
    props: {
      value: Array,
    },
    data() {
      return {
        fileList: this.value? this.value : []
      };
    },

    methods: {
      beforeUpload(file) {
        let fd = new FormData();
        fd.append('file', file);
        let config = {
          headers: {'Content-Type': 'multipart/form-data'}
        };
        this.$axios.post('/uploadFile', fd, config).then(res => {
          if (res.status === 200) {
            // this.fileList.push({url: res.data.url});
            this.value.push( {url: res.data.url});
          }
        });
        return false;
      },
      handleRemove(file, fileList) {

      },
      handlePreview(file) {

      }
    }
  }
</script>
<style>

</style>


