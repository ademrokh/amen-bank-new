# User Acceptance Testing - Quick Reference Checklist
## Amen Bank AI Digital Solution

### Pre-Testing Setup
- [ ] Clear browser cache
- [ ] Disable browser extensions (except accessibility tools)
- [ ] Test on multiple network speeds if possible
- [ ] Have devices ready: Desktop, Tablet, Mobile
- [ ] Prepare device specs for report

---

## Quick Test Checklist

### 1️⃣ Homepage (/)
```
Language: EN / FR / AR
Device: Desktop / Tablet / Mobile
Browser: [________]

Visual Checks:
[ ] Page loads without errors
[ ] Hero section displays correctly
[ ] Products section shows 6 items
[ ] Trust indicators visible
[ ] Header navigation visible
[ ] Footer displays correctly
[ ] All images load properly

Functional Checks:
[ ] Navigation links clickable
[ ] Language switcher works
[ ] No broken links
[ ] Chatbot widget visible
[ ] Scroll smooth and responsive

Performance:
[ ] Load time: ____ seconds
[ ] Page feels responsive
[ ] No lag during interactions

Issues Found: [____________________]
User Rating: ⭐️ __/5
```

---

### 2️⃣ Contact Page (/contact)
```
Language: EN / FR / AR
Device: Desktop / Tablet / Mobile
Browser: [________]

Form Fields:
[ ] Name field accepts input
[ ] Email field accepts input
[ ] Phone field accepts international format
[ ] Subject field accepts input
[ ] Message field accepts input

Form Validation:
[ ] Submit without data shows errors
[ ] Invalid email rejected
[ ] Missing required field blocked
[ ] Reset button clears form

Submission:
[ ] Valid submission accepted
[ ] Confirmation message appears
[ ] Ticket ID displayed (TKT-...)
[ ] Can submit multiple times
[ ] No data loss on refresh

Issues Found: [____________________]
User Rating: ⭐️ __/5
```

---

### 3️⃣ Agencies Page (/agencies)
```
Language: EN / FR / AR
Device: Desktop / Tablet / Mobile
Browser: [________]

Content:
[ ] All 6 Tunisian branches visible
[ ] Agency names readable
[ ] Contact info displayed
[ ] Address information shown
[ ] Phone numbers clickable

Interactive Features:
[ ] Search/filter works (if available)
[ ] Click on agency shows details
[ ] Map displays (if implemented)
[ ] Mobile layout proper

Issues Found: [____________________]
User Rating: ⭐️ __/5
```

---

### 4️⃣ FAQ Page (/faq)
```
Language: EN / FR / AR
Device: Desktop / Tablet / Mobile
Browser: [________]

Content:
[ ] FAQ list displays
[ ] Questions readable
[ ] Answers complete

Accordion/Expand:
[ ] Click question to expand
[ ] Answer appears after expansion
[ ] Click again to collapse
[ ] Can expand multiple items
[ ] Collapse works smoothly

Search/Filter:
[ ] Search box functional (if present)
[ ] Category filter works (if present)
[ ] Results update correctly
[ ] Search responsive

Issues Found: [____________________]
User Rating: ⭐️ __/5
```

---

### 5️⃣ Chatbot Widget
```
Language: EN / FR / AR
Device: Desktop / Tablet / Mobile
Browser: [________]

Visibility:
[ ] Widget button visible on homepage
[ ] Widget visible on /contact
[ ] Widget visible on /agencies
[ ] Widget visible on /faq
[ ] Position doesn't block content

Opening/Closing:
[ ] Clicking button opens drawer
[ ] Drawer displays smoothly
[ ] Close button works
[ ] Can reopen after closing

Messaging:
[ ] Input field accepts text
[ ] Send button works
[ ] Message appears in chat
[ ] Response appears from bot
[ ] Response is relevant

Test Queries (all 3 languages):
EN: "How do I open an account?"
   Response Quality: ⭐️ __/5
   
FR: "Comment ouvrir un compte?"
   Response Quality: ⭐️ __/5
   
AR: "كيف افتح حساب؟"
   Response Quality: ⭐️ __/5

Performance:
[ ] Response time < 3 seconds
[ ] No error messages
[ ] Widget doesn't crash
[ ] Multiple messages handled

Issues Found: [____________________]
Overall Widget Rating: ⭐️ __/5
```

