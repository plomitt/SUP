import { checkIfUserSignedIn } from './additional.js';

export function router(href) {
  const context = this;
  const array = href.split('/')
  const destination = array[array.length - 1].split('?')[0];
  const pages = ['', 'signin', 'signup', 'authorization', 'userpreferences', 'work']
  const protectedPages = ['userpreferences'];

  return new Promise((resolve, reject) => {
    checkIfUserSignedIn()
    .then(isSignedIn => {
      if (isSignedIn === 'error') {
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
            if (context.state.authorized === true) {
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
          window.location.href = '/work'
        } else if (isSignedIn === false && destination !== 'signin' && destination !== 'signup') {
          window.location.href = '/signin'
        } else if (isSignedIn === false && (destination === 'signin' || destination === 'signup')) {
          resolve({
            page: destination
          })
        }
      }
    })
  })
}