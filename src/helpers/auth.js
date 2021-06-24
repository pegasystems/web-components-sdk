import { UserManager, Log } from 'oidc-client';
import { constellationInit, constellationTerm } from './c11nboot.js';
import { SdkConfigAccess } from '../helpers/config_access';



let userManager = null;
let userIsSignedIn = false;
let authTokenExpired = false;

/**
 * Initialize the oidc-client library and get back a single instance userManager
 */
const initUserManager = () => {

    // Get authConfig block from the SDK Config
    const authConfig = SdkConfigAccess.getSdkConfigAuth();

    if(!userManager) {

        const userManagerConfig = {
            client_id: authConfig.portalClientId,
            response_type: 'code',
            authority: authConfig.authorizationUri.split("/v1/")[0] + "/v1/",
            loadUserInfo: false,
            metadata: {
                authorization_endpoint: authConfig.authorizationUri,
                token_endpoint: authConfig.accessTokenUri
            },
            redirect_uri: `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}/auth.html`,
            popup_redirect_uri: `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}/auth.html`,
            extraQueryParams: authConfig.authQueryParams
        };
        // In case a clientSecret was specified pass it along (even though not recommended for web clients)
        if( authConfig.clientSecret ) {
            userManagerConfig.client_secret = authConfig.clientSecret;
        }
        
        // Enable extensive logging within oidc-client
        // Log.logger = console;
        // Log.level = Log.DEBUG;
    
        userManager = new UserManager(userManagerConfig);
        // TO DO: Make sure these events are firing properly
        // (Setting userIsSignedIn to values within the authLogin and authLogout for now)
        if( userManager ) {
            // This one is working but the other two not firing yet
            userManager.events.addAccessTokenExpiring( () => {
                authTokenExpired = true;
            })
            userManager.events.addUserSignedIn( () => {
                userIsSignedIn = true; authTokenExpired = false;
            } );
            userManager.events.addUserSignedOut( () => {
                userIsSignedIn = false; authTokenExpired = false;
            } );
        }
    }
    return userManager;
};

/**
 * Clean up any web storage allocated for the user session.
 */
const clearUserManager = () => {
    if(userManager) {
        // Remove any local storage for the user
        userManager.getUser().then(
            (user) => {
                if( user ) {
                    userManager.removeUser(user);
                    userIsSignedIn = false;
                }
            }
        );
        // Not removing the userManager structure itself...as it can be leveraged on next login
    }
};

export const authPostLogin = () => {
    userManager.getUser().then( user => {
        // load constellation bootstrap
        constellationInit(`${user.access_token}`);
    });
}

/**
 * Do any login related activities
 */
export const authLogin = (fnLoggedInCB=null) => {
    if( authIsMainRedirect() ) {
        userManager.signinRedirect()
    } else {
        userManager.signinPopup().then( (user) => {
            userIsSignedIn = true;
            // load constellation bootstrap
            constellationInit(`${user.access_token}`);
            if( fnLoggedInCB ) {
                fnLoggedInCB();
            }
        }
        ).catch(
        (e) => {console.log(e);}
        )
    }
};



/**
 * Do any logout related activities
 */
export const authLogout = () => {
    userIsSignedIn = false;
    constellationTerm();
    clearUserManager();
};

export const authIsSignedIn = () => {
    return userIsSignedIn;
}

export const authRedirectCallback = ( href, fnLoggedInCB=null ) => {

    userManager.signinRedirectCallback(href).then( user => {

        userIsSignedIn = true;

        const startingComponent = window.sessionStorage.getItem("startingComponent");
        let path = "";

        // map the starting component to the associated router path (set in top-level index.ts)
        switch(startingComponent) {
            case "simple-portal-component":
                path = "simpleportal";
                break;

            case "full-portal-component":
                path = "portal";
                break;

            case "mashup-portal-component":
                path = "embedded";
                break;

            default:
                path = "";
                break;
        }
        
        // Redirect to index.html (and as part of load will auto load bootstrap)
        location.href = `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}/${path}`;
        /*        
        // load constellation bootstrap
        constellationInit(`${user.access_token}`);
        if( fnLoggedInCB ) {
            fnLoggedInCB();
        }
        */
    }).catch( e => {
        console.log(e);
    })
}

export const authPopupCallback = ( href ) => {
    userManager.signinPopupCallback(href);
}

export const authIsMainRedirect = () => {

    // Even with main redirect, we want to use it only for the first login (so it doesn't wipe out any state or the reload)
    return !authTokenExpired;
}


export const authMashupLogin = () => {
    // Get authConfig block from the SDK Config
    const authConfig = SdkConfigAccess.getSdkConfigAuth();

    let urlSearchParams = new URLSearchParams();
    urlSearchParams.set("client_id", authConfig.mashupClientId);
    if( authConfig.mashupClientSecret ) {
        urlSearchParams.set("client_secret", authConfig.mashupClientSecret);
    }
    urlSearchParams.set("grant_type", "client_credentials");

    const response = fetch (authConfig.accessTokenUri ,
        {
            method: 'POST',
            headers: {
                //'Content-Type': 'application/json'
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            },
            body: urlSearchParams
        },
        )
        .then(response => response.json())
        .then(data => {

            userIsSignedIn = true;
            // load constellation bootstrap
            constellationInit(data.access_token);

        });

}


// Don't initialize the UserManager until the SdkConfigFile has been loaded and is ready
document.addEventListener("SdkConfigAccessReady", () => {

    // Now, initialize the UserManager (OIDC)...
    userManager = initUserManager();

    // ...  and start promise to get currently authenticated user
    userManager.getUser().then( user => {
        if( user && user.access_token ) {
            userIsSignedIn = true;
            authPostLogin();

        }
    });

    // Create and dispatch the UserManagerReady event
    var event = new CustomEvent("UserManagerReady", { });
    document.dispatchEvent(event);

});
