<script setup>
import BreadcrumbsComponent from "@/components/BreadcrumbsComponent.vue";
</script>

<template>
  <main id="main">
    <!-- 麵包屑 -->
    <BreadcrumbsComponent>
      <template #title>
        <!-- 插入到 title 插槽 -->
        <h2>Guide & Rules</h2>
      </template>
      <template #page>
        <!-- 插入到 page 插槽 -->
        使用者教學及規範
      </template>
    </BreadcrumbsComponent>

    <!-- ======= guide Section ======= -->
    <section id="guide" class="guide">
      <img src="/src/images/guide_car.svg" alt="">
      <div class="my_container shadow" data-aos="fade-up">
        <div class="container invisible d-flex flex-column">
          <div class="row visible flex-grow-1" style="flex-basis: 15%;">
            <div class="question col-12">
              <div class="row my-3">
                <div class="box col-6 col-lg-3">
                  <a href="javascript: void(0)" class="btn" @click="console.log('test')">
                      停車搜尋
                      <span></span><span></span><span></span><span></span>
                  </a>
                </div>
                <div class="box col-6 col-lg-3">
                  <a href="javascript: void(0)" class="btn">
                      預訂服務
                      <span></span><span></span><span></span><span></span>
                  </a>
                </div>
                <div class="box col-6 col-lg-3">
                  <a href="javascript: void(0)" class="btn">
                      月租服務
                      <span></span><span></span><span></span><span></span>
                  </a>
                </div>
                <div class="box col-6 col-lg-3">
                  <a href="javascript: void(0)" class="btn">
                      繳費系統
                      <span></span><span></span><span></span><span></span>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div class="row visible flex-grow-1" style="flex-basis: 80%;">
            <div class="dec col-12">
                
            </div>
          </div>
          <div class="row visible flex-grow-1" style="flex-basis: 5%;">
            <div class="answer col-12">
              <button class="page-button">Prev</button>
              <button class="page-button">Next</button>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- End guide Section -->
  </main>
</template>

<style lang="css" scoped>
.guide{
  position: relative;
  border: 0px;
  height: 100vh;
  background-color: rgb(245, 246, 247);
  /* background-image: url("/guide.jpg"); */
  background-position: center center; /* 讓圖片在背景中置中 */
  background-size: cover; /* 使圖片自動縮放以適應容器，保持圖片比例 */
  background-repeat: no-repeat; /* 防止背景圖片重複 */
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0.8;
}
.guide>img{
  width: 50vw;
  position: absolute;
  right: 0;
  bottom: -10vw;
  background-position: center center; /* 讓圖片在背景中置中 */
  background-size: cover; /* 使圖片自動縮放以適應容器，保持圖片比例 */
  background-repeat: no-repeat; /* 防止背景圖片重複 */
}
.my_container{
  display:flex;
  margin:auto;
  border-radius: 10px;
  border: 1px solid gray;
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(5px);
  height: 90vh;
  width: 90vw;
  box-shadow: 10px;
  justify-content: center;
  align-content: baseline;
}
.question{
  height: auto;
  width: inherit;
  position: relative;
  display: flex;
  justify-content: space-around;
  margin: auto;
}
.person, .dec{
  display: flex;
  align-items: center;
}
.person img{
  position: relative;
  width: 10vw;
  /* transform: translate(100%,30%); */
}
.answer{
  width: 100%;
  /* position: absolute; */
  display: flex;
  justify-content: space-between;
  bottom: 5%;
}
.box{
  display: inline-flex;
  justify-content: center;
  align-items: center;
} 

.btn {
  text-wrap: nowrap;
  display: inline-block;
  position: relative;
  z-index: 1;
  min-width: auto;
  background: #FFFFFF;
  border: 2px solid goldenrod;
  border-radius: 4px;
  color: goldenrod ;
  font-size: 1rem;
  text-transform: uppercase;
  font-weight: bold;
  text-align: center;
  text-decoration: none;
  overflow: hidden;
  transition: 0.5s;
  padding: 10px 20px;
}
.btn span {
    position: absolute;
    width: 25%;
    height: 100%;
    background-color: goldenrod;
    transform: translateY(150%);
    border-radius: 50%;
    left: calc((var(--n) - 1) * 25%);
    transition: 0.5s;
    transition-delay: calc((var(--n) - 1) * 0.1s);
    z-index: -1;
}
.btn:hover,
.btn:focus {
    color: black;
}
.btn:hover span {
    transform: translateY(0) scale(2);
}
.btn span:nth-child(1) {
    --n: 1;
}
.btn span:nth-child(2) {
    --n: 2;
}
.btn span:nth-child(3) {
    --n: 3;
}
.btn span:nth-child(4) {
    --n: 4;
}



.page-button {
  --bg: goldenrod;
  --text-color: #fff;
  position: relative;
  max-width: 30vw;
  border: none;
  background: var(--bg);
  color: var(--text-color);
  padding: 1em;
  font-weight: bold;
  text-transform: uppercase;
  transition: 0.2s;
  border-radius: 5px;
  opacity: 0.8;
  letter-spacing: 1px;
  box-shadow: goldenrod 0px 7px 2px, #000 0px 8px 5px;
  transform: translateY(-30%);
}

.page-button:hover {
  opacity: 1;
}

.page-button:active {
  top: 4px;
  box-shadow: rgb(223, 176, 57) 0px 3px 2px,#000 0px 3px 5px;
}





</style>
