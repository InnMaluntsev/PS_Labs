"use client";

import { useMemo } from 'react';
import InteractiveQuiz from './InteractiveQuiz';
import ApiBuilderComponent from './ApiBuilderComponent';

interface MarkdownRendererProps {
  content: string;
  onApiValidationComplete?: (isComplete: boolean) => void;
  onDeploymentTrainingComplete?: (isComplete: boolean) => void;
}

// Updated Quiz questions for Step 2 - General Network Link v2 Knowledge
// Updated Quiz questions for Step 2 - All explanations consolidated and elaborated
const STEP2_GENERAL_QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "What is the main difference between Fireblocks Network and Network Link v2?",
    options: [
      { letter: 'A', text: 'Fireblocks Network is for retail users, Network Link v2 is for institutions' },
      { letter: 'B', text: 'Fireblocks Network is a peer-to-peer liquidity network, while Network Link v2 is an API connectivity solution' },
      { letter: 'C', text: 'They are the same feature with different names' },
      { letter: 'D', text: 'Network Link v2 replaces Fireblocks Network entirely' }
    ],
    correctAnswer: 'B',
    explanation: 'Fireblocks Network is a peer-to-peer institutional liquidity and transfer network of 1,500+ members that enables direct connections between financial institutions for trading and settlements. Network Link v2, on the other hand, is an API integration solution that allows third-party exchanges and financial services to connect their platforms to the broader Fireblocks ecosystem through standardized REST APIs. While the Network facilitates direct member-to-member interactions, Network Link v2 enables platform integration and extends Fireblocks capabilities to external services.',
    learnMoreUrl: 'https://support.fireblocks.io/hc/en-us/articles/6107038882460-About-the-Fireblocks-Network?intheader=0',
    learnMoreText: 'Learn more about the Fireblocks Network'
  },
  {
    id: 2,
    question: "Internal onboarding of Exchange vs Fiat provider.",
    options: [
      { letter: 'A', text: 'Same onboarding as there is no differentiation between them in the console' },
      { letter: 'B', text: 'Same onboarding, although they are registered in the backend differently' },
      { letter: 'C', text: 'Different onboarding, one is done by the NL team and the other by the payments team' },
      { letter: 'D', text: 'Different onboarding, same Jira, but onboarding requirements are totally different' }
    ],
    correctAnswer: 'B',
    explanation: 'Exchange and Fiat providers have the same onboarding process from the user perspective, but they are registered differently in the backend system. While the onboarding steps and user experience appear identical in the console, the backend handles the registration and configuration of these provider types differently to support their distinct operational requirements and capabilities.'
  },
  {
    id: 3,
    question: "If an exchange wants to support ONLY asset conversion, what capabilities are required to implement?",
    options: [
      { letter: 'A', text: 'Mandatory capabilities + Trading' },
      { letter: 'B', text: 'Mandatory Capabilities + Transfers + Transfer blockchains + Liquidity' },
      { letter: 'C', text: 'Mandatory Capabilities + Liquidity' },
      { letter: 'D', text: 'Mandatory Capabilities + Internal Transfers + Liquidity' }
    ],
    correctAnswer: 'C',
    explanation: 'For asset conversion only, exchanges need the mandatory capabilities (accounts and balances) plus the liquidity capability. The mandatory capabilities provide the foundation - accounts to identify users and their account structure, and balances to show current holdings. The liquidity capability specifically enables asset conversion by connecting to Fireblocks\' extensive network of liquidity providers. Trading capabilities are for order book trading, transfers are for moving assets between accounts or externally, but liquidity is specifically designed for converting one asset type to another through automated market making and liquidity pools.'
  },
  {
    id: 4,
    question: "If a FIAT provider would like to allow ONLY moving of USD fiat across all clients\' accounts, what capabilities do they need to implement?",
    options: [
      { letter: 'A', text: 'Mandatory Capabilities + Transfer + TransferFiat' },
      { letter: 'B', text: 'Mandatory Capabilities + TransferFiat + Internal transfers' },
      { letter: 'C', text: 'Mandatory Capabilities + Internal Transfers' },
      { letter: 'D', text: 'Mandatory Capabilities + Transfer + PeerTransfers' }
    ],
    correctAnswer: 'C',
    explanation: 'For moving USD fiat across clients\' accounts within the same provider, only mandatory capabilities plus internal transfers are needed. Since all accounts belong to clients of the same fiat provider, this is considered internal movement within the provider\'s ecosystem. The mandatory capabilities (accounts and balances) handle user identification and balance tracking, while internal transfers specifically manage movements between accounts under the same provider\'s control. External transfer capabilities like transferFiat or peerTransfers are unnecessary since the funds never leave the provider\'s system - they just move between different client accounts managed by the same provider.'
  },
  {
    id: 5,
    question: "What should a provider include in the supported assets API endpoint?",
    options: [
      { letter: 'A', text: 'Native assets, Tokens, and Bucket assets' },
      { letter: 'B', text: 'Native assets, Tokens, Fiat, and bucket assets' },
      { letter: 'C', text: 'Tokens and Bucket assets' },
      { letter: 'D', text: 'Native assets only' }
    ],
    correctAnswer: 'C',
    explanation: 'The /capabilities/assets endpoint should only return additional assets beyond what Fireblocks already knows - specifically tokens and bucket assets. Native cryptocurrencies (like BTC, ETH) and national currencies (like USD, EUR) are predefined in Fireblocks and don\'t need to be declared. However, tokens (like ERC-20, BEP-20, or custom tokens) and bucket assets (which aggregate multiple assets into one balance entry) are provider-specific and must be declared. This endpoint tells Fireblocks "here are the extra assets we support that aren\'t in your standard list," enabling proper balance tracking and operations for these custom assets.'
  },
  {
    id: 6,
    question: "How are new sub-accounts linked to the main account for the first time?",
    options: [
      { letter: 'A', text: 'The user will generate a separate API key/Secret and link the sub-account via the console' },
      { letter: 'B', text: 'The user will need to re-add the main account for the sub-accounts to be linked' },
      { letter: 'C', text: 'After logging in to the console, the user will receive a notification on their mobile to approve the new sub-account' },
      { letter: 'D', text: 'The user must disconnect the main account, reconnect, and approve all notifications on the mobile device for account addition' }
    ],
    correctAnswer: 'C',
    explanation: 'When new sub-accounts are detected by the Network Link integration, the user receives push notifications on their registered mobile device that must be approved to establish the account hierarchy. This mobile approval process is a critical security feature ensuring only authorized users can link sub-accounts to their main account structure. The system automatically detects when the provider\'s API returns new account structures, then prompts the user for mobile approval to confirm they want these accounts linked. This prevents unauthorized account linking and maintains the integrity of the user\'s account hierarchy within the Fireblocks ecosystem.'
  },
  {
    id: 7,
    question: "Some of the key endpoints required for internal transfers between accounts include:",
    options: [
      { letter: 'A', text: 'Only GET /accounts and POST /transfers' },
      { letter: 'B', text: 'GET /accounts, GET /accounts/{accountId}/balances, and POST /accounts/{accountId}/transfers' },
      { letter: 'C', text: 'Only POST /accounts/{accountId}/transfers' },
      { letter: 'D', text: 'GET /capabilities and POST /transfers only' }
    ],
    correctAnswer: 'B',
    explanation: 'Internal transfers require a coordinated set of endpoints working together. GET /accounts lists all available accounts so users can select source and destination accounts. GET /accounts/{accountId}/balances checks available funds before initiating transfers to prevent overdrafts and show users their available balance. POST /accounts/{accountId}/transfers actually executes the transfer with the transfersInternal capability. Additional endpoints may include transfer status checking, transfer history, and validation endpoints. This multi-endpoint approach ensures proper user experience, prevents errors, and maintains accurate balance tracking throughout the transfer process.'
  },
  {
    id: 8,
    question: "Which capability component is mandatory for ALL Network Link v2 implementations?",
    options: [
      { letter: 'A', text: 'transfers and trading' },
      { letter: 'B', text: 'accounts and balances' },
      { letter: 'C', text: 'ramps and liquidity' },
      { letter: 'D', text: 'collateral and trading' }
    ],
    correctAnswer: 'B',
    explanation: 'The accounts and balances components are mandatory for every Network Link v2 implementation because they provide the fundamental foundation for all operations. Accounts capability enables Fireblocks to discover user account structures, understand account hierarchies, and identify which accounts belong to which users. Balances capability allows Fireblocks to display current holdings, track available funds, and show users their portfolio across different assets. Without these mandatory components, no other capabilities can function properly since there would be no way to identify users, track their assets, or perform any balance-related operations. All other capabilities are optional and depend on specific use cases.'
  },
  {
    id: 9,
    question: "What is the primary purpose of the GET /capabilities endpoint?",
    options: [
      { letter: 'A', text: 'To authenticate API requests' },
      { letter: 'B', text: 'To discover which features and accounts support specific operations' },
      { letter: 'C', text: 'To get a list of all available cryptocurrencies' },
      { letter: 'D', text: 'To check the server status' }
    ],
    correctAnswer: 'B',
    explanation: 'The capabilities endpoint serves as the discovery mechanism for Fireblocks to understand what features each provider supports and which accounts can perform specific operations. It returns a map where capability names are keys and account lists are values. This allows Fireblocks to dynamically adapt its interface and only show users features that are actually supported by their connected provider. For example, if only certain accounts support trading, Fireblocks will only show trading options for those specific accounts. This dynamic discovery prevents user frustration from attempting unsupported operations and enables a customized experience based on each provider\'s actual capabilities.'
  },
  {
    id: 10,
    question: "In Network Link v2, what does the transfersBlockchain capability enable?",
    options: [
      { letter: 'A', text: 'Internal transfers between accounts on the same exchange' },
      { letter: 'B', text: 'Transfers to external blockchain addresses' },
      { letter: 'C', text: 'Fiat currency transfers only' },
      { letter: 'D', text: 'Trading operations between different assets' }
    ],
    correctAnswer: 'B',
    explanation: 'The transfersBlockchain capability specifically enables withdrawals to external blockchain addresses, allowing users to send cryptocurrency from their provider account to external wallets, other exchanges, or any valid blockchain address. This is different from internal transfers (which move funds between accounts within the same provider) or peer transfers (which move funds between different Fireblocks Network members). Blockchain transfers require additional security considerations like address validation, network fee calculations, confirmation monitoring, and compliance checks since the funds are leaving the provider\'s custody and moving to external addresses on public blockchains.'
  },
  {
    id: 11,
    question: "What information must be included in every asset definition returned by GET /capabilities/assets?",
    options: [
      { letter: 'A', text: 'Only id and symbol' },
      { letter: 'B', text: 'id, name, symbol, type, decimalPlaces, and contractAddress' },
      { letter: 'C', text: 'Only contractAddress and blockchain' },
      { letter: 'D', text: 'name, symbol, and price' }
    ],
    correctAnswer: 'B',
    explanation: 'Every asset definition requires comprehensive information for proper handling. The id uniquely identifies the asset, name provides human-readable identification, symbol gives the trading symbol, type specifies the asset category (like Erc20Token), and decimalPlaces determines precision for balance calculations and display. For token types like ERC-20, contractAddress is essential for blockchain interactions and verification. Additional fields may include blockchain specification, issuer information for certain token types, and descriptions. This complete information ensures Fireblocks can properly display balances, execute transactions, validate addresses, and handle the asset correctly across all operations while maintaining precision and preventing errors.'
  },
  {
    id: 12,
    question: "What does the transfersPeerAccounts capability enable?",
    options: [
      { letter: 'A', text: 'Transfers to public blockchain addresses' },
      { letter: 'B', text: 'Internal transfers within the same provider' },
      { letter: 'C', text: 'Transfers between accounts that belong to different providers or different API keys' },
      { letter: 'D', text: 'Fiat currency transfers only' }
    ],
    correctAnswer: 'C',
    explanation: 'PeerAccounts transfers enable moving assets between accounts managed by different providers or different API keys within the Fireblocks ecosystem. This facilitates institutional-to-institutional transfers, enabling one exchange\'s users to send funds directly to another exchange\'s users, or allowing transfers between different business entities that each have their own API integration. These transfers happen within Fireblocks\' secure network without requiring public blockchain transactions, providing faster settlement, lower fees, and enhanced security compared to traditional blockchain transfers while maintaining full audit trails and compliance reporting.'
  },
  {
    id: 13,
    question: "What is the main benefit of implementing the trading capability in Network Link v2?",
    options: [
      { letter: 'A', text: 'It enables cryptocurrency mining' },
      { letter: 'B', text: 'It allows users to access Fireblocks trading features through the provider\'s platform' },
      { letter: 'C', text: 'It provides market data feeds' },
      { letter: 'D', text: 'It enables staking rewards' }
    ],
    correctAnswer: 'B',
    explanation: 'The trading capability enables providers to offer Fireblocks\' advanced trading features directly through their own platform interface, creating a seamless user experience. Users can access professional trading tools, liquidity pools, institutional-grade order execution, and advanced order types without leaving their provider\'s platform. This integration provides access to Fireblocks\' deep liquidity network, smart order routing, and institutional trading infrastructure while maintaining the provider\'s branded experience. The capability includes order management, execution reporting, trade settlement, and portfolio management features that would otherwise require users to switch between platforms.'
  },
  {
    id: 14,
    question: "In the account hierarchy, what does the parentId field indicate?",
    options: [
      { letter: 'A', text: 'The account creation timestamp' },
      { letter: 'B', text: 'The main account that this sub-account belongs to' },
      { letter: 'C', text: 'The account balance limit' },
      { letter: 'D', text: 'The account owner identification' }
    ],
    correctAnswer: 'B',
    explanation: 'The parentId field establishes hierarchical relationships between accounts, indicating which main account serves as the parent for any given sub-account. This hierarchy is crucial for organizational structure, permissions management, reporting, and compliance. Main accounts typically represent primary business entities or individual users, while sub-accounts serve specific purposes like trading, custody, or different asset types. The parentId enables proper account aggregation, roll-up reporting, consolidated balance views, and ensures sub-account operations align with parent account permissions and settings. Without proper hierarchy, account management becomes chaotic and compliance reporting becomes nearly impossible.'
  },
  {
    id: 15,
    question: "What does the liquidity capability enable customers to do?",
    options: [
      { letter: 'A', text: 'Stake cryptocurrencies for rewards' },
      { letter: 'B', text: 'Convert between different assets using Fireblocks liquidity providers' },
      { letter: 'C', text: 'Lend assets to other users' },
      { letter: 'D', text: 'Mine new cryptocurrencies' }
    ],
    correctAnswer: 'B',
    explanation: 'The liquidity capability connects users to Fireblocks\' extensive network of institutional liquidity providers, enabling seamless asset conversion between different cryptocurrencies, tokens, and supported assets. This provides access to competitive exchange rates, deep liquidity pools, and professional market making services. Users can convert assets instantly without needing to manage multiple exchange relationships or worry about slippage on large orders. The capability includes quote generation, price discovery, execution management, and settlement handling, making asset conversion as simple as a single API call while ensuring best execution and transparent pricing through Fireblocks\' institutional-grade liquidity infrastructure.'
  },
  {
    id: 16,
    question: "Which status values are valid for account objects?",
    options: [
      { letter: 'A', text: 'online, offline, maintenance' },
      { letter: 'B', text: 'active, suspended, closed' },
      { letter: 'C', text: 'enabled, disabled, pending' },
      { letter: 'D', text: 'verified, unverified, restricted' }
    ],
    correctAnswer: 'B',
    explanation: 'Account status must be one of three specific values that indicate operational state. "Active" means the account is fully operational and can perform all supported operations including transfers, trading, and balance inquiries. "Suspended" indicates the account is temporarily disabled, typically due to compliance reviews, security concerns, or administrative actions, but can potentially be reactivated. "Closed" means the account is permanently deactivated and cannot be used for any operations. These standardized status values ensure consistent account state management across all Network Link v2 integrations and enable Fireblocks to properly handle account restrictions and operational limitations.'
  },
  {
    id: 17,
    question: "What is the purpose of the ramps capability in Network Link v2?",
    options: [
      { letter: 'A', text: 'To enable leverage trading' },
      { letter: 'B', text: 'To provide fiat on/off ramp services for buying and selling cryptocurrencies' },
      { letter: 'C', text: 'To create new cryptocurrency tokens' },
      { letter: 'D', text: 'To enable automated trading bots' }
    ],
    correctAnswer: 'B',
    explanation: 'The ramps capability provides comprehensive fiat on/off ramp services, enabling users to buy cryptocurrencies with fiat currency (on-ramp) or sell cryptocurrencies for fiat currency (off-ramp). This includes integration with banking systems, payment processors, compliance checks, KYC/AML verification, and regulatory reporting. The capability handles the complex process of converting between traditional financial systems and cryptocurrency networks, including bank transfers, credit card processing, wire transfers, and various payment methods. This bridges the gap between traditional finance and cryptocurrency, making it easy for users to enter and exit the crypto ecosystem while maintaining full compliance with financial regulations.'
  }
];

