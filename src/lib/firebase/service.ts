// Import modul Firestore dari Firebase, modul init, modul bcrypt, dan inisialisasi aplikasi Firebase
import { getFirestore, collection, getDocs, getDoc, doc, query, where, addDoc } from "firebase/firestore";
import app from "./init";
import bcrypt from "bcrypt";

// Inisialisasi Firestore dengan menggunakan objek aplikasi Firebase
const firestore = getFirestore(app);

// Fungsi untuk mengambil semua data dari suatu koleksi Firestore
export async function retrieveData(collectionName: string) {
  // Mengambil snapshot (foto atau representasi koleksi pada suatu waktu tertentu)
  const snapshot = await getDocs(collection(firestore, collectionName));

  // Membuat array data dengan mengonversi dokumen-dokumen snapshot menjadi objek dengan tambahan properti id
  const data = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  // Mengembalikan array data
  return data;
}

// Fungsi untuk mengambil data berdasarkan ID dari suatu koleksi Firestore
export async function retrieveDataById(collectionName: string, id: string) {
  // Mengambil snapshot dokumen dengan ID tertentu
  const snapshot = await getDoc(doc(firestore, collectionName, id));

  // Mengambil data dari dokumen
  const data = snapshot.data();

  // Mengembalikan objek data
  return data;
}

// Fungsi untuk melakukan pendaftaran pengguna baru
export async function signUp(
  userData: {
    email: string;
    fullname: string;
    phone: string;
    password: string;
    role?: string;
  },
  callback: Function
) {
  // Membuat query untuk memeriksa apakah email sudah terdaftar sebelumnya
  const q = query(collection(firestore, "users"), where("email", "==", userData.email));

  // Mengambil snapshot hasil query
  const snapshot = await getDocs(q);

  // Mengonversi snapshot menjadi array data
  const data = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  // Jika data dengan email tersebut sudah ada, panggil callback dengan parameter false
  if (data.length > 0) {
    callback(false);
  } else {
    // Jika role tidak tersedia, set role sebagai "member"
    if (!userData.role) {
      userData.role = "member";
    }

    // Hash password menggunakan bcrypt dengan cost 10
    userData.password = await bcrypt.hash(userData.password, 10);

    try {
      // Menambahkan dokumen baru ke koleksi "users" dengan data pengguna
      await addDoc(collection(firestore, "users"), userData);

      // Jika berhasil, panggil callback dengan parameter true
      callback(true);
    } catch (error) {
      // Jika terjadi kesalahan, panggil callback dengan parameter false dan log pesan kesalahan
      callback(false);
      console.log(error);
    }
  }
}
