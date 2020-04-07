import dateUtil from '@/utils/date'

let config = {
  HOST: 'http://localhost:8080',
  API_HOST: 'http://120.78.93.168:8088',
  PROCESS_COLUMNS: [
    {
      title: '流程名称',
      key: 'processName',
      ellipsis: true,
      scopedSlots: { customRender: 'processName' }
    },
    {
      title: '创建者',
      dataIndex: 'userName',
      key: 'userName',
      ellipsis: true
    },
    {
      title: '输入类型',
      key: 'input',
      dataIndex: 'input',
      ellipsis: true
    },
    {
      title: '输出类型',
      dataIndex: 'output',
      key: 'output',
      ellipsis: true
    },
    {
      title: '状态',
      dataIndex: 'state',
      key: 'state',
      width: 80,
      ellipsis: true,
      scopedSlots: { customRender: 'state' },
      sorter: (a, b) => {
        return a.state > b.state
      }
    },
    {
      title: '最近编辑时间',
      key: 'updateTime',
      dataIndex: 'updateTime',
      ellipsis: true,
      scopedSlots: { customRender: 'updateTime' },
      sorter: (a, b) => {
        return dateUtil.getTime(a.updateTime) - dateUtil.getTime(b.updateTime)
      }
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 250,
      ellipsis: true,
      scopedSlots: { customRender: 'action' }
    }
  ],
  PROCESS_STATE_MAP: {
    '运行中': 'green',
    '使用中': 'green',
    '停止': 'red'
  },
  CONFIG_COLUMNS: [
    {
      title: '配置文件名',
      key: 'configureName',
      scopedSlots: { customRender: 'configureName' },
      ellipsis: true
    },
    {
      title: '配置文件类型',
      dataIndex: 'configureType',
      key: 'configureType',
      ellipsis: true
    },
    {
      title: '创建者',
      dataIndex: 'userName',
      key: 'userName',
      ellipsis: true
    },
    {
      title: '状态',
      dataIndex: 'state',
      key: 'state',
      scopedSlots: { customRender: 'state' },
      sorter: (a, b) => {
        return a.state > b.state
      }
    },
    {
      title: '最近更新时间',
      key: 'updateTime',
      dataIndex: 'updateTime',
      ellipsis: true,
      scopedSlots: { customRender: 'updateTime' },
      sorter: (a, b) => {
        return dateUtil.getTime(a.updateTime) - dateUtil.getTime(b.updateTime)
      }
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 200,
      ellipsis: true,
      scopedSlots: { customRender: 'action' }
    }
  ],
  DEPLOYMENT_COLUMNS: [
    {
      title: '部署名',
      fixed: 'left',
      dataIndex: 'deploymentName',
      key: 'deploymentName',
      ellipsis: true
    },
    {
      title: '创建者',
      dataIndex: 'userName',
      key: 'userName',
      ellipsis: true
    },
    {
      title: '输入配置',
      key: 'input',
      scopedSlots: { customRender: 'input' },
      ellipsis: true
    },
    {
      title: '输出配置',
      key: 'output',
      scopedSlots: { customRender: 'output' },
      ellipsis: true
    },
    {
      title: '流程名',
      scopedSlots: { customRender: 'processName' },
      key: 'processName',
      ellipsis: true
    },
    {
      title: '状态',
      dataIndex: 'state',
      key: 'state',
      width: 80,
      ellipsis: true,
      scopedSlots: { customRender: 'state' },
      sorter: (a, b) => {
        return a.state > b.state
      }
    },
    {
      title: '最近更新时间',
      key: 'updateTime',
      dataIndex: 'updateTime',
      ellipsis: true,
      scopedSlots: { customRender: 'updateTime' },
      sorter: (a, b) => {
        return dateUtil.getTime(a.updateTime) - dateUtil.getTime(b.updateTime)
      }
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 200,
      ellipsis: true,
      scopedSlots: { customRender: 'action' }
    }
  ]
}

export default config
