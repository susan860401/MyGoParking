<script setup>
import { ref, computed, onMounted, reactive } from 'vue';
import BreadcrumbsComponent from '@/components/BreadcrumbsComponent.vue';
import axios from 'axios';

</script>


<template>
    <div>
        <main id="main">
            <BreadcrumbsComponent>
                <template #title>
                    <h2>預約付款</h2>
                </template>
                <template #page>預約付款</template>
            </BreadcrumbsComponent>

            <div class="container py-5">
                <h2 class="text-center mb-3">請確認您的預約停車場</h2>
                <p class="text-center text-muted">為了您的權益，請閱讀使用規則</p>


                <div class="tab-content">
                    <div class="tab-pane show active">
                        <div class="text-left p-4 bg-white rounded shadow">
                            <div class="row">
                                <div class="col-md-5 p-3 img-container">
                                    <img class="rounded img-fluid"
                                        :src="`https://maps.googleapis.com/maps/api/staticmap?center=22.6574100000,120.299500000000000&zoom=18&size=600x300&markers=color:red%7Clabel:P%7C22.6574100000,120.299500000000000&key=AIzaSyALBHIW2HQWkmhCK-VXqGIoTVttRvMTtXo`"
                                        alt="Map of 凹子底停車場" style="width: 100%; height: 100%" />
                                </div>
                                <div class="col-md-2 p-3 mt-2 ">
                                    <h2>停車場名字</h2>
                                    <p>停車場位址</p>
                                    <p>停車場費用</p>
                                    <p>停車場型態</p>
                                    <p>停車場車位</p>
                                    <p>訂金</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="text-center mt-4">
                    <button class="btn btn-warning btn-lg" @click="requestPayment()">
                        立即付款
                    </button>
                </div>

            </div>
        </main>
        <div id="paymentFormContainer"></div>
    </div>
</template>

<style lang="css" scoped></style>
