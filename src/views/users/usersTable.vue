<template>
  <div class="app-container">
    <el-row>
      <el-button type="primary"
                 size="small"
                 icon="el-icon-circle-check-outline"
                 @click="handleCreate()">添加</el-button>
    </el-row>
    <el-table v-loading="listLoading" :data="userslist" border>

      <el-table-column align="center" label="用户名">
        <template slot-scope="scope">
          <span>{{ scope.row.userName }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="电话">
        <template slot-scope="scope">
          <span>{{ scope.row.userPhone }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="用户类型">
        <template slot-scope="scope">
          <span>{{ scope.row.permissions | userPermissionsFilter(scope.row.permissions)}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="是否有效">
        <template slot-scope="scope">
          <el-tag :type="scope.row.userState | userStateFilterType">{{ scope.row.userState | userStateFilterName }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="success"
                     size="mini"
                     @click="handleUpdate(scope.row)">修改</el-button>
          <el-button type="danger"
                     size="mini"
                     @click="delUsers(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
            v-show="total>0"
            :total="total"
            :page.sync="listQuery.page"
            :limit.sync="listQuery.limit"
            @pagination="getUsersList" />

    <el-dialog :visible.sync="dialogCreate" title="添加">
      <el-form ref="usersDataForm" :rules="rules" :model="usersTemp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="usersTemp.userName"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="usersTemp.passWord"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="usersTemp.checkPass"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="userPhone">
          <el-input v-model="usersTemp.userPhone"></el-input>
        </el-form-item>
        <el-form-item label="用户类型">
          <el-select v-model="usersTemp.permissions" class="filter-item" placeholder="选择">
            <el-option v-for="item in userPermissions"
                       :key="item.id"
                       :label="item.permissName"
                       :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="是否有效">
          <el-switch v-model="usersTemp.userState"
                     active-value="1"
                     inactive-value="0"></el-switch>
        </el-form-item>
        <el-form-item label="用户描述" prop="permissTitle">
          <el-input type="textarea" v-model="usersTemp.introduction"></el-input>
        </el-form-item>
        <el-form-item label="头像地址" prop="permissTitle">
          <el-input type="textarea" v-model="usersTemp.avatar"></el-input>
        </el-form-item>
      </el-form>
      <el-row slot="footer" class="dialog-footer">
        <el-button @click="dialogCreate = false">取消</el-button>
        <el-button type="primary"
                   @click="dialogStatus==='create'?createUsers():updateUsers()">提交</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import API from '@/api'
import { usersOptions, userTypeFilter, userStateFilterType, userStateFilterName } from '@/filters/users.js'
import Pagination from '@/components/Pagination'
import { mapGetters } from 'vuex'
import store from '@/store'

export default {
  name: 'UsersTable',
  components: { Pagination },
  data() {
    const validatePass = (rule, value, callback) => {
        if (value === '') {
            callback(new Error('请输入密码'))
        } else {
            if (this.usersTemp.checkPass !== '') {
                this.$refs['usersDataForm'].validateField('checkPass')
            }
            callback()
        }
    }
    const validateCheckPass = (rule, value, callback) => {
        if (value === '') {
            callback(new Error('请再次输入密码'))
        } else if (value !== this.usersTemp.passWord) {
            callback(new Error('两次输入密码不一致!'))
        } else {
            callback()
        }
    }
    return {
      userslist: null,
      dialogCreate: false,
      dialogStatus: '',
      listLoading: true,
      usersOptions,
      total: 0,
      listQuery: {
        page: 1,
        limit: 10
      },
      usersTemp: {
        userName: '',
        passWord: '',
        checkPass: '',
        userPhone: '',
        userState: '1',
        permissions: '',
        introduction: '',
        avatar: '',
      },
      rules: {
          userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
          password: [{ validator: validatePass, trigger: 'blur' }],
          checkPass: [{ validator: validateCheckPass, trigger: 'blur' }],
          userPhone: [{ required: true, message: '请输入手机号', trigger: 'blur' }]
      },
    }
  },
  computed: {
    ...mapGetters([
        'userPermissions'
    ])
  },
  filters: {
    userPermissionsFilter(val) {
        if (!val){
            return
        } else if(store.getters.userPermissions.length !==0){
            return store.getters.userPermissions.filter(o => {
                return o.id === val
            })[0].permissName
        }
    },
    userTypeFilter,
    userStateFilterType,
    userStateFilterName
  },
  created() {
    this.getUsersList()
  },
  methods: {
    getUserType() {
      API.getPermissionsList().then( res => {
        if(res.data.code===1){
            const userTypeOptions = res.data.data
            this.$store.dispatch('getUserPermissions', {userTypeOptions})
        }else {
            console.log('getUserPermissions错误')
        }
      })
    },
    getUsersList() {
      this.listLoading = true
        API.getUsersList(this.listQuery).then(response => {
          if (response.data.code === 1) {
              const data = response.data
              this.userslist = data.data
              this.total = data.total
              this.listLoading = false
              this.getUserType()
          }else {
              this.$message.error('获取失败，请重试')
          }
      })
    },
    resetTemp() {
      this.usersTemp= {
          userName: '',
          passWord: '',
          checkPass: '',
          userPhone: '',
          userState: '1',
          permissions: '',
          introduction: '',
          avatar: '',
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogCreate = true
      this.dialogStatus = 'create'
      this.$nextTick(() => {
          this.$refs['usersDataForm'].clearValidate()
      })
    },
    createUsers() {
        this.$refs['usersDataForm'].validate((valid) => {
            if (valid) {
                API.createUsers(this.usersTemp).then(response => {
                    if (response.data.code === 1) {
                        this.dialogCreate = false
                        this.$notify({
                            title: '成功',
                            message: '创建成功',
                            type: 'success',
                            duration: 2000
                        })
                        this.getUsersList()
                    }else {
                        this.$message.error('创建失败，请重试')
                    }
                })
            }
        })
    },
    handleUpdate(row) {
        this.usersTemp = Object.assign({}, row) // copy obj
        this.usersTemp.checkPass = row.passWord
        console.log(this.usersTemp)
        this.dialogStatus = 'update'
        this.dialogCreate = true
        this.$nextTick(() => {
            this.$refs['usersDataForm'].clearValidate()
        })
    },
    updateUsers() {
        this.$refs['usersDataForm'].validate((valid) => {
            if (valid) {
                const tempData = Object.assign({}, this.usersTemp)
                API.updateUsers(tempData).then(response => {
                    if (response.data.code === 1) {
                        this.dialogCreate = false
                        this.$notify({
                            title: '成功',
                            message: '更新成功',
                            type: 'success',
                            duration: 2000
                        })
                        this.getUsersList()
                    }else {
                        this.$message.error('更新失败，请重试')
                    }
                })
            }
        })
    },
    delUsers(row) {
            this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                API.delUsers({id : row.id}).then(response => {
                    if (response.data.code === 1) {
                        this.$notify({
                            title: '成功',
                            message: '删除成功',
                            type: 'success',
                            duration: 2000
                        })
                        this.getUsersList()
                    }else {
                        this.$message.error('删除失败，请重试')
                    }
                })
            }).catch(() => {
                this.$notify({
                    title: '成功',
                    message: '已取消删除',
                    type: 'info',
                    duration: 2000
                })
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
