<p align="center"><img width=60% src="docs/media/WebCompSDK-Logo.png">

# Web Components SDK

The **Web Components SDK** provides Pega customers with the ability to build DX components that connect Pega’s ConstellationJS Engine APIs with a design system other than Pega Cosmos.

The Web Components SDK differs from out-of-the-box Cosmos React because it provides and demonstrates the use of a design system that is not the Pega **Cosmos React** design system. The alternative design system used in this Web Components SDK is based on 
[Lion web components](https://lion-web.netlify.app/) - open-source components that are designed to be extended and allow for flexible integrations. These are, in turn, built with [LitElement](https://lit-element.polymer-project.org/guide) 
and [lit-html](https://lit-html.polymer-project.org/guide).

The Web Components SDK is built on a new and modernized UI technology stack (the Constellation JavaScript Engine and Constellation JavaScript API).  Many additional SDK features are planned for 2022 to expand the scope of supported use cases.

<br>

# Prerequisites

## Pega Infinity Server and Constellation-enabled Application 

This **8.6 version** of the Web Components SDK assumes that you have access to a Pega Infinity server (**8.6.0+ GA**) running an application that is configured to run using the Constellation UI service.

The **MediaCo** sample application is already configured as a Constellation application and can be found in the Web Components SDK download associated with this repo which is available at [https://community.pega.com/marketplace/components/web-components-sdk](https://community.pega.com/marketplace/components/web-components-sdk). The OAuth 2.0 Client Registration records associated with the **MediaCo** application are available in the same Web Components SDK download.

The **Web Components SDK** has been tested with:
- node 14.18.*
- npm 6.14.*

Future updates to the SDK will support more recent LTS versions of node as Constellation supports them.

**Before** installing and running the SDK code, please refer to the **Web Components SDK Guide** provided in the Marketplace download for steps to prepare your Infinity server and node environment so you can proceed with the steps in the next section.

<br>

---
# Installing and Running the Application

### **Install** the Web Components SDK 

1. Install 

    ```
    $ cd <kit location>

    (This next step is strongly recommended if you have a node_modules directory installed from an earlier version of the kit)
    $ rm -rf node_modules

    $ npm install
    ```

### **Configure** the Web Components SDK

See the **Web Components SDK Guide** in the Marketplace download for more complete documentation about the configuration of the Web Components SDK via the **sdk-config.json** file.

2. Edit **sdk-config.json** and, if necessary, update the values that will be used
    * The **authConfig** section contains values for the information you obtained earlier from OAuth: the Client ID, endpoints, etc.
    The default **sdk-config.json** file is set up to use the **MediaCoOauth** and **MediaCoOauthNoLogin** records that are included with the Web Components SDK Marketplace download.
    <br><br>
      * **Note:** it is **required** that you configure a value for **authConfig.mashupClientSecret**. The **/embedded** use _**will not work**_ until the correct `mashupClientSecret` is provided.
      * Navigate to Records / Security / OAuth 2.0 Client Registration landing page and open the `MediaCoOauthNoLogin` record
      * Click the **Regenerate Client Secret** button, download the Client Credentials (as the ClientID and Secret values will be needed), and save the record.
      * Then, use the generated **Client Secret** value as the value for**authConfig.mashupClientSecret**. (The ClientID value should remain unchanged.)
      <br><br>
    * The **serverConfig** section contains values related to the Pega Infinity server and SDK Content Server.
<br><br>
3. Obtain the necessary Constellation files (ex: bootstrap-shell, lib_asset, constellation-core) that need to be installed to enable the SDK to connect to the Constellation UI Service. These files are available in the SDK download at https://community.pega.com/marketplace/components/web-components-sdk. Instructions for installing these files can be found in **constellation/__Install-constellation-files.md**



### **Run** the application

4. **Development build and start** (1 or 2 terminal windows)

    4.1 Full clean development and installation of npm modules, and build; then start the server
   ```
   $ npm run build:dev:ci
   $ npm run start-dev (or start-dev-https)
   ```
   or <br>

    4.2 Build and run with live reload (use 2 terminals - assumes npm install has already been run):
   ```
   $ npm run watch (with live reload) - in terminal 1
   $ npm run start-dev (or npm run start-dev-https) - in terminal 2
   ```
   or 

    4.3 Build and run without live reload (use 1 terminal - assumes npm install has already been run)
   ```
   $ npm run build:dev (without live reload)
   $ npm run start-dev (or npm run start-dev-https)
   ```

5. **Production build and start (1 terminal)**

    5.1 Full production clean and install of npm modules, and build; then start the server. (Building in production mode 
    generates gzip and Brotli compressed versions of the static content. Serving in production mode will serve the
    gzip or Brotli static content when available.)

   ```
   $ npm run build:prod:ci
   $ npm run start-prod (or start-prod-https)
   ```
   or <br>

    5.2 Build and start the server (assumes npm install has already been run)
   ```
   $ npm run build:prod
   $ npm run start-prod (or start-prod-https)
   ```

<br>

### **Access** the sample application from your browser

6. **Embedded** (formerly known as Mashup)

    6.1 Access **http://localhost:3501/embedded** or **https://localhost:3501/embedded** (if starting with HTTPS)

7.  **Portal**

    7.1 Access **http://localhost:3501/portal** or **https://localhost:3501/portal** (if starting with HTTPS)

    **If you see a blank page**, please check your JavaScript console to see if you have encountered a net::ERR_CERT_INVALID error. If you encounter this error, please see the troubleshooting section below: **Runtime Error: net::ERR_CERT_INVALID**. Due to browser interactions during login, it can be easier to find and fix this error using the Portal URL.

Note that the examples above are for the default configuration. If you change the configuration to use a different host and/or port, adapt these URLs to your host:port as necessary.

<br>

---

## Some setup and troubleshooting tips
<br>


> **NOTE**: These setup tips are abstracted from the Web Components SDK Guide that is available at https://community.pega.com/knowledgebase/documents/web-components-sdk-user-guide

<br>

### Verify/update Cross Origin Resource Sharing (CORS) Infinity record

The **APIHeadersAllowed** record on your Infinity server (found in Security | Cross Origin Resource Sharing) may need to be updated to allow the Web Components SDK calls to Pega REST APIs and DX APIs to interact with Infinity.

For the **APIHeadersAllowed** CORS record, please confirm of update the record as follows:

* **Allowed methods**
  * **All 5 methods** should be checked: 
  **GET, POST, PUT, PATCH, and DELETE**

* **Allowed headers**
  * The list of allowed request header should include the following: 
  **authorization, content-type, Access-Control-Expose-Headers, If-Match, pzCTKn, context, remotesystemid**

* Exposed headers
  * The list of allowed exposed headers should include the following:
  **etag, remotesystemid**

* **Save** the record - **APIHeadersAllowed** – after making any changes.

<br>

### Runtime Error: net::ERR_CERT_INVALID

Browsers are less tolerant of local, self-signed certificates or when no local, self-signed certificate exists. If you don’t have a trusted self-signed certificate and launch your application, you may see a blank screen accompanied by an error similar to this in your JS console:

POST https://localhost:1080/prweb/PRRestService/oauth2/v1/token **net::ERR_CERT_INVALID**

Typically, you can resolve this error by indicating to your browser that you are willing to trust the local certificate that’s being used. Here are a few links that we’ve found useful for solving this problem for various browsers:

* https://kinsta.com/knowledgebase/neterr-cert-authority-invalid/

* https://stackoverflow.com/questions/65816432/disable-any-cert-check-on-localhost-on-chrome

* In Chrome, Brave, or Edge, you can temporarily resolve this error by enabling the “Allow invalid certificates for resources loaded from localhost using this URL:
[chrome://flags/#allow-insecure-localhost](chrome://flags/#allow-insecure-localhost)




<br>

---

### Verify/update OAuth 2.0 Client Registration Infinity records

The MediaCo sample application (available to Pega licensed users) includes OAuth Client Registration records that it uses for authentication in your Infinity server (available in Security | OAuth 2.0 Client Registration): **MediaCoOauthNoLogin** (for the Embedded use case) and **MediaCoOauth** (for the Portal use case).

You may use these records. If you want to create your own OAuth 2.0 Client Registration record, please refer to the **How to create OAuth2 registration in Infinity** section found below.

* For the **Embedded** use case, you will use the OAuth 2.0 Client Registration record’s **Client ID** and **Client secret** as the values for **mashupClientId** and **mashupClientSecret** in the SDK’s **sdk-config.js** file.

* For the **Portal** use case, you will use the OAuth 2.0 Client Registration record’s **Client ID** as the value of **portalClientId** in the SDK’s **sdk-config.js** file.


To ensure that the application is redirected to the proper page after authentication succeeds, you may need to update the OAuth 2.0 Client Registration record’s **List of redirect URIs** shown in the record’s **Supported grant types** section.

The MediaCoOauth and MediaCoOauthNoLogin records that are included with the MediaCo sample application include the necessary redirect URIs for the default configuration:

* http://localhost:3501/auth.html and https://localhost:3501/auth.html for the Portal use case

*	http://localhost:3501/mashup/auth.html and https://localhost:3501/mashup/auth.html for the Embedded use case

If you configure your installation to have the Web Components SDK static content served from a different **host:port** than the default, you should add new Redirect URIs to the list:

* In the **Supported grant types** section add the following URLS to the list of redirect URLs by clicking on the + sign. (Note that the default port is 3501.)

  * http://\<**host name or IP address of Web Components SDK server**>:<**port you’re using**>/auth.html (for the portal use case)

  * https://\<**host name or IP address of Web Components SDK server**>:<**port you’re using**>/auth.html (for the portal use case)

  * http://\<**host name or IP address of Web Components SDK server**>:<**port you’re using**>/mashup/auth.html

  * https://\<**host name or IP address of Web Components SDK server**>:<**port you’re using**>/mashup/auth.html

  * Note that entries are needed for either **http** or **https** depending on how you access your Web Components SDK server

 * **Save** the record

<br>

---

### How to create an OAuth 2.0 Client Registration record in Infinity

If the `MediaCo` app was imported to your Infinity server, a `MediaCoOAuth` OAuth 2.0 Client Registration record will have been imported as well. That record's clientId is currently referenced within sdk-config.json.  However, you can create your own OAuth 2.0 Client Registration record using the following procedure:
   * Create a new "Security/OAuth 2.0 Client Registration" record for your app
   * You might name it the same name as your application
   * Specify "Public" for the type of client (as browser apps are not able to prevent any "Client secret" from being compromised)
   * Select "Authorization Code" for the Grant type
   * Add a RedirectURI value based on the URL used to access the deployed Web Components SDK (e.g., http://localhost:3501/auth.html)
   * Enable the "Enable proof code for pkce" option
   * Set the "Access token lifetime" for how long you want the logged-in session to last.  Pega does not presently support the ability to refresh the token (for Public clients), so the user will have to reauthenticate again after this interval.
   * Enter the appropriate values within **sdk-config.json** 

<br>

---

### Setting up a secure self-signed certificate for localhost


The following steps will enable setting up a secure self-signed certificate for localhost (adapted from the procedure outlined here: https://gist.github.com/pgilad/63ddb94e0691eebd502deee207ff62bd).  At the end of the process two files are expected within the root project directory: private.pem and private.key

Step 1: Create a private key 
   ```
   $ openssl genrsa -out private.key 4096
   ```


Step 2: Create a Certificate configuration text file named ssl.conf within the root project directory.   Use the following (or adjusted content to reflect your location and desired organization):
   ```
[ req ]
default_bits       = 4096
distinguished_name = req_distinguished_name
req_extensions     = req_ext

[ req_distinguished_name ]
countryName                 = US
countryName_default         = US
stateOrProvinceName         = Massachusetts
stateOrProvinceName_default = Massachusetts
localityName                = Westford
localityName_default        = Westford
organizationName            = Pegasystems
organizationName_default    = Pegasystems
organizationalUnitName      = DXIL
organizationalUnitName_default = DXIL
commonName                  = localhost
commonName_max              = 64
commonName_default          = localhost

[ req_ext ]
subjectAltName = @alt_names

[alt_names]
DNS.1   = localhost
   ```

Step 3: Create a Certificate Signing Request (will be prompted for a passphrase for new key)

   ```
   $ openssl req -new -sha256 -out private.csr -in private.key -config ssl.conf
   ```


Step 4: Generate the Certificate
   ```
   $ openssl x509 -req -days 3650 -in private.csr -signkey private.key -out private.crt -extensions req_ext -extfile ssl.conf
   ```

Step 5: Add the Certificate to the keychain and trust it (will be prompted for Mac system password)
   ```
   $ sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain private.crt
   ```

Step 6: Create a pem file from crt
   ```
   $ openssl x509 -in private.crt -out private.pem -outform PEM
   ```
Step 7: Run webpack server with arguments to use the keys (assumes private.pem and private.key are in root project directory).  May need to close prior open instances of browser (if previously accessed prior insecure localhost)

   ```
   $ npm run localhostsecure
   ```
<br>

---

   ## License

This project is licensed under the terms of the **Apache 2** license.

>You can see the full license [here](LICENSE) or directly on [apache.org](https://www.apache.org/licenses/LICENSE-2.0).

<br>

---

## Contributing

We welcome contributions to the Web Components SDK project.

Please refer to our [guidelines for contributors](./docs/CONTRIBUTING.md) if you are interested in helping. 

<br>


---
   
## Additional Resources

* __LitElement__: https://lit-element.polymer-project.org/guide
* __lit-html__: https://lit-html.polymer-project.org/guide
* __Lion Web Components GitHub__: https://github.com/ing-bank/lion
* __Lion Web Components Documentation Site__: https://lion-web.netlify.app/
