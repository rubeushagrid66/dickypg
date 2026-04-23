import useSWR from 'swr';
import { db } from './firebase';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';

// Fetcher for Firestore collections
const fetchCollection = async (key: string) => {
  const [colName, ...params] = key.split(':');
  let q;
  
  if (colName === 'products') {
    q = query(collection(db, 'products'), where('isArchived', '==', false));
  } else if (colName === 'orders') {
    q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
  } else {
    q = collection(db, colName);
  }

  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export function useProducts() {
  return useSWR('products:active', fetchCollection, {
    revalidateOnFocus: false,
    dedupingInterval: 60000, // Cache for 1 minute
  });
}

export function useOrders() {
  return useSWR('orders:all', fetchCollection, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  });
}
