import FileCard from '../../cards/FileCard.tsx';
import { processFile } from './utils/FileUtils.ts';
import AIcon, { Icons } from '../../Icons.tsx';
import { Files, User } from '../../../lib/newtypes/index.ts';
import { Signal, useSignal } from '@preact/signals';

interface UploadFileProps {
  storageFiles: Files[];
  selectedFiles: Signal<Files[]>;
  uploadedFiles: Signal<Files[]>;
  selectedView: Signal<string>;
  multiple?: boolean;
  fileType?: string;
  path: string;
  user: User;
}

export default function UploadFile({
  storageFiles,
  selectedFiles,
  uploadedFiles,
  multiple,
  fileType,
  path,
  user,
}: UploadFileProps) {
  const searchText = useSignal<string>('');

  const fileLocations = [
    { name: 'All', fileLocation: '' },
    { name: 'Storage', fileLocation: 'shared/storage' },
    { name: 'Messages', fileLocation: 'shared/messages' },
    { name: 'Posts', fileLocation: 'shared/posts' },
    { name: 'Projects', fileLocation: 'shared/projects' },
    { name: 'Drafts', fileLocation: 'drafts' },
  ];

  // Handle local file upload
  const handleFileUpload = (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    Array.from(input.files).forEach(file => {
      const reader = new FileReader();
      reader.onload = e => {
        if (e.target?.result) {
          processFile(
            file,
            e.target.result as string,
            path,
            user,
            uploadedFiles,
            selectedFiles,
            multiple
          );
        }
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div class="upload">
      <div class="upload__header">
        {/* File Upload Button */}
        <div class="upload__new-file">
          <input
            id="upload-new-file"
            type="file"
            accept={fileType}
            multiple={multiple}
            hidden
            onChange={handleFileUpload}
          />
          <label for="upload-new-file" class="upload__button" aria-label="Upload new file">
            + New File
          </label>
        </div>

        {/* Search Bar */}
        <div class="upload__search" role="search">
          <input
            type="text"
            class="upload__search-input"
            placeholder="Search your files..."
            value={searchText.value}
            aria-label="Search files"
            onInput={e => (searchText.value = e.currentTarget.value)}
          />
          {searchText.value && (
            <AIcon
              className="upload__icon upload__icon--clear"
              startPaths={Icons.X}
              aria-label="Clear search"
              onClick={() => (searchText.value = '')}
            />
          )}
          <AIcon
            className="upload__icon upload__icon--search"
            startPaths={Icons.Search}
            aria-hidden="true"
          />
        </div>
      </div>

      {/* File Location Filters */}
      <div class="upload__locations" role="group" aria-label="File Locations">
        <ul class="upload__location-list">
          {fileLocations.map(location => (
            <li key={location.name} class="upload__location-item">
              <input type="radio" id={`location-${location.name}`} name="file-location" hidden />
              <label for={`location-${location.name}`} class="upload__location-label">
                {location.name}
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* Uploaded Files */}
      {uploadedFiles.value.length > 0 && (
        <section class="upload__section">
          <h6 class="upload__section-title">Uploaded Files</h6>
          <div class="upload__files">
            {uploadedFiles.value.map(file => (
              <FileCard
                key={file.id}
                file={file}
                selected={selectedFiles.value.some(item => item.id === file.id)}
                onSelect={() => {
                  if (multiple) {
                    if (selectedFiles.value.some(item => item.id === file.id)) {
                      selectedFiles.value = selectedFiles.value.filter(item => item.id !== file.id);
                    } else {
                      selectedFiles.value = [...selectedFiles.value, file];
                    }
                  } else {
                    selectedFiles.value = [file];
                  }
                }}
                onRemove={() => {
                  uploadedFiles.value = uploadedFiles.value.filter(item => item.id !== file.id);
                  selectedFiles.value = selectedFiles.value.filter(item => item.id !== file.id);
                }}
              />
            ))}
          </div>
        </section>
      )}

      {/* Storage Files */}
      {storageFiles.length > 0 && (
        <section class="upload__section">
          <h6 class="upload__section-title">All Files</h6>
          <div class="upload__files">
            {storageFiles.map(file => (
              <FileCard
                key={file.id}
                file={file}
                selected={selectedFiles.value.some(item => item.id === file.id)}
                onSelect={() => {
                  if (multiple) {
                    if (selectedFiles.value.some(item => item.id === file.id)) {
                      selectedFiles.value = selectedFiles.value.filter(item => item.id !== file.id);
                    } else {
                      selectedFiles.value = [...selectedFiles.value, file];
                    }
                  } else {
                    selectedFiles.value = [file];
                  }
                }}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
