import { Route, Routes } from "react-router-dom";
import Config from "./components/configComponent";
import FormComponent from "./components/form";
import ExportToExcel from "./components/exportToExcell";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Config />} />
      <Route path="/fourm" element={<FormComponent />} />
      <Route path="/excell" element={<ExportToExcel />} />
    </Routes>
  );
};

export default AppRoutes;
