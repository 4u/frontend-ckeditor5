import fileIcon from '@ckeditor/ckeditor5-ckfinder/theme/icons/browse-files.svg';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import FileDialogButtonView from '@ckeditor/ckeditor5-upload/src/ui/filedialogbuttonview';

export default class FileUploadUI extends Plugin {
  /**
   * @inheritDoc
   */
  init() {
    const editor = this.editor;
    const t = editor.t;

    editor.ui.componentFactory.add('fileUpload', (locale) => {
      const view = new FileDialogButtonView(locale);
      const command = editor.commands.get('fileUpload');

      view.set({
        allowMultipleFiles: true,
      });

      view.buttonView.set({
        label: t('Insert file'),
        icon: fileIcon,
        tooltip: true,
      });

      view.buttonView.bind('isEnabled').to(command);

      view.on('done', (evt, files) => {
        const filesToUpload = Array.from(files);

        if (filesToUpload.length) {
          editor.execute('fileUpload', { file: filesToUpload });
        }
      });

      return view;
    });
  }
}
