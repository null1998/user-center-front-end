<!-- 公告牌通用组件 -->
<template>
  <div>
    <div class="main">
      <div class="signboard">
        <div class="sign">{{sign}}</div>
        <div class="strings"></div>
        <div class="pin top"></div>
        <div class="pin left"></div>
        <div class="pin right"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: '',
  props:{
    sign:{type:String,required:true,default:""}
  },
  data () {
    return {
    }
  }
}

</script>
<style>
.main {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  /* background: radial-gradient(circle at center 60%, white, sandybrown); */
}

.signboard {
  width: 400px;
  height: 300px;
  position: relative;
  animation: swinging 1.5s ease-in-out infinite alternate;
  transform-origin: 200px 13px;
}

.sign {
  width: 100%;
  height: 200px;
  background: burlywood;
  border-radius: 15px;
  position: absolute;
  bottom: 0;
  font-size: 50px;
  color: saddlebrown;
  font-family: serif;
  font-weight: bold;
  text-align: center;
  line-height: 200px;
  text-shadow: 0 2px 0 rgba(255, 255, 255, 0.3), 0 -2px 0 rgba(0, 0, 0, 0.7);
}

.strings {
  width: 150px;
  height: 150px;
  border: 5px solid brown;
  position: absolute;
  border-right: none;
  border-bottom: none;
  transform: rotate(45deg);
  top: 38px;
  left: 122px;
}

.pin {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  position: absolute;
}

.pin.top {
  background: gray;
  left: 187px;
}

.pin.left,
.pin.right {
  background: brown;
  top: 110px;
  box-shadow: 0 2px 0 rgba(255, 255, 255, 0.3);
}

.pin.left {
  left: 80px;
}

.pin.right {
  right: 80px;
}

@keyframes swinging {
  from {
    transform: rotate(10deg);
  }

  to {
    transform: rotate(-10deg);
  }
}
</style>
