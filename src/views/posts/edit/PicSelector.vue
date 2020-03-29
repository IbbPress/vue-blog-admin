<template>
  <div class="pic-selector-modal-wrapper">
    <a-modal
      centered
      width="90vw"
      class="pic-selector-modal"
      :visible="visible"
      :bodyStyle="bodyStyle"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <div class="modal-title" slot="title">
        <h4>特色图片</h4>
        <!-- <div class="actions">
          <a-button-group>
            <a-button icon="left" @click="goToPrev" :disabled="disablePrev" />
            <a-button icon="right" @click="goToNext" :disabled="disableNext" />
          </a-button-group>
          <a-icon type="close" class="close-btn" @click="handleCancel" style="padding: 0 15px;"/>
        </div> -->
      </div>
      <a-spin :spinning="!list.length">
        <div class="modal-content">
          <card-list
            class="file-list"
            :list="list"
            :selsctable="selsctable"
          />
          <div class="file-detail">

          </div>
        </div>
      </a-spin>
    </a-modal>
  </div>
</template>

<script>
import CardList from '../../media/CardList'
import { getMediaList } from '@/api/media'
export default {
  components: { CardList },
  props: {
    visible: {
      type: Boolean,
      default () {
        return false
      }
    }
  },
  data () {
    return {
      bodyStyle: {
        height: '80vh'
      },
      list: [],
      selsctable: true
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    async fetchData () {
      const list = await getMediaList()
      console.log('list: ', list)
      list.forEach(item => {
        item.checked = false
        item.selected = false
      })
      this.list = list
    },
    handleOk () {
      console.log('ok')
    },
    handleCancel () {
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style lang="less" scoped>
.pic-selector-modal {
  .modal-content {
    display: flex;
    height: 100%;

    .file-list {
      width: 80%;
    }
    .file-detail {
      width: 20%;
      background-color: #f2f2f2;
    }
  }
}
</style>
