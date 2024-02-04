export const handleSignIn = async (googleSignIn: () => void): Promise<void> => {
  try {
    await googleSignIn();
    localStorage.removeItem('guest');
  } catch (error) {
    console.error('Error in handleSignIn:', error);
    throw error;
  }
};

export const handleLogOut = (logOut: () => void): void => {
  localStorage.removeItem('user');
  logOut();
};
