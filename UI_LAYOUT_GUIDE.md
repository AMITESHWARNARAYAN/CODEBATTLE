# LeetCode-Style CodeEditor - UI Layout Guide

## 📐 Complete Layout Structure

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          HEADER NAVIGATION BAR                                  │
│  [← Problem List] > [Problem Title]    [Difficulty] [Share] [Award] [🌙] [⏱️] [Submit] │
└─────────────────────────────────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────────────────────────────────┐
│                                                                                  │
│  ┌─────────────────────────────────────────┬──────────────────────────────────┐ │
│  │ [Description] [Editorial] [Solutions]   │                                  │ │
│  │ [Submissions]                           │                                  │ │
│  ├─────────────────────────────────────────┤                                  │ │
│  │                                         │                                  │ │
│  │  Problem Description                    │  Language: [JavaScript ▼]        │ │
│  │  ═════════════════════════════════════  │  [⚙️]                            │ │
│  │                                         │                                  │ │
│  │  1. Two Sum                             │  ┌──────────────────────────┐   │ │
│  │  👍 1995 Online  💬 1.6K                │  │                          │   │ │
│  │                                         │  │   CODE EDITOR            │   │ │
│  │  Description                            │  │   (Monaco Editor)         │   │ │
│  │  ─────────────────────────────────────  │  │                          │   │ │
│  │  Given an array of integers nums and    │  │  1  class Solution {     │   │ │
│  │  an integer target, return the indices  │  │  2    public:            │   │ │
│  │  of the two numbers such that they add  │  │  3      vector<int>      │   │ │
│  │  up to target.                          │  │  4        twoSum(...) {  │   │ │
│  │                                         │  │  5                       │   │ │
│  │  Examples                               │  │  6      }                │   │ │
│  │  ─────────────────────────────────────  │  │  7    }                  │   │ │
│  │  Example 1:                             │  │  8  };                   │   │ │
│  │  Input: nums = [2,7,11,15], target = 9 │  │                          │   │ │
│  │  Output: [0,1]                          │  │                          │   │ │
│  │  Explanation: nums[0] + nums[1] = 9    │  │                          │   │ │
│  │                                         │  └──────────────────────────┘   │ │
│  │  Constraints                            │                                  │ │
│  │  ─────────────────────────────────────  │  Test Results                    │ │
│  │  • 2 <= nums.length <= 10^4             │  ─────────────────────────────  │ │
│  │  • -10^9 <= nums[i] <= 10^9             │  Status: ✅ Accepted             │ │
│  │  • -10^9 <= target <= 10^9              │  Passed: 50/50                   │ │
│  │                                         │  Time: 45ms                      │ │
│  │  💡 AI-Powered Help                     │  Memory: 12.5MB                  │ │
│  │  ┌─────────────────────────────────────┐│                                  │ │
│  │  │ [💡 Get Explanation]                ││  [▶️ Submit]  [🚩 Give Up]      │ │
│  │  │ [📖 Get Guidance]                   ││                                  │ │
│  │  │ [✨ View Full Solution]             ││                                  │ │
│  │  └─────────────────────────────────────┘│                                  │ │
│  │                                         │                                  │ │
│  └─────────────────────────────────────────┴──────────────────────────────────┘ │
│                                                                                  │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🎨 Component Breakdown

### Header Navigation Bar
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ [←] Problem List > Two Sum    [Easy] [Share] [Award] [🌙] [10:00] [Submit] │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Components:**
- Back button (← arrow)
- Breadcrumb: "Problem List > Two Sum"
- Difficulty badge (Easy/Medium/Hard)
- Share button
- Award button
- Theme toggle (🌙/☀️)
- Timer display (MM:SS)
- Submit button (green)

---

### Left Panel - Problem Description

```
┌──────────────────────────────────────────┐
│ [Description] [Editorial] [Solutions]    │
│ [Submissions]                            │
├──────────────────────────────────────────┤
│                                          │
│ 1. Two Sum                               │
│ 👍 1995 Online  💬 1.6K                  │
│                                          │
│ Description                              │
│ ──────────────────────────────────────   │
│ Given an array of integers nums and an   │
│ integer target, return the indices of    │
│ the two numbers such that they add up    │
│ to target.                               │
│                                          │
│ Examples                                 │
│ ──────────────────────────────────────   │
│ Example 1:                               │
│ Input: nums = [2,7,11,15], target = 9   │
│ Output: [0,1]                            │
│ Explanation: nums[0] + nums[1] = 9      │
│                                          │
│ Constraints                              │
│ ──────────────────────────────────────   │
│ • 2 <= nums.length <= 10^4               │
│ • -10^9 <= nums[i] <= 10^9               │
│                                          │
│ 💡 AI-Powered Help                       │
│ ┌────────────────────────────────────┐   │
│ │ [💡 Get Explanation]               │   │
│ │ [📖 Get Guidance]                  │   │
│ │ [✨ View Full Solution]            │   │
│ └────────────────────────────────────┘   │
│                                          │
└──────────────────────────────────────────┘
```

