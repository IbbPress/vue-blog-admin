<template>
  <div class="tags-page">
    <a-row :gutter="16">
      <a-col :span="8">
        <a-card :bordered="false">
          <create-tag />
        </a-card>
      </a-col>
      <a-col :span="16">
        <a-card :bordered="false">
          <tags-table />
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import CreateTag from './CreateTag'
import TagsTable from './Table'

export default {
  components: {
    CreateTag,
    TagsTable
  },
  data () {
    return {

    }
  },
  methods: {

  }
}
</script>

<style lang="less">

</style>
