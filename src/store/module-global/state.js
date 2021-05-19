export default function () {
  return {
    user: {
      isSignedIn: false,
      lastSignedInState: 'Not signed in',
      id: '',
      firstName: '',
      lastName: '',
      name: '',
      email: '',
      upn: '',
      chatUserId: '',
      photoUrl: 'images/person_48.png',
      identityId: ''
    },
    bot: {
      name: 'ForBetter',
      avatarUrl: 'images/logo_48.png'
    }
  };
}
