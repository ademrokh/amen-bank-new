# User Acceptance Testing (UAT) Plan
## Amen Bank AI Digital Solution

**Project**: Amen Bank Website Redesign with RAG-Powered Chatbot
**Scope**: Complete user validation round for frontend and backend
**Date**: June 2026
**Duration**: 1-2 weeks

---

## 1. Testing Objectives

- Validate all 7 routes load correctly across devices
- Verify form submissions (contact form) work end-to-end
- Test multilingual support (French, Arabic, English)
- Validate chatbot interaction and response quality
- Confirm accessibility compliance (WCAG 2.1 AA)
- Test performance on various network conditions
- Gather user feedback for final improvements

---

## 2. Test Participants

### User Groups (Min 15 total users)
- **Administrators** (2): Internal banking staff for system validation
- **Regular Customers** (5): Existing bank clients (desktop + mobile)
- **New Customers** (5): Prospects exploring the platform
- **Accessibility Users** (2): Users with accessibility needs (screen readers, keyboard nav)
- **International Users** (1): French/Arabic speakers for language validation

### Device Coverage
- Desktop (Windows, Mac)
- Tablet (iPad, Android tablet)
- Mobile (iPhone 12+, Samsung Galaxy)

### Browser Coverage
- Chrome/Chromium
- Firefox
- Safari
- Mobile browsers (Safari iOS, Chrome Android)

---

## 3. Test Scenarios

### Scenario 1: Homepage Navigation
**User Type**: All
**Steps**:
1. Load homepage (/)
2. Verify all page elements visible
3. Check products section displays correctly
4. Scroll through entire page
5. Verify trust indicators visible
6. Test header/footer links
7. Check load time (< 5 seconds)

**Success Criteria**:
- Page loads without errors
- All sections visible and readable
- Navigation works smoothly
- Page accessible within 5 seconds

---

### Scenario 2: Language Switching
**User Type**: All
**Steps**:
1. Start on English homepage
2. Click French language link
3. Verify page switches to French
4. Click Arabic language link
5. Verify RTL layout applies
6. Switch back to English
7. Maintain current page context

**Success Criteria**:
- Language switches instantly
- Content translates correctly
- RTL/LTR layout changes appropriately
- No broken translations
- Page context preserved

---

### Scenario 3: Contact Form Submission
**User Type**: Regular & New Customers
**Steps**:
1. Navigate to contact page (/contact)
2. Fill name field
3. Fill email field (valid email)
4. Fill phone field
5. Fill subject field
6. Fill message field
7. Click submit button
8. Wait for confirmation

**Success Criteria**:
- Form submits without errors
- Confirmation message appears
- Ticket ID generated (TKT-{timestamp}-{hash})
- Submission logged to backend
- User receives feedback

---

### Scenario 4: Contact Form Validation
**User Type**: All
**Steps**:
1. Navigate to contact page
2. Try submitting empty form
3. Check validation errors appear
4. Fill invalid email (no @)
5. Try submitting
6. Check email validation error
7. Fill required fields with valid data
8. Clear form with reset button
9. Verify fields cleared

**Success Criteria**:
- All validations trigger correctly
- Error messages are clear
- Invalid formats rejected
- Reset clears form
- No false positives

---

### Scenario 5: Agency Locator
**User Type**: Regular & New Customers
**Steps**:
1. Navigate to agencies page (/agencies)
2. View list of 6 Tunisian branches
3. Click on agency to view details
4. Use search to find specific agency
5. Filter by location/category (if available)
6. Verify map displays (if applicable)
7. Check contact information

**Success Criteria**:
- All agencies display
- Search filters results
- Location data accurate
- Contact info complete
- Mobile layout functional

---

### Scenario 6: FAQ Page
**User Type**: All
**Steps**:
1. Navigate to FAQ page (/faq)
2. View list of FAQs
3. Click to expand first FAQ
4. Read answer completely
5. Collapse FAQ
6. Search for specific topic (if available)
7. Filter by category (if available)
8. Test in all 3 languages

