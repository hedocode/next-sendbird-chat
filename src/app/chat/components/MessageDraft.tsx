import Button from "@/components/Button";
import Input from "@/components/Input";

export default function MessageDraft(
    { messageDraft, setMessageDraft, sendMessage }
    : { messageDraft: string, setMessageDraft: Function, sendMessage: Function }
) {
    return (
        <div className='flex w-full p-2 z-10 shadow-inner'>
            <Input className="mr-2" value={messageDraft} onChange={(e : React.FormEvent<HTMLInputElement>) => setMessageDraft(e.currentTarget.value)} />
            <Button onClick={sendMessage}>
                Envoyer
            </Button>
        </div>
    )
}