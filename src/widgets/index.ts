import { WidgetConfig } from '../types/widget';
import { ClockWidget } from './ClockWidget';
import { WeatherWidget } from './WeatherWidget';
import { TodoWidget } from './TodoWidget';
import { QuickLinksWidget } from './QuickLinksWidget';
import { SystemStatsWidget } from './SystemStatsWidget';
import { NotesWidget } from './NotesWidget';
import { CalendarWidget } from './CalendarWidget';
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
  Calendar, 
  Timer, 
  Newspaper, 
  Calculator 
} from 'lucide-react';

export const WIDGET_REGISTRY: Record<string, WidgetConfig> = {
  clock: {
    type: 'clock',
    name: 'Clock',
    defaultSize: { width: 280, height: 160 },
    minSize: { width: 200, height: 120 },
    maxSize: { width: 400, height: 200 },
    component: ClockWidget,
    icon: Clock,
    description: 'Real-time clock with date display'
  },
  weather: {
    type: 'weather',
    name: 'Weather',
    defaultSize: { width: 280, height: 180 },
    minSize: { width: 240, height: 160 },
    maxSize: { width: 320, height: 220 },
    component: WeatherWidget,
    icon: Cloud,
    description: 'Current weather conditions'
  },
  todo: {
    type: 'todo',
    name: 'Quick Tasks',
    defaultSize: { width: 320, height: 280 },
    minSize: { width: 280, height: 240 },
    maxSize: { width: 400, height: 400 },
    component: TodoWidget,
    icon: CheckSquare,
    description: 'Simple task management'
  },
  quicklinks: {
    type: 'quicklinks',
    name: 'Quick Links',
    defaultSize: { width: 280, height: 200 },
    minSize: { width: 240, height: 180 },
    maxSize: { width: 320, height: 240 },
    component: QuickLinksWidget,
    icon: Link,
    description: 'Quick access to important links'
  },
  systemstats: {
    type: 'systemstats',
    name: 'System Stats',
    defaultSize: { width: 280, height: 200 },
    minSize: { width: 240, height: 180 },
    maxSize: { width: 320, height: 240 },
    component: SystemStatsWidget,
    icon: Activity,
    description: 'System performance monitoring'
  },
  notes: {
    type: 'notes',
    name: 'Sticky Notes',
    defaultSize: { width: 300, height: 280 },
    minSize: { width: 260, height: 240 },
    maxSize: { width: 400, height: 400 },
    component: NotesWidget,
    icon: StickyNote,
    description: 'Quick notes and reminders'
  },
  calendar: {
    type: 'calendar',
    name: 'Calendar',
    defaultSize: { width: 280, height: 260 },
    minSize: { width: 240, height: 220 },
    maxSize: { width: 320, height: 300 },
    component: CalendarWidget,
    icon: Calendar,
    description: 'Monthly calendar view'
  },
  countdown: {
    type: 'countdown',
    name: 'Timer',
    defaultSize: { width: 240, height: 240 },
    minSize: { width: 200, height: 200 },
    maxSize: { width: 280, height: 280 },
    component: CountdownWidget,
    icon: Timer,
    description: 'Pomodoro and countdown timer'
  },
  news: {
    type: 'news',
    name: 'News Feed',
    defaultSize: { width: 320, height: 300 },
    minSize: { width: 280, height: 260 },
    maxSize: { width: 400, height: 400 },
    component: NewsWidget,
    icon: Newspaper,
    description: 'Latest news headlines'
  },
  calculator: {
    type: 'calculator',
    name: 'Calculator',
    defaultSize: { width: 240, height: 300 },
    minSize: { width: 200, height: 260 },
    maxSize: { width: 280, height: 340 },
    component: CalculatorWidget,
    icon: Calculator,
    description: 'Basic calculator functionality'
  }
};