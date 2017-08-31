const fs = require('fs')
const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')

const immutable = require('immutable')
const fetch = require('isomorphic-fetch')

const app = express()

const TOKEN = process.env.CHALLENGE_GH_TOKEN || fs.readFileSync(path.resolve(__dirname, '..', '.token'))

app.use(bodyParser.json({ type: 'application/json' }))

let cache = new Map()

app.use(express.static(path.resolve(__dirname, '..', 'build')))

app.post('/graphql', async (req, res) => {
  const { query } = req.body
  console.log(req.body)
  if (!query) return res.sendStatus(400)

  const response = await fetch('https://api.github.com/graphql', {
    headers: new Headers({
      Authorization: `bearer ${TOKEN}`
    }),
    body: JSON.stringify({ query }),
    method: 'POST'
  })

  if (response.status == 401) {
    res.sendStatus(401)
  }

  const json = await response.json()
  const edges = immutable.fromJS(
    json.data.search
      ? json.data.search.edges.reduce(
          (list, n) => list.push(immutable.fromJS(n.node)),
          immutable.List()
        )
      : immutable.fromJS(json.data)
  )

  return res.json(edges.toJSON())
})

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'))
})

module.exports = app
