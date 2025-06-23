# 🔥 Fireblocks Professional Services Training Platform

A comprehensive hands-on training platform for Fireblocks Professional Services engineers to learn Network Link v2 implementation. This interactive learning experience transforms complex API documentation into practical, step-by-step training modules.

## 🎯 Overview

This platform provides Professional Services engineers with the knowledge and tools to successfully implement Network Link v2 integrations for Fireblocks clients. Through interactive labs, real-world scenarios, and hands-on exercises, engineers learn to guide clients from initial setup through production deployment.

### **What You'll Learn**
- Network Link v2 architecture and benefits
- Authentication and signature validation
- API response building and validation
- Client deployment and go-live processes
- Troubleshooting common implementation issues

## 🏗️ Platform Architecture


### **Key Features**
- 📚 **Multi-lab Platform**: Scalable architecture for multiple training modules
- 🧠 **Interactive Quizzes**: Knowledge validation with immediate feedback
- 🔧 **API Builder**: Hands-on JSON response construction and validation
- 🚀 **Deployment Simulator**: Real-world implementation scenarios
- 💾 **Progress Tracking**: Persistent state across sessions
- 📱 **Responsive Design**: Works on desktop and mobile devices

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18+ and npm/yarn
- Modern web browser (Chrome, Firefox, Safari, Edge)

### **Installation**

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd fireblocks-training-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

### **Production Deployment**

1. **Build the application**
   ```bash
   npm run build
   # or
   yarn build
   ```

2. **Deploy static files**
   ```bash
   npm run export
   # or
   yarn export
   ```

   The platform generates static files in the `out/` directory, ready for deployment to any static hosting service (Vercel, Netlify, AWS S3, etc.).

## 📚 Lab Content Structure

### **Network Link v2 Lab**

#### **Step 1: Understanding Network Link v2**
- **Content**: Architecture overview, benefits, client use cases
- **Format**: Educational content with rich formatting
- **Duration**: 15-20 minutes

#### **Step 2: Authentication & Signature Quiz**
- **Content**: Security concepts, signature generation process
- **Interactive**: 6-question advanced quiz with explanations
- **Validation**: Must complete quiz to proceed
- **Duration**: 20-25 minutes

#### **Step 3: Build API Responses**
- **Content**: Hands-on API response construction
- **Interactive**: API Builder with real-time validation
- **Requirements**: All 4 endpoints must validate successfully
  - `GET /capabilities`
  - `GET /capabilities/assets`
  - `GET /accounts`
  - `GET /accounts/{accountId}/balances`
- **Duration**: 45-60 minutes

#### **Step 4: Deployment & Implementation Guide**
- **Content**: Real-world implementation scenarios
- **Interactive**: Deployment simulator with 4 training modules
  - Client readiness assessment
  - Troubleshooting scenarios
  - Communication templates
  - Monitoring strategy
- **Duration**: 30-40 minutes

## 🔧 Technical Implementation

### **Progress Tracking System**

The platform uses localStorage to persist user progress:

```typescript
// Unique storage keys per lab
const storageKey = `completedSteps_${labSlug}`;
const apiValidationKey = `apiValidation_${labSlug}`;

// Progress persistence
useEffect(() => {
  localStorage.setItem(storageKey, JSON.stringify(completedSteps));
}, [completedSteps]);
```

### **API Validation Engine**

The API Builder includes comprehensive validation:

```typescript
// Schema validation for each endpoint
const validateCapabilities = (response, errors, warnings) => {
  if (!response.version) errors.push('Missing required field: version');
  if (!response.components?.accounts) errors.push('Missing accounts component');
  // ... additional validation logic
};
```

### **Component Integration System**

Markdown content can include interactive components using placeholders:

```markdown
## Interactive Section
[API_BUILDER_COMPONENT]
## Additional Content
```

The MarkdownRenderer detects placeholders and injects React components:

```typescript
if (content.includes('[API_BUILDER_COMPONENT]')) {
  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: beforeContent }} />
      <ApiBuilderComponent onValidationComplete={handleValidation} />
      <div dangerouslySetInnerHTML={{ __html: afterContent }} />
    </div>
  );
}
```

## 🎨 Design System

### **Color Palette**
- **Primary**: Blue shades (`blue-500`, `blue-600`, `blue-700`)
- **Success**: Green shades (`green-500`, `green-600`, `green-100`)
- **Warning**: Yellow shades (`yellow-500`, `yellow-100`, `yellow-200`)
- **Error**: Red shades (`red-500`, `red-600`, `red-100`)
- **Text**: Gray shades (`gray-700`, `gray-900`, `gray-600`)

### **Component Patterns**
- **Cards**: Rounded corners, subtle shadows, consistent padding
- **Buttons**: Gradient backgrounds, hover states, disabled states
- **Progress Indicators**: Visual progress bars and checkmarks
- **Interactive Elements**: Clear hover states and feedback

