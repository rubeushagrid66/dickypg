import useSWR from 'swr';
import { db } from './firebase';
import { collection, getDocs, query, where, orderBy, doc, getDoc } from 'firebase/firestore';

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

const fetchDoc = async (key: string) => {
  const [col, id] = key.split(':');
  const docRef = doc(db, col, id);
  const snap = await getDoc(docRef);
  return snap.exists() ? snap.data() : null;
};

export function useProducts() {
  return useSWR('products:active', fetchCollection, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
    keepPreviousData: true,
  });
}

export function useOrders() {
  return useSWR('orders:all', fetchCollection, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
    keepPreviousData: true,
  });
}

export function useSiteSettings() {
  return useSWR('settings:siteConfig', fetchDoc, {
    revalidateOnFocus: false,
    dedupingInterval: 300000, // 5 minutes cache
  });
}

export function useSummary() {
  const { data: products, isLoading: productsLoading } = useProducts();
  const { data: orders, isLoading: ordersLoading } = useOrders();

  const isLoading = productsLoading || ordersLoading;

  if (isLoading || !products || !orders) return { isLoading: true };

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
