import BuyerNavbar from "@/components/layout/BuyerNavbar";

export default function BuyerLayout({ children }) {
  return (
    <div>
      <BuyerNavbar />
      {children}
    </div>
  );
}
