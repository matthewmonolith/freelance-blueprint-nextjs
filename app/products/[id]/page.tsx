import BreadCrumbs from "@/components/single-product/BreadCrumbs";
import { fetchSingleProduct } from "@/utils/actions";
import Image from "next/image";
import { formatCurrencyGBP } from "@/utils/format";
import FavouriteToggleButton from "@/components/products/FavouriteToggleButton";
import AddToCart from "@/components/single-product/AddToCart";
import ProductRating from "@/components/single-product/ProductRating";

async function SingleProductPage({ params }: { params: { id: string } }) {
  const product = await fetchSingleProduct(params.id);
  const { name, image, company, description, price } = product;
  const gbpAmount = formatCurrencyGBP(price);
  return <section>
    <BreadCrumbs name={name} />
    <div className="mt-6 grid gap-y-8 lg:grid-cols-2 lg:gap-x-16">
        <div className="relative h-full">
            <Image src={image} alt={name} fill sizes='(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw' priority className="w-full rounded object-cover" />
        </div>
        <div>
            <div className="flex gap-x-8 items-center">
                <h1 className="text-3xl font-bold"></h1>
            </div>
        </div>
    </div>
  </section>;
}
export default SingleProductPage;