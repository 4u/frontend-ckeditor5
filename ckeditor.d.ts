import type { editor as coreEditor } from '@ckeditor/ckeditor5-core';

declare module 'frontend-ckeditor5' {
  export * from '@ckeditor/ckeditor5-core';

  export type S3UploadOptions = {
    file: File;
    onUploadProgress: (event: ProgressEvent) => void;
  };

  export type S3UploadResult = {
    promise: Promise<string>;
    cancel: () => void;
  };

  export type S3Uploader = {
    upload: (options: S3UploadOptions) => S3UploadResult;
  };

  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Editor extends coreEditor.Editor {}

  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface EventInfo extends coreEditor.EventInfo {}

  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Emitter extends coreEditor.Emitter {}
  interface EditorConfig extends coreEditor.EditorConfig {
    s3Upload: S3Uploader;
    preCodeBlock: {
      noOfSpaceForTabKey?: number;
      toolbar?: string[];
      languages: Array<{
        language: string;
        title: string;
      }>;
    };
  }

  const BalloonEditor: Editor & coreEditor.utils.DataApi;
  export default BalloonEditor;
}
