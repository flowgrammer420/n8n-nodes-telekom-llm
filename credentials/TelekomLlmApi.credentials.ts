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
        {
            displayName: 'Base URL',
            name: 'baseUrl',
            type: 'string',
            default: 'https://llm-server.llmhub.t-systems.net/v2',
            placeholder: 'https://llm-server.llmhub.t-systems.net/v2',
            required: true,
            description: 'Usually ends with /v2 – change only if you use a staging/custom endpoint',
        },
    ];

    // Saubere Header-Auth (empfohlen von n8n)
    authenticate: IAuthenticateGeneric = {
        type: 'generic',
        properties: {
            headers: {
                Authorization: '=Bearer {{$credentials.apiKey}}',
            },
        },
    };

    // Testet die Verbindung durch Abruf der verfügbaren Models
    test: ICredentialTestRequest = {
        request: {
            baseURL: '={{$credentials.baseUrl}}',
            url: '/models',
            method: 'GET',
        },
    };
}
