<template>
  <a-card title="快速草稿" style="margin-bottom: 24px" :bordered="false">
    <div class="item-group">
      <a-form :form="form">
        <a-form-item v-bind="formLayout">
          <a-input
            v-decorator="[
              'title',
              {
                initialValue: formValues.title,
                rules: [{ required: true, message: '标题' }]
              }
            ]"
            placeholder="在此输入标题"
          />
        </a-form-item>
        <a-form-item v-bind="formLayout">
          <a-textarea v-decorator="['content']" placeholder="在想些什么？" :autosize="{ minRows: 4, maxRows: 8 }" />
        </a-form-item>
      </a-form>
      <a-button type="primary">保存草稿</a-button>
    </div>

    <div style="border-top: 1px solid #f2f2f2; margin-top: 12px; padding-top: 12px;">
      <h5 style="font-size: 16px;">草稿</h5>
      <a-list>
        <a-list-item :key="index" v-for="(item, index) in list">
          <a-list-item-meta>
            <div slot="description">{{ item.createAt | formatTime }}</div>
            <div slot="title">
              <router-link :to="{ name: 'blog-edit', query: { id: item.id } }">
                {{ item.title }}
              </router-link>
            </div>
          </a-list-item-meta>
        </a-list-item>
      </a-list>
    </div>
  </a-card>
</template>

<script>
import moment from 'moment'
import { getBlogList, createBlog, getBlog, updateBlog } from '@/api/blog'
export default {
  name: 'Draft',
  data () {
    return {
      id: undefined,
      loading: false,
      list: [],
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
        content: ''
      }
    }
  },
  created () {
    console.log('created')
    this.fetch()
  },
  filters: {
    formatTime (value) {
      return moment(parseInt(value)).format('YYYY-MM-DD hh:mm:ss a')
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
        this.handleSubmit(
          Object.assign({
            ...values,
            content: this.formValues.content
          })
        )
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
      console.log(resp)
    },
    async fetchPost (id) {
      const {
        data: { title, content }
      } = await getBlog(id)
      Object.assign(this.formValues, {
        title,
        content
      })
      // eslint-disable-next-line no-console
    },
    async fetch () {
      this.loading = true
      const resp = await getBlogList()
      this.loading = false
      this.list = resp.data
    }
  }
}
</script>
