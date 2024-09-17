import { FaStar } from "react-icons/fa";

function ProductRating({ productId }: { productId: string }) {
  const rating = 4.2; //temp values for now
  const count = 25;

  const className = `flex gap-1 items-center text-md mt-1 mb-4`;
  const countVal = `(${count}) reviews`;
  return (
    <span className={className}>
      <FaStar className="w-3 h-3" />
      {rating} {countVal}
    </span>
  );
}
export default ProductRating;
