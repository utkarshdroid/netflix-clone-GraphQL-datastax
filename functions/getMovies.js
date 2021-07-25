const fetch = require('node-fetch')

exports.handler = async function (event) {
    const body = JSON.parse(event.body)
    console.log(event.body)
  const genre = body.genre
  const pageState=  body.pageState
  const url = process.env.ASTRA_GRAPHQL_ENDPOINT
  console.log(url)
  console.log(process.env.ASTRA_DATABASE_APPLICATION_TOKEN)

  const query = `
  query  {
    movies_by_genre (
      value: {genre :${JSON.stringify(genre)}},
          orderBy: [year_DESC],
    options: {pageSize:4 ,pageState: ${JSON.stringify(pageState)}}
    ) {
      values {
        title
        ,duration
        ,synopsis
        ,thumbnail
      }
      pageState
    }
  }
  `  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "x-cassandra-token": process.env.ASTRA_DATABASE_APPLICATION_TOKEN
    },
    body: JSON.stringify({ query })
  })

  try {
    const responseBody = await response.json()
    return {
      statusCode: 200,
      body: JSON.stringify(responseBody)
    }
  } catch (e) {
    console.log(e)
    return {
      statusCode: 500,
      body: JSON.stringify(e.responseText)
    }
  }
}