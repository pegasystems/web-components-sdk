import './components/hello-world/hello-world';
import '@lion/button/define';
import '@lion/textarea/define';
import './samples/FullPortal/FullPortal';
import './samples/SimplePortal/SimplePortal';
import './samples/Mashup/MashupPortal';

import {Router} from '@vaadin/router';

const outlet = document.getElementById("outlet");
const router = new Router(outlet);

// Don't process the routes until the UserManager has been initialized
//  and is ready
document.addEventListener("AuthManagerReady", () => {

    router.setRoutes([

        // External routes on top
        {path: '/auth.html',
            action: (ctx, commands) => {
                window.location.pathname = ctx.pathname;
            }
        },
        {path: '/', component: 'mashup-portal-component'},
        {path: '/embedded', component: 'mashup-portal-component'},
        {path: '/mashup', component: 'mashup-portal-component'},
        {path: '/portal', component: 'full-portal-component'},
        {path: '/fullportal', component: 'full-portal-component'},
        {path: '/simpleportal', component: 'simple-portal-component'},
        
    ]);
});
