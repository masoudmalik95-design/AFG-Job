import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:5000";

  const [searchFilter, setSearchFilter] = useState({
    title: "",
    location: "",
  });

  const [isSearched, setIsSearched] = useState(false);

  const [jobs, setJobs] = useState([]);
  const [jobLoading, setJobLoading] = useState(false);

  // =========================
  // User
  // =========================

  const [userToken, setUserToken] = useState(
    localStorage.getItem("userToken")
  );

  const [userData, setUserData] = useState(null);

  const [userDataLoading, setUserDataLoading] = useState(false);

  const [isLogin, setIsLogin] = useState(
    Boolean(localStorage.getItem("userToken"))
  );

  const [userApplication, setUserApplication] = useState([]);

  const [applicationsLoading, setApplicationsLoading] = useState(false);

  // =========================
  // Company
  // =========================

  const [companyToken, setCompanyToken] = useState(
    localStorage.getItem("companyToken")
  );

  const [companyData, setCompanyData] = useState(null);

  const [isCompanyLogin, setIsCompanyLogin] = useState(
    Boolean(localStorage.getItem("companyToken"))
  );

  const [companyLoading, setCompanyLoading] = useState(false);

  // =========================
  // Token Storage
  // =========================

  useEffect(() => {
    if (userToken) {
      localStorage.setItem("userToken", userToken);
    } else {
      localStorage.removeItem("userToken");
    }
  }, [userToken]);

  useEffect(() => {
    if (companyToken) {
      localStorage.setItem("companyToken", companyToken);
    } else {
      localStorage.removeItem("companyToken");
    }
  }, [companyToken]);

  // =========================
  // Fetch User Data
  // =========================

  const fetchUserData = async () => {
    if (!userToken) {
      setUserData(null);
      return;
    }

    setUserDataLoading(true);

    try {
      const { data } = await axios.get(
        `${backendUrl}/user/user-data`,
        {
          headers: {
            token: userToken,
          },
        }
      );

      if (data?.success) {
        setUserData(data.userData);
      } else {
        setUserData(null);
        toast.error(
          data?.message || "دریافت اطلاعات کارجو انجام نشد"
        );
      }
    } catch (error) {
      console.error("Fetch user data error:", error);

      setUserData(null);

      toast.error(
        error?.response?.data?.message ||
          "دریافت اطلاعات کارجو انجام نشد"
      );
    } finally {
      setUserDataLoading(false);
    }
  };

  // =========================
  // Fetch Company Data
  // =========================

  const fetchCompanyData = async () => {
    if (!companyToken) {
      setCompanyData(null);
      return;
    }

    setCompanyLoading(true);

    try {
      const { data } = await axios.get(
        `${backendUrl}/company/company-data`,
        {
          headers: {
            token: companyToken,
          },
        }
      );

      if (data?.success) {
        setCompanyData(data.companyData);
      } else {
        setCompanyData(null);

        toast.error(
          data?.message || "دریافت اطلاعات کارفرما انجام نشد"
        );
      }
    } catch (error) {
      console.error("Fetch company data error:", error);

      setCompanyData(null);

      toast.error(
        error?.response?.data?.message ||
          "دریافت اطلاعات کارفرما انجام نشد"
      );
    } finally {
      setCompanyLoading(false);
    }
  };

  // =========================
  // Fetch All Jobs
  // =========================

  const fetchJobsData = async () => {
    setJobLoading(true);

    try {
      const { data } = await axios.get(
        `${backendUrl}/job/all-jobs`
      );

      if (data?.success) {
        setJobs(
          Array.isArray(data.jobData)
            ? data.jobData
            : []
        );
      } else {
        setJobs([]);

        toast.error(
          data?.message || "دریافت آگهی‌های وظایف انجام نشد"
        );
      }
    } catch (error) {
      console.error("Fetch jobs error:", error);

      setJobs([]);

      toast.error(
        error?.response?.data?.message ||
          "دریافت آگهی‌های وظایف انجام نشد"
      );
    } finally {
      setJobLoading(false);
    }
  };

  // =========================
  // Fetch User Applications
  // =========================

  const fetchUserApplication = async () => {
    if (!userToken) {
      setUserApplication([]);
      return;
    }

    setApplicationsLoading(true);

    try {
      const { data } = await axios.post(
        `${backendUrl}/user/get-user-applications`,
        {},
        {
          headers: {
            token: userToken,
          },
        }
      );

      if (data?.success) {
        setUserApplication(
          Array.isArray(data.jobApplications)
            ? data.jobApplications
            : []
        );
      } else {
        setUserApplication([]);

        toast.error(
          data?.message ||
            "دریافت درخواست‌های کاری انجام نشد"
        );
      }
    } catch (error) {
      console.error(
        "Fetch user applications error:",
        error
      );

      setUserApplication([]);

      toast.error(
        error?.response?.data?.message ||
          "دریافت درخواست‌های کاری انجام نشد"
      );
    } finally {
      setApplicationsLoading(false);
    }
  };

  // =========================
  // Initial Jobs
  // =========================

  useEffect(() => {
    fetchJobsData();
  }, []);

  // =========================
  // User Authentication
  // =========================

  useEffect(() => {
    if (userToken) {
      setIsLogin(true);
      fetchUserData();
      fetchUserApplication();
    } else {
      setIsLogin(false);
      setUserData(null);
      setUserApplication([]);
    }
  }, [userToken]);

  // =========================
  // Company Authentication
  // =========================

  useEffect(() => {
    if (companyToken) {
      setIsCompanyLogin(true);
      fetchCompanyData();
    } else {
      setIsCompanyLogin(false);
      setCompanyData(null);
    }
  }, [companyToken]);

  // =========================
  // Context Value
  // =========================

  const value = {
    // Search
    searchFilter,
    setSearchFilter,
    isSearched,
    setIsSearched,

    // Jobs
    jobs,
    setJobs,
    jobLoading,
    fetchJobsData,

    // Backend
    backendUrl,

    // User
    userToken,
    setUserToken,
    userData,
    setUserData,
    userDataLoading,
    isLogin,
    setIsLogin,
    fetchUserData,

    // Applications
    userApplication,
    setUserApplication,
    applicationsLoading,
    fetchUserApplication,

    // Company
    companyToken,
    setCompanyToken,
    companyData,
    setCompanyData,
    isCompanyLogin,
    setIsCompanyLogin,
    companyLoading,
    fetchCompanyData,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};