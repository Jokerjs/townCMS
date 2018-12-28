<template>
  <div class="app-container">
    <el-row>
      <el-button type="primary"
                 size="small"
                 icon="el-icon-circle-check-outline"
                 @click="handleCreate()">添加</el-button>
    </el-row>
    <el-table v-loading="listLoading" :data="permissionslist" border>

      <el-table-column align="center" label="角色名">
        <template slot-scope="scope">
          <span>{{ scope.row.permissName }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="角色描述">
        <template slot-scope="scope">
          <span>{{ scope.row.permissTitle }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="warning"
                     size="mini"
                     @click="handlePower(scope.row)">配置</el-button>
          <el-button type="success"
                     size="mini"
                     @click="handleUpdate(scope.row)">修改</el-button>
          <el-button type="danger"
                     size="mini"
                     @click="delPermissions(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
            v-show="total>0"
            :total="total"
            :page.sync="listQuery.page"
            :limit.sync="listQuery.limit"
            @pagination="getPermissionsList" />

    <el-dialog :visible.sync="dialogCreate" title="添加">
      <el-form ref="permissionsDataForm" :rules="rules" :model="permissionsTemp" label-position="right" label-width="80px" style="width: 500px; margin-left:50px;">
        <el-form-item label="角色名" prop="permissName">
          <el-input v-model="permissionsTemp.permissName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="permissTitle">
          <el-input type="textarea" v-model="permissionsTemp.permissTitle"></el-input>
        </el-form-item>
      </el-form>
      <el-row slot="footer" class="dialog-footer">
        <el-button @click="dialogCreate = false">取消</el-button>
        <el-button type="primary"
                   @click="dialogStatus==='create'?createPermissions():updatePermissions()">提交</el-button>
      </el-row>
    </el-dialog>

    <el-dialog :visible.sync="dialogPower" title="配置">
      <el-tree
              :data="treeData"
              show-checkbox
              node-key="id"
              ref="treePower"
              :default-checked-keys="powerData.power"
              default-expand-all
              :expand-on-click-node="false">
      </el-tree>
      <el-row slot="footer" class="dialog-footer">
        <el-button @click="dialogPower = false">取消</el-button>
        <el-button type="primary"
                   @click="updatePower()">确定</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import API from '@/api'
import Pagination from '@/components/Pagination'
import tree from '@/utils/treeAndRouter'
export default {
  name: 'UsersPermissions',
  components: { Pagination },
  data() {
    return {
      treeData: null,
      powerData: {
          id: '',
          power: []
      },
      permissionslist: null,
      dialogCreate: false,
      dialogPower: false,
      dialogStatus: '',
      listLoading: true,
      total: 0,
      listQuery: {
        page: 1,
        limit: 10
      },
      permissionsTemp: {
        permissName: '',
        permissTitle: ''
      },
      rules: {
          permissName: [{ required: true, message: '请输入角色名', trigger: 'blur' }],
          permissTitle: [{ required: true, message: '请输入角色描述', trigger: 'blur' }]
      },
    }
  },
  created() {
    this.getPermissionsList()
  },
  methods: {
    getPermissionsList() {
      this.listLoading = true
        API.getPermissionsList(this.listQuery).then(response => {
          if (response.data.code === 1) {
              const data = response.data
              this.permissionslist = data.data
              this.total = data.total
              this.listLoading = false
          }else {
              this.$message.error('获取失败，请重试')
          }
      })
    },
    resetTemp() {
      this.permissionsTemp= {
          permissName: '',
          permissTitle: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogCreate = true
      this.dialogStatus = 'create'
      this.$nextTick(() => {
          this.$refs['permissionsDataForm'].clearValidate()
      })
    },
    createPermissions() {
        this.$refs['permissionsDataForm'].validate((valid) => {
            if (valid) {
                API.createPermissions(this.permissionsTemp).then(response => {
                    if (response.data.code === 1) {
                        this.dialogCreate = false
                        this.$notify({
                            title: '成功',
                            message: '创建成功',
                            type: 'success',
                            duration: 2000
                        })
                        this.getPermissionsList()
                    }else {
                        this.$message.error('创建失败，请重试')
                    }
                })
            }
        })
    },
    handleUpdate(row) {
        this.permissionsTemp = Object.assign({}, row) // copy obj
        this.dialogStatus = 'update'
        this.dialogCreate = true
        this.$nextTick(() => {
            this.$refs['permissionsDataForm'].clearValidate()
        })
    },
    updatePermissions() {
        this.$refs['permissionsDataForm'].validate((valid) => {
            if (valid) {
                const tempData = Object.assign({}, this.permissionsTemp)
                API.updatePermissions(tempData).then(response => {
                    if (response.data.code === 1) {
                        this.dialogCreate = false
                        this.$notify({
                            title: '成功',
                            message: '更新成功',
                            type: 'success',
                            duration: 2000
                        })
                        this.getPermissionsList()
                    }else {
                        this.$message.error('更新失败，请重试')
                    }
                })
            }
        })
    },
    delPermissions(row) {
        this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            API.delPermissions({id: row.id}).then(response => {
                if (response.data.code === 1) {
                    this.$notify({
                        title: '成功',
                        message: '删除成功',
                        type: 'success',
                        duration: 2000
                    })
                    this.getPermissionsList()
                }else {
                    this.$message.error('删除失败，请重试')
                }
            })
        }).catch(() => {
            this.$notify({
                title: '取消',
                message: '已取消删除',
                type: 'info',
                duration: 2000
            })
        })

    },
    handlePower(row) {
        this.powerData.power = row.power.split(',')
        this.powerData.id = row.id
        API.getAllResources().then(response => {
            if (response.data.code === 1) {
                const data = response.data
                data.data.forEach( item => {
                    for(let i = 0; i<=this.powerData.power.length; i++){
                        if(item.parentId === this.powerData.power[i]){
                            this.powerData.power.splice(i,1)
                            return
                        }
                    }
                })
                this.treeData = tree.renderTreeData(data.data)
            }else {
                this.$message.error('获取失败，请重试')
            }
        })
        this.dialogPower = true
    },
    updatePower() {
        const NewPower = {
            id: this.powerData.id,
            power: this.$refs.treePower.getCheckedKeys()
        }
        API.updatePower(NewPower).then(response => {
            if (response.data.code === 1) {
                this.dialogPower = false
                this.$notify({
                    title: '成功',
                    message: '修改成功, 请刷新页面',
                    type: 'success',
                    duration: 2000
                })
                this.getPermissionsList()
            }else {
                this.$message.error('获取失败，请重试')
            }
        })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .el-row{
    margin-bottom: 20px;
  }
  .edit-input {
    padding-right: 100px;
  }
  .cancel-btn {
    position: absolute;
    right: 15px;
    top: 10px;
  }
</style>
