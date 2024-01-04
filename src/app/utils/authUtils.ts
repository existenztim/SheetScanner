export const handleSignIn = async (googleSignIn: () => void) => {
  try {
    await googleSignIn();
    localStorage.removeItem('guest');
  } catch (error) {
    console.log('error in handlesignin', error);
  }
};

export const handleLogOut = (logOut: () => void) => {
  localStorage.removeItem('user');
  logOut();
};
