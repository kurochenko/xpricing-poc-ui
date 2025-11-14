# Deployment Guide - GitHub Pages

## Automatic Deployment Setup

This repository is configured for automatic deployment to GitHub Pages via GitHub Actions.

## How to Enable (One-Time Setup)

After pushing these changes, you need to enable GitHub Pages in your repository settings:

1. **Go to your repository on GitHub**
   - Navigate to: `https://github.com/kurochenko/xpricing-poc-ui`

2. **Access Settings**
   - Click on the "Settings" tab
   - Scroll down to "Pages" in the left sidebar

3. **Configure GitHub Pages**
   - Under "Build and deployment"
   - Source: Select **"GitHub Actions"**
   - Click Save

## What Happens Next

Once configured, every push to the branch `claude/xpricing-excel-rest-api-0158VK2yg6bugmPb7K6xrFyS` will:

1. ✅ Trigger the GitHub Actions workflow
2. ✅ Install dependencies (`npm ci`)
3. ✅ Build the production app (`npm run build`)
4. ✅ Deploy to GitHub Pages

## Your Live URL

After the first successful deployment, your app will be available at:

```
https://kurochenko.github.io/xpricing-poc-ui/
```

## Deployment Status

Check deployment status:
- Go to the "Actions" tab in your GitHub repository
- You'll see the "Deploy to GitHub Pages" workflow running
- First deployment takes ~2-3 minutes

## Manual Trigger

You can also manually trigger a deployment:
1. Go to "Actions" tab
2. Click "Deploy to GitHub Pages" workflow
3. Click "Run workflow" button
4. Select your branch
5. Click "Run workflow"

## Troubleshooting

### If the deployment fails:

1. **Check Actions logs**
   - Go to Actions tab
   - Click on the failed workflow run
   - Review the error logs

2. **Common issues:**
   - GitHub Pages not enabled → Follow setup steps above
   - Build errors → Check if `npm run build` works locally
   - Permissions → Ensure GitHub Actions has write permissions

### If the page shows 404:

1. Wait 1-2 minutes after first deployment
2. Clear browser cache
3. Try accessing with `/index.html`: `https://kurochenko.github.io/xpricing-poc-ui/index.html`
4. Check that GitHub Pages is set to "GitHub Actions" source

## Local Testing of Production Build

Test the production build locally before deploying:

```bash
npm run build
npm run preview
```

Then open http://localhost:4173/xpricing-poc-ui/

## Configuration Files

- **`.github/workflows/deploy.yml`** - GitHub Actions workflow
- **`vite.config.ts`** - Contains `base: '/xpricing-poc-ui/'` for correct asset paths

## Updating the Deployment

Just push to the branch:

```bash
git add .
git commit -m "Your changes"
git push
```

The deployment will run automatically!

## Branch-Specific Deployment

This workflow is configured to deploy only from:
- Branch: `claude/xpricing-excel-rest-api-0158VK2yg6bugmPb7K6xrFyS`

To deploy from a different branch, update `.github/workflows/deploy.yml`:

```yaml
on:
  push:
    branches:
      - your-branch-name  # Change this
```

---

**Note**: The first deployment requires one-time GitHub Pages configuration. After that, it's fully automatic!
