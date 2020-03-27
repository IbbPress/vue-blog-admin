<template>
  <div class="file-thumb">
    <img v-if="isImg(file)" :alt="file.originalname" :src="file.url" />
    <template v-else>
      <div class="centered">
        {{ file.mimetype }}
      </div>
      <div class="filename">
        {{ file.originalname }}
      </div>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    file: {
      type: Object,
      required: true
    }
  },
  methods: {
    isImg (item) {
      return item.mimetype.includes('image')
    }
  }
}
</script>

<style lang="less" scoped>
.file-thumb {
  width: 100%;
  height: 100%;
  background-color: #ccc;
  display: flex;
  flex-direction: column;
  box-shadow: inset 0 0 15px rgba(0,0,0,.1), inset 0 0 0 1px rgba(0,0,0,.05);
  background: #eee;
  transition: opacity .1s;

  &.selsctable {
    opacity: .65;
    &.checked {
      opacity: 1;
    }
  }

  .filename {
    background-color: #fff;
    height: 28px;
    line-height: 28px;
    text-align: center;
  }
  .centered {
    flex: 1 1 auto;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
