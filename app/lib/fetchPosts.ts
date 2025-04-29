import axios from 'axios';

export async function fetchPosts(after: Date, before: Date, category: string) {

  const response = await axios.post(
    'https://api.producthunt.com/v2/api/graphql',
    {
      query: `
        query GetTopPosts($after: DateTime!, $before: DateTime!) {
          posts(first: 5, order: RANKING, postedAfter: $after, postedBefore: $before) {
            edges {
              node {
                name
                tagline
                votesCount
                createdAt
                url
                website
                thumbnail {
                  url
                }
              }
            }
          }
        }
      `,
      variables: {
        after: after.toISOString(),
        before: before.toISOString()
      }
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.PH_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    }
  );

  console.log(response.data.data.posts.edges.map((edge: any) => edge.node));

  return response.data.data.posts.edges.map((edge: any) => edge.node);
}
