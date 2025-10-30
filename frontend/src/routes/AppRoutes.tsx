import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import SignUp from "../pages/Signup";
import PropertiesList from "../pages/PropertiesList";
import { PropertyDetailsPage } from "../pages/PropertyDetails";
import { Dashboard } from "../pages/Dashboard";

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/properties" element={<PropertiesList />} />
        <Route path="/properties/:id" element={<PropertyDetailsPage />} />
      </Routes>
    </Router>
  );
}
