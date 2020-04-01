<template>
  <div class="form-container">
    <div class="title" v-if="isEdit">配置文件名: {{configureName}}</div>
    <a-form :form="form">
      <a-form-item
        :label-col="formItemLayout.labelCol"
        :wrapper-col="formItemLayout.wrapperCol"
        label="mongodb地址">
        <a-input
          v-decorator="[
            'address',
            { rules: [{ required: true, message: '此项不能为空' }] },
          ]"
          placeholder="格式是 IP:端口"
        />
      </a-form-item>
      <a-form-item
        :label-col="formItemLayout.labelCol"
        :wrapper-col="formItemLayout.wrapperCol"
        label="用户名">
        <a-input
          v-decorator="[
            'username',
            { rules: [{ required: false, message: '此项不能为空' }] },
          ]"
          placeholder="连接mongodb用户名"
        />
      </a-form-item>
      <a-form-item
        :label-col="formItemLayout.labelCol"
        :wrapper-col="formItemLayout.wrapperCol"
        label="密码">
        <a-input
          v-decorator="[
            'password',
            { rules: [{ required: false, message: '此项不能为空' }] },
          ]"
          placeholder="连接mongodb密码"
        />
      </a-form-item>
      <a-form-item
        :label-col="formItemLayout.labelCol"
        :wrapper-col="formItemLayout.wrapperCol"
        label="数据库名">
        <a-input
          v-decorator="[
            'dbName',
            { rules: [{ required: true, message: '此项不能为空' }] },
          ]"
          placeholder="数据库名"
        />
      </a-form-item>
      <a-form-item
        :label-col="formItemLayout.labelCol"
        :wrapper-col="formItemLayout.wrapperCol"
        label="mongodb集合名">
        <a-input
          v-decorator="[
            'collectionName',
            { rules: [{ required: true, message: '此项不能为空' }] },
          ]"
          placeholder="mongodb集合名"
        />
      </a-form-item>
      <a-form-item
        :label-col="formItemDynamicLayout.labelCol"
        :wrapper-col="formItemDynamicLayout.wrapperCol"
        label="表字段1">
        <a-row :gutter="8">
          <a-col :span="8">
            <a-input
              v-decorator="[
                'columnFirst.name',
                { rules: [{ required: true, message: '此项不能为空' }] },
              ]"
              placeholder="填写列名"
            />
          </a-col>
          <a-col :span="5">
            <a-select
              v-decorator="[
                'columnFirst.type',
                { rules: [{ required: true, message: '此项不能为空' }] },
              ]"
              placeholder="选择列类型"
              @change="(value) => {handleSelectChange(value, 'first')}">
              <a-select-option value="int">
                int
              </a-select-option>
              <a-select-option value="long">
                long
              </a-select-option>
              <a-select-option value="double">
                double
              </a-select-option>
              <a-select-option value="string">
                string
              </a-select-option>
              <a-select-option value="array">
                array
              </a-select-option>
              <a-select-option value="date">
                date
              </a-select-option>
              <a-select-option value="boolean">
                boolean
              </a-select-option>
              <a-select-option value="bytes">
                bytes
              </a-select-option>
            </a-select>
          </a-col>
          <a-col :span="10"
            v-if="itemControl.first">
            <a-input
              v-decorator="[
                'columnFirst.spliter',
                { rules: [{ required: true, message: '此项不能为空' }] },
              ]"
              placeholder="指定分隔符将array类型转换成字符串"
            />
          </a-col>
        </a-row>
      </a-form-item>
      <a-form-item
        v-for="(k, index) in form.getFieldValue('keys')"
        :key="k"
        :label-col="formItemDynamicLayout.labelCol"
        :wrapper-col="formItemDynamicLayout.wrapperCol"
        :label="'表字段'+(index-0+2)"
        :required="true">
        <a-row :gutter="8">
          <a-col :span="8">
            <a-input
              v-decorator="[
                `column[${k}].name`,
                { rules: [{ required: true, message: '此项不能为空' }] },
              ]"
              placeholder="填写列名"
            />
          </a-col>
          <a-col :span="5">
            <a-select
              v-decorator="[
                `column[${k}].type`,
                { rules: [{ required: true, message: '此项不能为空' }] },
              ]"
              placeholder="选择列类型"
              @change="(value) => {handleSelectChange(value, k)}">
              <a-select-option value="int">
                int
              </a-select-option>
              <a-select-option value="long">
                long
              </a-select-option>
              <a-select-option value="double">
                double
              </a-select-option>
              <a-select-option value="string">
                string
              </a-select-option>
              <a-select-option value="array">
                array
              </a-select-option>
              <a-select-option value="date">
                date
              </a-select-option>
              <a-select-option value="boolean">
                boolean
              </a-select-option>
              <a-select-option value="bytes">
                bytes
              </a-select-option>
            </a-select>
          </a-col>
          <a-col :span="10"
            v-if="itemControl[k]">
            <a-input
              v-decorator="[
                `column[${k}].spliter`,
                { rules: [{ required: true, message: '此项不能为空' }] },
              ]"
              placeholder="指定分隔符将array类型转换成字符串"
            />
          </a-col>
          <a-col :span="1">
            <a-icon
              class="dynamic-delete-button mongo"
              type="minus-circle-o"
              @click="() => remove(k)"
            />
          </a-col>
        </a-row>
      </a-form-item>
      <a-form-item v-bind="formItemLayoutWithOutLabel">
        <a-button type="dashed" style="width: 60%" @click="add">
          <a-icon type="plus" /> 添加表字段
        </a-button>
      </a-form-item>
      <a-form-item :label-col="formTailLayout.labelCol" :wrapper-col="formTailLayout.wrapperCol">
        <a-button type="primary" @click="submit">
          提交
        </a-button>
        <a-button style="margin-left: 10px" @click="resetForm">
          重置
        </a-button>
      </a-form-item>
    </a-form>
    <a-modal
      title="配置命名"
      v-model="visible"
      @ok="confirmName"
      @cancel="cancelName">
      <a-input id="nameInput" v-model="pendingName" placeholder="请输入..." allowClear></a-input>
    </a-modal>
  </div>
