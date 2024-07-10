<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="数据库表名" align="center">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column label="Excel名" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Excel标题行数" width="300" align="center">
        <template slot-scope="scope">
          {{ scope.row.pageviews }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="created_at"
        label="更新时间"
        width="300"
      >
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span> {{ scope.row.display_time }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="300" align="center">
        <template slot-scope="scope">
          <button class="layui-btn layui-btn-info" style="position: relative">
            上传更新
            <input
              type="file"
              multiple
              accept=".xls,.xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
              style="position: absolute; top: 0px; left: 0px; opacity: 0"
              id="filez"
              @change="uploadFiles"
            />
          </button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getList } from "@/api/table";
import axios from "axios";
export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "gray",
        deleted: "danger",
      };
      return statusMap[status];
    },
  },
  data() {
    return {
      list: null,
      listLoading: true,
    };
  },
  created() {
    this.fetchData();
  },
  mounted() {},
  methods: {
    async uploadFiles(e) {
      console.log(e.target.files[0]);
      var form = new FormData();
      form.append("file", e.target.files[0]);
      var config = {
        onUploadProgress: (progressEvent) => {
          var complete =
            (((progressEvent.loaded / progressEvent.total) * 100) | 0) + "%";
        },
      };
      (axios.defaults.baseURL = process.env.VUE_APP_BASE_API), // url = base url + request url
        await axios.post(`file/upload.action`, form, config).then((res) => {
          // this.$set(this.progrees, i, "100%");

          if (res.status == 200 && res.data.code == "200") {
            // this.$set(this.success, i, true);
            console.log("=======================================ok");
            this.file.done = i + 1;
          } else {
            if (res.data.msg == "") {
              // this.$set(this.success, i, "服务器错误");
            } else {
              // this.$set(this.success, i, res.data.msg);
            }

            // this.$set(this.msgs,i,res.data.msg);
            console.log("=======================================error");
          }

          console.log(res);
        });
    },
    fetchData() {
      this.listLoading = true;
      getList().then((response) => {
        this.list = response.data.items;
        this.listLoading = false;
      });
    },
  },
};
</script>

<style scoped>
.layui-btn {
  background-color: rgba(188, 58, 115, 1);
  color: white;
  border: 0px;
  padding: 4px 10px;
  align-content: center;
}
</style>
