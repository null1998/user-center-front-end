<!-- 角色管理对话框-权限 -->
<template>
  <div>
    <el-dialog
      :visible.sync="visible"
      :before-close="close"
    >
    <hyd-table
      :height="580"
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
          label:'资源类型'
        },
        {
          prop:'action',
          label:'资源操作',
          width:'100'
        },
        {
          prop:'url',
          label:'路径',
          width:'250'
        },
        {
          prop:'method',
          label:'方法',
          width:'100'
        },
      ],
      tableLoading:false
    };
  },
  methods:{
    getPermission(rolePermissionList){
      return new Promise(async(resolve,reject)=>{
        let tmp = []
        for (let i = 0; i < rolePermissionList.length; i++) {
          const element = rolePermissionList[i];
          await getById(element.permissionId).then(res=>{
            if (res&&res.body&&res.body.data) {
              tmp = tmp.concat(res.body.data)
              //this.tableData = this.tableData.concat(res.body.data)
            }
          })
        }
        this.tableData = tmp
      })
    }
  }
};
</script>
<style>
</style>
