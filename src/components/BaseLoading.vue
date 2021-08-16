<script>
export default {
  setup(props, { attrs }) {
    return {
      attrs,
    };
  },
};
</script>

<template>
  <Loading :active="attrs.isLoading" :background-color="'black'">
    <div class="loading-wrap">
      <div class="loading-inner">
        <div><div></div></div>
        <div><div></div></div>
        <div><div></div></div>
        <div><div></div></div>
        <div><div></div></div>
        <div><div></div></div>
        <div><div></div></div>
        <div><div></div></div>
      </div>
    </div>
  </Loading>
</template>




<style scoped>
@keyframes loading-inner {
  0% {
    opacity: 1;
    backface-visibility: hidden;
    transform: translateZ(0) scale(1.5, 1.5);
  }
  100% {
    opacity: 0;
    backface-visibility: hidden;
    transform: translateZ(0) scale(1, 1);
  }
}
.loading-inner div > div {
  position: absolute;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #0fb47e;
  animation: loading-inner 1s linear infinite;
}
.loading-inner div:nth-child(1) > div {
  left: 148px;
  top: 88px;
  animation-delay: -0.875s;
}
.loading-inner > div:nth-child(1) {
  transform: rotate(0deg);
  transform-origin: 160px 100px;
}
.loading-inner div:nth-child(2) > div {
  left: 130px;
  top: 130px;
  animation-delay: -0.75s;
}
.loading-inner > div:nth-child(2) {
  transform: rotate(45deg);
  transform-origin: 142px 142px;
}
.loading-inner div:nth-child(3) > div {
  left: 88px;
  top: 148px;
  animation-delay: -0.625s;
}
.loading-inner > div:nth-child(3) {
  transform: rotate(90deg);
  transform-origin: 100px 160px;
}
.loading-inner div:nth-child(4) > div {
  left: 46px;
  top: 130px;
  animation-delay: -0.5s;
}
.loading-inner > div:nth-child(4) {
  transform: rotate(135deg);
  transform-origin: 58px 142px;
}
.loading-inner div:nth-child(5) > div {
  left: 28px;
  top: 88px;
  animation-delay: -0.375s;
}
.loading-inner > div:nth-child(5) {
  transform: rotate(180deg);
  transform-origin: 40px 100px;
}
.loading-inner div:nth-child(6) > div {
  left: 46px;
  top: 46px;
  animation-delay: -0.25s;
}
.loading-inner > div:nth-child(6) {
  transform: rotate(225deg);
  transform-origin: 58px 58px;
}
.loading-inner div:nth-child(7) > div {
  left: 88px;
  top: 28px;
  animation-delay: -0.125s;
}
.loading-inner > div:nth-child(7) {
  transform: rotate(270deg);
  transform-origin: 100px 40px;
}
.loading-inner div:nth-child(8) > div {
  left: 130px;
  top: 46px;
  animation-delay: 0s;
}
.loading-inner > div:nth-child(8) {
  transform: rotate(315deg);
  transform-origin: 142px 58px;
}
.loading-wrap {
  width: 200px;
  height: 200px;
  display: inline-block;
  overflow: hidden;
  background: none;
}
.loading-inner {
  width: 100%;
  height: 100%;
  position: relative;
  transform: translateZ(0) scale(1);
  backface-visibility: hidden;
  transform-origin: 0 0;
}
.loading-inner div {
  box-sizing: content-box;
}
</style>