import { findOptimalInsertionPosition } from '@ckeditor/ckeditor5-widget/src/utils';

export function insertFile(writer, model, attributes = {}) {
  const fileElement = writer.createElement('file', attributes);

  const insertAtSelection = findOptimalInsertionPosition(model.document.selection, model);

  model.insertContent(fileElement, insertAtSelection);

  // Inserting an image might've failed due to schema regulations.
  if (fileElement.parent) {
    writer.setSelection(fileElement, 'on');
  }
}

export function isFileAllowed() {
  return true;
}

export function fetchLocalFile(file) {
  return new Promise((resolve, reject) => {
    const fileSrc = file.getAttribute('href');

    // Fetch works asynchronously and so does not block browser UI when processing data.
    fetch(fileSrc)
      .then((resource) => resource.blob())
      .then((blob) => {
        const mimeType = getFileMimeType(blob, fileSrc);
        const filename = file.name;
        const result = createFileFromBlob(blob, filename, mimeType);

        result ? resolve(result) : reject();
      })
      .catch(reject);
  });
}

// Extracts an file type based on its blob representation or its source.
//
// @param {String} src File `src` attribute value.
// @param {Blob} blob File blob representation.
// @returns {String}
function getFileMimeType() {
  return 'application/octet-stream';
}

// Creates a `File` instance from the given `Blob` instance using the specified file name.
//
// @param {Blob} blob The `Blob` instance from which the file will be created.
// @param {String} filename The file name used during the file creation.
// @param {String} mimeType The file MIME type.
// @returns {File|null} The `File` instance created from the given blob or `null` if `File API` is not available.
function createFileFromBlob(blob, filename, mimeType) {
  try {
    return new File([blob], filename, { type: mimeType });
  } catch (err) {
    return null;
  }
}

export function getFilesFromChangeItem(editor, item) {
  return Array.from(editor.model.createRangeOn(item))
    .filter((value) => value.item.name === 'file')
    .map((value) => value.item);
}

export function modelToViewAttributeConverter(attributeKey) {
  return (dispatcher) => {
    dispatcher.on(`attribute:${attributeKey}:file`, function converter(evt, data, conversionApi) {
      if (!conversionApi.consumable.consume(data.item, evt.name)) {
        return;
      }

      const viewWriter = conversionApi.writer;
      const figure = conversionApi.mapper.toViewElement(data.item);
      viewWriter.setAttribute(data.attributeKey, data.attributeNewValue || '', figure);
    });
  };
}
