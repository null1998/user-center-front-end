<!-- 用户管理对话框 -->
<template>
  <div>
    <el-dialog
      :visible.sync="visible"
      :before-close="close"
    >
    <hyd-table
      :tableKey="tableKey"
      :tableData="tableData"
      :tableColumns="tableColumons"
      :loading="tableLoading"
    />
    </el-dialog>
  </div>
</template>

<script>
import { getById } from "@/api/role";
export default {
  name: "user-dialog",
  props: {
    visible: { type: Boolean, default: false },
    close: { type: Function},
    dialogTableData: {type:Array}
  },
  watch:{
    dialogTableData(val){
      
      this.getRoleList(val)
    }
  },
  data() {
    return {
      tableKey: 0,
      tableData: [],
      tableColumons: [
        {
          prop:'name',
          label:'角色名'
        },
        {
          prop:'type',
          label:'角色类型'
        },
        {
          prop:'remark',
          label:'备注'
        }
      ],
      tableLoading:false
    };
  },
  methods:{
    getRoleList(userRoleList){
      return new Promise(async(resolve,reject)=>{
        for (let i = 0; i < userRoleList.length; i++) {
          const element = userRoleList[i];
          await getById(element.roleId).then(res=>{
            if (res&&res.body&&res.body.data) {
              this.tableData = this.tableData.concat(res.body.data)
            }
          })
        }
      })
    }
  }
};
</script>
<style>
</style>
