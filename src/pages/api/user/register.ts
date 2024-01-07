import type { NextApiRequest, NextApiResponse } from "next";
import { signUp } from "@/lib/firebase/service";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Memastikan bahwa hanya metode POST yang diterima
  if (req.method === "POST") {
    // Memanggil fungsi signUp dengan data dari req.body
    await signUp(req.body, (status: boolean) => {
      // Memeriksa status dari signUp callback
      if (status) {
        // Jika berhasil, memberikan respons status 200 dengan pesan sukses
        res.status(200).json({ status: true, statusCode: 200, message: "Sukses" });
      } else {
        // Jika gagal, memberikan respons status 400 dengan pesan gagal
        res.status(400).json({ status: false, statusCode: 400, message: "Gagal" });
      }
    });
  } else {
    // Jika metode selain POST, memberikan respons status 405 dengan pesan Method Not Allowed
    res.status(405).json({ status: false, statusCode: 405, message: "Method not Allowed" });
  }
}
