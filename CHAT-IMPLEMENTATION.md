# TimeSync Chat Implementation Guide

## Current Architecture

### Frontend Components
- **Chat UI**: React-based chat interface with text mode support
- **User Context**: Manages user data and authentication state
- **Message Types**: Structured message format for user and AI interactions

### Backend Integration
- **n8n Workflow**: Webhook-based processing pipeline
- **Calendar Integration**: Google Calendar API integration
- **User Data**: Supabase authentication and database

## Implementation Requirements

### 1. User Context Enhancement
```typescript
interface UserData {
  id: string;          // Supabase user ID
  email: string;       // User email for calendar
  fullName: string;    // Display name
  avatarUrl: string;   // Profile picture
  preferences: {       // User preferences
    theme?: string;
    timezone?: string;
    notifications?: boolean;
  };
}
```

### 2. Message Flow

#### Client to n8n
```typescript
{
  message: string;        // User input
  userId: string;        // Supabase ID
  messageId: number;     // Tracking ID
  context: {
    previousMessages: Message[];
    timezone: string;
    userPreferences: object;
  }
}
```

#### n8n to Client
```typescript
{
  content: string;      // AI response
  status: "success" | "error";
  eventData?: {        // Calendar data
    events?: CalendarEvent[];
    suggestions?: TimeSlot[];
    actions?: Action[];
  };
  metadata?: {
    requiresConfirmation: boolean;
    suggestedActions: string[];
  }
}
```

## Implementation Steps

### Phase 1: Setup & Infrastructure
1. [ ] Update UserContext to include all necessary user data
2. [ ] Configure n8n webhook endpoints
3. [ ] Set up error handling and logging
4. [ ] Implement message persistence

### Phase 2: Chat UI Enhancement
1. [ ] Replace placeholder webhook call in handleSubmit
2. [ ] Add loading states and typing indicators
3. [ ] Implement message retry functionality
4. [ ] Add support for different message types
5. [ ] Create error message components

### Phase 3: n8n Workflow
1. [ ] Set up webhook authentication
2. [ ] Configure calendar integration
3. [ ] Implement natural language processing
4. [ ] Add response formatting
5. [ ] Set up error handling

### Phase 4: Testing & Refinement
1. [ ] Add unit tests for components
2. [ ] Test webhook integration
3. [ ] Verify calendar operations
4. [ ] Load testing
5. [ ] Security testing

## Security Considerations

### Authentication
- Validate user tokens with Supabase
- Secure webhook endpoints
- Implement rate limiting

### Data Protection
- Encrypt sensitive data
- Sanitize user input
- Validate responses

### Error Handling
- Network failures
- Timeout handling
- Error logging

## Message Types

### User Messages
```typescript
interface UserMessage {
  id: number;
  content: string;
  sender: "user";
  timestamp: string;
}
```

### AI Responses
```typescript
interface AIMessage {
  id: number;
  content: string;
  sender: "ai";
  timestamp: string;
  metadata?: {
    eventData?: CalendarEvent[];
    suggestedActions?: string[];
    requiresConfirmation?: boolean;
  };
}
```

## API Integration

### Required Environment Variables
```env
NEXT_PUBLIC_N8N_WEBHOOK_URL=your_webhook_url
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
```

### Webhook Configuration
- POST endpoint for message processing
- Authentication headers
- Rate limiting
- Response timeout: 30 seconds

## Testing Strategy

### Unit Tests
- Message formatting
- Component rendering
- Error handling

### Integration Tests
- Webhook communication
- State management
- User authentication

### End-to-End Tests
- Complete conversation flows
- Calendar operations
- Error scenarios

## Next Steps

1. Begin with UserContext enhancement
2. Implement webhook integration in chat-ui.tsx
3. Set up basic n8n workflow
4. Add error handling and retries
5. Implement advanced features
6. Comprehensive testing
7. Production deployment

## Notes

- Keep user context in sync with Supabase
- Implement proper error handling for network issues
- Add retry mechanism for failed requests
- Consider implementing message persistence
- Add typing indicators for better UX
- Monitor webhook performance and timeout settings
