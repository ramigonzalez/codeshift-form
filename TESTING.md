# Testing Checklist for AI Engineer Form

## 1. Adaptive Form Behavior - RAG Knowledge Levels

### Test the 5 RAG Knowledge Levels:

#### Level 1: "nao" (Não sei o que é)
- [ ] Navigate to Step 2
- [ ] Select "Não sei o que é" for RAG knowledge
- [ ] Navigate to Step 3
- [ ] **Expected:** Technical questions section should NOT appear
- [ ] **Expected:** Only personality tests and general questions visible

#### Level 2: "conceito" (Entendo o conceito mas nunca implementei)
- [ ] Navigate to Step 2
- [ ] Select "Entendo o conceito mas nunca implementei" for RAG knowledge
- [ ] Navigate to Step 3
- [ ] **Expected:** Technical questions section should NOT appear
- [ ] **Expected:** Only personality tests and general questions visible

#### Level 3: "basico" (Já implementei algo básico)
- [ ] Navigate to Step 2
- [ ] Select "Já implementei algo básico" for RAG knowledge
- [ ] Navigate to Step 3
- [ ] **Expected:** Technical questions section SHOULD appear
- [ ] **Expected:** All 4 technical questions should be visible and REQUIRED
- [ ] **Expected:** Info box explaining why technical questions are shown

#### Level 4: "intermediario" (Tenho experiência implementando RAG)
- [ ] Navigate to Step 2
- [ ] Select "Tenho experiência implementando RAG" for RAG knowledge
- [ ] Navigate to Step 3
- [ ] **Expected:** Technical questions section SHOULD appear
- [ ] **Expected:** All 4 technical questions should be visible and REQUIRED

#### Level 5: "avancado" (Já trabalhei com técnicas avançadas)
- [ ] Navigate to Step 2
- [ ] Select "Já trabalhei com técnicas avançadas (HyDE, Reranking, etc)" for RAG knowledge
- [ ] Navigate to Step 3
- [ ] **Expected:** Technical questions section SHOULD appear
- [ ] **Expected:** All 4 technical questions should be visible and REQUIRED

---

## 2. Step-by-Step Validation Rules

### Step 1 - Personal Data

#### Nome (Name)
- [ ] Leave empty → Should show error: "Nome muito curto (mínimo 3 caracteres)"
- [ ] Enter "Ab" → Should show error: "Nome muito curto (mínimo 3 caracteres)"
- [ ] Enter valid name "John Doe" → Should accept

#### Email
- [ ] Leave empty → Should show error
- [ ] Enter "invalid" → Should show error: "Email inválido"
- [ ] Enter "test@" → Should show error: "Email inválido"
- [ ] Enter "test@example.com" → Should accept

#### WhatsApp (Optional)
- [ ] Leave empty → Should accept (optional field)
- [ ] Enter valid phone → Should accept

