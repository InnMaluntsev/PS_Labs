import React, { useState } from 'react';
import { 
  FiCheckCircle, 
  FiClock, 
  FiDownload, 
  FiExternalLink, 
  FiUsers, 
  FiSettings, 
  FiFileText, 
  FiTrendingUp,
  FiChevronDown,
  FiChevronUp,
  FiStar,
  FiTarget,
  FiBookOpen
} from 'react-icons/fi';

interface LabCompletionHubProps {
  onStartOver?: () => void;
  onBackToLabs?: () => void;
  labTitle?: string;
}

const LabCompletionHub = ({ onStartOver, onBackToLabs, labTitle = "Network Link v2" }: LabCompletionHubProps) => {
  const [expandedSection, setExpandedSection] = useState<string | null>('achievements');

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const achievements = [
    {
      title: "Network Link v2 Fundamentals",
      description: "Mastered the core concepts, capabilities, and business value of Network Link v2",
      icon: FiBookOpen,
      color: "text-blue-600 bg-blue-100"
    },
    {
      title: "Authentication & Security",
      description: "Understanding of cryptographic signatures, API headers, and security best practices",
      icon: FiSettings,
      color: "text-green-600 bg-green-100"
    },
    {
      title: "API Implementation",
      description: "Built and validated all 4 mandatory endpoints with proper JSON structure",
      icon: FiTarget,
      color: "text-purple-600 bg-purple-100"
    },
    {
      title: "Customer Ready",
      description: "Prepared to guide customers through Network Link v2 implementations",
      icon: FiUsers,
      color: "text-orange-600 bg-orange-100"
    }
  ];

  const timelinePhases = [
    {
      phase: "Week 1-2",
      title: "Discovery & Planning",
      tasks: [
        "Technical requirements gathering",
        "Architecture review with customer",
        "Capability selection based on use cases",
        "Development environment setup"
      ],
      status: "upcoming"
    },
    {
      phase: "Week 2-3", 
      title: "Development & Integration",
      tasks: [
        "Implement mandatory endpoints (capabilities, accounts, balances)",
        "Add selected optional capabilities",
        "Security implementation (signatures, headers)",
        "Basic testing and validation"
      ],
      status: "upcoming"
    },
    {
      phase: "Week 3-4",
      title: "Testing & Optimization",
      tasks: [
        "Comprehensive API validator testing",
        "Performance testing and optimization",
        "Security audit and compliance check",
        "User acceptance testing"
      ],
      status: "upcoming"
    },
    {
      phase: "Week 4+",
      title: "Go-Live & Support",
      tasks: [
        "Production deployment",
        "Fireblocks network onboarding",
        "Monitoring and alerting setup",
        "Post-launch support and optimization"
      ],
      status: "upcoming"
    }
  ];

  const practicalTools = [
    {
      title: "Fireblocks Enabled User Flows for NLV2 Exchange Connectivity",
      description: "Comprehensive user flows and requirements for Network Link v2 exchange integrations",
      type: "Guide",
      downloadUrl: "http://docs.google.com/spreadsheets/d/1CKJd8wMcUJKHDHqnh64W-RxKnbWW6_O7sCBFkv4uZpE/edit?gid=0#gid=0",
      icon: FiFileText
    },
    {
      title: "API Endpoint Reference Guide",
      description: "Quick reference with all endpoints, parameters, and example responses",
      type: "Cheat Sheet",
      downloadUrl: "https://fireblocks.github.io/fireblocks-network-link/v2/docs.html#tag/transfersPeerAccounts",
      icon: FiBookOpen
    },
    {
      title: "Troubleshooting Playbook",
      description: "Common issues and solutions for Network Link v2 integrations",
      type: "Playbook",
      downloadUrl: "#",
      icon: FiTrendingUp
    }
  ];

  const nextActions = [
    {
      title: "Schedule Customer Implementation",
      description: "Use your newfound expertise to guide your first Network Link v2 customer implementation",
      action: "Start Implementation",
      urgent: true,
      icon: FiUsers
    },
    {
      title: "Explore Advanced Labs",
      description: "Continue learning with Off-Exchange, Embedded Wallets, or Web3 Workshop labs",
      action: "Browse Labs",
      urgent: false,
      icon: FiTrendingUp
    },
    {
      title: "Join PS Community",
      description: "Connect with other PS engineers and share implementation experiences",
      action: "Join Slack",
      urgent: false,
      icon: FiUsers
    },
    {
      title: "Access Documentation Portal",
      description: "Bookmark the complete Network Link v2 documentation for customer support",
      action: "Open Docs",
      urgent: false,
      icon: FiFileText
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-8">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <FiStar className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Lab Completed Successfully!</h1>
        <p className="text-lg text-gray-600 mb-4">
          You've mastered Network Link v2 and are ready to guide customer implementations
        </p>
        <div className="flex justify-center space-x-4 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <FiCheckCircle className="w-4 h-4 text-green-500" />
            4 Steps Completed
          </span>
          <span className="flex items-center gap-1">
            <FiCheckCircle className="w-4 h-4 text-green-500" />
            API Validated
          </span>
          <span className="flex items-center gap-1">
            <FiCheckCircle className="w-4 h-4 text-green-500" />
            Customer Ready
          </span>
        </div>
      </div>

      {/* Achievement Summary */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <button
          onClick={() => toggleSection('achievements')}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
        >
          <h2 className="text-xl font-semibold text-gray-900">🏆 Achievement Summary</h2>
          {expandedSection === 'achievements' ? <FiChevronUp /> : <FiChevronDown />}
        </button>
        
        {expandedSection === 'achievements' && (
          <div className="p-4 pt-0 border-t border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                  <div className={`p-2 rounded-lg ${achievement.color}`}>
                    <achievement.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{achievement.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Implementation Roadmap */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <button
          onClick={() => toggleSection('roadmap')}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
        >
          <h2 className="text-xl font-semibold text-gray-900">🗺️ Implementation Roadmap Timeline</h2>
          {expandedSection === 'roadmap' ? <FiChevronUp /> : <FiChevronDown />}
        </button>
        
        {expandedSection === 'roadmap' && (
          <div className="p-4 pt-0 border-t border-gray-100">
            <div className="space-y-6">
              {timelinePhases.map((phase, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </div>
                    {index < timelinePhases.length - 1 && (
                      <div className="w-px h-16 bg-gray-200 mt-2"></div>
                    )}
                  </div>
                  <div className="flex-1 pb-8">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                        {phase.phase}
                      </span>
                      <h3 className="font-semibold text-gray-900">{phase.title}</h3>
                    </div>
                    <ul className="space-y-1">
                      {phase.tasks.map((task, taskIndex) => (
                        <li key={taskIndex} className="text-sm text-gray-600 flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                          <span>{task}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Practical Tools */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <button
          onClick={() => toggleSection('tools')}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
        >
          <h2 className="text-xl font-semibold text-gray-900">🛠️ Quick Access to Practical Tools</h2>
          {expandedSection === 'tools' ? <FiChevronUp /> : <FiChevronDown />}
        </button>
        
        {expandedSection === 'tools' && (
          <div className="p-4 pt-0 border-t border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {practicalTools.map((tool, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <tool.icon className="w-6 h-6 text-blue-600" />
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                      {tool.type}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{tool.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{tool.description}</p>
                  <a 
                    href={tool.downloadUrl}
                    target={tool.downloadUrl.startsWith('http') ? '_blank' : '_self'}
                    rel={tool.downloadUrl.startsWith('http') ? 'noopener noreferrer' : ''}
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                    download={tool.downloadUrl.startsWith('/') ? true : undefined}
                  >
                    {tool.downloadUrl.startsWith('http') ? (
                      <FiExternalLink className="w-4 h-4" />
                    ) : (
                      <FiDownload className="w-4 h-4" />
                    )}
                    <span>{tool.downloadUrl.startsWith('http') ? 'Open' : 'Download'}</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
        <button 
          onClick={onStartOver}
          className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium transition-colors"
        >
          Start Lab Over
        </button>
        <button 
          onClick={onBackToLabs}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
        >
          Back to Labs
        </button>
      </div>
    </div>
  );
};

export default LabCompletionHub;