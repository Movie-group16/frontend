import { FaRegStar } from "react-icons/fa6";
import { FaRegStarHalfStroke } from "react-icons/fa6";
import { FaStar } from "react-icons/fa6";

const ratingToStars = (rating) => {
    const fullStars = Math.floor(rating / 2);
    const halfStar = rating % 2 >= 1 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;

    return (
        <div>
            {Array.from({ length: fullStars }).map((_, index) => (
                <FaStar key={`full-${index}`} />
            ))}
            {halfStar === 1 && <FaRegStarHalfStroke />}
            {Array.from({ length: emptyStars }).map((_, index) => (
                <FaRegStar key={`empty-${index}`} />
            ))}
        </div>
    )
}

export default ratingToStars