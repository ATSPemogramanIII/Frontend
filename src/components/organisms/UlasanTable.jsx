import React from "react";
import { useUlasan } from "../../hooks/useUlasan";
import {
  MagnifyingGlassIcon,
  ChevronUpDownIcon,
  TrashIcon,
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

const TABLE_HEAD = ["Nama Pengguna", "Kode Paket","Rating", "Komentar", "Tanggal", "Aksi"];

export function UlasanTable() {
  const { ulasans, loading, error, retry } = useUlasan();

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
              {ulasans.map((item, index) => {
                const isLast = index === ulasans.length - 1;
                const classes = isLast
                  ? "p-4"
                  : "p-4 border-b border-blue-gray-50";
                return (
                  <tr key={item._id}>
                    <td className={classes}>
                      <Typography variant="small" color="blue-gray">
                        {item.nama_pengguna}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography variant="small" color="blue-gray">
                        {item.kode_paket}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Chip
                        value={item.rating + " ⭐"}
                        color="amber"
                        size="sm"
                      />
                    </td>
                    <td className={classes}>
                      <Typography variant="small" color="blue-gray">
                        {item.komentar}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography variant="small" color="blue-gray">
                        {new Date(item.tanggal).toLocaleDateString("id-ID")}
                      </Typography>
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
              })}
            </tbody>
          </table>
        )}
      </CardBody>

      <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
        <Typography variant="small" color="blue-gray" className="font-normal">
          {ulasans.length === 0
            ? "No data"
            : `Menampilkan ${ulasans.length} ulasan`}
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
