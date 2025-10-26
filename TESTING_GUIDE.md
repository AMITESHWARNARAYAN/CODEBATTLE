# 🧪 CodeBattle - Complete Testing Guide

## ✅ ADMIN SEEDING COMPLETE

Admin user has been successfully created with the following credentials:

```
📧 Email: admin@codebattle.com
🔐 Password: admin123456
👤 Username: admin
```

Test users also created:
- testuser1@codebattle.com / test123456
- testuser2@codebattle.com / test123456

---

## 🚀 SERVERS STATUS

✅ **Backend Server**: Running on http://localhost:5000
✅ **Frontend Server**: Running on http://localhost:5173
✅ **MongoDB**: Connected

---

## 📋 TESTING CHECKLIST

### **1️⃣ ADMIN LOGIN & DASHBOARD**

**Steps:**
1. Go to http://localhost:5173
2. Click "Register" or go to login page
3. Login with admin credentials:
   - Email: `admin@codebattle.com`
   - Password: `admin123456`
4. On Dashboard, verify "Admin" button appears in top-right header

**Expected Results:**
- ✅ Login successful
- ✅ Dashboard loads with user stats
- ✅ "Admin" button visible in header (purple button with settings icon)
- ✅ Regular users should NOT see the Admin button

---

### **2️⃣ ADMIN PANEL - PROBLEM MANAGEMENT**

**Steps:**
1. Click "Admin" button in Dashboard header
2. You should see the Admin Panel with two tabs: "Problems" and "Statistics"
3. Click "Add Problem" button
4. Fill in the form with sample data:

```
Title: Palindrome Check
Description: Check if a string is a palindrome
Difficulty: Easy
Tags: String, Two Pointers
Constraints: 1 <= s.length <= 10^5
Examples: [{"input": "racecar", "output": "true", "explanation": "It reads the same forwards and backwards"}]
Test Cases: [{"input": "\"racecar\"", "expectedOutput": "true", "isHidden": false}, {"input": "\"hello\"", "expectedOutput": "false", "isHidden": false}]
Function Signature: {"javascript": "function isPalindrome(s) { /* your code here */ }"}
Time Limit: 2000
Memory Limit: 256
```

5. Click "Create Problem"

**Expected Results:**
- ✅ Form validates all required fields
- ✅ Problem created successfully (toast notification)
- ✅ Problem appears in the problems list below
- ✅ Problem shows title, description, difficulty badge, and submission count

---

### **3️⃣ ADMIN PANEL - VIEW PROBLEMS**

**Steps:**
1. In Admin Panel, scroll down to see the problems list
2. Verify the newly created problem appears
3. Check that problem details are displayed correctly

**Expected Results:**
- ✅ Problem list shows all created problems
- ✅ Each problem shows: Title, Description preview, Difficulty badge, Submission count
- ✅ Delete button (trash icon) is visible for each problem

---

### **4️⃣ ADMIN PANEL - DELETE PROBLEM**

**Steps:**
1. In the problems list, find a problem
2. Click the trash icon (delete button)
3. Confirm the deletion dialog
4. Verify problem is removed from list

**Expected Results:**
- ✅ Confirmation dialog appears
- ✅ Problem is deleted from database
- ✅ Problem disappears from list
- ✅ Success toast notification shown

---

### **5️⃣ ADMIN PANEL - STATISTICS**

**Steps:**
1. Click "Statistics" tab in Admin Panel
2. View the statistics dashboard

**Expected Results:**
- ✅ Three stat cards displayed:
  - Total Users (should show 3: admin + 2 test users)
  - Total Problems (should show created problems)
  - Total Admins (should show 1)

---

### **6️⃣ SOLO PRACTICE - VERIFY PROBLEMS AVAILABLE**

**Steps:**
1. Logout from admin account
2. Login as testuser1 (testuser1@codebattle.com / test123456)
3. Click "Solo Practice" on Dashboard
4. Verify a problem loads (could be admin-created or seeded problem)
5. Try to submit code

**Expected Results:**
- ✅ Solo practice loads a random problem
- ✅ Problem details display correctly
- ✅ Code editor is functional
- ✅ Can submit code and see test results

---

### **7️⃣ GIVE UP FEATURE - MATCHMAKING**

**Steps:**
1. Keep testuser1 logged in
2. Click "Matchmaking" on Dashboard
3. Click "Find Opponent" button
4. Wait for opponent to be found (or open another browser/incognito with testuser2)
5. Once in CodeEditor with opponent:
   - Verify "Give Up" button appears (red button with flag icon)
   - Click "Give Up" button
   - Confirm the dialog

