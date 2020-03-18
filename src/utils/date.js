// 时间戳格式化
function formatDateTime (inputTime) {
  var date = new Date(inputTime)
  var y = date.getFullYear()
  var m = date.getMonth() + 1
  m = m < 10 ? '0' + m : m
  var d = date.getDate()
  d = d < 10 ? '0' + d : d
  var h = date.getHours()
  h = h < 10 ? '0' + h : h
  var minute = date.getMinutes()
  var second = date.getSeconds()
  minute = minute < 10 ? '0' + minute : minute
  second = second < 10 ? '0' + second : second
  return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second
}

// 时间戳转毫秒
function getTime (inputTime) {
  return new Date(inputTime).getTime()
}

export default {
  formatDateTime,
  getTime
}
