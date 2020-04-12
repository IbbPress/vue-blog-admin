<template>
  <div class="category-page">
    <a-row :gutter="16">
      <a-col :span="8">
        <a-card :bordered="false">
          <create-form @create="onCreate" />
        </a-card>
      </a-col>
      <a-col :span="16">
        <a-card :bordered="false">
          <cate-table ref="table" />
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import CreateForm from './CreateFrom'
import CateTable from './Table'

export default {
  components: {
    CreateForm,
    CateTable
  },
  data () {
    return {

    }
  },
  methods: {
    onCreate () {
      this.$refs.table.refresh()
    }
  }
}
</script>

<style lang="less">

</style>
