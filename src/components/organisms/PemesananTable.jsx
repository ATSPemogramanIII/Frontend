import {
  MagnifyingGlassIcon,
  ChevronUpDownIcon,
  PencilIcon,
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
  Tabs,
  TabsHeader,
  Tab,
  IconButton,
  Tooltip,
  Chip,
} from "@material-tailwind/react";
import { usePemesanan } from "../../hooks/usePemesanan";

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

  const handleEdit = (id) => {
    console.log("Edit pemesanan:", id);
    // TODO: Implementasi buka modal atau navigasi ke form edit
  };

  const handleDelete = async (id) => {
    if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      try {
        await axios.delete(`http://127.0.0.1:8088/api/pemesanan/${id}`);
        alert("Data berhasil dihapus.");
        retry(); // refresh data
      } catch (err) {
        alert("Gagal menghapus data.");
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
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <Tabs value="all" className="w-full md:w-max">
            <TabsHeader>
              <Tab value="all">Semua</Tab>
              {/* Bisa tambahkan filter status jika perlu */}
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
              pemesanans.map((p, index) => {
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
                        color={p.status === "selesai" ? "green" : "amber"}
                      />
                    </td>
                    <td className={classes}>
                      <div className="flex gap-2">
                        <Tooltip content="Edit">
                          <IconButton
                            variant="text"
                            color="blue"
                            onClick={() => handleEdit(p._id)}
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
    </Card>
  );
}
