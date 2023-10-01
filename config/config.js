// const development_domain_server = "http://192.168.0.108:3030"
// const production_domain_telgani_b2b = 'https://api.dev.telgani.com/api'
const production_domain_telgani_b2b = 'https://api.uat.telgani.com/api'
const production_domain_dummy = 'https://tegani-dummy-api.onrender.com/api'

const development = {
	apiGateway: {
		API_URL_TELGANI: production_domain_telgani_b2b,
		API_URL_DUMMY: production_domain_dummy,


	},
	env: {
		EMAIL_SERVICE: "service_1c7687f",
		EMAIL_TEMPLATE: "b2b_form",
		EMAIL_PUBLIC_ID: "qkkIA_wXuURWIt-O0",
	}
}

const production = {
	apiGateway: {
		API_URL_TELGANI: production_domain_telgani_b2b,
		API_URL_DUMMY: production_domain_dummy,


	},
	env: {
		EMAIL_SERVICE: "service_1c7687f",
		EMAIL_TEMPLATE: "b2b_form",
		EMAIL_PUBLIC_ID: "qkkIA_wXuURWIt-O0",
	}
};

const config = process.env.NODE_ENV != "development" ? production : development;
export default config;