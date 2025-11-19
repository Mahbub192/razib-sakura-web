/**
 * File Upload Utility
 * Handles file uploads with preview and validation
 */

export interface UploadResult {
  success: boolean
  url?: string
  error?: string
}

export const fileUploadUtils = {
  // Validate file
  validateFile(file: File, options?: {
    maxSize?: number // in MB
    allowedTypes?: string[]
  }): { valid: boolean; error?: string } {
    const maxSize = options?.maxSize || 5 // Default 5MB
    const allowedTypes = options?.allowedTypes || ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp']

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      return {
        valid: false,
        error: `File size must be less than ${maxSize}MB`,
      }
    }

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`,
      }
    }

    return { valid: true }
  },

  // Convert file to base64
  async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result as string
        resolve(result)
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  },

  // Create image preview URL
  createPreviewUrl(file: File): string {
    return URL.createObjectURL(file)
  },

  // Revoke preview URL
  revokePreviewUrl(url: string): void {
    URL.revokeObjectURL(url)
  },

  // Upload file (simulated - in production, upload to backend)
  async uploadFile(file: File, endpoint: string = '/api/upload'): Promise<UploadResult> {
    try {
      // For now, convert to base64 and return as data URL
      // In production, this should upload to backend storage
      const base64 = await this.fileToBase64(file)
      
      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      return {
        success: true,
        url: base64, // In production, this would be the server URL
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to upload file',
      }
    }
  },

  // Format file size
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  },
}