// Quiz questions for Step 3 - Authentication & Signature
const STEP3_AUTH_QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "What four components make up the prehash string for signature generation?",
    options: [
      { letter: 'A', text: 'API-KEY + SECRET + timestamp + nonce' },
      { letter: 'B', text: 'timestamp + nonce + method + endpoint + body' },
      { letter: 'C', text: 'method + endpoint + signature + timestamp' },
      { letter: 'D', text: 'API-KEY + method + body + nonce' }
    ],
    correctAnswer: 'B',
    explanation: 'The prehash string is: timestamp + nonce + method + endpoint + body. This ensures the signature covers all critical parts of the request.'
  },
  {
    id: 2,
    question: "Which authentication schemes are supported by Network Link v2?",
    options: [
      { letter: 'A', text: 'Only HMAC with SHA256' },
      { letter: 'B', text: 'HMAC, RSA, and ECDSA' },
      { letter: 'C', text: 'OAuth 2.0 and JWT' },
      { letter: 'D', text: 'Basic Authentication only' }
    ],
    correctAnswer: 'B',
    explanation: 'Network Link v2 supports HMAC, RSA, and ECDSA authentication schemes. Each can be configured with different hash functions and encoding options.'
  },
  {
    id: 3,
    question: "For HMAC signatures, which hash functions are configurable?",
    options: [
      { letter: 'A', text: 'Only SHA256' },
      { letter: 'B', text: 'SHA512, SHA3_256, SHA256' },
      { letter: 'C', text: 'MD5, SHA1, SHA256' },
      { letter: 'D', text: 'Only SHA512' }
    ],
    correctAnswer: 'B',
    explanation: 'HMAC supports SHA512, SHA3_256, and SHA256 hash functions. The choice depends on your security requirements and performance needs.'
  },
  {
    id: 4,
    question: "What happens to expired requests?",
    options: [
      { letter: 'A', text: 'They are processed normally' },
      { letter: 'B', text: 'They are queued for later processing' },
      { letter: 'C', text: 'They are rejected by the third party' },
      { letter: 'D', text: 'They are automatically refreshed' }
    ],
    correctAnswer: 'C',
    explanation: 'Expired requests are rejected by the third party. The timestamp difference must be less than a reasonable threshold (recommended by the 3rd party) to prevent replay attacks.'
  },
  {
    id: 5,
    question: "How should servers handle idempotency key reuse with different request data?",
    options: [
      { letter: 'A', text: 'Process the request normally and ignore the duplicate key' },
      { letter: 'B', text: 'Return HTTP 400 with errorType: "idempotency-key-reuse"' },
      { letter: 'C', text: 'Return HTTP 409 conflict and retry automatically' },
      { letter: 'D', text: 'Queue the request for manual review' }
    ],
    correctAnswer: 'B',
    explanation: 'When encountering an idempotency key reuse with different request data, servers should respond with HTTP 400 and a JSON object containing errorType: "idempotency-key-reuse".'
  },
  {
    id: 6,
    question: "What happens when pagination parameters 'startingAfter' and 'endingBefore' are both provided?",
    options: [
      { letter: 'A', text: 'The server uses startingAfter and ignores endingBefore' },
      { letter: 'B', text: 'The server returns HTTP 400 with an invalid-query-parameters error' },
      { letter: 'C', text: 'The server returns results between the two specified items' },
      { letter: 'D', text: 'The server uses endingBefore and ignores startingAfter' }
    ],
    correctAnswer: 'B',
    explanation: 'endingBefore and startingAfter are mutually exclusive. If both are provided, the server should respond with HTTP 400 and errorType: "invalid-query-parameters".'
  }
];

