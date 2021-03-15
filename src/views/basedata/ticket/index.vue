<!-- 票据管理 -->
<template>
  <div>
    <hyd-editable-table
      :tableKey="tableKey"
      :tableData="tableData"
      :tableColumns="tableColumons"
      :loading="tableLoading"
      @handleSave="handleSave"
      @handleDelete="handleDelete"
    >
    </hyd-editable-table>
  </div>
</template>

<script>
import { listProvinceZone } from "@/api/basedata/zone";
import { listByCategoryName } from "@/api/basedata/dictionary";
import {
  listAll as listTicket,
  save,
  update,
  deleteById,
} from "@/api/basedata/ticket";
import { pinyin } from "@/utils/pinyin";
export default {
  name: "",
  data() {
    return {
      tableKey: 0,
      tableData: [],
      tableColumons: [
        {
          prop: "name",
          label: "名称",
          type: "show",
        },
        {
          prop: "code",
          label: "编码",
          type: "show",
        },
        {
          prop: "mnemonic",
          label: "助记码",
          type: "show",
        },
        {
          prop: "zoneId",
          label: "地区",
          type: "select",
          options: [],
          optionLabel: "name",
          optionValue: "id",
          placeholder: "请选择地区",
        },
        {
          prop: "dictionaryId",
          label: "类别",
          type: "select",
          options: [],
          optionLabel: "remark",
          optionValue: "id",
          placeholder: "请选择类别",
        },
        {
          prop: "year",
          label: "年度",
          type: "input",
        },
        {
          prop: "price",
          label: "价格",
          type: "input",
        },
      ],
      tableLoading: false,
    };
  },
  watch: {},
  created() {
    this.getProvinceZone();
    this.getTicketDictionary({ categoryName: "票据分类" });
    this.getTableData();
  },
  methods: {
    handleSave(index, row) {
      // 保存时必须校验数据的合法性
      if (
        row.zoneId &&
        row.dictionaryId &&
        this.valid("year", row.year) &&
        this.valid("price", row.price)
      ) {
        // 生成地区，票据类型，年度，生成名字和助记码
        const dto = { ...row };
        for (let i = 0; i < this.tableColumons[3].options.length; i++) {
          const zone = this.tableColumons[3].options[i];
          if (zone.id === row.zoneId) {
            dto.name = zone.name;
            dto.code = zone.code;
            break;
          }
        }
        for (let i = 0; i < this.tableColumons[4].options.length; i++) {
          const dictionary = this.tableColumons[4].options[i];
          if (dictionary.id === row.dictionaryId) {
            dto.name = dto.name + dictionary.remark;
            dto.code = dto.code + dictionary.value;
          }
        }
        dto.code = dto.code + "00" + row.year.substring(2);
        dto.mnemonic = pinyin(dto.name)[0];
        // 根据是否有id分别做更新和插入操作
        if (dto.id) {
          update(dto).then((res) => {
            if (res) {
              this.success()
              this.getTableData();
            }
          });
        } else {
          save(dto).then((res) => {
            if (res) {
              this.success()
              this.getTableData();
            }
          });
        }
      } else {
        this.getTableData();
      }
    },
    handleDelete(index, row) {
      if (row.id) {
        deleteById(row.id).then((res) => {
          if (res) {
            this.success()
          }
        });
      }
    },
    getTableData() {
      this.tableLoading = true;
      listTicket()
        .then((res) => {
          if (res && res.body && res.body.data) {
            this.tableData = res.body.data;
          }
        })
        .finally(() => {
          this.tableLoading = false;
        });
    },
    /**
     * 查询省级行政区划
     */
    getProvinceZone() {
      listProvinceZone().then((res) => {
        if (res && res.body && res.body.data) {
          this.tableColumons[3].options = res.body.data;
          console.log(this.tableColumons[3]);
        }
      });
    },
    /**
     * 获取票据类别
     */
    getTicketDictionary(params) {
      listByCategoryName(params).then((res) => {
        if (res && res.body && res.body.data) {
          this.tableColumons[4].options = res.body.data;
          console.log(this.tableColumons[4]);
        }
      });
    },
    valid(property, value) {
      switch (property) {
        case "year":
          return /^\d{4}$/.test(value);
        case "price":
          return /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/.test(value);
        default:
          return false;
      }
    },
    success() {
      this.$notify({
        title: "success",
        message: "操作成功",
        type: "success",
        duration: 2000,
      });
    },
  },
};
</script>
<style>
</style>
