import { Signal } from '@preact/signals';
import { EditTextbox } from '../EditTools.tsx';

interface LayoutProps {
  editableRecord: Signal<Record<string, any> | null>;
  modalRef: any;
  modalSettings: Signal<any>;
  type: string;
}

export default function EditTeam({ editableRecord, modalRef, modalSettings, type }: LayoutProps) {
  return (
    <div class="content">
      <link rel="stylesheet" href="/styles/islands/edit/teams.css" />
      <h1>New Team</h1>
      <section id="Branding" class="banner"></section>

      <section id="Details">
        <EditTextbox account={editableRecord} val="name" placeholder="Team Name">
          Team Name
        </EditTextbox>
        <EditTextbox account={editableRecord} val="handle" placeholder="Handle">
          Handle
        </EditTextbox>

        <EditTextbox
          resize
          class="headline"
          account={editableRecord}
          val="headline"
          placeholder="Headline"
        >
          Headline
        </EditTextbox>
      </section>

      <section id="About">
        <EditTextbox
          resize
          class="description"
          account={editableRecord}
          val="description"
          placeholder="Description"
        >
          Description
        </EditTextbox>

        {/**Dropdown CSV for Industry */}
        {/**Dropdown CSV for Location */}
      </section>

      <section id="Links">{/**Add Links */}</section>

      {/**When profile created this wont show up, this will be in manage */}
      <section id="Members">{/**Add Links */}</section>

      <section id="Settings">{/**Add Links */}</section>

      {/**After profile created... On edit mode */}
      <section id="Projects"></section>
    </div>
  );
}
