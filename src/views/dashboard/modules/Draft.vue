<template>
  <a-card title="快速草稿" style="margin-bottom: 24px" :bordered="false">
    <div class="item-group">
      <a-form :form="form">
        <a-form-item>
          <a-input
            v-decorator="[
              'title',
              {
                rules: [{ required: true, message: ' ' }]
              }
            ]"
            placeholder="在此输入标题"
          />
        </a-form-item>
        <a-form-item>
          <a-textarea
            v-decorator="[
              'content',
              {
                rules: [{ required: true, message: ' ' }]
              }
            ]"
            placeholder="在想些什么？"
            :autosize="{ minRows: 4, maxRows: 8 }"
          />
        </a-form-item>
      </a-form>
      <a-button type="primary" @click="validateFields">保存草稿</a-button>
    </div>

    <div style="border-top: 1px solid #f2f2f2; margin-top: 12px; padding-top: 12px;">
      <h5 style="font-size: 16px;">草稿</h5>
      <a-skeleton :loading="loading" active>
        <a-list>
          <a-list-item :key="index" v-for="(item, index) in draftList">
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
      </a-skeleton>
    </div>
  </a-card>
</template>

<script>
import moment from 'moment'
import { getBlogList as getDraft, createBlog } from '@/api/blog'
export default {
  name: 'Draft',
  data () {
    return {
      loading: false,
      draftList: [],
      form: this.$form.createForm(this)
    }
  },
  created () {
    this.fetchDraft()
  },
  filters: {
    formatTime (value) {
      return moment(parseInt(value)).format('YYYY-MM-DD a hh:mm:ss')
    }
  },
  methods: {
    validateFields (e) {
      e.preventDefault()
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          // eslint-disable-next-line no-console
          console.log('Received values of form: ', values)
          this.handleSubmit(values)
        }
      })
    },
    async handleSubmit (values) {
      await createBlog(values)
      this.$message.success('保存成功')
      this.fetchDraft()
    },
    async fetchDraft () {
      this.loading = true
      const resp = await getDraft({
        pageSize: 3,
        pageNo: 1
      })
      this.loading = false
      this.draftList = resp.data
    }
  }
}
</script>
