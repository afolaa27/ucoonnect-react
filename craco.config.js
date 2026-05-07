module.exports = {
  style: {
    css: {
      loaderOptions: {
        url: {
          filter: (url) => !url.startsWith('data:')
        }
      }
    }
  }
}
