#!/usr/bin/env python3
"""
Batch update all Lucide React imports to Heroicons
"""
import os
import re

# Icon mapping from Lucide to Heroicons
ICON_MAP = {
    # Navigation & UI
    'Code2': 'CodeBracketIcon',
    'ArrowLeft': 'ArrowLeftIcon',
    'ArrowRight': 'ArrowRightIcon',
    'ChevronLeft': 'ChevronLeftIcon',
    'ChevronRight': 'ChevronRightIcon',
    'ChevronDown': 'ChevronDownIcon',
    'ChevronUp': 'ChevronUpIcon',
    'Menu': 'Bars3Icon',
    'X': 'XMarkIcon',
    'Check': 'CheckIcon',
    
    # Icons & Status
    'Trophy': 'TrophyIcon',
    'Zap': 'BoltIcon',
    'Users': 'UserGroupIcon',
    'User': 'UserIcon',
    'Mail': 'EnvelopeIcon',
    'Lock': 'LockClosedIcon',
    'Eye': 'EyeIcon',
    'EyeOff': 'EyeSlashIcon',
    'Settings': 'Cog6ToothIcon',
    'Calendar': 'CalendarIcon',
    'Clock': 'ClockIcon',
    'Terminal': 'CommandLineIcon',
    'BookOpen': 'BookOpenIcon',
    'FileText': 'DocumentTextIcon',
    'Code': 'CodeBracketIcon',
    'Play': 'PlayIcon',
    'Send': 'PaperAirplaneIcon',
    'Flame': 'FireIcon',
    'Target': 'TargetIcon',
    'Brain': 'SparklesIcon',
    'Sparkles': 'SparklesIcon',
    'Award': 'AcademicCapIcon',
    'Swords': 'BoltIcon',
    'Lightbulb': 'LightBulbIcon',
    'MessageSquare': 'ChatBubbleLeftIcon',
    'ThumbsUp': 'HandThumbUpIcon',
    'ThumbsDown': 'HandThumbDownIcon',
    'Star': 'StarIcon',
    'Share2': 'ShareIcon',
    'ExternalLink': 'ArrowTopRightOnSquareIcon',
    'Trash2': 'TrashIcon',
    'Edit2': 'PencilIcon',
    'Save': 'CheckIcon',
    'Info': 'InformationCircleIcon',
    'Maximize2': 'ArrowsPointingOutIcon',
    'Minimize2': 'ArrowsPointingInIcon',
    'RotateCcw': 'ArrowPathIcon',
    'Loader2': 'ArrowPathIcon',
    'Bell': 'BellIcon',
    'Filter': 'FunnelIcon',
    'Plus': 'PlusIcon',
    'BarChart3': 'BarChartIcon',
    'TrendingUp': 'ArrowTrendingUpIcon',
    'TrendingDown': 'ArrowTrendingDownIcon',
    'CheckCircle': 'CheckCircleIcon',
    'CheckCircle2': 'CheckCircleIcon',
    'XCircle': 'XCircleIcon',
    'AlertCircle': 'ExclamationCircleIcon',
    'Building2': 'BuildingOfficeIcon',
    'ListChecks': 'CheckIcon',
    'Github': 'ArrowTopRightOnSquareIcon',
    'Linkedin': 'ArrowTopRightOnSquareIcon',
    'Youtube': 'ArrowTopRightOnSquareIcon',
    'Video': 'VideoIcon',
    'Shuffle': 'SparklesIcon',
    'GraduationCap': 'AcademicCapIcon',
    'Library': 'BookOpenIcon',
    'Newspaper': 'NewspaperIcon',
    'Eye': 'EyeIcon',
    'LogOut': 'ArrowRightOnRectangleIcon',
    'Sun': 'SunIcon',
    'Moon': 'MoonIcon',
}

# Files to update
PAGES_DIR = r'c:\Users\amitu\OneDrive\Desktop\Codebattle\frontend\src\pages'

def update_file(filepath):
    """Update a single file from lucide-react to @heroicons/react"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # Replace imports
    if "from 'lucide-react'" in content:
        # Extract icons from the import statement
        import_match = re.search(r"import\s*\{\s*([^}]+)\s*\}\s*from\s*['\"]lucide-react['\"]", content)
        if import_match:
            icons_str = import_match.group(1)
            icons = [i.strip() for i in icons_str.split(',')]
            
            # Map icons to heroicons
            heroicons = []
            for icon in icons:
                if icon in ICON_MAP:
                    heroicons.append(ICON_MAP[icon])
                else:
                    heroicons.append(icon)  # Keep unmapped icons as-is
            
            # Create new import statement
            new_import = f"import {{ {', '.join(heroicons)} }} from '@heroicons/react/24/solid';"
            content = re.sub(
                r"import\s*\{\s*[^}]+\s*\}\s*from\s*['\"]lucide-react['\"];?",
                new_import,
                content
            )
        
        # Replace icon usages in JSX
        for lucide_icon, heroicon in ICON_MAP.items():
            content = re.sub(f'<{lucide_icon}\\b', f'<{heroicon}', content)
            content = re.sub(f'{lucide_icon}\\b', heroicon, content)
    
    # Write back if changed
    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

# Update all pages
if os.path.exists(PAGES_DIR):
    files_updated = 0
    for filename in os.listdir(PAGES_DIR):
        if filename.endswith('.jsx'):
            filepath = os.path.join(PAGES_DIR, filename)
            if update_file(filepath):
                print(f"✓ Updated {filename}")
                files_updated += 1
            else:
                print(f"- No changes needed for {filename}")
    
    print(f"\n✅ Updated {files_updated} files")
else:
    print(f"❌ Directory not found: {PAGES_DIR}")
