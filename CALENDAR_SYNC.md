# Calendar Sync Implementation

## Current Implementation

### Authentication & Token Management
- Using Google OAuth for authentication
- Storing tokens in Supabase:
  - `google_access_token`
  - `google_refresh_token`
  - `google_token_expires_at`
- Tokens are managed through `useGoogleTokens` hook

### Calendar Integration
- Users can fetch their calendar events after sign-in
- Two-way sync is implemented for manual updates
- Changes require page refresh to reflect updates
- Current limitations:
  - External calendar changes aren't reflected in real-time
  - New events from other users require manual refresh
  - No push notifications for calendar updates

## Future Implementation: Google Calendar Webhooks

### Overview
Implementation of Google Calendar Push Notifications to enable real-time calendar synchronization when:
1. Other users create events including the current user
2. External modifications to calendar events
3. Any calendar changes that should reflect immediately

### Technical Requirements

#### 1. Secure HTTPS Endpoint
- **Mandatory Requirement**: Google Calendar API requires a secure HTTPS endpoint
- Cannot use HTTP or localhost URLs
- Must have valid SSL certificate
- Options:
  - Production domain with SSL certificate
  - Ngrok for development testing
  - Reverse proxy with SSL termination

#### 2. Server-Side Implementation

##### Webhook Endpoint
```typescript
// Example structure for webhook endpoint
POST /api/calendar/webhook
{
  "kind": "calendar#notification",
  "id": "...",
  "resourceId": "...",
  "resourceUri": "...",
  "resourceState": "exists",
  "channelId": "...",
  "expiration": "..."
}
```

##### Required Components:
1. **Webhook Registration**
   - Use Google Calendar API's `watch` method
   - Register endpoint for calendar notifications
   - Store channel and resource IDs
   - Handle webhook expiration and renewal

2. **Database Schema Updates**
   ```sql
   -- Example schema additions
   ALTER TABLE users ADD COLUMN webhook_channel_id TEXT;
   ALTER TABLE users ADD COLUMN webhook_resource_id TEXT;
   ALTER TABLE users ADD COLUMN webhook_expiration TIMESTAMP;
   ```

3. **Security Measures**
   - Validate notification headers
   - Verify channel IDs
   - Implement rate limiting
   - Add request signature validation

4. **Event Processing**
   - Handle different notification types
   - Update local calendar cache
   - Trigger real-time updates to client

### Implementation Steps

1. **Infrastructure Setup**
   - Set up HTTPS endpoint
   - Configure SSL certificates
   - Update DNS settings if needed

2. **Webhook Implementation**
   ```typescript
   // Basic webhook registration
   async function registerWebhook(calendarId: string) {
     const response = await calendar.events.watch({
       calendarId,
       requestBody: {
         id: uuid(), // Unique channel ID
         type: 'web_hook',
         address: 'https://your-domain.com/api/calendar/webhook',
         token: 'your-security-token',
         expiration: ... // Set expiration time
       },
     });
     return response.data;
   }
   ```

3. **Database Updates**
   - Add webhook tracking tables
   - Implement token refresh logic
   - Add webhook renewal scheduling

4. **Client Updates**
   - Implement real-time update reception
   - Add WebSocket connection (optional)
   - Update UI for real-time changes

### Benefits
1. Real-time calendar synchronization
2. Reduced server load (no polling needed)
3. Better user experience
4. Immediate reflection of external changes

### Considerations
1. **SSL Certificate**: Must be valid and trusted
2. **Domain Verification**: Google verifies domain ownership
3. **Rate Limiting**: Implement to prevent abuse
4. **Error Handling**: Robust error handling for webhook failures
5. **Scalability**: Consider load balancing for multiple webhooks
6. **Monitoring**: Add logging and monitoring for webhook health

### Testing
1. Use ngrok for local development
2. Implement webhook simulation tools
3. Test various calendar event scenarios
4. Verify security measures
5. Load test webhook endpoint

## Resources
- [Google Calendar API Documentation](https://developers.google.com/calendar/api/guides/push)
- [Push Notifications Reference](https://developers.google.com/calendar/api/guides/push#making-watch-requests)
- [Security Considerations](https://developers.google.com/calendar/api/guides/push#security-considerations)
