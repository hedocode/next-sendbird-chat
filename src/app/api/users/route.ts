import ChatAPI from "../calls";

export async function GET() {
  const appUsers = await ChatAPI.listUsers();
  return Response.json(appUsers);
}

export async function POST( request: Request ) {
  const { userId } = await request.json()
  
  let newUser
  if(userId) {
    newUser = await ChatAPI.postUser(userId);
  }
  
  return Response.json(
    userId ?
      newUser
    :
      { "error": "Please provide an object with a userId attribute provided" }
  );
}