import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import FileRepository from '@ckeditor/ckeditor5-upload/src/filerepository';

import { Adapter } from './Adapter';

export default class S3Upload extends Plugin {
  static get requires() {
    return [FileRepository];
  }

  static get pluginName() {
    return 'S3Upload';
  }

  init() {
    const s3Uploader = this.editor.config.get('s3Uploader');

    if (!s3Uploader) {
      console.warn('s3Uploader is not configured');
      return;
    }

    this.editor.plugins.get('FileRepository').createUploadAdapter = (loader) =>
      new Adapter(loader, s3Uploader, this.editor.t);
  }
}
