export const getMessageDate = (date: Date) => {
  const day = date.getDate()
  const year = date.getFullYear()

  if (year !== new Date().getFullYear()) { // if not this year, returns 'day.month.year'
    const month = date.getMonth() < 9 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
    return `${day < 10 ? `0${day}` : day}.${month}.${year}`
  }
  // otherwise returns 'day fullMonth'
  const month = date.toLocaleString('en-GB', { month: 'long' });
  return `${day} ${month}`
}

export const getSidebarDate = (date: Date) => {
  if (date.getDate() === new Date().getDate()
  && date.getMonth() === new Date().getMonth()) { // if today returns 'hours:minutes'
    const hours = date.getHours()
    const minutes = date.getMinutes()
    return `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}`
  }
  return getMessageDate(date)
}