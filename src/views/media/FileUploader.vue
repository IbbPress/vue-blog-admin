<template>
  <div class="upload-wrapper" style="margin: 10px;">
    <a-upload-dragger
      name="file"
      :multiple="true"
      :action="uploadAction"
      :headers="headers"
      @change="handleChange"
    >
      <p class="ant-upload-drag-icon">
        <a-icon type="inbox" />
      </p>
      <p class="ant-upload-text">点击或拖拽文件到这个区域进行上传</p>
    </a-upload-dragger>
  </div>
</template>

<script>
export default {
  data () {
    return {
      uploadAction: '/api/media/upload',
      headers: {}
    }
  },
  methods: {
    handleChange (info) {
      const status = info.file.status
      if (status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      if (status === 'done') {
        this.$message.success(`${info.file.name} file uploaded successfully.`)
        this.$emit('upload-ok')
      } else if (status === 'error') {
        this.$message.error(`${info.file.name} file upload failed.`)
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
