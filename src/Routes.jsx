import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout/MainLayout";
import Landing from "./pages/Landing";
import AddProduct from "./pages/AddProduct";
import ListProducts from "./pages/ListProducts";
import ListRecords from "./pages/ListRecords";
import AddRecord from "./pages/AddRecord";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Landing />} />
          <Route path="add-record" element={<AddRecord />} />
          <Route path="records" element={<ListRecords />} />
          <Route path="add-product" element={<AddProduct />} />
          <Route path="products" element={<ListProducts />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
