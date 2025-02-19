import { server } from "@/services/axiosInstance";
import React, {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from "react";

interface Tenant {
  id: number;
  fName: string;
  lName: string;
  tenantID: string;
  email: string;
  phone: string;
  apartment: number;
  created_at: string;
}

interface TenantContextType {
  tenant: Tenant | null;
  setTenant: React.Dispatch<React.SetStateAction<Tenant | null>>;
  logout: () => void;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const TenantProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [tenant, setTenant] = useState<Tenant | null>(null);

  useEffect(() => {
    const fetchTenant = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await server.get("/tenants/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setTenant(res.data);
      } catch (error) {
        console.error("Failed to fetch tenant:", error);
        localStorage.removeItem("token");
        setTenant(null);
      }
    };

    fetchTenant();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setTenant(null);
  };

  return (
    <TenantContext.Provider value={{ tenant, setTenant, logout }}>
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = (): TenantContextType => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error("useTenant must be used within a TenantProvider");
  }

  return context;
};
