# Deployment Instructions

This is a static web application, meaning it consists only of HTML, CSS, JavaScript, and image files. You can deploy it for free on many platforms.

## Option 1: Netlify (Recommended)

1.  **Sign up/Log in** to [Netlify](https://www.netlify.com/).
2.  **Drag and Drop**:
    *   Go to the "Sites" tab in your Netlify dashboard.
    *   Drag the entire project folder (containing `index.html`, `css`, `js`, `assets`) onto the "Drag and drop your site output folder here" area.
    *   Netlify will upload and publish it instantly.
3.  **Git Integration** (If you pushed this code to GitHub):
    *   Click "Add new site" -> "Import from an existing project".
    *   Connect your GitHub account and select this repository.
    *   Leave "Build command" and "Publish directory" blank (or set Publish directory to `.`).
    *   Click "Deploy".

## Option 2: GitHub Pages

1.  **Push to GitHub**: Ensure this code is in a repository on GitHub.
2.  **Settings**: Go to your repository's "Settings" tab.
3.  **Pages**: Click on "Pages" in the left sidebar.
4.  **Source**: Select "Deploy from a branch".
5.  **Branch**: Select `main` (or your current branch) and `/ (root)`.
6.  Click **Save**. Your site will be live at `https://<your-username>.github.io/<repo-name>/`.

## Option 3: Vercel

1.  **Sign up/Log in** to [Vercel](https://vercel.com/).
2.  **Import**: Click "Add New..." -> "Project".
3.  **Select Repo**: Import your GitHub repository.
4.  **Deploy**: Click "Deploy". Vercel automatically detects static sites.

## Testing Locally

If you want to test it on your computer before deploying:

1.  Open a terminal in the project folder.
2.  Run a simple Python server:
    ```bash
    python3 -m http.server
    ```
3.  Open your browser to `http://localhost:8000`.
