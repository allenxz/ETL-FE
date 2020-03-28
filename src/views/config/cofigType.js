// 所有配置文件的类型
let configType = {
  reader: [
    {
      name: 'mysqlreader'
    },
    {
      name: 'mongodbreader'
    },
    {
      name: 'hdfsreader'
    }
  ],
  writer: [
    {
      name: 'mysqlwriter'
    },
    {
      name: 'mongodbwriter'
    },
    {
      name: 'hdfswriter'
    }
  ]
}

export default configType
