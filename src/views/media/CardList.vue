<template>
  <div class="img-wrapper">
    <a-card
      hoverable
      class="img-card"
      v-for="(item, index) in list"
      :key="item.id"
      @click="onClick(index)"
    >
      <div class="file-wrapper" slot="cover">
        <file-thumb :class="{ selsctable: selsctable, checked: item.checked }" :file="item"/>
        <div v-show="selsctable" class="select-mask">
          <a-checkbox class="checkbox-btn" :checked="item.checked" @change="e => onChange(e, item)" />
        </div>
      </div>
    </a-card>
  </div>
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
    selsctable: {
      type: Boolean,
      required: false,
      default () {
        return false
      }
    }
  },
  methods: {
    onClick (index) {
      const item = this.list[index]
      if (this.selsctable) {
        item.checked = !item.checked
      } else {
        this.$emit('preview', index)
      }
    },
    onChange (e, item) {
      item.checked = e.target.checked
    }
  }
}
</script>

<style lang="less">
.img-wrapper {
  display: flex;
  flex-wrap: wrap;

  .img-card {
    // width: 240px;
    // height: 300px;
    width: 140px;
    height: 140px;
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
.img-wrapper {
  .ant-card-cover {
    width: 100%;
    height: 100%;
    .file-wrapper {
      position: relative;
      width: 100%;
      height: 100%;
      .select-mask {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        z-index: 100;
        .checkbox-btn {
          position: absolute;
          top: 0;
          right: 0;
          transform: translate(50%, -50%);
        }
      }
    }
  }
}
</style>