</template>

<script>
import './style.scss'
import fetch from '@/services/fetch'
let id = 0
// 普通表单项的样式
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 9 }
}
// 动态表单项的样式
const formItemDynamicLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 }
}
// 提交重置表单项的样式
const formTailLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8, offset: 4 }
}
// 没有label表单项的样式
const formItemLayoutWithOutLabel = {
  wrapperCol: { span: 15, offset: 4 }
}
export default {
  data () {
    return {
      isEdit: false,
      formItemLayout,
      formTailLayout,
      formItemDynamicLayout,
      formItemLayoutWithOutLabel,
      value: {},
      visible: false,
      configureName: '',
      configureId: '',
      pendingName: '',
      itemControl: {} // 控制联动项的显示
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this, { name: 'dynamic_rule' })
    this.form.getFieldDecorator('keys', { initialValue: [], preserve: true })
  },
  mounted () {
    let configureId = this.$route.params.id
    if (configureId) {
      this.isEdit = true
      this.configureId = configureId
      this.initForm()
    }
  },
  methods: {
    // 提交表单
    submit () {
      const { form } = this
      form.validateFields((err, value) => {
        if (!err) {
          this.value = value
          this.showNameModal()
        }
      })
    },
    // 重置表单
    resetForm () {
      const { form } = this
      form.resetFields()
    },
    // 移除表单项
    remove (k) {
      const { form } = this
      const keys = form.getFieldValue('keys')
      form.setFieldsValue({
        keys: keys.filter(key => key !== k)
      })
      delete this.itemControl[k]
    },
    // 添加表单项
    add () {
      const { form } = this
      const keys = form.getFieldValue('keys')
      const nextKeys = keys.concat(id++)
      form.setFieldsValue({
        keys: nextKeys
      })
    },
    // 装载配置内容
    loadContent () {
      let keys = this.value.keys
      this.value.column = this.value.column || []
      this.value.column = this.value.column.filter((item, index) => keys.indexOf(index) >= 0)
      this.value.column.unshift(this.value.columnFirst)
      let newKeys = []
      keys.forEach((item, index) => {
        newKeys.push(index)
      })
      this.value.keys = newKeys
      this.value.itemControl = this.itemControl
      let configureContent = {
        name: 'mongodbreader',
        parameter: {
          address: this.value.address,
          username: this.value.username,
          password: this.value.password,
          dbName: this.value.dbName,
          collectionName: this.value.collectionName,
          column: this.value.column
        }
      }
      return configureContent
    },
    // 新建配置
    async addConfigure () {
      let configureContent = this.loadContent()
      let configureStruct = this.value
      let res = await fetch.post('/addConfigure', {
        configureName: this.configureName,
        configureType: 'mongodbreader',
        configureContent: JSON.stringify(configureContent),
        configureStruct: JSON.stringify(configureStruct)
      })
      this.$message.success(res.data.message)
      this.$router.push({ path: '/config-manage' })
    },
    // 更新配置
    async updateConfigure () {
      let configureStruct = this.value
      let configureContent = this.loadContent()
      let res = await fetch.post('/updateConfigure', {
        configureId: this.configureId,
        configureName: this.configureName,
        configureContent: JSON.stringify(configureContent),
        configureStruct: JSON.stringify(configureStruct)
      })
      this.$message.success(res.data.message)
      this.$router.push({ path: '/config-manage' })
    },
    // 确定命名
    confirmName () {
      if (this.pendingName === '') {
        this.$message.error('配置文件名不能为空')
        return
      }
      this.configureName = this.pendingName
      this.visible = false
      if (!this.isEdit) {
        this.addConfigure()
      } else {
        this.updateConfigure()
      }
    },
    // 取消命名
    cancelName () {
      this.visible = false
    },
    // 显示命名对话框
    showNameModal () {
      this.pendingName = this.configureName
      this.visible = true
      setTimeout(() => {
        let target = document.getElementById('nameInput')
        target.focus()
      }, 400)
    },
    // 初始化表单
    async initForm () {
      let res = await fetch.post('/getOneConfigure', {
        configureId: this.configureId
      })
      this.configureName = res.data.configureName
      this.value = JSON.parse(res.data.configureStruct)
      this.value.column.shift()
      // 初始化联动项
      this.initItemControl()
      id = this.value.keys.length
      this.form.getFieldDecorator('keys', { initialValue: this.value.keys, preserve: true })
      this.$nextTick(() => {
        this.form.setFieldsValue(this.value)
        for (let i = 0, len = this.value.column.length; i < len; i++) {
          this.form.getFieldDecorator('column[' + i + '].name', { initialValue: this.value.column[i].name, preserve: true })
          this.form.getFieldDecorator('column[' + i + '].type', { initialValue: this.value.column[i].type, preserve: true })
          if (this.itemControl[i]) {
            this.form.getFieldDecorator('column[' + i + '].spliter', { initialValue: this.value.column[i].spliter, preserve: true })
          }
        }
      })
    },
    // 初始化联动项
    initItemControl () {
      this.itemControl.first = this.value.itemControl.first
      this.value.column.forEach((item, index) => {
        if (item.type === 'array') {
          this.itemControl[index] = true
        }
      })
    },
    // 处理字段类型选择后的表单联动
    handleSelectChange (value, key) {
      if (value === 'array') {
        this.itemControl[key] = true
      } else {
        this.itemControl[key] = false
      }
    }
  }
}
</script>
