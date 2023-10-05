import axios from "axios";

export async function GET(req: Request) {
  // console.log("REQ: ", req);
  // console.log("REQ BODY", req.body);
  const url = new URL(req.url);
  // console.log("URL ", url);
  const href = url.searchParams.get("url");
  if (!href) {
    return new Response("Invalid HREF", { status: 400 });
  }

  const res = await axios.get(href);

  // console.log("RES: ", res);
  // console.log("RESDATA: ", res);

  // Parse the HTML using regular expressions
  const titleMatch = res.data.match(/<title>(.*?)<\/title>/);
  const title = titleMatch ? titleMatch[1] : "";

  const descriptionMatch = res.data.match(
    /<meta name="description" content="(.*?)"/
  );
  const description = descriptionMatch ? descriptionMatch[1] : "";

  const imageMatch = res.data.match(
    /<meta property="og:image" content="(.*?)"/
  );
  const imageUrl = imageMatch ? imageMatch[1] : "";

  // Return the data in the format required by the editor tool
  return new Response(
    JSON.stringify({
      success: 1,
      meta: {
        title,
        description,
        image: {
          url: imageUrl,
        },
      },
    })
  );
}
