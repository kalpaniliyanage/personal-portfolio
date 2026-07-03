import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { PortfolioData } from '../types';

// Firebase configuration from firebase-applet-config.json
const firebaseConfig = {
  apiKey: "AIzaSyBGjR52m4KaXzEo_lb-HA9jyLN1WkZIT5M",
  authDomain: "gen-lang-client-0246794237.firebaseapp.com",
  projectId: "gen-lang-client-0246794237",
  storageBucket: "gen-lang-client-0246794237.firebasestorage.app",
  messagingSenderId: "1013436883169",
  appId: "1:1013436883169:web:3d40741145a84573ac17a0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore with the specific database ID
const db = getFirestore(app, "ai-studio-personalportfoli-64cdcc50-2718-4c25-8519-76d0dc0b480f");

const PORTFOLIO_DOC_ID = 'kalpani_portfolio';

function compressBase64Image(base64Str: string, maxWidth = 400, maxHeight = 400, quality = 0.3): Promise<string> {
  if (!base64Str || !base64Str.startsWith('data:image/')) {
    return Promise.resolve(base64Str);
  }
  // If it's already very small (e.g., less than ~11KB), do not compress
  if (base64Str.length < 15000) {
    return Promise.resolve(base64Str);
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(base64Str);
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      try {
        const compressed = canvas.toDataURL('image/jpeg', quality);
        resolve(compressed);
      } catch (e) {
        resolve(base64Str);
      }
    };
    img.onerror = () => {
      resolve(base64Str);
    };
  });
}

/**
 * Iterates through portfolio fields and compresses base64 images
 */
export async function optimizePortfolioData(data: PortfolioData): Promise<PortfolioData> {
  try {
    const cloned = JSON.parse(JSON.stringify(data)) as PortfolioData;

    // 1. Optimize Avatar
    if (cloned.personal.avatarUrl) {
      cloned.personal.avatarUrl = await compressBase64Image(cloned.personal.avatarUrl, 256, 256, 0.6);
    }

    // 2. Optimize Projects
    if (cloned.projects && cloned.projects.length > 0) {
      for (let i = 0; i < cloned.projects.length; i++) {
        const proj = cloned.projects[i];
        if (proj.imageUrl) {
          proj.imageUrl = await compressBase64Image(proj.imageUrl);
        }
        if (proj.media && proj.media.length > 0) {
          for (let j = 0; j < proj.media.length; j++) {
            const med = proj.media[j];
            if (med.type === 'image' && med.url) {
              med.url = await compressBase64Image(med.url);
            }
          }
        }
      }
    }

    // 3. Optimize Education / Academics
    if (cloned.academics && cloned.academics.length > 0) {
      for (let i = 0; i < cloned.academics.length; i++) {
        const acad = cloned.academics[i];
        if (acad.images && acad.images.length > 0) {
          for (let j = 0; j < acad.images.length; j++) {
            acad.images[j] = await compressBase64Image(acad.images[j]);
          }
        }
      }
    }

    // 4. Optimize Passions
    if (cloned.passions && cloned.passions.length > 0) {
      for (let i = 0; i < cloned.passions.length; i++) {
        const passion = cloned.passions[i];
        if (passion.imageUrl) {
          passion.imageUrl = await compressBase64Image(passion.imageUrl);
        }
        if (passion.images && passion.images.length > 0) {
          for (let j = 0; j < passion.images.length; j++) {
            passion.images[j] = await compressBase64Image(passion.images[j]);
          }
        }
      }
    }

    // 5. Optimize Blogs
    if (cloned.blogs && cloned.blogs.length > 0) {
      for (let i = 0; i < cloned.blogs.length; i++) {
        const blog = cloned.blogs[i];
        if (blog.imageUrl) {
          blog.imageUrl = await compressBase64Image(blog.imageUrl);
        }
      }
    }

    return cloned;
  } catch (error) {
    console.error('Error in portfolio optimization:', error);
    return data;
  }
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: null,
      email: null,
      emailVerified: null,
      isAnonymous: null,
      tenantId: null,
      providerInfo: []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

/**
 * Saves portfolio data to Firestore
 */
export async function savePortfolioToCloud(data: PortfolioData): Promise<void> {
  const path = `portfolios/${PORTFOLIO_DOC_ID}`;
  try {
    const optimized = await optimizePortfolioData(data);
    const docRef = doc(db, 'portfolios', PORTFOLIO_DOC_ID);
    await setDoc(docRef, {
      ...optimized,
      updatedAt: new Date().toISOString()
    });
    console.log('Portfolio successfully saved to Firebase Firestore cloud database.');
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Fetches portfolio data from Firestore
 */
export async function fetchPortfolioFromCloud(): Promise<PortfolioData | null> {
  const path = `portfolios/${PORTFOLIO_DOC_ID}`;
  try {
    const docRef = doc(db, 'portfolios', PORTFOLIO_DOC_ID);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as PortfolioData;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return null;
  }
}

/**
 * Listens for real-time updates to the portfolio data in Firestore
 */
export function subscribeToPortfolioCloud(callback: (data: PortfolioData) => void) {
  const path = `portfolios/${PORTFOLIO_DOC_ID}`;
  const docRef = doc(db, 'portfolios', PORTFOLIO_DOC_ID);
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      // Exclude metadata updatedAt when calling callback
      callback(data as PortfolioData);
    }
  }, (error) => {
    handleFirestoreError(error, OperationType.GET, path);
  });
}
