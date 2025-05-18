import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
} from "@material-tailwind/react";
import {
  PresentationChartBarIcon,
  ShoppingBagIcon,
  ClipboardDocumentListIcon,
  ChatBubbleLeftEllipsisIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/solid";
import { Link, useLocation } from "react-router-dom";

export function Sidebar({ open, onLinkClick }) {
  const location = useLocation();

  const menus = [
    { name: "Dashboard Paket", path: "/", icon: PresentationChartBarIcon },
    { name: "Data Pemesanan", path: "/pemesanan", icon: ShoppingBagIcon },
    {
      name: "Ulasan Pelanggan",
      path: "/ulasan",
      icon: ChatBubbleLeftEllipsisIcon,
    },
    // {
    //   name: "Manajemen Paket",
    //   path: "/manajemen-paket",
    //   icon: ClipboardDocumentListIcon,
    // },
    { name: "Pengaturan", path: "/settings", icon: Cog6ToothIcon },
    { name: "Keluar", path: "/logout", icon: ArrowRightOnRectangleIcon },
  ];

  return (
    <aside
      className={`fixed top-16 left-0 z-50 h-[calc(100vh-4rem)] w-64 bg-white shadow-lg transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}
      `}
      style={{ paddingTop: "1rem", paddingBottom: "1rem" }}
    >
      <Card className="h-full bg-white shadow-none p-4">
        <Typography
          variant="h5"
          color="blue-gray"
          className="mb-6 text-center font-semibold"
        >
          TourApp
        </Typography>

        <List>
          {menus.map(({ name, path, icon: Icon }, idx) => {
            const isActive = location.pathname === path;
            return (
              <Link
                to={path}
                key={idx}
                onClick={() => onLinkClick && onLinkClick()}
                className={`block rounded-md ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "hover:bg-blue-100 text-blue-gray-700"
                }`}
              >
                <ListItem className="cursor-pointer px-3 py-2">
                  <ListItemPrefix>
                    <Icon
                      className={`h-5 w-5 ${
                        isActive ? "text-white" : "text-blue-gray-500"
                      }`}
                    />
                  </ListItemPrefix>
                  {name}
                </ListItem>
              </Link>
            );
          })}
        </List>
      </Card>
    </aside>
  );
}
