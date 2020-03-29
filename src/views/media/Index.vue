<template>
  <div class="media">
    <file-uploader @upload-ok="init" />

    <div class="actions" style="margin: 10px; background: #fff; padding: 20px;">
      <template v-if="selsctable">
        <a-button
          @click="deleteFile"
          type="danger"
          :disabled="!list.some(item => item.checked)"
          style="margin-right: 8px;"
        >
          删 除
        </a-button>
        <a-button @click="selsctable = !selsctable">取消</a-button>
      </template>
      <template v-else>
        <a-button @click="onSelsctableChange">批量选择</a-button>
      </template>
    </div>

    <card-list
      :list="list"
      @preview="showModal"
      :selsctable="selsctable"
    />

    <file-detail
      :list="list"
      :index="selectedIndex"
      :visible.sync="modalVisible"
      @change-index="onIndexChange"
    />

  </div>
</template>

<script>
import { getMediaList, delMediaList } from '@/api/media'
import CardList from './CardList'
import FileDetail from './FileDetail'
import FileUploader from './FileUploader'
export default {
  components: {
    CardList,
    FileDetail,
    FileUploader
  },
  data () {
    return {
      uploadAction: '/media/upload',
      list: [],
      selsctable: false,
      modalVisible: false,
      currfile: null,
      selectedIndex: 0
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.fetchData()
    },
    async fetchData () {
      const list = await getMediaList()
      console.log('list: ', list)
      list.forEach(item => {
        item.checked = false
        item.selected = false
      })
      this.list = list
    },
    showModal (index) {
      this.onIndexChange(index)
      this.modalVisible = true
    },
    onIndexChange (index) {
      this.selectedIndex = index
      this.list.forEach(item => {
        item.selected = false
      })
      this.list[index].selected = true
    },
    onSelsctableChange (e) {
      this.selsctable = !this.selsctable
      this.list.forEach(item => {
        item.checked = false
      })
    },
    async deleteFile () {
      const arr = this.list.filter(item => item.checked).map(item => item.id)
      const resp = await delMediaList(arr)
      console.log(resp)
      this.init()
    }
  }
}
</script>

<style lang="less">
.media {
  .ant-upload.ant-upload-drag .ant-upload {
    display: table;
    height: 100%;
    width: 100%;
  }
}
</style>
