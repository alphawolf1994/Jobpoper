# Attachment Handling Guide for Job Edit Mode

## Problem Statement
When editing a job, attachments can be in two states:
1. **Existing attachments** - Already uploaded and stored (database paths/URLs)
2. **New attachments** - Freshly picked from gallery (local file URIs)

## Solution

### Frontend (PostJobScreen.tsx)

#### 1. Track Existing Attachments
```tsx
const [attachments, setAttachments] = useState<string[]>([]);
const [existingAttachments, setExistingAttachments] = useState<string[]>([]);
```

#### 2. Initialize in Edit Mode
When edit mode loads:
```tsx
// Set attachments if any
if (jobDataToEdit.attachments && jobDataToEdit.attachments.length > 0) {
  setAttachments(jobDataToEdit.attachments);
  setExistingAttachments(jobDataToEdit.attachments); // Track originals
}
```

#### 3. Helper Functions

**Check if attachment is new (local file):**
```tsx
const isNewAttachment = (uri: string): boolean => {
  return uri.startsWith('file://') || uri.startsWith('/data/') || uri.startsWith('/var/');
};
```

Local URIs patterns:
- `file:///path/to/file` - iOS
- `/data/user/0/...` - Android
- `/var/mobile/...` - iOS

**Get display URI:**
```tsx
const getAttachmentUri = (uri: string): string => {
  if (uri.startsWith('file://') || uri.startsWith('/data/') || uri.startsWith('/var/')) {
    return uri; // Local file - use as is
  }
  if (uri.startsWith('http://') || uri.startsWith('https://')) {
    return uri; // Already a full URL
  }
  return `${IMAGE_BASE_URL}${uri.startsWith("/") ? uri : `/${uri}`}`; // Relative path
};
```

#### 4. Submit Handler - Separate Attachments
```tsx
const newAttachments = attachments.filter(uri => isNewAttachment(uri));
const keptExistingAttachments = attachments.filter(uri => !isNewAttachment(uri));

const jobData = {
  // ... other fields
  newAttachments: newAttachments.length > 0 ? newAttachments : undefined,
  existingAttachments: keptExistingAttachments.length > 0 ? keptExistingAttachments : undefined,
};
```

### Backend (API/Controller)

#### Handle Different Attachment Types

```javascript
// Example Node.js/Express controller

async function updateJob(req, res) {
  const { jobId } = req.params;
  const { newAttachments, existingAttachments, ...jobData } = req.body;
  
  try {
    let finalAttachments = [];
    
    // 1. Keep existing attachments that user didn't delete
    if (existingAttachments && existingAttachments.length > 0) {
      finalAttachments = [...existingAttachments];
    }
    
    // 2. Process new attachments (upload them)
    if (newAttachments && newAttachments.length > 0) {
      // These are local file paths from mobile device
      // You need to handle file upload here
      // For example, with multer or similar file handling middleware
      
      // After uploading to your server/cloud storage:
      const uploadedPaths = await uploadFilesToServer(newAttachments);
      finalAttachments = [...finalAttachments, ...uploadedPaths];
    }
    
    // 3. Update job with final attachments
    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      {
        ...jobData,
        attachments: finalAttachments
      },
      { new: true }
    );
    
    res.json({ status: 'success', data: updatedJob });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
}
```

## Attachment Flow Example

### Scenario: User edits job with 3 existing images
1. **Load:** `attachments = ['/uploads/img1.jpg', '/uploads/img2.jpg', '/uploads/img3.jpg']`
2. **User deletes img2:** `attachments = ['/uploads/img1.jpg', '/uploads/img3.jpg']`
3. **User adds 2 new images:** `attachments = ['/uploads/img1.jpg', '/uploads/img3.jpg', 'file:///local/img4.jpg', 'file:///local/img5.jpg']`
4. **On submit:**
   - `existingAttachments = ['/uploads/img1.jpg', '/uploads/img3.jpg']`
   - `newAttachments = ['file:///local/img4.jpg', 'file:///local/img5.jpg']`
5. **Backend:** Uploads new images and saves: `['/uploads/img1.jpg', '/uploads/img3.jpg', '/uploads/img6.jpg', '/uploads/img7.jpg']`

## URL Types Reference

| Type | Example | Handling |
|------|---------|----------|
| Local file (iOS) | `file:///var/mobile/...` | Upload to server |
| Local file (Android) | `/data/user/0/...` | Upload to server |
| Existing API path | `/uploads/image.jpg` | Keep as is (already on server) |
| Full URL | `https://api.example.com/...` | Keep as is |

## Key Points

✅ **Display:** Use `getAttachmentUri()` to show both types  
✅ **Upload:** Only `newAttachments` need uploading  
✅ **Keep:** Keep existing paths as they are  
✅ **Combine:** Send both to backend for proper update  
✅ **Track:** Use `existingAttachments` state to know originals
