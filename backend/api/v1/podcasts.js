const express = require('express')

const axios = require('axios')
const base_api = process.env.BASE_API

const getEpisodes = (limit, offset) => {
  const url =
    base_api + `/podcast/episodes/list?limit=${limit}&offset=${offset}`
  return axios.get(url).then(res => res.data)
}

module.exports = cache => {
  const router = express.Router()

  router.get('/', (req, res) => {
    const limit = +req.query.limit || 10
    const offset = +req.query.offset || 0

    getEpisodes(limit, offset)
      .then(({ total, episodes }) => {
        const hasMore = limit + offset <= total

        res.send({
          items: episodes,
          limit,
          offset,
          total,
          hasMore
        })
      })
      .catch(error =>
        res.status(500).send({ success: false, error: error.data.errorMessage })
      )
  })

  return router
}