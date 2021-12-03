// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
logoUri: '../../../../../login/assets/images/pinkerton_logo.png';
loaderUri: '../../../../../login/assets/images/pageloader-white.gif';

logoUri: './assets/images/';
// const apiUrl = 'http://localhost:8000/'
const apiUrl = 'https://func-riskportalapi-dev-01.azurewebsites.net/'
const webUrl = 'http://localhost:4200'
const securekey = '?code=$ecureKeyDevPinkerton1'
const pipeDriveApiUrl = 'https://func-riskportalmiddleware-dev-01.azurewebsites.net/api/'


export const environment = {
	production: false,
	mapbox: {
		accessToken: 'pk.eyJ1IjoicGlua2VydG9uYWRtaW4iLCJhIjoiY2tzcWNiNHQxMGFhbTJwcWhzYzJnOG0zNSJ9.bSVwbRPS2DUv-FQfKbm2sg'
	},
	apiUrl,
	webUrl,
	securekey,
	userInfo: `${apiUrl}user/user-info/${securekey}`, // Angular end point.
	register: `${apiUrl}user/create/${securekey}`,
	userAcceptTAndC: `${apiUrl}user/accept-tos/${securekey}`, // Angular end point.   https://func-riskportalapi-dev-01.azurewebsites.net/user/accept-tos/
	updateProfile: `${apiUrl}user/update-profile/${securekey}`,
	changePassword: `${apiUrl}user/update-password/${securekey}`,
	getinContact: `${apiUrl}mail/get-in-contact/${securekey}`,
	addReportToCart: `${apiUrl}user/cart/add-report/${securekey}`,
	addSampleReport: `${apiUrl}report/add-sample/${securekey}`,
	getCartData: `${apiUrl}user/cart/get-or-create/${securekey}`,
	getOrderSummary: `${apiUrl}report/order-summary/`,
	getReportCreditBalance: `${apiUrl}report/credit-balance/${securekey}`,
	getReportCreditPurchaseHistory: `${apiUrl}report/credit-purchase-history/${securekey}`,
	deleteReportsfromCart: `${apiUrl}user/cart/delete-reports/${securekey}`,
	updateCredits: `${apiUrl}user/cart/update-credits/${securekey}`,
	getCountryList: `${apiUrl}report/country/${securekey}`,
	getMyReports: `${apiUrl}report/list/${securekey}`,
	genrateMultipassUrl: `${apiUrl}user/multipass-url/${securekey}`,
	getrateReport: `${apiUrl}report/generate/`,
	logoutUrl: `${webUrl}/auth/logout`, // web endpoint logout redirection.
	emailConfirmUrl: `${apiUrl}user/confirm-email/${securekey}`,
	sendConfermationEmail : `${apiUrl}user/send-confirmation-email/${securekey}`,
	notificationListUrl: `${apiUrl}user/notifications/${securekey}`,
	getLocationList: `${apiUrl}report/sample-list/${securekey}`,
	getPurchaceHistory: `${apiUrl}/report/purchase-history/${securekey}`,
	updateCreditByOne: `${apiUrl}report/create/${securekey}`,
	addNewPipedriveLead: `${pipeDriveApiUrl}/CreatePipedriveLead/${securekey}&clientId=development`,
	postLoginRedirectUri: {
		landingMain: `${webUrl}/main`,
		landingHome: `${webUrl}`,
		termscondition: `${webUrl}/main/terms-condition`,
	},
	shopify: {
		domain: 'pinkerton-dev.myshopify.com',
		storefrontAccessToken: 'ab25155f548da4769e7661bcf9e0d6dd'
	}
};
export const mockUpSecurityKey = '$ecureKeyCiberPinkerton1';

export const services = {
	authenticate: 'Authenticate',
	LogLoginDetails: 'LogLoginDetails',
	LogLogOutDetails: 'LogLogOutDetails',
	GetUserInfo: 'GetUsersDetail',
};

export const refreshTokenCheckInterval = 4; // In Minutes

export const idleTimeOut = 720 * 60000; // 12 hours

export const userOfflineTimeOut = 10; // In hours
export const isHub = false;

export const b2cPolicies = {
	names: {
		SignIn: 'B2C_1_Signin_version2',
		SMSSignIn: 'B2C_1_MFA_by_Phone_SMS',
		EmailSignIn: 'B2C_1_MFA_by_Email',
		resetPassword: 'B2C_1_PasswordReset_Version2',
	},
	scopes: {
		b2cScopes: ['https://pinkertonecommerceb2ctest.onmicrosoft.com/api/demo.read'],  // ['https://pinkertonb2ctest.onmicrosoft.com/api/demo.read'],
	},
	authorities: {
		SignIn: {
			authority: 'https://pinkertonecommerceb2ctest.b2clogin.com/pinkertonecommerceb2ctest.onmicrosoft.com/B2C_1_Signin_version2',
		},// need to check
		resetPassword: {
			authority: 'https://pinkertonecommerceb2ctest.b2clogin.com/pinkertonecommerceb2ctest.onmicrosoft.com/B2C_1_PasswordReset_Version2',
		},
		EmailSignIn: {
			authority: 'https://pinkertonecommerceb2ctest.b2clogin.com/pinkertonecommerceb2ctest.onmicrosoft.com/B2C_1_MFA_by_Email',
		},
		SMSSignIn: {
			authority: 'https://pinkertonecommerceb2ctest.b2clogin.com/pinkertonecommerceb2ctest.onmicrosoft.com/B2C_1_MFA_by_Phone_SMS',
		},
	},
};


export const msalConfig = {
	apiUrl,
	webUrl,
	redirectUri: `${webUrl}/auth/msal`,
	client: {
		auth: {
			clientId: '3e6e75a1-c4be-4a3f-bb09-9c25ed3074a9',//'7e958321-c67e-483d-8ea5-2e995deefb50',
			authority: b2cPolicies.authorities.SignIn.authority,
			redirectUri: `${webUrl}/auth/msal`,
			postLogoutRedirectUri: `${webUrl}/home`,
			navigateToLoginRequestUrl: false,
			validateAuthority: false,
		},
		cache: {
			cacheLocation: 'localStorage' as 'localStorage',
		},
	},
};
