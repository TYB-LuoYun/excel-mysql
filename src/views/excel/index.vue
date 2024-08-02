<template>
  <div class="app-container" style="position: relative">
    <el-button
      style="
        position: absolute;
        right: 100px;
        top: 27px;
        z-index: 999;
        border: 0;
      "
      size="mini"
      icon="el-icon-edit"
      @click="newTab.show = true"
      circle
    ></el-button>
    <el-table
      v-loading="listLoading"
      :data="list.records"
      element-loading-text="Loading"
      border
      fit
      size="small"
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="数据库表名" align="center">
        <template slot-scope="scope">
          {{ scope.row.tableName }}
        </template>
      </el-table-column>
      <el-table-column label="Excel名" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.excelName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Sheet名" width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.sheetName }}
        </template>
      </el-table-column>
      <el-table-column label="Excel标题行数" width="120" align="center">
        <template slot-scope="scope">
          {{ scope.row.excelHeadRowNum }}
        </template>
      </el-table-column>
      <el-table-column label="Sheet索引" width="100" align="center">
        <template slot-scope="scope">
          {{ scope.row.sheetIndex }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="updateTime"
        label="更新时间"
        width="250"
      >
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span> {{ scope.row.updateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新人" width="100" align="center">
        <template slot-scope="scope">
          {{ scope.row.updateBy }}
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="300" align="center">
        <template slot-scope="scope">
          <el-button
            style="position: relative"
            type="text"
            @click="importGuide(scope.row)"
            size="small"
          >
            上传更新
          </el-button>

          <el-button
            style="margin-left: 20px"
            @click.native.prevent="view(scope.row)"
            type="text"
            size="small"
          >
            查看
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div style="position: relative">
      <el-pagination
        style="margin-top: 10px"
        background
        @size-change="handleSizeChangeList"
        @current-change="handleCurrentChangeList"
        :current-page="list.current"
        :page-sizes="[10, 20, 50, 100, 200, 300, 400]"
        :page-size="list.size"
        layout="->,total, sizes, prev, pager, next, jumper"
        :total="list.total"
      >
      </el-pagination>
    </div>

    <el-drawer
      v-if="tableRow.tableName"
      :title="tableRow.tableName"
      :visible.sync="table"
      direction="rtl"
      :before-close="listTableClose"
      size="90%"
    >
      <div class="div1">
        <el-table
          :data="listTable.records"
          height="100%"
          border
          style="width: 100%"
          size="mini"
        >
          <el-table-column
            type="index"
            label="表行"
            fixed="left"
            :index="indexMethod"
            width="100"
            v-if="head && head.length > 0"
          >
          </el-table-column>
          <el-table-column
            :key="index"
            v-for="(item, index) in head"
            :property="item"
            :label="item"
          >
          </el-table-column>
        </el-table>
        <div>
          <el-pagination
            style="margin-top: 5px"
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="listTable.current"
            :page-sizes="[10, 20, 50, 100, 200, 300, 400]"
            :page-size="listTable.size"
            layout="->,total, sizes, prev, pager, next, jumper"
            :total="listTable.total"
          >
          </el-pagination>
        </div>
      </div>
    </el-drawer>

    <el-dialog
      title="导入向导"
      :visible.sync="dialogVisible"
      :before-close="cancel"
      width="60%"
    >
      <div>
        <el-row>
          <el-input placeholder="" v-model="form.fileName" readOnly="true">
            <template slot="append">
              <el-button
                style="position: relative; width: 100px"
                type="text"
                size="small"
              >
                选择文件
                <input
                  type="file"
                  multiple
                  accept=".xls,.xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                  style="
                    position: absolute;
                    top: -5px;
                    left: 0px;
                    opacity: 0;
                    width: 100px;
                    display: block;
                    height: 150px !important;
                  "
                  id="filez"
                  @change="selectFiles($event)"
                />
              </el-button>
            </template>
          </el-input>
        </el-row>
        <el-row style="display: flex; flex-decration: row" v-if="form.sheetIndex != null">
          <el-col
            :span="4"
            style="
              border-right: 1px solid rgba(0, 0, 0, 0.1);
              margin-right: 30px;
            "
          >
            <div>
              <ul>
                <li :key="index" v-for="(item, index) in form.sheetArr">
                  <el-radio
                    size="mini"
                    v-model="form.sheetIndex"
                    :label="item.sheetNo"
                    border
                    >{{ item.sheetName }}</el-radio
                  >
                </li>
              </ul>
            </div>
          </el-col>
          <el-col :span="6">
            <div style="margin-top: 18px">
              <el-form
                :label-position="'left'"
                label-width="80px"
                :model="form"
                size="mini"
              >
                <el-form-item label="表名">
                  <el-input v-model="form.tableName" disabled></el-input>
                </el-form-item>
                <el-form-item label="标题行数">
                  <el-input-number
                    v-model="form.excelHeadRowNum"
                    controls-position="right" 
                    @change="excelHeadRowNumChange()"
                    :min="1"
                    :max="10"
                  ></el-input-number>
                </el-form-item>
              </el-form>
            </div>
          </el-col>
          <el-col :span="10" style="padding: 10px 0px; margin-left: 100px">
            <table
              style="width: 100%"
              border="1"
              cellspacing="1"
              v-if="form.sheetIndex != null"
            >
              <thead>
                <tr>
                  <th rowspan="2">源字段</th>
                  <!-- rowspan代表单元格纵向合并 -->
                  <th rowspan="2">表目标字段</th>
                  <!-- colspan代表单元格横向合并 -->
                  <th  style="width: 60px;">主键</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(value, key, index) in form.fieldMap" :key="index">
                  <td>{{ key }}</td>
                  <td>
                    <el-select
                      size="mini"
                      v-model="form.fieldMap[key]"
                      clearable
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="item in form.columns"
                        :key="item"
                        :label="item"
                        :value="item"
                      >
                      </el-option>
                    </el-select>
                  </td>
                  <td :key="index" @click="handleKey(form.fieldMap[key],index)">  
                    <i :key="index" class="el-icon-key" v-show="formKeys(form.fieldMap[key])" style="color: rgb(255, 0, 191);"></i>
                  </td>
                </tr>
              </tbody>
            </table>
          </el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary"  @click="confirm2">追 加</el-button>
        <el-button type="primary" @click="confirm">覆 盖</el-button>
      </span>
    </el-dialog>

    <el-dialog title="创建表向导" :visible.sync="newTab.show" width="60%">
      <div>
        <el-row>
          <el-input placeholder="" v-model="newTab.fileName" readOnly="true">
            <template slot="append">
              <el-button
                style="position: relative; width: 100px"
                type="text"
                size="small"
              >
                选择文件
                <input
                  type="file"
                  multiple
                  accept=".xls,.xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                  style="
                    position: absolute;
                    top: -5px;
                    left: 0px;
                    opacity: 0;
                    width: 100px;
                    display: block;
                    height: 150px !important;
                  "
                  id="filez"
                  @change="selectFilesNew($event)"
                />
              </el-button>
            </template>
          </el-input>
        </el-row>
        <el-row
          style="display: flex; flex-decration: row"
          v-if="newTable.sheetIndex != null"
        >
          <el-col
            :span="4"
            style="
              border-right: 1px solid rgba(0, 0, 0, 0.1);
              margin-right: 30px;
            "
          >
            <div>
              <ul>
                <li :key="index" v-for="(item, index) in newTable.sheets">
                  <el-radio
                    size="mini"
                    v-model="newTable.sheetIndex"
                    :label="item.sheetNo"
                    @change="sheetChange"
                    border
                    >{{ item.sheetName }}</el-radio
                  >
                </li>
              </ul>
            </div>
          </el-col>
          <el-col :span="6">
            <div style="margin-top: 18px">
              <el-form
                :label-position="'left'"
                label-width="80px"
                :model="newTable"
                size="mini"
              >
                <el-form-item label="表名">
                  <el-input v-model="newTable.tableName"></el-input>
                </el-form-item>
                <el-form-item label="标题行数">
                  <el-input-number
                    v-model="newTable.excelHeadRowNum"
                    controls-position="right"
                    @change="previewCreateTable"
                    :min="1"
                    :max="10"
                  ></el-input-number>
                </el-form-item>
              </el-form>
            </div>
          </el-col>
          <el-col :span="10" style="padding: 15px 0px; margin-left: 100px">
            <table
              style="width: 100%"
              border="1"
              cellspacing="1"
              v-if="newTable.sheetIndex != null"
            >
              <thead>
                <tr>
                  <th rowspan="2">源字段</th>
                  <!-- rowspan代表单元格纵向合并 -->
                  <th colspan="2">表目标字段</th>
                  <!-- colspan代表单元格横向合并 -->
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(value, key, index) in newTable.fieldMap"
                  :key="index"
                >
                  <td>{{ key }}</td>
                  <td>
                    <el-input v-model="newTable.fieldMap[key]"></el-input>
                  </td>
                </tr>
              </tbody>
            </table>
          </el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="newTab.show = false">取 消</el-button>
        <el-button type="primary" @click="confirmNewTable">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  lists,
  listTable,
  getSheets,
  getFieldMap,
  updateExcelTable,
  previewCreateTable,
  newExcelTable,
} from "@/api/table";
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
      newTab: {
        show: false,
      },
      newTable: {},
      listTable: {},
      list: {},
      listLoading: true,
      table: false,
      head: {},
      dialogVisible: false,
      form: {
        file: null,
        fileName: "",
        sheetIndex: null,
        sheetArr: [],
        row: {},
        columns: [],
        fieldMap: {},
      },
      tableRow: {},
    };
  },
  computed: {
    sheetIndex() {
      return this.form.sheetIndex;
    },
    formKeys(){
      return function(column){
        return Object.keys(this.form.keys).includes(column)
      }
    }
  },
  watch: {
    async sheetIndex(newval, oldval) {
      this.getFieldMap();
    },
  },
  created() {
    this.fetchData();
  },
  mounted() {},
  methods: {
    cancel() {
      this.dialogVisible = false;
      this.form = {
        file: null,
        fileName: "",
        sheetIndex: null,
        sheetArr: [],
        row: {},
        columns: [],
        fieldMap: {},
      };
    },
    handleKey(column,index){
      if(Object.keys(this.form.keys).includes(column)){
        delete this.form.keys[column]
      }else{
          this.form.keys[column]=index 
      }

      this.form.keys = JSON.parse(JSON.stringify(this.form.keys));
    
      this.$forceUpdate();
      console.log(this.form.keys)
      
    },
    confirm2(){
      this.confirm(null,1);
    },
    async confirm(e,val) {
      var ft = new FormData();
      ft.append("file", this.form.file);
      ft.append("id", this.form.row.id);
      ft.append("sheetIndex", this.form.sheetIndex);
      if(val){
        ft.append("mode", val);//1是追加
      }
      if(this.form.excelHeadRowNum!=null && this.form.excelHeadRowNum!=undefined){
        ft.append("excelHeadRowNum",this.form.excelHeadRowNum);
      }
      ft.append(
        "fieldMap",
        new Blob([JSON.stringify(this.form.fieldMap)], {
          type: "application/json",
        })
      );
      ft.append(
        "keys",
        new Blob([JSON.stringify(this.form.keys)], {
          type: "application/json",
        })
      );
      ft.append("updateBy", "admin");
      let data = await updateExcelTable(ft);
      if (data.success) {
        this.$message.success("操作成功");
      }
      this.fetchData();
      this.cancel();
    },
    async getFieldMap() {
      if (this.form.sheetIndex != null) {
        var ft = new FormData();
        ft.append("file", this.form.file);
        ft.append("id", this.form.row.id);
        ft.append("sheetIndex", this.form.sheetIndex);
        if(this.form.excelHeadRowNum!= null && this.form.excelHeadRowNum!=undefined){
          ft.append("excelHeadRowNum", this.form.excelHeadRowNum)
        }
        let data = await getFieldMap(ft);
        this.form.columns = data.data.columns;
        this.form.fieldMap = data.data.fieldMap;
        this.form.tableName = data.data.tableName;
        this.form.excelHeadRowNum = data.data.excelHeadRowNum
        this.form.keys=data.data.keys
      }
    },
    excelHeadRowNumChange( ) {
      // this.getFieldMap();
      if(this.form.excelHeadRowNum!=null && this.form.excelHeadRowNum!=undefined){
        this.getFieldMap();
      }
    },
    importGuide(row) {
      this.form.row = row;
      this.dialogVisible = true;
    },
    async selectFilesNew(e) {
      this.newTab.file = e.target.files[0];
      this.newTab.fileName = e.target.files[0].name;
      e.target.value = "";
      this.previewCreateTable();
    },
    sheetChange(val) {
      this.previewCreateTable();
    },
    async previewCreateTable() {
      var ft = new FormData();
      ft.append("file", this.newTab.file);
      if (
        this.newTable.excelHeadRowNum != null &&
        this.newTable.excelHeadRowNum != undefined
      ) {
        ft.append("headRowNumber", this.newTable.excelHeadRowNum);
      }
      if (
        this.newTable.sheetIndex != null &&
        this.newTable.sheetIndex != undefined
      ) {
        ft.append("sheetIndex", this.newTable.sheetIndex);
      }
      if (this.newTable.tableName) {
        ft.append("tableName", this.newTable.tableName);
      }
      let data = await previewCreateTable(ft);
      this.newTable = data.data;
    },
    async confirmNewTable() {
      let data = await newExcelTable({
        fieldMap: this.newTable.fieldMap,
        tableName: this.newTable.tableName,
        sheetIndex: this.newTable.sheetIndex,
        sheetName: this.newTable.sheets[this.newTable.sheetIndex].sheetName,
        excelName: this.newTab.fileName,
        excelHeadRowNum: this.newTable.excelHeadRowNum,
        updateBy: "admin",
        createBy: "admin",
      });
      if (data.success) {
        this.$message.success("操作成功");
      } else {
        this.$message.error(data.message);
      }
      this.fetchData();
      this.newTab.show = false;
      this.newTab.fileName = null;
      this.newTable = {};
    },
    async selectFiles(e) {
      this.form.sheetIndex = null;
      console.log(e.target.files[0]);
      this.form.fileName = e.target.files[0].name;
      this.form.file = e.target.files[0];
      e.target.value = "";
      // 获取sheet
      var ft = new FormData();
      ft.append("file", this.form.file);
      console.log(ft);
      let arr = await getSheets(ft);
      this.form.sheetArr = arr.data;
      
      this.form.sheetIndex = this.form.row.sheetIndex;
    },
    handleSizeChange(val) {
      this.listTable.size = val;
      this.listTablePage();
    },
    listTableClose() {
      this.table = false;
      this.listTable.current = 1;
      this.listTable.records = [];
    },
    handleCurrentChange(val) {
      this.listTable.current = val;
      this.listTablePage();
    },
    indexMethod(index) {
      return (
        (this.listTable.current - 1) * this.listTable.size +
        index +
        1 +
        this.tableRow.excelHeadRowNum
      );
    },
    async view(row) {
      this.table = true;
      this.tableRow = row;
      this.listTablePage();
    },
    async listTablePage() {
      let data = await listTable({
        id: this.tableRow.id,
        current: this.listTable.current,
        size: this.listTable.size,
      });
      this.listTable = data.data.data;
      this.head = data.data.head;
    },
    async uploadFiles(row, e) {
      console.log(e.target.files[0]);
      console.log(row);
      var form = new FormData();
      form.append("file", e.target.files[0]);
      form.append("id", row.id);
      e.target.value = "";
      var config = {
        onUploadProgress: (progressEvent) => {
          var complete =
            (((progressEvent.loaded / progressEvent.total) * 100) | 0) + "%";
        },
      };
      (axios.defaults.baseURL = process.env.VUE_APP_BASE_API), // url = base url + request url
        await axios
          .post(`/excel-mysql/updateExcelTable`, form, config)
          .then((res) => {
            // this.$set(this.progrees, i, "100%");
            console.log("=======================================ok");
            if (res.status == 200 && res.data.code == "200") {
              console.log("=======================================ok2");
              // this.$set(this.success, i, true);
              this.$message({
                message: "上传完成",
                type: "success",
              });

              this.file.done = i + 1;
            } else {
              console.log("错误");
              console.log(res.data);
              this.$message.error(res.data.message);
              if (res.data.msg == "") {
                // this.$set(this.success, i, "服务器错误");
              } else {
                // this.$set(this.success, i, res.data.msg);
              }

              // this.$set(this.msgs,i,res.data.msg);
              console.log("=======================================error");
            }

            console.log(res);
          })
          .catch((error) => {
            if (error.response) {
              // 请求已发出，服务器以状态码响应，但状态代码超出了2xx的范围
              if (error.response.status === 500) {
                this.$message.error(error.response.data.message);
                console.error("Server error 500:", error.response.data);
                // 处理500错误
              } else {
                console.error("Other error:", error.response.data);
                // 处理其他错误
              }
            } else if (error.request) {
              // 请求已发出但没有收到响应
              console.error("No response received:", error.request);
            } else {
              // 发生在设置请求时触发的错误
              console.error("Error in setting up request:", error.message);
            }
          });
    },
    handleSizeChangeList(val) {
      this.list.size = val;
      this.fetchData();
    },
    handleCurrentChangeList(val) {
      this.list.current = val;
      this.fetchData();
    },
    fetchData() {
      this.listLoading = true;
      lists({ size: this.list.size, current: this.list.current }).then(
        (response) => {
          this.list = response.data;
          this.listLoading = false;
        }
      );
    },
  },
};
</script>

<style scoped>
ul {
  padding: 0px 0px;
}
ul li {
  list-style: none;
  padding: 3px 5px;
}
.div1 {
  width: 100%;
  height: calc(100vh - 150px);
  /* background-color: red; */
}

table {
  border-collapse: collapse;
  border-color: #dfe6ec;
}
thead tr th {
  background-color: #f8f8f9;
  padding: 6px;
  text-align: center;
}
tbody tr td {
  padding: 6px;
  text-align: center;
  height: 34px;
}
.layui-btn {
  background-color: rgba(188, 58, 115, 1);
  color: white;
  border: 0px;
  padding: 4px 10px;
  display: inline-block;
  align-content: center;
}
</style>
