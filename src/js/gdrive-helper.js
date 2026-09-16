/**
 * Google Drive Image Helper
 * Converts standard Google Drive sharing links to direct image preview URLs
 */

export function parseGoogleDriveUrl(url) {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();

  // If already a standard image URL or data URI
  if (trimmed.startsWith('data:image') || trimmed.match(/\.(jpeg|jpg|gif|png|webp|svg)($|\?)/i)) {
    return trimmed;
  }

  // Handle Google Drive links
  // Pattern 1: https://drive.google.com/file/d/FILE_ID/view?usp=sharing
  // Pattern 2: https://drive.google.com/open?id=FILE_ID
  // Pattern 3: https://drive.google.com/uc?id=FILE_ID
  // Pattern 4: https://drive.google.com/thumbnail?id=FILE_ID
  const fileIdMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || 
                      trimmed.match(/id=([a-zA-Z0-9_-]+)/);

  if (fileIdMatch && fileIdMatch[1]) {
    const fileId = fileIdMatch[1];
    // Return high-resolution direct thumbnail link that avoids download prompts
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1200`;
  }

  return trimmed;
}

export function setupImagePreview(inputEl, previewBoxEl, previewImgEl, testBtnEl) {
  if (!inputEl || !previewBoxEl || !previewImgEl) return;

  const updatePreview = () => {
    const rawVal = inputEl.value.trim();
    if (!rawVal) {
      previewBoxEl.classList.add('hidden');
      previewImgEl.src = '';
      return;
    }

    const convertedUrl = parseGoogleDriveUrl(rawVal);
    previewImgEl.src = convertedUrl;
    previewBoxEl.classList.remove('hidden');

    previewImgEl.onerror = () => {
      // Fallback placeholder if drive image cannot be loaded
      previewImgEl.src = 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=60';
    };
  };

  inputEl.addEventListener('change', updatePreview);
  if (testBtnEl) {
    testBtnEl.addEventListener('click', (e) => {
      e.preventDefault();
      updatePreview();
    });
  }
}