**Expected Results:**
- ✅ "Give Up" button visible in CodeEditor (only for matchmaking/friend matches)
- ✅ Confirmation dialog appears: "Are you sure you want to give up? Your opponent will win!"
- ✅ After confirmation, match ends immediately
- ✅ Redirects to results page
- ✅ Results show opponent as winner
- ✅ ELO ratings updated (opponent gains points, you lose points)

---

### **8️⃣ GIVE UP FEATURE - FRIEND CHALLENGE**

**Steps:**
1. Login as testuser1
2. Click "Challenge Friend" on Dashboard
3. Enter testuser2's email: `testuser2@codebattle.com`
4. Click "Send Challenge"
5. Open another browser/incognito and login as testuser2
6. Accept the challenge from testuser1
7. In CodeEditor, click "Give Up" button
8. Confirm

**Expected Results:**
- ✅ Challenge sent successfully
- ✅ testuser2 receives challenge notification
- ✅ testuser2 can accept challenge
- ✅ Both players enter CodeEditor
- ✅ "Give Up" button visible
- ✅ After giving up, opponent wins
- ✅ Results page shows correct winner and rating changes

---

### **9️⃣ GIVE UP FEATURE - SOLO PRACTICE (SHOULD NOT WORK)**

**Steps:**
1. Click "Solo Practice"
2. Look for "Give Up" button

**Expected Results:**
- ✅ "Give Up" button should NOT appear in solo practice
- ✅ Only "Submit Code" button visible

---

### **🔟 ADMIN CANNOT GIVE UP IN SOLO**

**Steps:**
1. Login as admin
2. Click "Solo Practice"
3. Verify "Give Up" button is not visible

**Expected Results:**
- ✅ "Give Up" button not visible in solo practice
- ✅ Only "Submit Code" button visible

---

## 🔍 VERIFICATION CHECKLIST

### Backend Endpoints

- [ ] `POST /api/auth/login` - Returns `isAdmin` field
- [ ] `POST /api/auth/register` - Returns `isAdmin` field
- [ ] `POST /api/matches/:matchId/giveup` - Ends match, declares opponent winner
- [ ] `POST /api/admin/problems` - Creates problem (admin only)
- [ ] `GET /api/admin/problems` - Gets all problems (admin only)
- [ ] `PUT /api/admin/problems/:id` - Updates problem (admin only)
- [ ] `DELETE /api/admin/problems/:id` - Deletes problem (admin only)
- [ ] `GET /api/admin/stats` - Gets statistics (admin only)

### Frontend Features

- [ ] Admin button appears in Dashboard for admin users
- [ ] Admin button does NOT appear for regular users
- [ ] Admin page accessible at `/admin`
- [ ] Non-admin users redirected from `/admin`
- [ ] Problem creation form validates JSON fields
- [ ] Problems list displays correctly
- [ ] Delete button works
- [ ] Statistics tab shows correct counts
- [ ] Give Up button appears in matchmaking/friend matches
- [ ] Give Up button does NOT appear in solo practice
- [ ] Give Up confirmation dialog works
- [ ] After giving up, opponent wins
- [ ] ELO ratings updated correctly

---

## 🐛 TROUBLESHOOTING

### Issue: Admin button not appearing
**Solution:** 
- Clear browser cache and localStorage
- Logout and login again
- Check that `isAdmin: true` is set in database

### Issue: Cannot create problem
**Solution:**
- Verify JSON format is valid
- Check browser console for error messages
- Ensure all required fields are filled

### Issue: Give Up button not working
**Solution:**
- Verify you're in a matchmaking or friend match (not solo)
- Check browser console for errors
- Ensure match is still in progress

### Issue: ELO ratings not updating
**Solution:**
- Check backend logs for errors
- Verify both players are in the match
- Check that match status is 'in-progress'

---

## 📊 DATABASE VERIFICATION

To verify data in MongoDB:

```javascript
// Check admin user
db.users.findOne({ email: "admin@codebattle.com" })

// Check test users
db.users.find({ email: { $in: ["testuser1@codebattle.com", "testuser2@codebattle.com"] } })

// Check created problems
db.problems.find({})

// Check matches with give up
db.matches.find({ status: "completed" })
```

---

## 🎯 SUMMARY

All three features have been implemented and are ready for testing:

1. ✅ **Give Up Feature** - Players can forfeit matches
2. ✅ **Admin System** - Admin role with protected routes
3. ✅ **Problem Management** - Admins can create/edit/delete problems

Admin user has been seeded and both servers are running.

**Start testing now!** 🚀

