# Syed Ifhaan — Digital Shop & Courses

This repository contains a static website built with HTML, CSS and JavaScript for selling electrical products, e-books and mini-courses by Syed Ifhaan.

Live preview (after you push): GitHub Pages will publish the `main` branch root.

How to push to GitHub (PowerShell):

1. Initialize repo and commit:

```powershell
cd "c:\Users\syed ifhaam\OneDrive\coding\DIGITAL MARKETING"
git init
git add .
git commit -m "Initial site: neon theme, products, SEO, animations"
```

2a. Create a repo on GitHub and add remote, then push (replace `<user>` and `<repo>`):

```powershell
git remote add origin https://github.com/<user>/<repo>.git
git branch -M main
git push -u origin main
```

2b. Or, if you have GitHub CLI (`gh`) logged in, you can create & push in one command:

```powershell
gh repo create <user>/<repo> --public --source=. --remote=origin --push
```

Notes:
- After pushing, GitHub Pages will deploy automatically using the included workflow.
- Replace `https://example.com/` in `index.html`, `sitemap.xml`, and `robots.txt` with your real domain if you have one.
