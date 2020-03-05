<template>
  <a-card :loading="loading" title="动态" :bordered="false">
    <h4>最近发布</h4>
    <a-list>
      <a-list-item :key="index" v-for="(item, index) in list">
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
  </a-card>
</template>

<script>
import moment from 'moment'
import { getBlogList } from '@/api/blog'
export default {
  data () {
    return {
      loading: false,
      list: []
    }
  },
  created () {
    console.log('created')
    this.fetch()
  },
  filters: {
    formatTime (value) {
      return moment(parseInt(value)).format('YYYY-MM-DD a hh:mm:ss')
    }
  },
  methods: {
    async fetch () {
      this.loading = true
      const resp = await getBlogList({
        pageSize: 5,
        pageNo: 1
      })
      this.loading = false
      this.list = resp.data
    }
  }
}
</script>
