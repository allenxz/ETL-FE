// 格式化字节数
function formatBytes (bytes) {
  const G = 1024 * 1024 * 1024
  const M = 1024 * 1024
  const K = 1024
  if (bytes >= G) {
    return (bytes / G).toFixed(2) + 'G'
  }
  if (bytes >= M) {
    return (bytes / M).toFixed(2) + 'M'
  }
  if (bytes >= K) {
    return (bytes / K).toFixed(2) + 'K'
  }
  return bytes
}

export default formatBytes
