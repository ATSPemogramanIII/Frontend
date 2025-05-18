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
  "Aksi"
];

export function PaketTable() {
  const { pakets, error, retry } = usePaket();


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
            <Button variant="outlined" size="sm">
              View All
            </Button>
            <Button className="flex items-center gap-3" size="sm">
              <UserPlusIcon className="h-4 w-4" /> Tambah Data
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
                      <ChevronUpDownIcon strokeWidth={2} className="h-4 w-4" />
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
                  <td className={classes}>{paket.deskripsi}</td>
                  <td className={classes}>
                    <ul className="list-disc list-inside space-y-1">
                      {paket.destinasi.map((d, i) => (
                        <li key={i}>{d.nama}</li>
                      ))}
                    </ul>
                  </td>
                  <td className={classes}>
                    <div className="flex items-center gap-2">
                      <Tooltip content="Edit Paket">
                        <IconButton variant="text" color="blue">
                          <PencilIcon className="h-4 w-4" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip content="Hapus Paket">
                        <IconButton variant="text" color="red">
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
  );
}
