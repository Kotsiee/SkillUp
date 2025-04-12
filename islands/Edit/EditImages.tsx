import AIcon, { Icons } from '../../components/Icons.tsx';
import { Signal } from '@preact/signals';
import { User, Files } from '../../lib/types/index.ts';

interface BannerImageProps {
  modalRef: any;
  modalSettings: Signal<any>;
}

export function BannerImage({ modalRef, modalSettings }: BannerImageProps) {
  return (
    <div
      class="banner-img"
      onClick={() => {
        modalSettings.value = {
          ...modalSettings.value,
          title: 'Banner Photo',
          path: 'profile/banner',
          uploadType: 'banner',
          fileType: 'image/*',
        };
        modalRef.current.openModal();
      }}
    >
      <img
        src="https://letsenhance.io/static/a31ab775f44858f1d1b80ee51738f4f3/11499/EnhanceAfter.jpg"
        alt="Banner"
      />
      <div class="change-image">
        <AIcon startPaths={Icons.Filter} />
        <p>Change Photo</p>
      </div>
    </div>
  );
}

interface ProfileImageProps {
  user: User;
  modalRef: any;
  modalSettings: Signal<any>;
}

export function ProfileImage({ user, modalRef, modalSettings }: ProfileImageProps) {
  return (
    <div
      class="profile-img"
      onClick={() => {
        modalSettings.value = {
          ...modalSettings.value,
          title: 'Profile Photo',
          path: 'profile/avatar',
          uploadType: 'profile',
          fileType: 'image/*',
          onUpload: async (files: Files[]) => {
            for (const file of files) {
              const formData = new FormData();
              formData.append('file', JSON.stringify(file));

              try {
                const response = await fetch('/api/files', {
                  method: 'POST',
                  body: formData,
                });

                if (!response.ok) {
                  console.error('Upload failed:', await response.text());
                } else {
                  console.log('File uploaded successfully!');
                }
              } catch (error) {
                console.error('Error uploading file:', error);
              }
            }
          },
        };
        modalRef.current.openModal();
      }}
    >
      <img src={user.profilePicture?.large?.publicURL} alt="Profile" />
      <div class="change-image">
        <AIcon startPaths={Icons.Filter} />
      </div>
    </div>
  );
}
