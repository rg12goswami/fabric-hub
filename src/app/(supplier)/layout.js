import SupplierNavbar from "@/components/layout/SupplierNavbar";

export default function SupplierLayout({ children }) {
  return (
    <div>
      <SupplierNavbar />
      {children}
    </div>
  );
}
