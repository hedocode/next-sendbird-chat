import Button from "@/components/Button";
import { useAuthContext } from "@/contexts/auth";
import { User } from "@sendbird/chat";


export default function ParticipantList(
    { channelParticipants, goPrivate }
    : { channelParticipants?: User[], goPrivate?: Function }
) {
    const { userId } = useAuthContext();

    return channelParticipants && (
        <section>
            <h3>Participants en ligne :</h3>
            {channelParticipants.map(
                participant => (
                    <div key={participant.userId}>
                        {participant.userId} {
                            participant.userId === userId ?
                                "(you)"
                            :
                                <Button
                                    onClick={
                                        goPrivate ?
                                            () => goPrivate(participant.userId)
                                        : () => {}
                                    }
                                >&gt;</Button>
                        }
                    </div>
                )
            )}
            <br/>
        </section>
    )
}