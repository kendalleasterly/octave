![](https://github.com/kendalleasterly/images/blob/main/octave%20desktop%20render%20best.png?raw=true)
## Features & functionality
- Search page
- Accounts (Sign in with google)
	- With playlists and saved songs
- Fully functional playlists
	- With visibility settings (i.e only the user can see the playlist or they can make it public)
- Shuffling playlists & albums
- Album views
- Full screen view
- Settings 
- Backend
- *Note: Octave does not actually play music, only silent audio with the same length as the song*

## Problems Faced

### Hosting on firebase using Next.js 14
- Every time I navigated using `<Link>` there would be a full page reload
- This behavior reset the app state between pages
	- Caused the app to completely forget the currently playing song, and had to re-fetch the authentication state
	- Solution: force-dynamic on the root route:
```typescript
//	app/layout.tsx

export const dynamic = "force-dynamic"
```

## Additional Info
- Cached track metadata on browser using localstorage
- Recently migrated the project to typescript when I migrated to Next.js
