<script setup>
import { ref } from "vue";

const props = defineProps({
  placeholder: {
    type: String,
    default: "起輸入目的地...",
  },
});

const emit = defineEmits(["search"]);
const searchQuery = ref();
const SearchHandler = () => {
  if (searchQuery.value) {
    console.log(searchQuery.value);
    emit("search", searchQuery.value);
  }
};
</script>

<template>
  <div>
    <div class="input-group mb-3">
      <input
        type="text"
        v-model="searchQuery"
        class="form-control"
        :placeholder="placeholder"
        @keyup.enter="SearchHandler"
        aria-label="Recipient's username"
        aria-describedby="button-addon2"
      />
      <button
        class="btn btn-outline-info"
        @click="SearchHandler"
        id="button-addon2"
      >
        Trace & Track
      </button>
    </div>
  </div>
</template>

<style lang="css" scoped></style>
