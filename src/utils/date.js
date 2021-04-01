export function getDate() {
  const now = new Date()
  return now.getFullYear() + '年' + parseInt(now.getMonth() + 1) + '月' + now.getDate() + '日'
}
