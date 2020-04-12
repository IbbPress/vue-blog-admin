<template>
  <div class="upload-wrapper" style="margin: 10px;">
    <a-upload-dragger
      name="file"
      :multiple="true"
      :action="uploadAction"
      :headers="headers"
      :beforeUpload="beforeUpload"
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
    beforeUpload (file) {
      const isPIC = file.type.includes('image')
      if (!isPIC) {
        console.log('文件类型：', file.type)
        this.$message.error('只能选择图片文件上传')
      }
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('Image must smaller than 2MB!')
      }
      return isPIC && isLt2M
    },
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
