import React, { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import AppLayout from "./layout/AppLayout";

import About from "./pages/About";
import AllJobs from "./pages/AllJobs";
import Applications from "./pages/Applications";
import ApplyJob from "./pages/ApplyJob";
import CandidatesLogin from "./pages/CandidatesLogin";
import CandidatesSignup from "./pages/CandidatesSignup";
import Home from "./pages/Home";
import Terms from "./pages/Terms";
import RecruiterLogin from "./pages/RecruiterLogin";
import RecruiterSignup from "./pages/RecruiterSignup";
import Dashborad from "./pages/Dashborad";
import AddJobs from "./pages/AddJobs";
import ManageJobs from "./pages/ManageJobs";
import ViewApplications from "./pages/ViewApplications";

import { AppContext } from "./context/AppContext";

const App = () => {
  const { companyToken } = useContext(AppContext);

  return (
    <AppLayout>
      <Routes>
        {/* Home */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />

        {/* Jobs */}
        <Route path="/all-jobs/:category" element={<AllJobs />} />
        <Route path="/apply-job/:id" element={<ApplyJob />} />

        {/* Other Pages */}
        <Route path="/terms" element={<Terms />} />
        <Route path="/about" element={<About />} />
        <Route path="/applications" element={<Applications />} />

        {/* Candidate */}
        <Route path="/candidate-login" element={<CandidatesLogin />} />
        <Route path="/candidate-signup" element={<CandidatesSignup />} />

        {/* Recruiter */}
        <Route path="/recruiter-login" element={<RecruiterLogin />} />
        <Route path="/recruiter-signup" element={<RecruiterSignup />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashborad />}>
          <Route path="add-job" element={<AddJobs />} />
          <Route path="manage-jobs" element={<ManageJobs />} />
          <Route path="view-applications" element={<ViewApplications />} />
        </Route>
      </Routes>
    </AppLayout>
  );
};

export default App;