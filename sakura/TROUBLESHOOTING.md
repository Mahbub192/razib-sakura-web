# Troubleshooting Guide

## 404 Error on Patient Dashboard

If you're getting a 404 error on `http://localhost:3000/patient/dashboard`, try these solutions:

### Solution 1: Restart Development Server

1. **Stop the current server** (Press `Ctrl + C` in terminal)
2. **Clear Next.js cache:**
   ```bash
   rm -rf .next
   ```
3. **Restart the server:**
   ```bash
   npm run dev
   ```

### Solution 2: Check if Server is Running

Make sure the development server is running:
```bash
cd sakura
npm run dev
```

You should see:
```
▲ Next.js 14.2.33
- Local:        http://localhost:3000
```

### Solution 3: Verify File Structure

Make sure the file exists:
```bash
ls -la app/patient/dashboard/page.tsx
```

### Solution 4: Check for Build Errors

Run a build to check for errors:
```bash
npm run build
```

### Solution 5: Check Browser Console

Open browser DevTools (F12) and check:
- Console for JavaScript errors
- Network tab for failed requests

### Solution 6: Verify Port

Make sure you're using the correct port. Check terminal output for the actual port number.

### Solution 7: Clear Browser Cache

- Hard refresh: `Ctrl + Shift + R` (Windows/Linux) or `Cmd + Shift + R` (Mac)
- Or clear browser cache

### Solution 8: Check Import Paths

Verify that the import path is correct in `app/patient/dashboard/page.tsx`:
```typescript
import { PatientSidebar } from '@/components/layout/PatientSidebar'
```

Make sure `tsconfig.json` has the path alias:
```json
"paths": {
  "@/*": ["./*"]
}
```

---

## Common Issues

### Issue: "Module not found"
**Solution:** Restart dev server and clear `.next` folder

### Issue: "Cannot find component"
**Solution:** Check import paths and file locations

### Issue: "404 on all routes"
**Solution:** Make sure you're in the `sakura` directory when running `npm run dev`

---

## Quick Fix Commands

```bash
# Navigate to project
cd sakura

# Clear cache
rm -rf .next

# Reinstall dependencies (if needed)
npm install

# Start dev server
npm run dev
```

---

## Verify Routes are Working

After restarting, test these URLs:
- `http://localhost:3000/` - Home page
- `http://localhost:3000/patient/dashboard` - Patient dashboard
- `http://localhost:3000/auth/login` - Login page