**Success Criteria**:
- All FAQs visible
- Accordion expand/collapse works
- Content readable
- Search/filter functional
- Multilingual content correct

---

### Scenario 7: Chatbot Interaction
**User Type**: All (critical for validation)
**Steps**:
1. Look for chatbot widget on homepage
2. Click to open chatbot drawer
3. Ask a question in English: "How do I open an account?"
4. Verify response appears
5. Ask in French: "Comment ouvrir un compte?"
6. Ask in Arabic: "كيف افتح حساب؟"
7. Test with longer, more complex question
8. Close chatbot drawer
9. Reopen on different page

**Success Criteria**:
- Widget appears on all pages
- Opens/closes smoothly
- Accepts message input
- Returns relevant responses
- Multilingual support works
- Responses are helpful
- No error messages
- Response time < 3 seconds

---

### Scenario 8: Mobile Responsiveness
**User Type**: Mobile device users
**Steps**:
1. Access homepage on mobile
2. Verify layout responds to screen size
3. Check touch targets are adequate (min 44x44px)
4. Test form fields on mobile
5. Navigate between pages on mobile
6. Test language switching on mobile
7. Use chatbot on mobile
8. Scroll through all content

**Success Criteria**:
- Layout adjusts properly
- Text remains readable
- Touch targets accessible
- Forms usable on mobile
- No horizontal scrolling needed
- Load time acceptable (< 8 seconds)

---

### Scenario 9: Accessibility
**User Type**: Accessibility users
**Steps**:
1. Use keyboard only (no mouse)
2. Tab through all navigation
3. Test screen reader compatibility (NVDA/JAWS)
4. Verify alt text on images
5. Check form label associations
6. Test focus indicators
7. Verify heading hierarchy
8. Test with screen magnification

**Success Criteria**:
- Keyboard navigation complete
- Screen reader announces correctly
- All images have alt text
- Forms fully labeled
- Focus visible
- Magnification doesn't break layout
- Color contrast adequate

---

### Scenario 10: Performance and Load
**User Type**: All
**Steps**:
1. Measure homepage load time (fast connection)
2. Measure on slow 3G connection
3. Check Lighthouse score
4. Test rapid navigation between pages
5. Load chatbot with 5 rapid messages
6. Monitor for memory leaks
7. Test on older device hardware

**Success Criteria**:
- Fast connection: < 3 seconds
- Slow 3G: < 8 seconds
- Lighthouse score > 80
- Rapid navigation handles well
- No crashes on older devices
- Memory usage stable

---

## 4. Validation Checklist

### Frontend Routes
- [ ] / loads correctly
- [ ] /fr loads in French
- [ ] /ar loads in Arabic
- [ ] /en loads in English
- [ ] /agencies accessible
- [ ] /contact accessible
- [ ] /faq accessible
- [ ] All routes responsive

### Forms
- [ ] Contact form validates
- [ ] Email validation works
- [ ] Phone number accepts international format
- [ ] Submit sends data to backend
- [ ] Confirmation message displays
- [ ] Ticket ID generated

### Chatbot
- [ ] Widget visible on all pages
- [ ] Opens/closes smoothly
- [ ] Accepts input in all languages
- [ ] Returns relevant responses
- [ ] No error messages
- [ ] Response time acceptable

### Multilingual
- [ ] English content complete
- [ ] French content complete
- [ ] Arabic content complete
- [ ] Language switching works
- [ ] RTL layout for Arabic
- [ ] LTR layout for EN/FR

### Accessibility
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Images have alt text
- [ ] Forms properly labeled
- [ ] Focus indicators visible
- [ ] Color contrast adequate
- [ ] WCAG 2.1 AA compliant

### Performance
- [ ] Fast network load < 3s
- [ ] Slow network load < 8s
- [ ] Mobile load < 8s
- [ ] Lighthouse > 80
- [ ] No memory leaks
- [ ] Smooth animations

---

## 5. Feedback Collection

