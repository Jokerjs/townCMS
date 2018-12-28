<template>
  <div class="app-container">
    <el-row>
      <el-button type="primary"
                 size="small"
                 icon="el-icon-circle-check-outline"
                 @click="appendParent()">添加</el-button>
    </el-row>
    <el-tree
            :data="treeData"
            node-key="id"
            :props="defaultProps"
            default-expand-all
            :expand-on-click-node="false">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
          <el-button
                  type="text"
                  size="mini"
                  @click="() => handleappend(node, data)">
            添加
          </el-button>
          <el-button
                  type="text"
                  size="mini"
                  @click="() => handleupdate(node, data)">
            修改
          </el-button>
          <el-button
                  type="text"
                  size="mini"
                  @click="() => remove(node, data)">
            删除
          </el-button>
        </span>
      </span>
    </el-tree>
    <el-dialog :visible.sync="dialogCreate" title="添加">
      <el-form ref="treeDataForm" :rules="rules" :model="treeTemp" label-position="right" label-width="80px" style="width: 400px; margin-left:50px;">
        <el-form-item v-show="dialogStatus==='create'" label="父对象" prop="label">
          <el-input :disabled="true" v-model="treeTemp.parent"></el-input>
        </el-form-item>
        <el-form-item label="资源名称" prop="label">
          <el-input v-model="treeTemp.label"></el-input>
        </el-form-item>
        <el-form-item label="资源描述" prop="describe">
          <el-input v-model="treeTemp.describe"></el-input>
        </el-form-item>
        <el-form-item label="资源类型" prop="type">
          <el-select v-model="treeTemp.type" class="filter-item" placeholder="请选择">
            <el-option v-for="item in treetype"
                       :key="item.key"
                       :label="item.display_name"
                       :value="item.key"/>
          </el-select>
        </el-form-item>
        <div v-if="treeTemp.type === '0'">
          <el-form-item label="Icon">
            <el-input v-model="treeTemp.icon"></el-input>
          </el-form-item>
          <el-form-item label="路由Key">
            <el-input v-model="treeTemp.routePath"></el-input>
          </el-form-item>
          <el-form-item label="模板路径">
            <el-input placeholder="模板路径" v-model="treeTemp.componentPath">
              <template slot="prepend">/</template>
            </el-input>
          </el-form-item>
        </div>
        <div v-else>
          <el-form-item label="资源地址">
            <el-input placeholder="请输入内容" v-model="treeTemp.api">
              <template slot="prepend">/</template>
            </el-input>
          </el-form-item>
        </div>
        <el-form-item label="排序">
          <el-input-number v-model="treeTemp.sortId" :min="1" :max="50"></el-input-number>
        </el-form-item>
      </el-form>
      <el-row slot="footer" class="dialog-footer">
        <el-button @click="dialogCreate = false">取消</el-button>
        <el-button @click="dialogStatus==='create'?append():update()" type="primary">提交</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
  import API from '@/api'
  import tree from '@/utils/treeAndRouter'
  export default {
      name: 'UsersResources',
      data() {
          return {
              dialogCreate: false,
              dialogStatus: '',
              treeData: null,
              defaultProps: {
                  children: 'children',
                  label: 'label'
              },
              treeTemp: {
                  label: '',
                  describe: '',
                  type: '',
                  parent: '',
                  sortId: '',
                  parentId: '',
                  componentPath: '',
                  routePath: '',
                  api: '',
                  icon: ''
              },
              treetype: [
                  { key: '0', display_name: '基础菜单' },
                  { key: '1', display_name: '操作和功能' }
              ],
              rules: {
                  label: [{ required: true, message: '请输入资源名称', trigger: 'blur' }],
                  describe: [{ required: true, message: '请输入资源描述', trigger: 'blur' }],
                  type: [{ required: true, message: '请选择类型', trigger: 'blur' }]
              }
          }
      },
      created() {
          this.gitList()
      },
      methods: {
          gitList() {
              API.getAllResources().then(response => {
                  if (response.data.code === 1) {
                      const data = response.data
                      this.treeData = tree.renderTreeData(data.data)
                  }else {
                      this.$message.error('获取失败，请重试')
                  }
              })
          },
          resetTemp() {
              this.treeTemp= {
                  label: '',
                  describe: '',
                  type: '',
                  parent: 'AdminResources',
                  sortId: '',
                  parentId: '',
                  componentPath: '',
                  routePath: '',
                  api: '',
                  icon: ''
              }
          },
          appendParent(){
              this.resetTemp()
              this.dialogCreate = true
              this.dialogStatus = 'create'
              this.treeTemp.parentId = '0'
              this.$nextTick(() => {
                  this.$refs['treeDataForm'].clearValidate()
              })
          },
          handleappend(node, data) {
              this.resetTemp()
              this.treeTemp.parentId = data.id
              this.treeTemp.parent = data.routePath||data.api
              this.dialogCreate = true
              this.dialogStatus = 'create'
              this.$nextTick(() => {
                  this.$refs['treeDataForm'].clearValidate()
              })
          },
          append() {
              this.$refs['treeDataForm'].validate((valid) => {
                  if (valid) {
                      API.createResources(this.treeTemp).then(response => {
                          if (response.data.code === 1) {
                              this.dialogCreate = false
                              this.$notify({
                                  title: '成功',
                                  message: '创建成功',
                                  type: 'success',
                                  duration: 2000
                              })
                              this.gitList()
                          }else {
                              this.$message.error('添加失败，请重试')
                          }
                      })
                  }
              })
          },
          handleupdate(node, data) {
              this.treeTemp = Object.assign({}, data)
              this.dialogStatus = 'update'
              this.dialogCreate = true
              this.$nextTick(() => {
                  this.$refs['treeDataForm'].clearValidate()
              })
          },
          update() {
              this.$refs['treeDataForm'].validate((valid) => {
                  if (valid) {
                      const tempData = Object.assign({}, this.treeTemp)
                      API.updateResources(tempData).then(response => {
                          if (response.data.code === 1) {
                              console.log(response)
                              this.dialogCreate = false
                              this.$notify({
                                  title: '成功',
                                  message: '创建成功',
                                  type: 'success',
                                  duration: 2000
                              })
                              this.gitList()
                          }else {
                              this.$message.error('添加失败，请重试')
                          }
                      })
                  }
              })
          },
          remove(node, data) {
              API.delResources(data.id).then(response => {
                  this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                      type: 'warning'
                  }).then(() => {
                      if (response.data.code === 1) {
                          this.$notify({
                              title: '成功',
                              message: '删除成功',
                              type: 'success',
                              duration: 2000
                          })
                          this.gitList()
                      }else {
                          this.$message.error('删除失败，请重试')
                      }

                  }).catch(() => {
                      this.$notify({
                          title: '成功',
                          message: '已取消删除',
                          type: 'info',
                          duration: 2000
                      })
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
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>
