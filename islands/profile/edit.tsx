import { Signal, useSignal } from '@preact/signals';
import { useUser } from '../contexts/UserProvider.tsx';
import { useProfile } from '../contexts/ProfileProvider.tsx';
import AIcon, { Icons } from '../../components/Icons.tsx';
import { useRef } from 'preact/hooks';
import FileUploader from '../../components/UI/FileUploader/FileUploader.tsx';
import { jsonTag, Files } from '../../lib/newtypes/index.ts';
import RichTextField from '../../components/UI/Fields/RichTextField.tsx';
import TextDropdownField from '../../components/UI/Fields/TextDropdownField.tsx';
import TextField from '../../components/UI/Fields/TextField.tsx';
import { testIndustries, testLanguages, testSkills } from '../../lib/testArrays.ts';

export default function EditProfile() {
  const { user } = useUser();
  const { profile } = useProfile();

  if (!profile || !user) return null;

  const account = profile.profile;

  console.log(profile);

  const name = useSignal<string>(account.name);
  const firstName = useSignal<string>(profile.account.firstName);
  const lastName = useSignal<string>(profile.account.lastName);
  const handle = useSignal<string>(account.handle);
  const headline = useSignal<string>(account.headline);
  const about = useSignal<jsonTag | undefined>(account.bio);
  const industries = useSignal<string[]>(profile.account?.meta?.industries ?? []);
  const languages = useSignal<string[]>(profile.account?.meta?.languages ?? []);
  const skills = useSignal<string[]>(profile.account?.meta?.skills ?? []);

  const banner = useSignal<Files | null>(account.banner ?? null);
  const logo = useSignal<Files | null>(account.logo?.small ?? null);

  const modalRef = useRef<any>(null);
  const modalSettings = useSignal({
    title: '',
    path: '',
    uploadType: '',
    fileType: '',
    onUpload: (files?: Files[] | undefined) => {},
  });

  const handleFileUpload = async (files?: Files[] | undefined) => {
    if (!files) return null;

    if (modalSettings.value.path === 'profile/banner') {
      banner.value = files[0];
      if (!files[0].isUpload) {
        const response = await fetch(
          `/api/files/process/tobase64?url=${encodeURIComponent(files![0].publicURL!)}`
        );
        const dataUri = await response.text();

        banner.value = {
          ...banner.value,
          publicURL: dataUri,
          isUpload: true,
        };
      }
    } else if (modalSettings.value.path === 'profile/logo') {
      logo.value = files[0];
      if (!files[0].isUpload) {
        const response = await fetch(
          `/api/files/process/tobase64?url=${encodeURIComponent(files![0].publicURL!)}`
        );
        const dataUri = await response.text();

        logo.value = {
          ...logo.value,
          publicURL: dataUri,
          isUpload: true,
        };
      }
    }
  };

  return (
    <div class="edit-profile">
      <section
        class="edit-profile__create-section edit-profile__create__branding"
        aria-labelledby="branding-section"
      >
        <div
          class="edit-profile__banner-img"
          role="button"
          tab-index="0"
          aria-label="Change banner image"
          onClick={() => {
            modalSettings.value = {
              ...modalSettings.value,
              title: 'Banner Photo',
              path: 'profile/banner',
              fileType: 'image/*',
              onUpload: handleFileUpload,
            };
            modalRef.current.openModal();
          }}
        >
          <img
            src={banner.value ? banner.value.publicURL : '/assets/images/placeholders/Banner.webp'}
            alt="Banner image"
          />
          <div class="edit-profile__change-image">
            <AIcon startPaths={Icons.Filter} />
            <p>Change Photo</p>
          </div>
        </div>

        <div
          class="edit-profile__logo-img"
          role="button"
          tab-index="0"
          aria-label="Change logo image"
          onClick={() => {
            modalSettings.value = {
              ...modalSettings.value,
              title: 'logo Photo',
              path: 'profile/logo',
              fileType: 'image/*',
              onUpload: handleFileUpload,
            };
            modalRef.current.openModal();
          }}
          style={{
            borderRadius: profile.type === 'user' ? '50%' : '35px',
          }}
        >
          <img
            src={logo.value ? logo.value.publicURL : '/assets/images/placeholders/teams_med.webp'}
            alt="Profile logo"
          />
          <div class="edit-profile__change-image">
            <AIcon startPaths={Icons.Filter} />
          </div>
        </div>
      </section>

      {profile.type === 'user' ? (
        <EditUser
          firstName={firstName}
          lastName={lastName}
          handle={handle}
          headline={headline}
          about={about}
          languages={languages}
          skills={skills}
        />
      ) : (
        <EditTeam
          name={name}
          handle={handle}
          headline={headline}
          about={about}
          industries={industries}
        />
      )}

      <div class="edit-profile__save">
        <button>Save</button>
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
  );
}

interface IEditUser {
  firstName: Signal<string>;
  lastName: Signal<string>;
  handle: Signal<string>;
  headline: Signal<string>;
  about: Signal<jsonTag | undefined>;
  languages: Signal<string[]>;
  skills: Signal<string[]>;
}

function EditUser({ firstName, lastName, handle, headline, about, languages, skills }: IEditUser) {
  return (
    <>
      {/* Profile Info */}
      <section
        class="edit-profile__create-section edit-profile__create__profile"
        aria-labelledby="profile-section"
      >
        <h2 id="profile-section" class="visually-hidden">
          Profile Information
        </h2>
        <div class="edit-profile__create__profile-name">
          <TextField val={firstName} placeholder="First Name">
            First Name
          </TextField>
          <TextField val={lastName} placeholder="Last Name">
            Last Name
          </TextField>
        </div>

        <TextField val={handle} placeholder="@username">
          Username
        </TextField>
        <TextField val={headline} placeholder="Headline">
          Headline
        </TextField>
      </section>

      {/* About + Industries */}
      <section
        class="edit-profile__create-section edit-profile__create__about"
        aria-labelledby="about-section"
      >
        <h2 id="about-section" class="visually-hidden">
          About
        </h2>
        <RichTextField val={about}>About</RichTextField>
        <div class="edit-profile__create__about-skills">
          <TextDropdownField val={languages} placeholder="Languages" items={testLanguages}>
            Languages
          </TextDropdownField>
          <TextDropdownField val={skills} placeholder="Skills" items={testSkills}>
            Skills
          </TextDropdownField>
        </div>
      </section>
    </>
  );
}

interface IEditTeams {
  name: Signal<string>;
  handle: Signal<string>;
  headline: Signal<string>;
  about: Signal<jsonTag | undefined>;
  industries: Signal<string[]>;
}

function EditTeam({ name, handle, headline, about, industries }: IEditTeams) {
  return (
    <>
      {/* Profile Info */}
      <section
        class="edit-profile__create-section edit-profile__create__profile"
        aria-labelledby="profile-section"
      >
        <h2 id="profile-section" class="visually-hidden">
          Team Profile Information
        </h2>
        <TextField val={name} placeholder="Team Name">
          Name
        </TextField>
        <TextField val={handle} placeholder="@teamname">
          Handle
        </TextField>
        <TextField val={headline} placeholder="Headline">
          Headline
        </TextField>
      </section>

      {/* About + Industries */}
      <section
        class="edit-profile__create-section edit-profile__create__about"
        aria-labelledby="about-section"
      >
        <h2 id="about-section" class="visually-hidden">
          Team About and Industry
        </h2>
        <RichTextField val={about}>About</RichTextField>
        <TextDropdownField val={industries} placeholder="Industries" items={testIndustries}>
          Industries
        </TextDropdownField>
      </section>
    </>
  );
}
