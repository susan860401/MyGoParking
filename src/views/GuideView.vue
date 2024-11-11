<script setup>
import BreadcrumbsComponent from "@/components/BreadcrumbsComponent.vue";
import { onMounted, ref } from "vue";

const carouselSearch = ref(null)
const carouselReservation = ref(null)
const carouselMonthly = ref(null)
const carouselPayment = ref(null)

onMounted( () => {
  carouselSearch.value = document.getElementById('carouselSearchCaptions');
  carouselReservation.value = document.getElementById('carouselReservationCaptions');
  carouselMonthly.value = document.getElementById('carouselMonthlyCaptions');
  carouselPayment.value = document.getElementById('carouselPaymentCaptions');
  Guide('Search');
})

const Guide = (guide) => {
  // 先隱藏所有輪播
  carouselSearch.value.classList.remove('show');
  carouselReservation.value.classList.remove('show');
  carouselMonthly.value.classList.remove('show');
  carouselPayment.value.classList.remove('show');

  // 根據傳入的 guide 顯示對應的輪播
  switch (guide) {
    case 'Search':
      carouselSearch.value.classList.add('show');
      break;
    case 'Reservation':
      carouselReservation.value.classList.add('show');
      break;
    case 'Monthly':
      carouselMonthly.value.classList.add('show');
      break;
    case 'Payment':
      carouselPayment.value.classList.add('show');
      break;
    default:
      console.warn('Unknown guide:', guide);
  }
};
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
                  <a href="javascript: void(0)" class="btn" @click.prevent="Guide('Search')">
                      停車搜尋
                      <span></span><span></span><span></span><span></span>
                  </a>
                </div>
                <div class="box col-6 col-lg-3">
                  <a href="javascript: void(0)" class="btn" @click.prevent="Guide('Reservation')">
                      預訂服務
                      <span></span><span></span><span></span><span></span>
                  </a>
                </div>
                <div class="box col-6 col-lg-3">
                  <a href="javascript: void(0)" class="btn" @click.prevent="Guide('Monthly')">
                      月租服務
                      <span></span><span></span><span></span><span></span>
                  </a>
                </div>
                <div class="box col-6 col-lg-3">
                  <a href="javascript: void(0)" class="btn" @click.prevent="Guide('Payment')">
                      繳費系統
                      <span></span><span></span><span></span><span></span>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div class="row visible flex-grow-1" style="flex-basis: 80%;">
            <div class="dec col-12">
                <div class="row w-100">
                  <div class="col-12 col-md-12">
                    <!-- <h1 style="text-align: center;">請在上方選擇一個想了解的項目</h1> -->
                    <div id="carouselSearchCaptions" class="carousel slide carousel-fade carousel-dark" data-bs-ride="carousel">
                      <div class="carousel-indicators">
                        <button type="button" data-bs-target="#carouselSearchCaptions" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
                        <button type="button" data-bs-target="#carouselSearchCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
                        <button type="button" data-bs-target="#carouselSearchCaptions" data-bs-slide-to="2" aria-label="Slide 3"></button>
                      </div>
                      <div class="carousel-inner">
                        <div class="carousel-item active">
                          <img src="/src/images/guide/Guide-search_bar.png" class="d-block w-100" alt="...">
                          <!-- <div class="carousel-caption text-dark fs-3 d-none d-md-block">
                            <h5>First slide label</h5>
                            <p>Some representative placeholder content for the first slide.</p>
                          </div> -->
                        </div>
                        <div class="carousel-item">
                          <img src="/src/images/guide/Guide-search_bar2.png" class="d-block w-100" alt="...">
                          <!-- <div class="carousel-caption d-none d-md-block">
                            <h5>Second slide label</h5>
                            <p>Some representative placeholder content for the second slide.</p>
                          </div> -->
                        </div>
                        <div class="carousel-item">
                          <img src="/src/images/guide/Guide-search_map.png" class="d-block w-100" alt="...">
                          <!-- <div class="carousel-caption d-none d-md-block">
                            <h5>Third slide label</h5>
                            <p>Some representative placeholder content for the third slide.</p>
                          </div> -->
                        </div>
                      </div>
                      <button class="carousel-control-prev" type="button" data-bs-target="#carouselSearchCaptions" data-bs-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Previous</span>
                      </button>
                      <button class="carousel-control-next" type="button" data-bs-target="#carouselSearchCaptions" data-bs-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Next</span>
                      </button>
                    </div>
                    <div id="carouselReservationCaptions" class="carousel slide carousel-fade carousel-dark" data-bs-ride="carousel">
                      <div class="carousel-indicators">
                        <button type="button" data-bs-target="#carouselReservationCaptions" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
                        <button type="button" data-bs-target="#carouselReservationCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
                        <button type="button" data-bs-target="#carouselReservationCaptions" data-bs-slide-to="2" aria-label="Slide 3"></button>
                      </div>
                      <div class="carousel-inner">
                        <div class="carousel-item active">
                          <img src="/src/images/guide/Guide-search_map.png" class="d-block w-100" alt="...">
                        </div>
                        <div class="carousel-item">
                          <img src="/src/images/guide/Guide-reservation.png" class="d-block w-100" alt="...">
                        </div>
                        <div class="carousel-item">
                          <img src="/src/images/guide/Guide-reservation-choose.png" class="d-block w-100" alt="...">
                        </div>
                      </div>
                      <button class="carousel-control-prev" type="button" data-bs-target="#carouselReservationCaptions" data-bs-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Previous</span>
                      </button>
                      <button class="carousel-control-next" type="button" data-bs-target="#carouselReservationCaptions" data-bs-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Next</span>
                      </button>
                    </div>
                    <div id="carouselMonthlyCaptions" class="carousel slide carousel-fade carousel-dark" data-bs-ride="carousel">
                      <div class="carousel-indicators">
                        <button type="button" data-bs-target="#carouselMonthlyCaptions" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
                        <button type="button" data-bs-target="#carouselMonthlyCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
                        <button type="button" data-bs-target="#carouselMonthlyCaptions" data-bs-slide-to="2" aria-label="Slide 3"></button>
                      </div>
                      <div class="carousel-inner">
                        <div class="carousel-item active">
                          <img src="/src/images/guide/Guide-search_map.png" class="d-block w-100" alt="...">
                        </div>
                        <div class="carousel-item">
                          <img src="/src/images/guide/Guide-monthly.png" class="d-block w-100" alt="...">
                        </div>
                        <div class="carousel-item">
                          <img src="/src/images/guide/Guide-monthly-choose.png" class="d-block w-100" alt="...">
                        </div>
                      </div>
                      <button class="carousel-control-prev" type="button" data-bs-target="#carouselMonthlyCaptions" data-bs-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Previous</span>
                      </button>
                      <button class="carousel-control-next" type="button" data-bs-target="#carouselMonthlyCaptions" data-bs-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Next</span>
                      </button>
                    </div>
                    <div id="carouselPaymentCaptions" class="carousel slide carousel-fade carousel-dark" data-bs-ride="carousel">
                      <div class="carousel-indicators">
                        <button type="button" data-bs-target="#carouselPaymentCaptions" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
                        <button type="button" data-bs-target="#carouselPaymentCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
                      </div>
                      <div class="carousel-inner">
                        <div class="carousel-item active">
                          <img src="/src/images/guide/Guide-payment.png" class="d-block w-100" alt="...">
                        </div>
                        <div class="carousel-item">
                          <img src="/src/images/guide/Guide-payment-next.png" class="d-block w-100" alt="...">
                        </div>
                      </div>
                      <button class="carousel-control-prev" type="button" data-bs-target="#carouselPaymentCaptions" data-bs-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Previous</span>
                      </button>
                      <button class="carousel-control-next" type="button" data-bs-target="#carouselPaymentCaptions" data-bs-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Next</span>
                      </button>
                    </div>
                  </div>
                  <!-- <div class="col-md-6">
                    <div>測試測試</div>
                  </div> -->
                </div>
            </div>
          </div>
          <div class="row visible flex-grow-1" style="flex-basis: 5%;">
            <div class="answer col-12">
              <!-- <button class="page-button">Prev</button> -->
              <!-- <button class="page-button">Next</button> -->
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
  justify-content: center;
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

.carousel {
  display: none;
  opacity: 0;
}

.carousel.show {
  display: block;
  animation: show 0.5s ease-in forwards;
}

@keyframes show {
  0%{
    opacity: 0;
  }
  100%{
    opacity: 1;
  }
}


/* #carouselSearchCaptions{
  display: block;
} */

/* #carouselReservationCaptions{
  display: none;
}
#carouselMonthlyCaptions{
  display: none;
}
#carouselPaymentCaptions{
  display: none;
} */
</style>
