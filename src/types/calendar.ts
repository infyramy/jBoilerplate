export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  type: 'project' | 'meeting' | 'blocked' | 'other';
  location?: string;
  projectId?: string;
  color?: string;
  isAllDay?: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

export interface CreateCalendarEventRequest {
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  type: CalendarEvent['type'];
  location?: string;
  projectId?: string;
  isAllDay?: boolean;
}

export interface UpdateCalendarEventRequest {
  title?: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  type?: CalendarEvent['type'];
  location?: string;
  projectId?: string;
  isAllDay?: boolean;
} 