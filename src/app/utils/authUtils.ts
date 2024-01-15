/**
 * Handles the sign-in process using Google Sign-In.
 * @param {Function} googleSignIn - The function to initiate Google Sign-In.
 * @returns {Promise<void>} - Resolves when the sign-in process is successful.
 * @throws {Error} - If an error occurs during the sign-in process.
 */
export const handleSignIn = async (googleSignIn: () => void): Promise<void> => {
  try {
    await googleSignIn();
    localStorage.removeItem('guest');
  } catch (error) {
    console.error('Error in handleSignIn:', error);
    throw error;
  }
};

/**
 * Handles the log-out process.
 * @param {Function} logOut - The function to initiate the log-out process.
 * @returns {void}
 */
export const handleLogOut = (logOut: () => void): void => {
  localStorage.removeItem('user');
  logOut();
};
