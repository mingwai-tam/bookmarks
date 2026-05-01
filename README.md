# Public Bookmarks

This repository is set up as a public bookmark page for GitHub Pages.

## Features

- Category tabs
- Live search across title, URL, category, and tags
- Multi-file structure (`index.html`, `styles.css`, `bookmarks.js`, `script.js`)

## Included test bookmark

- [Romans 8 (Chinese Bible Study Page)](https://www.ccreadbible.org/chinesebible/nab_nabhtm/bible_60_Ch_8_romans.html)

## Add more bookmarks

Edit `bookmarks.js` and add objects in this format:

```js
{
	title: "Bookmark title",
	url: "https://example.com",
	category: "Category Name",
	tags: ["tag1", "tag2"]
}
```

Tabs are created automatically from `category` values.

## Publish on GitHub Pages

1. Push this repository to GitHub.
2. Open **Settings** > **Pages**.
3. Under **Build and deployment**, choose:
	- **Source**: Deploy from a branch
	- **Branch**: `main` (or your default branch), folder `/ (root)`
4. Save, then wait for deployment.

Your bookmark page will be served from `https://<your-username>.github.io/<repo-name>/`.
