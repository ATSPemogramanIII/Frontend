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
import { usePaketDestinasi } from "../../hooks/usePaketDestinasi";
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

export function PaketDestinasiTable() {
  // Panggil hook dari usePaketDestinasi
  const { paketDestinasis, error, retry } = usePaketDestinasi();

  // State modal tambah data
  const [openAdd, setOpenAdd] = useState(false);
  const [newData, setNewData] = useState({
    kode_paket: "",
    nama_paket: "",
    tanggal_mulai: "",
    durasi_hari: 1,
    deskripsi: "",
    kode_destinasi: [], // pakai array kode destinasi untuk backend
  });

  // State edit data
  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState({
    kode_paket: "",
    nama_paket: "",
    tanggal_mulai: "",
    durasi_hari: 1,
    deskripsi: "",
    kode_destinasi: [],
  });

  // Fungsi submit tambah paket baru (POST)
  const handleAdd = async () => {
    try {
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
        kode_destinasi: [],
      });
      retry();
    } catch (error) {
      Swal.fire(
        "Gagal",
        error.response?.data?.message || "Gagal menambahkan paket",
        "error"
      );
    }
  };

  // Fungsi buka modal edit dan set data paket
  const handleOpenEdit = (paketWithDest) => {
    const { PaketWisata, Destinasi } = paketWithDest;
    setEditData({
      ...PaketWisata,
      durasi_hari: PaketWisata.durasi_hari || 1,
      kode_destinasi: PaketWisata.KodeDestinasi || [],
    });
    setOpenEdit(true);
  };

  // Fungsi update paket (PUT)
  const handleUpdate = async () => {
    try {
      if (!editData.nama_paket || !editData.kode_paket) {
        Swal.fire("Error", "Nama dan Kode Paket wajib diisi", "error");
        return;
      }

      await axios.put(
        `http://127.0.0.1:8088/api/paket/${editData.kode_paket}`,
        editData
      );

      Swal.fire("Sukses", "Data paket berhasil diperbarui", "success");
      setOpenEdit(false);
      retry();
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
              {(paketDestinasis || []).map((item, index) => {
                const { PaketWisata, Destinasi } = item;
                const isLast = index === paketDestinasis.length - 1;
                const classes = isLast
                  ? "p-4"
                  : "p-4 border-b border-blue-gray-50";

                return (
                  <tr key={PaketWisata.kode_paket || PaketWisata.KodePaket}>
                    <td className={classes}>
                      {PaketWisata.kode_paket || PaketWisata.KodePaket}
                    </td>
                    <td className={classes}>
                      {PaketWisata.nama_paket || PaketWisata.NamaPaket}
                    </td>
                    <td className={classes}>
                      {PaketWisata.tanggal_mulai || PaketWisata.TanggalMulai}
                    </td>
                    <td className={classes}>
                      {PaketWisata.durasi_hari || PaketWisata.DurasiHari}
                    </td>
                    <td className={classes}>
                      {PaketWisata.deskripsi || PaketWisata.Deskripsi}
                    </td>
                    <td className={classes}>
                      {Destinasi.map(
                        (d) => d.nama_destinasi || d.NamaDestinasi
                      ).join(", ")}
                    </td>
                    <td className={classes}>
                      <Tooltip content="Edit Paket Wisata">
                        <IconButton
                          variant="text"
                          color="blue"
                          onClick={() => handleOpenEdit(item)}
                        >
                          <PencilIcon className="h-4 w-4" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip content="Hapus Paket Wisata">
                        <IconButton
                          variant="text"
                          color="red"
                          onClick={() =>
                            handleDelete(
                              PaketWisata.kode_paket || PaketWisata.KodePaket
                            )
                          }
                        >
                          <TrashIcon className="h-4 w-4" />
                        </IconButton>
                      </Tooltip>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardBody>
        <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
          <Typography variant="small" color="blue-gray" className="font-normal">
            Menampilkan {paketDestinasis.length} dari {paketDestinasis.length}{" "}
            data
          </Typography>
        </CardFooter>
      </Card>
      {/* Dialog tambah paket */}
      <Dialog open={openAdd} handler={() => setOpenAdd(!openAdd)}>
        <DialogHeader>Tambah Paket Wisata</DialogHeader>
        <DialogBody divider>
          <div className="flex flex-col gap-4">
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
              type="date"
              label="Tanggal Mulai"
              value={newData.tanggal_mulai}
              onChange={(e) =>
                setNewData({ ...newData, tanggal_mulai: e.target.value })
              }
            />
            <Input
              type="number"
              label="Durasi Hari"
              value={newData.durasi_hari}
              onChange={(e) =>
                setNewData({ ...newData, durasi_hari: Number(e.target.value) })
              }
            />
            <Input
              label="Deskripsi"
              value={newData.deskripsi}
              onChange={(e) =>
                setNewData({ ...newData, deskripsi: e.target.value })
              }
            />
            {/* Untuk kode_destinasi, bisa pakai select multi atau input text comma separated */}
            <Input
              label="Kode Destinasi (pisah koma)"
              value={newData.kode_destinasi.join(",")}
              onChange={(e) =>
                setNewData({
                  ...newData,
                  kode_destinasi: e.target.value
                    .split(",")
                    .map((v) => v.trim()),
                })
              }
            />
          </div>
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
          <Button variant="gradient" onClick={handleAdd}>
            Simpan
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Dialog edit paket */}
      <Dialog open={openEdit} handler={() => setOpenEdit(!openEdit)}>
        <DialogHeader>Edit Paket Wisata</DialogHeader>
        <DialogBody divider>
          <div className="flex flex-col gap-4">
            <Input label="Kode Paket" value={editData.kode_paket} disabled />
            <Input
              label="Nama Paket"
              value={editData.nama_paket}
              onChange={(e) =>
                setEditData({ ...editData, nama_paket: e.target.value })
              }
            />
            <Input
              type="date"
              label="Tanggal Mulai"
              value={editData.tanggal_mulai}
              onChange={(e) =>
                setEditData({ ...editData, tanggal_mulai: e.target.value })
              }
            />
            <Input
              type="number"
              label="Durasi Hari"
              value={editData.durasi_hari}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  durasi_hari: Number(e.target.value),
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
            <Input
              label="Kode Destinasi (pisah koma)"
              value={editData.kode_destinasi.join(",")}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  kode_destinasi: e.target.value
                    .split(",")
                    .map((v) => v.trim()),
                })
              }
            />
          </div>
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
          <Button variant="gradient" onClick={handleUpdate}>
            Update
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}
