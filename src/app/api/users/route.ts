import ChatAPI from "../calls";

export async function GET(request: Request) {
  const appUsers = await ChatAPI.listUsers();
  return Response.json(appUsers);
}

export async function POST( request: Request ) {
    const formData = await request.formData()
    const userId = formData.get("userId")?.toString();
    return Response.json(
      userId ?
        await ChatAPI.postUser(userId)
      :
        { "error": "No userId provided" }
    );
  }