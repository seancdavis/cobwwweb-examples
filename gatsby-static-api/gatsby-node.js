const fs = require("fs")

exports.onPostBuild = async ({ graphql }) => {
  graphql(`
    {
      earworms: allEarwormsYaml {
        edges {
          node {
            song_id
            date(formatString: "YYYY-MM-DD")
            artist
            title
            spotify_url
          }
        }
      }
    }
  `).then(result => {
    // A reference to where we are going to put the files.
    const earwormsPath = "./public/earworms"

    // Collect the data for all earworms
    const earworms = result.data.earworms.edges.map(({ node }) => node)

    // Query result for the index file.
    const allEarworms = {
      result: earworms,
      meta: {
        count: earworms.length,
      },
    }

    // Write the index file.
    fs.writeFileSync(`${earwormsPath}.json`, JSON.stringify(allEarworms))

    // Create directory for individual files if it doesn't exist.
    if (!fs.existsSync(earwormsPath)) fs.mkdirSync(earwormsPath)

    // Write individual files.
    earworms.map(worm => {
      fs.writeFileSync(
        `${earwormsPath}/${worm.song_id}.json`,
        JSON.stringify(worm)
      )
    })
  })
}
