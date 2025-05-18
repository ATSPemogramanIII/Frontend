import React, { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import {
  ChevronUpDownIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  UserPlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import {
  Card,
  CardHeader,
  Input,
  Typography,
  Button,
  CardBody,
  CardFooter,
  IconButton,
  Tooltip,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { usePaket } from "../../hooks/usePaket";
import { TypographyAtom } from "../atoms/TypographyAtom";

const TABLE_HEAD = [
  "Kode Paket",
  "Nama Paket",
  "Tanggal Mulai",
  "Durasi Hari",
  "Deskripsi",
  "Destinasi",
  "Aksi",
];

export function PaketTable() {
  const { pakets, error, retry } = usePaket();
  // State modal tambah data
  const [openAdd, setOpenAdd] = useState(false);
  const [newData, setNewData] = useState({
    kode_paket: "",
    nama_paket: "",
    tanggal_mulai: "",
    durasi_hari: 1,
    deskripsi: "",
    destinasi: [], // nanti bisa dikembangkan
  });

  // Fungsi submit tambah paket baru (POST)
  const handleAdd = async () => {
    try {
      // Validasi sederhana
      if (!newData.kode_paket || !newData.nama_paket) {
        Swal.fire("Error", "Kode Paket dan Nama Paket wajib diisi", "error");
        return;
      }

      await axios.post("http://127.0.0.1:8088/api/paket", newData);

      Swal.fire("Sukses", "Paket wisata berhasil ditambahkan", "success");
      setOpenAdd(false);
      setNewData({
        kode_paket: "",
        nama_paket: "",
        tanggal_mulai: "",
        durasi_hari: 1,
        deskripsi: "",
        destinasi: [],
      });
      retry(); // refresh data
    } catch (error) {
      Swal.fire(
        "Gagal",
        error.response?.data?.message || "Gagal menambahkan paket",
        "error"
      );
    }
  };

  // State untuk edit modal dan data paket yg diedit
  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState({
    kode_paket: "",
    nama_paket: "",
    tanggal_mulai: "",
    durasi_hari: 1,
    deskripsi: "",
    destinasi: [], // bisa dihandle lebih lanjut jika mau edit destinasi
  });

  // Fungsi buka modal edit dan set data paket
  const handleOpenEdit = (paket) => {
    setEditData({
      ...paket,
      // pastikan durasi_hari number dan destinasi array sudah benar
      durasi_hari: paket.durasi_hari || 1,
      destinasi: paket.destinasi || [],
    });
    setOpenEdit(true);
  };

  // Fungsi update paket (PUT)
  const handleUpdate = async () => {
    try {
      // Validasi minimal nama dan kode paket
      if (!editData.nama_paket || !editData.kode_paket) {
        Swal.fire("Error", "Nama dan Kode Paket wajib diisi", "error");
        return;
      }

      // Kirim PUT request
      await axios.put(
        `http://127.0.0.1:8088/api/paket/${editData.kode_paket}`,
        editData
      );

      Swal.fire("Sukses", "Data paket berhasil diperbarui", "success");
      setOpenEdit(false);
      retry(); // refresh data
    } catch (error) {
      Swal.fire(
        "Gagal",
        error.response?.data?.message || "Gagal memperbarui data paket",
        "error"
      );
    }
  };

  // Fungsi hapus paket (DELETE)
  const handleDelete = (kode_paket) => {
    Swal.fire({
      title: "Yakin ingin menghapus?",
      text: `Paket dengan kode ${kode_paket} akan dihapus secara permanen!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://127.0.0.1:8088/api/paket/${kode_paket}`);
          Swal.fire("Terhapus!", "Data paket sudah dihapus.", "success");
          retry();
        } catch (error) {
          Swal.fire(
            "Gagal",
            error.response?.data?.message || "Gagal menghapus data paket",
            "error"
          );
        }
      }
    });
  };

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-4">
        <TypographyAtom variant="h6" color="red">
          Gagal mengambil data paket.
        </TypographyAtom>
        <Button color="red" onClick={retry}>
          Coba Lagi
        </Button>
      </div>
    );
  }

  return (
    <>
      <Card className="h-full w-full">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="mb-8 flex items-center justify-between gap-8">
            <div>
              <Typography variant="h5" color="blue-gray">
                Paket Wisata
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                Lihat semua Informasi tentang Paket Wisata
              </Typography>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <Button variant="outlined" size="sm" onClick={retry}>
              Refresh
            </Button>
              <Button
                className="flex items-center gap-3"
                size="sm"
                onClick={() => setOpenAdd(true)}
              >
                <UserPlusIcon className="h-4 w-4" /> Buat Paket Wisata
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Input
              label="Cari Paket"
              icon={<MagnifyingGlassIcon className="h-5 w-5" />}
              className="w-full md:w-72"
            />
          </div>
        </CardHeader>
        <CardBody className="overflow-scroll px-0">
          <table className="mt-4 w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {TABLE_HEAD.map((head, index) => (
                  <th
                    key={index}
                    className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50"
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                    >
                      {head}
                      {index !== TABLE_HEAD.length - 1 && (
                        <ChevronUpDownIcon
                          strokeWidth={2}
                          className="h-4 w-4"
                        />
                      )}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pakets.map((paket, index) => {
                const isLast = index === pakets.length - 1;
                const classes = isLast
                  ? "p-4"
                  : "p-4 border-b border-blue-gray-50";

                return (
                  <tr key={paket.kode_paket}>
                    <td className={classes}>{paket.kode_paket}</td>
                    <td className={classes}>{paket.nama_paket}</td>
                    <td className={classes}>{paket.tanggal_mulai}</td>
                    <td className={classes}>{paket.durasi_hari} hari</td>
                    <td
                      className={`${classes} break-words whitespace-pre-wrap max-w-xs`}
                    >
                      <Typography
                        variant="small"
                        color="gray"
                        className="whitespace-pre-wrap"
                      >
                        {paket.deskripsi}
                      </Typography>
                    </td>

                    <td className={classes}>
                      <ul className="list-disc list-inside space-y-1">
                        {paket.destinasi.map((d, i) => (
                          <li key={i}>{d.nama}</li>
                        ))}
                      </ul>
                    </td>
                    <td className={classes}>
                      <div className="flex items-center gap-2">
                        <Tooltip content="Edit">
                          <IconButton
                            variant="text"
                            color="blue"
                            onClick={() => handleOpenEdit(paket)}
                          >
                            <PencilIcon className="h-4 w-4" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip content="Hapus">
                          <IconButton
                            variant="text"
                            color="red"
                            onClick={() => handleDelete(paket.kode_paket)}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardBody>
        <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
          <Typography variant="small" color="blue-gray" className="font-normal">
            Page 1 of 1
          </Typography>
          <div className="flex gap-2">
            <Button variant="outlined" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outlined" size="sm" disabled>
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>
      {/* Dialog Tambah Paket */}
      <Dialog open={openAdd} handler={() => setOpenAdd(false)} size="md">
        <DialogHeader>Tambah Paket Wisata</DialogHeader>
        <DialogBody className="space-y-4">
          <Input
            label="Kode Paket"
            value={newData.kode_paket}
            onChange={(e) =>
              setNewData({ ...newData, kode_paket: e.target.value })
            }
          />
          <Input
            label="Nama Paket"
            value={newData.nama_paket}
            onChange={(e) =>
              setNewData({ ...newData, nama_paket: e.target.value })
            }
          />
          <Input
            label="Tanggal Mulai"
            type="date"
            value={newData.tanggal_mulai}
            onChange={(e) =>
              setNewData({ ...newData, tanggal_mulai: e.target.value })
            }
          />
          <Input
            label="Durasi Hari"
            type="number"
            min={1}
            value={newData.durasi_hari}
            onChange={(e) =>
              setNewData({
                ...newData,
                durasi_hari: parseInt(e.target.value) || 1,
              })
            }
          />
          <Input
            label="Deskripsi"
            value={newData.deskripsi}
            onChange={(e) =>
              setNewData({ ...newData, deskripsi: e.target.value })
            }
          />
          {/* Destinasi bisa ditambahkan nanti dengan UI yang sesuai */}
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={() => setOpenAdd(false)}
            className="mr-1"
          >
            Batal
          </Button>
          <Button variant="gradient" color="green" onClick={handleAdd}>
            Simpan
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Dialog Edit Paket */}
      <Dialog open={openEdit} handler={() => setOpenEdit(false)} size="md">
        <DialogHeader>Edit Paket Wisata</DialogHeader>
        <DialogBody className="space-y-4">
          <Input
            label="Kode Paket"
            value={editData.kode_paket}
            onChange={(e) =>
              setEditData({ ...editData, kode_paket: e.target.value })
            }
            disabled
          />
          <Input
            label="Nama Paket"
            value={editData.nama_paket}
            onChange={(e) =>
              setEditData({ ...editData, nama_paket: e.target.value })
            }
          />
          <Input
            label="Tanggal Mulai"
            type="date"
            value={editData.tanggal_mulai}
            onChange={(e) =>
              setEditData({ ...editData, tanggal_mulai: e.target.value })
            }
          />
          <Input
            label="Durasi Hari"
            type="number"
            value={editData.durasi_hari}
            onChange={(e) =>
              setEditData({
                ...editData,
                durasi_hari: parseInt(e.target.value),
              })
            }
          />
          <Input
            label="Deskripsi"
            value={editData.deskripsi}
            onChange={(e) =>
              setEditData({ ...editData, deskripsi: e.target.value })
            }
          />
          {/* Kalau ingin edit destinasi, perlu UI tambahan */}
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={() => setOpenEdit(false)}
            className="mr-1"
          >
            Batal
          </Button>
          <Button variant="gradient" color="green" onClick={handleUpdate}>
            Simpan
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}
