"use client";

import React, { useState, useEffect } from 'react';
import { FiCheckCircle, FiXCircle, FiAlertCircle, FiPlay, FiCode, FiTerminal, FiCheck } from 'react-icons/fi';

interface ApiBuilderComponentProps {
  onValidationComplete?: (isComplete: boolean) => void;
}

const ApiBuilderComponent: React.FC<ApiBuilderComponentProps> = ({ onValidationComplete }) => {
  const [selectedEndpoint, setSelectedEndpoint] = useState('/capabilities');
  const [userResponse, setUserResponse] = useState('');
  const [validationResults, setValidationResults] = useState<Record<string, any>>({});
  const [isValidating, setIsValidating] = useState(false);

  const endpoints = [
    {
      method: 'GET',
      path: '/capabilities',
      description: 'Get server capabilities and supported features',
      status: 'pending'
    },
    {
      method: 'GET', 
      path: '/capabilities/assets',
      description: 'Get list of supported additional assets',
      status: 'pending'
    },
    {
      method: 'GET',
      path: '/accounts',
      description: 'Get list of sub-accounts',
      status: 'pending'
    },
    {
      method: 'GET',
      path: '/accounts/{accountId}/balances',
      description: 'Get current balances for a specific account',
      status: 'pending'
    }
  ];

  const exampleResponses: Record<string, string> = {
    '/capabilities': `{
  "version": "1.0.37",
  "components": {
    "accounts": "*",
    "balances": "*",
    "transfers": "*",
    "trading": ["account-1", "account-2"]
  }
}`,
    '/capabilities/assets': `{
  "assets": [
    {
      "id": "360de0ad-9ba1-45d5-8074-22453f193d65",
      "type": "Erc20Token",
      "blockchain": "Ethereum",
      "contractAddress": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      "name": "USDC",
      "symbol": "USDC",
      "description": "USDC stablecoin on Ethereum",
      "decimalPlaces": 6
    }
  ]
}`,
    '/accounts': `{
  "accounts": [
    {
      "id": "account-1",
      "title": "Main Trading Account",
      "description": "Primary account for trading operations",
      "status": "active"
    },
    {
      "id": "account-2", 
      "title": "Custody Account",
      "status": "active",
      "parentId": "account-1"
    }
  ]
}`,
    '/accounts/{accountId}/balances': `{
  "balances": [
    {
      "id": "balance-1",
      "asset": {
        "nationalCurrencyCode": "USD"
      },
      "availableAmount": "1743.43",
      "lockedAmount": "0"
    },
    {
      "id": "balance-2",
      "asset": {
        "cryptocurrencySymbol": "BTC",
        "blockchain": "Bitcoin"
      },
      "availableAmount": "7.00008214",
      "lockedAmount": "0"
    }
  ]
}`
  };

  // Validation functions
  const validateResponse = async (endpoint: string, responseText: string) => {
    setIsValidating(true);
    
    try {
      const parsedResponse = JSON.parse(responseText);
      const errors: string[] = [];
      const warnings: string[] = [];

      switch (endpoint) {
        case '/capabilities':
          validateCapabilities(parsedResponse, errors, warnings);
          break;
        case '/capabilities/assets':
          validateAssets(parsedResponse, errors, warnings);
          break;
        case '/accounts':
          validateAccounts(parsedResponse, errors, warnings);
          break;
        case '/accounts/{accountId}/balances':
          validateBalances(parsedResponse, errors, warnings);
          break;
      }

      const result = {
        isValid: errors.length === 0,
        errors,
        warnings,
        parsedResponse,
        endpoint
      };

      setValidationResults(prev => ({
        ...prev,
        [endpoint]: result
      }));

      return result;

    } catch (error: any) {
      const result = {
        isValid: false,
        errors: [`JSON Parse Error: ${error.message}`],
        warnings: [],
        parsedResponse: null,
        endpoint
      };

      setValidationResults(prev => ({
        ...prev,
        [endpoint]: result
      }));

      return result;
    } finally {
      setIsValidating(false);
    }
  };

  const validateCapabilities = (response: any, errors: string[], warnings: string[]) => {
    if (!response.version) {
      errors.push('Missing required field: version');
    } else if (!/^\d+\.\d+\.\d+$/.test(response.version)) {
      warnings.push('Version should follow semantic versioning (e.g., "1.0.37")');
    }

    if (!response.components) {
      errors.push('Missing required field: components');
      return;
    }

    if (!response.components.accounts) {
      errors.push('Capabilities must always include "accounts" component');
    }
    if (!response.components.balances) {
      errors.push('Capabilities must always include "balances" component');
    }

    Object.entries(response.components).forEach(([key, value]) => {
      if (value !== '*' && !Array.isArray(value)) {
        errors.push(`Component "${key}" must be either "*" or an array of account IDs`);
      }
    });
  };

  const validateAssets = (response: any, errors: string[], warnings: string[]) => {
    if (!response.assets) {
      errors.push('Missing required field: assets');
      return;
    }

    if (!Array.isArray(response.assets)) {
      errors.push('Field "assets" must be an array');
      return;
    }

    response.assets.forEach((asset: any, index: number) => {
      if (!asset.id) errors.push(`Asset ${index}: Missing required "id" field`);
      if (!asset.type) errors.push(`Asset ${index}: Missing required "type" field`);
      if (!asset.name) errors.push(`Asset ${index}: Missing required "name" field`);
      if (!asset.symbol) errors.push(`Asset ${index}: Missing required "symbol" field`);
      if (typeof asset.decimalPlaces !== 'number') {
        errors.push(`Asset ${index}: "decimalPlaces" must be a number`);
      }
      
      if (asset.type === 'Erc20Token' && !asset.contractAddress) {
        errors.push(`Asset ${index}: ERC-20 tokens require "contractAddress" field`);
      }
    });
  };

  const validateAccounts = (response: any, errors: string[], warnings: string[]) => {
    if (!response.accounts) {
      errors.push('Missing required field: accounts');
      return;
    }

    if (!Array.isArray(response.accounts)) {
      errors.push('Field "accounts" must be an array');
      return;
    }

    response.accounts.forEach((account: any, index: number) => {
      if (!account.id) errors.push(`Account ${index}: Missing required "id" field`);
      if (!account.title) errors.push(`Account ${index}: Missing required "title" field`);
      if (!account.status) errors.push(`Account ${index}: Missing required "status" field`);
      
      if (account.status && !['active', 'suspended', 'closed'].includes(account.status)) {
        errors.push(`Account ${index}: Status must be "active", "suspended", or "closed"`);
      }
    });
  };

  const validateBalances = (response: any, errors: string[], warnings: string[]) => {
    if (!response.balances) {
      errors.push('Missing required field: balances');
      return;
    }

    if (!Array.isArray(response.balances)) {
      errors.push('Field "balances" must be an array');
      return;
    }

    response.balances.forEach((balance: any, index: number) => {
      if (!balance.id) errors.push(`Balance ${index}: Missing required "id" field`);
      if (!balance.asset) errors.push(`Balance ${index}: Missing required "asset" field`);
      if (!balance.availableAmount) errors.push(`Balance ${index}: Missing required "availableAmount" field`);
      
      if (balance.availableAmount && !/^\d+(\.\d+)?$/.test(balance.availableAmount)) {
        errors.push(`Balance ${index}: "availableAmount" must be a positive number string`);
      }
      
      if (balance.asset) {
        const hasNationalCurrency = !!balance.asset.nationalCurrencyCode;
        const hasCryptocurrency = !!balance.asset.cryptocurrencySymbol;
        const hasAssetId = !!balance.asset.assetId;
        
        const referenceCount = [hasNationalCurrency, hasCryptocurrency, hasAssetId].filter(Boolean).length;
        
        if (referenceCount !== 1) {
          errors.push(`Balance ${index}: Asset must have exactly one of nationalCurrencyCode, cryptocurrencySymbol, or assetId`);
        }
      }
    });
  };

  const loadExample = () => {
    setUserResponse(exampleResponses[selectedEndpoint] || '');
  };

  const handleValidate = async () => {
    const result = await validateResponse(selectedEndpoint, userResponse);
    
    // Check if all endpoints are validated
    const allEndpoints = endpoints.map(e => e.path);
    const validatedEndpoints = Object.keys(validationResults).filter(
      endpoint => validationResults[endpoint]?.isValid
    );
    
    if (result.isValid) {
      validatedEndpoints.push(selectedEndpoint);
    }
    
    const uniqueValidated = [...new Set(validatedEndpoints)];
    const allValidated = allEndpoints.every(endpoint => uniqueValidated.includes(endpoint));
    
    // Notify parent component about completion status
    if (onValidationComplete) {
      onValidationComplete(allValidated);
    }
  };

  const getEndpointStatus = (endpoint: string) => {
    const result = validationResults[endpoint];
    if (!result) return 'pending';
    return result.isValid ? 'valid' : 'invalid';
  };

  const allEndpointsValid = endpoints.every(endpoint => 
    getEndpointStatus(endpoint.path) === 'valid'
  );

  return (
    <div className="space-y-6 my-6">
      {/* Progress Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900">API Validation Progress</h3>
          <span className="text-sm text-gray-600">
            {endpoints.filter(e => getEndpointStatus(e.path) === 'valid').length} / {endpoints.length} Complete
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {endpoints.map((endpoint) => {
            const status = getEndpointStatus(endpoint.path);
            return (
              <div
                key={endpoint.path}
                className={`flex items-center gap-2 p-2 rounded text-sm ${
                  status === 'valid' 
                    ? 'bg-green-100 text-green-800' 
                    : status === 'invalid'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {status === 'valid' ? (
                  <FiCheckCircle className="w-4 h-4" />
                ) : status === 'invalid' ? (
                  <FiXCircle className="w-4 h-4" />
                ) : (
                  <div className="w-4 h-4 border-2 border-gray-400 rounded-full" />
                )}
                <span className="font-mono text-xs">{endpoint.path}</span>
              </div>
            );
          })}
        </div>
        {allEndpointsValid && (
          <div className="mt-3 p-3 bg-green-100 border border-green-200 rounded flex items-center gap-2">
            <FiCheck className="w-5 h-5 text-green-600" />
            <span className="text-green-800 font-medium">All endpoints validated! You can proceed to Step 4.</span>
          </div>
        )}
      </div>

      {/* Endpoint Selection */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Select Endpoint to Build</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {endpoints.map((endpoint) => {
            const status = getEndpointStatus(endpoint.path);
            return (
              <button
                key={endpoint.path}
                onClick={() => setSelectedEndpoint(endpoint.path)}
                className={`text-left p-4 rounded-lg border-2 transition-all ${
                  selectedEndpoint === endpoint.path
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-mono">
                      {endpoint.method}
                    </span>
                    {status === 'valid' && <FiCheckCircle className="w-4 h-4 text-green-600" />}
                    {status === 'invalid' && <FiXCircle className="w-4 h-4 text-red-600" />}
                  </div>
                </div>
                <div className="font-mono text-sm text-blue-600 mb-1">{endpoint.path}</div>
                <p className="text-gray-600 text-sm">{endpoint.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Response Builder */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Build Response for {selectedEndpoint}</h3>
          <button
            onClick={loadExample}
            className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
          >
            <FiCode className="w-4 h-4" />
            Load Example
          </button>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            JSON Response
          </label>
          <textarea
            value={userResponse}
            onChange={(e) => setUserResponse(e.target.value)}
            placeholder="Enter your JSON response here..."
            className="w-full h-64 p-3 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          />
        </div>

        <button
          onClick={handleValidate}
          disabled={isValidating || !userResponse.trim()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          <FiPlay className="w-4 h-4" />
          {isValidating ? 'Validating...' : 'Validate Response'}
        </button>
      </div>

      {/* Validation Results */}
      {validationResults[selectedEndpoint] && (
        <div className="space-y-4">
          <div className={`flex items-center gap-2 p-4 rounded-lg ${
            validationResults[selectedEndpoint].isValid 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {validationResults[selectedEndpoint].isValid ? (
              <FiCheckCircle className="w-5 h-5" />
            ) : (
              <FiXCircle className="w-5 h-5" />
            )}
            <span className="font-semibold">
              {validationResults[selectedEndpoint].isValid ? 'Response Valid!' : 'Validation Failed'}
            </span>
          </div>

          {validationResults[selectedEndpoint].errors.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-red-800 flex items-center gap-2">
                <FiXCircle className="w-4 h-4" />
                Errors ({validationResults[selectedEndpoint].errors.length})
              </h4>
              <ul className="space-y-1">
                {validationResults[selectedEndpoint].errors.map((error: string, index: number) => (
                  <li key={index} className="text-red-700 bg-red-50 p-3 rounded text-sm border border-red-200">
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {validationResults[selectedEndpoint].warnings.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-yellow-800 flex items-center gap-2">
                <FiAlertCircle className="w-4 h-4" />
                Warnings ({validationResults[selectedEndpoint].warnings.length})
              </h4>
              <ul className="space-y-1">
                {validationResults[selectedEndpoint].warnings.map((warning: string, index: number) => (
                  <li key={index} className="text-yellow-700 bg-yellow-50 p-3 rounded text-sm border border-yellow-200">
                    {warning}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Guidelines */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-semibold text-yellow-800 mb-2">💡 Implementation Guidelines</h4>
        <ul className="text-yellow-700 space-y-1 text-sm">
          <li>• All amount fields should be strings representing positive numbers</li>
          <li>• Asset references must have exactly one of: nationalCurrencyCode, cryptocurrencySymbol, or assetId</li>
          <li>• The capabilities endpoint must always include "accounts" and "balances" components</li>
          <li>• Account status must be "active", "suspended", or "closed"</li>
          <li>• Use proper decimal places: USD (2), BTC (8), USDC (6)</li>
        </ul>
      </div>
    </div>
  );
};

export default ApiBuilderComponent;