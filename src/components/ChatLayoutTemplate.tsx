type ReactElementList = React.ReactNode;//|React.ReactNode[];

export default function ChatLayoutTemplate({
    channelTypePicker,
    channelList,
    children
}: Readonly<{
    channelTypePicker: ReactElementList,
    channelList: ReactElementList,
    children: ReactElementList,
}>)
 {
    return (
        <main className='max-h-dvh h-dvh flex flex-col divide-y-2'>
            {channelTypePicker}
            <div className='flex flex-col h-full p-4 items-center'>
                {channelList}
                <section className='channel-wrapper'>
                    {children}
                </section>
            </div>
        </main>
    )
}