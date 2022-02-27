import { checkIfUserSignedIn, signOut } from './additional.js';

export function router(href, history) {
  const d1 = href.replace('//', '');
  const d2 = d1.match(/(\/(\w+))/g);

  const destination = d2 === null ? '' : d2[0].replaceAll('/', '');
  const pages = ['', 'signin', 'signup', 'authorization', 'userpreferences', 'work']
  const protectedPages = ['userpreferences'];

  
  return new Promise((resolve, reject) => {
    checkIfUserSignedIn()
    .then(isSignedIn => {
      if (isSignedIn === false) {
        signOut();
      }

      if (isSignedIn.status === 'error') {
        signOut();
        resolve({
          page: 'error',
          error: '500'
        })
      } else {
        if (destination === '') {
          resolve({
            page: 'landing'
          })
        } else if (!pages.includes(destination)) {
          resolve({
            page: 'error',
            error: '404'
          })
        } else if (isSignedIn === true && destination !== 'signin' && destination !== 'signup') {
          if (protectedPages.includes(destination) === true) {
            const isAuthorized = localStorage.getItem('authorized');
            if (isAuthorized === 'true') {
              resolve({
                page: destination
              })
            } else {
              resolve({
                page: 'authorization',
                destination: destination
              })
            }
          } else {
            resolve({
              page: destination
            })
          }
        } else if (isSignedIn === true && (destination === 'signin' || destination === 'signup')) {
          history.push('/work');
        } else if (isSignedIn === false && destination !== 'signin' && destination !== 'signup') {
          history.push('/signin');
        } else if (isSignedIn === false && (destination === 'signin' || destination === 'signup')) {
          resolve({
            page: destination
          })
        }
      }
    })
  })
}