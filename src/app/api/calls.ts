import APIAdapter from "./adapter";

export default class ChatAPI extends APIAdapter {

    constructor() {
        super();
    }
  
    static async getUser(userId: string) {
        return (await this.get(`users/${userId}`));
    }

    static async listUsers() {
        return (await this.get("users")).users;
    }

    static async postUser(userId: string) {
        return await this.post(
            "users", {
                user_id: userId,
                nickname: userId,
                profile_url: "",
                issue_access_token: true,
            }
        );
  }

    static async listOpenChannels() {
        return (await this.get("open_channels")).channels;
    }

    static async listGroupChannels() {
        return (await this.get("group_channels")).channels;
    }

    static async postGroupChannel(usersIdArray: string[]) {
        console.log("usersIdArray : %o", usersIdArray);
        return (await this.post("group_channels", { user_ids: usersIdArray}));
    }

    static async getOpenChannel(channel_url: string) {
        return await this.get(`open_channels/${channel_url}`);
    }

    static async postOpenChannel({ name = "", cover_url = "" }) {
        return await this.post(`open_channels/`, { name, channel_url: name, cover_url});
    }

    static async getOpenChannelParticipants(channel_url: string) {
        return await this.get(`open_channels/${channel_url}/participants`);
    }

    static async deleteOpenChannel(channel_url: string) {
        return await this.delete(`open_channels/${channel_url}`);
    }

    static async joinChannel(channel_url: string, user_id: string) {
        return await this.put(`group_channels/${channel_url}/join`, { user_id });
    }

    static async listMessages(channel_type: string, channel_url: string) {
        return await this.get(`${channel_type}/${channel_url}/messages`);
    }

    async enterOpenChannel(channel_url: string) {
        const channel = this.calls.openChannel.getChannel(channel_url);
        return (await channel).enter();
    }
}