### **Typography**
- **Headers**: Bold weights, consistent hierarchy
- **Body Text**: Readable line heights, proper contrast
- **Code**: Monospace font, syntax highlighting for JSON

## 📊 Analytics & Metrics

### **Learning Analytics**
- Step completion rates
- Time spent per section
- Quiz performance metrics
- Common API validation errors
- Deployment scenario success rates

### **Success Metrics**
- **Completion Rate**: >80% of engineers complete all steps
- **Knowledge Retention**: >90% quiz scores after training
- **Implementation Success**: Reduced client implementation time
- **Support Tickets**: Decreased post-training support requests

## 🔒 Security Considerations

### **Data Privacy**
- No personal data collection
- Progress stored locally only
- No external API calls during training
- Client-side only validation

### **Content Security**
- All examples use fictional data
- No real API keys or credentials
- Sanitized HTML rendering
- XSS protection through React

## 🛠️ Development Guide

### **Adding New Labs**

1. **Create lab configuration**
   ```typescript
   // config.ts
   export const labs = {
     'new-lab': {
       title: 'New Lab Title',
       description: 'Lab description',
       steps: [
         { id: 1, title: 'Step 1', file: 'step1.md' },
         // ... additional steps
       ]
     }
   };
   ```

2. **Create content files**
   ```
   public/steps/new-lab/
   ├── step1.md
   ├── step2.md
   └── step3.md
   ```

3. **Add interactive components (optional)**
   ```typescript
   // Create new component
   const NewInteractiveComponent = () => { /* ... */ };
   
   // Add to MarkdownRenderer
   if (content.includes('[NEW_COMPONENT]')) {
     return <NewInteractiveComponent />;
   }
   ```

### **Content Creation Guidelines**

#### **Markdown Best Practices**
- Use descriptive headers (`##`, `###`)
- Include code examples with proper formatting
- Add emojis for visual appeal (🎯, ✅, 🔧)
- Keep paragraphs concise and scannable

#### **Interactive Component Design**
- Provide immediate feedback on user actions
- Include clear progress indicators
- Offer help text and examples
- Ensure mobile responsiveness

### **Testing Strategy**

#### **Unit Tests**
```bash
npm run test
```
- Component rendering
- Validation logic
- Progress tracking
- Local storage operations

#### **Integration Tests**
- Step progression flow
- Component interaction
- Cross-browser compatibility
- Mobile responsiveness

#### **User Acceptance Testing**
- Complete lab walkthrough
- Performance on various devices
- Content accuracy and clarity
- Learning objective achievement

## 📈 Performance Optimization

### **Build Optimization**
- Next.js static generation
- Automatic code splitting
- Image optimization
- Bundle size monitoring

### **Runtime Performance**
- Lazy loading of components
- Memoized expensive calculations
- Efficient re-rendering patterns
- Local storage caching

### **SEO & Accessibility**
- Semantic HTML structure
- Proper heading hierarchy
- Alt text for images
- Keyboard navigation support
- Screen reader compatibility

## 🤝 Contributing

### **Development Workflow**

1. **Fork the repository**
2. **Create feature branch**
   ```bash
   git checkout -b feature/new-lab-content
   ```
3. **Make changes**
   - Add new content or features
   - Follow coding standards
   - Test thoroughly
4. **Submit pull request**
   - Clear description of changes
   - Screenshots for UI changes
   - Testing notes

### **Content Contribution**
- Submit new lab ideas through issues
- Provide subject matter expertise
- Review content for accuracy
- Test user experience flows

### **Code Contribution**
- Follow TypeScript best practices
- Maintain consistent component patterns
- Add comprehensive tests
- Update documentation

## 📞 Support & Resources

### **For Developers**
- **Documentation**: In-code comments and README files
- **Issues**: GitHub issue tracker for bugs and features
- **Discussions**: GitHub discussions for questions

### **For Content Creators**
- **Writing Guide**: Markdown formatting standards
- **Component Library**: Available interactive components
- **Review Process**: Content validation workflow

### **For Professional Services Engineers**
- **Training Schedule**: Recommended learning pace
- **Support Contacts**: Technical assistance
- **Feedback Channels**: Platform improvement suggestions

## 🚀 Roadmap

### **Phase 1: Network Link v2** ✅
- Complete 4-step training module
- Interactive API builder
- Deployment simulator
- Quiz system implementation

### **Phase 2: Additional Labs** 🔄
- Embedded Wallets training
- Off-Exchange implementation
- Web3 Workshop series
- Advanced troubleshooting

### **Phase 3: Enhanced Features** 📋
- Real-time collaboration
- Video integration
- Advanced analytics
- Certification tracking

### **Phase 4: Scale & Integrate** 🔮
- LMS integration
- Mobile app version
- Multi-language support
- Advanced personalization

## 📄 License

This training platform is proprietary to Fireblocks and intended for internal Professional Services training purposes.

---

**Built with ❤️ by the Fireblocks Professional Services Team**

*Empowering engineers to deliver exceptional client implementations*