<template>
  <page-view :avatar="avatar" :title="false">
    <div slot="headerContent">
      <div class="title">{{ timeFix }}，{{ user.username }}<span class="welcome-text">，{{ welcome }}</span></div>
      <div>前端工程师 | 蚂蚁金服 - 某某某事业群 - VUE平台</div>
    </div>
    <div slot="extra">
      <a-row class="more-info">
        <a-col :span="6">
          <a-tooltip placement="top">
            <template slot="title">
              <span>您已经写了 56 篇文章，再接再厉！</span>
            </template>
            <div>
              <router-link :to="{ name: 'blog-list' }">
                <head-info style="text-align: center; padding: 0;" title="文章" content="56" :center="false" :bordered="false"/>
              </router-link>
            </div>
          </a-tooltip>
          <!-- <a-tooltip placement="top">
            <template slot="title">
              <span>您已经写了 56 篇文章，再接再厉！</span>
            </template>
            <router-link :to="{ name: 'blog-list' }">
              <head-info style="text-align: center; padding: 0;" title="文章" content="56" :center="false" :bordered="false"/>
            </router-link>
          </a-tooltip> -->
        </a-col>
        <a-col :span="6">
          <router-link :to="{ name: 'blog-cate' }">
            <head-info style="text-align: center; padding: 0;" title="目录" content="24" :center="false" :bordered="false"/>
          </router-link>
        </a-col>
        <a-col :span="6">
          <router-link :to="{ name: 'blog-tags' }">
            <head-info style="text-align: center; padding: 0;" title="标签" content="2,223" :center="false" />
          </router-link>
        </a-col>
        <a-col :span="6">
          <router-link :to="{ name: '' }">
            <head-info style="text-align: center; padding: 0;" title="评论" content="2,223" :center="false" />
          </router-link>
        </a-col>
      </a-row>
    </div>

    <div>
      <a-row :gutter="24">
        <a-col v-bind="leftCol">
          <!-- <projects-vue /> -->
          <activity-vue />
        </a-col>
        <a-col style="padding: 0 12px" v-bind="rightCol">
          <draft-vue />
          <!-- <nav-vue /> -->
        </a-col>
      </a-row>
    </div>
  </page-view>
</template>

<script>
import { timeFix } from '@/utils/util'
import { mapState } from 'vuex'

import { PageView } from '@/layouts'
import HeadInfo from '@/components/tools/HeadInfo'
// import { Radar } from '@/components'

import DraftVue from './modules/Draft.vue'
import NavVue from './modules/Nav.vue'
import ActivityVue from './modules/Activity.vue'
import ProjectsVue from './modules/Projects.vue'
// import { getRoleList, getServiceList } from '@/api/manage'

// const DataSet = require('@antv/data-set')

export default {
  name: 'Workplace',
  components: {
    PageView,
    HeadInfo,
    // Radar,
    NavVue,
    DraftVue,
    ActivityVue,
    ProjectsVue
  },
  data () {
    return {
      timeFix: timeFix(),
      avatar: '',
      user: {},

      leftCol: {
        xl: 12, lg: 12, md: 24, sm: 24, xs: 24
      },
      rightCol: {
        xl: 12, lg: 12, md: 24, sm: 24, xs: 24
      }
    }
  },
  computed: {
    ...mapState({
      nickname: (state) => state.user.nickname,
      welcome: (state) => state.user.welcome
    }),
    userInfo () {
      return this.$store.getters.userInfo
    }
  },
  created () {
    this.user = this.userInfo
    this.avatar = this.userInfo.avatar
  },
  mounted () {},
  methods: {}
}
</script>

<style lang="less" scoped>
  .project-list {

    .card-title {
      font-size: 0;

      a {
        color: rgba(0, 0, 0, 0.85);
        margin-left: 12px;
        line-height: 24px;
        height: 24px;
        display: inline-block;
        vertical-align: top;
        font-size: 14px;

        &:hover {
          color: #1890ff;
        }
      }
    }
    .card-description {
      color: rgba(0, 0, 0, 0.45);
      height: 44px;
      line-height: 22px;
      overflow: hidden;
    }
    .project-item {
      display: flex;
      margin-top: 8px;
      overflow: hidden;
      font-size: 12px;
      height: 20px;
      line-height: 20px;
      a {
        color: rgba(0, 0, 0, 0.45);
        display: inline-block;
        flex: 1 1 0;

        &:hover {
          color: #1890ff;
        }
      }
      .datetime {
        color: rgba(0, 0, 0, 0.25);
        flex: 0 0 auto;
        float: right;
      }
    }
    .ant-card-meta-description {
      color: rgba(0, 0, 0, 0.45);
      height: 44px;
      line-height: 22px;
      overflow: hidden;
    }
  }

  .item-group {
    padding: 20px 0 8px 24px;
    font-size: 0;
    a {
      color: rgba(0, 0, 0, 0.65);
      display: inline-block;
      font-size: 14px;
      margin-bottom: 13px;
      width: 25%;
    }
  }

  .members {
    a {
      display: block;
      margin: 12px 0;
      line-height: 24px;
      height: 24px;
      .member {
        font-size: 14px;
        color: rgba(0, 0, 0, .65);
        line-height: 24px;
        max-width: 100px;
        vertical-align: top;
        margin-left: 12px;
        transition: all 0.3s;
        display: inline-block;
      }
      &:hover {
        span {
          color: #1890ff;
        }
      }
    }
  }

  .mobile {

    .project-list {

      .project-card-grid {
        width: 100%;
      }
    }

    .more-info {
      border: 0;
      padding-top: 16px;
      margin: 16px 0 16px;
    }

    .headerContent .title .welcome-text {
      display: none;
    }
  }

</style>
