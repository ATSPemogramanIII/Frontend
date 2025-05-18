import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LayoutDashboard } from "./components/layouts/LayoutDashboard";
import { PaketPage } from "./pages/PaketPage";
import { PemesananPage } from "./pages/PemesananPage";
import { UlasanPage } from "./pages/UlasanPage";
// import { PaketDestinasiPage } from "./pages/PaketDestinasiPAge";
import { DestinasiDetailPage } from "./pages/DestinasiDetailPage";

export default function App() {
  return (
    <Router>
      <LayoutDashboard>
        <Routes>
          <Route path="/" element={<PaketPage />} />
          <Route path="/Pemesanan" element={<PemesananPage />} />
          <Route path="/Ulasan" element={<UlasanPage />} />
          {/* <Route path="/PaketDestinasi" element={<PaketDestinasiPage />} /> */}
          <Route path="/PaketDestinasi/:id" element={<DestinasiDetailPage />} />
        </Routes>
      </LayoutDashboard>
    </Router>
  );
}
