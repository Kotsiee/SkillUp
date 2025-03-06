import { JSX } from "preact/jsx-runtime";
import { User } from "../../lib/types/index.ts";
import { useEffect, useRef, useState } from "preact/hooks";
import AIcon, { Icons } from "../../components/Icons.tsx";
import CircleCrop from "../image/imageAdjust.tsx";
import {
  Signal,
  useSignal,
} from "https://esm.sh/v135/@preact/signals@1.2.2/X-ZS8q/dist/signals.js";
import { useUser } from "../contexts/UserProvider.tsx";

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
                    <div
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
                    </div>

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

            <Modal user={user}/>
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

const Modal = ( {user} : {user : User} ) => {
  const selectedView = useSignal<string>("newphoto");
  const inputImg = useSignal<string | null>(
    "http://localhost:8000/api/image/proxy?url=https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg",
  );
  const outputImg = useSignal<string | null>(null);

  return (
    <div class="modals">
      <div class="changePhoto">
        <h2>Change Photo</h2>
        <div class="select-photo-section-container">
          <ul>
            <li>
              <input
                class="select-photo-section"
                type="radio"
                name="select-photo-section"
                id="newphoto"
                onChange={() => selectedView.value = "newphoto"}
                checked={selectedView.value === "newphoto"}
                hidden
              />
              <label for="newphoto">New Photo</label>
            </li>

            <li>
              <input
                class="select-photo-section"
                type="radio"
                name="select-photo-section"
                id="adjust"
                onChange={() => selectedView.value = "adjust"}
                checked={selectedView.value === "adjust"}
                hidden
                disabled
              />
              <label for="adjust">Adjust & Crop</label>
            </li>

            <li>
              <input
                class="select-photo-section"
                type="radio"
                name="select-photo-section"
                id="review"
                onChange={() => selectedView.value = "review"}
                checked={selectedView.value === "review"}
                hidden
              />
              <label for="review">Review</label>
            </li>
          </ul>
        </div>

        <div class="modal-content">
          <NewImg
            hidden={!(selectedView.value === "newphoto")}
            inputImg={inputImg}
          />
          <AdjustImg
            hidden={!(selectedView.value === "adjust")}
            inputImg={inputImg}
            outputImg={outputImg}
          />
          <Review
            hidden={!(selectedView.value === "review")}
            outputImg={outputImg}
          />
        </div>
      </div>
    </div>
  );
};

interface IUpload {
  hidden?: boolean;
  inputImg?: Signal<string | null>;
  outputImg?: Signal<string | null>;
}

const NewImg = ({ hidden, inputImg }: IUpload) => {
  const handleFileUpload = (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length || !inputImg?.value) return;

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      if (!e.target?.result) return;
      inputImg.value = e.target.result as string; // ✅ Update image signal
    };

    reader.readAsDataURL(file);
  };

  return (
    <div class="newphoto" hidden={hidden}>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
      />
    </div>
  );
};

const Review = ({ hidden, outputImg }: IUpload) => {
  return (
    <div class="newphoto" hidden={hidden}>
      {outputImg && outputImg.value ? <img src={outputImg.value} /> : <></>}
    </div>
  );
};

const AdjustImg = ({ hidden, inputImg, outputImg }: IUpload) => {
  const zoom = useSignal<number>(1080);
  const rotate = useSignal<number>(0);
  const ref = useRef<any>(null);

  return (
    <div class="adjust" hidden={hidden}>
      <div class="photo-area">
        <CircleCrop
          size={300}
          img={inputImg?.value}
          zoom={zoom}
          rotate={rotate}
          thisRef={ref}
        />
      </div>

      <div class="controls">
        <div class="rotate-control">
          <input
            type="range"
            min={-180}
            max={180}
            value={rotate.value}
            onInput={(val) =>
              rotate.value = Number.parseInt(val.currentTarget.value)}
          />
        </div>

        <div>
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
                if (outputImg) outputImg.value = val;
              });
          }}
        >
          click me
        </button>
      </div>
    </div>
  );
};
