import React from "react";
import { useParams } from "react-router-dom";
import { useDestinasi } from "../../hooks/useDestinasi";
import { Typography, Button, Card, CardBody, CardHeader } from "@material-tailwind/react";

export function DestinasiDetail() {
  const { id } = useParams();
  const { destinasi, loading, error, retry } = useDestinasi(id);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Typography variant="h6" color="blue-gray">Loading destinasi...</Typography>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-4">
        <Typography variant="h6" color="red">Gagal mengambil data destinasi.</Typography>
        <Button color="red" onClick={retry}>Coba Lagi</Button>
      </div>
    );
  }

  if (!destinasi) {
    return (
      <div className="flex justify-center items-center h-64">
        <Typography variant="h6" color="gray">Destinasi tidak ditemukan.</Typography>
      </div>
    );
  }

  return (
    <Card className="max-w-3xl mx-auto mt-10">
      <CardHeader floated={false} shadow={false} className="rounded-none p-6">
        <Typography variant="h4" color="blue-gray">
          {destinasi.nama || "Nama Destinasi"}
        </Typography>
      </CardHeader>
      <CardBody className="p-6 space-y-4">
        <Typography variant="h6" color="blue-gray">Kode Destinasi:</Typography>
        <Typography>{destinasi.kode_destinasi || "-"}</Typography>

        <Typography variant="h6" color="blue-gray">Deskripsi:</Typography>
        <Typography className="whitespace-pre-wrap">{destinasi.deskripsi || "-"}</Typography>

        <Typography variant="h6" color="blue-gray">Lokasi:</Typography>
        <Typography>{destinasi.lokasi || "-"}</Typography>

        {/* Kalau ada data lain, bisa ditambahkan di sini */}
      </CardBody>
    </Card>
  );
}
