import dateUtil from '@/utils/date'

let config = {
  HOST: 'http://localhost:8080',
  API_HOST: 'http://120.78.93.168:8088',
  PROCESS_COLUMNS: [
    {
      title: '流程ID',
      dataIndex: 'processId',
      key: 'processId'
    },
    {
      title: '流程名称',
      dataIndex: 'processName',
      key: 'processName'
    },
    {
      title: '创建者',
      dataIndex: 'userName',
      key: 'userName'
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
      title: '最近编辑时间',
      key: 'updateTime',
      dataIndex: 'updateTime',
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
      scopedSlots: { customRender: 'action' }
    }
  ],
  PROCESS_STATE_MAP: {
    '正常': 'green',
    '停止': 'red'
  },
  CONFIG_COLUMNS: [
    {
      title: '配置文件ID',
      dataIndex: 'configureId',
      key: 'configureId'
    },
    {
      title: '配置文件类型',
      dataIndex: 'configureType',
      key: 'configureType'
    },
    {
      title: '配置文件名',
      dataIndex: 'configureName',
      key: 'configureName'
    },
    {
      title: '创建者',
      dataIndex: 'username',
      key: 'username'
    },
    {
      title: '状态',
      dataIndex: 'state',
      key: 'state'
    },
    {
      title: '最近更新时间',
      key: 'updateTime',
      dataIndex: 'updateTime',
      scopedSlots: { customRender: 'updateTime' },
      sorter: (a, b) => {
        return dateUtil.getTime(a.updateTime) - dateUtil.getTime(b.updateTime)
      }
    }
  ]
}

export default config
