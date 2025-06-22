import { WidgetConfig } from '../types/widget';
import { ClockWidget } from './ClockWidget';
import { WeatherWidget } from './WeatherWidget';
import { TodoWidget } from './TodoWidget';
import { QuickLinksWidget } from './QuickLinksWidget';
import { SystemStatsWidget } from './SystemStatsWidget';
import { NotesWidget } from './NotesWidget';
import { CalendarWidget, calendarWidgetConfig } from './CalendarWidget';
import { CountdownWidget } from './CountdownWidget';
import { NewsWidget } from './NewsWidget';
import { CalculatorWidget } from './CalculatorWidget';
import { 
  Clock, 
  Cloud, 
  CheckSquare, 
  Link, 
  Activity, 
  StickyNote, 
  Timer, 
  Newspaper, 
  Calculator 
} from 'lucide-react';

export const WIDGET_CATEGORIES = {
  TIME: 'Time & Date',
  PRODUCTIVITY: 'Productivity',
  SYSTEM: 'System',
  TOOLS: 'Tools',
  INFORMATION: 'Information'
} as const;

export const WIDGET_REGISTRY: Record<string, WidgetConfig> = {
  clock: {
    type: 'clock',
    name: 'Clock',
    defaultSize: { width: 280, height: 160 },
    minSize: { width: 200, height: 120 },
    maxSize: { width: 400, height: 200 },
    component: ClockWidget,
    icon: Clock,
    description: 'Real-time clock with date display',
    features: {
      resizable: true,
      fullscreenable: false,
      hasSettings: false
    },
    version: '1.0.0',
    categories: [WIDGET_CATEGORIES.TIME]
  },
  weather: {
    type: 'weather',
    name: 'Weather',
    defaultSize: { width: 280, height: 180 },
    minSize: { width: 240, height: 160 },
    maxSize: { width: 320, height: 220 },
    component: WeatherWidget,
    icon: Cloud,
    description: 'Current weather conditions',
    features: {
      resizable: true,
      fullscreenable: false,
      hasSettings: true
    },
    version: '1.0.0',
    categories: [WIDGET_CATEGORIES.INFORMATION]
  },
  todo: {
    type: 'todo',
    name: 'Quick Tasks',
    defaultSize: { width: 320, height: 280 },
    minSize: { width: 280, height: 240 },
    maxSize: { width: 400, height: 400 },
    component: TodoWidget,
    icon: CheckSquare,
    description: 'Simple task management',
    features: {
      resizable: true,
      fullscreenable: true,
      hasSettings: false
    },
    version: '1.0.0',
    categories: [WIDGET_CATEGORIES.PRODUCTIVITY]
  },
  quicklinks: {
    type: 'quicklinks',
    name: 'Quick Links',
    defaultSize: { width: 280, height: 200 },
    minSize: { width: 240, height: 180 },
    maxSize: { width: 320, height: 240 },
    component: QuickLinksWidget,
    icon: Link,
    description: 'Quick access to important links',
    features: {
      resizable: true,
      fullscreenable: false,
      hasSettings: true
    },
    version: '1.0.0',
    categories: [WIDGET_CATEGORIES.PRODUCTIVITY]
  },
  systemstats: {
    type: 'systemstats',
    name: 'System Stats',
    defaultSize: { width: 280, height: 200 },
    minSize: { width: 240, height: 180 },
    maxSize: { width: 320, height: 240 },
    component: SystemStatsWidget,
    icon: Activity,
    description: 'System performance monitoring',
    features: {
      resizable: true,
      fullscreenable: true,
      hasSettings: false
    },
    version: '1.0.0',
    categories: [WIDGET_CATEGORIES.SYSTEM]
  },
  notes: {
    type: 'notes',
    name: 'Sticky Notes',
    defaultSize: { width: 300, height: 280 },
    minSize: { width: 260, height: 240 },
    maxSize: { width: 400, height: 400 },
    component: NotesWidget,
    icon: StickyNote,
    description: 'Quick notes and reminders',
    features: {
      resizable: true,
      fullscreenable: true,
      hasSettings: false
    },
    version: '1.0.0',
    categories: [WIDGET_CATEGORIES.PRODUCTIVITY]
  },
  calendar: {
    ...calendarWidgetConfig,
    categories: [WIDGET_CATEGORIES.TIME, WIDGET_CATEGORIES.PRODUCTIVITY]
  },
  countdown: {
    type: 'countdown',
    name: 'Timer',
    defaultSize: { width: 240, height: 240 },
    minSize: { width: 200, height: 200 },
    maxSize: { width: 280, height: 280 },
    component: CountdownWidget,
    icon: Timer,
    description: 'Pomodoro and countdown timer',
    features: {
      resizable: false,
      fullscreenable: false,
      hasSettings: true
    },
    version: '1.0.0',
    categories: [WIDGET_CATEGORIES.TIME, WIDGET_CATEGORIES.TOOLS]
  },
  news: {
    type: 'news',
    name: 'News Feed',
    defaultSize: { width: 320, height: 300 },
    minSize: { width: 280, height: 260 },
    maxSize: { width: 400, height: 400 },
    component: NewsWidget,
    icon: Newspaper,
    description: 'Latest news headlines',
    features: {
      resizable: true,
      fullscreenable: true,
      hasSettings: true
    },
    version: '1.0.0',
    categories: [WIDGET_CATEGORIES.INFORMATION]
  },
  calculator: {
    type: 'calculator',
    name: 'Calculator',
    defaultSize: { width: 240, height: 300 },
    minSize: { width: 200, height: 260 },
    maxSize: { width: 280, height: 340 },
    component: CalculatorWidget,
    icon: Calculator,
    description: 'Basic calculator functionality',
    features: {
      resizable: false,
      fullscreenable: false,
      hasSettings: false
    },
    version: '1.0.0',
    categories: [WIDGET_CATEGORIES.TOOLS]
  }
};