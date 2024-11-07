import ChatAPI from '@/app/api/calls';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ channel_url: string }> }
) {
    const channel_url = (await params).channel_url;
    const openChannels = await ChatAPI.getOpenChannelParticipants(channel_url);
    return Response.json(openChannels);
}