import { tool } from 'ai';
import { z } from 'zod';

export const queryNYCTaxi = tool({
  description: 'Query information about NYC Taxi Rides dataset through Infactory\'s Unified Endpoint API',
  parameters: z.object({
    query: z.string().describe('The natural language query about NYC Taxi data'),
  }),
  execute: async ({ query }) => {
    console.log('🚀 Starting NYC Taxi query execution:', { query });

    const INFACTORY_API_KEY = process.env.INFACTORY_API_KEY;
    const INTEGRATION_ID = process.env.INFACTORY_INTEGRATION_ID || '9e7e9931-37e7-46eb-aad5-eec0dcbdd90a'; // Default or from env

    // Debug environment variables (safely)
    console.log('📝 Environment check:', { 
      hasApiKey: !!INFACTORY_API_KEY,
      hasIntegrationId: !!INTEGRATION_ID,
      apiKeyLength: INFACTORY_API_KEY?.length ?? 0
    });

    if (!INFACTORY_API_KEY) {
      console.error('❌ Missing configuration:', {
        hasApiKey: !!INFACTORY_API_KEY,
      });
      return {
        error: 'Infactory API configuration is missing. Please check INFACTORY_API_KEY.',
      };
    }

    try {
      const requestBody = {
        messages: [
          {
            role: "user",
            content: query
          }
        ],
        model: "infactory-v1"
      };

      const apiUrl = `https://api.infactory.ai/v1/integrations/chat/${INTEGRATION_ID}/chat/completions`;
      
      console.log('📤 Sending request to Infactory:', {
        endpoint: apiUrl,
        requestBody: { ...requestBody }
      });

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${INFACTORY_API_KEY}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      console.log('📥 Received response:', { 
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error('❌ API Error:', {
          status: response.status,
          statusText: response.statusText,
          body: errorBody,
          requestUrl: apiUrl,
          requestHeaders: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        throw new Error(`API request failed with status ${response.status}: ${errorBody}`);
      }

      const data = await response.json();
      console.log('✅ Parsed response data from Infactory API:', {
        responseStructure: Object.keys(data),
        rawData: data
      });

      // Extract the response from the chat completion format
      const answer = data.choices?.[0]?.message?.content;
      
      if (!answer) {
        console.error('❌ Invalid response structure:', data);
        throw new Error('Unexpected response structure from Infactory API');
      }

      return {
        answer,
        metadata: {
          model: data.model,
          created: data.created,
          usage: data.usage
        },
        source: 'NYC Taxi Dataset via Infactory Chat API'
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('❌ Error in queryNYCTaxi:', {
        error,
        errorMessage,
        errorStack: error instanceof Error ? error.stack : undefined
      });
      return {
        error: `Failed to query NYC Taxi data: ${errorMessage}`,
        details: error instanceof Error ? error.stack : undefined
      };
    }
  },
}); 