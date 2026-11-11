# 💸 Paisa Diary

Budget, kharcha, income, goals, recurring aur udhaar tracker. Offline chalta hai, phone me app ki tarah install hota hai.

## GitHub par daalne ke steps
1. GitHub par naya repository banao (jaise `paisa-diary`).
2. **Add file → Upload files** me is folder ki saari files drag karo (sab files, koi folder nahi hai).
3. **Commit changes** dabao.
4. **Settings → Pages → Source: Deploy from a branch → main / root → Save**.
5. 1-2 minute baad link milega: `https://<username>.github.io/paisa-diary/`

## Phone me app banane ke liye
Chrome me link kholo → ⋮ menu → **Add to Home screen / Install app**.

## Customize
- Colors: `style.css` ke upar `:root` me (`--pri` = yellow). Currency: ₹ (`fmt` function, js/app.js).
- Categories: `app.js` me `CATS` list.
- Data aapke browser me save hota hai (localStorage).
