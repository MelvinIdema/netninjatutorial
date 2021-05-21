import Image from "next/image";
import { createClient } from "contentful";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";

const client = createClient({
    space: process.env.CONTENT_SPACE_ID,
    accessToken: process.env.CONTENT_API_KEY
});

export async function getStaticPaths() {
   const res = await client.getEntries({
       content_type: "recipe"
   });

   const paths = res.items.map(item => (
       {
           params: {
               slug: item.fields.slug
           }
       }
   ))

    return {
        paths,
        fallback: false
    };
}

export async function getStaticProps(context) {
    const res = await client.getEntries({
        content_type: 'recipe',
        'fields.slug': context.params.slug
    });

    return {
        props: {
            recipe: res.items[0]
        }
    }

}

export default function RecipeDetails({recipe}) {
  const { featuredImage, title, cookingTime, ingredients, method } = recipe.fields;
  return (
    <div>
      <div className="banner">
          <Image
              src={`https:${featuredImage.fields.file.url}`}
              width="1366px"
              height="600px"
          />
          <h2>{ title }</h2>
      </div>
        <div className="info">
            <p>Takes about {cookingTime} mins to cook.</p>
            <h3>Ingredients:</h3>
            <ul>
                {
                    ingredients.map(ingredient => (
                        <li key={ingredient}>{ingredient}</li>
                    ))
                }
            </ul>
        </div>
        <div className="method">
            <h3>Method:</h3>
            <div>
                {documentToReactComponents(method)}
            </div>
        </div>
        <style jsx>{`
          h2, h3 {
            text-transform: uppercase;
          }
          
          .banner h2 {
            margin: 0;
            background: #fff;
            display: inline-block;
            padding: 20px;
            position: relative;
            top: -60px;
            left: -10px;
            transform: rotateZ(-1deg);
            box-shadow: 1px 3px 5px rgba(0,0,0,.1);
          }
          
          .info p {
            margin: 0;
          }
        `}</style>
    </div>
  )
}