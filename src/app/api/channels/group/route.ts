import ChatAPI from '@/app/api/calls';

export async function GET() {
  const openChannels = await ChatAPI.listGroupChannels();
  return Response.json(openChannels);
}

export async function POST(request: Request) {

  const requestJSON = await request.json()
  const { usersId } = requestJSON;

  if(usersId) {
    const postedGroup = await ChatAPI.postGroupChannel(usersId);
    return Response.json(postedGroup);
  }
  

  return Response.json({
    "error": "Please provide a usersId string array on the POST body"
  });
}