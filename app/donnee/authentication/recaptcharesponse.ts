export interface ReCaptchaResponse {
  success: boolean; 
  status_code: number,
  error_codes?: Array<string>;
}