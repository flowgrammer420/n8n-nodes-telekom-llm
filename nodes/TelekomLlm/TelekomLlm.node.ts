import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

export class TelekomLlm implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Telekom LLM',
		name: 'telekomLlm',
		icon: 'file:telekom.svg',
		group: ['transform'],
		version: 1,
		description: 'Interact with T-Systems LLM Hub',
		defaults: {
			name: 'Telekom LLM',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'telekomLlmApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Model',
				name: 'model',
				type: 'options',
				default: 'llama-3.3-70B-Instruct',
				options: [
					{
						name: 'DeepSeek R1 Distill Llama 70B',
						value: 'DeepSeek-R1-Distill-Llama-70B',
					},
					{
						name: 'Llama 3.3 70B Instruct',
						value: 'llama-3.3-70B-Instruct',
					},
					{
						name: 'Qwen 2.5 Coder 7B Base',
						value: 'Qwen2.5-Coder-7B-Base',
					},
					{
						name: 'Claude 3.5 Sonnet',
						value: 'claude-3-5-sonnet',
					},
					{
						name: 'Gemini 2.5 Flash',
						value: 'gemini-2.5-flash',
					},
					{
						name: 'GPT-4.1',
						value: 'gpt-4.1',
					},
					{
						name: 'GPT-4.1 Mini',
						value: 'gpt-4.1-mini',
					},
					{
						name: 'O3',
						value: 'o3',
					},
					{
						name: 'O3 Mini',
						value: 'o3-mini',
					},
				],
				description: 'The model to use for chat completion',
			},
			{
				displayName: 'System Message',
				name: 'systemMessage',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				default: 'You are a helpful assistant.',
				description: 'The system message to set the context',
			},
			{
				displayName: 'User Message',
				name: 'userMessage',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				default: '',
				required: true,
				description: 'The user message to send',
			},
			{
				displayName: 'Temperature',
				name: 'temperature',
				type: 'number',
				typeOptions: {
					maxValue: 2,
					minValue: 0,
					numberPrecision: 1,
				},
				default: 0.7,
				description: 'Controls randomness. Lower values = more focused, higher values = more creative.',
			},
			{
				displayName: 'Max Tokens',
				name: 'maxTokens',
				type: 'number',
				default: 256,
				description: 'Maximum number of tokens to generate',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			const model = this.getNodeParameter('model', i) as string;
			const systemMessage = this.getNodeParameter('systemMessage', i) as string;
			const userMessage = this.getNodeParameter('userMessage', i) as string;
			const temperature = this.getNodeParameter('temperature', i) as number;
			const maxTokens = this.getNodeParameter('maxTokens', i) as number;

			const body = {
				model,
				messages: [
					{ role: 'system', content: systemMessage },
					{ role: 'user', content: userMessage },
				],
				temperature,
				max_tokens: maxTokens,
			};

			const response = await this.helpers.httpRequestWithAuthentication.call(
				this,
				'telekomLlmApi',
				{
					method: 'POST',
					url: 'https://llm-server.llmhub.t-systems.net/v2/chat/completions',
					body,
					json: true,
				},
			);

			returnData.push({
				json: response as any,
				pairedItem: i,
			});
		}

		return [returnData];
	}
}
