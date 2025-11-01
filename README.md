# SmartAIGram — Static Demo (Ready for Azure Static Web Apps)

This repo is a pure static HTML/CSS/JS demo implementing the SmartAIGram UI and mock data. It's ready to deploy as an Azure Static Web App or GitHub Pages.

## What it contains
- Splash, Login, Home, Shop Details, Products, Offers, Contact, Enquiry, Shops, Admin pages
- `assets/js/data.js` — in-memory mock DB with 5 shops, 24 products, 3 offers, demo users
- `assets/js/main.js` — client-side routing helpers, login modal, page initializers, admin CRUD (mock)
- High-quality images are hotlinked from Unsplash for banners and products

## Deploy to Azure Static Web Apps
1. Create a new GitHub repo and push this project
2. In Azure Portal, create **Static Web App**, connect to your GitHub repo and branch (e.g. `main`) and set app location to `/` (root)
3. After deployment, the root `index.html` is used as the entry. Configure default document if necessary.

## Notes
- All APIs are client-side and mocked using `assets/js/data.js`. Replace with real .NET Core endpoints later and adjust `main.js` calls.
- To use local images, download desired images into `assets/images/` and update `assets/js/data.js` banner/img URLs to point to local files.

## Optional: GitHub Action for Azure Static Web Apps
You can add an `azure-static-web-apps.yml` workflow configured by Azure when creating the Static Web App to enable CI/CD on push.

Enjoy — tell me if you want the repo split into Angular components or a direct GitHub Actions workflow file added.
