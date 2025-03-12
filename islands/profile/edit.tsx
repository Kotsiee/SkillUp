// deno-lint-ignore-file no-explicit-any
import { JSX } from "preact/jsx-runtime";
import { useEffect, useState } from "preact/hooks";
import AIcon, { Icons } from "../../components/Icons.tsx";
import { useUser } from "../contexts/UserProvider.tsx";
import FileUploader from "../image/UploadFile.tsx";

export default function EditProfile() {
  const { user } = useUser();

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
                    {
                      /* <div
                      class="banner-img"
                      style={{
                        backgroundImage:
                          `url(https://letsenhance.io/static/a31ab775f44858f1d1b80ee51738f4f3/11499/EnhanceAfter.jpg)`,
                      }}
                    >
                      <div class="change-image">
                        <AIcon startPaths={Icons.Filter} />
                        <p>Change Photo</p>
                      </div>
                    </div> */
                    }

                    <div
                      class="profile-img"
                      style={{
                        backgroundImage: `url(${user.profilePicture?.url})`,
                      }}
                    >
                      <div class="change-image">
                        <AIcon startPaths={Icons.Filter} />
                      </div>
                    </div>
                  </section>
                  <section id="profile-section">
                    <div>
                      <TextBox>First Name</TextBox>
                      <TextBox>Last Name</TextBox>
                    </div>

                    <TextBox>Username</TextBox>
                    <TextBox resize>Headline</TextBox>
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
              multiple
              path="profile/avatar"
              title="Profile Picture"
              user={user}
              uploadType="profile"
              fileType="image/*"
            />
            {/* <Modal multiple/> */}
          </div>
        )
        : <></>}
    </div>
  );
}

const TextBox = (
  props: JSX.HTMLAttributes<HTMLDivElement> & { resize?: boolean },
) => {
  return (
    <div ref={props.ref} class={props.class}>
      <p>{props.children}</p>
      {props.resize
        ? <textarea class="text-input" />
        : <input class="text-input" type="text" />}
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
