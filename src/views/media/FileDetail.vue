<template>
  <a-modal
    class="file-detail-modal"
    centered
    width="90vw"
    :visible="visible"
    :closable="false"
    :bodyStyle="bodyStyle"
    :footer="null"
    @cancel="handleCancel"
  >
    <div class="modal-title" slot="title">
      <h4>文件详情</h4>
      <div class="actions">
        <a-button-group>
          <a-button icon="left" @click="goToPrev" :disabled="disablePrev" />
          <a-button icon="right" @click="goToNext" :disabled="disableNext" />
        </a-button-group>
        <a-icon type="close" class="close-btn" @click="handleCancel" style="padding: 0 15px;"/>
      </div>
    </div>

    <div class="modal-content" v-if="currfile">
      <div class="view-wrapper">
        <a-carousel arrows :dots="false" ref="carousel">
          <div
            v-for="item in list"
            :key="item.id"
          >
            <file-thumb class="file-thumb" v-if="visible && item" :file="item" />
          </div>
        </a-carousel>
      </div>
      <div class="info-wrapper">
        <div class="details">
          <a-row class="drawer-row" type="flex" align="top">
            <a-col :span="6">
              文件名
            </a-col>
            <a-col :span="18">
              {{ currfile.originalname }}
            </a-col>
          </a-row>
          <a-row class="drawer-row" type="flex" align="top">
            <a-col :span="6">
              文件类型
            </a-col>
            <a-col :span="18">
              {{ currfile.mimetype }}
            </a-col>
          </a-row>
          <a-row class="drawer-row" type="flex" align="top">
            <a-col :span="6">
              上传于
            </a-col>
            <a-col :span="18">
              {{ currfile.date }}
            </a-col>
          </a-row>
          <a-row class="drawer-row" type="flex" align="top">
            <a-col :span="6">
              文件大小
            </a-col>
            <a-col :span="18">
              <!-- {{ currfile.date }} -->
              未知
            </a-col>
          </a-row>
          <a-row class="drawer-row" type="flex" align="top">
            <a-col :span="6">
              分辨率
            </a-col>
            <a-col :span="18">
              <!-- {{ currfile.date }} -->
              未知
            </a-col>
          </a-row>
        </div>
        <div class="settings">
          <a-row class="drawer-row" type="flex" align="top">
            <a-col :span="6">
              <span class="label">URL</span>
            </a-col>
            <a-col :span="18">
              <p style="margin: 0;">
                <a-input :read-only="true" :value="currfile.url"/>
              </p>
              <p style="margin: 0; padding-left: 4px; font-size: 12px;">
                <a :download="currfile.originalname" :href="currfile.url">下载</a>
                <span class="mx10" style="margin: 0 10px;">|</span>
                <a :href="currfile.url" target="_blank">打开文件 URL</a>
                <span class="mx10" style="margin: 0 10px;">|</span>
                <a
                  v-clipboard:copy="currfile.url"
                  v-clipboard:success="onCopyOk"
                  v-clipboard:error="onCopyError"
                >
                  复制文件 URL
                </a>
              </p>
            </a-col>
          </a-row>
          <a-row class="drawer-row" type="flex" align="top">
            <a-col :span="6">
              <span class="label">描述</span>
            </a-col>
            <a-col :span="18">
              <a-textarea placeholder="描述" />
              <div style="text-align: right;">
                <a-button style="margin-top: 10px;">
                  确定
                </a-button>
              </div>
            </a-col>
          </a-row>
        </div>
        <div class="actions">
          <!-- <a-button>删除</a-button> -->
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script>
import FileThumb from './FileThumb'
export default {
  components: {
    FileThumb
  },
  props: {
    list: {
      type: Array,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    visible: {
      type: Boolean,
      required: true
    }
  },
  watch: {
    visible () {
      if (this.visible) {
        setTimeout(() => {
          this.$refs.carousel.goTo(this.index, true)
        }, 0)
      }
    }
  },
  data () {
    return {
      message: 'Copy These Text',
      bodyStyle: {
        height: '80vh'
      }
    }
  },
  computed: {
    currfile () {
      return this.list[this.index]
    },
    disableNext () {
      return this.index + 1 >= this.list.length
    },
    disablePrev () {
      return this.index <= 0
    }
  },
  methods: {
    handleCancel () {
      this.$emit('update:visible', false)
    },
    onCopyOk (e) {
      this.$message.success('您已成功复制: ' + e.text)
    },
    onCopyError (e) {
      this.$message.error('复制失败')
    },
    goToNext () {
      this.$emit('change-index', this.index + 1)
      this.$refs.carousel.next()
    },
    goToPrev () {
      this.$emit('change-index', this.index - 1)
      this.$refs.carousel.prev()
    }
  }
}
</script>

<style lang="less">
.file-detail-modal {
  .ant-modal-body {
    padding: 0;
  }
  .modal-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .close-btn {
      padding: 0 15px;
      cursor: pointer;
    }
  }
  .modal-content {
    display: flex;
    // height: 80vh;
    // overflow: auto;
    width: 100%;
    height: 100%;
    .view-wrapper {
      width: 65%;
      padding: 20px;
    }
    .info-wrapper {
      width: 35%;
      padding: 20px;
      background-color: #f2f2f2;

      .details {
        border-bottom: 1px solid #ddd;
        padding-bottom: 10px;
        .drawer-row {
          margin-bottom: 10px;
          line-height: 20px;

          div:first-child {
            text-align: right;
            padding-right: 16px;
          }
        }
      }
      .settings {
        margin-top: 20px;
        .drawer-row {
          margin-bottom: 20px;
          line-height: 20px;
          div:first-child {
            text-align: right;
            padding-right: 16px;
          }
        }
      }
    }
  }
  .ant-carousel {
    height: 100%;

    .slick-slider {
      text-align: center;
      height: 100%;
      overflow: hidden;
    }
    .slick-slider img {
      display: block;
      margin: 0 auto 16px;
      max-width: 100%;
      max-height: 90%;
      max-height: calc(100% - 42px);
      background-image: linear-gradient(45deg,#c4c4c4 25%,transparent 25%,transparent 75%,#c4c4c4 75%,#c4c4c4),linear-gradient(45deg,#c4c4c4 25%,transparent 25%,transparent 75%,#c4c4c4 75%,#c4c4c4);
      background-position: 0 0,10px 10px;
      background-size: 20px 20px;
    }
    .file-thumb {
      display: block;
      background-color: #fff;
      box-shadow: none;
    }
  }
}
</style>
