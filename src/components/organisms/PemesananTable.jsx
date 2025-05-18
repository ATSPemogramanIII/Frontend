import {
  MagnifyingGlassIcon,
  ChevronUpDownIcon,
  PencilIcon,
  TrashIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import {
  Card,
  CardHeader,
  Input,
  Typography,
  Button,
  CardBody,
  CardFooter,
  Tabs,
  TabsHeader,
  Tab,
  IconButton,
  Tooltip,
  Chip,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import Swal from "sweetalert2";

import { usePemesanan } from "../../hooks/usePemesanan";
import axios from "axios";
import React, { useState } from "react";

const TABLE_HEAD = [
  "Nama Pemesan",
  "Email",
  "No. Telepon",
  "Kode Paket",
  "Jumlah Orang",
  "Tanggal Pesan",
  "Status",
  "Aksi",
];

export function PemesananTable() {
  const { pemesanans, loading, error, retry } = usePemesanan();
  const [activeTab, setActiveTab] = useState("all");
  const filteredPemesanans =
    activeTab === "all"
      ? pemesanans
      : pemesanans.filter((p) => p.status === activeTab);

  const [editData, setEditData] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);

  const [newData, setNewData] = useState({
    nama_pemesan: "",
    email: "",
    nomor_telepon: "",
    kode_paket: "",
    jumlah_orang: 1,
    tanggal_pesan: "",
    status: "Pending",
  });
  const [openAdd, setOpenAdd] = useState(false);

  const handleAdd = async () => {
    if (
      !newData.nama_pemesan ||
      !newData.email ||
      !newData.kode_paket ||
      !newData.tanggal_pesan
    ) {
      Swal.fire(
        "Gagal!",
        "Harap lengkapi semua data yang wajib diisi.",
        "error"
      );
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newData.email)) {
      Swal.fire("Gagal!", "Format email tidak valid.", "error");
      return;
    }

    try {
      const tanggalPesanISO = new Date(newData.tanggal_pesan).toISOString();

      const response = await axios.post("http://127.0.0.1:8088/api/pemesanan", {
        ...newData,
        tanggal_pesan: tanggalPesanISO,
        status: newData.status.toLowerCase(),
      });

      setOpenAdd(false);
      retry();
      Swal.fire("Berhasil!", "Data pemesanan berhasil ditambahkan.", "success");
      setNewData({
        nama_pemesan: "",
        email: "",
        nomor_telepon: "",
        kode_paket: "",
        jumlah_orang: 1,
        tanggal_pesan: "",
        status: "pending",
      });
      if (newData.jumlah_orang <= 0) {
        Swal.fire("Gagal!", "Jumlah orang harus lebih dari 0.", "error");
        return;
      }
    } catch (err) {
      console.error("Error response backend:", err.response?.data);
      Swal.fire("Gagal!", "Gagal menambahkan data.", "error");
    }
  };

  const handleEdit = (data) => {
    setEditData(data); // data pemesanan yang ingin diedit
    setOpenEdit(true); // buka modal
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `http://127.0.0.1:8088/api/pemesanan/${editData._id}`,
        editData
      );
      setOpenEdit(false);
      retry();
      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Pemesanan berhasil diperbarui.",
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Gagal memperbarui pemesanan.",
      });
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data yang dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://127.0.0.1:8088/api/pemesanan/${id}`);
        retry();
        Swal.fire("Terhapus!", "Data berhasil dihapus.", "success");
      } catch (err) {
        Swal.fire("Gagal!", "Gagal menghapus data.", "error");
        console.error(err);
      }
    }
  };

  return (
    <Card className="h-full w-full">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-8 flex items-center justify-between gap-8">
          <div>
            <Typography variant="h5" color="blue-gray">
              Daftar Pemesanan
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              Lihat semua pemesanan yang masuk
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
              <UserPlusIcon className="h-4 w-4" /> Tambah Pemesanan
            </Button>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <Tabs value={activeTab} className="w-full md:w-max">
            <TabsHeader>
              <Tab value="all" onClick={() => setActiveTab("all")}>
                Semua
              </Tab>
              <Tab
                value="Dikonfirmasi"
                onClick={() => setActiveTab("Dikonfirmasi")}
              >
                Dikonfirmasi
              </Tab>
              <Tab value="Pending" onClick={() => setActiveTab("Pending")}>
                Pending
              </Tab>
              <Tab
                value="Dibatalkan"
                onClick={() => setActiveTab("Dibatalkan")}
              >
                Dibatalkan
              </Tab>
            </TabsHeader>
          </Tabs>
          <div className="w-full md:w-72">
            <Input
              label="Cari pemesan"
              icon={<MagnifyingGlassIcon className="h-5 w-5" />}
            />
          </div>
        </div>
      </CardHeader>

      <CardBody className="overflow-scroll px-0">
        <table className="mt-4 w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head, index) => (
                <th
                  key={head}
                  className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="flex items-center justify-between gap-2 font-normal opacity-70"
                  >
                    {head}
                    {index !== TABLE_HEAD.length - 1 && (
                      <ChevronUpDownIcon className="h-4 w-4" />
                    )}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={TABLE_HEAD.length} className="text-center py-6">
                  <Typography>Loading...</Typography>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={TABLE_HEAD.length} className="text-center py-6">
                  <Typography color="red">Gagal memuat data.</Typography>
                </td>
              </tr>
            ) : (
              filteredPemesanans.map((p, index) => {
                const isLast = index === pemesanans.length - 1;
                const classes = isLast
                  ? "p-4"
                  : "p-4 border-b border-blue-gray-50";
                return (
                  <tr key={p._id}>
                    <td className={classes}>{p.nama_pemesan}</td>
                    <td className={classes}>{p.email}</td>
                    <td className={classes}>{p.nomor_telepon}</td>
                    <td className={classes}>{p.kode_paket}</td>
                    <td className={classes}>{p.jumlah_orang}</td>
                    <td className={classes}>
                      {new Date(p.tanggal_pesan).toLocaleDateString("id-ID")}
                    </td>
                    <td className={classes}>
                      <Chip
                        size="sm"
                        variant="ghost"
                        value={p.status}
                        color={
                          p.status.toLowerCase() === "dikonfirmasi"
                            ? "green"
                            : p.status.toLowerCase() === "dibatalkan"
                            ? "red"
                            : "amber"
                        }
                      />
                    </td>
                    <td className={classes}>
                      <div className="flex gap-2">
                        <Tooltip content="Edit">
                          <IconButton
                            variant="text"
                            color="blue"
                            onClick={() => handleEdit(p)}
                          >
                            <PencilIcon className="h-4 w-4" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip content="Hapus">
                          <IconButton
                            variant="text"
                            color="red"
                            onClick={() => handleDelete(p._id)}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </CardBody>

      <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
        <Typography variant="small" color="blue-gray" className="font-normal">
          Page 1 of 1
        </Typography>
      </CardFooter>
      <Dialog open={openAdd} handler={() => setOpenAdd(false)} size="sm">
        <DialogHeader>Tambah Pemesanan</DialogHeader>
        <DialogBody className="space-y-4">
          <Input
            label="Nama Pemesan"
            value={newData.nama_pemesan}
            onChange={(e) =>
              setNewData({ ...newData, nama_pemesan: e.target.value })
            }
          />
          <Input
            label="Email"
            value={newData.email}
            onChange={(e) => setNewData({ ...newData, email: e.target.value })}
          />
          <Input
            label="Nomor Telepon"
            value={newData.nomor_telepon}
            onChange={(e) =>
              setNewData({ ...newData, nomor_telepon: e.target.value })
            }
          />
          <Input
            label="Kode Paket"
            value={newData.kode_paket}
            onChange={(e) =>
              setNewData({ ...newData, kode_paket: e.target.value })
            }
          />
          <Input
            label="Jumlah Orang"
            type="number"
            value={newData.jumlah_orang}
            onChange={(e) =>
              setNewData({
                ...newData,
                jumlah_orang: parseInt(e.target.value),
              })
            }
          />
          <Input
            label="Tanggal Pesan"
            type="date"
            value={newData.tanggal_pesan}
            onChange={(e) =>
              setNewData({ ...newData, tanggal_pesan: e.target.value })
            }
          />
          <select
            value={newData.status}
            onChange={(e) => setNewData({ ...newData, status: e.target.value })}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          >
            <option value="pending">Pending</option>
            <option value="dikonfirmasi">Dikonfirmasi</option>
            <option value="dibatalkan">Dibatalkan</option>
          </select>
        </DialogBody>
        <DialogFooter>
          <Button variant="text" onClick={() => setOpenAdd(false)}>
            Batal
          </Button>
          <Button variant="gradient" onClick={handleAdd}>
            Simpan
          </Button>
        </DialogFooter>
      </Dialog>

      <Dialog open={openEdit} handler={() => setOpenEdit(false)} size="sm">
        <DialogHeader>Edit Pemesanan</DialogHeader>
        <DialogBody className="space-y-4">
          <Input
            label="Nama Pemesan"
            value={editData?.nama_pemesan || ""}
            onChange={(e) =>
              setEditData((prev) => ({ ...prev, nama_pemesan: e.target.value }))
            }
          />
          <Input
            label="Email"
            value={editData?.email || ""}
            onChange={(e) =>
              setEditData((prev) => ({ ...prev, email: e.target.value }))
            }
          />
          <Input
            label="Nomor Telepon"
            value={editData?.nomor_telepon || ""}
            onChange={(e) =>
              setEditData((prev) => ({
                ...prev,
                nomor_telepon: e.target.value,
              }))
            }
          />
          <Input
            label="Kode Paket"
            value={editData?.kode_paket || ""}
            onChange={(e) =>
              setEditData((prev) => ({ ...prev, kode_paket: e.target.value }))
            }
          />
          <Input
            label="Jumlah Orang"
            type="number"
            value={editData?.jumlah_orang || ""}
            onChange={(e) =>
              setEditData((prev) => ({
                ...prev,
                jumlah_orang: parseInt(e.target.value),
              }))
            }
          />
          <Input
            label="Tanggal Pesan"
            type="date"
            value={
              editData?.tanggal_pesan
                ? new Date(editData.tanggal_pesan).toISOString().split("T")[0]
                : ""
            }
            onChange={(e) =>
              setEditData((prev) => ({
                ...prev,
                tanggal_pesan: new Date(e.target.value),
              }))
            }
          />
          <select
            value={editData?.status || ""}
            onChange={(e) =>
              setEditData((prev) => ({ ...prev, status: e.target.value }))
            }
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          >
            <option value="Pending">Pending</option>
            <option value="Dikonfirmasi">Dikonfirmasi</option>
            <option value="Dibatalkan">Dibatalkan</option>
          </select>
        </DialogBody>
        <DialogFooter>
          <Button variant="text" onClick={() => setOpenEdit(false)}>
            Batal
          </Button>
          <Button variant="gradient" onClick={handleUpdate}>
            Simpan
          </Button>
        </DialogFooter>
      </Dialog>
    </Card>
  );
}
