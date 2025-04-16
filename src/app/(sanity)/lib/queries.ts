import {defineQuery} from 'next-sanity'

export const POSTS_QUERY = defineQuery(`*[_type == "post" && defined(slug.current)][0...1000]{
  _id, title, slug, 
  "authorName": author->name,
    mainImage {
      asset-> {
        url
      },
      alt
    },
    categories[]-> {
      title
    },
    _createdAt,
    body
}`)

export const POST_QUERY = defineQuery(`*[_type == "post" && slug.current == $slug][0]{
  title, body, mainImage,slug
  "authorName": author->name,
    mainImage {
      asset-> {
        url
      },
      alt
    },
    categories[]-> {
      title
    },
    gallery[] {
      asset-> {
        _id,
        url
      },
      caption
    },
    publishedAt,
    body
}`)

export const POSTS_QUERY2 = defineQuery(`
  *[_type == "package" && defined(slug.current)][0...1000] | order(orderRank asc) {
    _id, 
    title, 
    slug, 
    traffic, 
    price, 
    time,
    timeTraffic,
    mainImage {
      asset-> {
        url
      },
      alt
    },
    categories[]-> {
      title
    },
    sub_categories[]-> {
      title
    },
    gallery[] {
      asset-> {
        _id,
        url
      },
      caption
    },
    _createdAt,
    body,
    globalField[]-> {
      title
    },
    "globalField": *[_type == "global"][0].globalField,
    orderRank
  }`);

// export const POSTS_QUERY2 = defineQuery(`*[_type == "package" && !defined(subCategory) && defined(slug.current)][0...12]{
//   _id, 
//   title, 
//   slug, 
//   traffic, 
//   price, 
//   time,
//   mainImage {
//     asset-> {
//       url
//     },
//     alt
//   },
//   categories[]-> {
//     title,
//     "subCategories": *[_type == "category" && subCategory._ref == ^._id] {
//       title,
//       slug
//     }
//   },
//   gallery[] {
//     asset-> {
//       _id,
//       url
//     },
//     caption
//   },
//   _createdAt,
//   body
// }`);


export const POST_QUERY2 = defineQuery(`*[_type == "package" && slug.current == $slug][0]{
  title, body, mainImage,slug, traffic, price, time,
    categories[]-> {
      title
    },
   sub_categories[]-> {
      title
    },
    publishedAt,
   "globalField": *[_type == "global"][0].globalField

}`)
