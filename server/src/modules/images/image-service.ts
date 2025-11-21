import prisma from '../../config/database';
import { uploadToCloudinary, deleteFromCloudinary } from '../../utils/uploadImage';
import { UploadedFile } from 'express-fileupload';

export class ImageService {
  async uploadImage(
    file: UploadedFile,
    clerkUserId: string, // This is the Clerk ID, not database ID
    metadata?: {
      inventoryId?: string;
      inventoryItemId?: string;
      foodItemId?: string;
    }
  ) {
    try {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
      if (!allowedTypes.includes(file.mimetype)) {
        throw new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.');
      }

      // Upload to Cloudinary
      const imageUrl = await uploadToCloudinary(file);

      // Get the database user ID from Clerk ID
      const user = await prisma.user.findUnique({
        where: { clerkId: clerkUserId },
        select: { id: true }
      });

      if (!user) {
        throw new Error('User not found in database');
      }

      // Save to database with the correct database user ID
      const savedFile = await prisma.file.create({
        data: {
          userId: user.id, // Use database ID, not Clerk ID
          url: imageUrl,
          filename: file.name,
          mimeType: file.mimetype,
          size: file.size,
          foodItemId: metadata?.foodItemId,
          inventoryId: metadata?.inventoryId,
          inventoryItemId: metadata?.inventoryItemId,
        },
      });

      return savedFile;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }

  async deleteImage(fileId: string, clerkUserId: string) {
    try {
      // Get the database user ID from Clerk ID
      const user = await prisma.user.findUnique({
        where: { clerkId: clerkUserId },
        select: { id: true }
      });

      if (!user) {
        throw new Error('User not found in database');
      }

      const file = await prisma.file.findUnique({
        where: { id: fileId },
      });

      if (!file) {
        throw new Error('File not found');
      }

      if (file.userId !== user.id) { // Compare with database ID
        throw new Error('Unauthorized to delete this file');
      }

      // Delete from Cloudinary
      await deleteFromCloudinary(file.url);

      // Soft delete from database
      await prisma.file.update({
        where: { id: fileId },
        data: {
          isDeleted: true,
          deletedAt: new Date(),
        },
      });

      return { success: true };
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  }

  async getUserImages(clerkUserId: string) {
    // Get the database user ID from Clerk ID
    const user = await prisma.user.findUnique({
      where: { clerkId: clerkUserId },
      select: { id: true }
    });

    if (!user) {
      throw new Error('User not found in database');
    }

    return prisma.file.findMany({
      where: {
        userId: user.id, // Use database ID
        isDeleted: false,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}

export const imageService = new ImageService();