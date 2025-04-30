// deno-lint-ignore-file no-dupe-keys
// lib/extensionCategories.ts

export type ExtensionMap = {
  [extension: string]: {
    category: string;
    application?: string;
    validMimeTypes?: string[];
  };
};

export const extensionCategories: ExtensionMap = {
  // 📄 DOCUMENT FILES (Word Processing, Text, Scanned Docs, Legal, and Publishing)
  doc: {
    category: 'Document',
    application: 'Microsoft Word',
    validMimeTypes: ['application/msword'],
  },
  docx: {
    category: 'Document',
    application: 'Microsoft Word',
    validMimeTypes: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  },
  dot: {
    category: 'Document',
    application: 'Microsoft Word Template',
    validMimeTypes: ['application/msword'],
  },
  dotx: {
    category: 'Document',
    application: 'Microsoft Word Template',
    validMimeTypes: ['application/vnd.openxmlformats-officedocument.wordprocessingml.template'],
  },
  pdf: { category: 'Document', application: 'Adobe Acrobat', validMimeTypes: ['application/pdf'] },
  txt: { category: 'Document', application: 'Plain Text', validMimeTypes: ['text/plain'] },
  rtf: {
    category: 'Document',
    application: 'Rich Text Format',
    validMimeTypes: ['application/rtf'],
  },
  odt: {
    category: 'Document',
    application: 'OpenDocument Text',
    validMimeTypes: ['application/vnd.oasis.opendocument.text'],
  },
  fodt: {
    category: 'Document',
    application: 'Flat OpenDocument Text',
    validMimeTypes: ['application/vnd.oasis.opendocument.text-flat-xml'],
  },
  wpd: {
    category: 'Document',
    application: 'WordPerfect Document',
    validMimeTypes: ['application/wordperfect'],
  },
  wps: {
    category: 'Document',
    application: 'Microsoft Works Document',
    validMimeTypes: ['application/vnd.ms-works'],
  },
  abw: { category: 'Document', application: 'AbiWord Document' },

  // 📰 STRUCTURED TEXT / MARKDOWN
  md: { category: 'Document', application: 'Markdown', validMimeTypes: ['text/markdown'] },
  rst: { category: 'Document', application: 'reStructuredText', validMimeTypes: ['text/x-rst'] },
  adoc: { category: 'Document', application: 'AsciiDoc' },
  tex: { category: 'Document', application: 'LaTeX Document' },
  ltx: { category: 'Document', application: 'LaTeX Source File' },
  bib: { category: 'Document', application: 'BibTeX Bibliography File' },

  // 📖 EBOOK FORMATS
  epub: {
    category: 'Document',
    application: 'EPUB eBook',
    validMimeTypes: ['application/epub+zip'],
  },
  mobi: { category: 'Document', application: 'Mobipocket eBook' },
  azw: { category: 'Document', application: 'Amazon Kindle eBook' },
  azw3: { category: 'Document', application: 'Amazon Kindle eBook' },
  fb2: { category: 'Document', application: 'FictionBook eBook' },

  // 🏛️ LEGAL & GOVERNMENT DOCUMENTS
  gov: { category: 'Document', application: 'Government Document' },
  legx: { category: 'Document', application: 'Legal XML Format' },
  xfdl: { category: 'Document', application: 'Extensible Forms Description Language' },

  // 📰 SCANNED & MULTI-PAGE DOCUMENTS
  djvu: {
    category: 'Document',
    application: 'DjVu Scanned Document',
    validMimeTypes: ['image/vnd.djvu'],
  },
  xps: {
    category: 'Document',
    application: 'Microsoft XPS Document',
    validMimeTypes: ['application/vnd.ms-xpsdocument'],
  },
  oxps: {
    category: 'Document',
    application: 'OpenXPS Document',
    validMimeTypes: ['application/oxps'],
  },

  // ✍️ HANDWRITTEN & NOTES FILES
  one: {
    category: 'Document',
    application: 'Microsoft OneNote',
    validMimeTypes: ['application/msonenote'],
  },
  note: { category: 'Document', application: 'Evernote Note File' },
  jnt: { category: 'Document', application: 'Windows Journal Note' },

  // 🏢 BUSINESS & COLLABORATION DOCUMENTS
  gdoc: { category: 'Document', application: 'Google Docs File' },
  pages: { category: 'Document', application: 'Apple Pages Document' },
  key: { category: 'Presentation', application: 'Apple Keynote Presentation' },

  // 🏗️ DESKTOP PUBLISHING FORMATS
  indd: { category: 'Document', application: 'Adobe InDesign Document' },
  indt: { category: 'Document', application: 'Adobe InDesign Template' },
  pmd: { category: 'Document', application: 'Adobe PageMaker Document' },
  pub: { category: 'Document', application: 'Microsoft Publisher Document' },
  sla: { category: 'Document', application: 'Scribus Document' },
  mml: { category: 'Document', application: 'Mathematical Markup Language' },

  // 🖼️ RICH GRAPHICAL DOCUMENT FORMATS
  fodp: { category: 'Document', application: 'Flat OpenDocument Presentation' },
  odg: { category: 'Document', application: 'OpenDocument Graphics' },
  fodg: { category: 'Document', application: 'Flat OpenDocument Graphics' },

  // 📑 DOCUMENT TEMPLATES & FORMATTED DOCUMENTS
  ott: { category: 'Document', application: 'OpenDocument Text Template' },
  dotm: { category: 'Document', application: 'Microsoft Word Macro-Enabled Template' },

  // 🔖 BOOKMARKS & REFERENCE FILES
  url: { category: 'Document', application: 'Internet Shortcut' },
  webloc: { category: 'Document', application: 'Mac Web Shortcut' },
  desktop: { category: 'Document', application: 'Linux Desktop Shortcut' },

  // 🛠️ OTHER FORMATTED TEXT FILES
  nfo: { category: 'Document', application: 'Information File' },
  readme: { category: 'Document', application: 'ReadMe File' },

  // 🏆 LEGACY DOCUMENT FORMATS
  ami: { category: 'Document', application: 'Amiga AmigaGuide' },
  wp: { category: 'Document', application: 'WordPerfect' },
  '602': { category: 'Document', application: 'T602 Text Document' },
  p7s: { category: 'Document', application: 'Secure Signed Email File' },

  /*--------------------------------------------------------------------------------------------------------*/

  // 📊 SPREADSHEET FILES (Excel, OpenDocument, CSV, Data Tables)
  xls: {
    category: 'Spreadsheet',
    application: 'Microsoft Excel',
    validMimeTypes: ['application/vnd.ms-excel'],
  },
  xlsx: {
    category: 'Spreadsheet',
    application: 'Microsoft Excel',
    validMimeTypes: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
  },
  xlsm: {
    category: 'Spreadsheet',
    application: 'Microsoft Excel Macro-Enabled',
    validMimeTypes: ['application/vnd.ms-excel.sheet.macroEnabled.12'],
  },
  xlsb: {
    category: 'Spreadsheet',
    application: 'Microsoft Excel Binary Workbook',
    validMimeTypes: ['application/vnd.ms-excel.sheet.binary.macroEnabled.12'],
  },
  xlt: {
    category: 'Spreadsheet',
    application: 'Microsoft Excel Template',
    validMimeTypes: ['application/vnd.ms-excel'],
  },
  xltx: {
    category: 'Spreadsheet',
    application: 'Microsoft Excel Template',
    validMimeTypes: ['application/vnd.openxmlformats-officedocument.spreadsheetml.template'],
  },

  // 🌍 OPEN DOCUMENT & FREE ALTERNATIVES
  ods: {
    category: 'Spreadsheet',
    application: 'OpenDocument Spreadsheet',
    validMimeTypes: ['application/vnd.oasis.opendocument.spreadsheet'],
  },
  ots: {
    category: 'Spreadsheet',
    application: 'OpenDocument Spreadsheet Template',
    validMimeTypes: ['application/vnd.oasis.opendocument.spreadsheet-template'],
  },
  fods: {
    category: 'Spreadsheet',
    application: 'Flat OpenDocument Spreadsheet',
    validMimeTypes: ['application/vnd.oasis.opendocument.spreadsheet-flat-xml'],
  },

  // 📋 SIMPLE TABLE FORMATS
  dif: {
    category: 'Spreadsheet',
    application: 'Data Interchange Format',
    validMimeTypes: ['application/x-dif'],
  },
  slk: {
    category: 'Spreadsheet',
    application: 'Symbolic Link Format',
    validMimeTypes: ['application/vnd.ms-excel'],
  },

  // 📈 FINANCIAL & ACCOUNTING SHEETS
  qbw: { category: 'Spreadsheet', application: 'QuickBooks Company File' },
  qbb: { category: 'Spreadsheet', application: 'QuickBooks Backup File' },
  qbm: { category: 'Spreadsheet', application: 'QuickBooks Portable File' },
  gnumeric: { category: 'Spreadsheet', application: 'Gnumeric Spreadsheet' },

  // 📑 GOOGLE & APPLE SPREADSHEETS
  numbers: { category: 'Spreadsheet', application: 'Apple Numbers Spreadsheet' },
  gsheet: { category: 'Spreadsheet', application: 'Google Sheets File' },

  // 📄 EXCEL COMPATIBLE EXPORT FORMATS
  et: { category: 'Spreadsheet', application: 'WPS Office Excel File' },
  wks: { category: 'Spreadsheet', application: 'Lotus 1-2-3 Worksheet' },
  '123': { category: 'Spreadsheet', application: 'Lotus 1-2-3 Spreadsheet' },

  // 📜 SCIENTIFIC & STATISTICAL DATA FILES
  sas7bdat: { category: 'Spreadsheet', application: 'SAS Dataset' },

  // 🔄 EXPORT FORMATS FOR DATABASE SYSTEMS
  wk1: { category: 'Spreadsheet', application: 'Lotus Worksheet' },
  wk3: { category: 'Spreadsheet', application: 'Lotus 1-2-3 Worksheet' },
  wk4: { category: 'Spreadsheet', application: 'Lotus 1-2-3 Worksheet' },

  // 🏆 LEGACY & OBSOLETE SPREADSHEET FORMATS
  wq1: { category: 'Spreadsheet', application: 'Quattro Pro Spreadsheet' },
  wq2: { category: 'Spreadsheet', application: 'Quattro Pro Spreadsheet' },
  qpw: { category: 'Spreadsheet', application: 'Quattro Pro Workbook' },
  vc: { category: 'Spreadsheet', application: 'VisiCalc Spreadsheet' },
  vcs: { category: 'Spreadsheet', application: 'VisiCalc Spreadsheet' },

  /*--------------------------------------------------------------------------------------------------------*/

  // 🎵 AUDIO FILES (Lossy, Lossless, Uncompressed, Streaming, and Specialized)
  mp3: { category: 'Audio', application: 'MPEG Audio Layer III', validMimeTypes: ['audio/mpeg'] },
  ogg: { category: 'Audio', application: 'OGG Vorbis Audio', validMimeTypes: ['audio/ogg'] },
  oga: { category: 'Audio', application: 'OGG Audio', validMimeTypes: ['audio/ogg'] },
  opus: { category: 'Audio', application: 'Opus Audio', validMimeTypes: ['audio/opus'] },
  aac: {
    category: 'Audio',
    application: 'Advanced Audio Codec (AAC)',
    validMimeTypes: ['audio/aac'],
  },
  m4a: { category: 'Audio', application: 'MPEG-4 Audio', validMimeTypes: ['audio/mp4'] },
  m4b: { category: 'Audio', application: 'MPEG-4 Audiobook', validMimeTypes: ['audio/mp4'] },
  m4p: { category: 'Audio', application: 'MPEG-4 Protected Audio', validMimeTypes: ['audio/mp4'] },
  wav: {
    category: 'Audio',
    application: 'Waveform Audio Format',
    validMimeTypes: ['audio/wav', 'audio/x-wav'],
  },
  flac: {
    category: 'Audio',
    application: 'Free Lossless Audio Codec',
    validMimeTypes: ['audio/flac'],
  },
  alac: { category: 'Audio', application: 'Apple Lossless Audio Codec' },
  wma: {
    category: 'Audio',
    application: 'Windows Media Audio',
    validMimeTypes: ['audio/x-ms-wma'],
  },
  amr: {
    category: 'Audio',
    application: 'Adaptive Multi-Rate Audio',
    validMimeTypes: ['audio/amr'],
  },
  awb: { category: 'Audio', application: 'Adaptive Multi-Rate Wideband Audio' },

  // 🎧 HIGH-QUALITY & LOSSLESS AUDIO FORMATS
  ape: { category: 'Audio', application: "Monkey's Audio" },
  wv: { category: 'Audio', application: 'WavPack Audio' },
  tta: { category: 'Audio', application: 'True Audio' },
  dsf: { category: 'Audio', application: 'DSD Stream File' },
  dff: { category: 'Audio', application: 'DSD Interchange File' },

  // 🎼 MUSIC PRODUCTION & INSTRUMENT FILES
  mid: { category: 'Audio', application: 'MIDI Sequence', validMimeTypes: ['audio/midi'] },
  midi: { category: 'Audio', application: 'MIDI Sequence', validMimeTypes: ['audio/midi'] },
  kar: { category: 'Audio', application: 'Karaoke MIDI' },
  sf2: { category: 'Audio', application: 'SoundFont 2' },
  sfz: { category: 'Audio', application: 'SFZ Instrument File' },

  // 🎛️ AUDIO PRODUCTION & DAW PROJECT FILES
  flp: { category: 'Audio', application: 'FL Studio Project File' },
  als: { category: 'Audio', application: 'Ableton Live Set' },
  alc: { category: 'Audio', application: 'Ableton Live Clip' },
  cpr: { category: 'Audio', application: 'Cubase Project File' },
  npr: { category: 'Audio', application: 'Nuendo Project File' },
  sesx: { category: 'Audio', application: 'Adobe Audition Session File' },
  omf: { category: 'Audio', application: 'Open Media Framework File' },
  ptx: { category: 'Audio', application: 'Pro Tools Session' },
  ptf: { category: 'Audio', application: 'Pro Tools 7-9 Session' },

  // 🎙️ VOICE RECORDING & AUDIO TRANSCRIPTION
  dss: { category: 'Audio', application: 'Digital Speech Standard' },
  ds2: { category: 'Audio', application: 'Digital Speech Standard 2' },
  vox: { category: 'Audio', application: 'Dialogic ADPCM Audio' },
  ra: { category: 'Audio', application: 'RealAudio' },

  // 📡 BROADCAST & STREAMING AUDIO FORMATS
  m3u: { category: 'Audio', application: 'MP3 Playlist File', validMimeTypes: ['audio/x-mpegurl'] },
  m3u8: {
    category: 'Audio',
    application: 'M3U Extended Playlist',
    validMimeTypes: ['application/vnd.apple.mpegurl', 'audio/m3u8'],
  },
  pls: { category: 'Audio', application: 'Playlist File' },
  asx: { category: 'Audio', application: 'Advanced Stream Redirector' },
  xspf: { category: 'Audio', application: 'XML Shareable Playlist Format' },

  // 🔊 AMBIENT & SOUND EFFECTS FILES
  bwf: { category: 'Audio', application: 'Broadcast Wave Format' },
  aiff: {
    category: 'Audio',
    application: 'Audio Interchange File Format',
    validMimeTypes: ['audio/aiff'],
  },
  aif: {
    category: 'Audio',
    application: 'Audio Interchange File Format',
    validMimeTypes: ['audio/x-aiff'],
  },
  aifc: { category: 'Audio', application: 'Compressed AIFF Audio' },
  caf: { category: 'Audio', application: 'Apple Core Audio Format' },

  // 🔄 COMPRESSED & LOW-BITRATE FORMATS
  mp2: { category: 'Audio', application: 'MPEG Audio Layer II' },
  spx: { category: 'Audio', application: 'Speex Audio Format' },
  au: { category: 'Audio', application: 'Sun Microsystems Audio' },
  snd: { category: 'Audio', application: 'Sound File Format' },

  // 🕹️ GAME AUDIO FORMATS
  vgm: { category: 'Audio', application: 'Video Game Music File' },
  spc: { category: 'Audio', application: 'SNES Sound File' },
  gbs: { category: 'Audio', application: 'Game Boy Sound File' },
  '2sf': { category: 'Audio', application: 'Nintendo DS Sound File' },
  ssf: { category: 'Audio', application: 'Sega Saturn Sound File' },
  usf: { category: 'Audio', application: 'Nintendo 64 Sound Format' },

  // 📼 LEGACY & OBSOLETE AUDIO FORMATS
  cda: { category: 'Audio', application: 'CD Audio Track' },
  voc: { category: 'Audio', application: 'Creative Voice File' },
  sid: { category: 'Audio', application: 'Commodore 64 SID Music' },
  mod: { category: 'Audio', application: 'Tracker Module Format' },
  xm: { category: 'Audio', application: 'FastTracker 2 Extended Module' },
  it: { category: 'Audio', application: 'Impulse Tracker Module' },
  s3m: { category: 'Audio', application: 'Scream Tracker Module' },

  /*--------------------------------------------------------------------------------------------------------*/

  // 🎥 VIDEO FILES
  mp4: { category: 'Video', application: 'MPEG-4 Video', validMimeTypes: ['video/mp4'] },
  m4v: { category: 'Video', application: 'MPEG-4 Video', validMimeTypes: ['video/x-m4v'] },
  mov: { category: 'Video', application: 'QuickTime Video', validMimeTypes: ['video/quicktime'] },
  avi: { category: 'Video', application: 'AVI Video', validMimeTypes: ['video/x-msvideo'] },
  wmv: {
    category: 'Video',
    application: 'Windows Media Video',
    validMimeTypes: ['video/x-ms-wmv'],
  },
  asf: {
    category: 'Video',
    application: 'Advanced Systems Format',
    validMimeTypes: ['video/x-ms-asf'],
  },
  mkv: { category: 'Video', application: 'Matroska Video', validMimeTypes: ['video/x-matroska'] },
  webm: { category: 'Video', application: 'WebM Video', validMimeTypes: ['video/webm'] },
  flv: { category: 'Video', application: 'Flash Video', validMimeTypes: ['video/x-flv'] },
  f4v: { category: 'Video', application: 'Adobe Flash MP4', validMimeTypes: ['video/x-f4v'] },
  '3gp': { category: 'Video', application: '3GPP Video', validMimeTypes: ['video/3gpp'] },
  '3g2': { category: 'Video', application: '3GPP2 Video', validMimeTypes: ['video/3gpp2'] },
  ogv: { category: 'Video', application: 'OGG Video', validMimeTypes: ['video/ogg'] },

  // 📺 BROADCASTING & STREAMING FORMATS
  // "ts": { category: "Video", application: "Transport Stream", validMimeTypes: ["video/mp2t"] },
  mts: { category: 'Video', application: 'MPEG Transport Stream' },
  m2ts: { category: 'Video', application: 'Blu-ray MPEG-2 Transport Stream' },
  vob: { category: 'Video', application: 'DVD Video Object', validMimeTypes: ['video/dvd'] },
  ifo: { category: 'Video', application: 'DVD Information File' },
  bup: { category: 'Video', application: 'DVD Backup File' },
  mxf: { category: 'Video', application: 'Material Exchange Format' },
  gxf: { category: 'Video', application: 'General eXchange Format' },

  // 🎞️ LEGACY / ANALOG VIDEO FORMATS
  rm: {
    category: 'Video',
    application: 'RealMedia Video',
    validMimeTypes: ['application/vnd.rn-realmedia'],
  },
  rmvb: { category: 'Video', application: 'RealMedia Variable Bitrate' },
  divx: { category: 'Video', application: 'DivX Video Format' },
  xvid: { category: 'Video', application: 'XviD Encoded Video' },
  'dvr-ms': { category: 'Video', application: 'Windows Media Center Recorded TV Show' },
  amv: { category: 'Video', application: 'Anime Music Video Format' },

  // 🎥 HIGH-QUALITY / LOSSLESS VIDEO FORMATS
  yuv: { category: 'Video', application: 'YUV Encoded Video' },
  vp8: { category: 'Video', application: 'VP8 Encoded Video' },
  vp9: { category: 'Video', application: 'VP9 Encoded Video' },
  hevc: { category: 'Video', application: 'High Efficiency Video Codec (H.265)' },
  h264: { category: 'Video', application: 'Advanced Video Codec (H.264)' },
  h265: { category: 'Video', application: 'High Efficiency Video Codec (H.265)' },
  av1: { category: 'Video', application: 'AOMedia Video 1 (AV1)' },
  prores: { category: 'Video', application: 'Apple ProRes' },
  cineform: { category: 'Video', application: 'GoPro CineForm Codec' },
  dnxhd: { category: 'Video', application: 'Avid DNxHD Codec' },
  braw: { category: 'Video', application: 'Blackmagic RAW Video' },

  // 🔬 SCIENTIFIC & SPECIALIZED VIDEO FORMATS
  ser: { category: 'Video', application: 'SER Astronomy Video Format' },
  mjpg: { category: 'Video', application: 'Motion JPEG Video' },
  mj2: { category: 'Video', application: 'Motion JPEG 2000' },

  // 🏗️ 3D / VIRTUAL REALITY VIDEO FORMATS
  ivf: { category: 'Video', application: 'Indeo Video Format' },
  ivr: { category: 'Video', application: 'Internet Video Recording' },
  vrvideo: { category: 'Video', application: 'Virtual Reality Video' },

  // 📼 UNCOMPRESSED / FRAME SEQUENCE VIDEO FORMATS
  tiffseq: { category: 'Video', application: 'TIFF Image Sequence' },
  dpx: { category: 'Video', application: 'Digital Picture Exchange (DPX)' },
  cin: { category: 'Video', application: 'Cineon Image File' },

  // 🏆 LEGACY & OBSOLETE FORMATS
  fli: { category: 'Video', application: 'Autodesk FLI Animation' },
  flc: { category: 'Video', application: 'Autodesk FLC Animation' },
  mve: { category: 'Video', application: 'Interplay MVE Video' },
  rpl: { category: 'Video', application: 'Replay Video Format' },
  smk: { category: 'Video', application: 'Smacker Video' },

  /*--------------------------------------------------------------------------------------------------------*/

  // 🖼️ IMAGE FILES (Bitmap, Raster, and Special-Purpose)
  jpg: { category: 'Image', application: 'JPEG Image', validMimeTypes: ['image/jpeg'] },
  jpeg: { category: 'Image', application: 'JPEG Image', validMimeTypes: ['image/jpeg'] },
  png: { category: 'Image', application: 'PNG Image', validMimeTypes: ['image/png'] },
  gif: { category: 'Image', application: 'GIF Image', validMimeTypes: ['image/gif'] },
  bmp: { category: 'Image', application: 'Bitmap Image', validMimeTypes: ['image/bmp'] },
  webp: { category: 'Image', application: 'WebP Image', validMimeTypes: ['image/webp'] },
  apng: { category: 'Image', application: 'Animated PNG', validMimeTypes: ['image/apng'] },
  ico: {
    category: 'Image',
    application: 'Icon File',
    validMimeTypes: ['image/vnd.microsoft.icon'],
  },
  tiff: { category: 'Image', application: 'TIFF Image', validMimeTypes: ['image/tiff'] },
  tif: { category: 'Image', application: 'TIFF Image', validMimeTypes: ['image/tiff'] },
  heif: {
    category: 'Image',
    application: 'High Efficiency Image Format',
    validMimeTypes: ['image/heif'],
  },
  heic: {
    category: 'Image',
    application: 'High Efficiency Image Codec',
    validMimeTypes: ['image/heic'],
  },
  jp2: { category: 'Image', application: 'JPEG 2000', validMimeTypes: ['image/jp2'] },
  j2k: { category: 'Image', application: 'JPEG 2000', validMimeTypes: ['image/jp2'] },
  exr: { category: 'Image', application: 'OpenEXR', validMimeTypes: ['image/x-exr'] },
  hdr: { category: 'Image', application: 'Radiance HDR', validMimeTypes: ['image/vnd.radiance'] },
  psd: {
    category: 'Image',
    application: 'Adobe Photoshop Document',
    validMimeTypes: ['image/vnd.adobe.photoshop'],
  },
  xcf: { category: 'Image', application: 'GIMP Image Format' },
  dds: {
    category: 'Image',
    application: 'DirectDraw Surface',
    validMimeTypes: ['image/vnd.ms-dds'],
  },
  pcx: { category: 'Image', application: 'ZSoft PCX', validMimeTypes: ['image/x-pcx'] },
  iff: { category: 'Image', application: 'Amiga Interchange File Format' },
  tga: { category: 'Image', application: 'Truevision TGA', validMimeTypes: ['image/x-targa'] },
  icns: { category: 'Image', application: 'Apple Icon Image' },

  // 📷 CAMERA RAW FORMATS
  raw: { category: 'Image', application: 'General RAW Image Format' },
  cr2: { category: 'Image', application: 'Canon RAW Image' },
  cr3: { category: 'Image', application: 'Canon RAW Image' },
  nef: { category: 'Image', application: 'Nikon RAW Image' },
  nrw: { category: 'Image', application: 'Nikon RAW Image' },
  arw: { category: 'Image', application: 'Sony RAW Image' },
  srf: { category: 'Image', application: 'Sony RAW Image' },
  sr2: { category: 'Image', application: 'Sony RAW Image' },
  orf: { category: 'Image', application: 'Olympus RAW Image' },
  rw2: { category: 'Image', application: 'Panasonic RAW Image' },
  raf: { category: 'Image', application: 'Fuji RAW Image' },
  dng: { category: 'Image', application: 'Adobe Digital Negative' },
  pef: { category: 'Image', application: 'Pentax RAW Image' },
  bay: { category: 'Image', application: 'Casio RAW Image' },
  rwl: { category: 'Image', application: 'Leica RAW Image' },

  // 🎭 TEXTURE & GAME DEVELOPMENT FORMATS
  ktx: { category: 'Image', application: 'Khronos Texture Format' },
  pvr: { category: 'Image', application: 'PowerVR Texture Compression' },
  txd: { category: 'Image', application: 'RenderWare Texture Dictionary' },
  vtf: { category: 'Image', application: 'Valve Texture Format' },

  // 📹 VIDEO FRAME / SPRITE FORMATS
  anm: { category: 'Image', application: 'Animation Frame Sequence' },
  flif: { category: 'Image', application: 'Free Lossless Image Format' },

  // 🏆 LEGACY & OBSOLETE FORMATS
  jp3: { category: 'Image', application: 'JPEG 3000 Legacy Format' },
  jbig: { category: 'Image', application: 'JBIG Image Format' },
  jbig2: { category: 'Image', application: 'JBIG2 Image Format' },
  xpm: { category: 'Image', application: 'X PixMap Format' },
  sun: { category: 'Image', application: 'Sun Raster Image' },
  sgi: { category: 'Image', application: 'Silicon Graphics Image' },
  ras: { category: 'Image', application: 'Sun Raster Image' },
  pgm: { category: 'Image', application: 'Portable GrayMap' },
  pbm: { category: 'Image', application: 'Portable Bitmap' },
  ppm: { category: 'Image', application: 'Portable PixMap' },
  xbm: { category: 'Image', application: 'X Bitmap Image' },

  // 🛠️ MULTI-PAGE IMAGE FORMATS
  mng: { category: 'Image', application: 'Multiple-image Network Graphics' },
  jps: { category: 'Image', application: 'JPEG Stereo Image' },
  mpo: { category: 'Image', application: 'Multi-Picture Object' },
  dcx: { category: 'Image', application: 'Multi-Page PCX' },
  otb: { category: 'Image', application: 'Nokia Over The Air Bitmap' },
  pgf: { category: 'Image', application: 'Progressive Graphics Format' },

  /*--------------------------------------------------------------------------------------------------------*/

  // 🏥 MEDICAL IMAGING FORMATS
  dcm: {
    category: 'Medical',
    application: 'DICOM Medical Image',
    validMimeTypes: ['application/dicom'],
  },
  nii: { category: 'Medical', application: 'NIfTI Neuroimaging Format' },
  mha: { category: 'Medical', application: 'MetaImage Format' },
  mhd: { category: 'Medical', application: 'MetaImage Format Header' },

  // 🔬 SCIENTIFIC / SPECIALIZED FORMATS
  fits: { category: 'Scientific', application: 'Flexible Image Transport System (FITS)' },
  czi: { category: 'Scientific', application: 'Carl Zeiss Image Data Format' },
  lif: { category: 'Scientific', application: 'Leica Image File' },
  nd2: { category: 'Scientific', application: 'Nikon ND2 Microscopy Image' },
  gel: { category: 'Scientific', application: 'Gel Electrophoresis Image' },
  spe: { category: 'Scientific', application: 'Spectral Imaging File' },

  // 📄 SCANNED DOCUMENT IMAGE FORMATS
  fax: { category: 'Document', application: 'Fax Image Format' },

  // 🗜️ ARCHIVES
  zip: { category: 'Compression', validMimeTypes: ['application/zip'] },
  rar: { category: 'Compression', validMimeTypes: ['application/vnd.rar'] },
  '7z': { category: 'Compression', validMimeTypes: ['application/x-7z-compressed'] },
  tar: { category: 'Compression', validMimeTypes: ['application/x-tar'] },
  gz: { category: 'Compression', validMimeTypes: ['application/gzip'] },

  // 🔑 EXECUTABLES
  exe: {
    category: 'Executable',
    application: 'Windows Executable',
    validMimeTypes: ['application/x-msdownload'],
  },
  msi: {
    category: 'Executable',
    application: 'Windows Installer',
    validMimeTypes: ['application/x-msi'],
  },
  dmg: {
    category: 'Executable',
    application: 'Apple Disk Image',
    validMimeTypes: ['application/x-apple-diskimage'],
  },

  /*--------------------------------------------------------------------------------------------------------*/

  // 💻 CODE FILES
  js: {
    category: 'Code',
    application: 'JavaScript',
    validMimeTypes: ['text/javascript', 'application/javascript'],
  },
  mjs: { category: 'Code', application: 'ES Modules JavaScript' },
  cjs: { category: 'Code', application: 'CommonJS JavaScript' },
  ts: { category: 'Code', application: 'TypeScript', validMimeTypes: ['application/typescript'] },
  tsx: { category: 'Code', application: 'TypeScript JSX' },
  jsx: { category: 'Code', application: 'JavaScript JSX' },
  java: { category: 'Code', application: 'Java', validMimeTypes: ['text/x-java-source'] },
  kt: { category: 'Code', application: 'Kotlin', validMimeTypes: ['text/x-kotlin'] },
  kts: { category: 'Code', application: 'Kotlin Script' },
  py: { category: 'Code', application: 'Python', validMimeTypes: ['text/x-python'] },
  pyc: { category: 'Code', application: 'Compiled Python File' },
  pyo: { category: 'Code', application: 'Optimized Python File' },
  rpy: { category: 'Code', application: "Ren'Py Script" },
  rb: { category: 'Code', application: 'Ruby', validMimeTypes: ['text/x-ruby'] },
  php: { category: 'Code', application: 'PHP', validMimeTypes: ['application/x-httpd-php'] },
  swift: { category: 'Code', application: 'Swift' },
  go: { category: 'Code', application: 'Go', validMimeTypes: ['text/x-go'] },
  rs: { category: 'Code', application: 'Rust' },
  dart: { category: 'Code', application: 'Dart', validMimeTypes: ['application/dart'] },
  lua: { category: 'Code', application: 'Lua', validMimeTypes: ['text/x-lua'] },
  r: { category: 'Code', application: 'R Language', validMimeTypes: ['text/x-r'] },
  pl: { category: 'Code', application: 'Perl', validMimeTypes: ['text/x-perl'] },
  tcl: { category: 'Code', application: 'Tcl Script' },
  sh: { category: 'Code', application: 'Shell Script', validMimeTypes: ['application/x-sh'] },
  bash: { category: 'Code', application: 'Bash Script' },
  zsh: { category: 'Code', application: 'Zsh Script' },
  fish: { category: 'Code', application: 'Fish Shell Script' },
  ps1: { category: 'Code', application: 'PowerShell Script' },
  bat: { category: 'Code', application: 'Batch Script' },
  cmd: { category: 'Code', application: 'Windows Command Script' },
  ahk: { category: 'Code', application: 'AutoHotkey Script' },

  // C / C++ / C#
  c: { category: 'Code', application: 'C Language', validMimeTypes: ['text/x-csrc'] },
  i: { category: 'Code', application: 'C Preprocessed File' },
  cpp: { category: 'Code', application: 'C++', validMimeTypes: ['text/x-c++src'] },
  cc: { category: 'Code', application: 'C++' },
  cxx: { category: 'Code', application: 'C++' },
  h: { category: 'Code', application: 'C Header File' },
  hpp: { category: 'Code', application: 'C++ Header File' },
  cs: { category: 'Code', application: 'C#', validMimeTypes: ['text/x-csharp'] },
  fs: { category: 'Code', application: 'F#' },
  ml: { category: 'Code', application: 'OCaml/ML' },
  nim: { category: 'Code', application: 'Nim Language' },

  // Web Development
  html: { category: 'Code', application: 'HTML', validMimeTypes: ['text/html'] },
  htm: { category: 'Code', application: 'HTML', validMimeTypes: ['text/html'] },
  css: { category: 'Code', application: 'CSS', validMimeTypes: ['text/css'] },
  scss: { category: 'Code', application: 'SASS/SCSS' },
  sass: { category: 'Code', application: 'SASS/SCSS' },
  less: { category: 'Code', application: 'LESS' },
  vue: { category: 'Code', application: 'Vue.js' },
  svelte: { category: 'Code', application: 'Svelte' },
  astro: { category: 'Code', application: 'Astro' },

  // JSON & Configuration Files for Code
  jsonc: { category: 'Code', application: 'JSON with Comments' },
  json5: { category: 'Code', application: 'JSON5' },
  lock: { category: 'Code', application: 'Lockfile' },

  // Scripting Languages
  vbs: { category: 'Code', application: 'VBScript' },
  wsf: { category: 'Code', application: 'Windows Script File' },

  // Assembly & Low-Level Languages
  asm: { category: 'Code', application: 'Assembly Language' },
  s: { category: 'Code', application: 'Assembly Language' },
  a51: { category: 'Code', application: 'Assembly 8051' },
  m68k: { category: 'Code', application: 'Motorola 68K Assembly' },
  vhdl: { category: 'Code', application: 'VHDL Hardware Description' },
  verilog: { category: 'Code', application: 'Verilog Hardware Description' },
  v: { category: 'Code', application: 'Verilog' },
  sv: { category: 'Code', application: 'SystemVerilog' },

  // Functional & Logic Programming
  clj: { category: 'Code', application: 'Clojure' },
  cljs: { category: 'Code', application: 'ClojureScript' },
  lisp: { category: 'Code', application: 'Lisp' },
  el: { category: 'Code', application: 'Emacs Lisp' },
  scm: { category: 'Code', application: 'Scheme' },
  pro: { category: 'Code', application: 'Prolog' },

  // Data Processing & Scripting
  awk: { category: 'Code', application: 'AWK Script' },
  sed: { category: 'Code', application: 'SED Script' },

  // WebAssembly
  wasm: { category: 'Code', application: 'WebAssembly Binary File' },
  wast: { category: 'Code', application: 'WebAssembly Text File' },

  // Game Development
  godot: { category: 'Code', application: 'Godot Engine Script' },
  pck: { category: 'Code', application: 'Godot Engine Pack' },
  gd: { category: 'Code', application: 'GDScript' },

  // Build System & Compilation
  makefile: { category: 'Code', application: 'Makefile' },
  ninja: { category: 'Code', application: 'Ninja Build File' },
  cmake: { category: 'Code', application: 'CMake Build Script' },
  gradle: { category: 'Code', application: 'Gradle Build Script' },
  maven: { category: 'Code', application: 'Maven POM File' },

  // Cloud & Serverless Functions
  graphql: { category: 'Code', application: 'GraphQL Schema' },
  cloudfunctions: { category: 'Code', application: 'Google Cloud Functions' },
  lambda: { category: 'Code', application: 'AWS Lambda Function' },
  'serverless.yml': { category: 'Code', application: 'Serverless Framework' },

  // Miscellaneous
  repl: { category: 'Code', application: 'REPL Script' },
  'robots.txt': { category: 'Code', application: 'Robots.txt for Web Crawlers' },
  htaccess: { category: 'Code', application: 'Apache Configuration' },
  htpasswd: { category: 'Code', application: 'Apache User Password File' },

  /*--------------------------------------------------------------------------------------------------------*/

  // 🏗️ 3D FILES (Modeling, Engineering, Simulation, 3D Printing, and Game Assets)
  obj: { category: '3D', application: 'Wavefront OBJ File', validMimeTypes: ['model/obj'] },
  mtl: { category: '3D', application: 'Wavefront Material File' },
  fbx: { category: '3D', application: 'Autodesk FBX Format' },
  dae: {
    category: '3D',
    application: 'COLLADA 3D Model Format',
    validMimeTypes: ['model/vnd.collada+xml'],
  },
  gltf: {
    category: '3D',
    application: 'GL Transmission Format',
    validMimeTypes: ['model/gltf+json'],
  },
  glb: { category: '3D', application: 'Binary GLTF Model', validMimeTypes: ['model/gltf-binary'] },
  stl: { category: '3D', application: 'Stereolithography 3D Model', validMimeTypes: ['model/stl'] },
  '3ds': { category: '3D', application: '3D Studio Mesh' },
  max: { category: '3D', application: 'Autodesk 3ds Max Scene' },
  blend: { category: '3D', application: 'Blender Project File' },
  abc: { category: '3D', application: 'Alembic 3D File' },
  usd: { category: '3D', application: 'Universal Scene Description' },
  usda: { category: '3D', application: 'Universal Scene Description ASCII' },
  usdz: { category: '3D', application: 'Universal Scene Description Zip Archive' },
  rvt: { category: '3D', application: 'Autodesk Revit Model' },
  rfa: { category: '3D', application: 'Autodesk Revit Family File' },
  skp: { category: '3D', application: 'SketchUp Model' },
  layout: { category: '3D', application: 'SketchUp Layout File' },
  pln: { category: '3D', application: 'ArchiCAD Project File' },
  gsm: { category: '3D', application: 'ArchiCAD Library Object File' },
  '3dm': { category: '3D', application: 'Rhinoceros 3D Model File' },

  // 🌍 STANDARDIZED 3D INTERCHANGE FORMATS
  igs: { category: '3D', application: 'IGES Model File', validMimeTypes: ['model/iges'] },
  iges: {
    category: '3D',
    application: 'Initial Graphics Exchange Specification',
    validMimeTypes: ['model/iges'],
  },
  step: { category: '3D', application: 'STEP 3D Model File', validMimeTypes: ['model/step'] },
  stp: { category: '3D', application: 'STEP 3D Model File', validMimeTypes: ['model/step'] },
  x_t: { category: '3D', application: 'Parasolid Model File' },
  x_b: { category: '3D', application: 'Parasolid Binary File' },
  brep: { category: '3D', application: 'Boundary Representation Model' },

  // ⚙️ SOLID MODELING FILES (Mechanical CAD)
  sldprt: { category: '3D', application: 'SolidWorks Part File' },
  sldasm: { category: '3D', application: 'SolidWorks Assembly File' },
  slddrw: { category: '3D', application: 'SolidWorks Drawing File' },
  prt: { category: '3D', application: 'PTC Creo Part File' },
  neu: { category: '3D', application: 'Neutral CAD File' },

  // 🏗️ ENGINEERING & INDUSTRIAL DESIGN FILES
  ifc: { category: '3D', application: 'Industry Foundation Classes (IFC)' },
  ifczip: { category: '3D', application: 'Compressed IFC File' },
  sat: { category: '3D', application: 'ACIS SAT 3D Model' },
  catpart: { category: '3D', application: 'CATIA Part File' },
  catproduct: { category: '3D', application: 'CATIA Product File' },
  cgr: { category: '3D', application: 'CATIA Graphical Representation' },

  // 🖨️ CNC & 3D PRINTING FILES
  gcode: {
    category: '3D',
    application: 'G-Code CNC Instructions',
    validMimeTypes: ['text/x-gcode'],
  },
  nc: { category: '3D', application: 'Numerical Control File' },
  tap: { category: '3D', application: 'CNC Machine Toolpath File' },
  '3mf': { category: '3D', application: '3D Manufacturing Format' },
  x3d: { category: '3D', application: 'Extensible 3D Graphics' },
  wrl: { category: '3D', application: 'VRML Virtual Reality Modeling Language' },
  ply: { category: '3D', application: 'Polygon File Format' },

  // 🦴 3D RIGGING & ANIMATION FILES
  bvh: { category: '3D', application: 'Biovision Hierarchy Animation' },
  c3d: { category: '3D', application: 'C3D Motion Capture Data' },
  anim: { category: '3D', application: 'Maya Animation File' },
  xaf: { category: '3D', application: '3ds Max Animation File' },
  xsf: { category: '3D', application: '3ds Max Skeleton File' },
  mdd: { category: '3D', application: 'Motion Designer Data' },

  // 🎭 3D GAME ENGINE & RUNTIME FORMATS
  vrm: { category: '3D', application: 'Virtual Reality Model' },
  scn: { category: '3D', application: 'Godot Engine Scene' },
  res: { category: '3D', application: 'Godot Engine Resource' },
  unitypackage: { category: '3D', application: 'Unity Package File' },
  prefab: { category: '3D', application: 'Unity Prefab File' },
  uasset: { category: '3D', application: 'Unreal Engine Asset File' },
  umap: { category: '3D', application: 'Unreal Engine Map File' },

  // 📼 LEGACY & OBSOLETE 3D FORMATS
  lwo: { category: '3D', application: 'LightWave Object' },
  lws: { category: '3D', application: 'LightWave Scene' },
  cob: { category: '3D', application: 'Caligari TrueSpace Object' },
  x: { category: '3D', application: 'DirectX 3D Model' },
  ac: { category: '3D', application: 'AC3D Model File' },
  iv: { category: '3D', application: 'Open Inventor File' },

  /*--------------------------------------------------------------------------------------------------------*/

  // 🗄️ DATABASE FILES (Relational, NoSQL, Backup, and Export)
  db: { category: 'Database', application: 'Generic Database File' },
  sqlite: {
    category: 'Database',
    application: 'SQLite Database File',
    validMimeTypes: ['application/vnd.sqlite3'],
  },
  sqlite3: { category: 'Database', application: 'SQLite 3 Database File' },
  db3: { category: 'Database', application: 'SQLite 3 Database File' },
  mdb: {
    category: 'Database',
    application: 'Microsoft Access Database',
    validMimeTypes: ['application/x-msaccess'],
  },
  accdb: {
    category: 'Database',
    application: 'Microsoft Access Database (2007+)',
    validMimeTypes: ['application/vnd.ms-access'],
  },
  frm: { category: 'Database', application: 'MySQL Table Definition File' },
  myd: { category: 'Database', application: 'MySQL Data File' },
  myi: { category: 'Database', application: 'MySQL Index File' },
  sql: {
    category: 'Database',
    application: 'Structured Query Language Script',
    validMimeTypes: ['application/sql'],
  },
  bak: { category: 'Database', application: 'Database Backup File' },

  // 📚 RELATIONAL DATABASE FILES
  ibd: { category: 'Database', application: 'InnoDB Data File' },
  mssql: { category: 'Database', application: 'Microsoft SQL Server Database' },
  mdf: { category: 'Database', application: 'Microsoft SQL Server Primary Database File' },
  ldf: { category: 'Database', application: 'Microsoft SQL Server Log File' },
  ndf: { category: 'Database', application: 'Microsoft SQL Server Secondary Database File' },
  ora: { category: 'Database', application: 'Oracle Database File' },
  dmp: { category: 'Database', application: 'Oracle Database Dump File' },
  accde: { category: 'Database', application: 'Microsoft Access Executable File' },
  adp: { category: 'Database', application: 'Access Data Project' },

  // 📀 NOSQL DATABASE FILES
  bson: { category: 'Database', application: 'Binary JSON (MongoDB Data File)' },
  fdb: { category: 'Database', application: 'Firebird Database File' },
  gdb: { category: 'Database', application: 'InterBase Database File' },
  neo4j: { category: 'Database', application: 'Neo4j Graph Database File' },
  arangodb: { category: 'Database', application: 'ArangoDB Database File' },
  realm: { category: 'Database', application: 'Realm Database File' },
  couchdb: { category: 'Database', application: 'CouchDB Database File' },

  // 🏛️ ENTERPRISE DATABASE SYSTEM FILES
  rdb: { category: 'Database', application: 'Redis Database File' },
  dat: { category: 'Database', application: 'Generic Database Data File' },
  rox: { category: 'Database', application: 'RocksDB Data File' },
  ldb: { category: 'Database', application: 'LevelDB Database File' },

  // 🔄 DATABASE EXPORT & BACKUP FILES
  exp: { category: 'Database', application: 'Export File' },
  bkp: { category: 'Database', application: 'Backup Database File' },
  xsql: { category: 'Database', application: 'XML SQL Export File' },
  wdb: { category: 'Database', application: 'Microsoft Works Database' },
  sdf: { category: 'Database', application: 'SQL Server Compact Edition Database' },
  pdb: { category: 'Database', application: 'Palm Database File' },
  cdb: { category: 'Database', application: 'Pocket Access Database' },

  // 🔌 DATABASE CONFIGURATION & SYSTEM FILES
  cnf: { category: 'Database', application: 'Database Configuration File' },

  // 📊 OLAP & ANALYTICAL DATABASE FILES
  cub: { category: 'Database', application: 'Analysis Services Cube File' },
  olap: { category: 'Database', application: 'Online Analytical Processing Cube' },
  vw: { category: 'Database', application: 'Database View File' },

  // 📼 LEGACY & OBSOLETE DATABASE FORMATS
  nsf: { category: 'Database', application: 'Lotus Notes Database' },
  ntf: { category: 'Database', application: 'Lotus Notes Template File' },
  dbx: { category: 'Database', application: 'Outlook Express Database File' },
  edb: { category: 'Database', application: 'Exchange Database File' },
  fp3: { category: 'Database', application: 'FileMaker Pro 3 Database' },
  fp5: { category: 'Database', application: 'FileMaker Pro 5 Database' },
  fp7: { category: 'Database', application: 'FileMaker Pro 7 Database' },
  gdbtable: { category: 'Database', application: 'ArcGIS Geodatabase Table File' },
  gdbindex: { category: 'Database', application: 'ArcGIS Geodatabase Index File' },

  /*--------------------------------------------------------------------------------------------------------*/

  // 📊 DATA FILES (Structured, Unstructured, GIS, Scientific, and Machine Learning)
  csv: {
    category: 'Data',
    application: 'Comma-Separated Values File',
    validMimeTypes: ['text/csv'],
  },
  tsv: {
    category: 'Data',
    application: 'Tab-Separated Values File',
    validMimeTypes: ['text/tab-separated-values'],
  },
  psv: { category: 'Data', application: 'Pipe-Separated Values File' },
  json: {
    category: 'Data',
    application: 'JavaScript Object Notation',
    validMimeTypes: ['application/json'],
  },
  jsonl: {
    category: 'Data',
    application: 'JSON Lines File',
    validMimeTypes: ['application/jsonl'],
  },
  xml: {
    category: 'Data',
    application: 'Extensible Markup Language',
    validMimeTypes: ['application/xml', 'text/xml'],
  },
  yaml: {
    category: 'Data',
    application: "YAML Ain't Markup Language",
    validMimeTypes: ['application/x-yaml'],
  },
  yml: {
    category: 'Data',
    application: "YAML Ain't Markup Language",
    validMimeTypes: ['application/x-yaml'],
  },
  rdf: {
    category: 'Data',
    application: 'Resource Description Framework',
    validMimeTypes: ['application/rdf+xml'],
  },
  ttl: { category: 'Data', application: 'Turtle RDF Data' },
  n3: { category: 'Data', application: 'Notation3 RDF Data' },
  msgpack: { category: 'Data', application: 'MessagePack Serialized Data' },
  ubj: { category: 'Data', application: 'Universal Binary JSON' },

  // 🔬 SCIENTIFIC & STATISTICAL DATA FORMATS
  arff: { category: 'Data', application: 'Attribute-Relation File Format (WEKA)' },
  dta: { category: 'Data', application: 'Stata Data File' },
  sav: { category: 'Data', application: 'SPSS Data File' },
  por: { category: 'Data', application: 'SPSS Portable Data File' },
  sd2: { category: 'Data', application: 'SAS Data File' },
  xpt: { category: 'Data', application: 'SAS Transport File' },
  rdata: { category: 'Data', application: 'R Statistical Data File' },
  rds: { category: 'Data', application: 'R Serialized Data File' },
  mat: { category: 'Data', application: 'MATLAB Data File' },

  // 🌎 GIS & GEOSPATIAL DATA FORMATS
  grib: { category: 'Data', application: 'GRIB Meteorological Data' },

  // 🏭 INDUSTRIAL & ENGINEERING DATA FILES
  pcap: { category: 'Data', application: 'Packet Capture File' },
  pcapng: { category: 'Data', application: 'Packet Capture Next Generation' },
  las: { category: 'Data', application: 'LIDAR Point Cloud Data' },
  xyz: { category: 'Data', application: 'XYZ Point Cloud Data' },

  // 🧬 GENOMICS & BIOINFORMATICS DATA FORMATS
  fasta: { category: 'Data', application: 'FASTA Sequence File' },
  fastq: { category: 'Data', application: 'FASTQ Sequence File' },
  bam: { category: 'Data', application: 'Binary Alignment Map' },
  sam: { category: 'Data', application: 'Sequence Alignment Map' },
  vcf: { category: 'Data', application: 'Variant Call Format' },
  gff: { category: 'Data', application: 'General Feature Format' },
  gtf: { category: 'Data', application: 'Gene Transfer Format' },

  // 🤖 MACHINE LEARNING & MODEL DATA FILES
  pkl: { category: 'Data', application: 'Pickle Serialized Data' },
  joblib: { category: 'Data', application: 'Joblib Serialized Model' },
  npy: { category: 'Data', application: 'NumPy Binary File' },
  npz: { category: 'Data', application: 'NumPy Compressed Archive' },
  h5: { category: 'Data', application: 'HDF5 Data Format' },
  pb: { category: 'Data', application: 'TensorFlow Model File' },
  onnx: { category: 'Data', application: 'Open Neural Network Exchange Format' },

  // 🔄 COMPRESSED & ARCHIVED DATA FORMATS
  parquet: {
    category: 'Data',
    application: 'Apache Parquet Data Format',
    validMimeTypes: ['application/vnd.apache.parquet'],
  },
  avro: { category: 'Data', application: 'Apache Avro Data File' },
  orc: { category: 'Data', application: 'Optimized Row Columnar Data File' },
  feather: { category: 'Data', application: 'Feather Data File' },
  zarr: { category: 'Data', application: 'Zarr Compressed Data File' },

  // 🏗️ CONFIGURATION & LOG DATA FILES
  log: { category: 'Data', application: 'Log File', validMimeTypes: ['text/plain'] },
  ini: { category: 'Data', application: 'Configuration File' },
  cfg: { category: 'Data', application: 'Configuration File' },
  properties: { category: 'Data', application: 'Java Properties File' },

  /*--------------------------------------------------------------------------------------------------------*/

  // 🔤 FONT FILES (Web, Desktop, Vector, Bitmap, and Specialized)
  ttf: { category: 'Font', application: 'TrueType Font', validMimeTypes: ['font/ttf'] },
  otf: { category: 'Font', application: 'OpenType Font', validMimeTypes: ['font/otf'] },
  woff: { category: 'Font', application: 'Web Open Font Format', validMimeTypes: ['font/woff'] },
  woff2: {
    category: 'Font',
    application: 'Web Open Font Format 2',
    validMimeTypes: ['font/woff2'],
  },
  eot: {
    category: 'Font',
    application: 'Embedded OpenType Font',
    validMimeTypes: ['application/vnd.ms-fontobject'],
  },

  // 🖥️ DESKTOP & SYSTEM FONTS
  dfont: { category: 'Font', application: 'Mac OS Data Fork Font' },
  bdf: { category: 'Font', application: 'Bitmap Distribution Format' },
  pcf: { category: 'Font', application: 'Portable Compiled Format' },
  fnt: { category: 'Font', application: 'Windows Bitmap Font' },

  // 🎨 VECTOR-BASED FONT FORMATS
  psf: { category: 'Font', application: 'PC Screen Font' },

  // 🏛️ LEGACY & OBSOLETE FONT FORMATS
  pfb: { category: 'Font', application: 'PostScript Type 1 Font Binary' },
  pfm: { category: 'Font', application: 'PostScript Type 1 Font Metrics' },
  afm: { category: 'Font', application: 'Adobe Font Metrics' },
  fon: { category: 'Font', application: 'Windows FON Bitmap Font' },

  // 🖋️ SPECIALIZED & CUSTOM FONT FORMATS
  txf: { category: 'Font', application: 'Texture Font Format' },
  ps: { category: 'Font', application: 'PostScript Font' },
  chm: { category: 'Font', application: 'Compiled HTML Help Font' },

  /*--------------------------------------------------------------------------------------------------------*/

  // 🎨 VECTOR GRAPHICS FILES (Scalable, Design, and Specialized)
  svg: {
    category: 'Vector',
    application: 'Scalable Vector Graphics',
    validMimeTypes: ['image/svg+xml'],
  },
  eps: {
    category: 'Vector',
    application: 'Encapsulated PostScript',
    validMimeTypes: ['application/postscript'],
  },
  ai: {
    category: 'Vector',
    application: 'Adobe Illustrator File',
    validMimeTypes: ['application/postscript'],
  },
  cdr: { category: 'Vector', application: 'CorelDRAW File' },
  emf: { category: 'Vector', application: 'Enhanced Metafile' },
  wmf: { category: 'Vector', application: 'Windows Metafile' },
  sketch: { category: 'Vector', application: 'Sketch Design File' },

  // 📼 LEGACY & OBSOLETE VECTOR FORMATS
  cgm: { category: 'Vector', application: 'Computer Graphics Metafile' },
  fxg: { category: 'Vector', application: 'Flash XML Graphics File' },
  pict: { category: 'Vector', application: 'Apple PICT File' },
  swf: { category: 'Vector', application: 'Shockwave Flash Vector File' },
  xar: { category: 'Vector', application: 'Xara Vector File' },

  // 🌍 GIS & MAP VECTOR FORMATS (Move to Vector)
  shp: { category: 'Vector', application: 'ESRI Shapefile' },
  shx: { category: 'Vector', application: 'ESRI Shapefile Index' },
  dbf: { category: 'Vector', application: 'Shapefile Database Format' },
  geojson: { category: 'Vector', application: 'Geospatial JSON File' },
  topojson: { category: 'Vector', application: 'Topological JSON File' },
  gpx: { category: 'Vector', application: 'GPS Exchange Format' },
  kml: { category: 'Vector', application: 'Keyhole Markup Language' },
  kmz: { category: 'Vector', application: 'Compressed KML File' },
  gml: { category: 'Vector', application: 'Geography Markup Language' },
  dgn: { category: 'Vector', application: 'MicroStation Design File' },
};
