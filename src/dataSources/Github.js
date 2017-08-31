import immutable, { List } from 'immutable'

let cache = new Map()

async function graphql(query) {
  if (cache.has(query)) return cache.get(query)

  const response = await fetch('/graphql', {
    body: JSON.stringify({ query }),
    method: 'POST',
    mode: 'same-origin',
    headers: new Headers({
      'Content-Type': 'application/json'
    })
  })

  if (response.status === 401) {
    return immutable.fromJS([])
  }

  const json = await response.json()
  const edges = immutable.fromJS(json)

  cache.set(query, edges)

  return edges
}

export const repositories = async query =>
  graphql(`
query {
  search(query: "${query}", type: REPOSITORY, first: 10) {
    total: repositoryCount
    edges {
      node {
        ... on Repository {
          name: nameWithOwner
        }
      }
    }
  }
}`)

export const users = async query =>
  graphql(`
query {
  search(query: "${query}", type: USER, first: 10) {
    total: userCount
    edges {
      node {
        ... on User {
          name: login
          link: url
          avatar:avatarUrl
        }
      }
    }
  }
}`)

export const relatedTopics = async query => {
  const edges = await graphql(`
query {
  topic(name: "${query}") {
    name,
    relatedTopics {
      ... on Topic {
        name
      }
    }
  }
}
`)
  return List(edges.getIn(['topic', 'relatedTopics']) || [])
}

export const reposByUser = async query => {
  const edges = await graphql(`
query {
  search(query: "${query}", type: USER, first: 1) {
    edges {
      node {
        ... on User {
          repositories(first: 100) {
            nodes {
              link: url,
              name
            }
          }
        }
      }
    }
  }
}`)
  return edges.getIn([0, 'repositories', 'nodes']) || []
}
