export const CLOUDINARY_CLOUD_NAME = 'daxiqioga';
export const CLOUDINARY_UPLOAD_PRESET = 'gipe_documents';

interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  resource_type: string;
  format: string;
}

/**
 * Upload un PDF sur Cloudinary et retourne l'URL de la miniature générée
 * Le PDF est uploadé comme 'image' pour permettre la transformation
 */
export async function generatePdfThumbnail(
  file: File,
  folder: string = 'documents'
): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  formData.append('folder', folder);

  // Upload comme 'image' pour permettre les transformations
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error('Erreur lors de la génération de la miniature sur Cloudinary');
  }

  const data: CloudinaryUploadResponse = await response.json();

  // Générer l'URL de la miniature (première page du PDF convertie en JPG)
  // Format: /image/upload/f_jpg,pg_1,w_400,h_300,c_fill/...
  const thumbnailUrl = data.secure_url
    .replace('/upload/', '/upload/f_jpg,pg_1,w_400,h_300,c_fill,q_auto/')
    .replace('.pdf', '.jpg');

  return thumbnailUrl;
}

/**
 * Upload une image sur Cloudinary et retourne l'URL de la miniature optimisée
 * Gère aussi les PDFs uploadés comme images
 */
export async function generateImageThumbnail(
  file: File,
  folder: string = 'events'
): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  formData.append('folder', folder);

  // Upload comme 'image' 
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error('Erreur lors de la génération de la miniature sur Cloudinary');
  }

  const data: CloudinaryUploadResponse = await response.json();

  // Si c'est un PDF, utiliser la transformation PDF→JPG
  if (data.format === 'pdf' || file.type === 'application/pdf') {
    const thumbnailUrl = data.secure_url
      .replace('/upload/', '/upload/f_jpg,pg_1,w_400,h_300,c_fill,q_auto/')
      .replace('.pdf', '.jpg');
    return thumbnailUrl;
  }

  // Pour les images normales, juste optimiser
  const thumbnailUrl = data.secure_url
    .replace('/upload/', '/upload/w_400,h_300,c_fill,q_auto/');

  return thumbnailUrl;
}
