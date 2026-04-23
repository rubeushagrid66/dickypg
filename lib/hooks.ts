import useSWR from 'swr';
import { db } from './firebase';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';

// Fetcher for Firestore collections
const fetchCollection = async (key: string) => {
  const [colName] = key.split(':');
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
    dedupingInterval: 60000,
  });
}

export function useOrders() {
  return useSWR('orders:all', fetchCollection, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  });
}

export function useSummary() {
  const { data: products } = useProducts();
  const { data: orders } = useOrders();

  const isLoading = !products || !orders;

  if (isLoading) return { isLoading: true };

  const totalStock = (products as any[]).length;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const ordersToday = (orders as any[]).filter(o => {
    const date = o.createdAt?.toDate();
    return date && date >= today;
  }).length;

  const totalRevenue = (orders as any[]).reduce((acc, o) => acc + (o.totalPrice || 0), 0);

  return {
    totalStock,
    ordersToday,
    totalRevenue,
    isLoading: false
  };
}
