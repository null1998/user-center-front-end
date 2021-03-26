<!-- 角色管理对话框-权限 -->
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
import { getById } from "@/api/permission";
export default {
  name: "role-dialog",
  props: {
    visible: { type: Boolean, default: false },
    close: { type: Function},
    dialogTableData: {type:Array}
  },
  watch:{
    dialogTableData(val){
      
      this.getPermission(val)
    }
  },
  data() {
    return {
      tableKey: 0,
      tableData: [],
      tableColumons: [
        {
          prop:'name',
          label:'资源名'
        },
        {
          prop:'action',
          label:'动作'
        },
        {
          prop:'url',
          label:'路径'
        },
        {
          prop:'method',
          label:'方法'
        },
      ],
      tableLoading:false
    };
  },
  methods:{
    getPermission(rolePermissionList){
      return new Promise(async(resolve,reject)=>{
        for (let i = 0; i < rolePermissionList.length; i++) {
          const element = rolePermissionList[i];
          await getById(element.permissionId).then(res=>{
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
