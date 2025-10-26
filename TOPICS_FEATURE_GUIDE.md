# 📚 Topics Feature - Complete Guide

## ✅ Overview

CodeBattle now includes a **LeetCode-style Topics system** that allows users to practice problems organized by topics, and admins to manage topics and assign problems to them.

---

## 🎯 Features Implemented

### 1. **Topic Model** ✅
- Topic name (unique)
- Description
- Icon (emoji)
- Color (for styling)
- Problems array (linked problems)
- Problem count
- Difficulty breakdown (Easy, Medium, Hard)
- Timestamps

### 2. **Backend Routes** ✅

#### Public Routes (Protected)
- `GET /api/topics` - Get all topics
- `GET /api/topics/:topicId` - Get topic with problems
- `GET /api/topics/:topicId/problems` - Get problems for topic (with difficulty filter)

#### Admin Routes
- `POST /api/admin/topics` - Create topic
- `GET /api/admin/topics` - Get all topics (admin view)
- `PUT /api/admin/topics/:topicId` - Update topic
- `DELETE /api/admin/topics/:topicId` - Delete topic
- `POST /api/admin/topics/:topicId/problems/:problemId` - Add problem to topic
- `DELETE /api/admin/topics/:topicId/problems/:problemId` - Remove problem from topic

### 3. **Frontend Pages** ✅

#### Topics Page (`/topics`)
- Browse all topics in a grid
- Click topic to see problems
- Filter problems by difficulty
- Start practice directly from topic
- Beautiful gradient cards with icons

#### Admin Panel - Topics Tab
- Create new topics with form
- View all topics with stats
- Delete topics
- See difficulty breakdown per topic
- Problem count display

#### Dashboard Update
- Added "Topics" quick link
- Navigate to topics page easily

### 4. **Database Updates** ✅
- Problem model now has `topic` field
- Topic model created with all necessary fields
- Relationships properly established

---

## 🚀 How to Use

### For Users

#### 1. **Browse Topics**
```
Dashboard → Topics (Quick Link)
or
Navigate to /topics
```

#### 2. **Select a Topic**
- Click on any topic card
- See all problems in that topic
- View problem count and difficulty breakdown

#### 3. **Filter by Difficulty**
- Click: All, Easy, Medium, or Hard
- See only problems of that difficulty

#### 4. **Start Practice**
- Click "Practice" button on any problem
- Starts solo practice match
- Redirects to code editor

---

### For Admins

#### 1. **Create Topic**
```
Admin Panel → Topics Tab → Add Topic
```

**Form Fields:**
- Topic Name (required, unique)
- Description (required)
- Icon (emoji, default: 📚)
- Color (indigo, blue, purple, pink, green, yellow, red, cyan)

#### 2. **View Topics**
- See all created topics
- View problem count per topic
- See difficulty breakdown
- Easy, Medium, Hard counts

#### 3. **Delete Topic**
- Click trash icon on topic
- Confirm deletion
- All problems in topic are unlinked (not deleted)

#### 4. **Add Problems to Topic**
```
API Endpoint:
POST /api/admin/topics/:topicId/problems/:problemId
```

**Example:**
```bash
curl -X POST http://localhost:5000/api/admin/topics/TOPIC_ID/problems/PROBLEM_ID \
  -H "Authorization: Bearer TOKEN"
```

#### 5. **Remove Problems from Topic**
```
API Endpoint:
DELETE /api/admin/topics/:topicId/problems/:problemId
```

---

## 📊 API Endpoints

### Get All Topics
```
GET /api/topics
Headers: Authorization: Bearer TOKEN
Response: Array of topics with problem counts
```

### Get Topic with Problems
```
GET /api/topics/:topicId
Headers: Authorization: Bearer TOKEN
Response: Topic object with populated problems array
```

### Get Topic Problems (with filter)
```
GET /api/topics/:topicId/problems?difficulty=Easy
Headers: Authorization: Bearer TOKEN
Response: { topic, problems, count }
```

### Create Topic (Admin)
```
POST /api/admin/topics
Headers: Authorization: Bearer TOKEN
Body: {
  "name": "Arrays",
  "description": "Array manipulation problems",
  "icon": "📦",
  "color": "blue"
}
Response: { message, topic }
```

