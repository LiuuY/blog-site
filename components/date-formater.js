import { parseISO, format } from 'date-fns'

export default function DateFormater({ dateString }) {
  const date = parseISO(dateString)
  return <time dateTime={dateString}>{format(date, 'yyyy-MM-dd')}</time>
}
