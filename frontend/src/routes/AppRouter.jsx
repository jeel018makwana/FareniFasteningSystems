import { BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import Dashboard from "@/pages/Dashboard";
import Login from "@/pages/Login";
import NotFound from "@/pages/Notfound";
import LoginPage from "@/features/auth/pages/LoginPage";
import ProtectedRoute from "./ProtectedRoute";
import CustomersPage from "@/features/customers/pages/CustomersPage";
import SuppliersPage from "@/features/suppliers/pages/SuppliersPage";
import ProductsPage from "@/features/products/pages/ProductsPage";
import InventoryPage from "@/features/inventory/pages/InventoryPage";
import SalesPage from "@/features/sales/pages/SalesPage";
import PurchasesPage from "@/features/purchases/pages/PurchasesPage";
import ReportsPage from "@/features/reports/pages/ReportsPage";
import PaymentsPage from "@/features/payments/pages/PaymentsPage";
export default function AppRouter() {
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }/>
                <Route path="/login" element={<LoginPage />}/>
                <Route path="*" element={<NotFound />}/>
                <Route path="/customers" element={<CustomersPage />} />
                <Route path="/suppliers" element={<SuppliersPage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/inventory" element={<InventoryPage />} />
                <Route path="/sales" element={<SalesPage />} />
                <Route path="/purchases" element={<PurchasesPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/payments" element={<PaymentsPage />} />
            </Routes>
        </BrowserRouter>
    );
}

