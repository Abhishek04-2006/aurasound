# GitHub Push Instructions

## After creating your repository on GitHub, run these commands:

# Add the remote repository (replace YOUR-USERNAME with your GitHub username)
git remote add origin https://github.com/Abhishek04-2006/aurasound-landing-page.git

# Rename the default branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main

## Alternative: If you want a different repository name
# Replace 'aurasound-landing-page' with your preferred name:
# git remote add origin https://github.com/Abhishek04-2006/YOUR-REPO-NAME.git
# git branch -M main
# git push -u origin main

## If you get authentication errors:
# You may need to use a Personal Access Token instead of password
# Generate one at: https://github.com/settings/tokens
# Or use GitHub CLI: gh auth login
