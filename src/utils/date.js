export function getDate() {
  const now = new Date()
  let month = now.getMonth() + 1
  if (parseInt(month) < 10) {
    month = '0'+month
  }
  let date = now.getDate()
  if (parseInt(date) < 10) {
    date = '0'+date
  }
  return now.getFullYear() + '年' + month + '月' + date + '日'
}
