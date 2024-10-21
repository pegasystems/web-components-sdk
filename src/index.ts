import '@lion/ui/define/lion-button.js';
import '@lion/ui/define/lion-textarea.js';

import './samples/FullPortal/FullPortal';
import './samples/SimplePortal/SimplePortal';
import './samples/Embedded';

import { Router } from '@vaadin/router';

const outlet = document.getElementById('outlet');
const router = new Router(outlet);

router.setRoutes([
  // External routes on top
  {
    path: '/auth.html',
    action: ctx => {
      window.location.pathname = ctx.pathname;
    }
  },
  { path: '/', component: 'embedded-component' },
  { path: '/index.html', component: 'embedded-component' },
  { path: '/embedded', component: 'embedded-component' },
  { path: '/embedded.html', component: 'embedded-component' },
  { path: '/portal', component: 'full-portal-component' },
  { path: '/portal.html', component: 'full-portal-component' },
  { path: '/fullportal', component: 'full-portal-component' },
  { path: '/fullportal.html', component: 'full-portal-component' },
  { path: '/simpleportal', component: 'simple-portal-component' },
  { path: '/simpleportal.html', component: 'simple-portal-component' }
]);
