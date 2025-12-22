# AI Engineer - RAG Systems Application Form

A multi-step wizard form for collecting AI Engineer job applications with adaptive questioning based on candidate experience level.

## 🚀 Features

### Core Functionality
- **4-Step Wizard** with visual progress tracking
- **Adaptive Questioning** - Technical questions appear only for candidates with RAG experience (intermediate/advanced)
- **Step-by-Step Validation** - Validates each step before allowing navigation
- **Form Persistence** - Auto-saves progress to localStorage (recovers on page refresh)
- **File Upload** - CV upload with PDF validation (max 5MB)
- **Webhook Submission** - Sends data as JSON to configurable endpoint
- **Retry Logic** - 3 automatic retries with exponential backoff on network errors
- **Success/Error Screens** - Clear feedback after submission

### Tech Stack
- **Vite** - Fast build tool and dev server
- **React 18** - UI library
- **TypeScript** - Type safety
- **React Hook Form** - Form state management
- **Zod** - Schema validation
- **Axios** - HTTP client
- **CSS Modules** - Scoped styling

## 📋 Form Structure

### Step 1: Personal Data
- Full name (required, 3-100 chars)
- Email (required, valid email)
- WhatsApp (optional)
- LinkedIn URL (required, must be linkedin.com)
- Location (required, 3-100 chars)

### Step 2: Experience & Portfolio
**Experience:**
- Python experience level (required)
- LLM/LangChain experience (required)
- RAG knowledge level (required) - **Determines if technical questions appear**
- Technologies used (optional, multi-select)

**Portfolio:**
- GitHub URL (required, must be github.com)
- Relevant project (optional)
- CV upload (optional, PDF only, max 5MB)

### Step 3: Personality & Questions
**Personality Tests (All Optional):**
- MBTI (16 Personalities)
- DISC
- Enneagram

**General Questions (Required):**
- Why interested in this opportunity? (20-1000 chars)
- How do you learn new technologies? (20-1000 chars)
- Technical problem you solved (optional)

**Technical Questions (Conditional - only if RAG knowledge >= "basico"):**
- Chunking strategy for 45-min sales call transcription (20-1500 chars)
- How to debug RAG system returning wrong answers (20-1500 chars)
- RAG quality metrics and evaluation (20-1500 chars)
- Project failure story and learnings (20-1500 chars)

### Step 4: Availability
- Hours per week available (required)
- Start availability (required)
- Hourly rate expectation (optional)
- Additional comments (optional, max 1000 chars)

## 🎯 Adaptive Behavior

### RAG Knowledge Levels

The form adapts based on the candidate's RAG knowledge:

**No Technical Questions:**
- "nao" - Doesn't know what RAG is
- "conceito" - Understands concept but never implemented

**Shows Technical Questions:**
- "basico" - Built something basic
- "intermediario" - Has experience implementing RAG
- "avancado" - Worked with advanced techniques (HyDE, Reranking, etc.)

When technical questions appear, they become **required** fields with validation.

## 🛠️ Installation

### Prerequisites
- Node.js 18+ and npm

### Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd codeshift-form
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**

Create a `.env` file in the root directory:

```env
VITE_WEBHOOK_URL=https://your-webhook-endpoint.com/api/submit
```

4. **Start development server**
```bash
npm run dev
```

The application will be available at `http://localhost:5173/`

5. **Build for production**
```bash
npm run build
```

Build output will be in the `dist/` directory.

## 📁 Project Structure

