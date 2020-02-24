<template>
  <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
    <a-row :gutter="16">
      <a-col :span="20">
        <a-form :form="form">
          <a-form-item
            :wrapperCol="formLayout.wrapperCol"
          >
            <a-input
              v-decorator="[
                'name',
                {rules: [{ required: true, message: '请输入标题' }]}
              ]"
              name="name"
              placeholder="在此输入标题" />
          </a-form-item>
          <a-form-item>
            <mavon-editor v-model="md" />
          </a-form-item>
          <a-form-item
            :wrapperCol="formLayout.wrapperCol"
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
      </a-col>
    </a-row>
  </a-card>
</template>

<script>
import { createBlog } from '@/api/blog'
import { mavonEditor } from 'mavon-editor'
require('mavon-editor/dist/css/index.css')
export default {
  name: 'BaseForm',
  components: { mavonEditor },
  data () {
    return {
      md: '',
      description: '表单页用于向用户收集或验证信息，基础表单常见于数据项较少的表单场景。',
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
      }

    }
  },
  methods: {
    // handler
    validateFields (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          // eslint-disable-next-line no-console
          console.log('Received values of form: ', values)
        }
        if (!this.md) {
          this.$message.error('您的文章内容为空！')
          return
        }
        this.handleSubmit(Object.assign({
          ...values,
          content: this.md
        }))
      })
    },
    // handler
    async handleSubmit (values) {
      const resp = await createBlog(values)
      // eslint-disable-next-line no-console
      console.log(resp)
    }
  }
}
</script>
