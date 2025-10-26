# 🚀 CodeBattle - Quick Start Guide

## 🎯 WHAT'S NEW

Three major features have been added to CodeBattle:

1. **Give Up Feature** - Players can forfeit matches
2. **Admin System** - Admin role with protected routes
3. **Problem Management** - Admins can manage problems

---

## 🔐 ADMIN CREDENTIALS

```
📧 Email: admin@codebattle.com
🔐 Password: admin123456
👤 Username: admin
```

---

## 🧪 TEST USERS

```
👤 testuser1@codebattle.com / test123456
👤 testuser2@codebattle.com / test123456
```

---

## 🚀 GETTING STARTED

### 1. Start Backend Server
```bash
cd backend
npm run dev
```
✅ Server runs on http://localhost:5000

### 2. Start Frontend Server
```bash
cd frontend
npm run dev
```
✅ Frontend runs on http://localhost:5173

### 3. Open Browser
```
http://localhost:5173
```

---

## 📋 FEATURE OVERVIEW

### 🎮 GIVE UP FEATURE

**Where:** In CodeEditor during matchmaking or friend challenges

**How to Use:**
1. Start a matchmaking or friend challenge match
2. Click the red "Give Up" button (with flag icon)
3. Confirm the dialog
4. Opponent wins immediately
5. ELO ratings updated
6. Redirects to results page

**Key Points:**
- ❌ Cannot give up in solo practice
- ✅ Only works in matchmaking/friend matches
- ✅ Opponent declared winner instantly
- ✅ Ratings updated correctly

---

### 👑 ADMIN SYSTEM

**Access:** Dashboard → Admin button (top-right)

**Admin Features:**
1. **Problem Management**
   - Create new problems
   - View all problems
   - Edit problem details
   - Delete problems

2. **Statistics Dashboard**
   - Total users count
   - Total problems count
   - Total admins count

**Key Points:**
- ✅ Only admins see the Admin button
- ✅ Admin page at `/admin`
- ✅ Protected by admin middleware
- ✅ Non-admins redirected

---

### 📝 PROBLEM MANAGEMENT

**Access:** Admin Panel → Problems Tab

**Create Problem:**
1. Click "Add Problem" button
2. Fill in form:
   - Title
   - Description
   - Difficulty (Easy/Medium/Hard)
   - Tags (comma-separated)
   - Constraints
   - Examples (JSON array)
   - Test Cases (JSON array)
   - Function Signatures (JSON)
   - Time/Memory Limits
3. Click "Create Problem"

**Problem Format Example:**
```json
{
  "title": "Two Sum",
  "description": "Find two numbers that add up to target",
  "difficulty": "Easy",
  "tags": ["Array", "Hash Table"],
  "testCases": [
    {
      "input": "{\"nums\": [2,7,11,15], \"target\": 9}",
      "expectedOutput": "[0,1]",
      "isHidden": false
    }
  ],
  "functionSignature": {
    "javascript": "function twoSum(nums, target) {}"
  }
}
```

---

## 🧪 QUICK TEST

### Test 1: Admin Login
1. Go to http://localhost:5173
2. Click "Login"
3. Enter: admin@codebattle.com / admin123456
4. Verify "Admin" button appears in header

### Test 2: Create Problem
1. Click "Admin" button
2. Click "Add Problem"
3. Fill in sample data
4. Click "Create Problem"
5. Verify problem appears in list

### Test 3: Give Up
1. Login as testuser1
2. Click "Matchmaking"
3. Click "Find Opponent"
4. Wait for match (or use another browser with testuser2)
5. Click "Give Up" button
6. Confirm dialog
7. Verify opponent wins

---

## 📊 API ENDPOINTS

### Admin Endpoints
```
POST   /api/admin/problems              - Create problem
GET    /api/admin/problems              - Get all problems
PUT    /api/admin/problems/:id          - Update problem
DELETE /api/admin/problems/:id          - Delete problem
GET    /api/admin/stats                 - Get statistics
POST   /api/admin/make-admin/:userId    - Make user admin
POST   /api/admin/remove-admin/:userId  - Remove admin
```

### Match Endpoints
```
POST   /api/matches/:matchId/giveup     - Give up in match
```

---

## 🔧 TROUBLESHOOTING

### Admin button not showing?
- Clear browser cache
- Logout and login again
- Check isAdmin is true in database

### Cannot create problem?
- Verify JSON format is valid
- Check all required fields filled
- Look at browser console for errors

### Give Up button not working?
- Verify you're in matchmaking/friend match
- Check match is still in progress
- Refresh page if needed

---

## 📚 DOCUMENTATION

- **TESTING_GUIDE.md** - Detailed testing instructions
- **TEST_API_ENDPOINTS.md** - API endpoint testing
- **IMPLEMENTATION_REPORT.md** - Full implementation details

---

## ✅ VERIFICATION CHECKLIST

- [x] Admin user seeded
- [x] Backend server running
- [x] Frontend server running
- [x] Admin login works
- [x] Admin button visible
- [x] Problem creation works
- [x] Give Up feature works
- [x] ELO ratings update
- [x] All endpoints functional

---

## 🎉 YOU'RE ALL SET!

Everything is ready to use. Start testing the new features!

**Questions?** Check the documentation files or review the code comments.

**Happy Coding!** 🚀

