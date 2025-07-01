import {
  GeneralConfig,
  MainPageConfig,
  NavBarConfig,
  StepsPageConfig,
  LabConfig,
} from "./types";

const isDev = process.env.NODE_ENV === 'development';

export const generalConfig: GeneralConfig = {
  companyName: "Fireblocks",
  basePath: isDev ? "" : "/ps-labs", // Empty in development, /ps-labs in production
};


export const navBarConfig: NavBarConfig = {
  discordLink: "https://discord.gg/2gNdsPkq",
  navbarButtonText: "Login",
  navbarButtonLink: "https://sandbox.fireblocks.io",
  logoLink: "https://fireblocks.com"
};

export const mainPageConfig: MainPageConfig = {
  mainTitle: "Professional Services",
  subTitle: "Hands-On Labs",
  heroText:
    "Make sure that you have an active Fireblocks Sandbox Workspace.\nIf you don't - please click below to get a free one:",
  heroButtonText: "Sandbox Signup",
  heroButtonLink: "https://www.fireblocks.com/developer-sandbox-sign-up/",

  workshopSummarySteps: [
    {
      title: "Network Link v2",
      text: "Learn how to integrate third-party services into Fireblocks using the secure Network Link v2 API framework.",
      slug: "network-link-v2"
    },
    {
      title: "Off-Exchange",
      text: "Master secure collateral management and settlement processes for exchange trading while maintaining custody.",
      slug: "off-exchange"
    },
    {
      title: "Embedded Wallets",
      text: "Build and deploy embedded wallet solutions using Fireblocks developer tools.",
      slug: "embedded-wallets"
    },
    {
      title: "Web3 Workshop",
      text: "Create, deploy and mint NFTs using Fireblocks wallet and smart contract tools.",
      slug: "web3-workshop"
    },
  ],
};

// Lab configurations
export const labsConfig: Record<string, LabConfig> = {
"network-link-v2": {
  id: "network-link-v2",
  title: "Network Link v2",
  description: "Learn how to integrate third-party services into Fireblocks using the secure Network Link v2 API framework.",
  prerequisites: [
    { text: "Basic understanding of REST APIs and HTTP methods" },
    { text: "Knowledge of cryptographic concepts (HMAC, RSA, ECDSA)" },
    { text: "Fireblocks Sandbox Workspace. Get a free one <a href='https://www.fireblocks.com/developer-sandbox-sign-up/' target='_blank' class='text-blue-500 underline hover:text-blue-700'>here.</a>" },
    { text: "Node.js version >20 installed" },
    { text: "A code editor like VS Code" },
  ],
  steps: [
    { id: 1, title: "Understanding Network Link v2", file: "network-link-v2/step1.md" },
    { id: 2, title: "General Knowledge Quiz", file: "network-link-v2/step2.md" }, // UPDATED: New general quiz
    { id: 3, title: "Authentication & Signature Quiz", file: "network-link-v2/step3.md" }, // UPDATED: Moved from step 2
    { id: 4, title: "Build API Responses", file: "network-link-v2/step4.md" }, // UPDATED: Moved from step 3
  ]
},

  "off-exchange": {
    id: "off-exchange",
    title: "Off-Exchange",
    description: "Master secure collateral management and settlement processes for exchange trading while maintaining custody.",
    prerequisites: [
      { text: "Understanding of trading and settlement concepts" },
      { text: "Knowledge of collateral and risk management principles" },
      { text: "Fireblocks Sandbox Workspace. Get a free one <a href='https://www.fireblocks.com/developer-sandbox-sign-up/' target='_blank' class='text-blue-500 underline hover:text-blue-700'>here.</a>" },
      { text: "Network Link v2 integration knowledge (recommended)" },
      { text: "Basic understanding of exchange operations" },
    ],
    steps: [
      { id: 1, title: "Off-Exchange Provider Overview", file: "off-exchange/step1.md" },
      { id: 2, title: "API Authentication & Mandatory Capabilities", file: "off-exchange/step2.md" },
      { id: 3, title: "API Implementation & Validator Testing", file: "off-exchange/step3.md" },
      { id: 4, title: "Production Onboarding & Deployment", file: "off-exchange/step4.md" },
    ]
  },
  "embedded-wallets": {
    id: "embedded-wallets",
    title: "Embedded Wallets",
    description: "Build and deploy embedded wallet solutions using Fireblocks developer tools.",
    prerequisites: [
      { text: "React/JavaScript development experience" },
      { text: "Fireblocks Sandbox Workspace. Get a free one <a href='https://www.fireblocks.com/developer-sandbox-sign-up/' target='_blank' class='text-blue-500 underline hover:text-blue-700'>here.</a>" },
      { text: "Fireblocks API Key" },
      { text: "Node.js version >20 installed" },
      { text: "A code editor like VS Code" },
    ],
    steps: [
      { id: 1, title: "Initialize Embedded Wallet SDK", file: "embedded-wallets/step1.md" },
      { id: 2, title: "Configure Wallet Integration", file: "embedded-wallets/step2.md" },
      { id: 3, title: "Implement Wallet Functions", file: "embedded-wallets/step3.md" },
      { id: 4, title: "Test Wallet Operations", file: "embedded-wallets/step4.md" },
      { id: 5, title: "Deploy and Integrate", file: "embedded-wallets/step5.md" },
    ]
  },
  "web3-workshop": {
    id: "web3-workshop",
    title: "Web3 Workshop",
    description: "Create, deploy and mint NFTs using Fireblocks wallet and smart contract tools.",
    prerequisites: [
      { text: "Basic JavaScript knowledge" },
      { text: "Node.js version >20 installed. Follow the <a href='https://nodejs.org/en/download/package-manager' target='_blank' class='text-blue-500 underline hover:text-blue-700'>official documentation for installation.</a>" },
      { text: "NPM latest version installed" },
      { text: "Fireblocks Sandbox Workspace. Get a free one <a href='https://www.fireblocks.com/developer-sandbox-sign-up/' target='_blank' class='text-blue-500 underline hover:text-blue-700'>here.</a>" },
      { text: "Fireblocks API Key" },
      { text: "A code editor like VS Code" },
    ],
    steps: [
      { id: 1, title: "Setup", file: "web3-workshop/step1.md" },
      { id: 2, title: "Configure Hardhat", file: "web3-workshop/step2.md" },
      { id: 3, title: "Compile our Smart Contract", file: "web3-workshop/step3.md" },
      { id: 4, title: "Deploy our Smart Contract", file: "web3-workshop/step4.md" },
      { id: 5, title: "Mint NFT", file: "web3-workshop/step5.md" },
    ]
  }
};

// Legacy config for backward compatibility
export const stepsPageConfig: StepsPageConfig = {
  stepsData: labsConfig["web3-workshop"].steps,
  prerequisites: labsConfig["web3-workshop"].prerequisites,
};