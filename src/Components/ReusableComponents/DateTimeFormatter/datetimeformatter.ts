
/**
 *@function dateTimeFormatter 
 *@description Converts "2023-01-24T06:22:18.000000Z" in to "Jan 24, 2023 11:07 AM"
 */

export const dateTimeFormatter = (data) => {
    const date = new Date(data).toLocaleDateString('en-us', { day: "numeric", month: "short", year: "numeric" })
    var event = new Date(data)
    const time = event.toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' })
    return `${date} ${time}`
}