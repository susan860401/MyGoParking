<script setup>
//表格 暫放 尚未用到
import { ref } from "vue";

const test = ref(false);

const tableData = [
  {
    date: "2016-05-03",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
  },
  {
    date: "2016-05-02",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
  },
  {
    date: "2016-05-04",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
  },
  {
    date: "2016-05-01",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
  },
];
</script>

<template>
  <div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="date" label="ID" width="180"></el-table-column>
      <el-table-column prop="name" label="名字" width="180"></el-table-column>
      <el-table-column
        v-if="test"
        prop="address"
        label="地址"
        width="180"
      ></el-table-column>
    </el-table>
  </div>
</template>

<style lang="css" scoped></style>
