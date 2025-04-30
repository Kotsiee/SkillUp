// deno-lint-ignore-file no-explicit-any
import { Signal } from '@preact/signals';
import SideNav from './EditSideNav.tsx';
import EditTeam from './forms/team.tsx';
import EditProfile from './forms/profile.tsx';
import EditProject from './forms/projects/projects.tsx';
import EditJobs from './forms/projects/job.tsx';

interface LayoutProps {
  editableRecord: Signal<Record<string, any> | null>;
  modalRef: any;
  modalSettings: Signal<any>;
  type?: string;
  sections?: string[];
}

export default function EditLayout({ editableRecord, modalRef, modalSettings, type }: LayoutProps) {
  let sections: string[] = [];
  const editContent = () => {
    if (type?.split('/')[0] === 'teams') {
      sections = ['Branding', 'Details', 'About', 'Links', 'Members', 'Settings', 'Projects'];
      return (
        <EditTeam
          editableRecord={editableRecord}
          modalRef={modalRef}
          modalSettings={modalSettings}
          type={type?.split('/')[1]}
        />
      );
    }

    if (type?.split('/')[0] === 'projects') {
      sections = ['Details', 'Jobs', 'Timeline', 'Budget'];
      return (
        <EditProject
          editableRecord={editableRecord}
          modalRef={modalRef}
          modalSettings={modalSettings}
          type={type?.split('/')[1]}
        />
      );
    }

    if (type?.split('/')[0] === 'jobs') {
      sections = ['Details', 'Tasks', 'Metrics'];
      return (
        <EditJobs
          editableRecord={editableRecord}
          modalRef={modalRef}
          modalSettings={modalSettings}
          type={type?.split('/')[1]}
        />
      );
    }

    if (type === 'profile') {
      return (
        <EditProfile
          editableRecord={editableRecord}
          modalRef={modalRef}
          modalSettings={modalSettings}
        />
      );
    }

    return null; // fallback for unmatched type
  };

  const content = editContent();

  return (
    <div class="editLayout">
      <link rel="stylesheet" href="/styles/islands/edit/edit.css" />
      <SideNav sections={sections} />
      {content}
    </div>
  );
}

// interface LayoutProps {
//   user: User;
//   editableRecord: Signal<Record<string, any> | null>;
//   modalRef: any;
//   modalSettings: Signal<any>;
// }

// export default function EditLayout({ user, editableRecord, modalRef, modalSettings }: LayoutProps) {
//   return (
//     <div>
//       <ul class="profile-nav">
//         {['view', 'edit', 'manage'].map(tab => (
//           <li>
//             <a href={`/${user.username}/${tab}`} f-partial={`/${user.username}/partial/${tab}`}>
//               {tab.charAt(0).toUpperCase() + tab.slice(1)}
//             </a>
//           </li>
//         ))}
//       </ul>

//       <div class="editLayout">
//         <SideNav />

//         <div class="content">
//           <section id="banner-section" class="banner">
//             <BannerImage modalRef={modalRef} modalSettings={modalSettings} />
//             <ProfileImage user={user} modalRef={modalRef} modalSettings={modalSettings} />
//           </section>

//           <section id="profile-section">
//             <div class="name">
//               <EditTextbox account={editableRecord} val="firstName" placeholder="First Name">
//                 First Name
//               </EditTextbox>
//               <EditTextbox account={editableRecord} val="lastName" placeholder="Last Name">
//                 Last Name
//               </EditTextbox>
//             </div>
//             <EditTextbox account={editableRecord} val="username" placeholder="Username">
//               Username
//             </EditTextbox>
//             <EditTextbox class="headline" account={editableRecord} val="hello" placeholder="Headline">
//               Headline
//             </EditTextbox>
//           </section>

//           <section id="about-section">
//             <EditTextbox resize class="about" account={editableRecord} val="bio" placeholder="About">
//               About
//             </EditTextbox>
//           </section>

//           <section id="skills-section"></section>

//           <section id="projects-section"></section>

//           <section id="experience-section"></section>
//         </div>
//       </div>
//     </div>
//   );
// }
