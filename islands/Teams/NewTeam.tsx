// deno-lint-ignore-file no-explicit-any
import { useRef } from 'preact/hooks';
import { useSignal } from '@preact/signals';
import { useUser } from '../contexts/UserProvider.tsx';
import FileUploader from '../../components/UI/FileUploader/FileUploader.tsx';
import TextField from '../../components/UI/Fields/TextField.tsx';
import { Files, jsonTag, Team } from '../../lib/newtypes/index.ts';
import RichTextField from '../../components/UI/Fields/RichTextField.tsx';
import TextDropdownField from '../../components/UI/Fields/TextDropdownField.tsx';
import AIcon, { Icons } from '../../components/Icons.tsx';
import resizeImageBase64 from '../../lib/utils/resizeImage.ts';
import { testIndustries } from '../../lib/testArrays.ts';

export default function EditProfile() {
  const { user } = useUser();
  if (!user) return null;

  const name = useSignal<string>('');
  const handle = useSignal<string>('');
  const headline = useSignal<string>('');
  const about = useSignal<jsonTag | undefined>(undefined);
  const industries = useSignal<string[]>([]);

  const banner = useSignal<Files | null>(null);
  const logo = useSignal<Files | null>(null);

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

  async function createNewTeam() {
    const newTeamId = crypto.randomUUID();

    const resizedLogos = logo.value
      ? {
          small: {
            ...logo.value,
            recipient: newTeamId,
            publicURL: await resizeImageBase64(logo.value.publicURL!, 128, 128),
            publicName: `${name.value}: Logo - Small`,
            storedName: 'logo_small.webp',
            filePath: 'profile/logo',
            user: user!.id,
            isUpload: true,
          },
          med: {
            ...logo.value,
            recipient: newTeamId,
            publicURL: await resizeImageBase64(logo.value.publicURL!, 512, 512),
            publicName: `${name.value}: Logo - Medium`,
            storedName: 'logo_med.webp',
            filePath: 'profile/logo',
            user: user!.id,
            isUpload: true,
          },
          large: {
            ...logo.value,
            recipient: newTeamId,
            publicURL: await resizeImageBase64(logo.value.publicURL!, 1080, 1080),
            publicName: `${name.value}: Logo - Large`,
            storedName: 'logo_large.webp',
            filePath: 'profile/logo',
            user: user!.id,
            isUpload: true,
          },
        }
      : undefined;

    const resizedBanner = banner.value
      ? {
          ...banner.value,
          recipient: newTeamId,
          publicURL: await resizeImageBase64(banner.value.publicURL!, 2560, 1440),
          publicName: `${name.value}: Banner`,
          storedName: 'banner.webp',
          filePath: 'profile/banner',
          user: user!.id,
          isUpload: true,
        }
      : undefined;

    const newTeam: Omit<Team, 'createdAt'> = {
      id: newTeamId,
      name: name.value,
      handle: handle.value,
      headline: headline.value,
      description: JSON.stringify(about.value),
      logo: resizedLogos,
      banner: resizedBanner,
    };

    await fetch('/api/teams/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTeam), // ONLY send the team object, no user info
    });
  }

  return (
    <div class="new-team" role="main" aria-label="Create a new team">
      <div class="new-team__header" role="navigation" aria-label="Team creation header">
        <div class="new-team__back">
          <a
            class="new-team__back-link"
            href="/teams"
            f-partial="/teams/partials"
            aria-label="Go back to Teams"
          >
            <AIcon startPaths={Icons.LeftChevron} size={16} /> Back
          </a>
        </div>
        <div class="new-team__submit">
          <button
            class="new-team__submit-button"
            onClick={() => createNewTeam()}
            aria-label="Create new team"
          >
            + Create Team
          </button>
        </div>
      </div>

      <div class="new-team__create">
        {/* Branding Section */}
        <section
          class="new-team__create-section new-team__create__branding"
          aria-labelledby="branding-section"
        >
          <h2 id="branding-section" class="visually-hidden">
            Team Branding
          </h2>

          <div
            class="new-team__banner-img"
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
              src={
                banner.value ? banner.value.publicURL : '/assets/images/placeholders/Banner.webp'
              }
              alt="Team banner image"
            />
            <div class="new-team__change-image">
              <AIcon startPaths={Icons.Filter} />
              <p>Change Photo</p>
            </div>
          </div>

          <div
            class="new-team__logo-img"
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
          >
            <img
              src={logo.value ? logo.value.publicURL : '/assets/images/placeholders/teams_med.webp'}
              alt="Team profile logo"
            />
            <div class="new-team__change-image">
              <AIcon startPaths={Icons.Filter} />
            </div>
          </div>
        </section>

        {/* Profile Info */}
        <section
          class="new-team__create-section new-team__create__profile"
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
          class="new-team__create-section new-team__create__about"
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
