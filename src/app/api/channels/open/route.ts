import ChatAPI from '../../calls';

export async function GET() {
  const openChannels = await ChatAPI.listOpenChannels();
  return Response.json(openChannels);
}

export async function POST( request: Request ) {
  const formData = await request.formData()
  const name = formData.get("name")?.toString();
  return Response.json(
    name ?
      await ChatAPI.postOpenChannel({ name, cover_url: "" })
    :
      { "error": "No name provided" }
  );
}