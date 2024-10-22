<script setup>
import BreadcrumbsComponent from "@/components/BreadcrumbsComponent.vue";
import { useRoute } from "vue-router";

const route = useRoute();
const lotName = route.query.lotName;
</script>

<template>
  <div>
    <main id="main">
      <BreadcrumbsComponent backgroundImage="/03.jpg">
        <template #title>
          <!-- 插入到 title 插槽 -->
          <h2>Reservation & MonthlyRental</h2>
        </template>
        <template #page>
          <!-- 插入到 page 插槽 -->
          預約、月租服務
        </template>
      </BreadcrumbsComponent>
      <section>
        <h2>{{ lotName }}</h2>
        <div
          class="col-xl-5 fadeInRight animated"
          data-animation="fadeInRight"
          data-delay="1s"
          style="animation-delay: 1s"
        >
          <div class="ticket-form p-5">
            <h2 class="text-dark text-uppercase mb-4">預約</h2>
            <form>
              <div class="row g-4">
                <div class="col-12">
                  <input
                    type="text"
                    class="form-control border-0 py-2"
                    id="name"
                    placeholder="Your Name"
                  />
                </div>
                <div class="col-12 col-xl-6">
                  <input
                    type="email"
                    class="form-control border-0 py-2"
                    id="email"
                    placeholder="Your Email"
                  />
                </div>
                <div class="col-12 col-xl-6">
                  <input
                    type="phone"
                    class="form-control border-0 py-2"
                    id="phone"
                    placeholder="Phone"
                  />
                </div>
                <div class="col-12">
                  <select
                    class="form-select border-0 py-2"
                    aria-label="Default select example"
                  >
                    <option selected>Select Packages</option>
                    <option value="1">Family Packages</option>
                    <option value="2">Basic Packages</option>
                    <option value="3">Premium Packages</option>
                  </select>
                </div>
                <div class="col-12">
                  <input class="form-control border-0 py-2" type="date" />
                </div>
                <div class="col-12">
                  <input
                    type="number"
                    class="form-control border-0 py-2"
                    id="number"
                    placeholder="Guest"
                  />
                </div>
                <div class="col-12">
                  <button type="button" class="btn btn-primary w-100 py-2 px-5">
                    Book Now
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<style lang="css" scoped>
.ticket-form {
  background: rgba(137, 177, 189, 0.979);
  border-radius: 10px;
}
</style>
