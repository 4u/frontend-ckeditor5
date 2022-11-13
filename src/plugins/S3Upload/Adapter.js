export class Adapter {
  constructor(loader, s3Uploader, t) {
    this.loader = loader;
    this.s3Uploader = s3Uploader;
    this.t = t;
    this.cancel = null;
    this.onUploadProgress = this.onUploadProgress.bind(this);
  }

  async upload() {
    const file = await Promise.resolve(this.loader.file);
    const { promise, cancel } = this.s3Uploader.upload({
      file: file,
      onUploadProgress: this.onUploadProgress,
    });
    this.cancel = cancel;
    const url = await promise;
    this.cancel = null;
    return { default: url };
  }

  abort() {
    if (this.cancel) {
      this.cancel();
      this.cancel = null;
    }
  }

  onUploadProgress(event) {
    this.loader.uploadTotal = event.total;
    this.loader.uploaded = event.loaded;
  }
}
