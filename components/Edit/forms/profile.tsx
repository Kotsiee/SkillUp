import { Signal } from '@preact/signals';
import { User } from '../../../lib/types/index.ts';
import { BannerImage, ProfileImage } from '../EditImages.tsx';
import { EditTextbox } from '../EditTools.tsx';

interface LayoutProps {
  editableRecord: Signal<Record<string, any> | null>;
  modalRef: any;
  modalSettings: Signal<any>;
}

export default function EditProfile({ editableRecord, modalRef, modalSettings }: LayoutProps) {
  return (
    <div class="content">
      <link rel="stylesheet" href="/styles/islands/edit/profile.css" />
      <section id="banner-section" class="banner">
        <BannerImage modalRef={modalRef} modalSettings={modalSettings} />
        <ProfileImage
          user={editableRecord.value as User}
          modalRef={modalRef}
          modalSettings={modalSettings}
        />
      </section>

      <section id="profile-section">
        <div class="name">
          <EditTextbox account={editableRecord} val="firstName" placeholder="First Name">
            First Name
          </EditTextbox>
          <EditTextbox account={editableRecord} val="lastName" placeholder="Last Name">
            Last Name
          </EditTextbox>
        </div>
        <EditTextbox account={editableRecord} val="username" placeholder="Username">
          Username
        </EditTextbox>
        <EditTextbox class="headline" account={editableRecord} val="hello" placeholder="Headline">
          Headline
        </EditTextbox>
      </section>

      <section id="about-section">
        <EditTextbox resize class="about" account={editableRecord} val="bio" placeholder="About">
          About
        </EditTextbox>
      </section>

      <section id="skills-section"></section>

      <section id="projects-section"></section>

      <section id="experience-section"></section>
    </div>
  );
}
