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
                <a-button style="margin-left: 8px" icon="fullscreen"></a-button>
              </div>
            </div>
          </a-form-item>
          <!-- <a-form-item
            v-bind="formLayout"
            :extra="extra"
          >
            <a-input
              v-decorator="[
                'pinged',
                {
                  initialValue: formValues.pinged,
                  rules: [
                    { required: true, message: '链接' }
                  ]
                }
              ]"
              placeholder="在此输入标题" />
          </a-form-item> -->
          <a-form-item style="flex: 1 1 auto;">
            <mavon-editor
              ref="editor"
              v-model="formValues.content"
              @imgAdd="$imgAdd"
              @imgDel="$imgDel"
              style="z-index: 900;"
            />
          </a-form-item>
          <!-- <a-form-item
            v-bind="formLayout"
          >
            <a-textarea
              v-decorator="[
                'summary'
              ]"
              placeholder="摘要"
              :autosize="{ minRows: 2, maxRows: 6 }"
            />
          </a-form-item> -->
        </a-form>
      </a-col>
      <!-- <a-col :span="4">
        <div>
          <a-button type="primary" @click="validateFields">提交</a-button>
          <a-button style="margin-left: 8px">保存</a-button>
        </div>
        <br />
      </a-col> -->
    </a-row>
  </a-card>
</template>

<script>
import pinyin from 'pinyin'
import { createBlog, getBlog, updateBlog } from '@/api/blog'
import { delMedia } from '@/api/media'
import { mavonEditor } from 'mavon-editor'
require('mavon-editor/dist/css/index.css')
export default {
  name: 'BaseForm',
  components: { mavonEditor },
  data () {
    return {
      id: undefined,
      loading: false,
      description: '写点什么吧',
      value: 1,

      // form
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
      fileList: {}
    }
  },
  computed: {
    extra () {
      const pinged = this.formValues.pinged
      return pinged && `发布后，文本链接是：https://example.com/${pinged}.html`
    }
  },
  created () {
    const { id } = this.$route.query
    if (id) {
      this.id = id
      this.fetchPost(id)
    } else {
      this.formValues = {
        title: '',
        content: '',
        pinged: ''
      }
    }
  },
  methods: {
    // handler
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
    // handler
    async handleSubmit (values) {
      if (this.id) {
        await updateBlog(this.id, values)
        this.$message.success('更新成功')
      } else {
        await createBlog(values)
        this.$message.success('保存成功')
      }
      this.$router.push({ name: 'blog-list' })
      // eslint-disable-next-line no-console
      // this.id = resp.data.id
      // const { name } = this.$route
      // this.$router.push({ name, query: { id: this.id } })
    },
    async fetchPost (id) {
      const { data: { title, content, pinged } } = await getBlog(id)
      Object.assign(this.formValues, {
        title, content
      })
      !pinged && this.transToPinyin(title)
      // eslint-disable-next-line no-console
    },
    onTitleChange (e) {
      const value = e.target.value
      this.transToPinyin(value)
    },
    transToPinyin (value) {
      // 标点符号是否要处理
      this.formValues.pinged = pinyin(value, {
        style: pinyin.STYLE_NORMAL
      }).join('-')
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