---

### 6️⃣ Language Switching
```
Device: Desktop / Tablet / Mobile
Browser: [________]

EN → FR:
[ ] Click French link
[ ] Page switches to French
[ ] Content translates
[ ] URL changes to /fr
[ ] Layout correct for French

FR → AR:
[ ] Click Arabic link
[ ] Page switches to Arabic
[ ] RTL layout applies
[ ] Text alignment correct
[ ] URL changes to /ar

AR → EN:
[ ] Click English link
[ ] Page switches to English
[ ] LTR layout applies
[ ] URL updates
[ ] Content in English

Context Preservation:
[ ] On /contact, switch language → stays on contact
[ ] On /faq, switch language → stays on faq
[ ] Scroll position maintained (if applicable)

Issues Found: [____________________]
User Rating: ⭐️ __/5
```

---

### 7️⃣ Mobile Responsiveness
```
Device: [iPhone / iPad / Android]
Screen Size: ____ x ____
Browser: [________]

Layout:
[ ] Page content fits screen
[ ] No horizontal scrolling needed
[ ] Text readable (no zooming required)
[ ] Images scale appropriately
[ ] Buttons properly spaced

Touch Targets:
[ ] Buttons > 44x44 pixels
[ ] Form fields easily tappable
[ ] Links easy to click
[ ] Spacing prevents accidental clicks

Forms:
[ ] Input fields focus correctly
[ ] Keyboard appears appropriately
[ ] Validation messages visible
[ ] Submit button accessible

Performance:
[ ] Load time acceptable (< 8s)
[ ] Scrolling smooth
[ ] Animations smooth
[ ] No lag on interactions

Issues Found: [____________________]
User Rating: ⭐️ __/5
```

---

### 8️⃣ Accessibility
```
Device: Desktop
Assistive Tech: Screen Reader / Keyboard Only

Keyboard Navigation:
[ ] Tab moves through elements logically
[ ] Focus indicators visible
[ ] Can access all features with keyboard
[ ] No keyboard traps

Screen Reader (NVDA/JAWS):
[ ] Page title announced
[ ] Heading hierarchy clear
[ ] Images have alt text
[ ] Form labels announced correctly
[ ] Button purposes announced
[ ] Links distinguish from text

Color Contrast:
[ ] Text readable on background
[ ] Important info not color-only
[ ] Links distinguishable from text

Zoom/Magnification:
[ ] Page functional at 200% zoom
[ ] Text readable when magnified
[ ] Layout doesn't break

Issues Found: [____________________]
Accessibility Rating: ⭐️ __/5
```

---

### 9️⃣ General Issues & Notes

#### Bugs/Errors Found:
```
1. Issue: [____________________]
   Severity: [ ] Critical [ ] High [ ] Medium [ ] Low
   Steps: [____________________]
   
2. Issue: [____________________]
   Severity: [ ] Critical [ ] High [ ] Medium [ ] Low
   Steps: [____________________]
```

#### Overall Feedback:
```
What worked well?
[____________________]

What could be improved?
[____________________]

Would you use this in production?
[ ] Yes  [ ] No  [ ] Need improvements

Additional Comments:
[____________________]
```

---

## 🏁 Final Summary

| Category | Rating | Notes |
|----------|--------|-------|
| **Functionality** | ⭐️ __/5 | |
| **Usability** | ⭐️ __/5 | |
| **Performance** | ⭐️ __/5 | |
| **Accessibility** | ⭐️ __/5 | |
| **Overall** | ⭐️ __/5 | |

**Recommendation**: [ ] APPROVE  [ ] APPROVE WITH FIXES  [ ] REJECT

**Tester Name**: ________________  
**Date**: ________________  
**Device/Browser**: ________________  
**Time Spent**: ________________  

---

## 📧 Submit Feedback

Please email completed checklist to: [test-coordinator@amen-bank.tn]
Or submit via: [Online form link]

**Thank you for helping validate Amen Bank!**