### Add Problem to Topic (Admin)
```
POST /api/admin/topics/:topicId/problems/:problemId
Headers: Authorization: Bearer TOKEN
Response: { message, topic }
```

---

## 🎨 UI Components

### Topics Grid
- Gradient background (color-coded)
- Icon display
- Topic name and description
- Problem count badge
- Hover effects
- Click to select

### Problems List
- Problem title
- Difficulty badge (color-coded)
- Submission count
- Acceptance rate
- Practice button
- Hover effects

### Admin Form
- Text inputs for name
- Textarea for description
- Emoji input for icon
- Color dropdown
- Submit and cancel buttons

---

## 📁 Files Created/Modified

### Created
- `backend/models/Topic.js` - Topic model
- `backend/routes/topics.js` - Public topic routes
- `frontend/src/pages/Topics.jsx` - Topics page

### Modified
- `backend/models/Problem.js` - Added topic field
- `backend/routes/admin.js` - Added topic management endpoints
- `backend/server.js` - Registered topics route
- `frontend/src/App.jsx` - Added Topics route
- `frontend/src/pages/Admin.jsx` - Added Topics tab
- `frontend/src/pages/Dashboard.jsx` - Added Topics link

---

## 🔄 Workflow Example

### Admin Creates Topic and Adds Problems

1. **Create Topic**
   ```
   Admin Panel → Topics Tab → Add Topic
   Name: "Arrays"
   Description: "Master array manipulation"
   Icon: "📦"
   Color: "blue"
   ```

2. **Add Problems to Topic**
   ```
   API: POST /api/admin/topics/TOPIC_ID/problems/PROBLEM_ID
   ```

3. **Verify**
   - Topic shows in Topics list
   - Problem count updates
   - Difficulty breakdown updates

### User Practices from Topic

1. **Browse Topics**
   ```
   Dashboard → Topics
   ```

2. **Select Topic**
   ```
   Click on "Arrays" topic
   ```

3. **Filter Problems**
   ```
   Click "Easy" to see easy problems
   ```

4. **Start Practice**
   ```
   Click "Practice" on "Two Sum"
   Redirects to code editor
   ```

---

## 🎯 Default Topics (Recommended)

Create these topics for a complete experience:

1. **Arrays** 📦 (Blue)
2. **Strings** 📝 (Purple)
3. **Trees** 🌳 (Green)
4. **Graphs** 🔗 (Cyan)
5. **Dynamic Programming** 🧮 (Yellow)
6. **Sorting & Searching** 🔍 (Red)
7. **Hash Tables** 🗂️ (Pink)
8. **Linked Lists** ⛓️ (Indigo)

---

## 🔐 Security

- ✅ Topic creation requires admin role
- ✅ Topic deletion requires admin role
- ✅ Problem-topic linking requires admin role
- ✅ Users can only view topics (read-only)
- ✅ All endpoints protected with JWT

---

## 📈 Statistics

Each topic tracks:
- Total problems
- Easy problems count
- Medium problems count
- Hard problems count
- Auto-updated when problems added/removed

---

## 🐛 Troubleshooting

### Topics not showing?
- Ensure backend is running
- Check MongoDB connection
- Verify topics exist in database

### Can't create topic?
- Verify you're logged in as admin
- Check all required fields are filled
- Topic name must be unique

### Problems not appearing in topic?
- Use admin API to add problems
- Verify problem ID is correct
- Check topic ID is correct

### Difficulty counts wrong?
- Counts auto-update when problems added/removed
- Refresh page to see updates

---

## 🚀 Next Steps

1. ✅ Create topics in admin panel
2. ✅ Add problems to topics
3. ✅ Users browse and practice
4. ✅ Track user progress per topic
5. ⏳ Add topic-based leaderboards
6. ⏳ Add topic recommendations

---

## 📞 Support

For issues or questions:
- Check API endpoints documentation
- Verify admin credentials
- Check browser console for errors
- Check backend logs

---

**Last Updated**: 2025-10-26
**Version**: 1.0
**Status**: ✅ PRODUCTION READY

Start creating topics and organizing your problems! 🎉

