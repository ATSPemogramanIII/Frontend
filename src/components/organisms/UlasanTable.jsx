import React, { useState, useEffect } from "react";
import { useUlasan } from "../../hooks/useUlasan";
import {
  MagnifyingGlassIcon,
  ChevronUpDownIcon,
  TrashIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import { PencilIcon } from "@heroicons/react/24/solid";
import {
  Card,
  CardHeader,
  Input,
  Typography,
  Button,
  CardBody,
  Chip,
  CardFooter,
  IconButton,
  Tooltip,
} from "@material-tailwind/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import axios from "axios";

const TABLE_HEAD = [
  "Nama Pengguna",
  "Kode Paket",
  "Rating",
  "Komentar",
  "Tanggal",
  "Aksi",
];

export function UlasanTable() {
  const { ulasans, loading, error, retry } = useUlasan();
  const [localUlasans, setLocalUlasans] = useState([]);
  const [editing, setEditing] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    nama_pengguna: "",
    kode_paket: "",
    rating: "",
    komentar: "",
    tanggal: new Date(),
  });
  const API_URL = "http://127.0.0.1:8088/api/ulasan";

  // Sinkronisasi data ulasan dari hook ke local state
  useEffect(() => {
    setLocalUlasans(ulasans);
  }, [ulasans]);

  const handleAdd = async () => {
    if (!formData.nama_pengguna || !formData.komentar || !formData.kode_paket) {
      alert("Semua field wajib diisi!");
      return;
    }
  
    try {
      const response = await axios.post(API_URL, {
        ...formData,
        tanggal: formData.tanggal.toISOString(),
      });
  
      const newUlasan = {
        _id: response.data.insertedId || new Date().getTime(), // fallback id
        ...formData,
      };
  
      setLocalUlasans([...localUlasans, newUlasan]);
      setIsAdding(false);
      Swal.fire("Berhasil", "Ulasan berhasil ditambahkan", "success");
    } catch (error) {
      console.error("Gagal tambah ulasan:", error);
      Swal.fire("Gagal", "Gagal menambahkan ulasan", "error");
    }
  };
  

  const handleEdit = (id) => {
    const itemToEdit = localUlasans.find((item) => item._id === id);
    if (itemToEdit) {
      setFormData({
        nama_pengguna: itemToEdit.nama_pengguna,
        kode_paket: itemToEdit.kode_paket,
        rating: itemToEdit.rating,
        komentar: itemToEdit.komentar,
        tanggal: new Date(itemToEdit.tanggal),
      });
      setEditing(id);
    }
  };

  const handleSave = async () => {
    if (!formData.nama_pengguna || !formData.komentar) {
      alert("Nama pengguna dan komentar wajib diisi!");
      return;
    }

    try {
      const response = await axios.put(`${API_URL}/${editing}`, {
        ...formData,
        tanggal: formData.tanggal.toISOString(),
      });

      const newData = localUlasans.map((item) =>
        item._id === editing ? { ...item, ...formData } : item
      );
      setLocalUlasans(newData);
      setEditing(null);
      Swal.fire("Berhasil", "Ulasan berhasil diperbarui", "success");
    } catch (error) {
      console.error("Gagal update ulasan:", error);
      Swal.fire("Gagal", "Gagal memperbarui ulasan", "error");
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Yakin ingin menghapus?",
      text: "Data tidak bisa dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        const newData = localUlasans.filter((item) => item._id !== id);
        setLocalUlasans(newData);
        Swal.fire("Terhapus!", "Ulasan telah dihapus.", "success");
      } catch (error) {
        console.error("Gagal hapus ulasan:", error);
        Swal.fire("Gagal", "Gagal menghapus ulasan", "error");
      }
    }
  };

  return (
    <Card className="h-full w-full">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-8 flex items-center justify-between gap-8">
          <div>
            <Typography variant="h5" color="blue-gray">
              Daftar Ulasan
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              Lihat semua ulasan dari pengguna
            </Typography>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <Button variant="outlined" size="sm" onClick={retry}>
              Refresh
            </Button>
            <Button
              className="flex items-center gap-3"
              size="sm"
              onClick={() => {
                setFormData({
                  nama_pengguna: "",
                  kode_paket: "",
                  rating: "",
                  komentar: "",
                  tanggal: new Date(),
                });
                setIsAdding(true);
                setEditing(null); // pastikan tidak sedang edit
              }}
            >
              <UserPlusIcon className="h-4 w-4" /> Tambah Data
            </Button>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="w-full md:w-72">
            <Input
              label="Search"
              icon={<MagnifyingGlassIcon className="h-5 w-5" />}
            />
          </div>
        </div>
      </CardHeader>

      <CardBody className="overflow-scroll px-0">
        {loading ? (
          <Typography className="p-4">Loading...</Typography>
        ) : error ? (
          <Typography className="p-4 text-red-500">
            Error: {error.message}
          </Typography>
        ) : (
          <table className="mt-4 w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {TABLE_HEAD.map((head, index) => (
                  <th
                    key={head}
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
            {isAdding && (
  <tr>
    <td className="p-4">
      <Input
        value={formData.nama_pengguna}
        onChange={(e) =>
          setFormData({ ...formData, nama_pengguna: e.target.value })
        }
      />
    </td>
    <td className="p-4">
      <Input
        value={formData.kode_paket}
        onChange={(e) =>
          setFormData({ ...formData, kode_paket: e.target.value })
        }
      />
    </td>
    <td className="p-4">
      <Input
        type="number"
        value={formData.rating}
        onChange={(e) =>
          setFormData({ ...formData, rating: Number(e.target.value) })
        }
      />
    </td>
    <td className="p-4">
      <Input
        value={formData.komentar}
        onChange={(e) =>
          setFormData({ ...formData, komentar: e.target.value })
        }
      />
    </td>
    <td className="p-4">
      <DatePicker
        selected={formData.tanggal}
        onChange={(date) =>
          setFormData({ ...formData, tanggal: date })
        }
        dateFormat="dd/MM/yyyy"
        className="border p-2 rounded w-full"
      />
    </td>
    <td className="p-4">
      <div className="flex gap-2">
        <Button size="sm" onClick={handleAdd} color="blue">
          Simpan
        </Button>
        <Button size="sm" onClick={() => setIsAdding(false)} color="gray">
          Batal
        </Button>
      </div>
    </td>
  </tr>
)}

              {localUlasans.map((item, index) => {
                const isLast = index === localUlasans.length - 1;
                const classes = isLast
                  ? "p-4"
                  : "p-4 border-b border-blue-gray-50";

                const isEditing = editing === item._id;

                return (
                  <tr key={item._id}>
                    <td className={classes}>
                      {isEditing ? (
                        <Input
                          value={formData.nama_pengguna}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              nama_pengguna: e.target.value,
                            })
                          }
                        />
                      ) : (
                        <Typography variant="small" color="blue-gray">
                          {item.nama_pengguna}
                        </Typography>
                      )}
                    </td>
                    <td className={classes}>
                      {isEditing ? (
                        <Input
                          value={formData.kode_paket}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              kode_paket: e.target.value,
                            })
                          }
                        />
                      ) : (
                        item.kode_paket
                      )}
                    </td>
                    <td className={classes}>
                      {isEditing ? (
                        <Input
                          type="number"
                          value={formData.rating}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              rating: Number(e.target.value),
                            })
                          }
                        />
                      ) : (
                        <Chip
                          value={item.rating + " ⭐"}
                          color="amber"
                          size="sm"
                        />
                      )}
                    </td>
                    <td className={classes}>
                      {isEditing ? (
                        <Input
                          value={formData.komentar}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              komentar: e.target.value,
                            })
                          }
                        />
                      ) : (
                        item.komentar
                      )}
                    </td>
                    <td className={classes}>
                      {isEditing ? (
                        <DatePicker
                          selected={formData.tanggal}
                          onChange={(date) =>
                            setFormData({ ...formData, tanggal: date })
                          }
                          dateFormat="dd/MM/yyyy"
                          className="border p-2 rounded w-full"
                        />
                      ) : (
                        new Date(item.tanggal).toLocaleDateString("id-ID")
                      )}
                    </td>
                    <td className={classes}>
                      <div className="flex gap-2">
                        {isEditing ? (
                          <>
                            <Button
                              size="sm"
                              onClick={handleSave}
                              color="green"
                            >
                              Simpan
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => setEditing(null)}
                              color="gray"
                            >
                              Batal
                            </Button>
                          </>
                        ) : (
                          <>
                            <Tooltip content="Edit">
                              <IconButton
                                variant="text"
                                color="blue"
                                onClick={() => handleEdit(item._id)}
                              >
                                <PencilIcon className="h-4 w-4" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip content="Hapus">
                              <IconButton
                                variant="text"
                                color="red"
                                onClick={() => handleDelete(item._id)}
                              >
                                <TrashIcon className="h-4 w-4" />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </CardBody>

      <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
        <Typography variant="small" color="blue-gray" className="font-normal">
          {localUlasans.length === 0
            ? "No data"
            : `Menampilkan ${localUlasans.length} ulasan`}
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
  );
}
