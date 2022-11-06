// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = '4w7u5g6nj0'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map. For example:
  // domain: 'dev-nd9990-p4.us.auth0.com',
  domain: 'dev-qknmxv57.us.auth0.com',            // Auth0 domain
  clientId: 'ZPg2c55V1w8HOHQ36kyPReO6CPVx16Zy',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
