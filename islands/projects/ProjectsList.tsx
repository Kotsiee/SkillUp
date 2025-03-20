import { useEffect, useState } from "preact/hooks";
import { Skeleton } from "../../components/Skeletons.tsx";
import type { PageProps } from "$fresh/server.ts";
import ProjectCard from "../../components/cards/ProjectsCard.tsx";
import AIcon, { Icons } from "../../components/Icons.tsx";
import ProjectChatCard from "../../components/cards/ProjectChatCard.tsx";

export default function ChatList({pageProps, user} : {pageProps: PageProps, user: User | null}) {
  const [project, setProject] = useState<Project>();
  const [role, setRole] = useState<ProjectRole[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (pageProps.params.project)
    {
      fetch(`/api/projects/${pageProps.params.project}`)
      .then((res) => res.json())
      .then((data) => {
        setProject(data.json);
        setLoading(false);
      });

      fetch(`/api/projects/${pageProps.params.project}/chats`)
      .then((res) => res.json())
      .then((data) => {
        setChats(data.json);
        setLoading(false);
      });
    }


    else
    fetch(`/api/projects`)
      .then((res) => res.json())
      .then((data) => {
        setRole(data.json);
        setLoading(false);
    });
  }, [pageProps.params]);

  if (!user)
    return (<></>)

  return (
    <div class="chat-list-container">
      {loading
        ? (
          <Skeleton count={5}>
            <h1>hi</h1>
          </Skeleton>
        )
        :

        pageProps.params.project 
        ? (
          <div class="project-chat-list">
            <div class="head">
                <a class="back" href="/projects" f-partial="/projects/partials">Back</a>
                <AIcon className="menu" startPaths={Icons.DotMenu} size={20}/>
            </div>

            <div class="title">
                <img class="organisation-image" src={"https://media.wired.com/photos/65382632fd3d190c7a1f5c68/1:1/w_1800,h_1800,c_limit/Google-Image-Search-news-Gear-GettyImages-824179306.jpg"}/>
                <div>
                  <h4>{project?.title}</h4>
                  <p class="organisation-name">{project?.organisation?.name}</p>
                </div>
            </div>

            <div class="project-details">
            </div>

            <div class="project-chats">
              <ul>
                {chats.map((chat, _index) => {
                  return ( <ProjectChatCard pageProps={pageProps} chat={chat}/> );
                })}
              </ul>
            </div>
          </div>
        )

        : (
          <div class="projects-list">
            <div class="title">
                <h3>Projects</h3>
                <AIcon startPaths={Icons.Search} size={20}/>
            </div>
            <ul>
              {role.map((role, _index) => {
                return ( <ProjectCard project={role}/> );
              })}
            </ul>
          </div>
        )
        }
    </div>
  );
}
