import dayjs from 'dayjs'

import 'dayjs/locale/en'

dayjs.locale('en')

export default (context, inject) => {
  context.$dayjs = dayjs
  inject('dayjs', dayjs)
}
