# RED FLAG mobile

The app uses Expo SDK 57, TypeScript, and Expo Router. Use a phone with a compatible Expo Go version for daily development. The browser preview is useful for checking the login flow locally.

## Get started

Install [Node.js 24.22.2 LTS](https://nodejs.org/en/blog/release/v24.22.2), then run these commands from the repository root:

```powershell
Set-Location Frontend
node --version
npm.cmd ci
npm.cmd start
```

Scan the QR code from `npm.cmd start` in [Expo Go for SDK 57](https://expo.dev/go?sdkVersion=57) while your phone and computer are on the same Wi-Fi. The `npm.cmd run web` command binds the preview to your computer's loopback address. For phone testing, look for an `exp://` URL with your computer’s Wi-Fi IP address in the terminal. If port 8081 is occupied by a browser preview, use `npm.cmd start -- --port 8082`.

On macOS or Linux, use `npm` in place of `npm.cmd`.

If this checkout already has the portable Windows Node runtime in `.local/`, add it to the current PowerShell session after entering `Frontend/`:

```powershell
$nodeDir = Get-ChildItem -LiteralPath .local -Directory -Filter 'node-v24.22.2-win-*' | Select-Object -First 1
$env:Path = "$($nodeDir.FullName);$env:Path"
```

Run `npm.cmd run typecheck` before opening a PR. Keep native settings in `app.json` and use `npx.cmd expo install <package>` for Expo and React Native packages.

## Try login

With no `EXPO_PUBLIC_API_URL` set, the development server uses a mock:

| Check | Input and result |
| --- | --- |
| Validation | Submit empty fields to see field-level errors. |
| Success | Use `demo@redflag.test` and `redflag-demo` to reach the signed-in screen. |
| Invalid credentials | Enter the demo email with a different password to see a sign-in error. |
| Connection failure | Use `offline@redflag.test` with any nonempty password. Edit the email and retry. |
| Session | Sign out to return to Login. A full restart also clears the in-memory session. |

For API integration, copy `.env.example` to `.env.local`, set `EXPO_PUBLIC_API_URL` to the team’s API origin, and restart Expo. The app posts to `/api/auth/login`. The URL is public configuration. Keep credentials and server secrets out of the environment file. The browser requires the API to allow its origin when testing the real API.

## Work on the UI

- `src/app/` contains route pages and the root layout. Add the registration page alongside `login.tsx` in `(auth)` and include it under the signed-out guard in the root stack.
- `src/ui/` contains atoms, molecules, organisms, and templates. Registration can reuse `AuthTemplate`, `LabeledField`, `PasswordField`, and `Button`.
- `src/theme/` owns shared colors and spacing. `src/features/auth/` owns API calls and session state.
- `app.json` and `assets/flag.png` define the native splash. Check it on a cold launch of a release-mode build because Expo Go shows its own launch screen.
