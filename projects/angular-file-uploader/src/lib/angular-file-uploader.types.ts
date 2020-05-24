export interface ReplaceTexts {
  selectFileBtn?: string;
  resetBtn?: string;
  uploadBtn?: string;
  dragNDropBox?: string;
  attachPinBtn?: string;
  afterUploadMsg_success?: string;
  afterUploadMsg_error?: string;
  sizeLimit?: string;
}

export interface UploadApi {
  url: string;
  method?: 'POST' | 'PUT' | 'PATCH';
  headers?: { [id: string]: string };
  params?: { [id: string]: string };
}

export interface AngularFileUploaderConfig {
  uploadAPI: UploadApi;

  theme?: string;
  id?: number;
  hideProgressBar?: boolean;
  hideResetBtn?: boolean;
  hideSelectBtn?: boolean;
  maxSize?: number;
  formatsAllowed?: string;
  multiple?: boolean;
  fileNameIndex?: boolean;
  replaceTexts?: ReplaceTexts;
}

export interface UploadInfo {
  xhr: XMLHttpRequest;
  formData: FormData;
  indexes: number[];
}