### Feedback Form
```
User Type: [Admin/Customer/Accessibility/Other]
Device: [Desktop/Tablet/Mobile]
Browser: [Chrome/Firefox/Safari/Other]
Test Scenario: [1-10]

1. Did the feature work as expected?
   [ ] Yes  [ ] Partially  [ ] No

2. Was the user experience smooth?
   [ ] Excellent  [ ] Good  [ ] Fair  [ ] Poor

3. Were there any errors or bugs?
   [ ] None  [ ] Minor  [ ] Major

4. If errors occurred, describe:
   [Text field]

5. Feedback/Suggestions:
   [Text field]

6. Overall Rating (1-5 stars):
   [ ] 1  [ ] 2  [ ] 3  [ ] 4  [ ] 5

7. Would you recommend this to others?
   [ ] Yes  [ ] No  [ ] Maybe
```

### Metrics to Track
- Bug severity distribution
- User satisfaction score (target > 4/5)
- Completion rate per scenario (target 100%)
- Performance metrics
- Accessibility compliance rate
- Time to complete each task

---

## 6. Success Criteria

### Overall Validation Success
- ✅ 95%+ scenarios completed successfully
- ✅ No critical bugs found (or documented for fix)
- ✅ User satisfaction >= 4/5 stars
- ✅ All accessibility checks pass
- ✅ Performance benchmarks met
- ✅ Multilingual content verified

### Feature-Specific Success
- ✅ All 7 routes functional
- ✅ Contact form submissions work end-to-end
- ✅ Chatbot responds to queries in all languages
- ✅ Forms validate correctly
- ✅ Mobile responsive and functional
- ✅ WCAG 2.1 AA compliant

---

## 7. Issue Tracking

### Priority Levels
- **CRITICAL**: System broken, no workaround (fix immediately)
- **HIGH**: Core feature unusable, major impact (fix before release)
- **MEDIUM**: Feature works but degraded (fix if time permits)
- **LOW**: Minor cosmetic issue, minimal impact (document for future)

### Issue Report Template
```
Issue ID: [Auto-generated]
Severity: [CRITICAL/HIGH/MEDIUM/LOW]
Component: [Frontend/Backend/Chatbot]
Browser/Device: [Specific device/browser]

Summary: [One sentence]

Steps to Reproduce:
1. [Step 1]
2. [Step 2]
3. [Step 3]

Expected Behavior: [What should happen]
Actual Behavior: [What actually happened]
Screenshots/Video: [Attach if possible]

Related Test Scenario: [1-10]
```

---

## 8. Timeline

| Phase | Duration | Activity |
|-------|----------|----------|
| **Prep** | 1 day | Distribute links, schedule sessions, send instructions |
| **Testing** | 5-7 days | Users conduct tests, submit feedback |
| **Analysis** | 2 days | Compile results, prioritize issues |
| **Fixes** | 3-5 days | Address critical/high issues |
| **Retest** | 2 days | Validate fixes |
| **Sign-off** | 1 day | Final approval |

---

## 9. Go/No-Go Criteria

### GO Decision
- [ ] 95%+ test scenarios pass
- [ ] All CRITICAL issues resolved
- [ ] HIGH severity issues documented
- [ ] Accessibility compliant
- [ ] Performance targets met
- [ ] User satisfaction >= 4/5

### NO-GO Decision
- [ ] More than 1 CRITICAL issue unfixed
- [ ] Accessibility failures
- [ ] Performance significantly below target
- [ ] Core feature unavailable
- [ ] User satisfaction < 3/5

---

## 10. Post-UAT Activities

1. **Issue Triage**: Categorize all reported issues
2. **Risk Assessment**: Evaluate impact of unfixed items
3. **Release Plan**: Plan fixes for current and future releases
4. **User Training**: Create documentation for end users
5. **Support Preparation**: Brief support team on features
6. **Go-Live**: Deploy with sign-off from stakeholders

---

## Contact Information

**Project Lead**: [Name]
**Technical Contact**: [Engineering Lead]
**UAT Coordinator**: [Coordinator Name]

**Escalation**:
- Issues: [Slack channel or email]
- Questions: [Contact info]
- Emergency: [Emergency contact]