**Sections:**
1. **Tabs**: Description, Editorial, Solutions, Submissions
2. **Problem Title**: With stats (likes, comments)
3. **Description**: Full problem text
4. **Examples**: Input, Output, Explanation
5. **Constraints**: Problem limits
6. **AI Help**: Three buttons for AI assistance

---

### Resizer

```
│ ◄─────────────────────────────────────────────────────────────────────────► │
│                                                                              │
│  Left Panel (40%)  │  Right Panel (60%)                                     │
│                    ↑ Draggable divider (1px wide)                           │
│                    Cursor changes to col-resize on hover                    │
│                    Blue highlight while dragging                            │
```

**Features:**
- 1px wide divider
- Draggable with mouse
- Visual feedback (color change)
- Min width: 20%
- Max width: 70%
- Smooth animation

---

### Right Panel - Code Editor

```
┌──────────────────────────────────────────┐
│ Language: [JavaScript ▼]  [⚙️]           │
├──────────────────────────────────────────┤
│                                          │
│  1  class Solution {                     │
│  2    public:                            │
│  3      vector<int> twoSum(...) {        │
│  4                                       │
│  5      }                                │
│  6    }                                  │
│  7  };                                   │
│                                          │
│  (Monaco Editor with syntax highlighting)│
│                                          │
├──────────────────────────────────────────┤
│ Test Results                             │
│ Status: ✅ Accepted                      │
│ Passed: 50/50                            │
│ Time: 45ms                               │
│ Memory: 12.5MB                           │
├──────────────────────────────────────────┤
│ [▶️ Submit]  [🚩 Give Up]                │
└──────────────────────────────────────────┘
```

**Sections:**
1. **Toolbar**: Language selector, Settings
2. **Editor**: Monaco Editor with syntax highlighting
3. **Results**: Test results display
4. **Actions**: Submit and Give Up buttons

---

## 🎨 Color Scheme

### Difficulty Badges
- **Easy**: Green (#10B981)
- **Medium**: Yellow (#F59E0B)
- **Hard**: Red (#EF4444)

### Buttons
- **Primary**: Indigo (#4F46E5)
- **Success**: Green (#10B981)
- **Danger**: Red (#EF4444)
- **AI Help**: Purple (#A855F7)

### Text
- **Primary**: Dark gray (#1F2937)
- **Secondary**: Medium gray (#6B7280)
- **Tertiary**: Light gray (#9CA3AF)

### Backgrounds
- **Light Mode**: White (#FFFFFF)
- **Dark Mode**: Slate (#0F172A)

---

## 📏 Dimensions

### Header
- Height: 56px (3.5rem)
- Padding: 12px (0.75rem)

### Tabs
- Height: 48px (3rem)
- Padding: 16px (1rem)

### Panels
- Left Panel: 40% (default, resizable 20-70%)
- Right Panel: 60% (default, resizable 30-80%)
- Resizer: 4px (1px visible, 4px clickable)

### Spacing
- Padding: 4px, 8px, 12px, 16px, 24px
- Gaps: 8px, 12px, 16px
- Margins: 8px, 12px, 16px, 24px

### Typography
- Headers: 24px, bold
- Subheaders: 18px, bold
- Body: 14px, regular
- Small: 12px, regular
- Code: 14px, monospace

---

## 🎯 Responsive Breakpoints

### Desktop (1024px+)
- Full resizable panels
- All features visible
- Optimal layout

### Tablet (768px - 1023px)
- Adjusted panel widths
- Stacked on smaller screens
- Touch-friendly buttons

### Mobile (< 768px)
- Single column layout
- Stacked panels
- Full-width buttons

---

## ✨ Interactive Elements

### Hover States
- Buttons: Background color change
- Links: Underline appears
- Divider: Color highlight

### Active States
- Tabs: Orange underline
- Buttons: Darker background
- Selected: Highlight color

### Disabled States
- Buttons: Reduced opacity
- Text: Gray color
- Cursor: Not-allowed

### Loading States
- Buttons: Spinner animation
- Text: "Loading..." message
- Disabled: True

---

## 🎉 Summary

The LeetCode-style CodeEditor features:
- ✅ Professional layout
- ✅ Intuitive navigation
- ✅ Resizable panels
- ✅ Tabbed interface
- ✅ Beautiful styling
- ✅ Smooth interactions
- ✅ Dark/Light theme
- ✅ Responsive design

---

**Last Updated**: 2025-10-26
**Version**: 1.0
**Status**: ✅ PRODUCTION READY

