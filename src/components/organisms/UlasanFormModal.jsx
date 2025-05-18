import { useState } from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Button,
  Rating,
  Textarea,
} from "@material-tailwind/react";
import axios from "axios";
import dayjs from "dayjs";

export default function UlasanFormModal({ open, handleOpen, onSuccess }) {
  const [form, setForm] = useState({
    kode_paket: "",
    nama_pengguna: "",
    rating: 0,
    komentar: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      await axios.post("http://localhost:5000/ulasan", {
        ...form,
        tanggal: dayjs().toISOString(), // atau pakai new Date()
      });
      onSuccess(); // reload table
      handleOpen(); // close modal
    } catch (err) {
      alert("Gagal menambahkan ulasan");
      console.error(err);
    }
  };

  return (
    <Dialog open={open} handler={handleOpen}>
      <DialogHeader>Tambah Ulasan Baru</DialogHeader>
      <DialogBody className="space-y-4">
        <Input label="Kode Paket" name="kode_paket" onChange={handleChange} />
        <Input
          label="Nama Pengguna"
          name="nama_pengguna"
          onChange={handleChange}
        />
        <Rating
          value={form.rating}
          onChange={(val) => setForm((f) => ({ ...f, rating: val }))}
          ratedColor="amber"
        />
        <Textarea label="Komentar" name="komentar" onChange={handleChange} />
      </DialogBody>
      <DialogFooter>
        <Button variant="text" onClick={handleOpen} className="mr-1">
          Batal
        </Button>
        <Button variant="gradient" onClick={handleSubmit}>
          Simpan
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
