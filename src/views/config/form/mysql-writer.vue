<template>
  <div class="form-container">
    <div class="title" v-if="isEdit">配置文件名: {{configureName}}</div>
    <a-form :form="form">
      <a-form-item
        :label-col="formItemLayout.labelCol"
        :wrapper-col="formItemLayout.wrapperCol"
        label="用户名">
        <a-input
          v-decorator="[
            'username',
            { rules: [{ required: true, message: '此项不能为空' }] },
          ]"
          placeholder="连接数据库的用户名"
        />
      </a-form-item>
      <a-form-item
        :label-col="formItemLayout.labelCol"
        :wrapper-col="formItemLayout.wrapperCol"
        label="密码">
        <a-input
          v-decorator="[
            'password',
            { rules: [{ required: true, message: '此项不能为空' }] },
          ]"
          placeholder="连接数据库密码"
        />
      </a-form-item>
      <a-form-item
        :label-col="formItemLayout.labelCol"
        :wrapper-col="formItemLayout.wrapperCol"
        label="ip">
        <a-input
          v-decorator="[
            'ip',
            { rules: [{ required: true, message: '此项不能为空' }] },
          ]"
          placeholder="数据库服务器IP"
        />
      </a-form-item>
      <a-form-item
        :label-col="formItemLayout.labelCol"
        :wrapper-col="formItemLayout.wrapperCol"
        label="端口">
        <a-input
          v-decorator="[
            'port',
            { rules: [{ required: true, message: '此项不能为空' }] },
          ]"
          placeholder="数据库服务端口"
        />
      </a-form-item>
      <a-form-item
        :label-col="formItemLayout.labelCol"
        :wrapper-col="formItemLayout.wrapperCol"
        label="数据库名">
        <a-input
          v-decorator="[
            'database',
            { rules: [{ required: true, message: '此项不能为空' }] },
          ]"
          placeholder="数据库名"
        />
      </a-form-item>
      <a-form-item
        :label-col="formItemLayout.labelCol"
        :wrapper-col="formItemLayout.wrapperCol"
        label="表名">
        <a-input
          v-decorator="[
            'table',
            { rules: [{ required: true, message: '此项不能为空' }] },
          ]"
          placeholder="表名"
        />
      </a-form-item>
      <a-form-item
        :label-col="formItemLayout.labelCol"
        :wrapper-col="formItemLayout.wrapperCol"
        label="表字段1">
        <a-input
          v-decorator="[
            'columnFirst',
            { rules: [{ required: true, message: '此项不能为空' }] },
          ]"
        />
      </a-form-item>
      <a-form-item
        v-for="(k, index) in form.getFieldValue('keys')"
        :key="k"
        :label-col="formItemDynamicLayout.labelCol"
        :wrapper-col="formItemDynamicLayout.wrapperCol"
        :label="'表字段'+(index-0+2)"
        :required="true">
        <a-input
          v-decorator="[
            `column[${k}]`,
            {
              validateTrigger: ['change', 'blur'],
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: '此项不能为空',
                },
              ],
            },
          ]"
          style="width:82%;margin-right:15px;"/>
        <a-icon
          class="dynamic-delete-button"
          type="minus-circle-o"
          @click="() => remove(k)"
        />
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
  wrapperCol: { span: 11 }
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
      pendingName: ''
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
      let configureContent = {
        name: 'mysqlwriter',
        parameter: {
          username: this.value.username,
          password: this.value.password,
          ip: this.value.ip,
          port: this.value.port,
          database: this.value.database,
          column: this.value.column,
          connection: {
            table: this.value.table,
            jdbcUrl: 'jdbc:mysql://' + this.value.ip + ':' + this.value.port + '/' + this.value.database + '?useUnicode=true&characterEncoding=UTF-8&useSSL=false&serverTimezone=GMT'
          }
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
        configureType: 'mysqlwriter',
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
      id = this.value.keys.length
      this.form.getFieldDecorator('keys', { initialValue: this.value.keys, preserve: true })
      this.$nextTick(() => {
        for (let i = 0, len = this.value.column.length; i < len; i++) {
          this.form.getFieldDecorator('column[' + i + ']', { initialValue: this.value.column[i], preserve: true })
        }
        this.form.setFieldsValue(this.value)
      })
    }
  }
}
</script>
