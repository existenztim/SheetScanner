export enum FormResponseTexts {
  SUCCESS_NOTE = 'Your note has been successfully saved!',
  SUCCESS_SETTINGS = 'Your settings has been succesfully updated!',
  SIGNIN = 'Sign in if you want to use this feature.',
  SIGNIN_FAILURE = 'Could not sign in user, please try again.',
  ERROR = 'Something went wrong, please try again.',
  ERROR_SHEET = 'The sheet you try to access could not be found.',
  WRONG_INPUT = 'The note must include a title with a minimum length of 3 characters!',
  WRONG_FILE_FORMAT = 'Wrong file format uploaded!',
  WRONG_FILE_SIZE = 'File size exceeds the allowed limit (3000kb)',
}

export enum FormResponseTypes {
  SUCCESS = 'success',
  ERROR = 'error',
  INFORMATION = 'information',
}
