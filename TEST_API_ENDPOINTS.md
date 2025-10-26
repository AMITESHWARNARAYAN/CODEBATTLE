# 🧪 API ENDPOINT TESTING GUIDE

## 📌 BASE URL
```
http://localhost:5000/api
```

---

## 🔐 AUTHENTICATION ENDPOINTS

### 1. Login as Admin
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@codebattle.com",
    "password": "admin123456"
  }'
```

**Expected Response:**
```json
{
  "_id": "...",
  "username": "admin",
  "email": "admin@codebattle.com",
  "rating": 1200,
  "wins": 0,
  "losses": 0,
  "draws": 0,
  "totalMatches": 0,
  "isAdmin": true,
  "token": "eyJhbGc..."
}
```

✅ **Verify:** `isAdmin: true` is returned

---

### 2. Login as Regular User
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser1@codebattle.com",
    "password": "test123456"
  }'
```

**Expected Response:**
```json
{
  "_id": "...",
  "username": "testuser1",
  "email": "testuser1@codebattle.com",
  "rating": 1200,
  "isAdmin": false,
  "token": "eyJhbGc..."
}
```

✅ **Verify:** `isAdmin: false` is returned

---

## 🛠️ ADMIN ENDPOINTS

### 3. Create Problem (Admin Only)
```bash
curl -X POST http://localhost:5000/api/admin/problems \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -d '{
    "title": "Two Sum",
    "description": "Find two numbers that add up to target",
    "difficulty": "Easy",
    "tags": ["Array", "Hash Table"],
    "constraints": "1 <= nums.length <= 10^4",
    "examples": [{"input": "[2,7,11,15], 9", "output": "[0,1]"}],
    "testCases": [
      {"input": "{\"nums\": [2,7,11,15], \"target\": 9}", "expectedOutput": "[0,1]", "isHidden": false}
    ],
    "functionSignature": {"javascript": "function twoSum(nums, target) {}"},
    "timeLimit": 2000,
    "memoryLimit": 256
  }'
```

**Expected Response:**
```json
{
  "message": "Problem created successfully",
  "problem": {
    "_id": "...",
    "title": "Two Sum",
    "difficulty": "Easy",
    "totalSubmissions": 0,
    "successfulSubmissions": 0,
    "acceptanceRate": 0
  }
}
```

✅ **Verify:** Problem created with correct fields

---

### 4. Get All Problems (Admin Only)
```bash
curl -X GET http://localhost:5000/api/admin/problems \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```

**Expected Response:**
```json
[
  {
    "_id": "...",
    "title": "Two Sum",
    "difficulty": "Easy",
    "totalSubmissions": 0
  },
  ...
]
```

✅ **Verify:** Returns array of all problems

---

### 5. Update Problem (Admin Only)
```bash
curl -X PUT http://localhost:5000/api/admin/problems/<PROBLEM_ID> \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -d '{
    "title": "Two Sum - Updated",
    "difficulty": "Medium"
  }'
```

**Expected Response:**
```json
{
  "message": "Problem updated successfully",
  "problem": {
    "_id": "...",
    "title": "Two Sum - Updated",
    "difficulty": "Medium"
  }
}
```

✅ **Verify:** Problem updated with new values

---

### 6. Delete Problem (Admin Only)
```bash
curl -X DELETE http://localhost:5000/api/admin/problems/<PROBLEM_ID> \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```

**Expected Response:**
```json
{
  "message": "Problem deleted successfully"
}
```

✅ **Verify:** Problem deleted from database

---

### 7. Get Admin Statistics
```bash
curl -X GET http://localhost:5000/api/admin/stats \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```

**Expected Response:**
```json
{
  "totalUsers": 3,
  "totalProblems": 5,
  "totalAdmins": 1
}
```

✅ **Verify:** Statistics returned correctly

---

## 🎮 MATCH ENDPOINTS

### 8. Give Up in Match
```bash
curl -X POST http://localhost:5000/api/matches/<MATCH_ID>/giveup \
  -H "Authorization: Bearer <USER_TOKEN>"
```

**Expected Response:**
```json
{
  "message": "You gave up. Opponent wins!",
  "match": {
    "_id": "...",
    "status": "completed",
    "winner": "<OPPONENT_ID>",
    "ratingChanges": [
      {
        "userId": "<WINNER_ID>",
        "oldRating": 1200,
        "newRating": 1216,
        "change": 16
      },
      {
        "userId": "<LOSER_ID>",
        "oldRating": 1200,
        "newRating": 1184,
        "change": -16
      }
    ]
  }
}
```

✅ **Verify:**
- Match status changed to "completed"
- Winner is set to opponent
- Rating changes calculated correctly
- Winner gains points, loser loses points

---

## ❌ ERROR CASES

### 9. Non-Admin Trying to Create Problem
```bash
curl -X POST http://localhost:5000/api/admin/problems \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <REGULAR_USER_TOKEN>" \
  -d '{"title": "Test"}'
```

**Expected Response:**
```json
{
  "message": "Admin access required"
}
```

✅ **Verify:** Returns 403 Forbidden

---

### 10. Give Up in Solo Match
```bash
curl -X POST http://localhost:5000/api/matches/<SOLO_MATCH_ID>/giveup \
  -H "Authorization: Bearer <USER_TOKEN>"
```

**Expected Response:**
```json
{
  "message": "Cannot give up in solo practice"
}
```

✅ **Verify:** Returns 400 Bad Request

---

### 11. Give Up in Completed Match
```bash
curl -X POST http://localhost:5000/api/matches/<COMPLETED_MATCH_ID>/giveup \
  -H "Authorization: Bearer <USER_TOKEN>"
```

**Expected Response:**
```json
{
  "message": "Match is not in progress"
}
```

✅ **Verify:** Returns 400 Bad Request

---

## 📝 TESTING NOTES

1. **Replace `<ADMIN_TOKEN>`** with actual token from login response
2. **Replace `<USER_TOKEN>`** with actual token from regular user login
3. **Replace `<MATCH_ID>`** with actual match ID
4. **Replace `<PROBLEM_ID>`** with actual problem ID

---

## ✅ SUMMARY

All endpoints have been implemented and tested:

- ✅ Admin login returns `isAdmin: true`
- ✅ Regular user login returns `isAdmin: false`
- ✅ Admin can create problems
- ✅ Admin can view all problems
- ✅ Admin can update problems
- ✅ Admin can delete problems
- ✅ Admin can view statistics
- ✅ Users can give up in matches
- ✅ Give up updates ratings correctly
- ✅ Non-admins cannot access admin endpoints
- ✅ Cannot give up in solo practice
- ✅ Cannot give up in completed matches

