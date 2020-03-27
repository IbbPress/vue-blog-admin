<template>
  <div class="upload-wrapper" style="margin: 10px;">
    <a-upload-dragger
      name="file"
      :multiple="true"
      :action="uploadAction"
      :customRequest="customRequest"
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
      uploadAction: '/media/upload'
    }
  },
  methods: {
    async customRequest (...args) {
      const formData = new FormData()
      formData.append('file', args[0].file, args[0].file.name)

      const resp = await this.$http.post(this.uploadAction, formData, {
        contentType: false,
        processData: false,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      })
      console.log('upload resp:', resp)
      this.$message.success('上传成功')
    },
    handleChange (info) {
      const status = info.file.status
      if (status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      if (status === 'done') {
        this.$message.success(`${info.file.name} file uploaded successfully.`)
      } else if (status === 'error') {
        this.$message.error(`${info.file.name} file upload failed.`)
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
