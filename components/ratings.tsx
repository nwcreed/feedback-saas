// components/ui/StarRating.tsx

import { Star as StarIcon } from 'lucide-react'; // Assurez-vous que Lucide est installé

interface StarRatingProps {
  rating: number;
  maxRating?: number; // Vous pouvez ajuster le nombre maximum d'étoiles
}

const StarRating = ({ rating, maxRating = 5 }: StarRatingProps) => {
  return (
    <div className="flex space-x-1">
      {[...Array(maxRating)].map((_, index) => (
        <StarIcon
          key={index}
          className={`h-5 w-5 ${
            index < rating ? 'text-primary' : 'text-gray-300'
          }`} // Les étoiles pleines et vides sont colorées
          fill={index < rating ? 'currentColor' : 'none'} // Remplit complètement l'étoile
        />
      ))}
    </div>
  );
};

export default StarRating;
