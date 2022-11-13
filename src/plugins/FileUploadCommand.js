/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

import Command from '@ckeditor/ckeditor5-core/src/command';
import Notification from '@ckeditor/ckeditor5-ui/src/notification/notification';
import FileRepository from '@ckeditor/ckeditor5-upload/src/filerepository';

import { isFileAllowed } from './utils';

export default class FileUploadCommand extends Command {
  /**
   * @inheritDoc
   */
  refresh() {
    this.isEnabled = isFileAllowed(this.editor.model);
  }

  /**
   * Executes the command.
   *
   * @fires execute
   * @param {Object} options Options for the executed command.
   * @param {File} options.file The image file or an array of image files to upload.
   */
  execute(options) {
    const editor = this.editor;
    const t = editor.t;
    const fileRepository = editor.plugins.get(FileRepository);
    const notification = editor.plugins.get(Notification);

    const file = Array.isArray(options.file) ? options.file[0] : options.file;
    if (!file) {
      notification.showWarning(new Error('0 files selected'), {
        title: t('Upload failed'),
        namespace: 'upload',
      });
      return;
    }

    const loader = fileRepository.createLoader(file);
    loader
      .read()
      .then(() => loader.upload())
      .then((data) => {
        const linkCommand = editor.commands.get('link');
        linkCommand.execute(data.default, {
          linkIsExternal: true,
          linkIsDownloadable: true,
        });
      })
      .catch((error) => {
        notification.showWarning(error, {
          title: t('Upload failed'),
          namespace: 'upload',
        });
      });
  }
}
