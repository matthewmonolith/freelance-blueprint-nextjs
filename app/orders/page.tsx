import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import SectionTitle from "@/components/global/SectionTitle";
import { fetchUserOrders } from "@/utils/actions";
import { formatCurrencyGBP, formatDate } from "@/utils/format";

async function OrdersPage() {
  const orders = await fetchUserOrders();

  return (
    <>
      <SectionTitle text="Your Orders" />
      <Table>
        <TableCaption>
          <div data-test="total-orders">Total Orders:{orders.length}</div>
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Products</TableHead>
            <TableHead>Order Total</TableHead>
            <TableHead>Tax</TableHead>
            <TableHead>Shipping</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => {
            const { id, products, orderTotal, tax, shipping, createdAt } =
              order;
            return (
              <TableRow key={id}>
                <TableCell>{products}</TableCell>
                <TableCell>{formatCurrencyGBP(orderTotal)}</TableCell>
                <TableCell>{formatCurrencyGBP(tax)}</TableCell>
                <TableCell>{formatCurrencyGBP(shipping)}</TableCell>
                <TableCell>{formatDate(createdAt)}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
}

export default OrdersPage;
