import Link from "next/link";

export default function ChannelTypePicker(
    { currentChannelType }
    : { currentChannelType: string }
) {

    return (
        <nav className='flex mb-2 items-center justify-center gap-6 p-2'>
            <Link
                className={currentChannelType == "open" ? 'border-b-4' : "cursor-pointer"}
                href={currentChannelType == "open" ? "" : "/chat/open"}
            >
                Open channels
            </Link>
            <Link
                className={currentChannelType == "open" ? "cursor-pointer" : 'border-b-4'}
                href={currentChannelType == "open" ? "/chat/group" : ""}
            >
                Group channels
            </Link>
        </nav>
    )
}