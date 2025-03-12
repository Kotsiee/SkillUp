import { Chat } from "../../lib/types/index.ts";
import { ChatType } from "../../lib/types/types.ts";

export default function ChatCard(props: { chat: Chat, viewerID: string }) {

    return (
        <li class="chat-item">
            <a class={`chat-link`}
            href={`/messages/${props.chat.id}`} 
            f-partial={`/messages/${props.chat.id}/partials`}
            >
                <Card chat={props.chat} viewerID={props.viewerID}/>
            </a>
        </li>
    )
}

const Card = (props: {chat: Chat, viewerID: string}) => {
    const chat = props.chat
    let lastUser = null

    if (props.chat.chatType == ChatType.private_chat) {
        lastUser = props.chat.users!.find(chat => chat.user?.id !== props.viewerID)!.user
    }

    let image = props.chat.photo ? props.chat.photo.url : lastUser?.profilePicture?.url

    if (!props.chat.photo && chat.chatType == ChatType.private_group)
        image = "https://gratisography.com/wp-content/uploads/2024/10/gratisography-cool-cat-800x525.jpg"

    return(
        <div class="container">
            <div>
                <img class="chat-photo" src={image}/>
            </div>
            <div>
                <p>{chat.name ? chat.name : lastUser?.username}</p>
                <p className="lastMessage">{chat.lastMessage ? chat.lastMessage.content : 'Start the conversation...'}</p>
            </div>
        </div>
    )
}