```
src/
├── components/
│   ├── common/              # Reusable form components
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Textarea.tsx
│   │   ├── FileUpload.tsx
│   │   ├── Checkbox.tsx
│   │   ├── CheckboxGroup.tsx
│   │   └── Radio.tsx
│   ├── screens/             # Success & Error screens
│   │   ├── SuccessScreen.tsx
│   │   └── ErrorScreen.tsx
│   ├── steps/               # 4 wizard steps
│   │   ├── Step1.tsx        # Personal data
│   │   ├── Step2.tsx        # Experience + Portfolio
│   │   ├── Step3.tsx        # Personality + Questions (adaptive)
│   │   └── Step4.tsx        # Availability
│   └── wizard/
│       └── WizardContainer.tsx  # Progress bar + navigation
├── hooks/
│   ├── useWizard.ts         # Navigation logic
│   └── useFormPersistence.ts  # localStorage auto-save
├── services/
│   └── webhookService.ts    # Submission with retry logic
├── utils/
│   ├── validationSchemas.ts # Zod schemas
│   └── stepValidation.ts    # Step-by-step validation
├── types/
│   └── application.ts       # TypeScript interfaces
├── styles/                  # CSS Modules
│   ├── layout.module.css
│   ├── form.module.css
│   ├── components.module.css
│   └── wizard.module.css
└── App.tsx                  # Main application entry
```

## 🔧 Configuration

### Webhook Payload Structure

The form submits data in the following JSON format:

```json
{
  "formData": {
    "nome": "John Doe",
    "email": "john@example.com",
    "whatsapp": "+55 11 99999-9999",
    "linkedin": "https://linkedin.com/in/johndoe",
    "localizacao": "São Paulo, Brasil",
    "exp_python": "3-5",
    "exp_llm": "profissional",
    "conhece_rag": "intermediario",
    "techs": ["fastapi", "langchain", "openai"],
    "github": "https://github.com/johndoe",
    "projeto": "Built a RAG system for...",
    "cv": {
      "filename": "cv.pdf",
      "size": 1234567,
      "type": "application/pdf",
      "data": "base64-encoded-content..."
    },
    "mbti": "INTJ",
    "disc": "DI",
    "eneagrama": "Tipo 5",
    "motivacao": "I'm interested because...",
    "aprendizado": "I learn by...",
    "problema_resolvido": "I solved...",
    "pergunta_chunking": "My chunking approach...",
    "pergunta_debug": "I would debug by...",
    "pergunta_eval": "I use these metrics...",
    "pergunta_falha": "A project that failed...",
    "horas_semana": "25-35",
    "disponibilidade": "1-2-semanas",
    "taxa": "$40-50/hour",
    "comentarios": "Additional info..."
  },
  "submittedAt": "2025-12-19T12:34:56.789Z",
  "userAgent": "Mozilla/5.0..."
}
```

### Retry Configuration

Located in `src/services/webhookService.ts`:

```typescript
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second
const REQUEST_TIMEOUT = 30000; // 30 seconds
```

Retry logic:
- **Attempt 1:** Immediate
- **Attempt 2:** After 1 second
- **Attempt 3:** After 2 seconds
- **Attempt 4:** After 4 seconds

Retries on:
- Network errors (no response)
- 5xx server errors
- 408 Request Timeout
- 429 Too Many Requests

Does NOT retry on:
- 4xx client errors (except 408, 429)

### LocalStorage Configuration

Located in `src/hooks/useFormPersistence.ts`:

```typescript
const STORAGE_KEY = 'ai-engineer-form-draft';
const AUTOSAVE_DELAY = 1000; // 1 second debounce
```

