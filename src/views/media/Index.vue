<template>
  <div class="media">
    <div class="upload-wrapper" style="margin: 10px;">
      <a-upload-dragger
        name="file"
        :multiple="true"
        :action="uploadAction"
        :customRequest="customRequest"
        @change="handleChange"
      >
        <p class="ant-upload-drag-icon">
          <a-icon type="inbox" />
        </p>
        <p class="ant-upload-text">点击或拖拽文件到这个区域进行上传</p>
      </a-upload-dragger>
    </div>

    <div class="img-wrapper">
      <a-card
        hoverable
        class="img-card"
        v-for="(item, index) in list"
        :key="item.id"
        @click="showDrawer(index, item)"
      >
        <!-- <a href="#" slot="extra">more</a> -->
        <div
          class="file-wrapper"
          slot="cover"
        >
          <img
            v-if="isImg(item)"
            :alt="item.originalname"
            :src="item.url"
          />
          <div v-else>
            {{ item.originalname }}
          </div>
        </div>
        <!-- <a-card-meta title="xxx">
          <template slot="description">{{ item.originalname }}</template>
        </a-card-meta> -->
      </a-card>
    </div>

    <a-drawer
      title="详情"
      placement="right"
      @close="onCloseDrawer"
      :visible="drawerVisible"
      width="640"
      :drawerStyle="drawerStyle"
    >
      <template v-if="currImg">
        <div class="the-previewer-wrapper">
          <a-carousel arrows :dots="false" ref="carousel" :afterChange="afterChange">
            <div
              slot="prevArrow"
              class="custom-slick-arrow"
              style="left: 10px;zIndex: 1"
            >
              <a-icon type="left" />
            </div>
            <div slot="nextArrow" class="custom-slick-arrow" style="right: 10px">
              <a-icon type="right" />
            </div>
            <div
              v-for="item in list"
              :key="item.id"
            >
              <img
                v-if="isImg(item)"
                :alt="item.originalname"
                :src="item.url"
                slot="cover"
              />
              <div v-else>
                {{ item.originalname }} <span style="color: #999;font-size: 12px;">(此文件不支持预览)</span>
              </div>
            </div>
          </a-carousel>
        </div>
        <a-row class="drawer-row" type="flex" align="top">
          <a-col :span="6">
            <span class="label">文件名</span>
          </a-col>
          <a-col :span="18">
            {{ currImg.originalname }}
          </a-col>
        </a-row>
        <a-row class="drawer-row" type="flex" align="top">
          <a-col :span="6">
            <span class="label">URL</span>
          </a-col>
          <a-col :span="18">
            <p style="margin: 0;">
              <a-input readonly :value="currImg.url"/>
            </p>
            <p style="margin: 0; padding-left: 4px; font-size: 12px;">
              <a :download="currImg.originalname" :href="currImg.url">下载</a>
              <span class="mx10" style="margin: 0 10px;">|</span>
              <a :href="currImg.url" target="_blank">打开文件 URL</a>
              <span class="mx10" style="margin: 0 10px;">|</span>
              <a
                v-clipboard:copy="currImg.url"
                v-clipboard:success="onCopy"
                v-clipboard:error="onError"
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
      </template>
    </a-drawer>
  </div>
</template>

<script>
import { getMediaList } from '@/api/media'
export default {
  data () {
    return {
      uploadAction: '/media/upload',
      list: [],
      drawerVisible: false,
      currImg: null,
      drawerStyle: {
        'margin-top': '65px'
      },
      message: 'Copy These Text'
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    isImg (item) {
      // return true
      return item.mimetype.includes('image')
      // console.log(name)
      // const imgTypeList = ['.png', '.jpg', '.jpeg', '.bmp', '.gif']
      // return imgTypeList.some(type => name.includes(type))
    },
    async fetchData () {
      const list = await getMediaList()
      console.log('list: ', list)
      this.list = list
    },
    showDrawer (index, item) {
      // if (!this.isImg(item)) {
      //   this.$message.info('此文件不支持预览')
      //   return
      // }
      this.currImg = item
      this.drawerVisible = true
      this.$nextTick(() => {
        console.log(this.$refs.carousel)
        this.$refs.carousel.goTo(index, true)
      })
    },
    afterChange (current) {
      this.currImg = this.list[current]
    },
    onCloseDrawer () {
      this.drawerVisible = false
    },
    handleChange (info) {
      const status = info.file.status
      if (status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      if (status === 'done') {
        this.$message.success(`${info.file.name} file uploaded successfully.`)
      } else if (status === 'error') {
        this.$message.error(`${info.file.name} file upload failed.`)
      }
    },
    async customRequest (...args) {
      const formData = new FormData()
      formData.append('file', args[0].file, args[0].file.name)

      const resp = await this.$http.post(
        this.uploadAction,
        formData,
        {
          contentType: false,
          processData: false,
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }
      )
      console.log('upload resp:', resp)
      this.$message.success('上传成功')
    },
    onCopy (e) {
      this.$message.success('您已成功复制: ' + e.text)
    },
    onError (e) {
      this.$message.error('复制失败')
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

  .img-wrapper {
    display: flex;
    flex-wrap: wrap;

    .img-card {
      // width: 240px;
      // height: 300px;
      width: 200px;
      height: 240px;
      margin: 10px;
      display: flex;
      justify-content: center;
      align-items: center;

      .file-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;

        img {
          width: auto;
          max-width: 100%;
          max-height: 100%;
        }
      }
    }
  }
}
.the-previewer-wrapper {

  height: 360px;
  margin-bottom: 20px;

  .ant-carousel {
    .slick-slide {
      text-align: center;
      height: 360px;
      line-height: 360px;
      overflow: hidden;
      background-color: #f5f5f5;
    }
    .slick-slide img {
      display: inline-block;
      max-width: 100%;
    }
    .custom-slick-arrow {
      width: 25px;
      height: 45px;
      line-height: 45px;
      font-size: 25px;
      color: #fff;
      background-color: rgba(31, 45, 61, 0.11);
      opacity: 0.5;
    }
    .custom-slick-arrow:before {
      display: none;
    }
    .custom-slick-arrow:hover {
      opacity: 0.8;
    }
  }

}
.drawer-row {
  margin-bottom: 20px;
  line-height: 30px;

  div:first-child {
    text-align: right;
    padding-right: 16px;
  }
}
</style>
