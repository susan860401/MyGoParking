<script setup>
import BreadcrumbsComponent from "@/components/BreadcrumbsComponent.vue";
</script>

<template>
  <div>
    <main id="main">
      <!-- 麵包屑 -->
      <BreadcrumbsComponent>
        <template #title>
          <!-- 插入到 title 插槽 -->
          <h2>Search Parking</h2>
        </template>
        <template #page>
          <!-- 插入到 page 插槽 -->
          查找停車位
        </template>
      </BreadcrumbsComponent>

      <!-- ======= About Section ======= -->
      <section id="about" class="about">
        <div class="container" data-aos="fade-up">
          <div class="row position-relative">
            <div
              class="col-lg-7 about-img"
              style="background-image: url(src/assets/images/about.jpg)"
            ></div>

            <div class="col-lg-7">
              <h2>Consequatur eius et magnam</h2>
              <div class="our-story">
                <h4>Est 1988</h4>
                <h3>Our Story</h3>
                <p>
                  Inventore aliquam beatae at et id alias. Ipsa dolores amet
                  consequuntur minima quia maxime autem. Quidem id sed ratione.
                  Tenetur provident autem in reiciendis rerum at dolor. Aliquam
                  consectetur laudantium temporibus dicta minus dolor.
                </p>
                <ul>
                  <li>
                    <i class="bi bi-check-circle"></i>
                    <span>Ullamco laboris nisi ut aliquip ex ea commo</span>
                  </li>
                  <li>
                    <i class="bi bi-check-circle"></i>
                    <span>Duis aute irure dolor in reprehenderit in</span>
                  </li>
                  <li>
                    <i class="bi bi-check-circle"></i>
                    <span>Ullamco laboris nisi ut aliquip ex ea</span>
                  </li>
                </ul>
                <p>
                  Vitae autem velit excepturi fugit. Animi ad non. Eligendi et
                  non nesciunt suscipit repellendus porro in quo eveniet.
                  Molestias in maxime doloremque.
                </p>

                <div
                  class="watch-video d-flex align-items-center position-relative"
                >
                  <i class="bi bi-play-circle"></i>
                  <a
                    href="https://www.youtube.com/watch?v=LXb3EKWsInQ"
                    class="glightbox stretched-link"
                    >Watch Video</a
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <!-- End About Section -->
    </main>
  </div>
</template>

<style lang="css" scoped></style>