**Note:** CV files are NOT saved to localStorage (File objects can't be serialized).

## 🧪 Testing

### Manual Testing

Use the comprehensive testing checklist:

```bash
cat TESTING.md
```

This includes:
- ✅ All 5 RAG knowledge levels
- ✅ All validation rules
- ✅ Form persistence
- ✅ Submission flow (success/error)
- ✅ Navigation
- ✅ Responsive design

### Validation Verification

Review code-level validation verification:

```bash
cat VALIDATION_VERIFICATION.md
```

This documents:
- ✅ All 27 validation rules
- ✅ Adaptive behavior logic
- ✅ Conditional validation
- ✅ Error messages

### Test Scenarios

#### Scenario 1: Beginner Candidate (No Technical Questions)
1. Select RAG knowledge: "Não sei o que é" or "Entendo o conceito mas nunca implementei"
2. Fill required fields in all steps
3. **Expected:** Step 3 shows only personality tests + general questions
4. **Expected:** Can submit without technical questions

#### Scenario 2: Experienced Candidate (With Technical Questions)
1. Select RAG knowledge: "Já implementei algo básico" or higher
2. Navigate to Step 3
3. **Expected:** Technical questions section appears
4. **Expected:** All 4 technical questions are required
5. Try to navigate without filling them
6. **Expected:** Validation errors prevent navigation

#### Scenario 3: Form Persistence
1. Fill Step 1 partially
2. Refresh page
3. **Expected:** Data restored from localStorage
4. Complete and submit form
5. Refresh page
6. **Expected:** Form starts fresh (localStorage cleared)

#### Scenario 4: File Upload Validation
1. Try uploading .txt file
2. **Expected:** Error "Apenas arquivos PDF são aceitos"
3. Try uploading PDF > 5MB
4. **Expected:** Error "Arquivo muito grande (máx 5MB)"
5. Upload valid PDF < 5MB
6. **Expected:** File accepted

## 🎨 Styling

The application uses CSS Modules for scoped styling with a professional blue gradient theme:

- **Primary Color:** `#2563eb` (Blue)
- **Secondary Color:** `#1a365d` (Dark Blue)
- **Success:** `#10b981` (Green)
- **Error:** `#ef4444` (Red)
- **Warning:** `#f59e0b` (Orange)
- **Info:** `#3b82f6` (Light Blue)

### Responsive Breakpoints

- **Desktop:** > 768px (max-width 750px container)
- **Tablet:** 600px - 768px
- **Mobile:** < 600px (reduced padding, stacked layout)

## 🔒 Security Considerations

- ✅ Client-side validation (Zod schemas)
- ✅ URL validation (domain checks for LinkedIn/GitHub)
- ✅ File type validation (PDF only)
- ✅ File size validation (max 5MB)
- ✅ Input sanitization via React
- ⚠️ **Important:** Add server-side validation on your webhook endpoint
- ⚠️ **Important:** Validate and sanitize all data before storing in database
- ⚠️ **Important:** Implement rate limiting on webhook endpoint

## 📝 Development Notes

### Adding New Fields

1. **Update TypeScript interface** in `src/types/application.ts`
2. **Add Zod validation** in `src/utils/validationSchemas.ts`
3. **Update step component** to include new field
4. **Update field mapping** in `src/utils/stepValidation.ts`
5. **Test validation** works correctly

### Modifying Validation Rules

All validation is centralized in `src/utils/validationSchemas.ts`. Error messages are user-facing in Portuguese.

### Customizing Adaptive Behavior

The logic is in:
- **Rendering:** `src/types/application.ts` - `shouldShowTechnicalQuestions()`
- **Validation:** `src/utils/stepValidation.ts` - `getStepSchema()`
- **UI:** `src/components/steps/Step3.tsx` - conditional rendering

## 🐛 Troubleshooting

### Form data not persisting
- Check browser localStorage is enabled
- Check browser console for errors
- localStorage key: `'ai-engineer-form-draft'`

### Webhook submission failing
- Verify `VITE_WEBHOOK_URL` in `.env` file
- Check webhook endpoint is accessible
- Check browser console for detailed error
- Test with `curl` or Postman first

### Validation not working
- Check browser console for errors
- Verify field names match schema
- Check conditional logic for Step 3 technical questions

### Build errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite

# Rebuild
npm run build
```

## 📚 Documentation

- **TESTING.md** - Comprehensive manual testing checklist
- **VALIDATION_VERIFICATION.md** - Code-level validation verification
- **README.md** - This file (project overview)

## 🤝 Contributing

1. Follow existing code style
2. Add TypeScript types for all new code
3. Update validation schemas for new fields
4. Test adaptive behavior thoroughly
5. Update documentation

## 📄 License

[Add your license here]

## 👤 Author

[Add your information here]

---

**Version:** 1.0.0
**Last Updated:** 2025-12-19
**Status:** ✅ Production Ready