export default function MarkdownRenderer({ 
  content, 
  onApiValidationComplete, 
  onDeploymentTrainingComplete 
}: MarkdownRendererProps) {
  const processedData = useMemo(() => {
    // Check for component placeholders
    const hasApiBuilderPlaceholder = content.includes('[API_BUILDER_COMPONENT]');
    const hasDeploymentSimulatorPlaceholder = content.includes('[DEPLOYMENT_SIMULATOR_COMPONENT]');
    const hasQuizPlaceholder = content.includes('<!--QUIZ_PLACEHOLDER-->');
    
    if (hasApiBuilderPlaceholder) {
      return { 
        content, 
        questions: [], 
        hasApiBuilder: true,
        hasDeploymentSimulator: false
      };
    }
    
    if (hasDeploymentSimulatorPlaceholder) {
      return { 
        content, 
        questions: [], 
        hasApiBuilder: false,
        hasDeploymentSimulator: true
      };
    }
    
    if (hasQuizPlaceholder) {
      // Determine which quiz based on content
      if (content.includes('General Knowledge Quiz') || content.includes('Network Link v2 Fundamentals')) {
        return { 
          content, 
          questions: STEP2_GENERAL_QUIZ_QUESTIONS,
          hasApiBuilder: false,
          hasDeploymentSimulator: false
        };
      } else {
        // Default to authentication quiz for step 3
        return { 
          content, 
          questions: STEP3_AUTH_QUIZ_QUESTIONS,
          hasApiBuilder: false,
          hasDeploymentSimulator: false
        };
      }
    }
    
    return { 
      content, 
      questions: [], 
      hasApiBuilder: false,
      hasDeploymentSimulator: false
    };
  }, [content]);

  const processedContent = useMemo(() => {
    let html = processedData.content;
    
    // First, extract and preserve code blocks
    const codeBlocks: string[] = [];
    html = html.replace(/```([\s\S]*?)```/g, (match, code) => {
      const index = codeBlocks.length;
      codeBlocks.push(code);
      return `__CODE_BLOCK_${index}__`;
    });
    
    // Convert markdown to HTML properly
    html = html
      // Headers (process in order from largest to smallest)
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold mb-3 mt-6 text-gray-900">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mb-4 mt-8 text-gray-900">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mb-6 mt-8 text-gray-900">$1</h1>')
      
      // Bold text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
      
      // Italic text  
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      
      // Inline code
      .replace(/`([^`]+)`/g, '<code class="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono">$1</code>')
      
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 underline hover:text-blue-800" target="_blank" rel="noopener noreferrer">$1</a>')
      
      // Process lists properly - identify list blocks first
      .replace(/^((?:[\s]*[-\*\+][\s]+.+\n?)+)/gm, (match) => {
        // Convert individual list items within the block
        const listItems = match.replace(/^[\s]*[-\*\+][\s]+(.+)$/gm, '<li class="text-gray-700">$1</li>');
        return `<ul class="list-disc list-inside ml-4 mb-4">${listItems}</ul>`;
      })
      
      // Line breaks - handle double newlines as paragraph breaks (but not within lists)
      .replace(/(?<!<\/li>)\n\s*\n(?!<li>)/g, '</p><p class="mb-4 text-gray-700">')
      
      // Single line breaks as br tags (but not within lists)
      .replace(/(?<!<\/li>)\n(?!<li>|<ul>|<\/ul>)/g, '<br/>')
      
      // Wrap remaining text in paragraphs (excluding already processed content)
      .replace(/^(?!<[hul]|<\/[hul])(.*?)(?=<|$)/gm, '<p class="mb-4 text-gray-700">$1</p>')
      
      // Clean up empty paragraphs
      .replace(/<p[^>]*><\/p>/g, '')
      .replace(/<p[^>]*>\s*<\/p>/g, '')
      .replace(/<p[^>]*><br\/><\/p>/g, '')
      
      // Clean up paragraph tags around headers and lists
      .replace(/<p[^>]*>(<h[1-6][^>]*>)/g, '$1')
      .replace(/(<\/h[1-6]>)<\/p>/g, '$1')
      .replace(/<p[^>]*>(<ul[^>]*>)/g, '$1')
      .replace(/(<\/ul>)<\/p>/g, '$1')
      
      // Remove any br tags within list items
      .replace(/(<li[^>]*>[^<]*)<br\/>/g, '$1')
      .replace(/<br\/>(<\/li>)/g, '$1')
      
      // Emojis and special formatting
      .replace(/🔗/g, '<span class="text-blue-500">🔗</span>')
      .replace(/🛡️/g, '<span class="text-green-500">🛡️</span>')
      .replace(/🏦/g, '<span class="text-blue-600">🏦</span>')
      .replace(/📈/g, '<span class="text-green-600">📈</span>')
      .replace(/🧠/g, '<span class="text-purple-500">🧠</span>')
      .replace(/🚀/g, '<span class="text-red-500">🚀</span>')
      .replace(/🎯/g, '<span class="text-blue-600">🎯</span>')
      .replace(/✅/g, '<span class="text-green-600">✅</span>')
      .replace(/💡/g, '<span class="text-yellow-500">💡</span>')
      .replace(/📚/g, '<span class="text-blue-500">📚</span>')
      .replace(/🔧/g, '<span class="text-gray-600">🔧</span>')
      .replace(/📋/g, '<span class="text-blue-500">📋</span>')
      .replace(/💼/g, '<span class="text-gray-700">💼</span>')
      .replace(/📊/g, '<span class="text-green-500">📊</span>')
      .replace(/📞/g, '<span class="text-blue-500">📞</span>');

    // Finally, restore code blocks with proper formatting
    html = html.replace(/__CODE_BLOCK_(\d+)__/g, (match, index) => {
      const code = codeBlocks[parseInt(index)];
      return `<pre class="bg-gray-900 text-white p-4 rounded-lg overflow-x-auto mb-4 font-mono text-sm"><code>${code}</code></pre>`;
    });

    return html;
  }, [processedData]);

  // Handle API Builder placeholder
  if (processedData.hasApiBuilder) {
    const contentParts = processedContent.split('[API_BUILDER_COMPONENT]');
    
    return (
      <div className="prose prose-lg max-w-none">
        {/* Content before API builder */}
        {contentParts[0] && (
          <div dangerouslySetInnerHTML={{ __html: contentParts[0] }} />
        )}
        
        {/* API Builder component */}
        <div className="my-8">
          <ApiBuilderComponent onValidationComplete={onApiValidationComplete} />
        </div>
        
        {/* Content after API builder */}
        {contentParts[1] && (
          <div dangerouslySetInnerHTML={{ __html: contentParts[1] }} />
        )}
      </div>
    );
  }

  // Handle Deployment Simulator placeholder
  if (processedData.hasDeploymentSimulator) {
    const contentParts = processedContent.split('[DEPLOYMENT_SIMULATOR_COMPONENT]');
    
    return (
      <div className="prose prose-lg max-w-none">
        {/* Content before deployment simulator */}
        {contentParts[0] && (
          <div dangerouslySetInnerHTML={{ __html: contentParts[0] }} />
        )}
        
        {/* Content after deployment simulator */}
        {contentParts[1] && (
          <div dangerouslySetInnerHTML={{ __html: contentParts[1] }} />
        )}
      </div>
    );
  }

  // Handle quiz placeholder (existing logic)
  const contentParts = processedContent.split('<!--QUIZ_PLACEHOLDER-->');

  return (
    <div className="prose prose-lg max-w-none">
      {/* Content before quiz */}
      {contentParts[0] && (
        <div dangerouslySetInnerHTML={{ __html: contentParts[0] }} />
      )}
      
      {/* Quiz section */}
      {processedData.questions.length > 0 && (
        <div className="my-8">
          <h3 className="text-xl font-semibold mb-6">Knowledge Check</h3>
          <InteractiveQuiz questions={processedData.questions} />
        </div>
      )}
      
      {/* Content after quiz */}
      {contentParts[1] && (
        <div dangerouslySetInnerHTML={{ __html: contentParts[1] }} />
      )}
    </div>
  );
}