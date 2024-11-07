import ChatAPI from '../../calls';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ userId: string }> }
) {
    const userId = (await params).userId;
    const user = await ChatAPI.getUser(userId);
    return Response.json(user);
}