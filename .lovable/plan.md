
# Expense Tracker Web Application

## Overview
A clean, modern, and responsive expense tracking application with JWT authentication flow, ready to integrate with your existing REST API backend.

---

## 1. Authentication Screens

### Login Page
- Email and password input fields with validation
- "Remember me" checkbox
- Link to registration page
- Loading state during authentication
- Error handling with toast notifications

### Registration Page
- Name, email, password, and confirm password fields
- Form validation with helpful error messages
- Success notification and redirect to login
- Link back to login page

### Auth Flow
- JWT token storage in localStorage
- Authorization Bearer header setup for all API requests
- Protected routes that redirect to login if not authenticated
- Session persistence across page refreshes

---

## 2. Dashboard (Home Page)

### Summary Cards
- **Total Expenses** - All-time spending total
- **This Month** - Current month's total
- **Average Daily** - This month's daily average

### Charts Section
- **Donut Chart** - Category-wise spending breakdown with percentages
- **Line Chart** - Monthly expense trends over time (last 6-12 months)

### Quick Actions
- "Add New Expense" button
- View recent expenses list (last 5)

---

## 3. Expense Management

### Expense List Page
- Table/card view of all expenses
- Columns: Date, Category, Description, Amount
- **Filters**: Date range, category, amount range
- **Search**: By description
- **Pagination**: 10/20/50 items per page
- Sort by date, amount, or category

### Add/Edit Expense Modal
- Amount input (currency formatted)
- Category dropdown (default + custom)
- Description text field
- Date picker (defaults to today)
- Save/Cancel buttons with loading states

### Delete Confirmation
- Confirmation dialog before deletion
- Toast notification on success

---

## 4. Category Management

### Category List
- Display all categories with icons
- **Default Categories** (protected, with lock indicator):
  - Food, Transport, Shopping, Entertainment, Bills, Healthcare, Education
- **Custom Categories**: User-created, can be edited/deleted

### Add Custom Category
- Name input
- Optional icon/color selection
- Validation for duplicate names

---

## 5. Navigation & Layout

### Top Navigation Bar
- App logo/name on left
- Navigation links: Dashboard, Expenses, Categories
- User info display (name/email) on right
- Logout button

### Responsive Design
- Collapsible mobile menu (hamburger)
- Cards stack vertically on mobile
- Touch-friendly buttons and inputs

---

## 6. UI/UX Features

### Visual Design
- Professional blue-based color theme
- Clean white backgrounds with subtle shadows
- Consistent spacing and typography
- Rounded corners for a modern feel

### Feedback & States
- Loading spinners during API calls
- Toast notifications for all actions (success/error)
- Empty states with helpful messages
- Form validation with inline errors

### API Integration Ready
- Service layer with mock data
- Easy-to-replace API endpoints
- Authorization header interceptor setup
- Consistent error handling pattern

---

## Pages Structure
1. `/auth` - Login/Register (public)
2. `/` - Dashboard (protected)
3. `/expenses` - Expense list with CRUD (protected)
4. `/categories` - Category management (protected)

This will give you a fully functional frontend with mock data that can be easily connected to your REST API by updating the service layer endpoints.
