import './components/hello-world/hello-world';
import '@lion/ui/define/lion-button.js';
import '@lion/ui/define/lion-textarea.js';
import './samples/FullPortal/FullPortal';
import './samples/SimplePortal/SimplePortal';
import './samples/Mashup/MashupPortal';
import { Navigation } from '@virtualstate/navigation';

const outlet: HTMLElement | null = document.getElementById('outlet');

function shouldNotIntercept(event) {
  return !event.canIntercept || event.hashChange || event.downloadRequest || event.formData;
}

const navigation = new Navigation();

navigation.addEventListener('navigate', event => {
  // Exit early if this navigation shouldn't be intercepted,
  // e.g. if the navigation is cross-origin, or a download request
  if (shouldNotIntercept(event)) {
    return;
  }

  const url = new URL(event.destination.url);

  if (url.pathname == '/' || url.pathname.startsWith('/embedded')) {
    event.intercept({
      async handler() {
        const element = document.createElement('mashup-portal-component');

        if (outlet) {
          outlet.innerHTML = '';
          outlet.appendChild(element);
        }
      }
    });
  }
  if (url.pathname.startsWith('/portal')) {
    event.intercept({
      async handler() {
        const element = document.createElement('full-portal-component');

        if (outlet) {
          outlet.innerHTML = '';
          outlet.appendChild(element);
        }
      }
    });
  }
});

const currentEntryURL: string | undefined = window.navigation?.currentEntry?.url ?? undefined;
let currentEntryPathname = '/';
if (currentEntryURL && currentEntryURL?.indexOf('code') > 0) {
  currentEntryPathname = currentEntryURL;
} else {
  currentEntryPathname = currentEntryURL ? new URL(currentEntryURL).pathname : '/';
}

navigation.navigate(currentEntryPathname);
// import { Router } from '@vaadin/router';
//
// const outlet = document.getElementById('outlet');
// const router = new Router(outlet);
//
// router.setRoutes([
//   // External routes on top
//   {
//     path: '/auth.html',
//     action: ctx => {
//       window.location.pathname = ctx.pathname;
//     }
//   },
//   { path: '/', component: 'mashup-portal-component' },
//   { path: '/index.html', component: 'mashup-portal-component' },
//   { path: '/embedded', component: 'mashup-portal-component' },
//   { path: '/embedded.html', component: 'mashup-portal-component' },
//   { path: '/portal', component: 'full-portal-component' },
//   { path: '/portal.html', component: 'full-portal-component' },
//   { path: '/fullportal', component: 'full-portal-component' },
//   { path: '/fullportal.html', component: 'full-portal-component' },
//   { path: '/simpleportal', component: 'simple-portal-component' },
//   { path: '/simpleportal.html', component: 'simple-portal-component' }
// ]);
