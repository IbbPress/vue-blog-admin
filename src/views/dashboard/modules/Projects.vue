<template>
  <a-card
    class="project-list"
    :loading="loading"
    style="margin-bottom: 24px;"
    :bordered="false"
    title="进行中的项目"
    :body-style="{ padding: 0 }">
    <a slot="extra">全部项目</a>
    <div>
      <a-card-grid class="project-card-grid" :key="i" v-for="(item, i) in projects">
        <a-card :bordered="false" :body-style="{ padding: 0 }">
          <a-card-meta>
            <div slot="title" class="card-title">
              <a-avatar size="small" :src="item.cover"/>
              <a>{{ item.title }}</a>
            </div>
            <div slot="description" class="card-description">
              {{ item.description }}
            </div>
          </a-card-meta>
          <div class="project-item">
            <a href="/#/">科学搬砖组</a>
            <span class="datetime">9小时前</span>
          </div>
        </a-card>
      </a-card-grid>
    </div>
  </a-card>
</template>

<script>
export default {
  data () {
    return {
      loading: true,
      projects: []
    }
  }
}
</script>
