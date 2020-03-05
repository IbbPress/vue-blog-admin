<template>
  <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
    <a-row :gutter="16">
      <a-col :span="20">
        <a-form :form="form">
          <a-form-item
            v-bind="formLayout"
          >
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
          </a-form-item>
          <a-form-item
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
          </a-form-item>
          <a-form-item>
            <mavon-editor v-model="formValues.content" />
          </a-form-item>
          <a-form-item
            v-bind="formLayout"
          >
            <a-textarea
              v-decorator="[
                'summary'
              ]"
              placeholder="摘要"
              :autosize="{ minRows: 2, maxRows: 6 }"
            />
          </a-form-item>
        </a-form>
      </a-col>
      <a-col :span="4">
        <div>
          <a-button type="primary" @click="validateFields">提交</a-button>
          <a-button style="margin-left: 8px">保存</a-button>
        </div>
        <br />
        <upload-file />
      </a-col>
    </a-row>
  </a-card>
</template>

<script>
import pinyin from 'pinyin'
import { createBlog, getBlog, updateBlog } from '@/api/blog'
import { mavonEditor } from 'mavon-editor'
import UploadFile from './UploadFile'
require('mavon-editor/dist/css/index.css')
export default {
  name: 'BaseForm',
  components: { mavonEditor, UploadFile },
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
      }

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
          content: this.formValues.content
        }))
      })
    },
    // handler
    async handleSubmit (values) {
      let resp
      if (this.id) {
        resp = await updateBlog(this.id, values)
      } else {
        resp = await createBlog(values)
      }
      this.$message.success('保存成功')
      // eslint-disable-next-line no-console
      this.id = resp.data.id
      const { name } = this.$route
      this.$router.push({ name, query: { id: this.id } })
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
    }
  }
}
</script>