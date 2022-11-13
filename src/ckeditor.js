import UploadAdapter from '@ckeditor/ckeditor5-adapter-ckfinder/src/uploadadapter';
import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment';
import Autoformat from '@ckeditor/ckeditor5-autoformat/src/autoformat';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import CodeEditing from '@ckeditor/ckeditor5-basic-styles/src/code/codeediting';
import CodeUI from '@ckeditor/ckeditor5-basic-styles/src/code/codeui';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote';
import CKFinder from '@ckeditor/ckeditor5-ckfinder/src/ckfinder';
import CloudServices from '@ckeditor/ckeditor5-cloud-services/src/cloudservices';
import CodeBlock from '@ckeditor/ckeditor5-code-block/src/codeblock';
import EasyImage from '@ckeditor/ckeditor5-easy-image/src/easyimage';
import EditorBase from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import Image from '@ckeditor/ckeditor5-image/src/image';
import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption';
import ImageInsert from '@ckeditor/ckeditor5-image/src/imageinsert';
import ImageResize from '@ckeditor/ckeditor5-image/src/imageresize';
import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle';
import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar';
import ImageUpload from '@ckeditor/ckeditor5-image/src/imageupload';
import Indent from '@ckeditor/ckeditor5-indent/src/indent';
import Link from '@ckeditor/ckeditor5-link/src/link';
import LinkImage from '@ckeditor/ckeditor5-link/src/linkimage';
import List from '@ckeditor/ckeditor5-list/src/list';
import MediaEmbed from '@ckeditor/ckeditor5-media-embed/src/mediaembed';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import PasteFromOffice from '@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice';
import Table from '@ckeditor/ckeditor5-table/src/table';
import TableCellProperties from '@ckeditor/ckeditor5-table/src/tablecellproperties';
import TableProperties from '@ckeditor/ckeditor5-table/src/tableproperties';
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar';
import TextTransformation from '@ckeditor/ckeditor5-typing/src/texttransformation';

import FileUploadProgress from './plugins/FileUploadProgress';
import FileUploadUI from './plugins/FileUploadUI';
import S3Upload from './plugins/S3Upload';

export default class Editor extends EditorBase {
  constructor(sourceElementOrData, config) {
    super(sourceElementOrData, config);
  }
}

// Plugins to include in the build.
Editor.builtinPlugins = [
  Essentials,
  UploadAdapter,
  Alignment,
  Autoformat,
  Bold,
  CodeUI,
  CodeEditing,
  Italic,
  BlockQuote,
  CodeBlock,
  CKFinder,
  CloudServices,
  EasyImage,
  Heading,
  Image,
  ImageInsert,
  ImageCaption,
  ImageStyle,
  ImageToolbar,
  ImageUpload,
  ImageResize,
  FileUploadProgress,
  FileUploadUI,
  Indent,
  Link,
  LinkImage,
  List,
  MediaEmbed,
  Paragraph,
  PasteFromOffice,
  Table,
  TableCellProperties,
  TableProperties,
  TableToolbar,
  TextTransformation,
  S3Upload,
];

// Editor configuration.
Editor.defaultConfig = {
  alignment: {
    options: ['left', 'right', 'center', 'justify'],
  },
  toolbar: {
    items: [
      'bold',
      'italic',
      'link',
      'code',
      'fileUpload',
      '|',
      'heading',
      '|',
      'bulletedList',
      'numberedList',
      'alignment',
      '|',
      'indent',
      'outdent',
      '|',
      'imageInsert',
      'blockQuote',
      'insertTable',
      'mediaEmbed',
      '|',
      'codeBlock',
      '|',
      'undo',
      'redo',
    ],
  },
  image: {
    toolbar: [
      'linkImage',
      '|',
      'imageStyle:alignLeft',
      'imageStyle:alignCenter',
      'imageStyle:alignRight',
      '|',
      'imageStyle:full',
      'imageStyle:side',
      '|',
      'imageTextAlternative',
      '|',
      'imageResize',
    ],
    styles: ['full', 'side', 'alignLeft', 'alignCenter', 'alignRight'],
  },
  link: {
    addTargetToExternalLinks: true,
  },
  table: {
    contentToolbar: [
      'tableColumn',
      'tableRow',
      'mergeTableCells',
      'tableProperties',
      'tableCellProperties',
    ],
  },
  codeBlock: {
    languages: [
      { language: 'bash', label: 'Bash' },
      { language: 'xml-doc', label: 'XML' },
      { language: 'javascript', label: 'Javascript' },
      { language: 'typescript', label: 'Typescript' },
      { language: 'python', label: 'Python' },
      { language: 'r', label: 'R' },
      { language: 'sparql', label: 'SPARQL' },
      { language: 'sql', label: 'SQL' },
      { language: 'latex', label: 'LaTeX' },
      { language: 'java', label: 'Java' },
      { language: 'c', label: 'C' },
      { language: 'cpp', label: 'C++' },
    ],
  },
  mediaEmbed: {
    previewsInData: true,
  },
  // This value must be kept in sync with the language defined in webpack.config.js.
  language: 'en',
};
