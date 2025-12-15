import { apiClient } from '@/src/lib/api/client'

import { useState } from 'react'

interface UploadState {
  isUploading: boolean
  progress: number
  error: string | null
  publicUrl: string | null
}

export function useImageUpload() {
  const [state, setState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    error: null,
    publicUrl: null,
  })

  const uploadImage = async (file: File) => {
    setState({ isUploading: true, progress: 0, error: null, publicUrl: null })

    try {
      // Get signed upload URL
      const { data: uploadData } = await apiClient.upload.getUploadUrl({
        filename: file.name,
        contentType: file.type as any,
        fileSize: file.size,
      })

      setState((prev) => ({ ...prev, progress: 25 }))

      // Upload file to GCS
      await apiClient.upload.uploadFile(uploadData.uploadUrl, file)

      setState({
        isUploading: false,
        progress: 100,
        error: null,
        publicUrl: uploadData.publicUrl,
      })

      return uploadData.publicUrl
    } catch (error: any) {
      setState({
        isUploading: false,
        progress: 0,
        error: error.message || 'Upload failed',
        publicUrl: null,
      })
      throw error
    }
  }

  const reset = () => {
    setState({ isUploading: false, progress: 0, error: null, publicUrl: null })
  }

  return { ...state, uploadImage, reset }
}
