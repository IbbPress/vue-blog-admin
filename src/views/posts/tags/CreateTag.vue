<template>
  <a-form
    :form="form"
    layout="horizontal"
    @submit="handleSubmit"
  >
    <a-form-item>
      <h4 style="font-weight: bold;">添加新标签</h4>
    </a-form-item>
    <a-form-item label="名称">
      <a-input
        v-decorator="['name', { rules: [{ required: true, message: '请输入名称!' }] }]"
      />
    </a-form-item>
    <a-form-item label="别名">
      <a-input
        v-decorator="['alias', { rules: [{ required: true, message: '请输入别名!' }] }]"
      />
    </a-form-item>
    <a-form-item label="描述">
      <a-textarea
        v-decorator="['desc']"
      />
    </a-form-item>
    <a-form-item label="图片">
      <a-input
        v-decorator="['img']"
      />
    </a-form-item>
    <a-form-item>
      <a-button type="primary" html-type="submit">
        添加新标签
      </a-button>
    </a-form-item>
  </a-form>
</template>

<script>
import { createTag } from '@/api/tags'

export default {
  data () {
    return {
      form: this.$form.createForm(this, { name: 'coordinated' })
    }
  },
  methods: {
    async handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.createTag(values)
        }
      })
    },
    async createTag (payload) {
      const resp = await createTag(payload)
      console.log(resp)
    }
  }
}
</script>

<style lang="less">

</style>
