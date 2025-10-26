# 🚀 Topics Feature - Setup Instructions

## ✅ Quick Start

### Step 1: Start Backend Server
```bash
cd backend
npm run dev
```

Expected output:
```
✅ .env loaded successfully
MongoDB connected
Server running on port 5000
✅ Groq AI initialized successfully
```

### Step 2: Start Frontend Server
```bash
cd frontend
npm run dev
```

Expected output:
```
VITE v... ready in ... ms
➜  Local:   http://localhost:5173/
```

### Step 3: Login as Admin
```
Email: admin@codebattle.com
Password: admin123456
```

---

## 📚 Create Your First Topic

### Method 1: Using Admin Panel (Recommended)

1. **Navigate to Admin Panel**
   - Click "Admin" button (top right)
   - Or go to http://localhost:5173/admin

2. **Go to Topics Tab**
   - Click "Topics" tab in admin panel

3. **Create Topic**
   - Click "Add Topic" button
   - Fill in form:
     - **Name**: Arrays
     - **Description**: Master array manipulation and common array problems
     - **Icon**: 📦
     - **Color**: blue
   - Click "Create Topic"

4. **Verify**
   - Topic appears in list
   - Shows 0 problems initially

### Method 2: Using API

```bash
curl -X POST http://localhost:5000/api/admin/topics \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Arrays",
    "description": "Master array manipulation",
    "icon": "📦",
    "color": "blue"
  }'
```

---

## 🔗 Add Problems to Topic

### Method 1: Using API

```bash
# First, get topic ID and problem ID
# Then add problem to topic

curl -X POST http://localhost:5000/api/admin/topics/TOPIC_ID/problems/PROBLEM_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Method 2: Using MongoDB

```javascript
// Connect to MongoDB
db.topics.findOne({ name: "Arrays" })
// Get the _id

db.problems.findOne({ title: "Two Sum" })
// Get the _id

// Update topic
db.topics.updateOne(
  { _id: ObjectId("TOPIC_ID") },
  {
    $push: { problems: ObjectId("PROBLEM_ID") },
    $inc: { problemCount: 1 }
  }
)

// Update problem
db.problems.updateOne(
  { _id: ObjectId("PROBLEM_ID") },
  { $set: { topic: ObjectId("TOPIC_ID") } }
)
```

---

## 👥 Test as User

### 1. **Browse Topics**
   - Go to Dashboard
   - Click "Topics" card
   - Or navigate to http://localhost:5173/topics

### 2. **Select Topic**
   - Click on any topic card
   - See all problems in that topic

### 3. **Filter Problems**
   - Click "Easy", "Medium", or "Hard"
   - See filtered problems

### 4. **Start Practice**
   - Click "Practice" button
   - Redirects to code editor
   - Starts solo practice match

---

## 📊 Recommended Topics to Create

Create these topics for a complete experience:

| Topic | Icon | Color | Description |
|-------|------|-------|-------------|
| Arrays | 📦 | blue | Array manipulation problems |
| Strings | 📝 | purple | String processing problems |
| Trees | 🌳 | green | Tree traversal problems |
| Graphs | 🔗 | cyan | Graph algorithms |
| Dynamic Programming | 🧮 | yellow | DP optimization problems |
| Sorting & Searching | 🔍 | red | Search and sort algorithms |
| Hash Tables | 🗂️ | pink | Hash table problems |
| Linked Lists | ⛓️ | indigo | Linked list operations |

---

## 🧪 Test Checklist

- [ ] Backend server running
- [ ] Frontend server running
- [ ] Can login as admin
- [ ] Can access Admin Panel
- [ ] Can see Topics tab
- [ ] Can create topic
- [ ] Topic appears in list
- [ ] Can delete topic
- [ ] Can navigate to Topics page
- [ ] Can see topics grid
- [ ] Can select topic
- [ ] Can see problems in topic
- [ ] Can filter by difficulty
- [ ] Can start practice from topic
- [ ] Code editor loads correctly

---

## 🔍 Verify in Database

### Check Topics Created
```javascript
db.topics.find({})
```

### Check Problems with Topics
```javascript
db.problems.find({ topic: { $ne: null } })
```

### Check Topic Stats
```javascript
db.topics.findOne({ name: "Arrays" })
// Should show:
// - problems: [array of problem IDs]
// - problemCount: number
// - difficulty: { easy: X, medium: Y, hard: Z }
```

---

## 🐛 Common Issues

### Issue: Topics not showing in admin panel
**Solution:**
- Refresh page
- Check browser console for errors
- Verify backend is running
- Check MongoDB connection

### Issue: Can't create topic
**Solution:**
- Verify you're logged in as admin
- Check all form fields are filled
- Topic name must be unique
- Check backend logs for errors

### Issue: Problems not appearing in topic
**Solution:**
- Use API to add problems to topic
- Verify problem ID exists
- Verify topic ID exists
- Check MongoDB for relationships

### Issue: Difficulty counts not updating
**Solution:**
- Refresh page
- Check backend logs
- Verify problem difficulty is valid (Easy/Medium/Hard)

---

## 📱 Access Points

### User Access
- Dashboard → Topics card
- Direct: http://localhost:5173/topics
- From topic: Click "Practice" button

### Admin Access
- Dashboard → Admin button
- Direct: http://localhost:5173/admin
- Topics Tab in Admin Panel

---

## 🎯 Next Steps

1. ✅ Create 3-5 topics
2. ✅ Add 5-10 problems to each topic
3. ✅ Test browsing topics
4. ✅ Test filtering by difficulty
5. ✅ Test starting practice
6. ✅ Verify code editor loads
7. ✅ Test problem submission

---

## 📞 Support

If you encounter issues:
1. Check browser console (F12)
2. Check backend logs
3. Verify MongoDB is running
4. Verify all servers are running
5. Try refreshing the page
6. Clear browser cache

---

**Ready to go!** 🚀

Start creating topics and organizing your problems!

