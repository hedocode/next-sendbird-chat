import ChatAPI from '../../../../calls';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ channel_url: string }>}
) {
const channel_url = (await params).channel_url
  const userId = await request.json();
  
  return Response.json(
    userId ?
      await ChatAPI.postOperatorsToChat("group_channels", channel_url, userId)
    :
      { "error": "No user ids array provided" }
  );
}