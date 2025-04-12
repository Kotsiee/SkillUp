import { PageProps } from "$fresh/server.ts";
import { Chat } from "../../lib/types/index.ts";

export default function ProjectChatCard({ pageProps, chat }: { pageProps: PageProps, chat: Chat }) {
    return (
        <li class="chat-item">
            <a class={`chat-link`}
            href={`/projects/${pageProps.params.project}/${chat?.id}/chat`} 
            f-partial={`/projects/${pageProps.params.project}/${chat?.id}/partials/chat`}
            >
                {/* <img class="chat-icon" src="https://media.wired.com/photos/59264bd7af95806129f4ef92/master/w_2560%2Cc_limit/hashtag.jpg"/> */}
                <h5 class="chat-icon">#</h5>
                <p class="chat-name">{chat?.task?.title}</p>
            </a>
        </li>
    )
}