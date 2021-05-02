<!-- 角色管理对话框-角色 -->
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
import { getById } from "@/api/role";
export default {
  name: "role-advanced-dialog",
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
        },
        
      ],
      tableLoading:false
    };
  },
  methods:{
    getRoleList(roleRelateList){
      return new Promise(async(resolve,reject)=>{
        let tmp = []
        for (let i = 0; i < roleRelateList.length; i++) {
          const element = roleRelateList[i];
          await getById(element.childRoleId).then(res=>{
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