#### LinkedIn
- [ ] Leave empty → Should show error
- [ ] Enter "https://google.com" → Should show error: "URL deve ser do LinkedIn"
- [ ] Enter "linkedin.com/in/user" → Should show error (needs https://)
- [ ] Enter "https://linkedin.com/in/username" → Should accept

#### Localização (Location)
- [ ] Leave empty → Should show error: "Localização muito curta"
- [ ] Enter "AB" → Should show error: "Localização muito curta"
- [ ] Enter "São Paulo, Brasil" → Should accept

#### Navigation
- [ ] Click "Próximo" with empty form → Should show validation errors
- [ ] Click "Próximo" with valid data → Should navigate to Step 2

### Step 2 - Experience & Portfolio

#### Python Experience
- [ ] Leave unselected (default "Selecione...") → Should show error
- [ ] Select any valid option → Should accept

#### LLM Experience
- [ ] Leave unselected → Should show error
- [ ] Select any valid option → Should accept

#### RAG Knowledge
- [ ] Leave unselected → Should show error
- [ ] Select any valid option → Should accept

#### Technologies (Techs)
- [ ] Leave none selected → Should accept (optional, array defaults to [])
- [ ] Select 1 or more → Should accept

#### GitHub
- [ ] Leave empty → Should show error
- [ ] Enter "https://google.com" → Should show error: "URL deve ser do GitHub"
- [ ] Enter "https://github.com/username" → Should accept

#### Project Description (Optional)
- [ ] Leave empty → Should accept
- [ ] Enter text → Should accept

#### CV Upload (Optional)
- [ ] Leave empty → Should accept
- [ ] Upload non-PDF file (.txt, .doc) → Should show error: "Apenas arquivos PDF são aceitos"
- [ ] Upload PDF > 5MB → Should show error: "Arquivo muito grande (máx 5MB)"
- [ ] Upload valid PDF < 5MB → Should accept

#### Navigation
- [ ] Click "Próximo" with invalid data → Should show errors
- [ ] Click "Próximo" with valid data → Should navigate to Step 3

### Step 3 - Personality & Questions

#### Personality Tests (All Optional)
- [ ] Leave all empty → Should accept
- [ ] Fill MBTI, DISC, Eneagrama → Should accept

#### General Questions

##### Motivação (Why interested)
- [ ] Leave empty → Should show error
- [ ] Enter < 20 chars "Test" → Should show error: "Muito curto - conte um pouco mais (mínimo 20 caracteres)"
- [ ] Enter > 1000 chars → Should show error: "Muito longo (máximo 1000 caracteres)"
- [ ] Enter valid text (20-1000 chars) → Should accept

##### Aprendizado (Learning approach)
- [ ] Leave empty → Should show error
- [ ] Enter < 20 chars → Should show error: "Muito curto - descreva sua abordagem"
- [ ] Enter valid text (20-1000 chars) → Should accept

##### Problema Resolvido (Optional)
- [ ] Leave empty → Should accept
- [ ] Enter text → Should accept

#### Technical Questions (Conditional - only if RAG >= "basico")

**When RAG = "nao" or "conceito":**
- [ ] Technical questions should NOT be visible
- [ ] Navigation to Step 4 should work without technical answers

**When RAG = "basico", "intermediario", or "avancado":**
- [ ] Technical questions section should be visible
- [ ] Info box should explain why questions are shown

##### Pergunta Chunking (Chunking strategy)
- [ ] Leave empty → Should show error
- [ ] Enter < 20 chars → Should show error: "Muito curto - explique sua abordagem"
- [ ] Enter > 1500 chars → Should show error: "Muito longo (máximo 1500 caracteres)"
- [ ] Enter valid text (20-1500 chars) → Should accept

##### Pergunta Debug (Debugging RAG)
- [ ] Leave empty → Should show error
- [ ] Enter < 20 chars → Should show error: "Muito curto - descreva seu processo"
- [ ] Enter valid text (20-1500 chars) → Should accept

##### Pergunta Eval (Evaluation metrics)
- [ ] Leave empty → Should show error
- [ ] Enter < 20 chars → Should show error: "Muito curto - explique as métricas"
- [ ] Enter valid text (20-1500 chars) → Should accept

##### Pergunta Falha (Project failure)
- [ ] Leave empty → Should show error
- [ ] Enter < 20 chars → Should show error: "Muito curto - compartilhe seu aprendizado"
- [ ] Enter valid text (20-1500 chars) → Should accept

#### Navigation
- [ ] Click "Próximo" with missing required fields → Should show errors
- [ ] Click "Próximo" with valid data → Should navigate to Step 4

### Step 4 - Availability

#### Horas por Semana (Hours per week)
- [ ] Leave unselected → Should show error: "Selecione quantas horas por semana"
- [ ] Select any valid option → Should accept

#### Disponibilidade (Start availability)
- [ ] Leave unselected → Should show error: "Selecione sua disponibilidade para início"
- [ ] Select any valid option → Should accept

#### Taxa (Optional hourly rate)
- [ ] Leave empty → Should accept
- [ ] Enter text → Should accept

#### Comentários (Optional comments)
- [ ] Leave empty → Should accept
- [ ] Enter > 1000 chars → Should show error: "Comentários muito longos (máximo 1000 caracteres)"
- [ ] Enter valid text → Should accept

#### Final Submission
- [ ] Click "Enviar meu interesse" with invalid data → Should show errors
- [ ] Click "Enviar meu interesse" with valid data → Should submit to webhook

---

## 3. Form Persistence (localStorage)

- [ ] Fill Step 1 partially
- [ ] Refresh page
- [ ] **Expected:** Data should be restored
- [ ] Navigate to Step 2, fill some fields
- [ ] Refresh page
- [ ] **Expected:** All data should be restored (except CV file)
- [ ] Complete and submit form successfully
- [ ] Refresh page
- [ ] **Expected:** localStorage should be cleared, form starts fresh

---

## 4. Submission Flow

### Success Case
- [ ] Fill all required fields with valid data
- [ ] Click "Enviar meu interesse"
- [ ] **Expected:** Shows loading state ("Enviando...")
- [ ] **Expected:** After success, shows SuccessScreen
- [ ] **Expected:** LocalStorage is cleared
- [ ] Click "Enviar outra candidatura"
- [ ] **Expected:** Form resets to Step 1

### Error Case (Network Error)
- [ ] Ensure VITE_WEBHOOK_URL is invalid or server is down
- [ ] Fill form and submit
- [ ] **Expected:** Shows ErrorScreen with error message
- [ ] Click "Voltar ao Formulário"
- [ ] **Expected:** Returns to Step 4 with data intact
- [ ] Click "Tentar Novamente"
- [ ] **Expected:** Attempts resubmission

---

## 5. Navigation

### Forward Navigation
- [ ] Cannot skip steps (must validate current step first)
- [ ] Progress bar updates correctly (25% → 50% → 75% → 100%)
- [ ] Step title updates correctly

### Backward Navigation
- [ ] Can go back from any step
- [ ] Data is preserved when going back
- [ ] No validation required when going back

### Progress Bar
- [ ] Step 1: 25% filled
- [ ] Step 2: 50% filled
- [ ] Step 3: 75% filled
- [ ] Step 4: 100% filled

---

## 6. Responsive Design

### Desktop (> 768px)
- [ ] Form centered with max-width 750px
- [ ] All fields properly sized
- [ ] Navigation buttons properly spaced

### Tablet (600px - 768px)
- [ ] Form adapts to smaller width
- [ ] All content readable
- [ ] No horizontal scroll

### Mobile (< 600px)
- [ ] Header padding reduced (24px)
- [ ] Form container padding reduced (24px)
- [ ] All fields stack vertically
- [ ] Navigation buttons stack if needed
- [ ] No horizontal scroll

---

## Test Results

Date: __________
Tester: __________

| Test Category | Status | Notes |
|---------------|--------|-------|
| RAG Level 1-2 (No tech questions) | ⬜ Pass ⬜ Fail | |
| RAG Level 3-5 (With tech questions) | ⬜ Pass ⬜ Fail | |
| Step 1 Validation | ⬜ Pass ⬜ Fail | |
| Step 2 Validation | ⬜ Pass ⬜ Fail | |
| Step 3 Validation | ⬜ Pass ⬜ Fail | |
| Step 4 Validation | ⬜ Pass ⬜ Fail | |
| Form Persistence | ⬜ Pass ⬜ Fail | |
| Submission Success | ⬜ Pass ⬜ Fail | |
| Submission Error | ⬜ Pass ⬜ Fail | |
| Navigation | ⬜ Pass ⬜ Fail | |
| Responsive Design | ⬜ Pass ⬜ Fail | |
