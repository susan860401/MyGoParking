<script setup>
import BreadcrumbsComponent from "@/components/BreadcrumbsComponent.vue";
</script>

<template>
  <main id="main">
    <!-- 麵包屑 -->
    <BreadcrumbsComponent
      backgroundImage="/src/assets/images/parkingLot_top2.png"
    >
      <template #title>
        <!-- 插入到 title 插槽 -->
        <h2>Support</h2>
      </template>
      <template #page>
        <!-- 插入到 page 插槽 -->
        客服中心
      </template>
    </BreadcrumbsComponent>

    <!-- 主內容區塊 -->
    <div class="container" data-aos="fade-up">
      <div class="row">
        <div class="col-md-5 contact">
          <h3 class="mb-4">聯絡我們</h3>
          <h3 class="fw-bold">MyGO Parking</h3>
          <br />
          <p>801高雄市前金區中正四路211號8號樓之1</p>
          <p>Phone: 07 969 9885</p>
          <p>Email: Mygoparking_Service@gmail.com</p>
        </div>
        <div class="col-md-7">
          <div class="feature-box">
            <h5>掃描 QR Code 與我們聯絡</h5>
            <p>
              加入LINE官方帳號，與客服團隊取得聯繫。
              立即綁定會員，即可進行車位預訂等查詢。
            </p>
            <img
              width="150"
              height="150"
              src="https://qr-official.line.me/gs/M_216bwlts_BW.png?oat_content=qr"
            />
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style lang="css" scoped>
.container {
  padding-top: 50px;
}

.contact {
}

.feature-box {
  background-color: #f1f1f1;
  background: linear-gradient(to right, #eef1f4 0%, white 100%);
  border-radius: 10px;
  padding: 15px;
  text-align: center;
}
.feature-box h5 {
  color: #007bff;
  font-weight: bold;
}
</style>
