import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class TelekomLlmApi implements ICredentialType {
	name = 'telekomLlmApi';

	displayName = 'Telekom LLM API';

	documentationUrl = 'https://docs.llmhub.t-systems.net/Model%20Serving/openai';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'Your T-Systems LLM Hub API key',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://llm-server.llmhub.t-systems.net/v2',
			url: '/models',
		},
	};
}
