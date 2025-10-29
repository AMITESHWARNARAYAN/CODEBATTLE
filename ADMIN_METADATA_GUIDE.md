# Admin Problem Metadata Management Guide

## Overview
The Problem Metadata Management system allows admins to add rich metadata to problems including company tags, problem lists, frequency data, and interview experiences.

## Accessing the Metadata Manager

1. Login as admin
2. Go to Admin Panel (`/admin`)
3. Click "Manage Metadata" button in the header
4. Or navigate directly to `/admin/problem-metadata`

## Features

### 1. Company Tags
Add companies that have asked this problem in interviews:
- Select from 14 major tech companies (Google, Meta, Amazon, Microsoft, Apple, Netflix, Tesla, Adobe, Bloomberg, Uber, LinkedIn, Oracle, Salesforce, Twitter)
- Set frequency percentage (0-100%) indicating how often this company asks this problem
- Remove company tags by clicking the X button

**How it appears to users:**
- Company tags shown on problem cards
- Users can filter problems by company
- Helps users prepare for specific company interviews

### 2. Problem Lists
Add problems to curated lists:
- Top 100 Liked
- Blind 75
- NeetCode 150
- Top Interview Questions
- Beginner Friendly
- Amazon Top 50
- Google Top 50
- Meta Top 50
- Microsoft Top 50
- Apple Top 50

**How it appears to users:**
- Users can filter problems by list
- Helps users follow structured learning paths
- Popular lists like Blind 75 are highly sought after

### 3. Frequency Data
Set how frequently this problem appears in interviews over different time periods:
- **6 Months**: Recent interview frequency (0-100%)
- **1 Year**: Past year frequency (0-100%)
- **2 Years**: Two year frequency (0-100%)
- **All Time**: Historical frequency (0-100%)

Use sliders to set percentages, then click "Save Frequency Data"

**How it appears to users:**
- Frequency bar shown on problem cards
- Users can filter by time period (6m, 1y, 2y, All Time)
- Users can sort problems by frequency
- Helps users focus on trending problems

### 4. Interview Experiences (Coming Soon)
Users can add their interview experiences for problems:
- Company name
- Position applied for
- Interview date
- Difficulty experienced
- Description and tips
- Admins can verify experiences

## Workflow

### Adding Metadata to a New Problem

1. **Select the Problem**
   - Use the search bar to find the problem
   - Click on the problem from the list

2. **Add Company Tags**
   - Select company from dropdown
   - Set frequency percentage (e.g., 75 for frequently asked)
   - Click "Add"
   - Repeat for all relevant companies

3. **Add to Lists**
   - Check boxes for all relevant lists
   - Changes save automatically

4. **Set Frequency Data**
   - Adjust sliders for each time period
   - Higher percentages = more frequently asked
   - Click "Save Frequency Data"

### Example: Adding Metadata for "Two Sum"

```
Problem: Two Sum
Difficulty: Easy

Company Tags:
- Amazon (85%)
- Google (70%)
- Meta (65%)
- Microsoft (60%)

Lists:
✓ Top 100 Liked
✓ Blind 75
✓ Beginner Friendly
✓ Amazon Top 50

Frequency:
- 6 Months: 90%
- 1 Year: 85%
- 2 Years: 80%
- All Time: 95%
```

## Best Practices

### Setting Frequency Percentages
- **90-100%**: Extremely common, asked almost every interview cycle
- **70-89%**: Very common, frequently appears
- **50-69%**: Common, regularly asked
- **30-49%**: Moderate, occasionally asked
- **10-29%**: Rare, infrequently asked
- **0-9%**: Very rare or historical

### Company Tags
- Only add companies that have actually asked this problem
- Set realistic frequency based on interview reports
- Update frequencies periodically based on new data

### Problem Lists
- Be selective with "Top 100 Liked" - only truly popular problems
- "Blind 75" should match the official Blind 75 list
- Company-specific lists should contain problems frequently asked by that company
- "Beginner Friendly" for problems suitable for coding interview beginners

## API Endpoints (For Reference)

### Get Metadata
```
GET /api/problem-metadata/:problemId
```

### Update Metadata
```
POST /api/problem-metadata/:problemId
Body: { companies, lists, frequencyData, hints, realWorldApplications }
```

### Add Company Tag
```
POST /api/problem-metadata/:problemId/company
Body: { name, frequency, acceptanceRate }
```

### Remove Company Tag
```
DELETE /api/problem-metadata/:problemId/company/:companyName
```

### Add to List
```
POST /api/problem-metadata/:problemId/list
Body: { listName }
```

### Remove from List
```
DELETE /api/problem-metadata/:problemId/list/:listName
```

## User Experience Impact

When you add metadata:
1. **Sidebar Filters** - Users can filter by companies, lists, frequency
2. **Problem Cards** - Show company tags and frequency bars
3. **Sorting** - Users can sort by frequency
4. **Discovery** - Users find relevant problems faster
5. **Interview Prep** - Users can prepare for specific companies

## Tips

- Start with popular problems (Two Sum, Valid Parentheses, etc.)
- Add metadata to problems in high-demand lists first (Blind 75, NeetCode 150)
- Keep frequency data updated quarterly
- Verify interview experiences to maintain quality
- Use consistent frequency percentages across similar problems

## Future Enhancements

- Bulk metadata import from CSV
- Interview experience moderation panel
- Acceptance rate by company
- Problem difficulty by company
- Similar problems suggestions
- Real-world application examples
- Hints and tips for each problem

