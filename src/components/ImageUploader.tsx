'use client'

import { useImageUpload } from '@/src/hooks/useImageUpload'
import {
  Box,
  Button,
  Image,
  Input,
  Progress,
  Text,
  VStack,
} from '@chakra-ui/react'

import { useRef } from 'react'

interface ImageUploaderProps {
  onUploadComplete?: (url: string) => void
  maxSize?: number
  accept?: string
}

export function ImageUploader({
  onUploadComplete,
  maxSize = 5 * 1024 * 1024,
  accept = 'image/*',
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { isUploading, progress, error, publicUrl, uploadImage, reset } =
    useImageUpload()

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > maxSize) {
      alert(`File too large. Max size: ${maxSize / 1024 / 1024}MB`)
      return
    }

    try {
      const url = await uploadImage(file)
      onUploadComplete?.(url)
    } catch (error: any) {
      console.error('Upload error:', error)
    }
  }

  return (
    <VStack spacing={4} align="stretch">
      <Input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        display="none"
      />

      <Button
        onClick={() => fileInputRef.current?.click()}
        isLoading={isUploading}
        loadingText="Uploading..."
        isDisabled={isUploading}
      >
        Choose Image
      </Button>

      {isUploading && <Progress value={progress} size="sm" />}

      {error && (
        <Text color="red.500" fontSize="sm">
          {error}
        </Text>
      )}

      {publicUrl && (
        <Box>
          <Text fontSize="sm" mb={2}>
            Upload successful!
          </Text>
          <Image
            src={publicUrl}
            alt="Uploaded image"
            maxH="200px"
            objectFit="contain"
          />
          <Button size="sm" mt={2} onClick={reset}>
            Upload Another
          </Button>
        </Box>
      )}
    </VStack>
  )
}
