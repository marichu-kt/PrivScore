import { createHashRouter } from "react-router-dom";
import AppLayout from "../layout/appLayout";
import CatalogPage from "../pages/catalogPage";
import ServiceDetailPage from "../pages/serviceDetailPage";
import AnalysisDetailPage from "../pages/analysisDetailPage";

export const router = createHashRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <CatalogPage /> },
      { path: "services/:id", element: <ServiceDetailPage /> },
      { path: "analysis", element: <AnalysisDetailPage /> },
    ],
  },
]);
