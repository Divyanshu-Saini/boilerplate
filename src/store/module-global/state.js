export default function() {
  return {
    user: {
      isSignedIn: true,
      lastSignedInState: 'Not signed in',
      id: '',
      firstName: '',
      lastName: '',
      name: 'Not signed in',
      email: '',
      upn: '',
      chatUserId: '',
      photoUrl: '/images/person_48.png'
    },
    bot: { name: 'For Better Virtual Assistant', avatarUrl: '/images/logo_48.png' }
  };
}
