// deno-lint-ignore-file no-explicit-any
import { JSX } from "preact/jsx-runtime";
import { useEffect, useState } from "preact/hooks";
import AIcon, { Icons } from "../../components/Icons.tsx";
import { useUser } from "../contexts/UserProvider.tsx";
import FileUploader from "../upload/UploadFile.tsx";
import { useRef } from "preact/hooks";
import { useSignal } from "https://esm.sh/v135/@preact/signals@1.2.2/X-ZS8q/dist/signals.js";
import { Files, User } from "../../lib/types/index.ts";
import { Signal } from 'https://esm.sh/v135/@preact/signals@1.2.2/X-ZS8q/dist/signals.js';

export default function EditProfile() {
  const { user } = useUser();
  const modalRef = useRef<any>(null);
  const modalSettings = useSignal<any>(
    {
      title: "",
      path: "",
      uploadType: "",
      fileType: "",
      onUpload: () => {},
    },
  );

  const editableUser = useSignal<User | null>(null);

  useEffect(() => {
    if (user) {
      editableUser.value = user;
    }

    console.log(editableUser.value);
  }, [user]);

  return (
    <div>
      {user
        ? (
          <div class="bod">
            <div>
              <ul class="profile-nav">
                <li>
                  <a
                    href={`/${user.username}/view`}
                    f-partial={`/${user.username}/partial/view`}
                  >
                    View
                  </a>
                </li>
                <li>
                  <a
                    href={`/${user.username}/edit`}
                    f-partial={`/${user.username}/partial/edit`}
                  >
                    Edit
                  </a>
                </li>
                <li>
                  <a
                    href={`/${user.username}/manage`}
                    f-partial={`/${user.username}/partial/manage`}
                  >
                    Manage
                  </a>
                </li>
              </ul>

              <div class="editLayout">
                <SideNav />

                <div class="content">
                  <section id="banner-section" class="banner">
                    <div
                      class="banner-img"
                      onClick={() => {
                        modalSettings.value = {
                          ...modalSettings.value,
                          title: "Banner Photo",
                          path: "profile/banner",
                          uploadType: "banner",
                          fileType: "image/*",
                        };
                        modalRef.current.openModal();
                      }}
                    >
                      <img src="https://letsenhance.io/static/a31ab775f44858f1d1b80ee51738f4f3/11499/EnhanceAfter.jpg" />

                      <div class="change-image">
                        <AIcon startPaths={Icons.Filter} />
                        <p>Change Photo</p>
                      </div>
                    </div>

                    <div
                      class="profile-img"
                      onClick={() => {
                        modalSettings.value = {
                          ...modalSettings.value,
                          title: "Profile Photo",
                          path: "profile/avatar",
                          uploadType: "profile",
                          fileType: "image/*",
                          onUpload: async (files: Files) => {
                            await fetch("/api/account/updateKV", {
                              method: "GET",
                            });
                          },
                        };
                        modalRef.current.openModal();
                      }}
                    >
                      <img src={user.profilePicture!.large!.publicURL} />
                      <div class="change-image">
                        <AIcon startPaths={Icons.Filter} />
                      </div>
                    </div>
                  </section>
                  <section id="profile-section">
                    <div class="name">
                      <TextBox user={editableUser} val="firstName" placeholder="First Name">
                        First Name
                      </TextBox>
                      <TextBox user={editableUser} val="lastName" placeholder="Last Name">
                        Last Name
                      </TextBox>
                    </div>

                    <TextBox user={editableUser} val="username" placeholder="Username">Username</TextBox>
                    <TextBox>Headline</TextBox>
                  </section>

                  <section id="about-section">
                    <TextBox resize>About</TextBox>
                    <TextBox>Interets</TextBox>
                  </section>

                  <section id="skills-section">
                    <TextBox>Languages</TextBox>
                    <TextBox>Skills</TextBox>
                  </section>

                  <section id="projects-section">
                    <TextBox>Projects</TextBox>
                  </section>

                  <section id="experience-section">
                    <TextBox>Certifications</TextBox>
                    <TextBox>Experience</TextBox>
                    <TextBox>Education</TextBox>
                  </section>
                </div>
              </div>
            </div>

            <FileUploader
              path={modalSettings.value.path}
              title={modalSettings.value.title}
              user={user}
              uploadType={modalSettings.value.uploadType}
              fileType={modalSettings.value.fileType}
              thisRef={modalRef}
              onUpload={modalSettings.value.onUpload}
            />
          </div>
        )
        : <></>}
    </div>
  );
}

const TextBox = (
  props: JSX.HTMLAttributes<HTMLDivElement> & { resize?: boolean, val?: string, user?: Signal<User | null> },
) => {
  if (!props.user?.value)
    return null
  const user = props.user.value

  const attr = props.val as "firstName" | "lastName" | "username";
  const newAttr = user?.[attr];

  return (
    <div ref={props.ref} class={`textbox ${props.class}`}>
      <p class="tb-title">{props.children}</p>
      {props.resize
        ? <textarea class="text-input"
        placeholder={props.placeholder} value={newAttr} />
        : (
          <input
            class="text-input"
            type="text"
            placeholder={props.placeholder}
            value={newAttr}
            onInput={(newVal) => {props.user!.value = {...user, [attr]: newVal.currentTarget.value} }}
          />
        )}
    </div>
  );
};

const SideNav = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".side-nav a");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "0px", threshold: 0.1 },
    );

    sections.forEach((section) => observer.observe(section));

    return () => sections.forEach((section) => observer.unobserve(section));
  }, []);

  return (
    <div class="side-nav">
      <ul>
        {[
          "banner-section",
          "profile-section",
          "about-section",
          "skills-section",
          "projects-section",
          "experience-section",
        ].map((id) => (
          <li key={id}>
            <a
              href={`#${id}`}
              class={activeSection === id ? "active" : ""}
            >
              {id.replace("-", " ")}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

/**
 *
 * <div class="rotate-control">
                <div class="slider">
                  <input
                    type="range"
                    min={-180}
                    max={180}
                    step={1}
                    value={rotate.value}
                    onInput={(val) =>
                      rotate.value = Number.parseInt(val.currentTarget.value)}
                  />
                </div>


                <div class="number-container">
                  <div class="number">
                    <input
                      type="number"
                      min={-180}
                      max={180}
                      step={1}
                      value={rotate.value}
                      onInput={(val) =>
                        rotate.value = Number.parseInt(val.currentTarget.value)}
                    />

                    <p>°</p>
                  </div>
                </div>
              </div>

              <div class="zoom-control">
                <input
                  class="zoom"
                  type="range"
                  min={1080}
                  max={1080 * 3}
                  value={zoom.value}
                  onInput={(val) =>
                    zoom.value = Number.parseInt(val.currentTarget.value)}
                />
              </div>

              <button
                onClick={() => {
                  ref.current.generatePreview()
                    .then((val: any) => {
                      if (outputFiles) outputFiles.value = val;
                    });
                }}
              >
                click me
              </button>
 *
 */
