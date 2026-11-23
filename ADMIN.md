# MCHD IT — Expertise admin panel

Open `admin.html`. It manages everything about the 12 Core Expertise items:
- **What you can edit:** title, URL slug, icon, card description, published or draft, images (the first is the cover), overview, "What we do", selected projects, tools, and extra header facts.
- **Order:** drag items in the sidebar, or use ▲▼. The order is used on the home page and on the expertise pages.
- **Where changes appear:** in the home-page explorer, on the expertise case-study page, and in every "More Expertise" list.

## Two modes

| Mode | When | Where content is stored |
|---|---|---|
| **Demo** | `assets/js/firebase-config.js` is `null` (default) | This browser's localStorage. Only this browser sees changes. Use it to try the panel. |
| **Firebase** | A Firebase config is set | Cloud Firestore and Firebase Storage. Every visitor sees changes immediately. |

If the database is empty or unreachable, the website falls back to the built-in content in `assets/js/data.js`, so it never shows a blank page.

## Firebase setup (about 15 minutes)

1. **Create the project.** At https://console.firebase.google.com, create a project. Then go to **Add app → Web** and copy the config into `assets/js/firebase-config.js`.
2. **Turn on the services:**
   - **Authentication:** enable Email/Password, then **Add user** for each admin.
   - **Firestore Database:** create it in production mode.
   - **Storage:** create the default bucket.
3. **Make someone an admin.** In Firestore, create the collection `admins`. Add a document whose **ID is the admin user's UID** (shown in Authentication → Users). The fields can be anything, for example `name: "Al-Amin"`.
4. **Deploy the security rules** with the Firebase CLI:
   ```
   npm i -g firebase-tools
   firebase login
   firebase use --add            # pick your project
   firebase deploy --only firestore:rules,storage
   ```
5. **Import the content.** Open `admin.html`, sign in, and click **Import current site content**. This copies the 12 built-in expertise items into Firestore. From then on, edit them in the panel.
6. **Optional:** host the whole site on Firebase Hosting with `firebase deploy --only hosting`. If you host on icddr,b's own server instead, just upload the files. The site talks to Firebase directly from the browser.

## Security
- **Who can read:** anyone can read *published* expertise. Drafts are visible only to admins.
- **Who can write:** only users listed in `admins/{uid}` can create, edit, delete or upload. This is enforced by `firestore.rules` and `storage.rules`, not just hidden in the UI.
- **Image uploads:** images are resized in the browser to at most 1600px, must be under 5 MB, and must be an image type.
- **Search engines:** `admin.html` is marked `noindex`.
- **Before launch:** add your production domain under Authentication → Settings → Authorized domains.

## Data shape (`expertise/{slug}`)
```json
{
  "slug": "national-surveys", "order": 0, "published": true, "key": "survey",
  "title": "…", "text": "card description",
  "overview": ["paragraph", "…"], "whatWeDo": ["item", "…"], "projects": [{ "name": "eMIS", "text": "…" }], "tools": ["ODK", "SQL Server"],
  "meta": [{ "label": "Partners", "value": "…" }],
  "images": ["https://firebasestorage…/cover.jpg", "…"], "updatedAt": "ISO date"
}
```
