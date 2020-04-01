<template>
  <div class="form-container">
    <div class="title" v-if="isEdit">配置文件名: {{configureName}}</div>
    <a-form :form="form">
      <a-form-item
        :label-col="formItemLayout.labelCol"
        :wrapper-col="formItemLayout.wrapperCol"
        label="读取HDFS文件路径">
        <a-input
          v-decorator="[
            'path',
            { rules: [{ required: true, message: '此项不能为空' }] },
          ]"
          placeholder="绝对路径"
        />
      </a-form-item>
      <a-form-item
        :label-col="formItemLayout.labelCol"
        :wrapper-col="formItemLayout.wrapperCol"
        label="HDFS服务地址">
        <a-input
          v-decorator="[
            'defaultFS',
            { rules: [{ required: true, message: '此项不能为空' }] },
          ]"
          placeholder="hdfs://IP:端口"
        />
      </a-form-item>
      <a-form-item
        :label-col="formItemLayout.labelCol"
        :wrapper-col="formItemLayout.wrapperCol"
        label="表字段1">
        <a-row :gutter="8">
          <a-col :span="16">
            <a-input
              v-decorator="[
                'columnFirst.index',
                { rules: [{ required: true, message: '此项不能为空' }] },
              ]"
              placeholder="填写列名"
            />
          </a-col>
          <a-col :span="8">
            <a-select
              v-decorator="[
                'columnFirst.type',
                { rules: [{ required: true, message: '此项不能为空' }] },
              ]"
              placeholder="选择列类型">
              <a-select-option value="long">
                long
              </a-select-option>
              <a-select-option value="double">
                double
              </a-select-option>
              <a-select-option value="string">
                string
              </a-select-option>
              <a-select-option value="date">
                date
              </a-select-option>
              <a-select-option value="boolean">
                boolean
              </a-select-option>
            </a-select>
          </a-col>
        </a-row>
      </a-form-item>
      <a-form-item
        v-for="(k, index) in form.getFieldValue('keys')"
        :key="k"
        :label-col="formItemLayout.labelCol"
        :wrapper-col="formItemLayout.wrapperCol"
        :label="'表字段'+(index-0+2)"
        :required="true">
        <a-row :gutter="8">
          <a-col :span="16">
            <a-input
              v-decorator="[
                `column[${k}].index`,
                { rules: [{ required: true, message: '此项不能为空' }] },
              ]"
              placeholder="填写列名"
            />
          </a-col>
          <a-col :span="7">
            <a-select
              v-decorator="[
                `column[${k}].type`,
                { rules: [{ required: true, message: '此项不能为空' }] },
              ]"
              placeholder="选择列类型">
              <a-select-option value="long">
                long
              </a-select-option>
              <a-select-option value="double">
                double
              </a-select-option>
              <a-select-option value="string">
                string
              </a-select-option>
              <a-select-option value="date">
                date
              </a-select-option>
              <a-select-option value="boolean">
                boolean
              </a-select-option>
            </a-select>
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
      <a-form-item
        :label-col="formItemLayout.labelCol"
        :wrapper-col="formItemLayout.wrapperCol"
        label="文件类型">
        <a-select
          v-decorator="[
            'fileType',
            { rules: [{ required: true, message: '此项不能为空' }] },
          ]"
          placeholder="选择文件类型"
          @change="setCompressType">
          <a-select-option value="ORC">
            ORC
          </a-select-option>
          <a-select-option value="TEXT">
            TEXT
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        :label-col="formItemLayout.labelCol"
        :wrapper-col="formItemLayout.wrapperCol"
        label="文件压缩方式">
        <a-select
          v-decorator="[
            'compress',
            { rules: [{ required: false }] },
          ]"
          placeholder="默认不填代表不压缩">
          <a-select-option v-for="(item, index) of compressType" :key="index" :value="item">
            {{item}}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        :label-col="formItemLayout.labelCol"
        :wrapper-col="formItemLayout.wrapperCol"
        label="文件切割符">
        <a-input
          v-decorator="[
            'fieldDelimiter',
            { rules: [{ required: false }] },
          ]"
          placeholder="默认切割符号为英文逗号"
        />
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
// 提交重置表单项的样式
const formTailLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8, offset: 4 }
}
// 没有label表单项的样式
const formItemLayoutWithOutLabel = {
  wrapperCol: { span: 15, offset: 4 }
}
// 文件类型对应的压缩方式
const map = {
  'ORC': ['none', 'snappy'],
  'TEXT': ['gzip', 'bzip2']
}
export default {
  data () {
    return {
      isEdit: false,
      formItemLayout,
      formTailLayout,
      formItemLayoutWithOutLabel,
      value: {},
      visible: false,
      configureName: '',
      configureId: '',
      pendingName: '',
      compressType: undefined
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
        name: 'hdfswriter',
        parameter: {
          path: this.value.path,
          defaultFS: this.value.defaultFS,
          column: this.value.column,
          fileType: this.value.fileType,
          compress: this.value.compress,
          fieldDelimiter: this.value.fieldDelimiter
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
        configureType: 'hdfswriter',
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
        this.form.setFieldsValue(this.value)
        for (let i = 0, len = this.value.column.length; i < len; i++) {
          this.form.getFieldDecorator('column[' + i + '].index', { initialValue: this.value.column[i].name, preserve: true })
          this.form.getFieldDecorator('column[' + i + '].type', { initialValue: this.value.column[i].type, preserve: true })
        }
      })
    },
    // 设置压缩类型
    setCompressType (value) {
      console.log(value)
      this.compressType = map[value]
    }
  }
}
</script>
