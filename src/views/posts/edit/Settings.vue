<template>
  <div class="settings">
    <a-collapse accordion @change="onCollapseChange">
      <a-collapse-panel header="选择标签" key="tags">
        <a-select mode="tags" style="width: 100%" v-model="payload.tags" @change="handleChange">
          <a-select-option
            v-for="item in tags"
            :key="item.id"
          >
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-collapse-panel>
      <a-collapse-panel header="选择分类目录" key="cates">
        <a-checkbox-group :options="catesOptions" v-model="payload.categories" @change="onCateChange" />
      </a-collapse-panel>
      <a-collapse-panel key="img">
        <template slot="header">
          特色图片
        </template>
        <a-button @click.stop="picModalVisible = true">选择图片</a-button>
      </a-collapse-panel>
      <a-collapse-panel header="摘要" key="summary">
        撰写摘要（可选）
        <a-textarea @input="onInput" @change="onChange" v-model="payload.summary" />
      </a-collapse-panel>
      <a-collapse-panel header="固定连接" key="slug">
        <a-input v-model="payload.slug" />
      </a-collapse-panel>
    </a-collapse>
    <pic-selector v-if="modalInstance" :visible.sync="picModalVisible" />
  </div>
</template>

<script>
// import pinyin from 'pinyin'
import PicSelector from './PicSelector'
import { getTagsList } from '@/api/tags'
import { getCateList } from '@/api/category'
export default {
  components: { PicSelector },
  props: {
    formValues: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      modalInstance: false,
      picModalVisible: false,
      tags: [],
      cates: [],
      payload: {
        tags: [],
        categories: [],
        img: '',
        summary: '',
        slug: '', // 自定义的
        generated_slug: '' // 自动生成的
      },
      slugCostom: false
    }
  },
  computed: {
    catesOptions () {
      return this.cates.map(item => {
        return {
          label: item.name,
          value: item.id
        }
      })
    // },
    // transToPinyin () {
    //   // 标点符号是否要处理
    //   const title = this.formValues.title
    //   this.formValues.pinged = pinyin(value, {
    //     style: pinyin.STYLE_NORMAL
    //   }).join('-')
    }
  },
  watch: {
    formValues () {
      console.log('watch formValues: ', this.formValues)
      this.initPayload()
      this.payload.slug = this.formValues.title
    }
  },
  methods: {
    initPayload () {
      const { tags, categories, img, summary, slug } = this.formValues
      this.payload = {
        tags: tags && JSON.parse(tags),
        categories: categories && JSON.parse(categories),
        img,
        summary,
        slug
      }
      console.log(JSON.stringify(this.payload))
    },
    async fetch () {
      await getTagsList()
    },
    async onCollapseChange (key) {
      if (key === 'tags' && this.tags.length === 0) {
        const resp = await getTagsList()
        resp.forEach(item => (item.id = String(item.id)))
        this.tags = resp
      }
      if (key === 'cates' && this.cates.length === 0) {
        const resp = await getCateList()
        resp.forEach(item => (item.id = String(item.id)))
        this.cates = resp
      }
      if (key === 'img') {
        this.modalInstance = true
      }
    },
    handleChange (value) {
      console.log(`selected ${value}`)
      console.log(this.payload.tags)
    },
    onCateChange (checkedValues) {
      console.log('checked = ', checkedValues)
      console.log('value = ', this.payload.categories)
    },
    onInput () {
      console.log('onInput')
    },
    onChange () {
      console.log('change')
    }
  }
}
</script>
