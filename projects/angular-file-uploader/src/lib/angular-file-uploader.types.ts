export interface ReplaceTexts {
  selectFileBtn: string;
  resetBtn: string;
  uploadBtn: string;
  dragNDropBox: string;
  attachPinBtn: string;
  afterUploadMsg_success: string;
  afterUploadMsg_error: string;
}

export interface AngularFileUploaderConfig {
  uploadAPI: { url: string; method?: string; headers?: { [id: string]: string }; };

  theme?: string;
  id?: number;
  hideProgressBar?: boolean;
  hideResetBtn?: boolean;
  hideSelectBtn?: boolean;
  maxSize?: number;
  formatsAllowed?: string;
  multiple?: boolean;
  oneFilePerRequest?: boolean;
  replaceTexts?: ReplaceTexts;
}

export interface UploadInfo {
  xhr: XMLHttpRequest;
  formData: FormData;
  indexes: number[];
}
