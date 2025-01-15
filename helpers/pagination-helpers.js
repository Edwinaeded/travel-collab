const getPagination = (count = 16, limit = 8, offset = 8) => {
  const totalPage = Math.ceil(count / limit)
  const pages = Array.from({ length: totalPage }, (v, i) => i + 1)
  const currentPage = (offset / limit) + 1
  const previousPage = currentPage - 1 < 1 ? currentPage : currentPage - 1
  const nextPage = currentPage + 1 > totalPage ? currentPage : currentPage + 1

  return {
    totalPage,
    pages,
    currentPage,
    previousPage,
    nextPage
  }
}

module.exports = {
  getPagination
}
