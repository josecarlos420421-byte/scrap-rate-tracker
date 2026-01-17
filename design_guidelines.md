# Scrap Rate Tracker - Design Guidelines

## Brand Identity

**Purpose**: Daily scrap rate management app for dealers and businesses to track and update metal/material prices quickly.

**Aesthetic Direction**: Industrial Professional - Clean, bold, and utilitarian like a digital ledger. High-contrast typography emphasizes price readability. Professional enough for business use, simple enough for daily updates.

**Memorable Element**: Large, bold price displays with currency formatting that feels like a market board. Quick-edit interaction pattern - tap any rate to update instantly.

## Navigation Architecture

**Root Navigation**: Tab Bar (3 tabs)
- **Rates** (Home icon) - Main screen with list of all material rates
- **Add Rate** (Plus icon, center) - Floating action to add new material/rate
- **Profile** (User icon) - Settings and customization

## Screen-by-Screen Specifications

### 1. Rates Screen (Main)
**Purpose**: View and quickly update all current scrap rates

**Layout**:
- Header: Transparent, title "Rates", right button (filter/sort icon)
- Main: Scrollable list of rate cards
- Safe area: top = headerHeight + Spacing.xl, bottom = tabBarHeight + Spacing.xl

**Components**:
- Rate Cards (each card shows):
  - Material name (large, bold)
  - Current rate (extra large, primary color)
  - Unit (small, secondary text) - e.g., "per kg"
  - Last updated timestamp (small, muted)
  - Tap card to edit inline
- Pull-to-refresh
- Empty state: Shows empty-rates.png illustration with "Add your first scrap rate" message

### 2. Add/Edit Rate Screen (Modal)
**Purpose**: Add new material or edit existing rate

**Layout**:
- Header: Default navigation, title "Add Rate" or "Edit Rate", left button (Cancel), right button (Save)
- Main: Scrollable form
- Safe area: top = Spacing.xl, bottom = insets.bottom + Spacing.xl

**Components**:
- Form fields:
  - Material name input
  - Rate input (numeric, large text)
  - Unit picker (kg, ton, piece, etc.)
  - Notes input (optional)
- Submit/Cancel in header

### 3. Profile Screen
**Purpose**: User customization and app settings

**Layout**:
- Header: Default navigation, title "Profile"
- Main: Scrollable
- Safe area: top = Spacing.xl, bottom = tabBarHeight + Spacing.xl

**Components**:
- User section:
  - Avatar (preset generated)
  - Display name input
- Settings:
  - Currency selection
  - Default unit
  - Notification preferences
  - Theme toggle (light/dark)

## Color Palette

**Primary**: #1A5F7A (Deep Teal - professional, trustworthy)
**Accent**: #F57C00 (Warm Orange - action, update)
**Background**: #FAFAFA (Light) / #121212 (Dark)
**Surface**: #FFFFFF (Light) / #1E1E1E (Dark)
**Text Primary**: #1A1A1A (Light) / #E0E0E0 (Dark)
**Text Secondary**: #6B6B6B (Light) / #A0A0A0 (Dark)
**Border**: #E0E0E0 (Light) / #333333 (Dark)
**Success**: #2E7D32 (Price increase)
**Error**: #C62828 (Price decrease)

## Typography

**Font**: System (SF Pro for iOS, Roboto for Android) with strong weight hierarchy
**Scale**:
- Price Display: 34pt, Bold
- Material Name: 20pt, Semibold
- Body: 16pt, Regular
- Caption: 13pt, Regular

## Visual Design

- Rate cards: Surface color with 1px border, 12px corner radius, tap feedback with slight scale
- Floating Add button: Accent color with shadow (offset: 0,2, opacity: 0.10, radius: 2)
- Icons: Feather icons from @expo/vector-icons
- Input fields: Underline style for minimalism
- All touchable elements have opacity feedback (0.7 when pressed)

## Assets to Generate

1. **icon.png** - App icon with stylized "₨" or scale symbol in primary color
   - WHERE: Device home screen

2. **splash-icon.png** - Same icon on splash screen
   - WHERE: App launch

3. **empty-rates.png** - Industrial/minimal illustration of empty clipboard or ledger
   - WHERE: Rates screen when no rates added yet

4. **avatar-default.png** - Simple circular avatar with user silhouette
   - WHERE: Profile screen