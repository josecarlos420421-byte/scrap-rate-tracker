# Scrap Rate Tracker

## Overview

Scrap Rate Tracker ek mobile application hai Pakistani scrap dealers ke liye jo daily market rates dekhte hain. Yeh app Expo (React Native) se bani hai cross-platform mobile support ke liye. App **JazzCash-inspired** theme follow karti hai Red/Maroon primary colors aur Gold accents ke saath.

**IMPORTANT**: Yeh app ek CENTRALIZED RATE PUBLISHING SERVICE hai:
- **Admin** (aap): Rates set karte ho server par - sab users ko same rates dikhte hain
- **Users**: Sirf rates dekhte hain (read-only) - edit ka option nahi hai

## App Flow

1. **SplashWelcome Screen**: "Assalam-o-Alaikum" greeting animation
2. **Important Notes Screen**: Zaruri Maloomat - government rules/announcements
3. **Welcome Screen**: JazzCash-style features list
4. **Subscription Screen**: Monthly payment Rs 200 via JazzCash/EasyPaisa
5. **Home Screen**: Categories list with item counts (READ-ONLY for users)
6. **Category Detail Screen**: Today's rates with 10-day history (READ-ONLY for users)
7. **Profile Screen**: User settings, subscription status, Admin Panel access
8. **Admin Panel Screen**: Rate Management - SIRF ADMIN ke liye

## Subscription System

### Payment Details
- **Monthly Fee**: Rs 200
- **Account Number**: 0329-1238790
- **Account Name**: FATIMA BIBI
- **Payment Methods**: JazzCash / EasyPaisa

### Flow
1. User pays Rs 200 via JazzCash/EasyPaisa
2. User contacts admin via WhatsApp with payment screenshot
3. Admin generates activation code from Profile → Admin Panel
4. User enters phone number, transaction ID, and activation code
5. Subscription activates for 30 days

### Admin Password
- **Password**: FATIMA2024
- Used for: Admin Panel access (both in Profile and AdminPanel screens)

## System Architecture - CENTRALIZED

### Backend (Server)
- **Database**: PostgreSQL (Neon) for central data storage
- **API**: Express.js REST API
- **Admin Auth**: Bearer token with FATIMA2024 password

### Database Schema (shared/schema.ts)
- **categories**: id, name, icon, color, sortOrder
- **rate_items**: id, categoryId, name, rate, unit, notes, rateHistory (JSON)
- **activation_codes**: id, code, isUsed, usedBy, usedAt
- **important_notes**: id, content, isActive

### API Endpoints
**Public (for all users):**
- `GET /api/categories` - Get all categories with items
- `GET /api/categories/:id` - Get single category with items
- `GET /api/notes` - Get active important notes
- `POST /api/activate` - Activate subscription with code

**Admin Only (requires Authorization header):**
- `POST /api/admin/categories` - Create category
- `PUT /api/admin/categories/:id` - Update category
- `DELETE /api/admin/categories/:id` - Delete category
- `POST /api/admin/items` - Create rate item
- `PUT /api/admin/items/:id` - Update rate (with history tracking)
- `DELETE /api/admin/items/:id` - Delete rate item
- `GET /api/activation-codes` - Get all codes
- `POST /api/admin/activation-codes` - Generate new codes
- `POST/PUT/DELETE /api/admin/notes` - Manage notes

### Frontend Architecture
- **Framework**: Expo SDK 54 with React Native 0.81
- **Data Source**: Fetches from API (not local storage for rates)
- **User Mode**: READ-ONLY - no edit/delete buttons shown
- **Admin Mode**: Full CRUD access via AdminPanel screen

### Path Aliases
- `@/` maps to `./client/`
- `@shared/` maps to `./shared/`

## Key Files

### Screens
- `client/screens/SplashWelcomeScreen.tsx` - Greeting animation
- `client/screens/ImportantNotesScreen.tsx` - Daily notes/announcements
- `client/screens/WelcomeScreen.tsx` - JazzCash-style features
- `client/screens/SubscriptionScreen.tsx` - Payment and activation
- `client/screens/HomeScreen.tsx` - Categories list (fetches from API)
- `client/screens/CategoryDetailScreen.tsx` - Items with rates (READ-ONLY)
- `client/screens/ProfileScreen.tsx` - Settings + Admin Panel access
- `client/screens/AdminPanelScreen.tsx` - Rate Management for admin

### Server
- `server/index.ts` - Express server setup
- `server/routes.ts` - API routes with admin auth
- `server/storage.ts` - Database CRUD operations
- `server/db.ts` - Drizzle PostgreSQL connection
- `server/seed.ts` - Initial data seeding script

### Database
- `shared/schema.ts` - Drizzle schema definitions
- `drizzle.config.ts` - Database configuration

## Admin Workflow

### To Update Daily Rates:
1. Open app
2. Go to Profile tab
3. Enter admin password (FATIMA2024)
4. Click "Rate Management"
5. Select category → Click item → Enter new rate → Save

### To Generate Activation Codes:
1. Go to Profile → Admin Panel
2. Click "5 Codes" or "10 Codes"
3. Share codes with customers via WhatsApp

## Design Theme - JazzCash Inspired

### Primary Colors
- **Primary**: #B71C1C (Deep Red/Maroon)
- **Primary Light**: #C62828
- **Primary Dark**: #7F0000
- **Accent**: #FFC107 (Gold)

### Category Colors
Each category has unique color (see client/constants/theme.ts)

## 13 Scrap Categories
1. LOHA (Iron)
2. COPPER
3. ALUMINUM
4. PLASTIC
5. BRASS
6. BATTERY
7. PAPER
8. STEEL
9. ELECTRONICS
10. GLASS
11. RUBBER
12. SILVER
13. ZINC

## External Dependencies

### Mobile/UI
- Expo, React Navigation, expo-haptics, expo-linear-gradient
- react-native-reanimated, react-native-keyboard-controller

### Backend
- Express.js, Drizzle ORM, PostgreSQL (pg)

### Data
- AsyncStorage (for local settings/subscription only)
- Zod (schema validation)
