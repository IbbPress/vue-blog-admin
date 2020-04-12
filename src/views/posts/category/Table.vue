<template>
  <s-table
    ref="table"
    size="default"
    rowKey="id"
    :columns="columns"
    :data="loadData"
    :alert="options.alert"
    :rowSelection="options.rowSelection"
    showPagination="auto"
  >
    <span slot="serial" slot-scope="text, record, index">
      {{ index + 1 }}
    </span>
    <span slot="name" slot-scope="text">
      {{ text }}
    </span>
    <span slot="img" slot-scope="text">
      <ellipsis :length="10" tooltip>{{ text }}</ellipsis>
    </span>
    <span slot="desc" slot-scope="text">
      <ellipsis :length="10" tooltip>{{ text }}</ellipsis>
    </span>
  </s-table>
</template>

<script>
import { STable, Ellipsis } from '@/components'
import { getCateList } from '@/api/category'

export default {
  components: {
    STable,
    Ellipsis
  },
  data () {
    return {
      columns: [
        {
          title: '#',
          scopedSlots: { customRender: 'serial' }
        },
        {
          title: '名称',
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '图像',
          dataIndex: 'img',
          scopedSlots: { customRender: 'img' }
        },
        {
          title: '别名',
          dataIndex: 'alias'
        },
        {
          title: '简介',
          dataIndex: 'desc',
          scopedSlots: { customRender: 'desc' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: params => {
        return getCateList(Object.assign(params, this.queryParam))
          .then(res => {
            return {
              pageSize: 10,
              pageNo: 1,
              totalCount: res.length,
              totalPage: 1,
              data: res
            }
          })
      },
      selectedRowKeys: [],
      selectedRows: [],
      options: {
        alert: { show: true, clear: () => { this.selectedRowKeys = [] } },
        rowSelection: {
          selectedRowKeys: this.selectedRowKeys,
          onChange: this.onSelectChange
        }
      }
    }
  },
  methods: {
    refresh () {
      this.$refs.table.refresh()
    },
    onSelectChange () {

    }
  }
}
</script>

<style lang="less">

</style>
