export enum FormResponseTexts {
  SUCCESS = 'Success! Your note has been saved!',
  SIGNIN = 'Sign in if you want to use this feature.',
  ERROR = 'Something went wrong, please try again.',
  WRONG_INPUT = 'Your note must have a title with atleast 3 characters long!',
  WRONG_FILE_FORMAT = 'Wrong file format uploaded!',
  WRONG_FILE_SIZE = 'File size exceeds the allowed limit (3000kb)',
}

export enum FormResponseTypes {
  SUCCESS = 'success',
  ERROR = 'error',
  INFORMATION = 'information',
}
