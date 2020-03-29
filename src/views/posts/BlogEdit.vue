<template>
  <a-card :body-style="{padding: '24px 32px'}" :bordered="false" style="display: flex; min-height: 100%;">
    <a-row :gutter="16" style="min-height: 100%; height: 100%;">
      <a-col :span="24" style="min-height: 100%; height: 100%;">
        <a-form :form="form" style="display: flex; flex-direction: column; height: 100%;">
          <a-form-item v-bind="formLayout">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div style="padding-right: 20px; flex-grow: 1;">
                <a-input
                  @change="onTitleChange"
                  v-decorator="[
                    'title',
                    {
                      initialValue: formValues.title,
                      rules: [
                        { required: true, message: '请输入标题' }
                      ]
                    }
                  ]"
                  placeholder="在此输入标题" />
              </div>
              <div style="display: inline-flex;">
                <a-button type="primary" @click="validateFields">提交</a-button>
                <a-button style="margin-left: 8px">保存</a-button>
                <a-button
                  style="margin-left: 8px"
                  icon="setting"
                  @click="settingVisible = !settingVisible"
                  :type="settingVisible ? 'primary' : 'default'"
                />
              </div>
            </div>
          </a-form-item>
          <a-form-item style="flex: 1 1 auto;">
            <a-row :gutter="16">
              <a-col v-bind="editorLayout">
                <mavon-editor
                  ref="editor"
                  v-model="formValues.content"
                  @imgAdd="$imgAdd"
                  @imgDel="$imgDel"
                  style="z-index: 900;"
                />
              </a-col>
              <a-col v-bind="editorLayout2">
                <settings
                  ref="settings"
                  :formValues="formValues"
                />
              </a-col>
            </a-row>
          </a-form-item>
        </a-form>
      </a-col>
    </a-row>
  </a-card>
</template>

<script>
import Settings from './edit/Settings'
import { createBlog, getBlog, updateBlog } from '@/api/blog'
import { delMedia } from '@/api/media'
import { mavonEditor } from 'mavon-editor'
require('mavon-editor/dist/css/index.css')
export default {
  name: 'BaseForm',
  components: { mavonEditor, Settings },
  data () {
    return {
      id: undefined,
      loading: false,
      description: '写点什么吧',
      form: this.$form.createForm(this),
      formLayout: {
        labelCol: {
          lg: { span: 1 },
          sm: { span: 1 }
        },
        wrapperCol: {
          lg: { span: 24 },
          sm: { span: 24 }
        }
      },
      formValues: {
        title: '',
        content: '',
        pinged: ''
      },
      uploadAction: '/media/upload',
      fileList: {},
      settingVisible: false
    }
  },
  computed: {
    extra () {
      const pinged = this.formValues.pinged
      return pinged && `发布后，文本链接是：https://example.com/${pinged}.html`
    },
    editorLayout () {
      const layout1 = {
        span: 20
      }
      const layout2 = {
        span: 24
      }
      return this.settingVisible ? layout1 : layout2
    },
    editorLayout2 () {
      const layout1 = {
        span: 4
      }
      const layout2 = {
        span: 0
      }
      return this.settingVisible ? layout1 : layout2
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.resetValues()
      vm.fetchPost()
    })
  },
  methods: {
    resetValues () {
      this.formValues = {
        title: '',
        content: '',
        pinged: ''
      }
      this.form.resetFields()
    },

    validateFields (e) {
      e.preventDefault()
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          // eslint-disable-next-line no-console
          console.log('Received values of form: ', values)
        }
        if (!this.formValues.content) {
          this.$message.error('您的文章内容为空！')
          return
        }
        this.handleSubmit(Object.assign({
          ...values,
          content: this.formValues.content,
          contentHtml: this.$refs.editor.d_render
        }))
      })
    },
    async handleSubmit (values = {}) {
      const payload = Object.assign(values, this.$refs.settings.payload)
      console.log(payload)
      if (this.id) {
        await updateBlog(this.id, payload)
        this.$message.success('更新成功')
      } else {
        await createBlog(payload)
        this.$message.success('保存成功')
      }
      this.$router.push({ name: 'blog-list' })
    },
    async fetchPost () {
      const { id } = this.$route.query
      if (!id) { return }
      this.id = id
      const { data } = await getBlog(id)
      this.formValues = Object.assign({}, this.formValues, data)
    },
    // 绑定@imgAdd event
    $imgAdd (pos, $file) {
      // 第一步.将图片上传到服务器.
      var formdata = new FormData()
      formdata.append('file', $file)
      this.$http({
        url: this.uploadAction,
        method: 'post',
        data: formdata,
        headers: { 'Content-Type': 'multipart/form-data' }
      }).then((resp) => {
        this.fileList[resp.url] = resp
        this.$refs.editor.$img2Url(pos, resp.url)
      })
    },
    async $imgDel (filename) {
      const file = this.fileList[filename[0]]
      await delMedia(file.id)
    },
    onTitleChange (e) {
      this.formValues.title = e.target.value
    }
  }
}
</script>

<style>
.ant-card-body {
  flex-grow: 1;
}

.ant-form-item-control-wrapper,
.ant-form-item-control,
.ant-form-item-children,
.v-note-wrapper
{
  height: 100%;
}
</style>
