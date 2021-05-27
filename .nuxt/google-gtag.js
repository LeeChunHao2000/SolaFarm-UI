export default function ({app: {router}}, inject) {
  if(true){
    // inject empty gtag function for disabled mode
    inject('gtag', () => {})
    return
  }

  window.dataLayer = window.dataLayer || []
  function gtag () {
    dataLayer.push(arguments)
    if(false){
      console.debug('gtag tracking called with following arguments:', arguments)
    }
  }
  inject('gtag', gtag)
  gtag('js', new Date())
  gtag('config','G-78BZ5BGCV5',)

  if(!false){
    router.afterEach((to) => {
      gtag('config', 'G-78BZ5BGCV5', {'page_path': to.fullPath})
    })
  }

  // additional accounts
}
