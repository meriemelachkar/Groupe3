import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import SignUp from "../pages/Signup";
import { Dashboard } from "../pages/Dashboard";
import { ProjectsList } from "../pages/ProjectsList";
import PropertiesList from "../pages/PropertiesList";
import ProjectDetailsPage from "../pages/ProjectDetails";
import { PropertyDetailsPage } from "../pages/PropertyDetails";
import { Messages } from "../pages/Messages";

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projects" element={<ProjectsList />} />
        <Route path="/projects/:id" element={<ProjectDetailsPage />} />
        <Route path="/properties" element={<PropertiesList />} />
        <Route path="/properties/:id" element={<PropertyDetailsPage />} />
        <Route path="/messages" element={<Messages />} />
      </Routes>
    </Router>
  );
}
