import { PageProps } from "$fresh/server.ts";
import AIcon, { Icons } from "../../components/Icons.tsx";
import { useUser } from "../../islands/contexts/UserProvider.tsx";
import ChatResize from "../../islands/chat/ChatResize.tsx";
import ChatList from "../../islands/chat/ChatsList.tsx";

export default function Layout(pageProps: PageProps) {
    return (
        <div class="messages-layout" f-client-nav>
            <link rel="stylesheet" href="/styles/pages/messages/messages.css" />
            <div class="chat-list">
                <div class="chat-container">
                    <div class="title">
                        <h3>Messages</h3>
                        <AIcon startPaths={Icons.Search} size={20}/>
                    </div>

                    <div class="options">
                        <ul>
                            <li>
                                <input type="radio" name="filter-convoList" id="filter-convoList-all" value="all" checked hidden/>
                                <label for="filter-convoList-all">All</label>
                            </li>
                            <li>
                                <input type="radio" name="filter-convoList" id="filter-convoList-pinned" value="pinned" hidden/>
                                <label for="filter-convoList-pinned">Pinned</label>
                            </li>
                            <li>
                                <input type="radio" name="filter-convoList" id="filter-convoList-groups" value="groups" hidden/>
                                <label for="filter-convoList-groups">Groups</label>
                            </li>
                            <li>
                                <input type="radio" name="filter-convoList" id="filter-convoList-unread" value="unread" hidden/>
                                <label for="filter-convoList-unread">Unread</label>
                            </li>
                        </ul>
                    </div>

                    <ChatList pageProps={pageProps}/>
                </div>
            </div>

            <div class="resize-container">
                <ChatResize />
            </div>
            <div class="chatarea">
                <pageProps.Component />
            </div>
        </div>
  );
}