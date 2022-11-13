import '@ckeditor/ckeditor5-image/theme/imageuploadprogress.css';
import '@ckeditor/ckeditor5-image/theme/imageuploadicon.css';
import '@ckeditor/ckeditor5-image/theme/imageuploadloader.css';

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import LinkEditing from '@ckeditor/ckeditor5-link/src/linkediting';
import LinkUI from '@ckeditor/ckeditor5-link/src/linkui';
import Notification from '@ckeditor/ckeditor5-ui/src/notification/notification';
import FileRepository from '@ckeditor/ckeditor5-upload/src/filerepository';

import FileUploadCommand from './FileUploadCommand';
import { getFilesFromChangeItem } from './utils';

export default class FileUploadProgress extends Plugin {
  /**
   * @inheritDoc
   */
  static get requires() {
    return [LinkEditing, LinkUI];
  }

  /**
   * @inheritDoc
   */
  constructor(editor) {
    super(editor);
  }

  /**
   * @inheritDoc
   */
  init() {
    const editor = this.editor;
    const schema = editor.model.schema;
    const doc = editor.model.document;
    const conversion = editor.conversion;
    const fileRepository = editor.plugins.get(FileRepository);

    if (schema.isRegistered('file')) {
      throw new Error('file is already registered');
    }

    schema.register('file', {
      inheritAllFrom: '$block',
      allowAttributes: ['uploadId', 'uploadStatus', 'uploadName', 'href'],
    });

    conversion.elementToElement({
      model: 'file',
      view: {
        name: 'p',
        classes: 'ck-fileUpload',
      },
    });

    // Register imageUpload command.
    editor.commands.add('fileUpload', new FileUploadCommand(editor));

    // Upload status change - update image's view according to that status.
    editor.editing.downcastDispatcher.on(
      'attribute:uploadStatus:file',
      this.uploadStatusChange.bind(this),
    );

    // Upload placeholder images that appeared in the model.
    doc.on('change', () => {
      const changes = doc.differ.getChanges({ includeChangesInGraveyard: true });

      for (const entry of changes) {
        if (entry.type === 'insert' && entry.name === 'file') {
          const item = entry.position.nodeAfter;
          const isInGraveyard = entry.position.root.rootName == '$graveyard';

          for (const file of getFilesFromChangeItem(editor, item)) {
            // Check if the file element still has upload id.
            const uploadId = file.getAttribute('uploadId');
            if (!uploadId) {
              continue;
            }

            // Check if the file is loaded on this client.
            const loader = fileRepository.loaders.get(uploadId);
            if (!loader) {
              continue;
            }

            if (isInGraveyard) {
              loader.abort();
            } else if (loader.status == 'idle') {
              this._readAndUpload(loader, file);
            }
          }
        }
      }
    });
  }

  /**
   * This method is called each time the image `uploadStatus` attribute is changed.
   *
   * @param {module:utils/eventinfo~EventInfo} evt An object containing information about the fired event.
   * @param {Object} data Additional information about the change.
   * @param {module:engine/conversion/downcastdispatcher~DowncastConversionApi} conversionApi
   */
  uploadStatusChange(evt, data, conversionApi) {
    // const editor = this.editor;
    const modelFile = data.item;
    // conversionApi.consumable.consume(data.item, evt.name);
    const uploadId = modelFile.getAttribute('uploadId');
    if (!uploadId) {
      return;
    }

    const viewFigure = this.editor.editing.mapper.toViewElement(modelFile);
    const status = data.attributeNewValue;
    const { writer } = conversionApi;

    if (status === 'complete') {
      const link = writer.createRawElement(
        'a',
        {
          href: modelFile.getAttribute('href'),
        },
        (domElement) => {
          domElement.innerHTML = modelFile.getAttribute('uploadName');
        },
      );
      writer.insert(writer.createPositionAt(viewFigure, 'end'), link);
    }

    // const fileRepository = editor.plugins.get(FileRepository);
    // fileRepository.loaders.get(uploadId);
  }

  _readAndUpload(loader, fileElement) {
    const editor = this.editor;
    const model = editor.model;
    const t = editor.locale.t;
    const fileRepository = editor.plugins.get(FileRepository);
    const notification = editor.plugins.get(Notification);

    model.enqueueChange('transparent', (writer) => {
      writer.setAttribute('uploadStatus', 'reading', fileElement);
    });

    return loader
      .read()
      .then(() => {
        model.enqueueChange('transparent', (writer) => {
          writer.setAttribute('uploadStatus', 'uploading', fileElement);
        });
        return loader.upload();
      })
      .then((data) => {
        model.enqueueChange('transparent', (writer) => {
          writer.setAttributes(
            {
              uploadStatus: 'complete',
              href: data.default,
            },
            fileElement,
          );
        });
      })
      .catch((error) => {
        model.enqueueChange('transparent', (writer) => {
          writer.setAttributes(
            {
              uploadStatus: 'error',
            },
            fileElement,
          );
        });

        // If status is not 'error' nor 'aborted' - throw error because it means that something else went wrong,
        // it might be generic error and it would be real pain to find what is going on.
        if (loader.status !== 'error' && loader.status !== 'aborted') {
          throw error;
        }

        // Might be 'aborted'.
        if (loader.status == 'error' && error) {
          notification.showWarning(error, {
            title: t('Upload failed'),
            namespace: 'upload',
          });
        }
      })
      .finally(() => clean());

    function clean() {
      // model.enqueueChange('transparent', (writer) => {
      //   writer.remove(fileElement);
      // });
      fileRepository.destroyLoader(loader);
    }
  }
}
